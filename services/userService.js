const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../config/smtp');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh123';

class UserService {

  static async registerUser({ username, email, phone, password, role, gender }) {
    if(await User.findOne({ where:{ email } })) throw new Error('Email already exists');
    if(await User.findOne({ where:{ phone } })) throw new Error('Phone already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10*60*1000);

    const user = await User.create({ username, email, phone, password:hashedPassword, role, gender, otp, otpExpiresAt });

    const mailOptions = {
      from: `"CodeBonding" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: 'Your OTP for CodeBonding',
      text: `Dear ${username},\n\nThank you for registering with CodeBonding.\nYour OTP is: ${otp}\nValid for 10 minutes.\n\nBest regards,\nCodeBonding Team`
    };

    transporter.sendMail(mailOptions,(err,info)=>{
      if(err) console.error('Error sending email:',err);
      else console.log('OTP email sent:',info.response);
    });

    return { id:user.id, username:user.username, email:user.email, phone:user.phone, gender:user.gender, role:user.role, message:'OTP sent.' };
  }

  static async verifyOtp({ email, phone, otp }) {
    const user = await User.findOne({ where: email ? { email } : { phone } });
    if(!user) throw new Error('User not found');
    if(user.isVerified) throw new Error('User already verified');
    if(user.otp !== otp) throw new Error('Invalid OTP');
    if(new Date() > user.otpExpiresAt) throw new Error('OTP expired');

    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    return { message:'OTP verified successfully. You can now login.' };
  }

  static async loginUser({ email, phone, password }) {
    const user = await User.findOne({ where: email ? { email } : { phone } });
    if(!user) throw new Error('Invalid email/phone or password');
    if(!user.isVerified) throw new Error('Please verify OTP before login');

    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch) throw new Error('Invalid email/phone or password');

    const accessToken = jwt.sign({ id:user.id, role:user.role }, JWT_SECRET, { expiresIn:'6h' });
    const refreshToken = jwt.sign({ id:user.id, role:user.role }, REFRESH_SECRET, { expiresIn:'7d' });

    return { accessToken, refreshToken, user:{ id:user.id, username:user.username, email:user.email, phone:user.phone, gender:user.gender, role:user.role, status:user.status } };
  }

  static async getUserById(id) {
    const user = await User.findByPk(id);
    if(!user) throw new Error('User not found');
    return user;
  }

  static async getAllUsers() {
    return await User.findAll();
  }

  static async updateUser(id,data) {
    const user = await User.findByPk(id);
    if(!user) throw new Error('User not found');

    if(data.password) data.password = await bcrypt.hash(data.password,10);
    await user.update(data);
    return user;
  }
}

module.exports = UserService;