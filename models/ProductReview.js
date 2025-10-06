// models/ProductReview.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const Product = require('./Product');
const User = require('./User');

const ProductReview = sequelize.define('ProductReview', {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'products', key: 'id' },
    onDelete: 'CASCADE'
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE'
  },
  rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  review: { type: DataTypes.TEXT, allowNull: true }
}, {
  tableName: 'product_reviews',
  timestamps: true
});

// Associations
Product.hasMany(ProductReview, { foreignKey: 'productId', as: 'reviews' });
ProductReview.belongsTo(Product, { foreignKey: 'productId' });

User.hasMany(ProductReview, { foreignKey: 'userId', as: 'reviews' });
ProductReview.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = ProductReview;