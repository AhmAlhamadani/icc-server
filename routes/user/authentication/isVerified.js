import { Router } from 'express';
const router = Router();

import authorizationUser from '../../../middleware/authorizationUser.js';

router.get('/', authorizationUser, async (req, res) => {
    try {
        res.json(true)

    } catch (error) {
        console.error("Error checking user verification status:", error);
        res.status(500).json({ message: "Internal server error" });
}});

export default router;
