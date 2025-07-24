import { Router } from "express";
import pool from '../../../db.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const {
      product_name,
      product_description,
      product_picture_url,
      brand,
      category_id,
      sub_category_id,
      is_available = true,
      tier_discount_for_plus = 0.0,
      tier_discount_for_pro = 0.0,
      tier_discount_for_premium = 0.0,
      discount = 0.0,
      points_price
    } = req.body;

    // Basic validation
    if (!product_name || !product_picture_url || !brand) {
      return res.status(400).json({ message: "product_name, product_picture_url, and brand are required" });
    }

    const newProduct = await pool.query(
      `INSERT INTO products (
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
        points_price
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12
      ) RETURNING *`,
      [
        product_name,
        product_description || null,
        product_picture_url,
        brand,
        category_id || null,
        sub_category_id || null,
        is_available,
        tier_discount_for_plus,
        tier_discount_for_pro,
        tier_discount_for_premium,
        discount,
        points_price || null
      ]
    );

    res.status(201).json(newProduct.rows[0]);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
