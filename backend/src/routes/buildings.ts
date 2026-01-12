import { Router, Request, Response } from "express";
import pool from "../config/database";
import { transformKeys } from "../utils/transformers";

const router = Router();

// Get all buildings
router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM buildings ORDER BY name");
    res.json(transformKeys(result.rows));
  } catch (error) {
    console.error("Error fetching buildings:", error);
    res.status(500).json({ error: "Failed to fetch buildings" });
  }
});

// Get building by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM buildings WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Building not found" });
    }

    res.json(transformKeys(result.rows[0]));
  } catch (error) {
    console.error("Error fetching building:", error);
    res.status(500).json({ error: "Failed to fetch building" });
  }
});

// Get building with all floors
router.get("/:id/floors", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM floors WHERE building_id = $1 ORDER BY floor_number",
      [id]
    );
    res.json(transformKeys(result.rows));
  } catch (error) {
    console.error("Error fetching floors:", error);
    res.status(500).json({ error: "Failed to fetch floors" });
  }
});

// Create building (admin)
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, address, latitude, longitude, description } = req.body;

    const result = await pool.query(
      `INSERT INTO buildings (name, address, latitude, longitude, description) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, address, latitude, longitude, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating building:", error);
    res.status(500).json({ error: "Failed to create building" });
  }
});

// Update building (admin)
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, address, latitude, longitude, description } = req.body;

    const result = await pool.query(
      `UPDATE buildings 
       SET name = $1, address = $2, latitude = $3, longitude = $4, description = $5
       WHERE id = $6 RETURNING *`,
      [name, address, latitude, longitude, description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Building not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating building:", error);
    res.status(500).json({ error: "Failed to update building" });
  }
});

// Delete building (admin)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM buildings WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Building not found" });
    }

    res.json({ message: "Building deleted successfully" });
  } catch (error) {
    console.error("Error deleting building:", error);
    res.status(500).json({ error: "Failed to delete building" });
  }
});

export default router;
