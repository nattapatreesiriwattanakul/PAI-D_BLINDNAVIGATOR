import { Router, Request, Response } from "express";
import pool from "../config/database";
import { transformKeys } from "../utils/transformers";

const router = Router();

// Get beacons for a floor
router.get("/floor/:floorId", async (req: Request, res: Response) => {
  try {
    const { floorId } = req.params;
    const result = await pool.query(
      "SELECT * FROM beacons WHERE floor_id = $1",
      [floorId]
    );
    res.json(transformKeys(result.rows));
  } catch (error) {
    console.error("Error fetching beacons:", error);
    res.status(500).json({ error: "Failed to fetch beacons" });
  }
});

// Locate user based on beacon signals (trilateration)
router.post("/locate", async (req: Request, res: Response) => {
  try {
    const { beacons } = req.body; // Array of { uuid, rssi }

    if (!beacons || beacons.length < 3) {
      return res.status(400).json({
        error: "At least 3 beacon signals required for accurate positioning",
      });
    }

    // Get beacon positions from database
    const beaconIds = beacons.map((b: any) => b.uuid);
    const result = await pool.query(
      "SELECT * FROM beacons WHERE uuid = ANY($1::text[])",
      [beaconIds]
    );

    if (result.rows.length < 3) {
      return res.status(404).json({ error: "Not enough known beacons found" });
    }

    // Calculate distances from RSSI
    const beaconPositions = result.rows.map((beacon) => {
      const signal = beacons.find((b: any) => b.uuid === beacon.uuid);
      const distance = rssiToDistance(signal.rssi, beacon.tx_power);

      return {
        x: parseFloat(beacon.x),
        y: parseFloat(beacon.y),
        distance,
        floorId: beacon.floor_id,
      };
    });

    // Use trilateration to calculate position
    const position = trilaterate(beaconPositions);

    // Determine most likely floor (most beacons on that floor)
    const floorCounts: { [key: string]: number } = {};
    beaconPositions.forEach((bp) => {
      floorCounts[bp.floorId] = (floorCounts[bp.floorId] || 0) + 1;
    });

    const likelyFloorId = Object.keys(floorCounts).reduce((a, b) =>
      floorCounts[a] > floorCounts[b] ? a : b
    );

    res.json({
      x: position.x,
      y: position.y,
      floorId: likelyFloorId,
      accuracy: position.accuracy,
    });
  } catch (error) {
    console.error("Error locating by beacons:", error);
    res.status(500).json({ error: "Failed to locate by beacons" });
  }
});

// Convert RSSI to distance (simplified model)
function rssiToDistance(rssi: number, txPower: number = -59): number {
  // Using log-distance path loss model
  // distance = 10 ^ ((txPower - rssi) / (10 * n))
  // where n is the path loss exponent (typically 2-4 for indoor)
  const n = 2.5; // Indoor environment
  return Math.pow(10, (txPower - rssi) / (10 * n));
}

// Trilateration algorithm to calculate position from 3+ beacons
function trilaterate(
  beacons: Array<{ x: number; y: number; distance: number }>
): { x: number; y: number; accuracy: number } {
  if (beacons.length < 3) {
    throw new Error("Need at least 3 beacons for trilateration");
  }

  // Use weighted centroid method (simplified)
  // In production, use proper trilateration with least squares
  let totalWeight = 0;
  let weightedX = 0;
  let weightedY = 0;

  beacons.forEach((beacon) => {
    // Weight is inverse of distance (closer beacons have more weight)
    const weight = 1 / (beacon.distance + 0.1); // +0.1 to avoid division by zero
    totalWeight += weight;
    weightedX += beacon.x * weight;
    weightedY += beacon.y * weight;
  });

  const x = weightedX / totalWeight;
  const y = weightedY / totalWeight;

  // Calculate accuracy (average distance to beacons)
  const avgDistance =
    beacons.reduce((sum, b) => sum + b.distance, 0) / beacons.length;

  return {
    x,
    y,
    accuracy: avgDistance,
  };
}

// Create beacon (admin)
router.post("/", async (req: Request, res: Response) => {
  try {
    const { uuid, major, minor, floor_id, x, y, name, tx_power } = req.body;

    const result = await pool.query(
      `INSERT INTO beacons (uuid, major, minor, floor_id, x, y, name, tx_power) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [uuid, major, minor, floor_id, x, y, name, tx_power || -59]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating beacon:", error);
    res.status(500).json({ error: "Failed to create beacon" });
  }
});

// Update beacon (admin)
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { uuid, major, minor, x, y, name, tx_power } = req.body;

    const result = await pool.query(
      `UPDATE beacons 
       SET uuid = $1, major = $2, minor = $3, x = $4, y = $5, name = $6, tx_power = $7
       WHERE id = $8 RETURNING *`,
      [uuid, major, minor, x, y, name, tx_power, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Beacon not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating beacon:", error);
    res.status(500).json({ error: "Failed to update beacon" });
  }
});

// Delete beacon (admin)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM beacons WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Beacon not found" });
    }

    res.json({ message: "Beacon deleted successfully" });
  } catch (error) {
    console.error("Error deleting beacon:", error);
    res.status(500).json({ error: "Failed to delete beacon" });
  }
});

export default router;
