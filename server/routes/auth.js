const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');
require('dotenv').config();

// Registration Route
router.post('/auth/register', (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      res.status(201).json({ message: 'User registered successfully', user });
    }
  );
});

// Login Route
router.post(
  '/auth/login',
  passport.authenticate('local', { session: false }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
      //  1h
      expiresIn: '1h',
    });
    res.json({ token });
  }
);

router.post('/auth/validate-token', authMiddleware, (req, res) => {
  // If authMiddleware passes, the token is valid
  res.json({ valid: true, user: req.user }); // Send back user data (optional)
});

module.exports = router;
