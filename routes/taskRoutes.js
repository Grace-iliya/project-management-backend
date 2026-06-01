// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const { createTask, getTasks,  updateTaskStatus, getTaskReminders } = require('../controllers/taskController');

// Import your new auth protection middleware
const { protect } = require('../middleware/auth');

// Apply 'protect' to every single route below this line
router.use(protect);

router.post('/add', createTask); // Maps to: POST /api/tasks/add
router.get('/', getTasks);       // Maps to: GET /api/tasks/
router.get('/reminders', getTaskReminders);
router.put('/:id/status', updateTaskStatus); // PUT /api/tasks/TASK_ID/status

module.exports = router;