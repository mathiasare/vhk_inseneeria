#pragma once

#include <Arduino.h>
#include <WiFiNINA.h>
#include <ArduinoHttpClient.h>

extern WebSocketClient ws;

void connectWiFi(const char* ssid, const char* pass);
void connectWebSocket(const char* path);
bool isWiFiConnected();
bool isWebSocketConnected();
