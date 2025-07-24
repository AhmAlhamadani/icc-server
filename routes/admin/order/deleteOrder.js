import { Router } from "express";
import pool from '../../../db.js';

const router = Router();

// DELETE /admin/orders/:orderId
router.delete("/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    // Optional: Check order status
    const check = await pool.query(
      "SELECT status FROM orders WHERE order_id = $1",
      [orderId]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (check.rows[0].status !== "pending") {
      return res.status(400).json({ error: "Only pending orders can be deleted" });
    }

    await pool.query("DELETE FROM orders WHERE order_id = $1", [orderId]);
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;