import { Router } from "express";
import pool from '../../../db.js';

const router = Router();

router.put('/:id', async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  if (!name) {
    return res.status(400).json({ message: "Sub-category name is required" });
  }

  try {
    // Check if sub-category exists
    const check = await pool.query(
      'SELECT * FROM sub_categories WHERE sub_category_id = $1',
      [id]
    );
    if (check.rows.length === 0) {
      return res.status(404).json({ message: "Sub-category not found" });
    }

    // Update sub-category name
    await pool.query(
      'UPDATE sub_categories SET name = $1 WHERE sub_category_id = $2',
      [name, id]
    );

    res.status(200).json({ message: "Sub-category updated successfully" });
  } catch (error) {
    console.error("Error updating sub-category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
