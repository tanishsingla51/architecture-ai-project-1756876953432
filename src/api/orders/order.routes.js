import { Router } from 'express';
import { createOrder, getMyOrders, getOrderById } from './order.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = Router();

// All routes are protected
router.use(protect);

router.route('/').post(createOrder);
router.route('/my-orders').get(getMyOrders);
router.route('/:id').get(getOrderById);

export default router;
