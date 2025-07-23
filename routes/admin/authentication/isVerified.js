import { Router } from 'express';
const router = Router();

import authorizationAdmin from '../../../middleware/authorizationAdmin.js';

router.get('/', authorizationAdmin, async (req, res) => {
    try {
        res.json(true)

    } catch (error) {
        console.error("Error checking user verification status:", error);
        res.status(500).json({ message: "Internal server error" });
}});

export default router;