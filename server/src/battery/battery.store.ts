import { Battery } from "./battery.types";
import { config } from "../config/env";

export const battery: Battery = {
  voltage: 0,
  voltage1: 0,
  voltage2: 0,
  current: 0,
  temp1: 0,
  temp2: 0,
  soc: 100,
  soh: 100,
};

export const ratedCapacityAh = config.RATED_CAPACITY_AH;
let usedAh = 0;

export const getUsedAh = () => usedAh;
export const addUsedAh = (value: number) => {
  usedAh += value;
};

export const setUsedAh = (value: number) => {
  usedAh = value;
};
