// import { Router } from "express";
// import pool from '../../db.js'; 

// const router = Router();

// router.get("/", async (req, res) => {
//   try {
//     const products = await pool.query(
//       "SELECT * FROM products"
//     ); 

//     res.json(products.rows);
//     console.log("Products retrieved successfully:", products.rows);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// export default router;