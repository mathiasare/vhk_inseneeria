#pragma once

#include <Arduino.h>

void setupPulseSensor(int pin, int threshold);
void updatePulseSensor();
bool hasNewBeat();
int getBPM();
int getRawSignal();
