import { User } from '../users/user.model.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new ApiError(400, 'User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  if (!user) {
    throw new ApiError(500, 'Something went wrong while registering the user');
  }

  const token = user.generateAuthToken();
  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(201).json(
    new ApiResponse(
      201,
      { user: userResponse, token },
      'User registered successfully'
    )
  );
});

// @desc    Authenticate user & get token
// @route   POST /api/v1/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = user.generateAuthToken();
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json(
      new ApiResponse(
        200,
        { user: userResponse, token },
        'User logged in successfully'
      )
    );
  } else {
    throw new ApiError(401, 'Invalid email or password');
  }
});

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, req.user));
});

export { registerUser, loginUser, getMe };
