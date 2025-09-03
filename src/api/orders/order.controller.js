import { Order } from './order.model.js';
import { Restaurant } from '../restaurants/restaurant.model.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

// @desc    Create a new order
// @route   POST /api/v1/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { restaurantId, items, deliveryAddress } = req.body;

  if (!items || items.length === 0) {
    throw new ApiError(400, 'No order items');
  }

  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    throw new ApiError(404, 'Restaurant not found');
  }

  // Simple price calculation logic (in a real app, this should be more robust)
  let totalAmount = 0;
  for (const item of items) {
    const menuItem = restaurant.menu.id(item.menuItemId);
    if (!menuItem) {
        throw new ApiError(404, `Menu item with id ${item.menuItemId} not found`);
    }
    totalAmount += menuItem.price * item.quantity;
  }

  const order = new Order({
    user: req.user.id,
    restaurant: restaurantId,
    items,
    totalAmount,
    deliveryAddress,
  });

  const createdOrder = await order.save();
  res.status(201).json(new ApiResponse(201, createdOrder, 'Order placed successfully'));
});

// @desc    Get logged in user's orders
// @route   GET /api/v1/orders/my-orders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).populate('restaurant', 'name');
  res.status(200).json(new ApiResponse(200, orders));
});

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('restaurant', 'name address');

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // Ensure user can only see their own order unless they are an admin/owner
  if (order.user._id.toString() !== req.user.id && req.user.role === 'user') {
    throw new ApiError(403, 'Not authorized to view this order');
  }

  res.status(200).json(new ApiResponse(200, order));
});

export { createOrder, getMyOrders, getOrderById };
