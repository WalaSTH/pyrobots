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
from typing import Union, Optional
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from field_validations import create_match_field_validation
from security_functions import *
from pydantic_models import *
from connections import *
import json
from random import *
from game_loop import *

MAX_LEN_ALIAS = 16
MIN_LEN_ALIAS = 3
MAX_LEN_PASSWORD = 16
MIN_LEN_PASSWORD = 7
MAX_LEN_EMAIL = 30
MIN_LEN_EMAIL = 10
MAX_LEN_NAME_GAME = 10
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

    if check_user_connected(match_to_join.match, match_to_join.username) != []:
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

    if not check_user_connected(match_to_leave.match, match_to_leave.username) != []:
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


# --- User Endpoints ---
@app.post("/user/signup", tags=["Users"], status_code=200)
async def user_register(
    username: str = Form(),
    password: str = Form(),
    email: str = Form(),
    avatar: Optional[str] = Form(None),
):
    """USER REGISTER FUNCTION"""

    invalid_fields = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="field size is invalid"
    )
    if (
        len(username) > MAX_LEN_ALIAS
        or len(username) < MIN_LEN_ALIAS
        or len(password) > MAX_LEN_PASSWORD
        or len(password) <= MIN_LEN_PASSWORD
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
        return {"detail": "User created successfully"}


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


@app.delete("/user/delete_user", tags=["Users"])
async def user_delete(user_name: str):
    """Deletes an user.
    Args: \n
        user_name (str): Name of the user to delete. \n
    Raises: \n
        HTTPException: The user does not exist. \n
    Returns: \n
        str: Verification text.
    """
    if not user_exists(user_name):
        raise HTTPException(status_code=404, detail="user doesn't exist")

    else:
        delete_user(user_name)
        return {"user successfully deleted"}


# login
@app.post("/token", tags=["Token"], response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.user_name}, expires_delta=access_token_expires
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


@app.get("/user/me/")
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return {"username": current_user.user_name}


@app.get("/user/me/items/")
async def read_own_items(current_user: User = Depends(get_current_active_user)):
    return [{"item_id": "Foo", "owner": current_user.user_name}]


@app.get("/users/stats", tags=["Users"], status_code=200)
async def get_user_stats(checked_user: str):
    if not user_exists(checked_user):
        raise HTTPException(status_code=404, detail=f"Username {checked_user} does not exist.")

    user_stats = calculate_user_stats(checked_user)

    return{"detail": "Stats succesfully checked", "stats": user_stats}


# --- Simulation Endpoints ---

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
    return run_simulation(sim)
