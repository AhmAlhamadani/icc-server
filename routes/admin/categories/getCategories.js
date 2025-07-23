import { Router } from "express";
import pool from '../../../db.js';

const router = Router();

// GET /admin/categories - Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await pool.query('SELECT * FROM categories ORDER BY category_id ASC');
    res.status(200).json(categories.rows);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;