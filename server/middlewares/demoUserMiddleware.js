const User = require('../models/User');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();
const demoUserMiddleware = async (req, res, next) => {
  try {
    if (process.env.DEMO_LOCK === 'false') {
      return next();
    }
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res
        .status(401)
        .json({ message: 'No token, authorization denied' });
    }

    // Verify token and get user info
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const DEMO_EMAIL = 'yaledevuni@gmail.com';

    if (
      user.email === DEMO_EMAIL &&
      (req.method === 'POST' || req.method === 'DELETE')
    ) {
      return res
        .status(403)
        .json({ message: 'Demo user cannot perform this action' });
    }

    next();
  } catch (error) {
    console.error('Demo middleware error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = demoUserMiddleware;
