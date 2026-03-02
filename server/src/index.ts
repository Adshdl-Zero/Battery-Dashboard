import http from "http";
import app from "./app";
import { initWebSocket } from "./websocket/socket";
import { config } from "./config/env";
import { initSerial } from "./serial/serial.service";
import { loadBatteryState } from "./battery/battery.persistence";
import { battery, setUsedAh, ratedCapacityAh } from "./battery/battery.store";

const server = http.createServer(app);
const savedState = loadBatteryState();

if (savedState) {
	battery.soc = savedState.soc;
	battery.soh = savedState.soh;
	setUsedAh(savedState.usedAh);
} else {
	battery.soc = 100;
	battery.soh = 100;
	setUsedAh(0);
}

initWebSocket(server);
initSerial();

const PORT = config.PORT;

server.listen(PORT, "0.0.0.0", () => {
	console.log(`Server running on 0.0.0.0:${PORT}`);
})
