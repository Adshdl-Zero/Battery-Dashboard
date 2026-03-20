import fs from "fs";
import path from "path";
import { config } from "../config/env";

const DATA_DIR = path.resolve(__dirname, "../../data");

const R_NEW = config.R_NEW;

interface TelemetryRow {
  voltage: number;
  current: number;
}

function getLatestTelemetryFile(): string | null {
  if (!fs.existsSync(DATA_DIR)) return null;

  const files = fs.readdirSync(DATA_DIR);

  const telemetryFiles = files
    .filter((f) => f.startsWith("battery-telemetry") && f.endsWith(".csv"))
    .map((f) => ({
      name: f,
      time: fs.statSync(path.join(DATA_DIR, f)).mtime.getTime(),
    }))
    .sort((a, b) => b.time - a.time);

  if (telemetryFiles.length === 0) return null;

  return path.join(DATA_DIR, telemetryFiles[0].name);
}

function readTelemetry(filePath: string): TelemetryRow[] {
  const data = fs.readFileSync(filePath, "utf8");

  const lines = data.trim().split("\n");

  lines.shift();

  const rows: TelemetryRow[] = [];

  for (const line of lines) {
    const parts = line.split(",");

    if (parts.length < 4) continue;

    const voltage = parseFloat(parts[1]);
    const current = parseFloat(parts[2]);

    if (!isNaN(voltage) && !isNaN(current)) {
      rows.push({ voltage, current });
    }
  }

  return rows;
}

export function calculateInternalResistance(): number | null {
  const file = getLatestTelemetryFile();
  if (!file) return null;

  const rows = readTelemetry(file);

  if (rows.length < 2) return null;

  const resistances: number[] = [];

  for (let i = 1; i < rows.length; i++) {
    const dv = rows[i].voltage - rows[i - 1].voltage;
    const di = rows[i].current - rows[i - 1].current;

    if (Math.abs(di) < 1) continue;

    const r = Math.abs(dv / di);

    if (r > 0 && r < 0.5) {
      resistances.push(r);
    }
  }

  if (resistances.length === 0) return null;

  resistances.sort((a, b) => a - b);

  const mid = Math.floor(resistances.length / 2);

  const median =
    resistances.length % 2 === 0
      ? (resistances[mid - 1] + resistances[mid]) / 2
      : resistances[mid];

  return median;
}

export function calculateSOH({
  peakCurrent,
  voltageBefore,
  voltageDuring,
}: {
  peakCurrent: number;
  voltageBefore: number;
  voltageDuring: number;
}): number | null {
  if (peakCurrent <= 0 || voltageBefore <= 0 || voltageDuring <= 0) {
    return null;
  }

  const deltaV = voltageBefore - voltageDuring;

  if (deltaV <= 0) return null;

  const rMeasured = deltaV / peakCurrent;

  console.log("R_measured:", rMeasured);

  let soh = (R_NEW / rMeasured) * 100;

  if (soh > 100) soh = 100;
  if (soh < 0) soh = 0;

  return soh;
}
