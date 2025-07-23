import { Router } from "express";
import pool from '../../../db.js';
import authorizationAdmin from "../../../middleware/authorizationAdmin.js";

const router = Router();

// DELETE /admin/users/:id
router.delete("/:id", authorizationAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    // Optionally, check if the user exists first
    const userCheck = await pool.query("SELECT user_id FROM users WHERE user_id = $1", [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user
    await pool.query("DELETE FROM users WHERE user_id = $1", [id]);

    res.json({ message: `User with ID ${id} deleted successfully.` });
    console.log(`User with ID ${id} deleted successfully.`);
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send("Server error");
  }
});

export default router;