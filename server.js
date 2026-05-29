require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// 1. IMPORT ROUTES (Imported once, cleanly)
const authRoutes = require('./routes/authRoute'); // Assumes your file is named authRoute.js
const taskRoutes = require('./routes/taskRoutes');
const projectRoutes = require('./routes/projectRoutes');

const { errorHandler } = require('./middleware/errormiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// 2. MIDDLEWARE
app.use(cors());         // Allows your frontend to talk to the backend
app.use(express.json()); // Allows your server to read incoming JSON data

// 3. BASE TEST ROUTE
app.get('/', (req, res) => {
    res.send('Project Management API is running...');
});

// 4. MOUNT API ROUTES (Mounted once each)
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);

app.use(errorHandler);

// 5. DATABASE CONNECTION
connectDB();

// 6. START SERVER
app.listen(PORT, () => {
    console.log(`Server is vibrating on port ${PORT}`);
});