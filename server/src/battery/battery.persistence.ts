import fs from "fs";
import path from "path";

const STATE_FILE = path.resolve(__dirname, "../../data/battery-state.csv");
const TELEMETRY_FILE = path.resolve(
  __dirname,
  "../../data/battery-telemetry.csv",
);

export interface BatteryState {
  soc: number;
  soh: number;
  usedAh: number;
}

export interface BatteryTelemetry {
  voltage: number;
  current: number;
  temperature: number;
}

function ensureTelemetryFile() {
  if (!fs.existsSync(TELEMETRY_FILE)) {
    fs.writeFileSync(TELEMETRY_FILE, "timestamp,voltage,current,temperature\n");
  }
}

export function saveBatteryState(state: BatteryState) {
  try {
    const timestamp = new Date().toISOString();

    const content =
      "timestamp,soc,soh,usedAh\n" +
      `${timestamp},${state.soc},${state.soh},${state.usedAh}\n`;

    // overwrite file → only latest value stored
    fs.writeFileSync(STATE_FILE, content);
  } catch (err) {
    console.error("Error saving battery state:", err);
  }
}

export function saveBatteryTelemetry(data: BatteryTelemetry) {
  try {
    ensureTelemetryFile();

    const timestamp = new Date().toISOString();

    const row =
      [timestamp, data.voltage, data.current, data.temperature].join(",") +
      "\n";

    // append readings
    fs.appendFileSync(TELEMETRY_FILE, row);
  } catch (err) {
    console.error("Error saving telemetry:", err);
  }
}
