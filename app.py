from fastapi import FastAPI, HTTPException, status, File, UploadFile, Depends
from Database.Database import *
from fastapi.middleware.cors import CORSMiddleware
from pydantic_models import TempRobot
from typing import Union
from typing import Optional

origins = ["http://localhost:3000", "localhost:3000", "http://localhost:3000/", "localhost:3000/"]

tags_metadata = [{"name": "Robots", "description": "Manage Robot"}]

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

@app.post("/robot/create", tags=["Robots"], status_code = 200)
async def robot_upload(temp_robot: TempRobot = Depends()):
    if not (temp_robot.robot_name.replace(' ','').isalnum()):
        raise HTTPException (
            status_code = status.HTTP_400_BAD_REQUEST,
            detail="Invalid robot name."
        )
    if (temp_robot.creator > check_user_quantity() or temp_robot.creator < 1):
        raise HTTPException (
            status_code = status.HTTP_404_NOT_FOUND,
            detail="There is no user with such ID."
        )
    create_robot(temp_robot.robot_name, temp_robot.creator, temp_robot.code, temp_robot.avatar)
    return{"detail":"Robot created succesfully."}
    