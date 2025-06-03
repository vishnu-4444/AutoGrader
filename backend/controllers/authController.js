const Student = require('../models/student');
const Teacher = require('../models/teacher');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'Autograder';

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Register Student
exports.registerStudent = async (req, res) => {
  try {
    const { name, email, password, student_id } = req.body;

    if (!name || !email || !password || !student_id) {
      return res.status(400).json({ message: 'Please enter all required fields including student_id' });
    }

    const studentExists = await Student.findOne({ email });
    const teacherExists = await Teacher.findOne({ email });
    const studentIdExists = await Student.findOne({ student_id });

    if (studentExists || teacherExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    if (studentIdExists) {
      return res.status(400).json({ message: 'Student ID already taken' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newStudent = new Student({
      name,
      email,
      password: hashedPassword,
      student_id
    });

    await newStudent.save();

    const token = generateToken(newStudent);

    res.status(201).json({
      message: 'Student registered successfully',
      token,
      user: {
        id: newStudent._id,
        name: newStudent.name,
        email: newStudent.email,
        role: newStudent.role,
        student_id: newStudent.student_id
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Register Teacher
exports.registerTeacher = async (req, res) => {
  try {
    const { name, email, password, teacher_id } = req.body;

    if (!name || !email || !password || !teacher_id) {
      return res.status(400).json({ message: 'Please enter all required fields including teacher_id' });
    }

    const studentExists = await Student.findOne({ email });
    const teacherExists = await Teacher.findOne({ email });
    const teacherIdExists = await Teacher.findOne({ teacher_id });

    if (studentExists || teacherExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    if (teacherIdExists) {
      return res.status(400).json({ message: 'Teacher ID already taken' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newTeacher = new Teacher({
      name,
      email,
      password: hashedPassword,
      teacher_id
    });

    await newTeacher.save();

    const token = generateToken(newTeacher);

    res.status(201).json({
      message: 'Teacher registered successfully',
      token,
      user: {
        id: newTeacher._id,
        name: newTeacher.name,
        email: newTeacher.email,
        role: newTeacher.role,
        teacher_id: newTeacher.teacher_id
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Login User (Student or Teacher)
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all required fields' });
    }

    // Find user by email (check students and teachers)
    let user = await Student.findOne({ email });
    let userType = 'student';

    if (!user) {
      user = await Teacher.findOne({ email });
      userType = 'teacher';
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
