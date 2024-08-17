// app.js
const express = require("express");
const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// // Define Routes
// app.use("/api/users", require("./routes/user"));
// app.use("/api/pdfs", require("./routes/pdf"));
// app.use("/api/metadata", require("./routes/metadata"));

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
