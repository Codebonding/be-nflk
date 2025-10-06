const Product = require("../models/Product");
const ProductReview = require("../models/ProductReview");
const User = require("../models/User");

class ProductService {
  static async createProduct(data) {
    return await Product.create(data);
  }

   static async getAllProducts(filters = {}) {
    const { search, minRating, category, minPrice, maxPrice } = filters;

    // Base product query
    const products = await Product.findAll({
      where: {
        // Search by name or description
        ...(search && {
          [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } },
            { description: { [Op.iLike]: `%${search}%` } }
          ]
        }),
        // Filter by price
        ...(minPrice || maxPrice ? {
          originalPrice: {
            ...(minPrice ? { [Op.gte]: minPrice } : {}),
            ...(maxPrice ? { [Op.lte]: maxPrice } : {})
          }
        } : {}),
        // Filter by category
        ...(category ? {
          categories: {
            [Op.contains]: [category]
          }
        } : {})
      },
      include: [
        {
          model: ProductReview,
          as: 'reviews',
          attributes: ['id', 'userId', 'rating', 'review', 'createdAt'],
          include: [{ model: User, as: 'user', attributes: ['id', 'username'] }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Calculate average rating and apply minRating filter
    let productsWithRatings = products.map(product => {
      const reviews = product.reviews || [];
      const averageRating = reviews.length
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      return {
        ...product.toJSON(),
        averageRating: parseFloat(averageRating.toFixed(2)),
        reviewCount: reviews.length
      };
    });

    // Filter by minRating if provided
    if (minRating) {
      productsWithRatings = productsWithRatings.filter(p => p.averageRating >= minRating);
    }

    return productsWithRatings;
  }

  static async getProductById(id) {
    const product = await Product.findByPk(id, {
      include: [
        {
          model: ProductReview,
          as: 'reviews',
          attributes: ['id', 'userId', 'rating', 'review', 'createdAt'],
          include: [{ model: require('./User'), as: 'user', attributes: ['id', 'username'] }]
        }
      ]
    });

    if (!product) return null;

    const reviews = product.reviews || [];
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return {
      ...product.toJSON(),
      averageRating: parseFloat(averageRating.toFixed(2)),
      reviewCount: reviews.length
    };
  }

  static async getProductById(id) {
    return await Product.findByPk(id);
  }

  static async updateProduct(id, data) {
    const product = await Product.findByPk(id);
    if (!product) throw new Error("Product not found");
    return await product.update(data);
  }

  static async deleteProduct(id) {
    const product = await Product.findByPk(id);
    if (!product) throw new Error("Product not found");
    await product.destroy();
    return { message: "Product deleted successfully" };
  }
}

module.exports = ProductService;
