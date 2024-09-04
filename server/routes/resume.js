const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const resumeController = require('../controllers/resumeController');
const multer = require('multer');
const upload = multer();

// CREATE - Add resumes
router.post(
  '/resumes',
  authMiddleware,
  upload.array('pdfs'),
  resumeController.createBulkResumes
);

module.exports = router;
