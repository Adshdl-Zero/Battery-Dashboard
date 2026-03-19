import fs from "fs";
import path from "path";

const DATA_DIR = path.resolve(__dirname, "../../data");

const STATE_FILE = path.join(DATA_DIR, "battery-state.csv");

const getTelemetryFilePath = () => {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, "-");

  return path.join(DATA_DIR, `battery-telemetry-${timestamp}.csv`);
};

const TELEMETRY_FILE = getTelemetryFilePath();

export interface BatteryState {
  soc: number;
  soh: number;
  usedAh: number;
}

export interface BatteryTelemetry {
  voltage: number;
  voltage1: number;
  voltage2: number;
  current: number;
  temp1: number;
  temp2: number;
}

function ensureTelemetryFile() {
  if (!fs.existsSync(TELEMETRY_FILE)) {
    fs.writeFileSync(
      TELEMETRY_FILE,
      "timestamp,voltage,voltage1,voltage2,current,temp1,temp2\n",
    );
  }
}

function cleanupOldTelemetryFiles(maxFiles = 5) {
  try {
    const files = fs
      .readdirSync(DATA_DIR)
      .filter((file) => file.startsWith("battery-telemetry-"))
      .map((file) => ({
        name: file,
        path: path.join(DATA_DIR, file),
        time: fs.statSync(path.join(DATA_DIR, file)).mtime.getTime(),
      }))
      .sort((a, b) => b.time - a.time); // newest first

    // keep only latest maxFiles
    const filesToDelete = files.slice(maxFiles);

    for (const file of filesToDelete) {
      fs.unlinkSync(file.path);
      console.log(`Deleted old telemetry file: ${file.name}`);
    }
  } catch (err) {
    console.error("Error cleaning telemetry files:", err);
  }
}

export function saveBatteryState(state: BatteryState) {
  try {
    const timestamp = new Date().toISOString();

    const content =
      "timestamp,soc,soh,usedAh\n" +
      `${timestamp},${state.soc},${state.soh},${state.usedAh}\n`;

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
      [
        timestamp,
        data.voltage,
        data.voltage1,
        data.voltage2,
        data.current,
        data.temp1,
        data.temp2,
      ].join(",") +
      "\n";

    fs.appendFileSync(TELEMETRY_FILE, row);

    // 🔥 cleanup after writing
    cleanupOldTelemetryFiles(5);
  } catch (err) {
    console.error("Error saving telemetry:", err);
  }
}
