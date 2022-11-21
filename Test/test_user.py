from datetime import timedelta
from unittest.mock import ANY

from fastapi.testclient import TestClient
from Database.Database import *
from Test.auxiliar_functions import *
from starlette.middleware.cors import CORSMiddleware
from base64 import b64encode
from app import app
from utils.auth import generate_token
import random
import string

client = TestClient(app)

#Creation new user

def test_user_register():

    user_to_reg = {
        "username": "test_ur_0",
        "password": (get_random_string_goodps(8)),
        "email": (get_email()),
        "avatar": None,
    }
    response = client.post("/user/signup", data=user_to_reg)
    assert response.json() == {"detail": "User created successfully"}
    assert response.status_code == 200


def test_user_register_sends_email(mocker):
    user_to_reg = {
        "username": "test_ur_1",
        "password": (get_random_string_goodps(8)),
        "email": (get_email()),
        "avatar": None,
    }

    mock_send_email = mocker.patch("app.send_verification_email")

    client.post("/user/signup", data=user_to_reg)

    mock_send_email.assert_called_once_with(
        user_to_reg["email"], user_to_reg["username"], ANY
    )


def test_user_register_with_existant_username_responds_401():
    user_to_reg1 = {
        "username": "testUser",
        "password": (get_random_string_goodps(8)),
        "email": (get_email()),
        "avatar": None,
    }

    user_to_reg2 = {
        "username": "testUser",
        "password": (get_random_string_goodps(8)),
        "email": (get_email()),
        "avatar": None,
    }

    client.post("/user/signup", data=user_to_reg1)
    response = client.post("/user/signup", data=user_to_reg2)

    assert response.json() == {"detail": "existing username"}
    assert response.status_code == 401

def test_user_register_with_existant_email_responds_401():
    user_to_reg1 = {
        "username": "test_ur_2",
        "password": (get_random_string_goodps(8)),
        "email": "testEmail@gmail.com",
        "avatar": None,
    }

    user_to_reg2 = {
        "username": "test_ur_3",
        "password": (get_random_string_goodps(8)),
        "email": "testEmail@gmail.com",
        "avatar": None,
    }

    client.post("/user/signup", data=user_to_reg1)
    response = client.post("/user/signup", data=user_to_reg2)

    assert response.json() == {"detail": "A user with this email already exists"}
    assert response.status_code == 401

#Creation new user with invalid username
def test_user_register_invalid_username():
    user_to_reg = {
        "username": (get_random_string_lower(2)),
        "password": "1234aA",
        "email": "test@test.com",
        "avatar": None,
    }
    response = client.post("/user/signup", data=user_to_reg)
    assert response.status_code == 401
    assert response.json() == {"detail": "field size is invalid"}

#Creation new user with invalid password
def test_user_register_invalid_password_all_lower():
    user_to_reg = {
        "username": "test_ur_4",
        "password": (get_random_string_lower(8)),
        "email": "test@test.com",
        "avatar": None,
    }
    response = client.post("/user/signup", data=user_to_reg)
    assert response.status_code == 401
    assert response.json() == {"detail": "password must have at least one uppercase, one lowercase and one number"}

def test_user_register_invalid_password_all_upper():
    user_to_reg = {
        "username": "test_ur_5",
        "password": (get_random_string_upper(8)),
        "email": "test@test.com",
        "avatar": None,
    }
    response = client.post("/user/signup", data=user_to_reg)
    assert response.status_code == 401
    assert response.json() == {"detail": "password must have at least one uppercase, one lowercase and one number"}

def test_user_register_invalid_password_all_number():
    user_to_reg = {
        "username": "test_ur_6",
        "password": (get_random_string_num(8)),
        "email": "test@test.com",
        "avatar": None,
    }
    response = client.post("/user/signup", data=user_to_reg)
    assert response.status_code == 401
    assert response.json() == {"detail": "password must have at least one uppercase, one lowercase and one number"}

def test_password_short_size():
    user_to_reg = {
        "username": "test_pw_1",
        "password": (get_random_string_goodps(3)),
        "email": (get_email()),
        "avatar": None,
    }
    response = client.post("/user/signup", data=user_to_reg)
    assert response.status_code == 401
    assert response.json() == {"detail": "field size is invalid"}

def test_upload_photo():
    username = "test_up_1"
    user_to_reg={
        "username": username,
        "password": (get_random_string_goodps(8)),
        "email": (get_email()),
        "avatar": None,
    }
    response = client.post("/user/signup", data=user_to_reg)
    assert response.status_code == 200
    assert response.json() == {"detail": "User created successfully"}
    photo = b64encode(open("Test/test.jpg", "rb").read())
    filename = "test.jpg"
    response = client.post("/user/upload_photo", data={"photo": photo}, params={"username": username})
    assert response.status_code == 200
    assert response.json() == {"detail": "Photo uploaded successfully"}

def test_upload_photo_invalid_username():
    username = "test_up_2"
    photo = b64encode(open("Test/test.jpg", "rb").read())
    filename = "test.jpg"
    response = client.post("/user/upload_photo", data={"photo": photo}, params={"username": username})
    assert response.status_code == 401
    assert response.json() == {"detail": "user does not exist"}

def test_user_not_verified():
    username = "test_uv_1"
    user_to_reg={
        "username": username,
        "password": (get_random_string_goodps(8)),
        "email": (get_email()),
    }
    response = client.post("/user/signup", data=user_to_reg)
    assert response.status_code == 200
    assert response.json() == {"detail": "User created successfully"}
    response = client.post("/token", data={"username": username, "password": user_to_reg["password"]})
    assert response.status_code == 401
    assert response.json() == {"detail": {"email": user_to_reg["email"], "message": "This account is not verified"}}


def test_resend_validation_with_none_username():
    username = None
    response = client.post("/resend_validation", json={"username": username})

    assert response.status_code == 422


def test_resend_validation_with_non_existant_user():
    username = "test_rv_1"
    response = client.post("/resend_validation", json={"username": username})

    assert response.status_code == 404
    assert response.json() == {"detail": "Invalid username"}

def test_resend_validation_with_existant_user_resends_email(mocker):
    user_to_reg = {
        "username": "test_rv_2",
        "password": (get_random_string_goodps(8)),
        "email": (get_email()),
        "avatar": None,
    }

    client.post("/user/signup", data=user_to_reg)

    mock_send_email = mocker.patch("app.send_verification_email")

    response = client.post("/resend_validation", json={"username": user_to_reg["username"]})

    mock_send_email.assert_called_once_with(
        user_to_reg["email"], user_to_reg["username"], ANY
    )

    assert response.status_code == 200
    assert response.json() == {"detail": "Verification email sent"}


def test_validate_account_with_invalid_token_responds_404():
    invalid_token = "invalid-token"
    response = client.post("/validate_account", json={"token": invalid_token})

    assert response.status_code == 404


def test_validate_account_with_invalid_jwt_token_responds_404():
    invalid_token = "invalid-token"

    response = client.post("/validate_account", json={"token": invalid_token})

    assert response.status_code == 404
    assert response.json() == {"detail": "Link expired"}


def test_validate_account_with_expired_token_responds_404():
    expired_token = generate_token({"username": "testUser"}, timedelta(minutes=-1))
    response = client.post("/validate_account", json={"token": expired_token})
    assert response.status_code == 404
    assert response.json() == {"detail": "Link expired"}


def test_validate_account_with_token_without_username_responds_404():
    invalid_token = generate_token({"foo": "bar"}, timedelta(minutes=5))
    response = client.post("/validate_account", json={"token": invalid_token})

    assert response.status_code == 404
    assert response.json() == {"detail": "Username can't be empty"}


def test_validate_account_with_token_with_username_not_registered_responds_404():
    valid_token = generate_token(
        {"username": "non-existant-user"},
        timedelta(minutes=5)
    )

    response = client.post("/validate_account", json={"token": valid_token})

    assert response.status_code == 404
    assert response.json() == {"detail": "User not registered"}


def test_validate_account_with_token_with_user_registered_successful_response():
    user = {
        "username": "test_v_1",
        "password": (get_random_string_goodps(8)),
        "email": (get_email()),
        "avatar": None,
    }
    client.post("/user/signup", data=user)

    valid_token = generate_token(
        {"username": user["username"]},
        timedelta(minutes=5)
    )

    response = client.post("/validate_account", json={"token": valid_token})

    assert response.status_code == 200
    assert response.json() == {"detail": f"Account {user['username']} validated"}


def test_validate_account_with_token_with_user_registered_verifies_user():
    user = {
        "username": "test_v_2",
        "password": (get_random_string_goodps(8)),
        "email": (get_email()),
        "avatar": None,
    }
    client.post("/user/signup", data=user)

    valid_token = generate_token(
        {"username": user["username"]},
        timedelta(minutes=5)
    )

    client.post("/validate_account", json={"token": valid_token})

    db_user = get_user(user["username"])

    assert db_user.verified
