import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();

function generateJWT(user, userRole) {
    const payload = {
        userId: user.user_id,
        userRole: userRole
    }

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

export default generateJWT;
