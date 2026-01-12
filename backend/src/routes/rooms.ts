import { Router, Request, Response } from "express";
import pool from "../config/database";
import { transformKeys } from "../utils/transformers";

const router = Router();

// Get room by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM rooms WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.json(transformKeys(result.rows[0]));
  } catch (error) {
    console.error("Error fetching room:", error);
    res.status(500).json({ error: "Failed to fetch room" });
  }
});

// Search rooms
router.get("/search", async (req: Request, res: Response) => {
  try {
    const { q, buildingId } = req.query;

    let query = `
      SELECT r.*, f.floor_number, f.building_id 
      FROM rooms r
      JOIN floors f ON r.floor_id = f.id
      WHERE (r.room_number ILIKE $1 OR r.room_name ILIKE $1)
    `;
    const params: any[] = [`%${q}%`];

    if (buildingId) {
      query += " AND f.building_id = $2";
      params.push(buildingId);
    }

    query += " ORDER BY f.floor_number, r.room_number";

    const result = await pool.query(query, params);
    res.json(transformKeys(result.rows));
  } catch (error) {
    console.error("Error searching rooms:", error);
    res.status(500).json({ error: "Failed to search rooms" });
  }
});

// Create room (admin)
router.post("/", async (req: Request, res: Response) => {
  try {
    const { floor_id, room_number, room_name, x, y, node_id, description } =
      req.body;

    const result = await pool.query(
      `INSERT INTO rooms (floor_id, room_number, room_name, x, y, node_id, description) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [floor_id, room_number, room_name, x, y, node_id, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ error: "Failed to create room" });
  }
});

// Update room (admin)
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { room_number, room_name, x, y, node_id, description } = req.body;

    const result = await pool.query(
      `UPDATE rooms 
       SET room_number = $1, room_name = $2, x = $3, y = $4, node_id = $5, description = $6
       WHERE id = $7 RETURNING *`,
      [room_number, room_name, x, y, node_id, description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({ error: "Failed to update room" });
  }
});

// Delete room (admin)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM rooms WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ error: "Failed to delete room" });
  }
});

export default router;
