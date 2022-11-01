from fastapi.testclient import TestClient
from Database.Database import *
from Test.auxiliar_functions import *
from app import app
import random
from pydantic_models import MAX_ROUNDS_PER_GAME, MAX_GAMES_PER_MATCH

client = TestClient(app)

user1 = "Dummy_1"
pwd = "Test1234"
user_to_reg = {
    "username": user1,
    "password": pwd,
    "email": (get_email()),
}
u1_res = client.post("/user/signup", params=user_to_reg)
assert u1_res.status_code == 200

rob_owner = get_last_user_id()
new_robot_upl = {
    "robot_name": "DummyBot01",
    "creator": rob_owner
}
code = open("Tests/files/dummybot.py", "rb")
rob_res = client.post("/robot/create", params = new_robot_upl, files={"code":code})
assert rob_res.status_code == 200
robot1 = get_last_robot_id()

new_robot_upl = {
    "robot_name": "DummyBot02",
    "creator": rob_owner
}
code = open("Tests/files/dummybot.py", "rb")
rob_res = client.post("/robot/create", params = new_robot_upl, files={"code":code})
assert rob_res.status_code == 200
robot1 = get_last_robot_id()

user2 = "Dummy_2"
pwd = "Test1234"
user_to_reg = {
    "username": user2,
    "password": pwd,
    "email": (get_email()),
}
u2_res = client.post("/user/signup", params=user_to_reg)
assert u2_res.status_code == 200

# List robots on empty database
def test_robot_listing_empty():
    rob_owner = {
        "user_name" : user2,
        "detailed" : False
    }

    res_list = get_robot_list(rob_owner["user_name"], rob_owner["detailed"])
    response = client.get("/robot/list", params=rob_owner)

    assert response.json() == {"detail" : "No Robots available"}
    assert response.status_code == 404

# List robots
def test_robot_listing_with_items_no_code():
    rob_owner = {
        "user_name" : user1,
        "detailed" : False
    }

    res_list = get_robot_list(rob_owner["user_name"], rob_owner["detailed"])
    response = client.get("/robot/list", params = rob_owner)

    assert response.status_code == 200
    assert response.json() == {"Robots": res_list}

def test_robot_listing_with_items_and_code():
    rob_owner = {
        "user_name" : user1,
        "detailed" : True
    }

    res_list = get_robot_list(rob_owner["user_name"], rob_owner["detailed"])
    response = client.get("/robot/list", params = rob_owner)

    delete_user(user1)
    assert response.status_code == 200

