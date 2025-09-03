import { Router } from 'express';
import { getUserProfile, updateUserProfile } from './user.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = Router();

// All routes here are protected
router.use(protect);

router.route('/profile').get(getUserProfile).put(updateUserProfile);

// Future routes for address management can go here
// router.route('/addresses')
//   .get(getUserAddresses)
//   .post(addUserAddress);
// router.route('/addresses/:addressId')
//   .put(updateUserAddress)
//   .delete(deleteUserAddress);

export default router;
