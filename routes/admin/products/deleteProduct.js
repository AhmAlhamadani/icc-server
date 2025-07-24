import { Router } from "express";
import pool from '../../../db.js';

const router = Router();

// DELETE /admin/products/:id - Delete a product by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the product exists
    const check = await pool.query(
      'SELECT product_id FROM products WHERE product_id = $1',
      [id]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete the product
    await pool.query(
      'DELETE FROM products WHERE product_id = $1',
      [id]
    );

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
