const Skill = require('../models/Skills');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
// Get all skills
router.get('/skills', authMiddleware, async (req, res) => {
  console.log('GET /skills');
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
