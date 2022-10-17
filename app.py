from fastapi import FastAPI
from Database.Database import *
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi import Depends, HTTPException, status, File, UploadFile
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from segurity_functions import *
from pydantic_models import *
MAX_LEN_ALIAS = 9
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
    
    * Create a new user
    * Login
    * Upload a photo
    """
origins = ["http://localhost:3000", "localhost:3000", "http://localhost:3000/", "localhost:3000/"]

tags_metadata = [{"name": "Users", "description": "Operations with users"},
                 {"name": "Token", "description": "Token login"},]

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

#registro de usuario
@app.post("/user/signup", tags=["Users"],status_code=200)
async def user_register(user_to_reg: UserTemp = Depends()):
    """USER REGISTER FUNCTION"""

    invalid_fields = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="field size is invalid"
    )
    if len(user_to_reg.username) > MAX_LEN_ALIAS or \
            len(user_to_reg.username) < MIN_LEN_ALIAS or \
            len(user_to_reg.password) > MAX_LEN_PASSWORD or \
            len(user_to_reg.password) <= MIN_LEN_PASSWORD or \
            len(user_to_reg.email) > MAX_LEN_EMAIL or \
            len(user_to_reg.email) < MIN_LEN_EMAIL :
        raise invalid_fields
    elif any(char.isupper() for char in user_to_reg.password) == False or \
            any(char.islower() for char in user_to_reg.password) == False or \
            any(char.isdigit() for char in user_to_reg.password) == False  :
        raise HTTPException(
            status_code= status.HTTP_401_UNAUTHORIZED,
            detail="password must have at least one uppercase, one lowercase and one number"
        )
    elif email_exists(user_to_reg.email):
        raise HTTPException(
            status_code= status.HTTP_401_UNAUTHORIZED,
            detail="existing user"
        )
    elif user_exists(user_to_reg.username):
        raise HTTPException(
            status_code= status.HTTP_401_UNAUTHORIZED,
            detail="existing username"
        )

    else:
        create_user(user_to_reg.username, user_to_reg.email, get_password_hash(user_to_reg.password))
        return {"detail": "User created successfully"}


#Upload image
@app.post("/user/upload_photo", tags=["Users"], status_code=200)
async def upload_photo(user: User = Depends(), photo: UploadFile = File(decription="Upload a photo")):
    """UPLOAD PHOTO FUNCTION"""
    if not user_exists(user.username):
        raise HTTPException(
            status_code=401,
            detail="user does not exist"
        )
    else:
        upload_photo_db(user.username, photo.file.read())
        return {"detail": photo.filename + " uploaded successfully"}


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


#login
@app.post("/token",tags=["Token"], response_model=Token)
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
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/user/me/")
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return {"username": current_user.user_name}


@app.get("/user/me/items/")
async def read_own_items(current_user: User = Depends(get_current_active_user)):
    return [{"item_id": "Foo", "owner": current_user.user_name}]