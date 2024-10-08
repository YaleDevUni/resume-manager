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

/** cors config */
const corsOptions = {
  origin: 'http://localhost:3000', // Specify the frontend origin
  credentials: true, // Allow credentials (cookies, etc.) to be sent
};
app.use(cors(corsOptions));

/** Enviroment variables */
require('dotenv').config();

// Connect to MongoDB
connectDB();

// Passport.js Configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(express.json({ limit: '100mb' }));

/** Middlewares */
app.use(logger);
// Increase the URL-encoded payload limit
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Routes
app.use('/api', authRoutes);
app.use('/api', recruitRoutes);
app.use('/api', skillRoutes);
app.use('/api', authMiddleware, resumeRoutes);

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
