interface Props {
	label: string;
	value: number;
}

const Gauge = ({ label, value }: Props) => {
	return (
		<div style={{ margin: "20px", textAlign: "center" }}>
			<h3>{label}</h3>
			<div
				style={{
					width: "150px",
					height: "150px",
					borderRadius: "50%",
					border: "10px solid #444",
					position: "relative",
				}}
			>
				<div
					style={{
						position: "absolute",
						inset: 0,
						borderRadius: "50%",
						background: `conic-gradient(#4caf50 ${value * 3.6}deg, #ddd 0deg)`,
					}}
				/>
				<div
					style={{
						position: "absolute",
						inset: "25px",
						background: "#fff",
						borderRadius: "50%",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontSize: "20px",
						fontWeight: "bold",
					}}
				>
					{value.toFixed(1)}%
				</div>
			</div>
		</div>
	);
};

export default Gauge;
