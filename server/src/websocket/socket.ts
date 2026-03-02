import { Server } from "ws";

let wss: Server;

export const initWebSocket = (server: any) => {
	wss = new Server({ server });

	wss.on("connection", (ws) => {
		console.log("Client connected");

		ws.on("close", () => {
			console.log("Client disconnected");
		});
	});
};

export const broadcast = (data: any) => {
	if (!wss) return;

	const message = JSON.stringify(data);

	wss.clients.forEach((client) => {
		if (client.readyState === 1) {
			client.send(message);
		}
	});
};
