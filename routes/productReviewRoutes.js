const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  addReview,
  getReviews,
  deleteReview
} = require('../controllers/productReviewController');

// Public route: get all reviews of a product
router.get('/:productId', getReviews);

// Protected routes
router.post('/', auth(['user','admin']), addReview); // only logged-in users/admins can add
router.delete('/:id', auth(['admin']), deleteReview); // only admin can delete

module.exports = router;