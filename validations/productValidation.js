const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
  buyingCost: Joi.number().positive().required(),
  originalPrice: Joi.number().positive().required(),
  offerPrice: Joi.number().positive().allow(null),
  stock: Joi.number().integer().min(0).required(),
  categories: Joi.array().items(Joi.string()).allow(null),
  images: Joi.array().items(Joi.string().uri()).allow(null),
  specifications: Joi.object().allow(null)
});

module.exports = { productSchema };