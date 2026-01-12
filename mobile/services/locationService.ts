import * as Location from "expo-location";
import { UserLocation, Beacon } from "../types";
import { beaconApi } from "./api";
import { LOCATION_CONFIG } from "../constants/config";

// BLE is optional - only available in development builds, not Expo Go
let BleManager: any = null;
try {
  const ble = require("react-native-ble-plx");
  BleManager = ble.BleManager;
} catch (e) {
  console.log("BLE module not available - using GPS only mode");
}

class LocationService {
  private bleManager: any = null;
  private isScanning: boolean = false;
  private nearbyBeacons: Map<string, { rssi: number; timestamp: number }> =
    new Map();
  private bleAvailable: boolean = false;
  private currentFloorId: string | null = null;

  constructor() {
    if (BleManager) {
      try {
        this.bleManager = new BleManager();
        this.bleAvailable = true;
      } catch (error) {
        console.log("BLE not available in Expo Go - GPS only mode");
        this.bleAvailable = false;
      }
    }
  }

  // Set the current floor ID for location tracking
  setCurrentFloor(floorId: string) {
    this.currentFloorId = floorId;
  }

  // Initialize BLE
  async initializeBLE(): Promise<boolean> {
    if (!this.bleAvailable || !this.bleManager) {
      console.log("BLE not available - skipping initialization");
      return false;
    }
    try {
      const state = await this.bleManager.state();
      const State = require("react-native-ble-plx").State;
      if (state !== State.PoweredOn) {
        console.warn("Bluetooth is not powered on");
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error initializing BLE:", error);
      return false;
    }
  }

  // Start scanning for BLE beacons
  async startBeaconScanning(
    onLocationUpdate: (location: UserLocation) => void
  ) {
    if (this.isScanning) return;

    const bleReady = await this.initializeBLE();
    if (!bleReady || !this.bleAvailable) {
      console.log("BLE not available, using GPS only");
      return this.startGPSTracking(onLocationUpdate);
    }

    this.isScanning = true;

    this.bleManager.startDeviceScan(
      null,
      null,
      async (error: any, device: any) => {
        if (error) {
          console.error("BLE scan error:", error);
          return;
        }

        if (device && device.rssi) {
          // Filter for beacon devices (you may need to adjust this based on your beacons)
          this.nearbyBeacons.set(device.id, {
            rssi: device.rssi,
            timestamp: Date.now(),
          });

          // Calculate position based on beacons
          if (this.nearbyBeacons.size >= 3) {
            const location = await this.calculatePositionFromBeacons();
            if (location) {
              onLocationUpdate(location);
            }
          }
        }
      }
    );

    // Clean up old beacon readings every second
    setInterval(() => {
      const now = Date.now();
      for (const [id, beacon] of this.nearbyBeacons.entries()) {
        if (now - beacon.timestamp > 5000) {
          this.nearbyBeacons.delete(id);
        }
      }
    }, 1000);
  }

  // Stop BLE scanning
  stopBeaconScanning() {
    if (this.isScanning && this.bleManager) {
      try {
        this.bleManager.stopDeviceScan();
      } catch (error) {
        console.log("Error stopping BLE scan:", error);
      }
      this.isScanning = false;
      this.nearbyBeacons.clear();
    }
  }

  // Calculate position using trilateration from beacon signals
  private async calculatePositionFromBeacons(): Promise<UserLocation | null> {
    try {
      const beaconData = Array.from(this.nearbyBeacons.entries()).map(
        ([uuid, data]) => ({
          uuid,
          rssi: data.rssi,
        })
      );

      const result = await beaconApi.locateByBeacons(beaconData);

      return {
        x: result.x,
        y: result.y,
        floorId: result.floorId,
        accuracy: result.accuracy,
        source: "ble",
      };
    } catch (error) {
      console.error("Error calculating position from beacons:", error);
      return null;
    }
  }

  // GPS Tracking (fallback)
  async startGPSTracking(onLocationUpdate: (location: UserLocation) => void) {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Location permission not granted");
        return;
      }

      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: LOCATION_CONFIG.GPS_UPDATE_INTERVAL,
          distanceInterval: 1,
        },
        (position) => {
          // Convert GPS to building coordinates (simplified)
          // In production, you'd need to implement proper coordinate transformation
          const location: UserLocation = {
            x: position.coords.longitude,
            y: position.coords.latitude,
            floorId: this.currentFloorId || "", // Use the actual floor ID
            accuracy: position.coords.accuracy || 10,
            source: "gps",
          };
          onLocationUpdate(location);
        }
      );
    } catch (error) {
      console.error("Error starting GPS tracking:", error);
    }
  }

  // Get current GPS location (one-time)
  async getCurrentGPSLocation(): Promise<Location.LocationObject | null> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return null;
      }

      return await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
    } catch (error) {
      console.error("Error getting current location:", error);
      return null;
    }
  }
}

export default new LocationService();
