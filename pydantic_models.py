from pydantic import BaseModel
from typing import  Union

class TempMatch(BaseModel):
    name: str
    min_players: int
    max_players: int
    games_per_match: int
    rounds: int
    robot_id: int
    creator: int
    password: Union[str, None] = None