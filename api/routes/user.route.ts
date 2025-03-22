import express from 'express';
import controller from '../controllers/user.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/register', controller.register);

router.post('/login', controller.login);

router.post('/password/forgot', controller.forgotPassword);

router.post('/password/otp', controller.otpPassword);

router.post('/password/reset', controller.resetPassword);

router.get('/detail', authMiddleware.requireAuth, controller.detail);

router.get('/list', authMiddleware.requireAuth, controller.list);

export default router; 