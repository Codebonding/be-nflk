const Joi = require('joi');

const addToCartSchema = Joi.object({
  productId: Joi.string().uuid().required(),
  quantity: Joi.number().integer().min(1).required(),
  guestId: Joi.string().allow(null)
});

const updateCartSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required()
});

module.exports = { addToCartSchema, updateCartSchema };
