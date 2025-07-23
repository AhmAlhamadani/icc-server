import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); 

export default (req, res, next) => {

    try {

        const jwtToken = req.header("token");

        if (!jwtToken) {
            return res.status(403).json({ message: "Authorization token is required" });
        }

        const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);

        req.user = payload; 
        next(); 

    } catch (error) {
        console.error("Authorization error:", error);
        res.status(403).json({ message: "Forbidden" });
    }

}