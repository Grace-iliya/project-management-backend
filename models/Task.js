// models/Task.js
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    dueDate: { type: Date, required: true },
    status: { 
        type: String, 
        enum: ['todo', 'in-progress', 'completed'], 
        default: 'todo' 
    },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    // 👇 ADD THIS FIELD: Links this task directly to the specific User account
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);