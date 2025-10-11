const Joi = require('joi');

// Registration Validation
const registerSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': 'Username is required',
    'any.required': 'Username is required'
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required'
  }),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    'string.empty': 'Phone number is required',
    'string.pattern.base': 'Phone number must be 10 digits',
    'any.required': 'Phone number is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  }),
  role: Joi.string().valid('admin','employee','cash_counter','customer').default('customer'),
  gender: Joi.string().valid('male','female','other').required().messages({
    'any.only': 'Gender must be either male, female, or other',
    'any.required': 'Gender is required'
  })
});

// Login Validation
const loginSchema = Joi.object({
  email: Joi.string().email().messages({ 'string.email': 'Please provide a valid email' }),
  phone: Joi.string().pattern(/^[0-9]{10}$/).messages({ 'string.pattern.base': 'Phone number must be 10 digits' }),
  password: Joi.string().required().messages({ 'string.empty': 'Password is required', 'any.required': 'Password is required' })
}).or('email','phone').messages({ 'object.missing': 'Please provide either email or phone to login' });

// OTP Validation
const otpSchema = Joi.object({
  email: Joi.string().email().messages({ 'string.email': 'Please provide a valid email' }),
  phone: Joi.string().pattern(/^[0-9]{10}$/).messages({ 'string.pattern.base': 'Phone number must be 10 digits' }),
  otp: Joi.string().length(6).required().messages({ 'string.empty': 'OTP is required', 'string.length': 'OTP must be exactly 6 digits', 'any.required': 'OTP is required' })
}).or('email','phone').messages({ 'object.missing': 'Please provide either email or phone for OTP verification' });

// Update Validation
const updateUserSchema = Joi.object({
  username: Joi.string().messages({ 'string.empty': 'Username cannot be empty' }),
  phone: Joi.string().pattern(/^[0-9]{10}$/).messages({ 'string.pattern.base': 'Phone number must be 10 digits' }),
  gender: Joi.string().valid('male','female','other').messages({ 'any.only': 'Gender must be male, female, or other' }),
  password: Joi.string().min(6).messages({ 'string.min': 'Password must be at least 6 characters long' }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).messages({ 'any.only': 'Confirm password must match password' })
}).with('password','confirmPassword');

module.exports = { registerSchema, loginSchema, otpSchema, updateUserSchema };
