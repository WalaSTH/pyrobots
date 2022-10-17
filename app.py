from fastapi import FastAPI
from Database.Database import *
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException
from pydantic_models import *

origins = ["http://localhost:3000", "localhost:3000", "http://localhost:3000/", "localhost:3000/"]

tags_metadata = [{"name": "matches", "description": "Operations with matches"}]

app = FastAPI(
    title = "PyRobots"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#match creation
@app.post("/match/create", tags=["Matches"], status_code=201)
def match_creation(match_data: TempMatch):

    if (match_data.robot_id > check_robot_quantity()):
        raise HTTPException (
            status_code=404,
            detail="No robot with such ID."
        )

    if (match_data.creator > check_user_quantity()):
        raise HTTPException (
            status_code=404,
            detail="No user with such ID."
        )

    if (match_data.password == None):
        match_data.password = ''

    if (check_robot_ownership(match_data.robot_id, match_data.creator)):
        raise HTTPException (
            status_code=400,
            detail='That robot does not belong to that user.'
        )

    if (check_match_name_exists(match_data.name)):
        raise HTTPException (
            status_code=409,
            detail='A match with this name already exists.'
        )

    match_id = create_match(
        match_data.name,
        match_data.password,
        match_data.games_per_match,
        match_data.rounds,
        match_data.min_players,
        match_data.max_players,
        match_data.creator,
        match_data.robot_id
    )

    return {"detail": "Match created successfully.", "id": match_id}
