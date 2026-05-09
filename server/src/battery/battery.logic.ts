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

const CURRENT_START_THRESHOLD = config.CURRENT_START_THRESHOLD;
const CURRENT_END_THRESHOLD = config.CURRENT_END_THRESHOLD;
const MIN_EVENT_DURATION = config.MIN_EVENT_DURATION;

let inLoadEvent = false;
let peakCurrent = 0;
let eventStartTime = 0;

let voltageBefore = 0; // true idle voltage
let voltageDuring = 0; // voltage at peak load

let voltage1Before = 0;
let voltage1During = 0;

let voltage2Before = 0;
let voltage2During = 0;

export const updateBatteryLogic = (
  voltage: number,
  current: number,
  temp1: number,
  temp2: number,
  voltage1 = 0,
  voltage2 = 0,
) => {
  const now = Date.now();
  const dt = (now - lastTime) / 1000;
  lastTime = now;

  const rawCurrent = current;

  //SOC calculation
  const deltaAh = (rawCurrent * dt) / 3600;
  addUsedAh(deltaAh);

  const usedAh = getUsedAh();
  const soc = 100 - (usedAh / ratedCapacityAh) * 100;

  battery.soc = Math.max(0, Math.min(100, soc));
  battery.voltage = voltage;
  battery.voltage1 = voltage1;
  battery.voltage2 = voltage2;
  battery.current = rawCurrent;
  battery.temp1 = temp1;
  battery.temp2 = temp2;

  saveBatteryTelemetry({
    voltage,
    voltage1,
    voltage2,
    current: rawCurrent,
    temp1,
    temp2,
  });

  //IDLE detection
  if (Math.abs(rawCurrent) < 1) {
    voltageBefore = voltage;
    voltage1Before = voltage1;
    voltage2Before = voltage2;
  }

  //START EVENT (discharge only)
  if (
    !inLoadEvent &&
    rawCurrent > CURRENT_START_THRESHOLD // only discharge
  ) {
    inLoadEvent = true;
    peakCurrent = rawCurrent;
    eventStartTime = now;

    voltageDuring = voltage;
    voltage1During = voltage1;
    voltage2During = voltage2;

    console.log("EVENT STARTED");
  }

  //TRACK PEAK (only during discharge)
  if (inLoadEvent && rawCurrent > 0) {
    if (rawCurrent >= peakCurrent) {
      peakCurrent = rawCurrent;
      voltageDuring = voltage;
      voltage1During = voltage1;
      voltage2During = voltage2;
    }
  }

  //END EVENT
  if (inLoadEvent && Math.abs(rawCurrent) < CURRENT_END_THRESHOLD) {
    const eventDuration = (now - eventStartTime) / 1000;

    console.log("EVENT ENDED", {
      peakCurrent,
      eventDuration,
      voltageBefore,
      voltageDuring,
    });

    if (
      peakCurrent > CURRENT_START_THRESHOLD &&
      eventDuration > MIN_EVENT_DURATION &&
      voltageBefore > voltageDuring
    ) {
      console.log("CALCULATING SOH...");

      const soh1 = calculateSOH({
        peakCurrent,
        voltageBefore: voltage1Before,
        voltageDuring: voltage1During,
        temperature: temp1,
      });

      const soh2 = calculateSOH({
        peakCurrent,
        voltageBefore: voltage2Before,
        voltageDuring: voltage2During,
        temperature: temp2,
      });

      console.log("SOH1 RESULT:", soh1);
      console.log("SOH2 RESULT:", soh2);

      if (soh1 != null) {
        battery.soh1 = soh1;
      }
      if (soh2 != null) {
        battery.soh2 = soh2;
      }
    } else {
      console.log("SOH SKIPPED (invalid conditions)");
    }

    // Reset
    inLoadEvent = false;
    peakCurrent = 0;
    voltageDuring = 0;
    voltage1During = 0;
    voltage2During = 0;
  }

  saveBatteryState({
    soc: battery.soc,
    soh1: battery.soh1,
    soh2: battery.soh2,
    usedAh: usedAh,
  });

  console.log({
    voltage: battery.voltage.toFixed(2),
    current: rawCurrent.toFixed(2),
    soc: battery.soc.toFixed(2),
    soh1: battery.soh1?.toFixed(2),
    soh2: battery.soh2?.toFixed(2),
    state: inLoadEvent ? "LOAD" : "IDLE",
    peakCurrent: peakCurrent.toFixed(2),
  });

  return battery;
};
