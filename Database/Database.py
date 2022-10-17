from pony.orm import *
from datetime import datetime
from collections import deque
import random

db = pony.orm.Database()

db.bind(provider='sqlite', filename='db.pyrobots', create_db=True)

class User(db.Entity):
    user_name = Required(str, unique=True)
    email = Required(str, unique=True)
    password = Required(str)
    verified = Required(bool)
    photo = Optional(bytes)

db.generate_mapping(create_tables=True)

# --- user functions ---
@db_session
def create_user(user_name, email, password):
        User(user_name=user_name, email=email, password=password, verified=False, photo=None)
@db_session
def get_user(user_name):
    return User.get(user_name=user_name)

@db_session
def get_user_by_email(email):
    return User.get(email=email)


@db_session
def upload_photo_db(user_name, photo):
    user = get_user(user_name)
    user.photo = photo
@db_session
def email_exists(email_address):
    return User.exists(email=email_address)

@db_session
def confirm_password(pw):
    return User.exists(password=pw)

@db_session
def user_exists(user_name):
    return User.exists(user_name=user_name)

@db_session
def user_is_verified(user_name):
    return User.get(user_name=user_name).verified

@db_session
def delete_user(user_name):
    user = get_user(user_name)
    User.delete(user)

@db_session
def get_user_photo(user_name):
    return User.get(user_name=user_name).photo

@db_session
def user_have_photo(user_name):
    return User.get(user_name=user_name).photo != ""

@db_session
def delete_user_photo(user_name):
    user = get_user(user_name)
    user.photo = ""
