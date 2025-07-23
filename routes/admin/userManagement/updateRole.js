import { Router } from 'express';
import pool from '../../../db.js';
import authorizationAdmin from '../../../middleware/authorizationAdmin.js';

const router = Router();

router.put('/:id', authorizationAdmin, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role) {
    return res.status(400).json({ message: "Role is required" });
  }

  try {
    const result = await pool.query(
      'UPDATE users SET user_role = $1, updated_at = NOW() WHERE user_id = $2 RETURNING *',
      [role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User role updated", user: result.rows[0] });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;