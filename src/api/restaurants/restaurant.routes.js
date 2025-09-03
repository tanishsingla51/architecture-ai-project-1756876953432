import { Router } from 'express';
import {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  addMenuItem,
  getRestaurantReviews,
} from './restaurant.controller.js';
import { protect, authorize } from '../../middlewares/auth.middleware.js';

const router = Router();

router
  .route('/')
  .get(getAllRestaurants) // Public
  .post(protect, authorize('owner', 'admin'), createRestaurant); // Private for owners/admins

router
  .route('/:id')
  .get(getRestaurantById) // Public
  .put(protect, authorize('owner', 'admin'), updateRestaurant) // Private for owners/admins
  .delete(protect, authorize('owner', 'admin'), deleteRestaurant); // Private for owners/admins

// Menu routes
router
  .route('/:id/menu')
  .post(protect, authorize('owner', 'admin'), addMenuItem); // Private for owners/admins

// Reviews for a restaurant
router.route('/:id/reviews').get(getRestaurantReviews); // Public

export default router;
