from typing import List, Optional, Union

from pydantic import BaseModel, EmailStr

MIN_PLAYERS_PER_MATCH = 2
MAX_PLAYERS_PER_MATCH = 4
MAX_ROUNDS_PER_GAME = 10000
MAX_GAMES_PER_MATCH = 200



class Token(BaseModel):
    access_token: str
    token_type: str
    username: str
    id: int
    avatar: Optional[str]


class TokenData(BaseModel):
    username: Optional[str] = None


class ValidationData(BaseModel):
    token: str


class ResendValidationEmail(BaseModel):
    username: str


class User(BaseModel):
    username: str
    email: Optional[str] = None


class ResetData(BaseModel):
    token: str
    password: str


class RecoverData(BaseModel):
    email: EmailStr
    type: Optional[str]


class TempMatch(BaseModel):
    name: str
    min_players: int
    max_players: int
    games_per_match: int
    rounds: int
    robot_id: int
    creator: int
    password: Union[str, None] = None


class RobotOwner(BaseModel):
    user_name: str
    detailed: bool


class MatchListParams(BaseModel):
    name: str
    filter: str



class Robot(BaseModel):
    robot_name: str
    creator: str
    position_x: int = None
    position_y: int = None


class SimData(BaseModel):
    username: str
    n_rounds: int
    robot_names: List[str]


class JoiningMatch(BaseModel):
    username: str
    robot: str
    match: int
    password: Optional[str]


class LeavingMatch(BaseModel):
    username: str
    match: int

class StartingMatch(BaseModel):
    match_id: int
    username: str
    syscalls:Optional[bool] = True

class ChosenMatch(BaseModel):
    match_id: int
    username: str

class UpdateParams(BaseModel):
    username: str
    param: str
    new_pic: Union[str, None] = None
    new_pwd: Union[str, None] = None
    current_pwd: Union[str, None] = None
