import datetime

from peewee import (
    AutoField,
    BooleanField,
    CharField,
    DateTimeField,
    DoubleField,
    ForeignKeyField,
    Model,
)

from database import db


class BaseModel(Model):
    class Meta:
        database = db


class Team(BaseModel):
    id = AutoField()
    name = CharField(null=True, default=None)
    created_at = DateTimeField(default=datetime.datetime.now)


class Experiment(BaseModel):
    id = AutoField()
    name = CharField()
    team = ForeignKeyField(Team, backref="experiments")
    is_active = BooleanField(default=False)
    started_at = DateTimeField(null=True, default=None)
    stopped_at = DateTimeField(null=True, default=None)
    created_at = DateTimeField(default=datetime.datetime.now)


class Metric(BaseModel):
    id = AutoField()
    experiment = ForeignKeyField(Experiment, backref="metrics")
    name = CharField()
    value = DoubleField()
    created_at = DateTimeField(default=datetime.datetime.now)


class SensorData(BaseModel):
    id = AutoField()
    team = ForeignKeyField(Team, backref="sensor_data")
    experiment = ForeignKeyField(Experiment, backref="sensor_data", null=True, default=None)
    acceleration_x = DoubleField()
    acceleration_y = DoubleField()
    acceleration_z = DoubleField()
    heart_rate = DoubleField()
    timestamp = DateTimeField(default=datetime.datetime.now)

    class Meta:
        table_name = "sensor_data"


ALL_MODELS = [Team, Experiment, Metric, SensorData]


NUM_TEAMS = 3


def seed_teams():
    for i in range(1, NUM_TEAMS + 1):
        Team.get_or_create(id=i)
