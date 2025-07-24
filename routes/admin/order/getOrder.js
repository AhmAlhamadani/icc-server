import { Router } from "express";
import pool from '../../../db.js';

const router = Router();

// GET /admin/orders/:orderId
router.get("/:orderId", async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await pool.query(`
      SELECT o.*, u.email, u.first_name, u.last_name
      FROM orders o
      JOIN users u ON o.user_id = u.user_id
      WHERE o.order_id = $1
    `, [orderId]);

    const items = await pool.query(`
      SELECT oi.*, p.product_name, p.product_picture_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      WHERE oi.order_id = $1
    `, [orderId]);

    if (order.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ order: order.rows[0], items: items.rows });
  } catch (err) {
    console.error("Error fetching order details:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


export default router;