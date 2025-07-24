import { Router } from "express";
import pool from '../../../db.js';

const router = Router();


router.delete('/:id', async (req, res) => {
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

    // Delete category (sub-categories should be deleted automatically if cascade is enabled)
    await pool.query('DELETE FROM categories WHERE category_id = $1', [id]);

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;