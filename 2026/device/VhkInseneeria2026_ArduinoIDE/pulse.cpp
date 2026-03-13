#include <PulseSensorPlayground.h>
#include "pulse.h"

PulseSensorPlayground pulseSensor;
static bool pulseReady = false;

static const int PULSE_BLINK = LED_BUILTIN;
static const int PULSE_FADE = 5;

void setupPulseSensor(int pin, int threshold) {
  pulseSensor.analogInput(pin);
  pulseSensor.blinkOnPulse(PULSE_BLINK);
  pulseSensor.fadeOnPulse(PULSE_FADE);
  pulseSensor.setSerial(Serial);
  pulseSensor.setThreshold(threshold);

  if (!pulseSensor.begin()) {
    Serial.println("PulseSensor initialization failed! Continuing without it.");
    return;
  }

  pulseReady = true;
  Serial.print("Pulse sensor initialized on A");
  Serial.print(pin);
  Serial.print(" with threshold ");
  Serial.println(threshold);
}

void updatePulseSensor() {
  if (!pulseReady) return;

  if (pulseSensor.UsingHardwareTimer) {
    delay(20);
  } else {
    pulseSensor.sawNewSample();
  }
}

bool hasNewBeat() {
  if (!pulseReady) return false;
  return pulseSensor.sawStartOfBeat();
}

int getBPM() {
  if (!pulseReady) return 0;
  return pulseSensor.getBeatsPerMinute();
}

int getRawSignal() {
  if (!pulseReady) return 0;
  return pulseSensor.getLatestSample();
}

bool isPulseSensorReady() {
  return pulseReady;
}
