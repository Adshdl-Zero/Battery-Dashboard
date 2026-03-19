import { useBatterySocket } from "./hooks/batterySocket";
import BatteryCard from "./components/BatteryCard";

function App() {
	const battery = useBatterySocket();

	if (!battery) {
		return <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#020617", color: "#cbd5e1" }}>Loading...</div>;
	}

	return (
		<div style={{ minHeight: "100vh", background: "#020617", color: "#e2e8f0", padding: "10px 12px" }}>
			<BatteryCard data={battery} />
		</div>
	);
}

export default App;
