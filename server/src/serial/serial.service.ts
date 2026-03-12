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

      if (parts.length < 4) return; // ensure full line received

      const voltage = isNaN(parseFloat(parts[1])) ? 0 : parseFloat(parts[1]);
      const current = -isNaN(parseFloat(parts[2])) ? 0 : parseFloat(parts[2]);
      const temperature = isNaN(parseFloat(parts[3]))
        ? 0
        : parseFloat(parts[3]);

      const updatedBattery = updateBatteryLogic(voltage, current, temperature);
      broadcast(updatedBattery);
    } catch (err) {
      console.log("Serial parse error:", err);
    }
  });
};
