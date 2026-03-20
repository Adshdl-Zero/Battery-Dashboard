import { useEffect, useState, useRef } from "react";
import type { BatteryData } from "../types/battery.types";

export const useBatterySocket = () => {
  const [battery, setBattery] = useState<BatteryData | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (socketRef.current) return;

    const socket = new WebSocket("ws://localhost:3000");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Connected to battery server");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setBattery(data);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, []);

  return battery;
};
