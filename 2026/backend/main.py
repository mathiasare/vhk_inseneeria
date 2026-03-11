from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import db
from models import ALL_MODELS, seed_teams
from routers import experiments, teams, websocket


@asynccontextmanager
async def lifespan(app: FastAPI):
    db.connect()
    db.drop_tables(ALL_MODELS)
    db.create_tables(ALL_MODELS)
    seed_teams()
    yield
    if not db.is_closed():
        db.close()


app = FastAPI(title="IoT ML Workshop", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(teams.router)
app.include_router(experiments.router)
app.include_router(websocket.router)


@app.get("/")
def root():
    return {"message": "IoT ML Workshop API"}
