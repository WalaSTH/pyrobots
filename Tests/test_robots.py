from fastapi import File, UploadFile
from fastapi.testclient import TestClient
from Database.Database import *
from starlette.middleware.cors import CORSMiddleware
from app import app
from auxiliar_functions import *
import random
import string


client = TestClient(app)

# Creating Robot no avatar

def test_create_robot():
    new_robot_upl = {
        "robot_name": (get_random_string_lower(5)),
        "creator": 1
    }
    code = open("Tests/files/dummybot.py", "rb")
    response = client.post("/robot/create", params = new_robot_upl, files={"code":code})
    assert response.status_code == 200
    assert response.json() == {"detail": "Robot created succesfully."}


# Creating Robot with avatar

def test_create_robot_avatar():
    new_robot_upl = {
        "robot_name": (get_random_string_lower(5)),
        "creator": 1
    }
    code = open("Tests/files/dummybot.py", "rb")
    avatar = open("Tests/files/image.jpg", "rb")
    response = client.post("/robot/create", params = new_robot_upl, files={"code":code, "avatar":avatar})
    assert response.status_code == 200
    assert response.json() == {"detail": "Robot created succesfully."}

# Creating Robot with invalid user id

def test_create_robot_invalid_id():
    new_robot_upl_invalid_id = {
        "robot_name": (get_random_string_lower(5)),
        "creator": (get_rand_negative())
    }
    code = open("Tests/files/dummybot.py", "rb")
    response = client.post("/robot/create", params = new_robot_upl_invalid_id, files={"code":code})
    assert response.status_code == 404
    assert response.json() == {"detail": "There is no user with such ID."}

# Creating a robot with invalid name

def test_create_robt_inv_name():
    new_robot_upl_inv_name = {
        "robot_name": (get_random_string_special()),
        "creator": 1
    }
    code = open("Tests/files/dummybot.py", "rb")
    response = client.post("/robot/create", params = new_robot_upl_inv_name, files={"code":code})
    assert response.status_code == 400
    assert response.json() == {"detail": "Invalid robot name."}