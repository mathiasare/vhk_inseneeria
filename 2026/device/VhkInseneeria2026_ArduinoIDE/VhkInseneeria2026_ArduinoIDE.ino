#include "secrets.h"
#include "connection.h"
#include "pulse.h"
#include "accel.h"
#include "sound.h"

const int PULSE_PIN = A0;
const int PULSE_THRESHOLD = 550;

const int SOUND_ANALOG_PIN = A1;
const int SOUND_DIGITAL_PIN = 2;

unsigned long lastSendTime = 0;
const unsigned long SEND_INTERVAL = 500;

void setup() {
  Serial.begin(115200);
  while (!Serial) {
    ;
  }
  delay(1000);

  setupPulseSensor(PULSE_PIN, PULSE_THRESHOLD);
  setupAccel();
  setupSoundSensor(SOUND_ANALOG_PIN, SOUND_DIGITAL_PIN);
  connectWiFi(WIFI_SSID, WIFI_PASS);
  connectWebSocket(WS_PATH);
}

void loop() {
  updatePulseSensor();

  if (hasNewBeat()) {
    int bpm = getBPM();
    Serial.print("Beat detected! BPM: ");
    Serial.println(bpm);
  }

  if (!isWiFiConnected()) {
    Serial.println("WiFi lost, reconnecting...");
    connectWiFi(WIFI_SSID, WIFI_PASS);
    connectWebSocket(WS_PATH);
    return;
  }

  if (!isWebSocketConnected()) {
    Serial.println("WebSocket disconnected, reconnecting...");
    delay(2000);
    connectWebSocket(WS_PATH);
    return;
  }

  int msgSize = ws.parseMessage();
  if (msgSize > 0) {
    String msg = ws.readString();
    Serial.print("Server: ");
    Serial.println(msg);
  }

  if (millis() - lastSendTime > SEND_INTERVAL) {
    int bpm = getBPM();
    MotionData motion;
    readMotionData(motion);
   SoundData sound;
    readSoundData(sound);

    Serial.print("BPM: ");
    Serial.print(bpm);
    Serial.print(" | Accel: ");
    Serial.print(motion.ax); Serial.print(", ");
    Serial.print(motion.ay); Serial.print(", ");
    Serial.println(motion.az);
    Serial.print(" | ");
    logSoundData(sound);

    if (isWebSocketConnected()) {
      ws.beginMessage(TYPE_TEXT);
      ws.print("{\"heart_rate\":");
      ws.print(bpm);
      ws.print(",\"acceleration\":{\"x\":");
      ws.print(motion.ax);
      ws.print(",\"y\":");
      ws.print(motion.ay);
      ws.print(",\"z\":");
      ws.print(motion.az);
      ws.print("},\"sound\":{\"analog\":");
      ws.print(sound.analogValue);
      ws.print(",\"triggered\":");
      ws.print(sound.digitalTriggered ? "true" : "false");
      ws.print("}}");
      ws.endMessage();
    }

    lastSendTime = millis();
  }
}
