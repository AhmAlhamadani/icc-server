import { Router } from "express";
import pool from '../../../db.js'; 

const router = Router();

router.get("/", async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
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