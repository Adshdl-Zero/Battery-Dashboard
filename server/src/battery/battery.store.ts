import { Battery } from "./battery.types";
import { config } from "../config/env";

export const battery: Battery = {
	voltage: 0,
	current: 0,
	temperature: 0,
	soc: 100,
	soh: 100,
};

export const ratedCapacityAh = config.RATED_CAPACITY_AH;
export const cutoffVoltage = config.CUTOFF_VOLTAGE;
let usedAh = 0;

export const getUsedAh = () => usedAh;
export const addUsedAh = (value: number) => {
	usedAh += value;
};

export const setUsedAh = (value: number) => {
	usedAh = value;
};
