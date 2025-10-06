const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const User = require('./User');
const Product = require('./Product');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true, // null for guest
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE'
  },
  guestId: {
    type: DataTypes.STRING, // temporary ID for guest cart
    allowNull: true
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'products', key: 'id' },
    onDelete: 'CASCADE'
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false
  }
}, {
  tableName: 'carts',
  timestamps: true
});

// Associations
User.hasMany(Cart, { foreignKey: 'userId', as: 'carts' });
Cart.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(Cart, { foreignKey: 'productId', as: 'carts' });
Cart.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

module.exports = Cart;
