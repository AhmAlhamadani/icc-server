import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export default (req, res, next) => {
  try {
    const jwtToken = req.header("token");

    if (!jwtToken) {
      return res.status(403).json({ message: "Authorization token is required" });
    }

    const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);

    if (payload.userRole !== 'admin') {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    req.user = payload;  // Attach user info to request object if needed further

    next();

  } catch (error) {
    console.error("Admin authorization error:", error);
    res.status(403).json({ message: "Forbidden" });
  }
};