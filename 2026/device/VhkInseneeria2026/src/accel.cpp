#include <Wire.h>
#include "I2Cdev.h"
#include "MPU6050.h"
#include "accel.h"

static MPU6050 accelgyro;

void setupAccel() {
  Wire.begin();
  accelgyro.initialize();

  Serial.print("MPU6050 init: ");
  if (accelgyro.testConnection()) {
    Serial.println("OK");
  } else {
    Serial.println("FAILED - check wiring");
  }
}

void readMotionData(MotionData &data) {
  accelgyro.getMotion6(&data.ax, &data.ay, &data.az,
                       &data.gx, &data.gy, &data.gz);
}

void logMotionData(const MotionData &data) {
  Serial.print("Accel:\t");
  Serial.print(data.ax); Serial.print("\t");
  Serial.print(data.ay); Serial.print("\t");
  Serial.print(data.az);
  Serial.print("\tGyro:\t");
  Serial.print(data.gx); Serial.print("\t");
  Serial.print(data.gy); Serial.print("\t");
  Serial.println(data.gz);
}
