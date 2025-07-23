// import { Router } from 'express';
// import pool from '../../../db.js';

// const router = Router();

// router.put('/:id', async (req, res) => {
//   const { id } = req.params;
//   const { points, action, description, order_id = null } = req.body;

//   if (points === undefined || typeof points !== 'number') {
//     return res.status(400).json({ message: "Points (number) is required" });
//   }

//   try {
//     const result = await pool.query(
//       `UPDATE users 
//        SET points = points + $1, updated_at = NOW() 
//        WHERE user_id = $2 
//        RETURNING *`,
//       [points, id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json({ message: "User points incremented", user: result.rows[0] });
//   } catch (error) {
//     console.error('Error updating user points:', error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;

import { Router } from 'express';
import pool from '../../../db.js';
const router = Router();

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { points, description, order_id = null } = req.body;

  // Basic validation
  if (typeof points !== 'number') {
    return res.status(400).json({ message: "Points (number) is required" });
  }

  if (points === 0) {
    return res.status(400).json({ message: "Points cannot be zero" });
  }

  const action = points > 0 ? 'rewarded' : 'deducted';

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Update user points
    const userResult = await client.query(
      `UPDATE users 
       SET points = points + $1, updated_at = NOW() 
       WHERE user_id = $2 
       RETURNING *`,
      [points, id]
    );

    if (userResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: "User not found" });
    }

    // Insert into points_history
    await client.query(
      `INSERT INTO points_history (user_id, order_id, points, action, description) 
       VALUES ($1, $2, $3, $4, $5)`,
      [id, order_id, points, action, description]
    );

    await client.query('COMMIT');

    res.json({ 
      message: `User points ${action} successfully`, 
      user: userResult.rows[0] 
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating user points:', error);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
});

export default router;


