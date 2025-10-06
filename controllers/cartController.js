const CartService = require('../services/cartService');
const { addToCartSchema, updateCartSchema } = require('../validations/cartValidation');

// Add to cart
exports.addToCart = async (req, res) => {
  try {
    const { error } = addToCartSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const userId = req.user?.id || null;
    const guestId = req.body.guestId || null;
    const { productId, quantity } = req.body;

    const cartItem = await CartService.addToCart({ userId, guestId, productId, quantity });
    res.status(200).json({ success: true, cartItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const guestId = req.query.guestId || null;
    const cartItems = await CartService.getCart({ userId, guestId });
    res.status(200).json({ success: true, cartItems });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update cart
exports.updateCart = async (req, res) => {
  try {
    const { error } = updateCartSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const cartItem = await CartService.updateCart(req.params.id, req.body.quantity);
    res.status(200).json({ success: true, cartItem });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

// Remove cart item
exports.removeCartItem = async (req, res) => {
  try {
    const result = await CartService.removeCartItem(req.params.id);
    res.status(200).json({ success: true, message: result.message });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

// Clear cart (after Buy Now)
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const guestId = req.body.guestId || null;
    const result = await CartService.clearCart({ userId, guestId });
    res.status(200).json({ success: true, message: result.message });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
