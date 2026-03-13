import csv
import datetime
import io

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from models import Experiment, Metric, SensorData
from schemas import ExperimentOut, MetricCreate, MetricOut, SensorDataOut

router = APIRouter(prefix="/experiments", tags=["experiments"])


def _get_experiment(experiment_id: int) -> Experiment:
    try:
        return Experiment.get_by_id(experiment_id)
    except Experiment.DoesNotExist:
        raise HTTPException(status_code=404, detail="Experiment not found")


# ── Experiment lifecycle ─────────────────────────────────

@router.post("/{experiment_id}/start", response_model=ExperimentOut)
def start_experiment(experiment_id: int):
    exp = _get_experiment(experiment_id)

    (
        Experiment.update(is_active=False)
        .where(Experiment.team == exp.team_id, Experiment.is_active == True)  # noqa: E712
        .execute()
    )

    exp.is_active = True
    exp.started_at = datetime.datetime.now()
    exp.stopped_at = None
    exp.save()

    return ExperimentOut(
        id=exp.id,
        name=exp.name,
        team_id=exp.team_id,
        is_active=exp.is_active,
        started_at=exp.started_at,
        stopped_at=exp.stopped_at,
        created_at=exp.created_at,
    )


@router.post("/{experiment_id}/stop", response_model=ExperimentOut)
def stop_experiment(experiment_id: int):
    exp = _get_experiment(experiment_id)

    now = datetime.datetime.now()
    exp.is_active = False
    exp.stopped_at = now
    exp.save()

    if exp.started_at:
        (
            SensorData.update(experiment=exp.id)
            .where(
                SensorData.team == exp.team_id,
                SensorData.timestamp >= exp.started_at,
                SensorData.timestamp <= now,
                SensorData.experiment.is_null(),
            )
            .execute()
        )

    return ExperimentOut(
        id=exp.id,
        name=exp.name,
        team_id=exp.team_id,
        is_active=exp.is_active,
        started_at=exp.started_at,
        stopped_at=exp.stopped_at,
        created_at=exp.created_at,
    )


# ── Metrics ──────────────────────────────────────────────

@router.post("/{experiment_id}/metrics", response_model=MetricOut, status_code=201)
def add_metric(experiment_id: int, body: MetricCreate):
    _get_experiment(experiment_id)
    m = Metric.create(experiment=experiment_id, name=body.name, value=body.value)
    return MetricOut(
        id=m.id,
        experiment_id=m.experiment_id,
        name=m.name,
        value=m.value,
        created_at=m.created_at,
    )


@router.get("/{experiment_id}/metrics", response_model=list[MetricOut])
def list_metrics(experiment_id: int):
    _get_experiment(experiment_id)
    return [
        MetricOut(
            id=m.id,
            experiment_id=m.experiment_id,
            name=m.name,
            value=m.value,
            created_at=m.created_at,
        )
        for m in Metric.select().where(Metric.experiment == experiment_id)
    ]


# ── Sensor data ──────────────────────────────────────────

@router.get("/{experiment_id}/sensor-data", response_model=list[SensorDataOut])
def list_sensor_data(experiment_id: int):
    _get_experiment(experiment_id)
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
        for s in SensorData.select().where(SensorData.experiment == experiment_id)
    ]


# ── CSV export ───────────────────────────────────────────

@router.get("/{experiment_id}/export/data.csv")
def export_combined_csv(experiment_id: int):
    _get_experiment(experiment_id)

    metrics = list(
        Metric.select()
        .where(Metric.experiment == experiment_id)
        .order_by(Metric.name)
    )
    metric_names = list(dict.fromkeys(m.name for m in metrics))
    metric_values = {m.name: m.value for m in metrics}

    sensor_columns = [
        "timestamp", "acceleration_x", "acceleration_y", "acceleration_z", "heart_rate",
    ]

    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(sensor_columns + metric_names)

    for s in (
        SensorData.select()
        .where(SensorData.experiment == experiment_id)
        .order_by(SensorData.timestamp)
    ):
        row = [
            s.timestamp.isoformat(),
            s.acceleration_x,
            s.acceleration_y,
            s.acceleration_z,
            s.heart_rate,
        ]
        row += [metric_values.get(name, "") for name in metric_names]
        writer.writerow(row)

    buf.seek(0)
    return StreamingResponse(
        buf,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=experiment_{experiment_id}.csv"},
    )
