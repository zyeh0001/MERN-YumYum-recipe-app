const express = require('express');

const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  getUser,
  removeFav,
} = require('../controller/userController');

const { protect } = require('../middleware/authMiddleware');

router.post('/', registerUser);

router.post('/login', loginUser);

router.get('/me', protect, getMe);

router.get('/:id', getUser);

module.exports = router;
