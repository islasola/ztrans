import express from 'express';
import { login, logout, signature } from '../controllers/authController';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/signature', signature);

export default router;