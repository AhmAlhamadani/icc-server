import { Router } from "express";
import pool from '../../../db.js';

const router = Router();

// GET /admin/users/:id - Get user info by user_id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT
        user_id,
        email,
        first_name,
        last_name,
        phone_number,
        user_role,
        created_at,
        updated_at
      FROM users
      WHERE user_id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;