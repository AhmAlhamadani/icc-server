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

    // 4. Get order items for all orders at once
    let enrichedOrders = [];
    if (orders.length > 0) {
      const orderIds = orders.map(o => o.order_id);
      const orderItemsResult = await pool.query(
        `
        SELECT 
          oi.*, 
          p.product_name, 
          p.product_picture_url 
        FROM order_items oi
        JOIN products p ON oi.product_id = p.product_id
        WHERE oi.order_id = ANY($1::uuid[])
        `,
        [orderIds]
      );

      const orderItems = orderItemsResult.rows;

      // Group order items under their corresponding order
      enrichedOrders = orders.map(order => {
        const items = orderItems.filter(oi => oi.order_id === order.order_id);
        return { ...order, items };
      });
    }

    // 5. Get cart items
    const cartItemsResult = await pool.query(
      "SELECT * FROM cart_items WHERE user_id = $1", [id]
    );

    // 6. Get points history
    const pointsHistoryResult = await pool.query(
      `SELECT * FROM points_history WHERE user_id = $1 OR order_id IN (
        SELECT order_id FROM orders WHERE user_id = $1
      )`, [id]
    );

    // Final response
    res.json({
      user,
      addresses: addressesResult.rows,
      orders: enrichedOrders,
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
