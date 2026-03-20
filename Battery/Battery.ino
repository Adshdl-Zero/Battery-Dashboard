#include <OneWire.h>
#include <DallasTemperature.h>

// -------- CURRENT SENSOR --------
#define SENSOR_PIN_1 A1
#define VREF_PIN A0

#define VREF 5.00
#define ADC_RES 1023.0
#define IPN 200.0
const float SENSITIVITY = 1.0 / IPN;

// -------- VOLTAGE SENSORS --------
int voltagePin_1 = A2;
int voltagePin_2 = A4;

float R1 = 30000.0;
float R2 = 7500.0;

// -------- TEMP SENSORS --------
#define ONE_WIRE_BUS_1 2
#define ONE_WIRE_BUS_2 4

OneWire oneWire_1(ONE_WIRE_BUS_1);
OneWire oneWire_2(ONE_WIRE_BUS_2);

DallasTemperature sensors_1(&oneWire_1);
DallasTemperature sensors_2(&oneWire_2);

float readVoltage(uint8_t pin) {
  return (analogRead(pin) * VREF) / ADC_RES;
}

float getBatteryVoltage(int pin) {
  int value = analogRead(pin);
  float vout = (value * VREF) / ADC_RES;
  float vin  = vout / (R2 / (R1 + R2));
  return vin;
}

void setup() {
  Serial.begin(9600);
  delay(500);

  sensors_1.begin();
  sensors_2.begin();
}

void loop() {

  float vSig = readVoltage(SENSOR_PIN_1);
  float vRef = readVoltage(VREF_PIN);
  float current = (vSig - vRef) / SENSITIVITY;

  float vin_1 = getBatteryVoltage(voltagePin_1);
  float vin_2 = getBatteryVoltage(voltagePin_2);

  sensors_1.requestTemperatures();
  float temp1 = sensors_1.getTempCByIndex(0);

  sensors_2.requestTemperatures();
  float temp2 = sensors_2.getTempCByIndex(0);

  // ---- SERIAL OUTPUT ----
  Serial.print(millis());
  Serial.print(",");

  Serial.print(vin_1, 2);
  Serial.print(",");

  Serial.print(vin_2, 2);
  Serial.print(",");

  Serial.print(current, 3);
  Serial.print(",");

  Serial.print(temp1, 2);
  Serial.print(",");

  Serial.println(temp2, 2);

  delay(250);
}
