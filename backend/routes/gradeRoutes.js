// routes/gradeRoutes.js
const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

require('dotenv').config();
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // store this in .env

router.post('/grade', async (req, res) => {
  const { reference_answer, student_answer } = req.body;

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `
You are an exam grader. Grade the following student's answer based on the reference answer.

Reference Answer:
${reference_answer}

Student's Answer:
${student_answer}

Provide:
1. A score out of 5.
2. A short feedback to the student explaining what was missing, in 10-15 words maximum.

Format:
Score: X/5
Feedback: <Your feedback>
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const scoreMatch = text.match(/Score:\s*(\d\/5)/i);
    const feedbackMatch = text.match(/Feedback:\s*(.*)/i);

    res.json({
      score: scoreMatch ? scoreMatch[1] : 'N/A',
      feedback: feedbackMatch ? feedbackMatch[1] : 'No feedback received.'
    });
  } catch (err) {
    console.error('Gemini grading error:', err);
    res.status(500).json({ error: 'Grading failed. Please try again.' });
  }
});

module.exports = router;
