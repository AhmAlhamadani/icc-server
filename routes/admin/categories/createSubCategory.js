import { Router } from "express";
import pool from '../../../db.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    console.log("Creating sub-category with name: %s under category ID: %s", name, categoryId);

    if (!name || !categoryId) {
      return res.status(400).json({ message: "Sub-category name and categoryId are required" });
    }

    // Check if parent category exists
    const categoryCheck = await pool.query(
      'SELECT * FROM categories WHERE category_id = $1',
      [categoryId]
    );
    if (categoryCheck.rows.length === 0) {
      return res.status(400).json({ message: "Parent category not found" });
    }

    // Check if sub-category with same name exists within the parent category
    const existingSubCategory = await pool.query(
      'SELECT * FROM sub_categories WHERE name = $1 AND category_id = $2',
      [name, categoryId]
    );
    if (existingSubCategory.rows.length > 0) {
      return res.status(400).json({ message: "Sub-category name already exists under this category" });
    }

    // Insert new sub-category
    const newSubCategory = await pool.query(
      'INSERT INTO sub_categories (name, category_id) VALUES ($1, $2) RETURNING *',
      [name, categoryId]
    );

    res.status(201).json(newSubCategory.rows[0]);
  } catch (error) {
    console.error("Sub-category creation error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
