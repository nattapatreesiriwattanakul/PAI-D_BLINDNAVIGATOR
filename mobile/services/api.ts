import axios from "axios";
import { API_BASE_URL } from "../constants/config";
import {
  Building,
  Floor,
  Room,
  NavigationRoute,
  NavigationNode,
} from "../types";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Building API
export const buildingApi = {
  getAll: async (): Promise<Building[]> => {
    const response = await api.get("/buildings");
    return response.data;
  },

  getById: async (id: string): Promise<Building> => {
    const response = await api.get(`/buildings/${id}`);
    return response.data;
  },
};

// Floor API
export const floorApi = {
  getByBuilding: async (buildingId: string): Promise<Floor[]> => {
    const response = await api.get(`/buildings/${buildingId}/floors`);
    return response.data;
  },

  getById: async (id: string): Promise<Floor> => {
    const response = await api.get(`/floors/${id}`);
    return response.data;
  },
};

// Room API
export const roomApi = {
  getByFloor: async (floorId: string): Promise<Room[]> => {
    const response = await api.get(`/floors/${floorId}/rooms`);
    return response.data;
  },

  getById: async (id: string): Promise<Room> => {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
  },

  search: async (query: string, buildingId: string): Promise<Room[]> => {
    const response = await api.get(`/rooms/search`, {
      params: { q: query, buildingId },
    });
    return response.data;
  },
};

// Navigation API
export const navigationApi = {
  getRoute: async (
    fromFloorId: string,
    toRoomId: string,
    userX: number,
    userY: number
  ): Promise<NavigationRoute> => {
    const response = await api.post("/navigation/route", {
      fromFloorId,
      toRoomId,
      userX,
      userY,
    });
    return response.data;
  },

  getNodes: async (floorId: string): Promise<NavigationNode[]> => {
    const response = await api.get(`/navigation/nodes/${floorId}`);
    return response.data;
  },
};

// Beacon API
export const beaconApi = {
  getByFloor: async (floorId: string) => {
    const response = await api.get(`/beacons/floor/${floorId}`);
    return response.data;
  },

  locateByBeacons: async (beacons: Array<{ uuid: string; rssi: number }>) => {
    const response = await api.post("/beacons/locate", { beacons });
    return response.data;
  },
};

export default api;
