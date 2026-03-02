import dotenv from "dotenv";

dotenv.config();

export const config = {
	PORT: parseInt(process.env.PORT || "3000"),

	SERIAL_PORT: process.env.SERIAL_PORT || "/dev/ttyACM0",
	SERIAL_BAUD_RATE: parseInt(process.env.SERIAL_BAUD_RATE || "115200"),

	RATED_CAPACITY_AH: parseFloat(process.env.RATED_CAPACITY_AH || "7"),
	CUTOFF_VOLTAGE: parseFloat(process.env.CUTOFF_VOLTAGE || "11.8"),
};
