import { useBatterySocket } from "./hooks/batterySocket";
import BatteryCard from "./components/BatteryCard";

function App() {
	const battery = useBatterySocket();

	if (!battery) {
		return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
	}

	return (
		<div style={{ padding: "40px" }}>
			<BatteryCard data={battery} />
		</div>
	);
}

export default App;
