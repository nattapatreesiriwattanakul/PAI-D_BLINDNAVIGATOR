import { Router, Request, Response } from "express";
import pool from "../config/database";
import { transformKeys } from "../utils/transformers";

const router = Router();

// Get floor by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM floors WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Floor not found" });
    }

    res.json(transformKeys(result.rows[0]));
  } catch (error) {
    console.error("Error fetching floor:", error);
    res.status(500).json({ error: "Failed to fetch floor" });
  }
});

// Get rooms on a floor
router.get("/:id/rooms", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM rooms WHERE floor_id = $1 ORDER BY room_number",
      [id]
    );
    res.json(transformKeys(result.rows));
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
});

// Create floor (admin)
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      building_id,
      floor_number,
      floor_name,
      map_image_url,
      map_width,
      map_height,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO floors (building_id, floor_number, floor_name, map_image_url, map_width, map_height) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        building_id,
        floor_number,
        floor_name,
        map_image_url,
        map_width,
        map_height,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating floor:", error);
    res.status(500).json({ error: "Failed to create floor" });
  }
});

// Update floor (admin)
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { floor_number, floor_name, map_image_url, map_width, map_height } =
      req.body;

    const result = await pool.query(
      `UPDATE floors 
       SET floor_number = $1, floor_name = $2, map_image_url = $3, map_width = $4, map_height = $5
       WHERE id = $6 RETURNING *`,
      [floor_number, floor_name, map_image_url, map_width, map_height, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Floor not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating floor:", error);
    res.status(500).json({ error: "Failed to update floor" });
  }
});

// Delete floor (admin)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM floors WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Floor not found" });
    }

    res.json({ message: "Floor deleted successfully" });
  } catch (error) {
    console.error("Error deleting floor:", error);
    res.status(500).json({ error: "Failed to delete floor" });
  }
});

export default router;
