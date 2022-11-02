from fastapi.testclient import TestClient
from Database.Database import *
from Test.auxiliar_functions import *
from app import app

client = TestClient(app)

### --- Auxiliar data. --- ###
# User 1.
user1 = "User_MJ_1"
pwd = "Test1234"
user_to_reg = {
    "username": user1,
    "password": pwd,
    "email": (get_email()),
    "avatar": None
}
u1_res = client.post("/user/signup", data=user_to_reg)
assert u1_res.status_code == 200
# Robot 1.
rob_owner = get_last_user_id()
robot1 = "Robot MJ 1"
new_robot_upl = {
    "robot_name": robot1,
    "creator": rob_owner,
    "avatar": None,
}
code = open("Test/files/dummybot.py", "rb")
rob_1 = client.post("/robot/create", data=new_robot_upl, files={"code":code})
assert rob_1.status_code == 200
r_id1 = get_last_robot_id()

# User 2. 
user2 = "User_MJ_2"
user_to_reg = {
    "username": user2,
    "password": pwd,
    "email": (get_email()),
    "avatar": None,
}
u2_res = client.post("/user/signup", data=user_to_reg)
assert u2_res.status_code == 200
# Robot 2.
rob_owner = get_last_user_id()
robot2 = "Robot MJ 2"
new_robot_upl = {
    "robot_name": robot2,
    "creator": rob_owner,
    "avatar": None,
}
code = open("Test/files/dummybot.py", "rb")
rob_2 = client.post("/robot/create", data=new_robot_upl, files={"code":code})
assert rob_2.status_code == 200

# User 3
user3 = "User_MJ_3"
user_to_reg = {
    "username": user3,
    "password": pwd,
    "email": (get_email()),
    "avatar": None,
}
u3_res = client.post("/user/signup", data=user_to_reg)
assert u3_res.status_code == 200
# Robot 3.
rob_owner = get_last_user_id()
robot3 = "Robot MJ 3"
new_robot_upl = {
    "robot_name": robot3,
    "creator": rob_owner,
    "avatar": None,
}
code = open("Test/files/dummybot.py", "rb")
rob_2 = client.post("/robot/create", data=new_robot_upl, files={"code":code})
assert rob_2.status_code == 200

match1 = "Match MJ 1"
password = "Test1234"
match_to_create = {
    "name": match1,
    "min_players": 2,
    "max_players": 2,
    "games_per_match": 100,
    "rounds": 100,
    "robot_id": r_id1,
    "creator": get_robot_owner_id(r_id1),
    "password": password
}
m_res = client.post("/match/create", json=match_to_create)
test_match = get_last_match_id()
assert m_res.status_code == 200


# Incorrect match id.
def test_match_does_not_exist():
    test_params = {
        "username": user2,
        "robot": robot2,
        "match": get_last_match_id()+1,
        "password": password
    }

    response = client.post("/match/join", params=test_params)
    m_id = test_params["match"]
    assert response.json() == {"detail": f"Match id {m_id} does not exist"}
    assert response.status_code == 404

# Incorrect user name.
def test_user_does_not_exist():
    test_params = {
        "username": "Ramon2",
        "robot": robot2,
        "match": test_match,
        "password": password
    }

    response = client.post("/match/join", params=test_params)
    u_id = test_params["username"]
    assert response.json() == {"detail": f"User {u_id} is not a user"}
    assert response.status_code == 404

# Incorrect robot.
def test_robot_does_not_exist_or_belongs():
    test_params = {
        "username": user2,
        "robot": robot3,
        "match": test_match,
        "password": password
    }

    response = client.post("/match/join", params=test_params)
    r_id = test_params["robot"]
    assert response.json() == {"detail": f"Robot {r_id} does not exist or does not belong to you"}
    assert response.status_code == 404

# Wrong password.
def test_wrong_password():
    test_params = {
        "username": user2,
        "robot": robot2,
        "match": test_match,
        "password": "JIJIJIJA"
    }

    response = client.post("/match/join", params=test_params)
    assert response.json() == {"detail": "Incorrect password"}
    assert response.status_code == 401

# Join succesfuly.
def test_join_match():
    test_params = {
        "username": user2,
        "robot": robot2,
        "match": test_match,
        "password": password
    }

    response = client.post("/match/join", params=test_params)
    assert response.json() == {"detail": "You have succesfully joined the match"}
    assert response.status_code == 200

# Join again.
def test_already_joined():
    test_params = {
        "username": user2,
        "robot": robot2,
        "match": test_match,
        "password": password
    }

    response = client.post("/match/join", params=test_params)
    assert response.json() == {"detail": "You have already joined this match"}
    assert response.status_code == 409

# Join full match.
def test_match_is_full():
    test_params = {
        "username": user3,
        "robot": robot3,
        "match": test_match,
        "password": password
    }

    response = client.post("/match/join", params=test_params)
    assert response.json() == {"detail": "The match you tried joining is already full"}
    assert response.status_code == 409
