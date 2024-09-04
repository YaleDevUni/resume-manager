const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const resumeController = require('../controllers/resumeController');

// CREATE - Add resumes
router.post('/resumes', authMiddleware, resumeController.createBulkResumes);

module.exports = router;
