from fastapi.testclient import TestClient
from Database.Database import *
from app import app

client = TestClient(app)

### --- Auxiliar Data --- ###
user1 = "User_ml_1"
pwd = "Test1234"
user_to_reg = {
    "username": user1,
    "password": pwd,
    "email": "testml1@gmail.com",
    "avatar": None
}
u1_res = client.post("/user/signup", data=user_to_reg)
assert u1_res.status_code == 200

rob_owner = get_last_user_id()
new_robot_upl = {
    "robot_name": "RobML1",
    "creator": rob_owner,
    "avatar": None,
}
code = open("Test/files/dummybot.py", "rb")
rob_res = client.post("/robot/create", data=new_robot_upl, files={"code":code})
assert rob_res.status_code == 200
robot1 = get_last_robot_id()

user2 = "User_ml_2"
user_to_reg = {
    "username": user2,
    "password": pwd,
    "email": "testml2@gmail.com",
    "avatar": None
}
u2_res = client.post("/user/signup", data=user_to_reg)
assert u2_res.status_code == 200

rob_owner = get_last_user_id()
new_robot_upl = {
    "robot_name": "RobML2",
    "creator": rob_owner,
    "avatar": None,
}
code = open("Test/files/dummybot.py", "rb")
rob_2 = client.post("/robot/create", data=new_robot_upl, files={"code":code})
assert rob_2.status_code == 200
robot2 = get_last_robot_id()

match_to_create = {
        "name": "Match1",
        "min_players": 2,
        "max_players": 4,
        "games_per_match": 10,
        "rounds": 10,
        "robot_id": robot1,
        "creator": get_robot_owner_id(robot1),
        "password": "Testpwd"
    }
m1r = client.post("/match/create", json=match_to_create)
assert m1r.status_code == 200

match_to_create = {
        "name": "Match2",
        "min_players": 2,
        "max_players": 4,
        "games_per_match": 10,
        "rounds": 10,
        "robot_id": robot2,
        "creator": get_robot_owner_id(robot2),
        "password": ""
    }
m2r = client.post("/match/create", json=match_to_create)
print(m2r.json())
assert m2r.status_code == 200

match_to_create = {
        "name": "Match3",
        "min_players": 2,
        "max_players": 4,
        "games_per_match": 10,
        "rounds": 10,
        "robot_id": robot1,
        "creator": get_robot_owner_id(robot1),
        "password": "Testpwd"
    }
m3r = client.post("/match/create", json=match_to_create)
assert m3r.status_code == 200


# Test started matches (we can't start them at the moment) empty list.
def test_match_empty_list():
    started_params = {
        "name": user1,
        "filter": "finished"
    }
    res_list = get_match_list(started_params["name"], started_params["filter"])

    response = client.get("/match/list", params=started_params)
    assert response.status_code == 404
    assert response.json() == {"detail": "No matches available"} and res_list == []

# Test available matches (all).
def test_available_matches():
    available_params = {
        "name": user1,
        "filter": "available"
    }
    res_list = get_match_list(available_params["name"], available_params["filter"])

    response = client.get("/match/list", params=available_params)
    assert response.status_code == 200

# Test public matches (no pwd).
def test_public_matches():
    public_params = {
        "name": user1,
        "filter": "public"
    }
    res_list = get_match_list(public_params["name"], public_params["filter"])

    response = client.get("/match/list", params=public_params)
    assert response.status_code == 200

# Test private matches (with_pwd).
def test_private_matches():
    private_params = {
        "name": user1,
        "filter": "private"
    }
    res_list = get_match_list(private_params["name"], private_params["filter"])

    response = client.get("/match/list", params=private_params)
    assert response.status_code == 200


# Test hosted matches (created by user).
def test_hosted_matches():
    hosted_params = {
        "name": user1,
        "filter": "hosted"
    }
    res_list = get_match_list(hosted_params["name"], hosted_params["filter"])

    response = client.get("/match/list", params=hosted_params)
    assert response.status_code == 200

# Test hosted matches (created by user).
def test_stupid_filter():
    filter_params = {
        "name": user1,
        "filter": "stoopid"
    }
    res_list = get_match_list(filter_params["name"], filter_params["filter"])

    response = client.get("/match/list", params=filter_params)
    assert response.status_code == 404
    assert response.json() == {"detail": f"Filter stoopid is not a valid filter"}