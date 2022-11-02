from Database.Database import *
from pydantic_models import *
from fastapi import Depends, FastAPI, HTTPException, status, BackgroundTasks, UploadFile, File, Form
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from typing import Optional
from datetime import date, datetime, timedelta
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from starlette.requests import Request
import re

# to get a string like this run:
# openssl rand -hex 321
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
VALIDATE_TOKEN_EXPIRE_MINUTES = 120

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

conf = ConnectionConfig(
    MAIL_USERNAME="sheremaiantest@outlook.com",
    MAIL_PASSWORD="chetisidad123",
    MAIL_FROM="sheremaiantest@outlook.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp-mail.outlook.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
)

def get_message(email: EmailSchema, html):
    message = MessageSchema(
        subject="Email verification - no reply",
        recipients=email.dict().get("email"),  # List of recipients, as many as you can pass
        body=html,
        subtype="html"
    )

    return message

def generate_html(user: str, validate_token: str):
    html = """
    <html>
    <body>
    <p>Hi! """ + user + """ Thanks for registering in pyrobots!</p>
    <img src="https://i.pinimg.com/222x/45/c9/e7/45c9e77359ab33552eb1fafcd731205a.jpg" width="100" height="200">
    <br>Please follow the next link to verify your account!
    <br>http://localhost:8000/validate/""" + validate_token + """</p>
    </body>
    </html>
    """
    return html
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def authenticate_user(username, password):
    user = get_user(username)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(token_data.username)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if not current_user.verified:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user