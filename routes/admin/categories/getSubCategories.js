import { Router } from "express";
import pool from '../../../db.js';

const router = Router();


router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    let result;

    if (id) {
      result = await pool.query(
        'SELECT * FROM sub_categories WHERE category_id = $1 ORDER BY sub_category_id ASC',
        [id]
      );
    } else {
      result = await pool.query('SELECT * FROM sub_categories ORDER BY sub_category_id ASC');
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching sub-categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;