// controllers/projectController.js
const Project = require('../models/Project');
const Task = require('../models/Task'); // 👇 Added Task import to pull tasks for a project

// 1. Create a new project (Scoped to the logged-in user)
const createProject = async (req, res, next) => {
    try {
        const { name, description, status } = req.body;

        if (!name) {
            res.status(400); // Bad Request
            throw new Error('Please provide a project name');
        }
        
        // Attached user: req.user from the protect middleware
        const newProject = new Project({ 
            name, 
            description, 
            status,
            user: req.user 
        });
        
        await newProject.save();
        res.status(201).json(newProject);
    } catch (error) {
        next(error);
    }
};

// 2. Get all projects (With optional search filter, isolated by user)
const getProjects = async (req, res) => {
    try {
        const { search } = req.query;
        
        // 👇 Force the query to ONLY look for projects owned by this user
        let query = { user: req.user };
        
        // If frontend sends a search term, append it to our user-scoped query
        if (search) {
            query.name = { $regex: search, $options: 'i' }; 
        }

        const projects = await Project.find(query);
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects', error: error.message });
    }
};

// 3. Get single project along with its tasks (Deep Dive View)
const getProjectDetails = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the project and verify it belongs to this logged-in user
        const project = await Project.findOne({ _id: id, user: req.user });
        if (!project) {
            return res.status(404).json({ message: 'Project not found or unauthorized' });
        }

        // Fetch all tasks currently assigned to this specific project and user
        const tasks = await Task.find({ projectId: id, user: req.user });

        res.status(200).json({
            project,
            tasks
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching project details', error: error.message });
    }
};

// 4. UPDATE PROJECT STATUS OR DETAILS
const updateProject = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, status } = req.body;

        // Secure check: Find the project AND ensure it belongs to the logged-in user
        const updatedProject = await Project.findOneAndUpdate(
            { _id: id, user: req.user },
            { name, description, status },
            { new: true, runValidators: true } // returns the updated object & runs schema checks
        );

        if (!updatedProject) {
            res.status(404);
            throw new Error('Project not found or unauthorized');
        }

        res.status(200).json(updatedProject);
    } catch (error) {
        next(error); // Funnels straight into our new global error handler!
    }
};

// 5. DELETE PROJECT (With Cascading Delete for associated tasks!)
const deleteProject = async (req, res, next) => {
    try {
        const { id } = req.params;

        // 1. Find and delete the project ensuring user ownership
        const project = await Project.findOneAndDelete({ _id: id, user: req.user });

        if (!project) {
            res.status(404);
            throw new Error('Project not found or unauthorized');
        }

        // 2. CASCADING DELETE: Automatically wipe out all tasks linked to this project
        const deletedTasksCount = await Task.deleteMany({ projectId: id, user: req.user });

        res.status(200).json({
            message: 'Project and all associated tasks successfully deleted',
            deletedProjectName: project.name,
            tasksRemovedCount: deletedTasksCount.deletedCount
        });
    } catch (error) {
        next(error);
    }
};


module.exports = { 
    createProject, 
    getProjects,
    getProjectDetails,// 👇 Exported the detail deep-dive view
    updateProject,
    deleteProject
};