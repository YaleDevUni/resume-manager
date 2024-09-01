const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Bearer <token>
    console.log('Token:', token);
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.error(err);
        return res.sendStatus(403);
      }
      console.log('success');
      req.user = user; // Attach user data to request object
      next();
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};
