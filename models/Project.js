// models/Project.js
const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    status: { 
        type: String, 
        enum: ['in-progress', 'completed', 'deployed'], 
        default: 'in-progress' 
    },
    // 👇 ADD THIS FIELD: Binds the project to the user who created it
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);