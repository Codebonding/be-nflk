const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const path = require("path");
const productReviewRouter = require('./routes/productReviewRoutes');
const cartRoutes = require('./routes/cartRoutes');
const sequelize = require('./config/db');

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

app.use('/api/users', userRoutes);
app.use('/products', productRoutes);
app.use('/api/reviews', productReviewRouter);
app.use('/cart', cartRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));

sequelize.sync({ alter: true }).then(() => console.log('DB synced'));

const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
