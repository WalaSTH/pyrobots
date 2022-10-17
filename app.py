from fastapi import FastAPI, HTTPException, status
from Database.Database import *
from fastapi.middleware.cors import CORSMiddleware

from pydantic_models import *
#from fastapi.responses import FileResponse
#from fastapi import Depends
#from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
#from segurity_functions import  *
#from pydantic_models import *

origins = ["http://localhost:3000", "localhost:3000", "http://localhost:3000/", "localhost:3000/"]

#tags_metadata = [{"name": "users", "description": "Operations with users"}]

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
def robot_create(temp_robot: TempRobot):
    if (temp_robot.creator > check_user_quantity() or temp_robot.creator < 1):
        raise HTTPException (
            status_code= status.HTTP_404_NOT_FOUND,
            detail="There is no user with such ID."
        )
    if (temp_robot.avatar == None):
        temp_robot.avatar = ''
    create_robot(temp_robot.robot_name, temp_robot.code, temp_robot.avatar, temp_robot.creator)
    return{"detail":"Robot created succesfully."}