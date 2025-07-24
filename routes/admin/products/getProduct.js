import { Router } from "express";
import pool from '../../../db.js';

const router = Router();

// GET /admin/products/:id - Get full product details by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        product_id,
        product_name,
        product_description,
        product_picture_url,
        brand,
        category_id,
        sub_category_id,
        is_available,
        tier_discount_for_plus,
        tier_discount_for_pro,
        tier_discount_for_premium,
        discount,
        points_price,
        created_at,
        updated_at
      FROM products
      WHERE product_id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
