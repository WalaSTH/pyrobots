from pydantic import BaseModel, EmailStr
from typing import List, Optional, Union

class TempMatch(BaseModel):
    name: str
    min_players: int
    max_players: int
    gamesPerMatch: int
    rounds: int
    robot_id: int
    creator: int
    password: Union[str, None] = None