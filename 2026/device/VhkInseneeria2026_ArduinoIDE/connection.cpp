#include "connection.h"
#include "secrets.h"

static WiFiSSLClient wifi;
WebSocketClient ws(wifi, WS_SERVER, WS_PORT);

void connectWiFi(const char* ssid, const char* pass) {
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("WiFi module not found!");
    while (true)
      ;
  }

  String fv = WiFi.firmwareVersion();
  Serial.print("WiFiNINA firmware: ");
  Serial.println(fv);
  if (fv < WIFI_FIRMWARE_LATEST_VERSION) {
    Serial.println("WARNING: outdated firmware — update via WiFiNINAFirmwareUpdater");
  }

  Serial.print("Connecting to ");
  Serial.print(ssid);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 10) {
    Serial.print(".");
    WiFi.begin(ssid, pass);
    delay(10000);
    attempts++;
  }

  if (WiFi.status() != WL_CONNECTED) {
    Serial.print("\nFailed to connect after 10 attempts (status=");
    Serial.print(WiFi.status());
    Serial.println(")");
    while (true)
      ;
  }

  Serial.println(" connected!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
  Serial.print("RSSI: ");
  Serial.print(WiFi.RSSI());
  Serial.println(" dBm");
}

void connectWebSocket(const char* path) {
  Serial.print("Connecting WebSocket to ");
  Serial.print(WS_SERVER);
  Serial.print(":");
  Serial.println(WS_PORT);

  for (int attempt = 0; attempt < 5; attempt++) {
    if (attempt > 0) {
      Serial.print("Retry ");
      Serial.print(attempt);
      Serial.println("/4...");
    }

    delay(2000);
    int status = ws.begin(path);

    if (ws.connected()) {
      Serial.println("WebSocket connected!");
      return;
    }

    Serial.print("WebSocket failed (status ");
    Serial.print(status);
    Serial.println(")");
  }

  Serial.println("WebSocket connection failed after 5 attempts");
}

bool isWiFiConnected() {
  return WiFi.status() == WL_CONNECTED;
}

bool isWebSocketConnected() {
  return ws.connected();
}
