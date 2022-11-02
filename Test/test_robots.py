from base64 import b64encode
from fastapi import File, UploadFile
from fastapi.testclient import TestClient
from Database.Database import *
from starlette.middleware.cors import CORSMiddleware
from app import app
from Test.auxiliar_functions import *
import random
import string


client = TestClient(app)

# Creating Robot no avatar

if not user_exists("user_test1"):
    user1 = create_user(user_name="user_test1", password="password", email="test1@test.com", avatar=None)

user_id = get_user_id("user_test1")

def test_create_robot():
    new_robot_upl = {
        "robot_name": (get_random_string_lower(5)),
        "creator": user_id,
        "avatar": None,
    }
    code = open("Test/files/dummybot.py", "rb")
    response = client.post("/robot/create", data=new_robot_upl, files={"code":code})
    assert response.status_code == 200
    assert response.json() == {"detail": "Robot created succesfully."}


# Creating Robot with avatar

def test_create_robot_avatar():
    avatar = b64encode(open("Test/files/image.jpg", "rb").read())
    new_robot_upl = {
        "robot_name": (get_random_string_lower(5)),
        "creator": user_id,
        "avatar": avatar,
    }
    code = open("Test/files/dummybot.py", "rb")
    response = client.post("/robot/create", data=new_robot_upl, files={"code":code})
    assert response.status_code == 200
    assert response.json() == {"detail": "Robot created succesfully."}

# Creating Robot with invalid user id

def test_create_robot_invalid_id():
    new_robot_upl_invalid_id = {
        "robot_name": (get_random_string_lower(5)),
        "creator": (get_rand_negative())
    }
    code = open("Test/files/dummybot.py", "rb")
    response = client.post("/robot/create", data=new_robot_upl_invalid_id, files={"code":code})
    assert response.status_code == 400
    assert response.json() == {"detail": "Invalid user ID"}

# Creating a robot with invalid name

def test_create_robot_invalid_name():
    new_robot_upl_inv_name = {
        "robot_name": (get_random_string_special()),
        "creator": user_id,
        "avatar": None,
    }
    code = open("Test/files/dummybot.py", "rb")
    response = client.post("/robot/create", data=new_robot_upl_inv_name, files={"code":code})
    assert response.status_code == 400
    assert response.json() == {"detail": "Invalid robot name."}

