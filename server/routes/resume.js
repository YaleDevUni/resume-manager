const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const resumeController = require('../controllers/resumeController.js');
const multer = require('multer');
const upload = multer({
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB in bytes
  }
});

// CREATE - Add resumes
router.post(
  '/resumes',
  authMiddleware,
  upload.array('pdfs'),
  resumeController.createBulkResumes
);
router.get('/resumes', authMiddleware, resumeController.getAllResumes);
router.get(
  '/resumes/searchByFileName',
  authMiddleware,
  resumeController.getAllResumesNamesForSearch
);
router.get('/resumes/:id', authMiddleware, resumeController.getResumeById);
router.get('/resumes/pdf/:id', authMiddleware, resumeController.getPdfById);
router.put('/resumes/:id', authMiddleware, resumeController.updateResumeById);
router.delete(
  '/resumes/:id',
  authMiddleware,
  resumeController.deleteResumeById
);
module.exports = router;
