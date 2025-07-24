import { Router } from "express";
import pool from '../../../db.js';

const router = Router();

router.get("/", async (req, res) => {
  try {
    const orders = await pool.query(`
      SELECT 
        o.order_id, 
        o.user_id, 
        u.email, 
        u.first_name, 
        u.last_name,
        o.total_amount, 
        o.status, 
        o.order_date
      FROM orders o
      JOIN users u ON o.user_id = u.user_id
      ORDER BY o.order_date DESC
    `);
    res.json(orders.rows);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;