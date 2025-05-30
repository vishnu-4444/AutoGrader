const express = require('express');
const router = express.Router();

const {
  registerStudent,
  registerTeacher,
  loginUser
} = require('../controllers/authController');

// Register student
router.post('/register/student', registerStudent);

// Register teacher
router.post('/register/teacher', registerTeacher);

// Login (common for both)
router.post('/login', loginUser);

module.exports = router;
