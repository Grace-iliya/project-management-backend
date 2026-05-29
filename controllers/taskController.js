// controllers/taskController.js
const Task = require('../models/Task');

// 1. CREATE TASK (Saves the task under the logged-in user)
const createTask = async (req, res) => {
    try {
        console.log("INCOMING BODY:", req.body); 
        console.log("LOGGED IN USER:", req.user);
        
        const { title, dueDate, projectId } = req.body;
        
        // req.user comes directly from your protect middleware!
        const newTask = new Task({ 
            title, 
            dueDate, 
            projectId, 
            user: req.user 
        });
        
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error: error.message });
    }
};

// 2. GET ALL TASKS (Only fetches tasks belonging to this user)
const getTasks = async (req, res) => {
    try {
        // Find tasks where the user field matches the logged-in user's ID
        const tasks = await Task.find({ user: req.user });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
};

// 3. GET TASK REMINDERS (Only monitors deadlines for this user)
const getTaskReminders = async (req, res) => {
    try {
        const now = new Date();
        const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        // Added user: req.user to the query object
        const urgentTasks = await Task.find({
            user: req.user, 
            status: { $ne: 'completed' },
            dueDate: { $lte: twentyFourHoursFromNow }
        }).sort({ dueDate: 1 });

        const reminders = urgentTasks.map(task => {
            const isOverdue = new Date(task.dueDate) < now;
            return {
                _id: task._id,
                title: task.title,
                dueDate: task.dueDate,
                status: task.status,
                type: isOverdue ? 'CRITICAL: Overdue' : 'WARNING: Due Soon'
            };
        });

        res.status(200).json(reminders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reminders', error: error.message });
    }
};

// 4. UPDATE TASK STATUS (Keep this one as it was or update as needed)
const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Secure check: Ensure the task belongs to the user trying to update it
        const updatedTask = await Task.findOneAndUpdate(
            { _id: id, user: req.user },
            { status },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found or unauthorized' });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task status', error: error.message });
    }
};

// EXPORT ALL FUNCTIONS
module.exports = {
    createTask,
    getTasks,
    getTaskReminders,
    updateTaskStatus
}