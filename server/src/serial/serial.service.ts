import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import { updateBatteryLogic } from "../battery/battery.logic";
import { broadcast } from "../websocket/socket";
import { config } from "../config/env";

export const initSerial = () => {
  const port = new SerialPort({
    path: config.SERIAL_PORT,
    baudRate: config.SERIAL_BAUD_RATE,
  });

  const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

  port.on("open", () => {
    console.log(`Serial connected on ${config.SERIAL_PORT}`);
  });

  port.on("error", (err) => {
    console.error("Serial Error:", err.message);
  });

  parser.on("data", (line: string) => {
    try {
      const parts = line.trim().split(",");

      // Expected format from Battery.ino:
      // millis, vin_1, vin_2, current, temp1, temp2
      if (parts.length < 6) return;

      const vin1 = parseFloat(parts[1]);
      const vin2 = parseFloat(parts[2]);
      const current = parseFloat(parts[3]);
      const temp1 = parseFloat(parts[4]);
      const temp2 = parseFloat(parts[5]);

      const voltage1 = isNaN(vin1) ? 0 : vin1;
      const voltage2 = isNaN(vin2) ? 0 : vin2;
      const measuredCurrent = isNaN(current) ? 0 : current;

      // Use total pack voltage for logic (series cells) and keep both voltages in telemetry.
      const packVoltage = voltage1 + voltage2;

      const updatedBattery = updateBatteryLogic(
        packVoltage,
        measuredCurrent,
        isNaN(temp1) ? 0 : temp1,
        isNaN(temp2) ? 0 : temp2,
        voltage1,
        voltage2,
      );

      broadcast(updatedBattery);
    } catch (err) {
      console.log("Serial parse error:", err);
    }
  });
};
