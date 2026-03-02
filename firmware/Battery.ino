#include <OneWire.h>
#include <DallasTemperature.h>

#define SENSOR_PIN_1 A0
// #define SENSOR_PIN_2 A2
// #define ONE_WIRE_BUS_1 2
#define ONE_WIRE_BUS_2 8

// OneWire oneWire_1(ONE_WIRE_BUS_1);
// DallasTemperature sensors_1(&oneWire_1);

OneWire oneWire_2(ONE_WIRE_BUS_2);
DallasTemperature sensors_2(&oneWire_2);

#define VREF 5.00
#define ADC_RES 1023.0

#define IPN 50.0
const float SENSITIVITY = 1.0 / IPN;   // V/A (adjust if needed)
float zeroOffset_1 = 2.5;
float zeroOffset_2 = 2.5;

int analogInput_1 = A1;
// int analogInput_2 = A3;
float R1 = 30000.0;
float R2 = 7500.0;

float readVoltage(uint8_t pin) {
 return (analogRead(pin) * VREF) / ADC_RES;
}

void calibrateZeroOffset() {
  Serial.println("Calibrating both current sensors...");
  delay(3000);   // allow sensor to settle

  long sum_1 = 0;
  // long sum_2 = 0;
  const int CAL_SAMPLES = 500;

  for (int i = 0; i < CAL_SAMPLES; i++) {
    sum_1 += analogRead(SENSOR_PIN_1);
    // sum_2 += analogRead(SENSOR_PIN_2);
    delay(2);
  }

  float avgADC_1 = sum_1 / (float)CAL_SAMPLES;
  zeroOffset_1 = (avgADC_1 * VREF) / ADC_RES;
  // float avgADC_2 = sum_2 / (float)CAL_SAMPLES;
  // zeroOffset_2 = (avgADC_2 * VREF) / ADC_RES;

  Serial.print("Zero offset for sensor 1 (V): ");
  Serial.println(zeroOffset_1, 5);
  // Serial.print("Zero offset for sensor 2 (V): ");
  // Serial.println(zeroOffset_2, 5);
  
  Serial.println("calibration done");

}

void setup() {
  Serial.begin(9600);
  delay(500);

  // sensors_1.begin();
  sensors_2.begin();

  calibrateZeroOffset();
}

void loop() {

  float vSig_1 = readVoltage(SENSOR_PIN_1);
  float rawCurrent_1 = (vSig_1 - zeroOffset_1) / SENSITIVITY;
  // float vSig_2 = readVoltage(SENSOR_PIN_2);
  // float rawCurrent_2 = (vSig_2 - zeroOffset_2) / SENSITIVITY;

  int value_1 = analogRead(analogInput_1);
  float vout_1 = (value_1 * 5.0) / 1023.0;
  float vin_1  = vout_1 / (R2 / (R1 + R2));

  // int value_2 = analogRead(analogInput_2);
  // float vout_2 = (value_2 * 5.0) / 1023.0;
  // float vin_2  = vout_2 / (R2 / (R1 + R2));

  // sensors_1.requestTemperatures();
  // float tempC_1 = sensors_1.getTempCByIndex(0);
  sensors_2.requestTemperatures();
  float tempC_2 = sensors_2.getTempCByIndex(0);

  // ---- Output (CSV-ready) ----
  Serial.print(millis()); 
  Serial.print(","); 
  Serial.print(vin_1, 2); 
  Serial.print(",");
  Serial.print(rawCurrent_1, 3);
  Serial.print(",");
  Serial.print(tempC_1, 2);
  // Serial.print(","); 
  // Serial.print(vin_2, 2); 
  // Serial.print(",");
  // Serial.print(rawCurrent_2, 3);
  // Serial.print(",");
  // Serial.println(tempC_2, 2);

  delay(500);
}
