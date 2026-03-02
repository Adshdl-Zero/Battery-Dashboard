import type { BatteryData } from "../types/battery.types";
import Gauge from "./Gauge";
import Metric from "./Metric";

interface Props {
	data: BatteryData;
}

const BatteryCard = ({ data }: Props) => {
	return (
		<div
			style={{
				padding: "30px",
				borderRadius: "20px",
				boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
				background: "#f8f9fa",
				maxWidth: "600px",
				margin: "auto",
			}}
		>
			<h2 style={{ textAlign: "center" }}>Battery Dashboard</h2>

			<div style={{ display: "flex", justifyContent: "center" }}>
				<Gauge label="State of Charge (SoC)" value={data.soc} />
				<Gauge label="State of Health (SoH)" value={data.soh} />
			</div>

			<div style={{ display: "flex", justifyContent: "space-around" }}>
				<Metric label="Voltage" value={data.voltage} unit="V" />
				<Metric label="Current" value={data.current} unit="A" />
				<Metric label="Temperature" value={data.temperature} unit="°C" />
			</div>
		</div>
	);
};

export default BatteryCard;
