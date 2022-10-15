from fastapi import FastAPI
from Database.Database import *
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Union

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
@app.post("/match/create", tags=["Matches"], status_code=200)
async def match_creation(
    name: str,
    min_players: int,
    max_players: int,
    gamesPerMatch: int,
    rounds: int,
    robot: int,
    creator: int,
    password: Union[str, None] = None
    ):

    if (password == None):
        password = ''
    
    create_match(
        name, 
        password, 
        gamesPerMatch, 
        rounds, 
        min_players, 
        max_players,
        creator
    )
    return {"detail": "Match created successfully"}
