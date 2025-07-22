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
    // destructure the request body
    const { email, firstName, lastName, password } = req.body;

    // check if user exists > if exists, return an error
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length !== 0) {
      return res.status(401).json({ message: "User already exists" });
    } // 401: Unauthenticated

    // decrypt password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // enter user into the database
    const newUser = await pool.query(
      'INSERT INTO users (email, first_name, last_name, password) VALUES ($1, $2, $3, $4) RETURNING user_id, email, first_name, last_name, user_role;',
      [email, firstName, lastName, hashedPassword]
    );

    // generate a token (JWT)
    const token = generateJWT(
        newUser.rows[0].user_id,
        newUser.rows[0].user_role
    );

    res.json({ token });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;