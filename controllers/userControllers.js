const UserService = require('../services/userService');
const { registerSchema, loginSchema } = require('../validations/userValidation');

exports.register = async (req, res) => {
    try {
        const { error } = registerSchema.validate(req.body);
        if (error) 
            return res.status(400).json({ success: false, message: error.details[0].message });

        const user = await UserService.registerUser(req.body);

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user
        });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) 
            return res.status(400).json({ success: false, message: error.details[0].message });

        const result = await UserService.loginUser(req.body);

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            user: result.user
        });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};
