import json
import logging

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from models import Experiment, SensorData, Team

router = APIRouter(tags=["websocket"])
logger = logging.getLogger(__name__)


@router.websocket("/ws/teams/{team_id}")
async def team_ws(websocket: WebSocket, team_id: int):
    try:
        team = Team.get_by_id(team_id)
    except Team.DoesNotExist:
        await websocket.close(code=404, reason="Team not found")
        return

    await websocket.accept()
    logger.info("Device for team %s connected", team_id)

    try:
        while True:
            raw = await websocket.receive_text()
            try:
                data = json.loads(raw)
            except json.JSONDecodeError:
                await websocket.send_json({"error": "Invalid JSON"})
                continue

            acc = data.get("acceleration", {})
            hr = data.get("heart_rate")
            if hr is None or not isinstance(acc, dict):
                await websocket.send_json({"error": "Missing acceleration or heart_rate"})
                continue

            active_exp = (
                Experiment.select()
                .where(Experiment.team == team_id, Experiment.is_active == True)  # noqa: E712
                .first()
            )

            SensorData.create(
                team=team_id,
                experiment=active_exp.id if active_exp else None,
                acceleration_x=float(acc.get("x", 0)),
                acceleration_y=float(acc.get("y", 0)),
                acceleration_z=float(acc.get("z", 0)),
                heart_rate=float(hr),
            )

            await websocket.send_json({"status": "ok"})

    except WebSocketDisconnect:
        logger.info("Device for team %s disconnected", team_id)
