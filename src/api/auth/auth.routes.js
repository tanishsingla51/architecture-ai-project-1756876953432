import { Router } from 'express';
import { registerUser, loginUser, getMe } from './auth.controller.js';
import { registerValidator, loginValidator } from './auth.validation.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', registerValidator, validate, registerUser);
router.post('/login', loginValidator, validate, loginUser);
router.get('/me', protect, getMe);

export default router;
