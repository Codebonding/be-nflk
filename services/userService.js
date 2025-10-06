const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh123';

class UserService {

    static async registerUser({ username, email, password, role }) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) throw new Error('Email already exists');

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role
        });

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };
    }

    static async loginUser({ email, password }) {
        const user = await User.findOne({ where: { email } });
        if (!user) throw new Error('Invalid email or password');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Invalid email or password');

        // Access token (short-lived)
        const accessToken = jwt.sign(
            { id: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '6h' } // 6 hours
        );

        // Refresh token (long-lived)
        const refreshToken = jwt.sign(
            { id: user.id, role: user.role },
            REFRESH_SECRET,
            { expiresIn: '7d' } // 7 days
        );

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        };
    }
}

module.exports = UserService;
