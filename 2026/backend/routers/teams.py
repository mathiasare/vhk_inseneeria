from fastapi import APIRouter, HTTPException

from models import Experiment, SensorData, Team
from schemas import ExperimentCreate, ExperimentOut, SensorDataOut, TeamOut, TeamRegister

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


@router.get("/{team_id}/sensor-data/unassigned", response_model=list[SensorDataOut])
def list_unassigned_sensor_data(team_id: int):
    _get_team(team_id)
    return [
        SensorDataOut(
            id=s.id,
            team_id=s.team_id,
            experiment_id=s.experiment_id,
            acceleration_x=s.acceleration_x,
            acceleration_y=s.acceleration_y,
            acceleration_z=s.acceleration_z,
            heart_rate=s.heart_rate,
            timestamp=s.timestamp,
        )
        for s in (
            SensorData.select()
            .where(SensorData.team == team_id, SensorData.experiment.is_null())
            .order_by(SensorData.timestamp.desc())
            .limit(200)
        )
    ]
