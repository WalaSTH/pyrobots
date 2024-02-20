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

user_to_reg = {
    "username": "TestinSim",
    "password": "Password1",
    "email": (get_email()),
    "avatar": None,
    }
user = client.post("/user/signup", data=user_to_reg)
assert user.status_code == 200
id = get_last_user_id()

avatar = b64encode(open("Test/files/image.jpg", "rb").read())
new_robot_upl = {
    "robot_name": "Dummy1",
    "creator": id,
    "avatar": avatar,
}
code = open("Test/files/dummybot.py", "rb")
rob = client.post("/robot/create", data=new_robot_upl, files={"code": code})
assert rob.status_code == 200

def test_create_simulation_invalid_creator():
    new_sim = {
        "username": get_random_string_lower(5),
        "n_rounds": 2,
        "robot_names": ["Dummy1", "Dummy1"]
    }
    response = client.post("/simulation/start", json=new_sim)
    assert response.json() == {"detail": "User doesn't exist."}
    assert response.status_code == 404

def test_sim_invalid_rounds():
    new_sim = {
        "username": "TestinSim",
        "n_rounds": get_rand_negative(),
        "robot_names": ["Dummy1", "Dummy2"]
    }
    response = client.post("/simulation/start", json=new_sim)
    assert response.status_code == 400
    assert response.json() == {"detail": "Incorrect number of rounds."}

def test_sim_invalid_n_robots():
    new_sim = {
        "username": "TestinSim",
        "n_rounds": 2,
        "robot_names": ["Dummy1"]
    }
    response = client.post("/simulation/start", json=new_sim)
    assert response.json() == {"detail": "Minimum amount of robots is 2 and maximum is 4."}
    assert response.status_code == 400

def test_sim_user_doesnt_exist():
    new_sim = {
        "username": "TestinSim2",
        "n_rounds": 2,
        "robot_names": ["Dummy1", "Dummy1"]
    }
    response = client.post("/simulation/start", json=new_sim)
    assert response.json() == {"detail": "User doesn't exist."}
    assert response.status_code == 404