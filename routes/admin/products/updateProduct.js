import { Router } from "express";
import pool from '../../../db.js';

const router = Router();

// PUT /admin/products/:id - Update a product by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
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
  } = req.body;

  try {
    // Check if product exists
    const check = await pool.query(
      'SELECT * FROM products WHERE product_id = $1',
      [id]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Build dynamic update query
    const fields = [];
    const values = [];
    let index = 1;

    if (product_name !== undefined) {
      fields.push(`product_name = $${index++}`);
      values.push(product_name);
    }
    if (product_description !== undefined) {
      fields.push(`product_description = $${index++}`);
      values.push(product_description);
    }
    if (product_picture_url !== undefined) {
      fields.push(`product_picture_url = $${index++}`);
      values.push(product_picture_url);
    }
    if (brand !== undefined) {
      fields.push(`brand = $${index++}`);
      values.push(brand);
    }
    if (category_id !== undefined) {
      fields.push(`category_id = $${index++}`);
      values.push(category_id);
    }
    if (sub_category_id !== undefined) {
      fields.push(`sub_category_id = $${index++}`);
      values.push(sub_category_id);
    }
    if (is_available !== undefined) {
      fields.push(`is_available = $${index++}`);
      values.push(is_available);
    }
    if (tier_discount_for_plus !== undefined) {
      fields.push(`tier_discount_for_plus = $${index++}`);
      values.push(tier_discount_for_plus);
    }
    if (tier_discount_for_pro !== undefined) {
      fields.push(`tier_discount_for_pro = $${index++}`);
      values.push(tier_discount_for_pro);
    }
    if (tier_discount_for_premium !== undefined) {
      fields.push(`tier_discount_for_premium = $${index++}`);
      values.push(tier_discount_for_premium);
    }
    if (discount !== undefined) {
      fields.push(`discount = $${index++}`);
      values.push(discount);
    }
    if (points_price !== undefined) {
      fields.push(`points_price = $${index++}`);
      values.push(points_price);
    }

    // Always update the timestamp
    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    if (fields.length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    const updateQuery = `
      UPDATE products
      SET ${fields.join(', ')}
      WHERE product_id = $${index}
      RETURNING *;
    `;
    values.push(id);

    const updated = await pool.query(updateQuery, values);

    res.status(200).json(updated.rows[0]);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
