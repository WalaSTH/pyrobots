from fastapi.testclient import TestClient
from Database.Database import *
from Test.auxiliar_functions import *
from starlette.middleware.cors import CORSMiddleware
from app import app
import random
import string

client = TestClient(app)

#Creation new user

def test_user_register():

    user_to_reg = {
        "username": (get_random_string_lower(5)),
        "password": (get_random_string_goodps(8)),
        "email": (get_email()),
    }
    response = client.post("/user/signup", params=user_to_reg)
    assert response.status_code == 200
    assert response.json() == {"detail": "User created successfully"}
    delete_user(user_to_reg["username"])
#Creation new user with invalid username
def test_user_register_invalid_username():
    user_to_reg = {
        "username": (get_random_string_lower(2)),
        "password": "1234aA",
        "email": "test@test.com"
    }
    response = client.post("/user/signup", params=user_to_reg)
    assert response.status_code == 401
    assert response.json() == {"detail": "field size is invalid"}

#Creation new user with invalid password
def test_user_register_invalid_password_all_lower():
    user_to_reg = {
        "username": (get_random_string_lower(5)),
        "password": (get_random_string_lower(8)),
        "email": "test@test.com"
    }
    response = client.post("/user/signup", params=user_to_reg)
    assert response.status_code == 401
    assert response.json() == {"detail": "password must have at least one uppercase, one lowercase and one number"}

def test_user_register_invalid_password_all_upper():
    user_to_reg = {
        "username": (get_random_string_lower(5)),
        "password": (get_random_string_upper(8)),
        "email": "test@test.com"
    }
    response = client.post("/user/signup", params=user_to_reg)
    assert response.status_code == 401
    assert response.json() == {"detail": "password must have at least one uppercase, one lowercase and one number"}

def test_user_register_invalid_password_all_number():
    user_to_reg = {
        "username": (get_random_string_lower(5)),
        "password": (get_random_string_num(8)),
        "email": "test@test.com"
    }
    response = client.post("/user/signup", params=user_to_reg)
    assert response.status_code == 401
    assert response.json() == {"detail": "password must have at least one uppercase, one lowercase and one number"}

def test_password_short_size():
    user_to_reg = {
        "username": (get_random_string_lower(5)),
        "password": (get_random_string_goodps(3)),
        "email": (get_email()),
    }
    response = client.post("/user/signup", params=user_to_reg)
    assert response.status_code == 401
    assert response.json() == {"detail": "field size is invalid"}

def test_upload_photo():
    username = (get_random_string_lower(5))
    user_to_reg={
        "username": username,
        "password": (get_random_string_goodps(8)),
        "email": (get_email()),
    }
    response = client.post("/user/signup", params=user_to_reg)
    assert response.status_code == 200
    assert response.json() == {"detail": "User created successfully"}
    photo = open("Test/test.jpg", "rb")
    filename = "test.jpg"
    response = client.post("/user/upload_photo", files={"photo": photo}, params={"username": username})
    assert response.status_code == 200
    assert response.json() == {"detail": "{} uploaded successfully".format(filename)}
    delete_user(username)

def test_upload_photo_invalid_username():
    username = (get_random_string_lower(5))
    photo = open("Test/test.jpg", "rb")
    filename = "test.jpg"
    response = client.post("/user/upload_photo", files={"photo": photo}, params={"username": username})
    assert response.status_code == 401
    assert response.json() == {"detail": "user does not exist"}
