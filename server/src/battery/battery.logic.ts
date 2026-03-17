import {
  battery,
  ratedCapacityAh,
  addUsedAh,
  getUsedAh,
} from "./battery.store";

import { saveBatteryState, saveBatteryTelemetry } from "./battery.persistence";

import { calculateSOH } from "./battery.soh";
import { config } from "../config/env";

let lastTime = Date.now();

const ALPHA = config.FILTER_ALPHA;
const CURRENT_START_THRESHOLD = config.CURRENT_START_THRESHOLD;
const CURRENT_END_THRESHOLD = config.CURRENT_END_THRESHOLD;
const MIN_EVENT_DURATION = config.MIN_EVENT_DURATION;
const DEBOUNCE_COUNT = config.DEBOUNCE_COUNT;
const NOISE_THRESHOLD = config.CURRENT_NOISE_THRESHOLD;

let filteredCurrent = 0;

let inLoadEvent = false;
let peakCurrent = 0;
let eventStartTime = 0;

let startCounter = 0;
let endCounter = 0;

export const updateBatteryLogic = (
  voltage: number,
  current: number,
  temperature: number,
) => {
  const now = Date.now();
  const dt = (now - lastTime) / 1000;
  lastTime = now;

  filteredCurrent = ALPHA * current + (1 - ALPHA) * filteredCurrent;

  if (Math.abs(filteredCurrent) < NOISE_THRESHOLD) {
    filteredCurrent = 0;
  }

  const deltaAh = (filteredCurrent * dt) / 3600;
  addUsedAh(deltaAh);

  const usedAh = getUsedAh();
  const soc = 100 - (usedAh / ratedCapacityAh) * 100;

  battery.soc = Math.max(0, Math.min(100, soc));
  battery.voltage = voltage;
  battery.current = filteredCurrent;
  battery.temperature = temperature;

  saveBatteryTelemetry({
    voltage,
    current: filteredCurrent,
    temperature,
  });

  if (!inLoadEvent && Math.abs(filteredCurrent) > CURRENT_START_THRESHOLD) {
    startCounter++;

    if (startCounter >= DEBOUNCE_COUNT) {
      inLoadEvent = true;
      peakCurrent = Math.abs(filteredCurrent);
      eventStartTime = now;
      startCounter = 0;
    }
  } else {
    startCounter = 0;
  }

  if (inLoadEvent) {
    if (Math.abs(filteredCurrent) > peakCurrent) {
      peakCurrent = Math.abs(filteredCurrent);
    }
  }

  if (inLoadEvent && Math.abs(filteredCurrent) < CURRENT_END_THRESHOLD) {
    endCounter++;

    if (endCounter >= DEBOUNCE_COUNT) {
      const eventDuration = (now - eventStartTime) / 1000;

      if (
        peakCurrent > CURRENT_START_THRESHOLD &&
        eventDuration > MIN_EVENT_DURATION
      ) {
        const soh = calculateSOH();

        if (soh !== null) {
          battery.soh = soh;
        }
      }

      inLoadEvent = false;
      peakCurrent = 0;
      endCounter = 0;
    }
  } else {
    endCounter = 0;
  }

  saveBatteryState({
    soc: battery.soc,
    soh: battery.soh,
    usedAh: usedAh,
  });

  console.log({
    voltage: battery.voltage.toFixed(2),
    current: filteredCurrent.toFixed(2),
    soc: battery.soc.toFixed(2),
    soh: battery.soh?.toFixed(2),
    event: inLoadEvent ? "ACTIVE" : "IDLE",
    peakCurrent: peakCurrent.toFixed(2),
  });

  return battery;
};
