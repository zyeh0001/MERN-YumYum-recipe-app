const asyncHandler = require('express-async-handler');
//handle async function in express
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

//@desc     Register a new user
//@route    /api/users
//access    Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please include all fields');
  }
  //Find if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exist');
  }

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  //Create User
  const user = await User.create({
    name,
    email,
    password: hashPassword,
  });

  if (user) {
    //create successfully
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new error('Invalid user data');
  }
});

//@desc     User login
//@route    /api/users/login
//access    Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  //check if user exist
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      favCollection: user.favCollection,
    });
  } else {
    res.status(401);
    throw new Error('Invalid Credential');
  }
});

//@desc     Get current User
//@route    /api/users/me
//access    Private (access with json web token)
const getMe = asyncHandler(async (req, res) => {
  const user = { id: req.user._id, emil: req.user.email, name: req.user.name };
  res.status(200).json(user);
});

//@desc     Get User by user id
//@route    /api/users/:id
//access    Private (access with json web token)
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('user not found');
  }
  res.status(200).json(user);
});

//generate json web token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getUser,
};
