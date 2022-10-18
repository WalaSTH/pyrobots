from pydantic import BaseModel
from typing import  Union
from fastapi import FastAPI, HTTPException, UploadFile
from typing import Optional

class TempRobot(BaseModel):
    robot_name: str
    creator: int
    code: UploadFile = None
    avatar: Union[UploadFile, None] = None
