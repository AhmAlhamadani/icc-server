import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

function generateJWT(user_id, userRole) {
    const payload = {
        userId: user_id,
        userRole: userRole
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export default generateJWT;
