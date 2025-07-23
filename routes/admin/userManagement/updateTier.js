import { Router } from 'express';
import pool from '../../../db.js';

const router = Router();

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { tier } = req.body;

  if (!tier) {
    return res.status(400).json({ message: "Tier is required" });
  }

  try {
    const result = await pool.query(
      'UPDATE users SET user_tier = $1, updated_at = NOW() WHERE user_id = $2 RETURNING *',
      [tier, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User tier updated", user: result.rows[0] });
  } catch (error) {
    console.error('Error updating user tier:', error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
