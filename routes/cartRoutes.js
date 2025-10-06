const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // optional for guest

const {
  addToCart,
  getCart,
  updateCart,
  removeCartItem,
  clearCart
} = require('../controllers/cartController');

// Public + Logged-in routes
router.post('/add', auth(['admin','employee','cash_counter'], true), addToCart); // true = optional auth
router.get('/', auth(['admin','employee','cash_counter'], true), getCart);
router.put('/:id', auth(['admin','employee','cash_counter'], true), updateCart);
router.delete('/:id', auth(['admin','employee','cash_counter'], true), removeCartItem);

// Clear cart after Buy Now
router.post('/clear', auth(['admin','employee','cash_counter'], true), clearCart);

module.exports = router;
