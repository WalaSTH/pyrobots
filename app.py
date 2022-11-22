from fastapi import (
    FastAPI,
    HTTPException,
    status,
    File,
    UploadFile,
    Depends,
    Form,
    WebSocketDisconnect,
)
from Database.Database import *
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from fastapi.security import OAuth2PasswordRequestForm
from field_validations import create_match_field_validation
from utils.auth import *
from jose import JWTError
from pydantic_models import *
from connections import WebSocket, ConnectionManager
from random import randint
from utils.mails import send_verification_email
from game_loop import *
from utils.mails import RecoverType, send_recovery_email
MAX_LEN_ALIAS = 16
MIN_LEN_ALIAS = 3
MAX_LEN_PASSWORD = 69
MIN_LEN_PASSWORD = 8
MAX_LEN_EMAIL = 69
MIN_LEN_EMAIL = 10
MAX_LEN_NAME_GAME = 20
MIN_LEN_NAME_GAME = 3

description = """
    PyRobots 🤖

    This is a game where you can create your own robot and fight against other robots.

    ## The FUN is guaranteed! 🎉

    ## Functionalities 🛠

    * Create a match
    * Create a new user
    * Create a robot
    * Login
    * Upload a photo
    """

origins = [
    "http://localhost:3000",
    "localhost:3000",
    "http://localhost:3000/",
    "localhost:3000/",
]

tags_metadata = [
    {"name": "Users", "description": "Operations with users"},
    {"name": "Token", "description": "Token login"},
    {"name": "matches", "description": "Operations with matches"},
    {"name": "Robots", "description": "Manage Robot"},
    {"name": "Recovery", "description": "Email service to recover password and username"}
]

app = FastAPI(
    title="PyRobots",
    description=description,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

manager = ConnectionManager()

# --- WebSocket Endpoints ---
@app.websocket("/ws/{match_id}")
async def websocket_endpoint(websocket: WebSocket, match_id: int):
    await manager.connect(websocket, match_id)

    try:
        while True:
            data = {
                "message_type": 1,
                "message_content": (get_match_info(match_id))
            } if check_match_existance(match_id) else {
                "message_type": 3,
                "message_content": f"Match {match_id} doesn't exist"
            }
            await manager.broadcast(data, match_id)
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, match_id)


# --- Robot Endpoints ---
@app.post("/robot/create", tags=["Robots"], status_code=200)
async def robot_upload(
    robot_name: str = Form(),
    creator: int = Form(),
    code: UploadFile = File(),
    avatar: Optional[str] = Form(None),
):
    if not check_user_existance(creator):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="There is no user with such ID.",
        )

    user_name = get_user_name_by_id(creator)
    if not (robot_name.replace(" ", "").isalnum()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid robot name."
        )

    if robot_exists(robot_name, creator):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"You already own a robot with name {robot_name}.",
        )
    create_robot(robot_name, creator, code, avatar)
    return {"detail": "Robot created succesfully."}


@app.get("/robot/list", tags=["Robots"], status_code=200)
async def robot_listing(robot_owner: RobotOwner = Depends()):
    if not (user_exists(robot_owner.user_name)):
        raise HTTPException(status_code=404, detail="No user with such ID")

    res_list = get_robot_list(robot_owner.user_name, robot_owner.detailed)

    if res_list == []:
        raise HTTPException(status_code=404, detail="No Robots available")

    return {"Robots": res_list}


@app.get("/robot/robot_position", tags=["Robots"], status_code=200)
async def robot_position(robot_position: Robot = Depends()):
    id_user = get_user_id(robot_position.creator)
    id_robot = get_id_robot(robot_position.robot_name, id_user)
    if id_robot == None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Robot not found."
        )
    else:
        robot_position.position_x = randint(0, 1000)
        robot_position.position_y = randint(0, 1000)
    return {
        "position_x": robot_position.position_x,
        "position_y": robot_position.position_y,
    }


# --- Match endpoints ---
@app.post("/match/create", tags=["Matches"], status_code=200)
def match_creation(match_data: TempMatch):

    if  not check_robot_existance(match_data.robot_id):
        raise HTTPException(status_code=404, detail="No robot with such ID")

    if not check_user_existance(match_data.creator):
        raise HTTPException(status_code=404, detail="No user with such ID")

    if match_data.password == None:
        match_data.password = ""

    if check_robot_ownership(match_data.robot_id, match_data.creator):
        raise HTTPException(
            status_code=409,
            detail=f"Robot {match_data.robot_id} does not belong to you",
        )

    if check_match_name_exists(match_data.name):
        raise HTTPException(
            status_code=409, detail="A match with this name already exists"
        )

    if not create_match_field_validation(match_data):
        raise HTTPException(status_code=409, detail="One or more fields are not valid")

    match_id = create_match(
        match_data.name,
        match_data.password,
        match_data.games_per_match,
        match_data.rounds,
        match_data.min_players,
        match_data.max_players,
        match_data.creator,
        match_data.robot_id,
    )

    return {"detail": "Match created successfully", "id": match_id}

@app.post("/match/join", tags=["Matches"], status_code=200)
async def match_join(
    match_to_join: JoiningMatch
):

    if not check_match_existance(match_to_join.match):
        raise HTTPException(status_code=404, detail=f"Match id {match_to_join.match} does not exist")

    if not user_exists(match_to_join.username):
        raise HTTPException(status_code=404, detail=f"User {match_to_join.username} is not a user")

    user_id = get_user_id(match_to_join.username)
    robot_id = get_id_robot(match_to_join.robot, user_id)

    if robot_id == None:
        raise HTTPException(status_code=404, detail=f"Robot {match_to_join.robot} does not exist or does not belong to you")

    if check_user_connected(match_to_join.match, match_to_join.username):
        raise HTTPException(status_code=409, detail="You have already joined this match")

    if check_full_match(match_to_join.match):
        raise HTTPException(status_code=409, detail="The match you tried joining is already full")

    if not check_match_password(match_to_join.match, match_to_join.password):
        raise HTTPException(status_code=401, detail="Incorrect password")

    join_match(match_to_join.match, user_id, robot_id)

    join_alert = {
        "message_type": 2,
        "message_content": f"User {match_to_join.username} has joined the battle"
    }

    await manager.broadcast(join_alert, match_to_join.match)
    data = {
        "message_type": 1,
        "message_content": (get_match_info(match_to_join.match))
    }
    await manager.broadcast(data, match_to_join.match)

    return {"detail": "You have succesfully joined the match"}


@app.post("/match/leave", tags=["Matches"], status_code=200)
async def match_leave(
    match_to_leave: LeavingMatch
):

    if not check_match_existance(match_to_leave.match):
        raise HTTPException(status_code=404, detail=f"Match id {match_to_leave.match} does not exist")

    if not check_user_connected(match_to_leave.match, match_to_leave.username):
        raise HTTPException(status_code=409, detail="You are not part of this match")

    user_id = get_user_id(match_to_leave.username)

    if not leave_match(match_to_leave.match, user_id):
        raise HTTPException(status_code=401, detail="You can't leave, YOU ARE THE OWNER!")

    leave_alert = {
        "message_type": 2,
        "message_content": f"User {match_to_leave.username} has left the battle"
    }

    await manager.broadcast(leave_alert, match_to_leave.match)
    data = {
        "message_type": 1,
        "message_content": (get_match_info(match_to_leave.match))
    }
    await manager.broadcast(data, match_to_leave.match)

    return {"detail": "You have succesfully left the match"}


@app.get("/match/list", tags=["Matches"], status_code=200)
async def match_listing(list_params: MatchListParams = Depends()):
    res_list = get_match_list(list_params.name, list_params.filter)

    if res_list == ["no_valid_filter"]:
        raise HTTPException(
            status_code=404, detail=f"Filter {list_params.filter} is not a valid filter"
        )

    return {"Matches": res_list}

# --- Result Endpoints ---
@app.get("/match/result", tags=["Results"], status_code=200)
async def get_results(info: ChosenMatch = Depends()):
    if not check_match_existance(info.match_id):
        raise HTTPException(status_code=404, detail=f"Match id {info.match_id} does not exist")

    if not user_exists(info.username):
        raise HTTPException(status_code=404, detail=f"User {info.username} is not a user")

    if not check_user_connected(info.match_id, info.username):
        raise HTTPException(status_code=409, detail="You were not part of this match")

    return{"detail": "Results succesfully retrieved.", "data": get_match_results(info.match_id)}

# --- User Endpoints ---
# Register
@app.post("/user/signup", tags=["Users"], status_code=200)
async def user_register(
    username: str = Form(),
    password: str = Form(),
    email: str = Form(),
    avatar: Optional[str] = Form(None),
):
    """USER REGISTER FUNCTION"""

    invalid_fields = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid field size"
    )
    if (
        len(username) > MAX_LEN_ALIAS
        or len(username) < MIN_LEN_ALIAS
        or len(password) > MAX_LEN_PASSWORD
        or len(password) < MIN_LEN_PASSWORD
        or len(email) > MAX_LEN_EMAIL
        or len(email) < MIN_LEN_EMAIL
    ):
        raise invalid_fields
    elif (
        any(char.isupper() for char in password) == False
        or any(char.islower() for char in password) == False
        or any(char.isdigit() for char in password) == False
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="password must have at least one uppercase, one lowercase and one number",
        )
    elif email_exists(email):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="A user with this email already exists",
        )
    elif user_exists(username):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="existing username"
        )
    else:
        create_user(username, email, get_password_hash(password), avatar)
        new_id = get_last_user_id()
        create_robot("Spinner Cheto", new_id, "default_bots/spinner_Cheto.py", None)
        create_robot("Sniper Cheto", new_id, "default_bots/sniper_Cheto.py", None)

        token_expiration = timedelta(minutes=VALIDATE_TOKEN_EXPIRE_MINUTES)
        token = generate_token(data={"username": username}, expires_delta=token_expiration)

        await send_verification_email(email, username, token)

        return {"detail": "User created successfully"}


# Resend validation email
@app.post("/resend_validation", tags=["Validation"], status_code=200)
async def resend_email(resend: ResendValidationEmail):
    user = get_user(resend.username)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid username"
        )

    token_expiration = timedelta(minutes=VALIDATE_TOKEN_EXPIRE_MINUTES)
    token = generate_token(data={"username": resend.username}, expires_delta=token_expiration)

    await send_verification_email(user.email, resend.username , token)

    return {"detail": "Verification email sent"}


# Validate Account
@app.post("/validate_account", tags=["Validation"], status_code=200)
async def validate_account(validation: ValidationData):
    try:
        payload = jwt.decode(validation.token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Link expired"
        )

    username = payload.get("username")
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Username can't be empty"
        )

    user = get_user(username)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not registered"
        )
    else:
        set_user_verified(username)

    return {"detail": f"Account {username} validated"}


# Upload image
@app.post("/user/upload_photo", tags=["Users"], status_code=200)
async def upload_photo(
    user: User = Depends(), photo: str = Form(decription="Upload a photo")
):
    """UPLOAD PHOTO FUNCTION"""
    if not user_exists(user.username):
        raise HTTPException(status_code=401, detail="user does not exist")
    else:
        upload_photo_db(user.username, photo)
        return {"detail": "Photo uploaded successfully"}


# login
@app.post("/token", tags=["Token"], response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"message": "Incorrect username or password"},
            headers={"WWW-Authenticate": "Bearer"},
        )
    elif not user.verified:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"message": "This account is not verified", "email": user.email},
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = generate_token(
        data={"username": user.user_name}, expires_delta=access_token_expires
    )

    avatar = None
    if user.photo is not None:
        avatar = user.photo.decode()

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": user.user_name,
        "id": user.id,
        "avatar": avatar,
    }

# Recovery mail
@app.post("/user/recover", tags=["Recovery"], status_code=200)
async def recovery_mail(recover: RecoverData):
    try:
        recover_type = RecoverType(recover.type)
    except ValueError as e:
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )

    user = get_user_by_email(recover.email)

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="There is no user with this email"
        )

    token_expiration = timedelta(minutes=RESET_PASSWORD_TOKEN_EXPIRE_MINUTES)
    token = generate_token(data={"username": user.user_name}, expires_delta=token_expiration)

    await send_recovery_email(recover.email, user, recover_type, token)

    return {"detail": "Email has been sent"}


# Reset password
@app.put("/user/reset_password", tags=["Recovery"], status_code=200)
async def reset_password(reset: ResetData):
    if (
        len(reset.password) < 8
        or any(char.isupper() for char in reset.password) == False
        or any(char.islower() for char in reset.password) == False
        or any(char.isdigit() for char in reset.password) == False
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="password must have at least one uppercase, one lowercase and one number"
        )

    try:
        payload = jwt.decode(reset.token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Link expired"
        )

    username = payload.get("username")

    if username is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail= "Username can't be empty"
        )

    user = get_user(username)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not registered"
        )
    else:
        update_user_password(user.user_name, get_password_hash(reset.password))

    return {"detail": "Password updated"}

# Check if token is expired
@app.get("/token/status", tags=["Token"], status_code=200)
async def get_token_status(token: str):
    try:
        jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired"
        )
    return {"detail": "Token is not expired"}


# Modify user
@app.put("/user/update", tags=["Users"], status_code=200)
async def modify_logged_user(update_info: UpdateParams):

    if not user_exists(update_info.username):
        raise HTTPException(status_code=404, detail=f"No user named {update_info.username}.")

    if update_info.param != "avatar" and update_info.param != "password":
        raise HTTPException(status_code=400, detail=f"Param {update_info.param} does not exist.")

    match update_info.param:
        case "password":
            user = authenticate_user(update_info.username, update_info.current_pwd)
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="That is not your current password."
                )

            if (
                any(char.isupper() for char in update_info.new_pwd) == False
                or any(char.islower() for char in update_info.new_pwd) == False
                or any(char.isdigit() for char in update_info.new_pwd) == False
            ):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Password must have at least one uppercase, one lowercase and one number."
                )
            update_user_password(update_info.username, get_password_hash(update_info.new_pwd))

            return {"detail": "Password updated succesfully."}

        case "avatar":
            avatar = update_user_avatar(update_info.username, update_info.new_pic)
            return {"detail": "User updated succesfully.", "new_avatar": avatar}


@app.get("/users/stats", tags=["Users"], status_code=200)
async def get_user_stats(checked_user: str):
    if not user_exists(checked_user):
        raise HTTPException(status_code=404, detail=f"Username {checked_user} does not exist.")

    user_stats = calculate_user_stats(checked_user)

    return{"detail": "Stats succesfully checked", "stats": user_stats}


# --- Start Simulation and Match ---

@app.post("/simulation/start", tags=["simulation"], status_code=200)
async def create_sim(sim: SimData):
    # do some validation checks
    if sim.n_rounds < 1 or sim.n_rounds > 10000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect number of rounds.",
        )
    if not user_exists(sim.username):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User doesn't exist."
        )
    if len(sim.robot_names) < 2 or len(sim.robot_names) > 4:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Minimum amount of robots is 2 and maximum is 4.",
        )
    for i in range(len(sim.robot_names)):
        if not user_has_robot(sim.username, sim.robot_names[i]):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User does not have any robot named "
                + str(sim.robot_names[i] + "."),
            )
    robots = []
    for i in sim.robot_names:
        robots.append(get_robot_id_by_name(sim.username, i))
    return run_game(robots, sim.n_rounds, True)

@app.post("/match/start",tags=["Matches"], status_code=200)
async def start_match(match_id: int, username: str, syscalls:Optional[bool] = True):
    if not check_match_existance(match_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Match not found.")
    if not user_exists(username):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.")
    if not (get_match_creator(match_id) == get_user_id(username)):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User did not create the match.")
    robots = get_match_robots_ids(match_id)
    if len(robots) > get_match_max_players(match_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Number of players is higher than maximum allowed.")
    if len(robots) < get_match_min_players(match_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Number of players is lower than minimum allowed.")
    if get_match_started(match_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Match already started.")
    #Run
    run_match(match_id, syscalls)

    start_alert = {
        "message_type": 4,
        "message_content": "THE BATTLE HAS BEGUN!"
    }

    await manager.broadcast(start_alert, match_id)

    return {"detail" : "Match successfully executed."}