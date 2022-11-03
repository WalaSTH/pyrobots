from fastapi.testclient import TestClient
from Database.Database import *
from Test.auxiliar_functions import *
from app import app

client = TestClient(app)

### --- Auxiliar data. --- ###
# User 1.
user1 = "User_ML_1"
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
robot1 = "Robot ML 1"
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
user2 = "User_ML_2"
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
robot2 = "Robot ML 2"
new_robot_upl = {
    "robot_name": robot2,
    "creator": rob_owner,
    "avatar": None,
}
code = open("Test/files/dummybot.py", "rb")
rob_2 = client.post("/robot/create", data=new_robot_upl, files={"code":code})
assert rob_2.status_code == 200

# User 3
user3 = "User_ML_3"
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
robot3 = "Robot ML 3"
new_robot_upl = {
    "robot_name": robot3,
    "creator": rob_owner,
    "avatar": None,
}
code = open("Test/files/dummybot.py", "rb")
rob_3 = client.post("/robot/create", data=new_robot_upl, files={"code":code})
assert rob_3.status_code == 200

#Match
match1 = "Match ML 1"
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

# Join by User2.
join_params = {
        "username": user2,
        "robot": robot2,
        "match": test_match,
        "password": password
    }
response = client.post("/match/join", params=join_params)
assert response.status_code == 200


# Incorrect match id.
def test_match_does_not_exist():
    test_params = {
        "username": user2,
        "match": get_last_match_id()+1,
    }

    response = client.post("/match/leave", params=test_params)
    m_id = test_params["match"]
    assert response.json() == {"detail": f"Match id {m_id} does not exist"}
    assert response.status_code == 404

# User does not belong.
def test_user_does_not_belong():
    test_params = {
        "username": user3,
        "match": test_match,
    }

    response = client.post("/match/leave", params=test_params)
    assert response.json() == {"detail": "You are not part of this match"}
    assert response.status_code == 409

# Stupid owner.
def test_user_owns_match():
    test_params = {
        "username": user1,
        "match": test_match,
    }

    response = client.post("/match/leave", params=test_params)
    assert response.json() == {"detail": "You can't leave, YOU ARE THE OWNER!"}
    assert response.status_code == 401

# Succesfully leave.
def test_end_in_succes():
    test_params = {
        "username": user2,
        "match": test_match
    }

    response = client.post("/match/leave", params=test_params)
    assert response.json() == {"detail": "You have succesfully left the match"}
    assert response.status_code == 200