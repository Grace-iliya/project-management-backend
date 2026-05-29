// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected successfully! 🚀');
    } catch (error) {
        console.error('Database connection failed ❌', error.message);
        process.exit(1); // Stop the server if database fails
    }
};

module.exports = connectDB;