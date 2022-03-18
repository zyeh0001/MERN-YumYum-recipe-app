const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      //get token (which is behind Bearer)
      token = req.headers.authorization.split(' ')[1];
      //use token secret to decode to get userId
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //find user with decoded id
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized');
  }
});

module.exports = { protect };
