import { Router } from "express";
import pool from '../../../db.js';

const router = Router();


router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Check if sub-category exists
    const check = await pool.query(
      'SELECT * FROM sub_categories WHERE sub_category_id = $1',
      [id]
    );
    if (check.rows.length === 0) {
      return res.status(404).json({ message: "Sub-category not found" });
    }

    // Delete sub-category
    await pool.query('DELETE FROM sub_categories WHERE sub_category_id = $1', [id]);

    res.status(200).json({ message: "Sub-category deleted successfully" });
  } catch (error) {
    console.error("Error deleting sub-category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
