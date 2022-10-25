from fastapi.testclient import TestClient
from Database.Database import *
from Test.auxiliar_functions import *
from app import app
import random

client = TestClient(app)

# New match creation.
def test_match_creation():

    rob_id = 0
    while not check_robot_existance(rob_id):
        rob_id = random.randint(1,get_last_robot_id())

    match_to_create = {
        "name": get_random_string_goodps(8),
        "min_players": 2,
        "max_players": 4,
        "games_per_match": random.randint(20, 10000),
        "rounds": random.randint(20,10000),
        "robot_id": rob_id,
        "creator": get_robot_owner_id(rob_id),
        "password": get_random_string_goodps(8)
    }
    response = client.post("/match/create", json=match_to_create)
    assert response.status_code == 200
    assert response.json() == {"detail": "Match created successfully", "id": get_last_match_id()}

# New match with unexistant robot.
def test_match_unexistant_robot():
    
    rob_id = get_last_robot_id() + 1
    match_to_create = {
        "name": get_random_string_goodps(8),
        "min_players": 2,
        "max_players": 4,
        "games_per_match": random.randint(20, 10000),
        "rounds": random.randint(20,10000),
        "robot_id": rob_id,
        "creator": get_robot_owner_id(rob_id - 1),
        "password": get_random_string_goodps(8)
    }

    response = client.post("/match/create", json=match_to_create)
    assert response.status_code == 404
    assert response.json() == {"detail": "No robot with such ID"}

# Create a match with an unexistant user
def test_match_unexistant_user():

    rob_id = 0
    while not check_robot_existance(rob_id):
        rob_id = random.randint(1,get_last_robot_id())

    match_to_create = {
        "name": get_random_string_goodps(8),
        "min_players": 2,
        "max_players": 4,
        "games_per_match": random.randint(20, 10000),
        "rounds": random.randint(20,10000),
        "robot_id": rob_id,
        "creator": get_last_user_id()+1,
        "password": get_random_string_goodps(8)
    }

    response = client.post("/match/create", json=match_to_create)
    assert response.status_code == 404
    assert response.json() == {"detail": "No user with such ID"}

# Create match with a wrong robot owner.
def test_match_robot_does_not_belong_to_user():

    rob_id = 0
    while not check_robot_existance(rob_id):
        rob_id = random.randint(1,get_last_robot_id())

    match_to_create = {
        "name": get_random_string_goodps(8),
        "min_players": 2,
        "max_players": 4,
        "games_per_match": random.randint(20, 10000),
        "rounds": random.randint(20,10000),
        "robot_id": rob_id,
        "creator": 1 if get_robot_owner_id(rob_id) else 2,
        "password": get_random_string_goodps(8)
    }

    response = client.post("/match/create", json=match_to_create)
    assert response.status_code == 409
    assert response.json() == {"detail": f"Robot {rob_id} does not belong to you"}

# Create match with a duplicated name.
def test_unstarted_match_already_exists():

    rob_id = 0
    while not check_robot_existance(rob_id):
        rob_id = random.randint(1,get_last_robot_id())

    match_to_create = {
        "name": get_random_string_goodps(8),
        "min_players": 2,
        "max_players": 4,
        "games_per_match": random.randint(20, 10000),
        "rounds": random.randint(20,10000),
        "robot_id": rob_id,
        "creator": get_robot_owner_id(rob_id),
        "password": get_random_string_goodps(8)
    }

    response = client.post("/match/create", json=match_to_create)
    response = client.post("/match/create", json=match_to_create)
    assert response.status_code == 409
    assert response.json() == {"detail": "A match with this name already exists"}
