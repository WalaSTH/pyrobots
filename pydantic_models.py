from pydantic import BaseModel
from typing import  Union

class TempRobot(BaseModel):
    robot_name: str
    code: str
    avatar: Union[str, None] = None
    creator: int