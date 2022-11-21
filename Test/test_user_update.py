from fastapi.testclient import TestClient
from Database.Database import *
from Test.auxiliar_functions import *
from security_functions import verify_password
from app import app

client = TestClient(app)

### --- Auxiliar data. --- ###
# User 1.
user1 = "User_up_1"
pwd = "Test1234"
user_to_reg = {
    "username": user1,
    "password": pwd,
    "email": (get_email()),
    "avatar": None
}
u1_res = client.post("/user/signup", data=user_to_reg)
assert u1_res.status_code == 200

# Unexistent user.
def test_user_does_not_exist():
    fake_user = get_random_string_goodps(10)
    while user_exists(fake_user):
        fake_user = get_random_string_goodps(10)

    test_json = {
        "username": fake_user,
        "param": "password",
        "new_pwd": "P4ssw0rd",
        "current_pwd": pwd
    }

    response = client.put("/user/update", json=test_json)
    assert response.json() == {"detail": f"No user named {fake_user}."}
    assert response.status_code == 404

# Wrong param.
def test_param_does_not_exist():

    test_json = {
        "username": user1,
        "param": "INVALID",
        "new_pwd": "P4ssw0rd",
        "current_pwd": pwd
    }

    response = client.put("/user/update", json=test_json)
    assert response.json() == {"detail": f"Param INVALID does not exist."}
    assert response.status_code == 400

# Wrong password.
def test_wrong_password():

    test_json = {
        "username": user1,
        "param": "password",
        "new_pwd": "P4ssw0rd",
        "current_pwd": "NotMyPa55"
    }

    response = client.put("/user/update", json=test_json)
    assert response.json() == {"detail": "That is not your current password."}
    assert response.status_code == 401

# Invalid password.
def test_invalid_password():

    test_json = {
        "username": user1,
        "param": "password",
        "new_pwd": "INVALID",
        "current_pwd": pwd
    }

    response = client.put("/user/update", json=test_json)
    assert response.json() == {"detail": "Password must have at least one uppercase, one lowercase and one number."}
    assert response.status_code == 401

# Change password.
def test_change_password():

    test_json = {
        "username": user1,
        "param": "password",
        "new_pwd": "P4ssw0rd",
        "current_pwd": pwd
    }
    response = client.put("/user/update", json=test_json)
    assert response.json() == {"detail": "Password updated succesfully."}
    assert response.status_code == 200

# Change avatar.
def test_change_password():

    test_json = {
        "username": user1,
        "param": "avatar",
    }
    response = client.put("/user/update", json=test_json)
    assert response.json() == {"detail": "User updated succesfully.", "new_avatar": get_photo(user1)}
    assert response.status_code == 200
