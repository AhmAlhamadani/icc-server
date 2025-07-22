import { Router } from "express";
import bcrypt from 'bcrypt';

//file imports
import pool from '../../db.js';
import generateJWT from "../../utils/jwtGenerator.js";
import validInfo from '../../middleware/validinfo.js';

// Intialize middleware
const router = Router();

router.post('/', validInfo, async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const users = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (users.rows.length === 0) {
      return res.status(401).json({ message: "Password or Email is Incorrect" });
    } // 401: Unauthenticated

    const validPassword = await bcrypt.compare(password, users.rows[0].password);

    if (!validPassword) {
      return res.status(401).json({ message: "Password or Email is Incorrect" });
    }

    const jwtToken = generateJWT(users.rows[0].user_id, users.rows[0].user_role);

    res.json({ token: jwtToken });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;