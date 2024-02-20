from base64 import b64encode
from fastapi import File
from fastapi.testclient import TestClient
from Database.Database import *
from app import app
from Test.auxiliar_functions import *
import random
from pydantic_models import MAX_ROUNDS_PER_GAME, MAX_GAMES_PER_MATCH

client = TestClient(app)

#Set users to create and join matches
user_to_reg1 = {
    "username": "TestingMatch1",
    "password": "Password1",
    "email": (get_email()),
    "avatar": None,
    }
user_to_reg2 = {
    "username": "TestingMatch2",
    "password": "Password1",
    "email": (get_email()),
    "avatar": None,
    }
user_to_reg3 = {
    "username": "TestingMatch3",
    "password": "Password1",
    "email": (get_email()),
    "avatar": None,
    }
user_to_reg4 = {
    "username": "TestingMatch4",
    "password": "Password1",
    "email": (get_email()),
    "avatar": None,
    }

user1 = client.post("/user/signup", data=user_to_reg1)
user2 = client.post("/user/signup", data=user_to_reg2)
user3 = client.post("/user/signup", data=user_to_reg3)
user4 = client.post("/user/signup", data=user_to_reg4)

user1_id = get_user_id("TestingMatch1")
user2_id = get_user_id("TestingMatch2")
user3_id = get_user_id("TestingMatch3")
user4_id = get_user_id("TestingMatch4")

assert user1.status_code == 200
assert user2.status_code == 200
assert user3.status_code == 200
assert user4.status_code == 200

avatar = b64encode(open("Test/files/image.jpg", "rb").read())
new_robot_upl1 = {
    "robot_name": "Dummy1",
    "creator": user1_id,
    "avatar": avatar,
}
new_robot_upl2 = {
    "robot_name": "Dummy1",
    "creator": user2_id,
    "avatar": avatar,
}
new_robot_upl3 = {
    "robot_name": "Dummy1",
    "creator": user3_id,
    "avatar": avatar,
}
new_robot_upl4 = {
    "robot_name": "Dummy1",
    "creator": user4_id,
    "avatar": avatar,
}
code = open("Test/files/dummybot.py", "rb")

rob1 = client.post("/robot/create", data=new_robot_upl1, files={"code": code})
rob2 = client.post("/robot/create", data=new_robot_upl2, files={"code": code})
rob3 = client.post("/robot/create", data=new_robot_upl3, files={"code": code})
rob4 = client.post("/robot/create", data=new_robot_upl4, files={"code": code})

rob1_id = get_robot_id_by_name("TestingMatch1", "Dummy1")
rob2_id = get_robot_id_by_name("TestingMatch2", "Dummy1")
rob3_id = get_robot_id_by_name("TestingMatch3", "Dummy1")
rob4_id = get_robot_id_by_name("TestingMatch4", "Dummy1")

assert rob1.status_code == 200
assert rob2.status_code == 200
assert rob3.status_code == 200
assert rob4.status_code == 200

#Create match for at least 3 players
password = get_random_string_goodps(8)
match_to_create_start = {
    "name": get_random_string_goodps(8),
    "min_players": 4,
    "max_players": 4,
    "games_per_match": random.randint(1, MAX_GAMES_PER_MATCH),
    "rounds": random.randint(1,MAX_ROUNDS_PER_GAME),
    "robot_id": rob1_id,
    "creator": user1_id,
    "password": password
}
response = client.post("/match/create", json=match_to_create_start)
new_match_start = get_last_match_id()
assert response.json() == {"detail": "Match created successfully", "id": new_match_start}
assert response.status_code == 200

#Join one
def join_everyone(match):
    join2 = {
        "username": "TestingMatch2",
        "robot": "Dummy1",
        "match": match,
        "password": password
    }
    join3 = {
        "username": "TestingMatch3",
        "robot": "Dummy1",
        "match": match,
        "password": password
    }
    join4 = {
        "username": "TestingMatch4",
        "robot": "Dummy1",
        "match": match,
        "password": password
    }
    return [join2, join3, join4]

response = client.post("/match/join", json=join_everyone(new_match_start)[0])
assert response.json() == {"detail": "You have succesfully joined the match"}
assert response.status_code == 200

# Trying to start unexisting match
def test_match_start_unexisting():
    match_start = {
        "match_id": get_rand_negative(),
        "username": "TestingMatch1",
        "syscalls": False
    }
    response = client.post("/match/start", json = match_start)
    assert response.json() == {"detail": "Match not found."}
    assert response.status_code == 404

# Trying to start match with unexisting user
def test_match_start_unexisting():
    match_start = {
        "match_id": new_match_start,
        "username": "ThisUserDoesntExist",
        "syscalls": False
    }
    response = client.post("/match/start", json = match_start)
    assert response.json() == {"detail": "User not found."}
    assert response.status_code == 404

# Trying to start match without being the creator
def test_match_start_not_creator():
    match_start = {
        "match_id": new_match_start,
        "username": "TestingMatch2",
        "syscalls": False
    }
    response = client.post("/match/start", json = match_start)
    assert response.json() == {"detail": "User did not create the match."}
    assert response.status_code == 400

# Trying to start a match with less player amount than minimum
def test_match_start_less_min():
    match_start = {
        "match_id": new_match_start,
        "username": "TestingMatch1",
        "syscalls": False
    }
    response = client.post("/match/start", json = match_start)
    assert response.json() == {"detail": "Number of players is lower than minimum allowed."}
    assert response.status_code == 400

# Start match succesfully
def test_match_start_ok():
    #Join two more
    for i in range(1,3):
        response = client.post("/match/join", json=join_everyone(new_match_start)[i])
        assert response.json() == {"detail": "You have succesfully joined the match"}
        assert response.status_code == 200
    match_start = {
        "match_id": new_match_start,
        "username": "TestingMatch1",
        "syscalls": False
    }
    response = client.post("/match/start", json = match_start)
    assert response.json() == {"detail": "Match successfully executed."}
    assert response.status_code == 200

# Trying to start a match that has already started
def test_match_start_already():
    match_start = {
        "match_id": new_match_start,
        "username": "TestingMatch1",
        "syscalls": False
    }
    response = client.post("/match/start", json = match_start)
    assert response.json() == {"detail": "Match already started."}
    assert response.status_code == 400