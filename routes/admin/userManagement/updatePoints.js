import { Router } from 'express';
import pool from '../../../db.js';
import authorizationAdmin from '../../../middleware/authorizationAdmin.js';

const router = Router();

router.put('/:id', authorizationAdmin, async (req, res) => {
  const { id } = req.params;
  const { points } = req.body;

  if (points === undefined || typeof points !== 'number') {
    return res.status(400).json({ message: "Points (number) is required" });
  }

  try {
    const result = await pool.query(
      `UPDATE users 
       SET points = points + $1, updated_at = NOW() 
       WHERE user_id = $2 
       RETURNING *`,
      [points, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User points incremented", user: result.rows[0] });
  } catch (error) {
    console.error('Error updating user points:', error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
