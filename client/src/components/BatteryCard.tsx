import type { BatteryData } from "../types/battery.types";

interface Props {
	data: BatteryData;
}

const CardValue = ({ label, value, unit }: { label: string; value: number; unit: string }) => (
	<div style={{ display: "flex", flexDirection: "column", textAlign: "center", padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.05)", minWidth: 120 }}>
		<span style={{ color: "#cbd5e1", fontSize: 11, marginBottom: 4 }}>{label}</span>
		<span style={{ fontSize: 20, fontWeight: 700, color: "#ffffff" }}>{value.toFixed(1)}</span>
		<span style={{ color: "#94a3b8", fontSize: 11 }}>{unit}</span>
	</div>
);

const BatteryCard = ({ data }: Props) => {
	return (
		<div
			style={{
				background: "linear-gradient(135deg, #111827 0%, #0f172a 45%, #111827 100%)",
				borderRadius: 24,
				color: "#e2e8f0",
				padding: 24,
				maxWidth: 1000,
				margin: "20px auto",
				boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
			}}
		>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20 }}>
				<div>
					<h1 style={{ margin: 0, color: "#f8fafc", fontSize: 24 }}>Battery Dashboard</h1>
					<p style={{ color: "#94a3b8", marginTop: 8 }}>Live telemetry from Arduino serial stream</p>
				</div>
				<div style={{ display: "flex", gap: 10 }}>
					<div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 10, padding: 10, minWidth: 130 }}>
						<div style={{ color: "#94a3b8", fontSize: 11 }}>CHARGE LEVEL</div>
						<div style={{ fontSize: 30, fontWeight: 700, color: "#38bdf8" }}>{data.soc.toFixed(0)}%</div>
					</div>
					<div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 10, padding: 10, minWidth: 130 }}>
						<div style={{ color: "#94a3b8", fontSize: 11 }}>HEALTH STATE (SoH)</div>
						<div style={{ fontSize: 24, fontWeight: 700, color: "#34d399" }}>{data.soh.toFixed(1)}%</div>
					</div>
				</div>
			</div>

			<div style={{ marginTop: 18, background: "#0b1220", border: "1px solid #1f2937", borderRadius: 14, padding: 14 }}>
				<div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 10 }}>
					<CardValue label="Pack Voltage" value={data.voltage} unit="V" />
					<CardValue label="Cell 1" value={data.voltage1} unit="V" />
					<CardValue label="Cell 2" value={data.voltage2} unit="V" />
					<CardValue label="Current" value={data.current} unit="A" />
					<CardValue label="Core 1" value={data.temp1} unit="°C" />
					<CardValue label="Core 2" value={data.temp2} unit="°C" />
				</div>
			</div>

			<div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
				<div style={{ borderRadius: 16, border: "1px solid #334155", background: "#0b1220", minHeight: 170, padding: 14 }}>
					<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
						<div style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 600 }}>Live Telemetry Stream</div>
						<span style={{ color: "#94a3b8", fontSize: 12 }}>Sync freq: 250ms</span>
					</div>
					<div style={{ height: 110, borderRadius: 12, background: "linear-gradient(to bottom, #0a1221, #0f172a)", display: "flex", alignItems: "flex-end", padding: 10 }}>
						<div style={{ flex: 1, marginRight: 5, height: `${Math.min(100, Math.max(8, data.voltage * 2))}%`, background: "#22d3ee", borderRadius: 6 }} />
						<div style={{ flex: 1, marginRight: 5, height: `${Math.min(100, Math.max(8, data.temp1 * 2.5))}%`, background: "#facc15", borderRadius: 6 }} />
						<div style={{ flex: 1, marginRight: 5, height: `${Math.min(100, Math.max(8, Math.abs(data.current) * 2.5))}%`, background: "#e2e8f0", borderRadius: 6 }} />
					</div>
					<div style={{ fontSize: 11, color: "#94a3b8", marginTop: 6, display: "flex", justifyContent: "space-between" }}>
						<span>Voltage</span>
						<span>Temp</span>
						<span>Current</span>
					</div>
				</div>

				<div style={{ borderRadius: 16, border: "1px solid #334155", background: "#0b1220", minHeight: 170, padding: 14 }}>
					<div style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Cell Balancing</div>
					<div style={{ marginBottom: 8 }}>
						<div style={{ display: "flex", justifyContent: "space-between", color: "#cbd5e1", fontSize: 12 }}>
							<span>Cell 01</span>
							<span>{data.voltage1.toFixed(2)}V</span>
						</div>
						<div style={{ height: 8, marginTop: 4, borderRadius: 999, background: "#1f2937" }}>
							<div style={{ width: `${Math.min(100, (data.voltage1 / 5) * 100)}%`, background: "#38bdf8", height: "100%", borderRadius: 999 }} />
						</div>
					</div>
					<div>
						<div style={{ display: "flex", justifyContent: "space-between", color: "#cbd5e1", fontSize: 12 }}>
							<span>Cell 02</span>
							<span>{data.voltage2.toFixed(2)}V</span>
						</div>
						<div style={{ height: 8, marginTop: 4, borderRadius: 999, background: "#1f2937" }}>
							<div style={{ width: `${Math.min(100, (data.voltage2 / 5) * 100)}%`, background: "#facc15", height: "100%", borderRadius: 999 }} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BatteryCard;

