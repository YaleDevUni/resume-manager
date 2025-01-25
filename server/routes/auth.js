const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');
const demoUserMiddleware = require('../middlewares/demoUserMiddleware');
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require('../service/emailService');
require('dotenv').config();

const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPassword = password =>
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

router.post('/auth/register', async (req, res) => {
  const { password, email } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({
      field: 'email',
      message: 'Please enter a valid email address',
    });
  }

  if (!password || !isValidPassword(password)) {
    return res.status(400).json({
      field: 'password',
      message:
        'Password must be at least 8 characters long and contain at least one letter and one number',
    });
  }

  try {
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = new User({
      email,
      verificationCode: verificationCode,
      verificationCodeExpires: verificationCodeExpires,
      isVerified: false,
    });

    await User.register(user, password);
    const emailSent = await sendVerificationEmail(email, verificationCode);

    if (!emailSent) {
      return res.status(500).json({
        field: 'general',
        message: 'Failed to send verification email',
      });
    }

    res.status(201).json({
      message:
        'Registration successful. Please check your email for verification code.',
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
router.post('/auth/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

    const emailSent = await sendVerificationEmail(email, verificationCode);

    if (!emailSent) {
      return res
        .status(500)
        .json({ message: 'Failed to send verification email' });
    }

    res.json({ message: 'Verification code sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending verification code' });
  }
});
router.post('/auth/verify', async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({
      email,
      verificationCode: code,
      verificationCodeExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid or expired verification code',
      });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.log('Error verifying email:', error);
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

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeExpires = Date.now() + 600000; // 10 minutes

    user.resetPasswordToken = resetCode;
    user.resetPasswordExpires = resetCodeExpires;
    await user.save();

    await sendPasswordResetEmail(email, resetCode);
    res.json({ message: 'Password reset code sent' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending reset code' });
  }
});

router.post('/auth/reset-password', demoUserMiddleware, async (req, res) => {
  try {
    const { code, password, email } = req.body;
    console.log('code', code, 'password', password, 'email', email);
    const user = await User.findOne({
      email,
      resetPasswordToken: code,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        message:
          'Password must be at least 8 characters long and contain at least one letter and one number',
      });
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

router.post('/auth/login', (req, res, next) => {
  const { email, password } = req.body;
  console.log('email', email, 'password', password);
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
            message: 'VERIFY',
          });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: '24h',
        });

        delete user._doc.hash;
        delete user._doc.salt;
        res.json({ token, user, expiresIn: '24h' });
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
