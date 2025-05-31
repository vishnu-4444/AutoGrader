document.getElementById('gradientForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const question = document.getElementById('question').value;
    const teacherAnswer = document.getElementById('teacherAnswer').value;
    const studentAnswer = document.getElementById('studentAnswer').value;

    if (!teacherAnswer.trim() || !studentAnswer.trim()) {
        alert('Please fill in all required fields (Teacher Answer and Student Answer).');
        return;
    }

    const formData = {
        reference_answer: teacherAnswer,
        student_answer: studentAnswer,
        question: question || 'No question provided',
        timestamp: new Date().toLocaleString()
    };

    console.log('Form submitted:', formData);

    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Grading...';
    submitBtn.style.background = 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)';

    try {
        const response = await fetch('/api/grade', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
      
        const result = await response.json();
      
        if (result.error) {
          alert('Error: ' + result.error);
        } else {
          // ✅ Add score + feedback to the page
          const resultBox = document.createElement('div');
          resultBox.classList.add('result-box');
          resultBox.innerHTML = `
            <h3>Result (${formData.timestamp}):</h3>
            <p><strong>Score:</strong> ${result.score}</p>
            <p><strong>Feedback:</strong> ${result.feedback}</p>
          `;
      
          document.getElementById('resultContainer').prepend(resultBox);
        }
      } catch (err) {
        console.error('Grading error:', err);
        alert('Something went wrong while grading. Please try again.');
      }
      

    // Reset UI after 2 seconds
    // setTimeout(() => {
    //     submitBtn.textContent = originalText;
    //     submitBtn.style.background = 'linear-gradient(135deg, #8B5FBF 0%, #A876D9 50%, #C094E8 100%)';
    //     document.getElementById('gradientForm').reset();
    // }, 2000);
});

// Add subtle hover effects to input fields
document.querySelectorAll('.input-field').forEach(field => {
    field.addEventListener('mouseenter', function () {
        this.style.borderColor = 'rgba(255, 255, 255, 0.5)';
    });

    field.addEventListener('mouseleave', function () {
        if (this !== document.activeElement) {
            this.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        }
    });
});
