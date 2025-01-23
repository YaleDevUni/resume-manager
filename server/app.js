// app.js
const express = require('express');
const connectDB = require('./config/db');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cors = require('cors');
const app = express();
const User = require('./models/User');
const authRoutes = require('./routes/auth');
const recruitRoutes = require('./routes/recruit');
const logger = require('./middlewares/logger');
const skillRoutes = require('./routes/skill');
const resumeRoutes = require('./routes/resume');
const authMiddleware = require('./middlewares/authMiddleware');
const demoUserMiddleware = require('./middlewares/demoUserMiddleware');
const path = require('path');
const isDevelopment = process.env.NODE_ENV === 'development';
const rateLimit = require('express-rate-limit');

/** rate limit config */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per windowMs
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes',
  },
});

/** cors config */
const corsOptions = {
  origin: isDevelopment
    ? 'http://localhost:3000'
    : [
        'http://localhost:3000',
        'http://localhost:5001',
        'http://ec2-3-107-26-238.ap-southeast-2.compute.amazonaws.com/',
      ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

/** Enviroment variables */
require('dotenv').config();

// Connect to MongoDB
connectDB();

// Passport.js Configuration
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    User.authenticate()
  )
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(express.json({ limit: '100mb' }));

/** Middlewares */
app.use(logger);
// Increase the URL-encoded payload limit
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(express.raw({ limit: '100mb' }));

/** rate limit middleware */
app.use('/api', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Routes
app.use('/api', authRoutes);
app.use('/api', demoUserMiddleware, recruitRoutes);
app.use('/api', demoUserMiddleware, skillRoutes);
app.use('/api', authMiddleware, demoUserMiddleware, resumeRoutes);

// health check
app.get('/api/health', (req, res) => {
  res.json({ success: true });
});

const PORT = process.env.PORT || (isDevelopment ? 3003 : 5000);

app.listen(PORT, '0.0.0.0', () => {
  console.log(
    `Server running in ${
      process.env.NODE_ENV || 'production'
    } mode on port ${PORT}`
  );
});
