// services/productReviewService.js
const ProductReview = require('../models/ProductReview');
const User = require('../models/User');

class ProductReviewService {
  static async addReview(data) {
    return await ProductReview.create(data);
  }

  static async getReviewsByProduct(productId) {
    return await ProductReview.findAll({
      where: { productId },
      include: [{ model: User, as: 'user', attributes: ['id', 'username', 'email'] }],
      order: [['createdAt', 'DESC']]
    });
  }

  static async deleteReview(id) {
    const review = await ProductReview.findByPk(id);
    if (!review) throw new Error("Review not found");
    await review.destroy();
    return { message: "Review deleted successfully" };
  }
}

module.exports = ProductReviewService;