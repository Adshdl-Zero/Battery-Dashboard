import fs from "fs";
import path from "path";

const FILE_PATH = path.resolve(__dirname, "../../data/battery-state.json");

export interface BatteryPersistenceState {
	soc: number;
	soh: number;
	usedAh: number;
}

export const saveBatteryState = (state: BatteryPersistenceState) => {
	try {
		fs.writeFileSync(FILE_PATH, JSON.stringify(state, null, 2));
	} catch (err) {
		console.error("Error saving battery state:", err);
	}
};

export const loadBatteryState = (): BatteryPersistenceState | null => {
	try {
		if (!fs.existsSync(FILE_PATH)) return null;

		const data = fs.readFileSync(FILE_PATH, "utf8");
		return JSON.parse(data);
	} catch (err) {
		console.error("Error loading battery state:", err);
		return null;
	}

};
