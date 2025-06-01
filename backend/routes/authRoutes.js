const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Student = require('../models/student');
const Teacher = require('../models/teacher');

// Register Student
router.post('/register/student', async (req, res) => {
  // console.log('Student register request body:', req.body);
  try {
    const { studentName, studentEmail, studentPassword } = req.body;
    // console.log('Parsed values:', studentName, studentEmail, studentPassword);

    const existingStudent = await Student.findOne({ email: studentEmail });
    if (existingStudent) {
      return res.status(400).json({ error: "Student already exists" });
    }

    const hashedPassword = await bcrypt.hash(studentPassword, 10);

    const newStudent = new Student({
      name: studentName,
      email: studentEmail,
      password: hashedPassword, // Later, hash this
    });

    await newStudent.save();
    res.status(201).json({ message: "Student registered successfully!" });
  } catch (err) {
    console.error("Student save error:", err);
    res.status(500).json({ error: "Server error while registering student" });
  }
});

// Register Teacher
router.post('/register/teacher', async (req, res) => {
  try {
    const { teacherName, teacherEmail, teacherPassword } = req.body;

    const existingTeacher = await Teacher.findOne({ email: teacherEmail });
    if (existingTeacher) {
      return res.status(400).json({ error: "Teacher already exists" });
    }

    const hashedPassword = await bcrypt.hash(teacherPassword,10)
    const newTeacher = new Teacher({
      name: teacherName,
      email: teacherEmail,
      password: hashedPassword, // Later, hash this
    });

    await newTeacher.save();
    res.status(201).json({ message: "Teacher registered successfully!" });
  } catch (err) {
    console.error("Teacher save error:", err);
    res.status(500).json({ error: "Server error while registering teacher" });
  }
});

//Routes Login
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
  }

  try {
      let user;

      // Pick the model based on role
      if (role === "student") {
          user = await Student.findOne({ email });
      } else if (role === "teacher") {
          user = await Teacher.findOne({ email });
      } else {
          return res.status(400).json({ message: "Invalid role" });
      }

      if (!user) {
          return res.status(401).json({ message: "User not found" });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ message: "Incorrect password" });
      }

      // Success: You can return more info here if needed
      res.status(200).json({
          message: "Login successful",
          userId: user._id,
          name: user.name,
          role: role
      });

  } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
