#pragma once

#include <Arduino.h>

struct SoundData {
  int analogValue;
  bool digitalTriggered;
};

void setupSoundSensor(int analogPin, int digitalPin);
void readSoundData(SoundData &data);
void logSoundData(const SoundData &data);
