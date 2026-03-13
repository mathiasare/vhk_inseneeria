#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>
#include "accel.h"

static Adafruit_MPU6050 mpu;
static bool mpuReady = false;

void setupAccel() {
  if (!mpu.begin()) {
    Serial.println("Failed to find MPU6050 chip. Check wiring!");
    return;
  }
  mpuReady = true;
  Serial.println("MPU6050 Found!");

  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);

  Serial.print("Accelerometer range: +-");
  switch (mpu.getAccelerometerRange()) {
    case MPU6050_RANGE_2_G:  Serial.println("2G"); break;
    case MPU6050_RANGE_4_G:  Serial.println("4G"); break;
    case MPU6050_RANGE_8_G:  Serial.println("8G"); break;
    case MPU6050_RANGE_16_G: Serial.println("16G"); break;
  }

  Serial.print("Gyro range: +-");
  switch (mpu.getGyroRange()) {
    case MPU6050_RANGE_250_DEG:  Serial.println("250 deg/s"); break;
    case MPU6050_RANGE_500_DEG:  Serial.println("500 deg/s"); break;
    case MPU6050_RANGE_1000_DEG: Serial.println("1000 deg/s"); break;
    case MPU6050_RANGE_2000_DEG: Serial.println("2000 deg/s"); break;
  }

  Serial.print("Filter bandwidth: ");
  switch (mpu.getFilterBandwidth()) {
    case MPU6050_BAND_260_HZ: Serial.println("260 Hz"); break;
    case MPU6050_BAND_184_HZ: Serial.println("184 Hz"); break;
    case MPU6050_BAND_94_HZ:  Serial.println("94 Hz"); break;
    case MPU6050_BAND_44_HZ:  Serial.println("44 Hz"); break;
    case MPU6050_BAND_21_HZ:  Serial.println("21 Hz"); break;
    case MPU6050_BAND_10_HZ:  Serial.println("10 Hz"); break;
    case MPU6050_BAND_5_HZ:   Serial.println("5 Hz"); break;
  }

  delay(100);
}

void readMotionData(MotionData &data) {
  if (!mpuReady) return;

  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  data.ax = a.acceleration.x;
  data.ay = a.acceleration.y;
  data.az = a.acceleration.z;
  data.gx = g.gyro.x;
  data.gy = g.gyro.y;
  data.gz = g.gyro.z;
  data.temperature = temp.temperature;
}

void logMotionData(const MotionData &data) {
  Serial.print("Accel: ");
  Serial.print(data.ax); Serial.print(", ");
  Serial.print(data.ay); Serial.print(", ");
  Serial.print(data.az); Serial.print(" m/s^2");
  Serial.print(" | Gyro: ");
  Serial.print(data.gx); Serial.print(", ");
  Serial.print(data.gy); Serial.print(", ");
  Serial.print(data.gz); Serial.print(" rad/s");
  Serial.print(" | Temp: ");
  Serial.print(data.temperature); Serial.println(" C");
}
