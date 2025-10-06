// controllers/productReviewController.js
const ProductReviewService = require('../services/productReviewService');
const { reviewSchema } = require('../validations/productReviewValidation');

exports.addReview = async (req, res) => {
  try {
    const { error } = reviewSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const data = {
      ...req.body,
      userId: req.user.id // from auth middleware
    };

    const review = await ProductReviewService.addReview(data);
    return res.status(201).json({ success: true, review });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await ProductReviewService.getReviewsByProduct(req.params.productId);
    return res.status(200).json({ success: true, reviews });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const result = await ProductReviewService.deleteReview(req.params.id);
    return res.status(200).json({ success: true, message: result.message });
  } catch (err) {
    return res.status(404).json({ success: false, message: err.message });
  }
};
