import { Router } from "express";
import pool from '../../../db.js';

const router = Router();

// DELETE /admin/users/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the user exists
    const userCheck = await pool.query("SELECT user_id FROM users WHERE user_id = $1", [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete order_items for user's orders
    await pool.query(`
      DELETE FROM order_items
      WHERE order_id IN (SELECT order_id FROM orders WHERE user_id = $1);
    `, [id]);

    // Delete points_history entries related to user's orders explicitly
    await pool.query(`
      DELETE FROM points_history
      WHERE order_id IN (SELECT order_id FROM orders WHERE user_id = $1);
    `, [id]);

    // Delete user's orders
    await pool.query("DELETE FROM orders WHERE user_id = $1", [id]);

    // Delete user's cart items
    await pool.query("DELETE FROM cart_items WHERE user_id = $1", [id]);

    // Delete user's addresses
    await pool.query("DELETE FROM address WHERE user_id = $1", [id]);

    // Delete points_history entries linked directly to user (not through orders)
    await pool.query("DELETE FROM points_history WHERE user_id = $1", [id]);

    // Finally, delete the user
    await pool.query("DELETE FROM users WHERE user_id = $1", [id]);

    res.json({ message: `User with ID ${id} and all related data deleted successfully.` });
    console.log(`User with ID ${id} and all related data deleted successfully.`);
  } catch (err) {
    console.error("Error deleting user and related data:", err);
    res.status(500).send("Server error");
  }
});

export default router;
