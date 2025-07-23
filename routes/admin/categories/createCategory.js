import { Router } from "express";

//file imports
import pool from '../../../db.js';

// Intialize middleware
const router = Router();

router.post('/', async (req, res) => {
  try {
    const { categoryName } = req.body;

    // Check if category already exists
    const existingCategory = await pool.query(
      'SELECT * FROM categories WHERE name = $1',
      [categoryName]
    );

    if (existingCategory.rows.length > 0) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // Create new category
    const newCategory = await pool.query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [categoryName]
    );

    res.status(201).json(newCategory.rows[0]);
  } catch (error) {
    console.error("Category creation error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;