import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middlewares/error.middleware.js';

// Import routes
import authRoutes from './api/auth/auth.routes.js';
import userRoutes from './api/users/user.routes.js';
import restaurantRoutes from './api/restaurants/restaurant.routes.js';
import orderRoutes from './api/orders/order.routes.js';

const app = express();

// Global Middlewares
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(helmet()); // Secure your app by setting various HTTP headers
app.use(express.json({ limit: '16kb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '16kb' })); // Parse URL-encoded bodies

// --- API Routes ---
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/restaurants', restaurantRoutes);
app.use('/api/v1/orders', orderRoutes);

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Zomato Clone API!' });
});

// Central Error Handler
app.use(errorHandler);

export default app;
