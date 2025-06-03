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
          2. A short feedback to the student explaining what was missing (max 15 words).
          3. A concept map in this format:

          ADG:
          {
            "MainConcept": {
              "Subconcept1": "✔",
              "Subconcept2": "✔",
              "Subconcept3": "❌"
            }
          }

          Use ✔ for included, ❌ for missed. Do not write explanations inside ADG.
          Format:
          Score: X/5
          Feedback: <short sentence>
          ADG:
          <the concept map object>
          `;


  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const scoreMatch = text.match(/Score:\s*(\d\/5)/i);
    const feedbackMatch = text.match(/Feedback:\s*(.*)/i);
    const adgMatch = text.match(/ADG:\s*({[\s\S]*})/i);

    let adgData = {};
    if (adgMatch) {
      try {
        adgData = JSON.parse(adgMatch[1]);
      } catch (err) {
        console.error('Failed to parse ADG:', err);
      }
    }

    res.json({
      score: scoreMatch ? scoreMatch[1] : 'N/A',
      feedback: feedbackMatch ? feedbackMatch[1] : 'No feedback received.',
      adg: adgData
    });

  } catch (err) {
    console.error('Gemini grading error:', err);
    res.status(500).json({ error: 'Grading failed. Please try again.' });
  }
});

module.exports = router;
