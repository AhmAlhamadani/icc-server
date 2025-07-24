import { Router } from "express";
import pool from '../../../db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        product_id,
        product_name,
        product_picture_url,
        brand,
        is_available,
        discount,
        points_price,
        tier_discount_for_plus,
        tier_discount_for_pro,
        tier_discount_for_premium
      FROM products
      ORDER BY created_at DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching product list:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
