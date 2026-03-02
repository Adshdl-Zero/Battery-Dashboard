interface Props {
	label: string;
	value: number;
	unit: string;
}

const Metric = ({ label, value, unit }: Props) => {
	return (
		<div style={{ margin: "15px", textAlign: "center" }}>
			<h3>{label}</h3>
			<p style={{ fontSize: "22px", fontWeight: "bold" }}>
				{value.toFixed(2)} {unit}
			</p>
		</div>
	);
};

export default Metric;

