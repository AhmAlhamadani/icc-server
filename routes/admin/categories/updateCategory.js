import { Router } from "express";
import pool from '../../../db.js';

const router = Router();


router.put('/:id', async (req, res) => {
    const { name } = req.body; 
    const { id } = req.params;

  try {
    // Check if category exists
    const check = await pool.query(
      'SELECT * FROM categories WHERE category_id = $1',
      [id]
    );
    if (check.rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update category
    await pool.query(
      'UPDATE categories SET name = $1 WHERE category_id = $2',
      [name, id]
    );

    res.status(200).json({ message: "Category updated successfully" });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
