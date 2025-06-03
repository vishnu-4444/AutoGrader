const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // adjust path if needed

// Student Registration
router.post('/register/student', authController.registerStudent);

// Teacher Registration
router.post('/register/teacher', authController.registerTeacher);

// Login (Student or Teacher)
router.post('/login', authController.loginUser);

module.exports = router;