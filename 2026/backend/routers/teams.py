from fastapi import APIRouter, HTTPException

from models import Experiment, Team
from schemas import ExperimentCreate, ExperimentOut, TeamOut, TeamRegister

router = APIRouter(prefix="/teams", tags=["teams"])


def _get_team(team_id: int) -> Team:
    try:
        return Team.get_by_id(team_id)
    except Team.DoesNotExist:
        raise HTTPException(status_code=404, detail="Team not found")


@router.get("", response_model=list[TeamOut])
def list_teams():
    return [
        TeamOut(id=t.id, name=t.name, created_at=t.created_at)
        for t in Team.select()
    ]


@router.post("/{team_id}/register", response_model=TeamOut)
def register_team(team_id: int, body: TeamRegister):
    team = _get_team(team_id)
    team.name = body.name
    team.save()
    return TeamOut(id=team.id, name=team.name, created_at=team.created_at)


@router.get("/{team_id}/experiments", response_model=list[ExperimentOut])
def list_experiments(team_id: int):
    _get_team(team_id)
    return [
        ExperimentOut(
            id=e.id,
            name=e.name,
            team_id=e.team_id,
            is_active=e.is_active,
            started_at=e.started_at,
            stopped_at=e.stopped_at,
            created_at=e.created_at,
        )
        for e in Experiment.select().where(Experiment.team == team_id)
    ]


@router.post("/{team_id}/experiments", response_model=ExperimentOut, status_code=201)
def create_experiment(team_id: int, body: ExperimentCreate):
    _get_team(team_id)
    e = Experiment.create(name=body.name, team=team_id)
    return ExperimentOut(
        id=e.id,
        name=e.name,
        team_id=e.team_id,
        is_active=e.is_active,
        started_at=e.started_at,
        stopped_at=e.stopped_at,
        created_at=e.created_at,
    )
