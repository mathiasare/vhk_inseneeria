#define USE_ARDUINO_INTERRUPTS false
#include <PulseSensorPlayground.h>
#include "pulse.h"

static PulseSensorPlayground pulseSensor;
static bool beatDetected = false;

void setupPulseSensor(int pin, int threshold) {
  pulseSensor.analogInput(pin);
  pulseSensor.setThreshold(threshold);
  pulseSensor.begin();

  Serial.print("Pulse sensor initialized on A");
  Serial.print(pin);
  Serial.print(" with threshold ");
  Serial.println(threshold);
}

void updatePulseSensor() {
  beatDetected = pulseSensor.sawNewSample();
}

bool hasNewBeat() {
  return pulseSensor.sawStartOfBeat();
}

int getBPM() {
  return pulseSensor.getBeatsPerMinute();
}

int getRawSignal() {
  return pulseSensor.getLatestSample();
}
