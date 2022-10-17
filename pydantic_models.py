from pydantic import BaseModel, EmailStr
from typing import List, Optional
class UserTemp(BaseModel):
    username: str
    password: str
    email: EmailStr
    photo: Optional[str] = None


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class User(BaseModel):
    username: str
    email: Optional[str] = None
    photo: Optional[str] = None