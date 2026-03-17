export const config = {
  PORT: Number(process.env.PORT || 3000),

  // Battery
  RATED_CAPACITY_AH: Number(process.env.RATED_CAPACITY_AH || 7),
  R_NEW: Number(process.env.R_NEW || 0.028),

  // Filtering
  FILTER_ALPHA: Number(process.env.FILTER_ALPHA || 0.2),
  CURRENT_NOISE_THRESHOLD: Number(process.env.CURRENT_NOISE_THRESHOLD || 0.1),

  // Event detection
  CURRENT_START_THRESHOLD: Number(process.env.CURRENT_START_THRESHOLD || 20),
  CURRENT_END_THRESHOLD: Number(process.env.CURRENT_END_THRESHOLD || 1),

  DEBOUNCE_COUNT: Number(process.env.DEBOUNCE_COUNT || 3),
  MIN_EVENT_DURATION: Number(process.env.MIN_EVENT_DURATION || 0.5),

  SERIAL_PORT: process.env.SERIAL_PORT || "/dev/ttyACM0",
  SERIAL_BAUD_RATE: Number(process.env.SERIAL_BAUD_RATE || 9600),
};
