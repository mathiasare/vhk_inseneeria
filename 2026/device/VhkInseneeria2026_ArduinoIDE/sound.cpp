#include "sound.h"

static int _analogPin;
static int _digitalPin;

void setupSoundSensor(int analogPin, int digitalPin) {
  _analogPin = analogPin;
  _digitalPin = digitalPin;
  pinMode(_digitalPin, INPUT);

  Serial.print("Sound sensor initialized on A");
  Serial.print(analogPin);
  Serial.print(" (analog) and D");
  Serial.print(digitalPin);
  Serial.println(" (digital)");
}

void readSoundData(SoundData &data) {
  data.analogValue = analogRead(_analogPin);
  data.digitalTriggered = digitalRead(_digitalPin) == HIGH;
}

void logSoundData(const SoundData &data) {
  Serial.print("Sound:\tAnalog=");
  Serial.print(data.analogValue);
  Serial.print("\tTriggered=");
  Serial.println(data.digitalTriggered ? "YES" : "NO");
}
