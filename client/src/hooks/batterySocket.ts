import { useEffect, useState } from "react";
import type { BatteryData } from "../types/battery.types";

export const useBatterySocket = () => {
	const [battery, setBattery] = useState<BatteryData | null>(null);

	useEffect(() => {
		const socket = new WebSocket(
			`ws://${window.location.hostname}:3000`
		);

		socket.onopen = () => {
			console.log("Connected to battery server");
		};

		socket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			setBattery(data);
		};

		socket.onerror = (error) => {
			console.error("WebSocket error:", error);
		};

		socket.onclose = () => {
			console.log("WebSocket disconnected");
		};

		return () => {
			socket.close();
		};
	}, []);

	return battery;
};
