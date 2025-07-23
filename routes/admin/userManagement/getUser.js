import { Router } from "express";
import pool from '../../../db.js';

const router = Router();

// GET /admin/users/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Get user basic info
    const userResult = await pool.query(`
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

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult.rows[0];

    // 2. Get addresses
    const addressesResult = await pool.query(
      "SELECT * FROM address WHERE user_id = $1", [id]
    );

    // 3. Get orders
    const ordersResult = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1", [id]
    );

    const orders = ordersResult.rows;

    // 4. For each order, get order items
    // (Alternatively, get all order items for user's orders at once)
    let orderItems = [];
    if (orders.length > 0) {
      const orderIds = orders.map(o => o.order_id);
      const orderItemsResult = await pool.query(
        `SELECT * FROM order_items WHERE order_id = ANY($1::uuid[])`, [orderIds]
      );
      orderItems = orderItemsResult.rows;
    }

    // 5. Get cart items
    const cartItemsResult = await pool.query(
      "SELECT * FROM cart_items WHERE user_id = $1", [id]
    );

    // 6. Get points history (both linked directly to user and orders)
    const pointsHistoryResult = await pool.query(
      `SELECT * FROM points_history WHERE user_id = $1 OR order_id IN (
        SELECT order_id FROM orders WHERE user_id = $1
      )`, [id]
    );

    // Compose response
    res.json({
      user,
      addresses: addressesResult.rows,
      orders,
      orderItems,
      cartItems: cartItemsResult.rows,
      pointsHistory: pointsHistoryResult.rows,
    });

    console.log("User and related data retrieved successfully:", user.user_id);
  } catch (err) {
    console.error("Error retrieving user and related data:", err);
    res.status(500).send("Server error");
  }
});

export default router;
