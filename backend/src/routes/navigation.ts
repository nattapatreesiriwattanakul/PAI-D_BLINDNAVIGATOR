import { Router, Request, Response } from "express";
import pool from "../config/database";
import { transformKeys } from "../utils/transformers";

const router = Router();

// Get navigation nodes for a floor
router.get("/nodes/:floorId", async (req: Request, res: Response) => {
  try {
    const { floorId } = req.params;
    const result = await pool.query(
      "SELECT * FROM navigation_nodes WHERE floor_id = $1",
      [floorId]
    );
    res.json(transformKeys(result.rows));
  } catch (error) {
    console.error("Error fetching navigation nodes:", error);
    res.status(500).json({ error: "Failed to fetch navigation nodes" });
  }
});

// Calculate route from current position to destination room
router.post("/route", async (req: Request, res: Response) => {
  try {
    const { fromFloorId, toRoomId, userX, userY } = req.body;

    console.log("Navigation route request received:", {
      fromFloorId,
      toRoomId,
      userX,
      userY,
    });

    // Validate input
    if (
      !fromFloorId ||
      !toRoomId ||
      userX === undefined ||
      userY === undefined
    ) {
      console.error("Invalid request parameters:", req.body);
      return res.status(400).json({
        error:
          "Missing required parameters: fromFloorId, toRoomId, userX, userY",
      });
    }

    // Get destination room info
    const roomResult = await pool.query(
      `SELECT r.*, f.floor_number, f.id as floor_id
       FROM rooms r
       JOIN floors f ON r.floor_id = f.id
       WHERE r.id = $1`,
      [toRoomId]
    );

    if (roomResult.rows.length === 0) {
      return res.status(404).json({ error: "Destination room not found" });
    }

    const destinationRoom = roomResult.rows[0];

    // Ensure coordinates exist
    if (destinationRoom.x === null || destinationRoom.y === null) {
      return res.status(400).json({
        error: "Destination room has no coordinates defined",
      });
    }

    // Get navigation graph for the floors involved
    // This is a simplified implementation - in production, you'd use A* or Dijkstra
    const nodesResult = await pool.query(
      `SELECT * FROM navigation_nodes 
       WHERE floor_id = $1 OR floor_id = $2`,
      [fromFloorId, destinationRoom.floor_id]
    );

    const pathsResult = await pool.query(
      `SELECT * FROM navigation_paths 
       WHERE from_node_id IN (
         SELECT id FROM navigation_nodes WHERE floor_id = $1 OR floor_id = $2
       )`,
      [fromFloorId, destinationRoom.floor_id]
    );

    // Simple pathfinding logic (placeholder - implement A* algorithm)
    const route = await calculateSimpleRoute(
      Number(userX),
      Number(userY),
      fromFloorId,
      destinationRoom,
      nodesResult.rows,
      pathsResult.rows
    );

    const transformedRoute = transformKeys(route);
    console.log(
      "Route calculated successfully:",
      JSON.stringify(transformedRoute, null, 2)
    );
    res.json(transformedRoute);
  } catch (error) {
    console.error("Error calculating route:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : "";
    console.error("Error details:", errorStack);
    res.status(500).json({
      error: "Failed to calculate route",
      details: errorMessage,
    });
  }
});

// Helper function for simple pathfinding
async function calculateSimpleRoute(
  startX: number,
  startY: number,
  startFloorId: string,
  destination: any,
  nodes: any[],
  paths: any[]
) {
  // This is a placeholder implementation
  // In production, implement proper A* or Dijkstra pathfinding

  const steps = [];

  // Convert destination coordinates to numbers
  const destX = Number(destination.x);
  const destY = Number(destination.y);

  // Validate coordinates
  if (isNaN(destX) || isNaN(destY) || isNaN(startX) || isNaN(startY)) {
    throw new Error("Invalid coordinates provided");
  }

  // Check if same floor
  if (startFloorId === destination.floor_id) {
    // Simple direct instruction
    const distance = Math.sqrt(
      Math.pow(destX - startX, 2) + Math.pow(destY - startY, 2)
    );

    steps.push({
      instruction: `เดินตรงไปยังห้อง ${destination.room_number}`,
      direction: calculateDirection(startX, startY, destX, destY),
      distance: Math.round(distance * 100) / 100,
      node_id: destination.node_id || "destination",
    });
  } else {
    // Multi-floor navigation - find elevator
    const elevatorNode = nodes.find(
      (n) => n.node_type === "elevator" && n.floor_id === startFloorId
    );

    if (!elevatorNode) {
      throw new Error("No elevator found on starting floor");
    }

    const elevatorX = Number(elevatorNode.x);
    const elevatorY = Number(elevatorNode.y);

    const distanceToElevator = Math.sqrt(
      Math.pow(elevatorX - startX, 2) + Math.pow(elevatorY - startY, 2)
    );

    steps.push({
      instruction: "เดินไปที่ลิฟต์",
      direction: calculateDirection(startX, startY, elevatorX, elevatorY),
      distance: Math.round(distanceToElevator * 100) / 100,
      node_id: elevatorNode.id,
    });

    // Floor change instruction
    const currentFloorNum = await getFloorNumber(startFloorId);
    const destFloorNum = await getFloorNumber(destination.floor_id);

    if (!currentFloorNum || !destFloorNum) {
      throw new Error("Invalid floor information");
    }

    steps.push({
      instruction: `ขึ้นลิฟต์ไปชั้น ${destFloorNum}`,
      direction: destFloorNum > currentFloorNum ? "up" : "down",
      distance: 0,
      node_id: elevatorNode.id,
      floor_change: {
        from_floor: currentFloorNum,
        to_floor: destFloorNum,
        method: "elevator",
      },
    });

    // From elevator to destination
    const destElevatorNode = nodes.find(
      (n) => n.node_type === "elevator" && n.floor_id === destination.floor_id
    );

    if (!destElevatorNode) {
      throw new Error("No elevator found on destination floor");
    }

    const destElevatorX = Number(destElevatorNode.x);
    const destElevatorY = Number(destElevatorNode.y);

    const distanceFromElevator = Math.sqrt(
      Math.pow(destX - destElevatorX, 2) + Math.pow(destY - destElevatorY, 2)
    );

    steps.push({
      instruction: `ออกจากลิฟต์และเดินไปยังห้อง ${destination.room_number}`,
      direction: calculateDirection(destElevatorX, destElevatorY, destX, destY),
      distance: Math.round(distanceFromElevator * 100) / 100,
      node_id: destination.node_id || "destination",
    });
  }

  const totalDistance = steps.reduce((sum, step) => sum + step.distance, 0);

  return {
    steps,
    total_distance: Math.round(totalDistance * 100) / 100,
    estimated_time: Math.ceil((totalDistance / 1.4) * 60), // Assuming 1.4 m/s walking speed (in seconds)
    current_step_index: 0,
  };
}

function calculateDirection(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  if (angle >= -22.5 && angle < 22.5) return "ทางทิศตะวันออก";
  if (angle >= 22.5 && angle < 67.5) return "ทางตะวันออกเฉียงเหนือ";
  if (angle >= 67.5 && angle < 112.5) return "ทางทิศเหนือ";
  if (angle >= 112.5 && angle < 157.5) return "ทางตะวันตกเฉียงเหนือ";
  if (angle >= 157.5 || angle < -157.5) return "ทางทิศตะวันตก";
  if (angle >= -157.5 && angle < -112.5) return "ทางตะวันตกเฉียงใต้";
  if (angle >= -112.5 && angle < -67.5) return "ทางทิศใต้";
  return "ทางตะวันออกเฉียงใต้";
}

async function getFloorNumber(floorId: string): Promise<number | null> {
  try {
    const result = await pool.query(
      "SELECT floor_number FROM floors WHERE id = $1",
      [floorId]
    );
    if (result.rows.length === 0) {
      return null;
    }
    return Number(result.rows[0].floor_number);
  } catch (error) {
    console.error("Error getting floor number:", error);
    return null;
  }
}

export default router;
