const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const resumeController = require('../controllers/resumeController.js');
const multer = require('multer');
const upload = multer();

// CREATE - Add resumes
router.post(
  '/resumes',
  authMiddleware,
  upload.array('pdfs'),
  resumeController.createBulkResumes
);
router.get('/resumes', authMiddleware, resumeController.getAllResumes);
router.get(
  '/resumes/searchApplicant',
  authMiddleware,
  resumeController.getAllResumesNamesForSearch
);
router.get('/resumes/:id', authMiddleware, resumeController.getResumeById);
router.put('/resumes/:id', authMiddleware, resumeController.updateResumeById);
module.exports = router;
