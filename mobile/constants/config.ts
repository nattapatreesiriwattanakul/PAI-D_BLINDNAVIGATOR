// API Configuration
// IMPORTANT: Change this IP to match your computer's IP address
// Find your IP: Windows (ipconfig), Mac/Linux (ifconfig)
export const API_BASE_URL = __DEV__
  ? "http://<your-ip>:3000/api"
  : "https://your-production-api.com/api";

// Accessibility Configuration
export const BUTTON_SIZE = {
  WIDTH: 150,
  HEIGHT: 150,
  CORNER_SIZE: 120, // For back and confirm buttons
};

export const FONT_SIZES = {
  LARGE: 32,
  XLARGE: 48,
  XXLARGE: 64,
};

// Location Configuration
export const LOCATION_CONFIG = {
  BLE_SCAN_INTERVAL: 1000, // ms
  GPS_UPDATE_INTERVAL: 2000, // ms
  POSITION_ACCURACY_THRESHOLD: 3, // meters
};

// Colors for high contrast (accessibility) - PaiDv2 Theme
export const COLORS = {
  PRIMARY: "#4B5AC7", // Blue - main button color
  SECONDARY: "#F06277", // Pink - accent color for icons and text
  BACKGROUND: "#FFFFFF",
  TEXT: "#2A2A2A", // Darker gray for better readability
  TEXT_SECONDARY: "#555555",
  SUCCESS: "#4B5AC7",
  DANGER: "#F06277",
  BORDER: "#4B5AC7",
};
