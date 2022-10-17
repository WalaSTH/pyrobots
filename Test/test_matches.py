from fastapi.testclient import TestClient
from Database.Database import *
from Test.auxiliar_functions import *
from app import app
import random

client = TestClient(app)

#Creation new user

def test_match_creation():

    rob_id = random.randint(1,check_robot_quantity())
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
    assert response.json() == {"detail": "Match created successfully", "id": check_match_quantity()}

#Creation new user with invalid username
def test_match_unexistant_robot():
    
    rob_id = random.randint(1,check_robot_quantity()) + 1
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

#Creation new user with invalid password
def test_match_unexistant_user():
    
    rob_id = random.randint(1,check_robot_quantity())
    match_to_create = {
        "name": get_random_string_goodps(8),
        "min_players": 2,
        "max_players": 4,
        "games_per_match": random.randint(20, 10000),
        "rounds": random.randint(20,10000),
        "robot_id": rob_id,
        "creator": check_user_quantity()+1,
        "password": get_random_string_goodps(8)
    }

    response = client.post("/match/create", json=match_to_create)
    assert response.status_code == 404
    assert response.json() == {"detail": "No user with such ID"}

def test_match_robot_does_not_belong_to_user():
        
    rob_id = random.randint(1,check_robot_quantity())
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

def test_unstarted_match_already_exists():
        
    rob_id = random.randint(1,check_robot_quantity())
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
