const Cart = require('../models/Cart');
const Product = require('../models/Product');

class CartService {

  static async addToCart({ userId, guestId, productId, quantity }) {
    let cartItem;

    if (userId) {
      cartItem = await Cart.findOne({ where: { userId, productId } });
    } else if (guestId) {
      cartItem = await Cart.findOne({ where: { guestId, productId } });
    }  

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
      return cartItem;
    }

    return await Cart.create({ userId, guestId, productId, quantity });
  }

  static async getCart({ userId, guestId }) {
    const where = userId ? { userId } : { guestId };
    const cartItems = await Cart.findAll({
      where,
      include: [{ model: Product, as: 'product' }]
    });
    return cartItems;
  }

  static async updateCart(id, quantity) {
    const cartItem = await Cart.findByPk(id);
    if (!cartItem) throw new Error('Cart item not found');
    cartItem.quantity = quantity;
    await cartItem.save();
    return cartItem;
  }

  static async removeCartItem(id) {
    const cartItem = await Cart.findByPk(id);
    if (!cartItem) throw new Error('Cart item not found');
    await cartItem.destroy();
    return { message: 'Cart item removed' };
  }

  static async clearCart({ userId, guestId }) {
    const where = userId ? { userId } : { guestId };
    await Cart.destroy({ where });
    return { message: 'Cart cleared' };
  }
}

module.exports = CartService;
