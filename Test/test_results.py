from fastapi.testclient import TestClient
from Database.Database import *
from Test.auxiliar_functions import *
from app import app

client = TestClient(app)

### --- Auxiliar data. --- ###
# User 1.
user1 = "User_RES_1"
pwd = "Test1234"
user_to_reg = {
    "username": user1,
    "password": pwd,
    "email": (get_email()),
    "avatar": None
}
u1_res = client.post("/user/signup", data=user_to_reg)
assert u1_res.status_code == 200
# User 2. 
user2 = "User_RES_2"
user_to_reg = {
    "username": user2,
    "password": pwd,
    "email": (get_email()),
    "avatar": None,
}
u2_res = client.post("/user/signup", data=user_to_reg)
assert u2_res.status_code == 200
# User 3.
user3 = "User_RES_3"
user_to_reg = {
    "username": user3,
    "password": pwd,
    "email": (get_email()),
    "avatar": None,
}
u2_res = client.post("/user/signup", data=user_to_reg)
assert u2_res.status_code == 200

# Match
u_id = get_user_id(user1)
r_id = 1
while check_robot_ownership(r_id, u_id):
    print(check_robot_ownership(r_id, u_id))
    r_id += 1
match1 = "Match RES 1"
match_to_create = {
    "name": match1,
    "min_players": 2,
    "max_players": 2,
    "games_per_match": 200,
    "rounds": 10000,
    "robot_id": r_id,
    "creator": u_id
}
m_res = client.post("/match/create", json=match_to_create)
test_match = get_last_match_id()
assert m_res.json() == {"detail": "Match created successfully."}
assert m_res.status_code == 200
# Join
test_json = {
    "username": user2,
    "robot": "Sniper Cheto",
    "match": test_match
}
response = client.post("/match/join", json=test_json)
assert response.json() == {"detail": "You have succesfully joined the match"}
assert response.status_code == 200


# Incorrect match id.
def test_match_does_not_exist():
    test_params = {
        "match_id": get_last_match_id()+1,
        "username": user2
    }

    response = client.post("/match/result", params=test_params)
    assert response.json() == {"detail": f"Match id {test_params.match_id} does not exist"}
    assert response.status_code == 404

# Incorrect username.
def test_user_does_not_exist():
    test_params = {
        "match_id": test_match,
        "username": "WRONG_VERY_WRONG_USERNAME"
    }

    response = client.post("/match/result", params=test_params)
    assert response.json() == {"detail": f"User {test_params.username} is not a user"}
    assert response.status_code == 404

# User does not belong.
def test_user_does_not_participate():
    test_params = {
        "match_id": test_match,
        "username": user3
    }

    response = client.post("/match/result", params=test_params)
    assert response.json() == {"detail": "You are not part of this match"}
    assert response.status_code == 409

# Good request.
def test_get_results():
    test_params = {
        "match_id": test_match,
        "username": user3
    }

    response = client.post("/match/result", params=test_params)
    assert response.json() == {"detail": "Results succesfully retrieved.", "data": get_match_results(test_params.match_id)}
    assert response.status_code == 200
