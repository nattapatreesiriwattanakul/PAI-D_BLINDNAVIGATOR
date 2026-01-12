// Type Definitions for Pai Dee App

export interface Building {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  floors: Floor[];
}

export interface Floor {
  id: string;
  buildingId: string;
  floorNumber: number;
  floorName: string;
  mapImageUrl?: string;
  mapWidth?: number;
  mapHeight?: number;
  rooms: Room[];
}

export interface Room {
  id: string;
  floorId: string;
  roomNumber: string;
  roomName: string;
  x: number; // coordinate on floor map
  y: number; // coordinate on floor map
  nodeId?: string; // Reference to navigation node
}

export interface NavigationNode {
  id: string;
  floorId: string;
  x: number;
  y: number;
  nodeType: "room" | "elevator" | "stairs" | "hallway" | "entrance";
  roomId?: string;
}

export interface NavigationPath {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  distance: number;
  direction: string; // e.g., "north", "south", "east", "west"
  instructions: string;
}

export interface Beacon {
  id: string;
  uuid: string;
  major: number;
  minor: number;
  floorId: string;
  x: number;
  y: number;
}

export interface UserLocation {
  x: number;
  y: number;
  floorId: string;
  accuracy: number;
  source: "ble" | "gps" | "manual";
}

export interface NavigationStep {
  instruction: string;
  direction: string;
  distance: number;
  nodeId: string;
  floorChange?: {
    fromFloor: number;
    toFloor: number;
    method: "elevator" | "stairs";
  };
}

export interface NavigationRoute {
  steps: NavigationStep[];
  totalDistance: number;
  estimatedTime: number;
  currentStepIndex: number;
}
