// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const { createProject, getProjects, getProjectDetails, updateProject, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

// Secure all endpoints below
router.use(protect);

router.post('/add', createProject);
router.get('/', getProjects);
router.get('/:id', getProjectDetails); // Handles pulling the single project + tasks


router.put('/:id', updateProject);     // PUT /api/projects/:id
router.delete('/:id', deleteProject);  // DELETE /api/projects/:id

module.exports = router;