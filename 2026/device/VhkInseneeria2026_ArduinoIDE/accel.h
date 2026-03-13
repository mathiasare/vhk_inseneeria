#pragma once

#include <Arduino.h>

struct MotionData {
  int16_t ax, ay, az;
  int16_t gx, gy, gz;
};

void setupAccel();
void readMotionData(MotionData &data);
void logMotionData(const MotionData &data);
