import { useEffect, useMemo, useRef, useState } from "react";
import type { BatteryData } from "../types/battery.types";

interface Props {
  data: BatteryData;
}

const CardValue = ({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit: string;
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      textAlign: "center",
      padding: "10px 14px",
      borderRadius: 10,
      background: "rgba(255,255,255,0.05)",
      minWidth: 120,
    }}
  >
    <span style={{ color: "#cbd5e1", fontSize: 11, marginBottom: 4 }}>
      {label}
    </span>
    <span style={{ fontSize: 20, fontWeight: 700, color: "#ffffff" }}>
      {value.toFixed(1)}
    </span>
    <span style={{ color: "#94a3b8", fontSize: 11 }}>{unit}</span>
  </div>
);

const MAX_POINTS = 22;

const makeLinePath = (
  values: number[],
  {
    width,
    height,
    padding,
    min,
    max,
  }: {
    width: number;
    height: number;
    padding: number;
    min: number;
    max: number;
  },
) => {
  if (!values.length) return "";
  const availableWidth = width - padding * 2;
  const availableHeight = height - padding * 2;
  const step = values.length === 1 ? 0 : availableWidth / (values.length - 1);
  const safeRange = Math.max(1, max - min);
  return values
    .map((value, index) => {
      const x = padding + index * step;
      const clamped = Math.max(min, Math.min(max, value));
      const normalized = (clamped - min) / safeRange;
      const y = height - padding - normalized * availableHeight;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
};

const BatteryCard = ({ data }: Props) => {
  const [voltageHistory, setVoltageHistory] = useState<number[]>([]);
  const [tempHistory, setTempHistory] = useState<number[]>([]);
  const [currentHistory, setCurrentHistory] = useState<number[]>([]);
  const [chartWidth, setChartWidth] = useState(330);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVoltageHistory((prev) => [...prev.slice(-MAX_POINTS + 1), data.voltage]);
    setTempHistory((prev) => [...prev.slice(-MAX_POINTS + 1), data.temp1]);
    setCurrentHistory((prev) => [...prev.slice(-MAX_POINTS + 1), data.current]);
  }, [data.voltage, data.temp1, data.current]);

  useEffect(() => {
    if (!chartRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width) {
        setChartWidth(Math.max(320, entry.contentRect.width));
      }
    });
    observer.observe(chartRef.current);
    return () => observer.disconnect();
  }, []);

  const chartBounds = { width: chartWidth, height: 130, padding: 10 };
  const voltagePath = useMemo(
    () => makeLinePath(voltageHistory, { ...chartBounds, min: 10, max: 45 }),
    [voltageHistory, chartBounds.width],
  );
  const tempPath = useMemo(
    () => makeLinePath(tempHistory, { ...chartBounds, min: -45, max: 100 }),
    [tempHistory, chartBounds.width],
  );
  const currentPath = useMemo(
    () => makeLinePath(currentHistory, { ...chartBounds, min: -40, max: 40 }),
    [currentHistory, chartBounds.width],
  );

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, #111827 0%, #0f172a 45%, #111827 100%)",
        borderRadius: 24,
        color: "#e2e8f0",
        padding: 24,
        maxWidth: "100%",
        margin: "20px 0",
        boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 20,
        }}
      >
        <div>
          <h1 style={{ margin: 0, color: "#f8fafc", fontSize: 24 }}>
            Battery Dashboard
          </h1>
          <p style={{ color: "#94a3b8", marginTop: 8 }}>
            Live telemetry from Arduino serial stream
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div
            style={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: 10,
              padding: 10,
              minWidth: 130,
            }}
          >
            <div style={{ color: "#94a3b8", fontSize: 11 }}>
              HEALTH STATE (SoH) 1
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, color: "#38bdf8" }}>
              {data.soc.toFixed(0)}%
            </div>
          </div>
          <div
            style={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: 10,
              padding: 10,
              minWidth: 130,
            }}
          >
            <div style={{ color: "#94a3b8", fontSize: 11 }}>
              HEALTH STATE (SoH) 2
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#34d399" }}>
              {data.soh.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 18,
          background: "#0b1220",
          border: "1px solid #1f2937",
          borderRadius: 14,
          padding: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <CardValue label="Total Voltage" value={data.voltage} unit="V" />
          <CardValue label="Battery 1" value={data.voltage1} unit="V" />
          <CardValue label="Battery 2" value={data.voltage2} unit="V" />
          <CardValue label="Current" value={data.current} unit="A" />
          <CardValue label="Temperature 1" value={data.temp1} unit="°C" />
          <CardValue label="Temperature 2" value={data.temp2} unit="°C" />
        </div>
      </div>

      <div
        style={{
          marginTop: 18,
          borderRadius: 16,
          border: "1px solid #334155",
          background: "#0b1220",
          padding: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <div style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 600 }}>
            Live Telemetry Stream
          </div>
          <span style={{ color: "#94a3b8", fontSize: 12 }}>
            Sync freq: 250ms
          </span>
        </div>
        <div
          ref={chartRef}
          style={{
            borderRadius: 12,
            background: "linear-gradient(to bottom, #0a1221, #0f172a)",
            padding: 8,
          }}
        >
          <svg
            viewBox={`0 0 ${chartBounds.width} ${chartBounds.height}`}
            style={{ width: "100%", height: 170 }}
          >
            <rect
              x={0}
              y={0}
              width={chartBounds.width}
              height={chartBounds.height}
              rx={12}
              fill="rgba(15,23,42,0.2)"
            />
            <path
              d={voltagePath}
              fill="none"
              stroke="#22d3ee"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={tempPath}
              fill="none"
              stroke="#facc15"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={currentPath}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 8,
              fontSize: 11,
              color: "#cbd5e1",
            }}
          >
            <span
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: "#22d3ee",
                }}
              />
              Voltage
            </span>
            <span
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: "#facc15",
                }}
              />
              Temp
            </span>
            <span
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: "#e2e8f0",
                }}
              />
              Current
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatteryCard;
