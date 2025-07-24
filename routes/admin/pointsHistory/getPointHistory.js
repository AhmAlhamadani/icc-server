import { Router } from "express";
import pool from '../../../db.js';

const router = Router();

// GET /admin/points-history - Get all points history
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        ph.points_history_id,
        ph.user_id,
        u.first_name,
        u.last_name,
        ph.order_id,
        ph.points,
        ph.action,
        ph.description,
        ph.created_at
      FROM points_history ph
      LEFT JOIN users u ON ph.user_id = u.user_id
      ORDER BY ph.created_at DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching points history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
