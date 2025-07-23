import { Router } from "express";
import pool from '../../../db.js';
import authorizationAdmin from "../../../middleware/authorizationAdmin.js";

const router = Router();

// GET /admin/users/:id
router.get("/:id", authorizationAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    console.log("Requested user ID:", id);
    const user = await pool.query(`
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
      WHERE user_id = $1
    `, [id]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.rows[0]);
    console.log("User retrieved successfully:", user.rows[0]);
  } catch (err) {
    console.error("Error retrieving user:", err);
    res.status(500).send("Server error");
  }
});

export default router;
