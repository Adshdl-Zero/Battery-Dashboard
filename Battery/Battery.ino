#include <OneWire.h>
#include <DallasTemperature.h>

#define SENSOR_PIN_1 A1
#define VREF_PIN A0
#define ONE_WIRE_BUS_2 2

OneWire oneWire_2(ONE_WIRE_BUS_2);
DallasTemperature sensors_2(&oneWire_2);

#define VREF 5.00
#define ADC_RES 1023.0
#define IPN 400.0

const float SENSITIVITY = 1.0 / IPN;   // V/A (adjust if needed)

int analogInput_1 = A2;
float R1 = 30000.0;
float R2 = 7500.0;

float readVoltage(uint8_t pin) {
 return (analogRead(pin) * VREF) / ADC_RES;
}

void setup() {
  Serial.begin(9600);
  delay(500);

  sensors_2.begin();
}

void loop() {

  float vSig_1 = readVoltage(SENSOR_PIN_1);
  float vRef_1 = readVoltage(VREF_PIN);
  float rawCurrent_1 = (vSig_1 - vRef_1) / SENSITIVITY;

  int value_1 = analogRead(analogInput_1);
  float vout_1 = (value_1 * 5.0) / 1023.0;
  float vin_1  = vout_1 / (R2 / (R1 + R2));

  sensors_2.requestTemperatures();
  float tempC_2 = sensors_2.getTempCByIndex(0);

  Serial.print(millis()); 
  Serial.print(","); 
  Serial.print(vin_1, 2); 
  Serial.print(",");
  Serial.print(rawCurrent_1, 3);
  Serial.print(",");
  Serial.println(tempC_2, 2);

  delay(250);
}
