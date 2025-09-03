import { Restaurant } from './restaurant.model.js';
import { Review } from '../reviews/review.model.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

// @desc    Get all restaurants (with filtering/searching)
// @route   GET /api/v1/restaurants
// @access  Public
const getAllRestaurants = asyncHandler(async (req, res) => {
  const { keyword, cuisine } = req.query;
  const query = {};

  if (keyword) {
    query.name = { $regex: keyword, $options: 'i' }; // Case-insensitive search
  }

  if (cuisine) {
    query.cuisine = cuisine;
  }

  const restaurants = await Restaurant.find(query).populate('owner', 'name email');
  res.status(200).json(new ApiResponse(200, restaurants));
});

// @desc    Get a single restaurant by ID
// @route   GET /api/v1/restaurants/:id
// @access  Public
const getRestaurantById = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    throw new ApiError(404, 'Restaurant not found');
  }
  res.status(200).json(new ApiResponse(200, restaurant));
});

// @desc    Create a new restaurant
// @route   POST /api/v1/restaurants
// @access  Private (Owner, Admin)
const createRestaurant = asyncHandler(async (req, res) => {
  req.body.owner = req.user.id;
  const restaurant = await Restaurant.create(req.body);
  res.status(201).json(new ApiResponse(201, restaurant, 'Restaurant created successfully'));
});

// @desc    Update a restaurant
// @route   PUT /api/v1/restaurants/:id
// @access  Private (Owner, Admin)
const updateRestaurant = asyncHandler(async (req, res) => {
  let restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    throw new ApiError(404, 'Restaurant not found');
  }

  // Check if the logged-in user is the owner
  if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(403, 'User not authorized to update this restaurant');
  }

  restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(new ApiResponse(200, restaurant, 'Restaurant updated successfully'));
});

// @desc    Delete a restaurant
// @route   DELETE /api/v1/restaurants/:id
// @access  Private (Owner, Admin)
const deleteRestaurant = asyncHandler(async (req, res) => {
   const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    throw new ApiError(404, 'Restaurant not found');
  }

   if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(403, 'User not authorized to delete this restaurant');
  }

  await restaurant.deleteOne();

  res.status(200).json(new ApiResponse(200, {}, 'Restaurant deleted successfully'));
});

// @desc    Add a menu item to a restaurant
// @route   POST /api/v1/restaurants/:id/menu
// @access  Private (Owner, Admin)
const addMenuItem = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  
  if (!restaurant) {
    throw new ApiError(404, 'Restaurant not found');
  }

  if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(403, 'User not authorized to update this restaurant');
  }

  restaurant.menu.push(req.body);
  await restaurant.save();
  
  res.status(201).json(new ApiResponse(201, restaurant.menu, 'Menu item added'));
});

// @desc    Get reviews for a restaurant
// @route   GET /api/v1/restaurants/:id/reviews
// @access  Public
const getRestaurantReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ restaurant: req.params.id }).populate('user', 'name');
    res.status(200).json(new ApiResponse(200, reviews));
});

export { 
    createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
    addMenuItem,
    getRestaurantReviews
};
