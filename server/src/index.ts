import path from "path";
import fs from "fs";
import http from "http";
import app from "./app";
import { initWebSocket } from "./websocket/socket";
import { config } from "./config/env";
import { initSerial } from "./serial/serial.service";
import { battery, setUsedAh } from "./battery/battery.store";

const server = http.createServer(app);

const STATE_FILE = path.resolve(__dirname, "../data/battery-state.csv");

function loadInitialState() {
  try {
    if (!fs.existsSync(STATE_FILE)) {
      console.log("No previous battery state found.");
      return;
    }

    const data = fs.readFileSync(STATE_FILE, "utf8").trim();

    const lines = data.split("\n");
    if (lines.length < 2) return;

    const lastLine = lines[lines.length - 1];
    const [, soc, soh, usedAh] = lastLine.split(",");

    battery.soc = parseFloat(soc);
    battery.soh = parseFloat(soh);
    setUsedAh(parseFloat(usedAh));

    console.log("Battery state restored:", {
      soc: battery.soc,
      soh: battery.soh,
      usedAh: usedAh,
    });
  } catch (err) {
    console.error("Error loading initial battery state:", err);
  }
}

loadInitialState();

initWebSocket(server);
initSerial();

const PORT = config.PORT;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on 0.0.0.0:${PORT}`);
});
