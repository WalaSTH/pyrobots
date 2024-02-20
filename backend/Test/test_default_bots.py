from fastapi.testclient import TestClient
from Database.Database import *
from Test.auxiliar_functions import *
from app import app
from pydantic_models import MAX_ROUNDS_PER_GAME, MAX_GAMES_PER_MATCH

client = TestClient(app)

# Auxiliar data.
user1 = "User_wb_1"
pwd = "Test1234"
user_to_reg = {
    "username": user1,
    "password": pwd,
    "email": (get_email()),
    "avatar": None
}
u1_res = client.post("/user/signup", data=user_to_reg)
assert u1_res.status_code == 200

# User actually has bots.
def test_user_gets_bots():
    rob_owner = {
        "user_name" : user1,
        "detailed" : False
    }

    res_list = get_robot_list(rob_owner["user_name"], rob_owner["detailed"])
    assert res_list != []