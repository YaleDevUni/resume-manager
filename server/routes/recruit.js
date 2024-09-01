const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const recruitmentController = require('../controllers/recruitmentController');

// CREATE - Add a new recruitment
router.post(
  '/recruitments',
  authMiddleware,
  recruitmentController.createRecruitment
);

// READ - Get all recruitments with pagination
router.get(
  '/recruitments',
  authMiddleware,
  recruitmentController.getAllRecruitments
);

// READ - Get a recruitment by ID
router.get(
  '/recruitments/:id',
  authMiddleware,
  recruitmentController.getRecruitmentById
);

// UPDATE - Update a recruitment by ID
router.put(
  '/recruitments/:id',
  authMiddleware,
  recruitmentController.updateRecruitmentById
);

// DELETE - Delete a recruitment by ID
router.delete(
  '/recruitments/:id',
  authMiddleware,
  recruitmentController.deleteRecruitmentById
);

module.exports = router;
