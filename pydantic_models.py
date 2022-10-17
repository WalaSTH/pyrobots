from pydantic import BaseModel
from typing import  Union

MIN_PLAYERS_PER_MATCH = 2
MAX_PLAYERS_PER_MATCH = 4
MAX_ROUNDS_PER_GAME = 10000
MAX_GAMES_PER_MATCH = 200

class TempMatch(BaseModel):
    name: str
    min_players: int
    max_players: int
    games_per_match: int
    rounds: int
    robot_id: int
    creator: int
    password: Union[str, None] = None