document.addEventListener("DOMContentLoaded", () => {
  const toggleOptions = document.querySelectorAll(".toggle-option");
  const studentFields = document.querySelector(".student-fields");
  const teacherFields = document.querySelector(".teacher-fields");
  const form = document.getElementById("signupForm");

  // Set initial mode
  let currentMode = "student"; // default

  // Function to toggle required attributes based on mode
  function toggleRequiredFields(mode) {
      if (mode === "student") {
          // Enable required on student inputs
          studentFields.querySelectorAll("input").forEach(input => input.setAttribute("required", "required"));
          // Disable required on teacher inputs
          teacherFields.querySelectorAll("input").forEach(input => input.removeAttribute("required"));
      } else {
          // Enable required on teacher inputs
          teacherFields.querySelectorAll("input").forEach(input => input.setAttribute("required", "required"));
          // Disable required on student inputs
          studentFields.querySelectorAll("input").forEach(input => input.removeAttribute("required"));
      }
  }

  // Initialize required attributes on page load
  toggleRequiredFields(currentMode);

  // Toggle logic
  toggleOptions.forEach(option => {
      option.addEventListener("click", () => {
          toggleOptions.forEach(opt => opt.classList.remove("active"));
          option.classList.add("active");

          const mode = option.getAttribute("data-mode");
          currentMode = mode;

          if (mode === "teacher") {
              studentFields.classList.add("hidden");
              teacherFields.classList.remove("hidden");
          } else {
              teacherFields.classList.add("hidden");
              studentFields.classList.remove("hidden");
          }

          // Update required attributes based on toggled mode
          toggleRequiredFields(mode);
      });
  });

  // Form submission logic
  form.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Before submission, ensure only visible inputs are required
      toggleRequiredFields(currentMode);

      // Optional: You can manually check validity if needed
      if (!form.checkValidity()) {
          form.reportValidity();
          return;
      }

      const endpoint = currentMode === "student"
          ? "/api/auth/register/student"
          : "/api/auth/register/teacher";

      // Prepare payload depending on mode
      let payload = {};

      if (currentMode === "student") {
          // Combine first and last name
          const firstName = document.getElementById("studentFirstName").value.trim();
          const lastName = document.getElementById("studentLastName").value.trim();
          payload.studentName = firstName + " " + lastName;
          payload.studentEmail = document.getElementById("studentEmail").value.trim();
          payload.studentPassword = document.getElementById("studentPassword").value;
      } else {
          // Teacher payload
          const firstName = document.getElementById("teacherFirstName").value.trim();
          const lastName = document.getElementById("teacherLastName").value.trim();
          payload.teacherName = firstName + " " + lastName;
          payload.teacherEmail = document.getElementById("teacherEmail").value.trim();
          payload.teacherPassword = document.getElementById("teacherPassword").value;
      }

      try {
          const response = await fetch(endpoint, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(payload)
          });

          const result = await response.json();

          if (response.ok) {
              alert(result.message || "Registration successful!");
              // Optionally redirect user
              // window.location.href = "/login";
          } else {
              alert(result.message || "Registration failed!");
          }
      } catch (err) {
          console.error("Error submitting form:", err);
          alert("Something went wrong. Please try again.");
      }
  });
});
