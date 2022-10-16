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
@app.get("/match/available", tags=["Matches"], status_code=200)
async def match_listing():
    match_list = Match.select()[:]
    res_list = []
    
    for m in match_list:
        res_list.append((m.name, m.current_players))

    for m in res_list: print(m)

    return {"Matches": res_list}
