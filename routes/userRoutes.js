const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { register, verifyOtp, login, getUserById, getAllUsers, updateUser } = require('../controllers/userControllers');

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);

// Protected routes (only customer & admin)
router.get('/:id', authMiddleware(['customer','admin']), getUserById);
router.get('/', authMiddleware(['customer','admin']), getAllUsers);
router.put('/:id', authMiddleware(['customer','admin']), updateUser);

module.exports = router;