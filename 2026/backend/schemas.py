from datetime import datetime

from pydantic import BaseModel


# ── Teams ────────────────────────────────────────────────

class TeamRegister(BaseModel):
    name: str


class TeamOut(BaseModel):
    id: int
    name: str | None
    created_at: datetime


# ── Experiments ──────────────────────────────────────────

class ExperimentCreate(BaseModel):
    name: str


class ExperimentOut(BaseModel):
    id: int
    name: str
    team_id: int
    is_active: bool
    started_at: datetime | None
    stopped_at: datetime | None
    created_at: datetime


# ── Metrics ──────────────────────────────────────────────

class MetricCreate(BaseModel):
    name: str
    value: float


class MetricOut(BaseModel):
    id: int
    experiment_id: int
    name: str
    value: float
    created_at: datetime


# ── Sensor Data ──────────────────────────────────────────

class SensorDataOut(BaseModel):
    id: int
    team_id: int
    experiment_id: int | None
    acceleration_x: float
    acceleration_y: float
    acceleration_z: float
    heart_rate: float
    timestamp: datetime
