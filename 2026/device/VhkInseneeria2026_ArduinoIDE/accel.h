#pragma once

#include <Arduino.h>

struct MotionData {
  float ax = 0, ay = 0, az = 0;
  float gx = 0, gy = 0, gz = 0;
  float temperature = 0;
};

void setupAccel();
void readMotionData(MotionData &data);
void logMotionData(const MotionData &data);
