from fastapi.testclient import TestClient
from Database.Database import *
from app import app
from Test.auxiliar_functions import get_random_string_goodps
import json

client = TestClient(app)

### --- Auxiliar Data --- ###
user1 = "User_stat_1"
pwd = "Test1234"
user_to_reg = {
    "username": user1,
    "password": pwd,
    "email": "teststat1@gmail.com",
    "avatar": None,
}
u1_res = client.post("/user/signup", data=user_to_reg)
assert u1_res.status_code == 200

# New match creation.
def test_stats_unexistant_user():

    fake_user = get_random_string_goodps(10)
    while user_exists(fake_user):
        fake_user = get_random_string_goodps(10)

    param = {"checked_user": fake_user}
    response = client.get("/users/stats", params=param)
    assert response.json() == {
        "detail": f"Username {fake_user} does not exist.",
    }
    assert response.status_code == 404


def test_stats_zero():
    param = {"checked_user": user1}

    response = client.get("/users/stats",params=param)
    assert response.json() == {
        "detail": "Stats succesfuly checked",
        "stats": {
            "played_matches": 0,
            "victories": 0
        }
    }
    assert response.status_code == 200