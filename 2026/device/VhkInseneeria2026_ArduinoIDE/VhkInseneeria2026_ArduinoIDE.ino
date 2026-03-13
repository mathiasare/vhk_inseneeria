#include "secrets.h"
#include "connection.h"
#include "pulse.h"
#include "accel.h"

const int PULSE_PIN = A0;
const int PULSE_THRESHOLD = 550;

unsigned long lastSendTime = 0;
const unsigned long SEND_INTERVAL = 1000;

void setup() {
  Serial.begin(115200);
  unsigned long serialStart = millis();
  while (!Serial && millis() - serialStart < 3000) {
    delay(10);
  }
  delay(1000);

  Serial.println("Starting setup...");

  setupPulseSensor(PULSE_PIN, PULSE_THRESHOLD);

  Serial.println("Initializing MPU6050...");
  setupAccel();

  connectWiFi(WIFI_SSID, WIFI_PASS);
  connectWebSocket(WS_PATH);

  Serial.println("Setup complete.");
}

void loop() {
  updatePulseSensor();

  if (hasNewBeat()) {
    Serial.print("Beat detected! BPM: ");
    Serial.println(getBPM());
  }

  if (!isWiFiConnected()) {
    Serial.println("WiFi lost, reconnecting...");
    connectWiFi(WIFI_SSID, WIFI_PASS);
    connectWebSocket(WS_PATH);
  } else if (!isWebSocketConnected()) {
    Serial.println("WebSocket disconnected, reconnecting...");
    delay(2000);
    connectWebSocket(WS_PATH);
  } else {
    int msgSize = ws.parseMessage();
    if (msgSize > 0) {
      String msg = ws.readString();
      Serial.print("Server: ");
      Serial.println(msg);
    }
  }

  if (millis() - lastSendTime > SEND_INTERVAL) {
    int bpm = getBPM();
    MotionData motion;
    readMotionData(motion);

    Serial.print("BPM: ");
    Serial.print(bpm);
    Serial.print(" | ");
    logMotionData(motion);

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
      ws.print("}}");
      ws.endMessage();
    }

    lastSendTime = millis();
  }
}
