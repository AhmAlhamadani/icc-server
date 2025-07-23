import { Router } from "express";
import pool from '../../../db.js'; 

const router = Router();

router.get("/:id", async (req, res) => {
  try {
    const users = await pool.query(`
      SELECT 
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
      FROM users
    `); 

    res.json(users.rows);
    console.log("Users retrieved successfully:", users.rows);
  } catch (err) {
    console.error("Error retrieving users:", err);
    res.status(500).send("Server error");
  }
});

export default router;