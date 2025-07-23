import { Router } from "express";
import pool from '../../../db.js'; 

const router = Router();

router.get("/", async (req, res) => {
  try {
    const user = await pool.query(
      `SELECT 
        user_id,
        email,
        auth_provider,
        first_name,
        last_name,
        phone_number,
        user_role,
        profile_picture_url,
        user_tier,
        lang_preference,
        points,
        notification_preference,
        created_at,
        updated_at
      FROM users WHERE user_id = $1`,
      [req.user.userId] 
    ); 
    
    res.json(user.rows[0]);
    console.log('Decoded user:', req.user)
    console.log("User info retrieved successfully:", user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

export default router;