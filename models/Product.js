const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(), // generate UUID
    primaryKey: true
  },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  buyingCost: { type: DataTypes.FLOAT, allowNull: false },  
  originalPrice: { type: DataTypes.FLOAT, allowNull: false },
  offerPrice: { type: DataTypes.FLOAT, allowNull: true },
  stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  categories: { type: DataTypes.JSON, allowNull: true },
  images: { type: DataTypes.JSON, allowNull: true },
  specifications: { type: DataTypes.JSON, allowNull: true },
}, {
  tableName: 'products',
  timestamps: true
});

module.exports = Product;