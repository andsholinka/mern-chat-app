import express from 'express';
import {
    getUsersForSidebar
} from '../controllers/user.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get("/", auth, getUsersForSidebar);

export default router;