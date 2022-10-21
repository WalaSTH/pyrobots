from fastapi.testclient import TestClient
from Database.Database import *
from app import app
import random

client = TestClient(app)

# Test no matches on database.
def test_match_empty_list():
    res_list = get_match_list()

    response = client.get("/match/available")
    assert response.status_code == 404
    assert response.json() == {"No matches available"}

# Test with actual matches.
def test_match_list_with_items():
    res_list = get_match_list()

    response = client.get("/match/available")
    assert response.status_code == 200
    assert response.json() == {"Matches": res_list}

