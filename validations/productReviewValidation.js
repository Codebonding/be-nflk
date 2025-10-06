const Joi = require('joi');

const reviewSchema = Joi.object({
  productId: Joi.string().uuid().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  review: Joi.string().allow('', null)
});

module.exports = { reviewSchema };