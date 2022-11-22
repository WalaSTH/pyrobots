from fastapi.testclient import TestClient
from Database.Database import *
from Test.auxiliar_functions import *
from app import app
import random
from pydantic_models import MAX_ROUNDS_PER_GAME, MAX_GAMES_PER_MATCH

client = TestClient(app)

# Auxiliar data.
user1 = "Dummy2"
pwd = "Test1234"
user_to_reg = {
    "username": user1,
    "password": pwd,
    "email": (get_email()),
    "avatar": None
}
u1_res = client.post("/user/signup", data=user_to_reg)
assert u1_res.status_code == 200

user2 = "Dummy3"
user_to_reg = {
    "username": user2,
    "password": pwd,
    "email": (get_email()),
    "avatar": None,
}
u2_res = client.post("/user/signup", data=user_to_reg)
assert u2_res.status_code == 200

rob_owner = get_last_user_id()
new_robot_upl = {
    "robot_name": "DummyBot1",
    "creator": rob_owner,
    "avatar": None,
}
code = open("Test/files/dummybot.py", "rb")
rob_res = client.post("/robot/create", data=new_robot_upl, files={"code":code})
assert rob_res.status_code == 200
robot1 = get_last_robot_id()

# New match creation.
def test_match_creation():

    rob_id = 0
    while not check_robot_existance(rob_id):
        rob_id = random.randint(1,get_last_robot_id())

    match_to_create = {
        "name": get_random_string_goodps(8),
        "min_players": 2,
        "max_players": 4,
        "games_per_match": random.randint(1, MAX_GAMES_PER_MATCH),
        "rounds": random.randint(1,MAX_ROUNDS_PER_GAME),
        "robot_id": rob_id,
        "creator": get_robot_owner_id(rob_id),
        "password": get_random_string_goodps(8)
    }
    response = client.post("/match/create", json=match_to_create)
    new_match = get_last_match_id()
    assert response.json() == {"detail": "Match created successfully", "id": new_match}
    assert response.status_code == 200

# New match with unexistant robot.
def test_match_unexistant_robot():

    rob_id = get_last_robot_id() + 1
    match_to_create = {
        "name": get_random_string_goodps(8),
        "min_players": 2,
        "max_players": 4,
        "games_per_match": random.randint(1, MAX_GAMES_PER_MATCH),
        "rounds": random.randint(1,MAX_ROUNDS_PER_GAME),
        "robot_id": rob_id,
        "creator": get_robot_owner_id(rob_id - 1),
        "password": get_random_string_goodps(8)
    }

    response = client.post("/match/create", json=match_to_create)
    assert response.json() == {"detail": "No robot with such ID"}
    assert response.status_code == 404

# Create a match with an unexistant user
def test_match_unexistant_user():

    rob_id = 0
    while not check_robot_existance(rob_id):
        rob_id = random.randint(1,get_last_robot_id())

    match_to_create = {
        "name": get_random_string_goodps(8),
        "min_players": 2,
        "max_players": 4,
        "games_per_match": random.randint(1, MAX_GAMES_PER_MATCH),
        "rounds": random.randint(1,MAX_ROUNDS_PER_GAME),
        "robot_id": rob_id,
        "creator": get_last_user_id()+1,
        "password": get_random_string_goodps(8)
    }

    response = client.post("/match/create", json=match_to_create)
    assert response.json() == {"detail": "No user with such ID"}
    assert response.status_code == 404

# Create match with a wrong robot owner.
def test_match_robot_does_not_belong_to_user():

    rob_id = 0
    while not check_robot_existance(rob_id):
        rob_id = random.randint(1,get_last_robot_id())

    u_id = 1
    while u_id == get_robot_owner_id(rob_id) or not check_user_existance(u_id):
        u_id += 1

    match_to_create = {
        "name": get_random_string_goodps(8),
        "min_players": 2,
        "max_players": 4,
        "games_per_match": random.randint(1, MAX_GAMES_PER_MATCH),
        "rounds": random.randint(1,MAX_ROUNDS_PER_GAME),
        "robot_id": rob_id,
        "creator": u_id,
        "password": get_random_string_goodps(8)
    }

    response = client.post("/match/create", json=match_to_create)
    assert response.json() == {"detail": f"Robot {rob_id} does not belong to you"}
    assert response.status_code == 409

# Create match with a duplicated name.
def test_unstarted_match_already_exists():

    rob_id = 0
    while not check_robot_existance(rob_id):
        rob_id = random.randint(1,get_last_robot_id())

    match_to_create = {
        "name": get_random_string_goodps(8),
        "min_players": 2,
        "max_players": 4,
        "games_per_match": random.randint(1, MAX_GAMES_PER_MATCH),
        "rounds": random.randint(1,MAX_ROUNDS_PER_GAME),
        "robot_id": rob_id,
        "creator": get_robot_owner_id(rob_id),
        "password": get_random_string_goodps(8)
    }

    response = client.post("/match/create", json=match_to_create)
    response = client.post("/match/create", json=match_to_create)
    assert response.json() == {"detail": "A match with this name already exists"}
    assert response.status_code == 409