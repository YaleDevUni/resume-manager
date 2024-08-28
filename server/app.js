// app.js
const express = require("express");
const connectDB = require("./config/db");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const cors = require("cors");
const app = express();
const User = require("./models/User");

/** cors config */
app.use(cors());

/** Enviroment variables */
require("dotenv").config();

// Connect to MongoDB
connectDB();

// Passport.js Configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(express.json());

/** Middlewares */
const authMiddleware = require("./middlewares/authMiddleware");

// // Define Routes
// app.use("/api/users", require("./routes/user"));
// app.use("/api/pdfs", require("./routes/pdf"));
// app.use("/api/metadata", require("./routes/metadata"));

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
