from fastapi import FastAPI
from Database.Database import *
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from segurity_functions import  *
from pydantic_models import *
MAX_LEN_ALIAS = 9
MIN_LEN_ALIAS = 3
MAX_LEN_PASSWORD = 16
MIN_LEN_PASSWORD = 8
MAX_LEN_EMAIL = 30
MIN_LEN_EMAIL = 10
MAX_LEN_NAME_GAME = 10
MIN_LEN_NAME_GAME = 3


origins = ["http://localhost:3000", "localhost:3000", "http://localhost:3000/", "localhost:3000/"]

tags_metadata = [{"name": "users", "description": "Operations with users"}]

app = FastAPI(
    title = "PyRobots"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#registro de usuario
@app.post("/user/signup", tags=["users"], status_code=201)
async def user_register(user_to_reg: UserTemp):
    invalid_fields = HTTPException(
        status_code=404,
        detail="field size is invalid"
    )
    if len(user_to_reg.username) > MAX_LEN_ALIAS or \
            len(user_to_reg.username) < MIN_LEN_ALIAS or \
            len(user_to_reg.password) > MAX_LEN_PASSWORD or \
            len(user_to_reg.password) < MIN_LEN_PASSWORD or \
            any(char.isupper() for char in user_to_reg.password) == False or \
            any(char.islower() for char in user_to_reg.password) == False or \
            any(char.isdigit() for char in user_to_reg.password) == False or \
            len(user_to_reg.email) > MAX_LEN_EMAIL or \
            len(user_to_reg.email) < MIN_LEN_EMAIL :
        raise invalid_fields
    elif email_exists(user_to_reg.email):
        raise HTTPException(
            status_code=404,
            detail="existing user"
        )
    else:
        create_user(user_to_reg.username, user_to_reg.email, get_password_hash(user_to_reg.password))
        return {"email": user_to_reg.email}

#login
@app.post("/token", response_model=Token)
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


@app.get("/users/me/")
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return {"username": current_user.user_name}


@app.get("/users/me/items/")
async def read_own_items(current_user: User = Depends(get_current_active_user)):
    return [{"item_id": "Foo", "owner": current_user.user_name}]