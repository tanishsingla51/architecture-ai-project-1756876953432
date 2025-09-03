import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, 'Review comment cannot be empty.'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please provide a rating between 1 and 5.'],
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent user from submitting more than one review per restaurant
reviewSchema.index({ restaurant: 1, user: 1 }, { unique: true });

export const Review = mongoose.model('Review', reviewSchema);
