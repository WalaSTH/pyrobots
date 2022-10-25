from fastapi.testclient import TestClient
from Database.Database import *
from Test.auxiliar_functions import *
from app import app
import random
from pydantic_models import MAX_ROUNDS_PER_GAME, MAX_GAMES_PER_MATCH

client = TestClient(app)


# List robots on empty database
def test_robot_listing_empty():
    res_list = get_robot_list()

    response = client.get("/robot/available")

    assert response.status_code == 404
    assert response.json() == {"No Robots available"}

# List robots
def test_robot_listing_with_items():
    res_list = get_robot_list()

    response = client.get("/robot/available")

    assert response.status_code == 200
    assert response.json() == {"Robots": res_list}