#include "connection.h"
#include "secrets.h"

static WiFiClient wifi;
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

  Serial.print("Connecting to ");
  Serial.print(ssid);

  int status = WL_IDLE_STATUS;
  int attempts = 0;
  while (status != WL_CONNECTED && attempts < 10) {
    Serial.print(".");
    status = WiFi.begin(ssid, pass);
    delay(3000);
    attempts++;
  }

  if (status != WL_CONNECTED) {
    Serial.println("\nFailed to connect after 10 attempts.");
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

  ws.begin(path);

  if (ws.connected()) {
    Serial.println("WebSocket connected!");
  } else {
    Serial.println("WebSocket connection failed");
  }
}

bool isWiFiConnected() {
  return WiFi.status() == WL_CONNECTED;
}

bool isWebSocketConnected() {
  return ws.connected();
}
