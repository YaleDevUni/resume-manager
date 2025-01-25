//auth.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');
const crypto = require('crypto');
const demoUserMiddleware = require('../middlewares/demoUserMiddleware');
const path = require('path');
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require('../service/emailService');
require('dotenv').config();

// Helper functions for validation
const isValidEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = password => {
  // At least 8 characters long
  // Contains at least one letter
  // Contains at least one number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
};

// Registration Route
router.post('/auth/register', async (req, res) => {
  const { password, email } = req.body;

  // Email validation
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({
      field: 'email',
      message: 'Please enter a valid email address',
    });
  }

  // Password validation
  if (!password || !isValidPassword(password)) {
    return res.status(400).json({
      field: 'password',
      message:
        'Password must be at least 8 characters long and contain at least one letter and one number',
    });
  }

  try {
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = new User({
      email,
      verificationToken,
      verificationTokenExpires,
      isVerified: true,
    });

    await User.register(user, password);

    // // Send verification email
    // const emailSent = await sendVerificationEmail(email, verificationToken);

    // if (!emailSent) {
    //   return res.status(500).json({
    //     field: 'general',
    //     message: 'Failed to send verification email',
    //   });
    // }

    res.status(201).json({
      message:
        'Registration successful. Please check your email to verify your account.',
    });
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(400).json({
        field: 'email',
        message: 'This email is already registered',
      });
    }
    res.status(400).json({
      field: 'general',
      message: err.message,
    });
  }
});

// Email verification route
router.get('/auth/verify/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      verificationToken: req.params.token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid or expired verification token',
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // Redirect to frontend with success message
    res.redirect(`${process.env.FRONTEND_URL}/verification-success`);
  } catch (error) {
    res.status(500).json({
      message: 'Error verifying email',
    });
  }
});
router.post('/auth/forgot-password', demoUserMiddleware, async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = Date.now() + 3600000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    await sendPasswordResetEmail(email, resetToken);

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending reset email' });
  }
});
router.post(
  '/auth/change-password',
  demoUserMiddleware,
  authMiddleware,
  (req, res, next) => {
    const { email, password, newPassword } = req.body;

    passport.authenticate(
      'local',
      { session: false },
      async (err, user, info) => {
        try {
          if (err) {
            console.error('Authentication error:', err);
            return res.status(500).json({ message: 'Internal server error' });
          }

          if (!user) {
            return res.status(401).json({
              message: info.message || 'Current password is incorrect',
            });
          }

          // Password validation for new password
          if (!isValidPassword(newPassword)) {
            return res.status(400).json({
              message:
                'New password must be at least 8 characters long and contain at least one letter and one number',
            });
          }

          await user.setPassword(newPassword);
          await user.save();

          res.json({ message: 'Password changed successfully' });
        } catch (error) {
          console.error('Unexpected error during password change:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
      }
    )(req, res, next);
  }
);

router.post('/auth/reset-password', demoUserMiddleware, async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: 'Invalid or expired reset token' });
    }

    await user.setPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password' });
  }
});
// Update login route to check for verification
router.post('/auth/login', (req, res, next) => {
  passport.authenticate(
    'local',
    { session: false },
    async (err, user, info) => {
      try {
        if (err) {
          console.error('Authentication error:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }

        if (!user) {
          return res
            .status(401)
            .json({ message: info.message || 'Login failed' });
        }

        if (!user.isVerified) {
          return res.status(401).json({
            message: 'Please verify your email address before logging in',
          });
        }

        const expiresIn = '24h';
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn,
        });
        // remove hashed password from user object
        delete user._doc.hash;
        delete user._doc.salt;
        res.json({ token, user, expiresIn });
      } catch (error) {
        console.error('Unexpected error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  )(req, res, next);
});

router.get('/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data' });
  }
});
router.post('/auth/validate-token', authMiddleware, (req, res) => {
  res.json({ valid: true, user: req.user });
});

module.exports = router;
