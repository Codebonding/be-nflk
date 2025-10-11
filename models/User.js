const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true
  },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { 
    type: DataTypes.ENUM('admin','employee','cash_counter','customer'),
    defaultValue: 'customer'
  },
  gender: { 
    type: DataTypes.ENUM('male','female','other'), 
    allowNull: false,
    defaultValue: 'other'
  },
  otp: { type: DataTypes.STRING },
  otpExpiresAt: { type: DataTypes.DATE },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  status: { type: DataTypes.ENUM('active','deactive'), defaultValue: 'active' }
}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;
