#pragma once

#include <Arduino.h>
#include <PulseSensorPlayground.h>

extern PulseSensorPlayground pulseSensor;

void setupPulseSensor(int pin, int threshold);
void updatePulseSensor();
bool hasNewBeat();
int getBPM();
int getRawSignal();
bool isPulseSensorReady();
