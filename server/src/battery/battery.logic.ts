import { battery, ratedCapacityAh, cutoffVoltage, addUsedAh, getUsedAh } from "./battery.store";
import { saveBatteryState } from "./battery.persistence";

let lastTime = Date.now();

export const updateBatteryLogic = (
	voltage: number,
	current: number,
	temperature: number
) => {
	const now = Date.now();
	const dt = (now - lastTime) / 1000;
	lastTime = now;

	if (Math.abs(current) <= 0.14) {
		current = 0;
	}

	// Coulomb counting
	const deltaAh = (current * dt) / 3600;
	addUsedAh(deltaAh);

	const usedAh = getUsedAh();
	const soc = 100 - (usedAh / ratedCapacityAh) * 100;

	battery.soc = Math.max(0, Math.min(100, soc));
	battery.voltage = voltage;
	battery.current = current;
	battery.temperature = temperature;

	// SoH estimation when reaching cutoff
	if (voltage <= cutoffVoltage) {
		const deliveredAh = getUsedAh();
		battery.soh = (deliveredAh / ratedCapacityAh) * 100;
	}

	//Persistence state after each update
	saveBatteryState({
		soc: battery.soc,
		soh: battery.soh,
		usedAh: usedAh,
	});

	console.log(battery);
	return battery;
};
