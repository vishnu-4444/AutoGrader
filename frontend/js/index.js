document.addEventListener("DOMContentLoaded", () => {
    const toggleOptions = document.querySelectorAll(".toggle-option");
    const studentFields = document.querySelector(".student-fields");
    const teacherFields = document.querySelector(".teacher-fields");
    let currentMode = "student"; // default
  
    toggleOptions.forEach(option => {
      option.addEventListener("click", () => {
        toggleOptions.forEach(opt => opt.classList.remove("active"));
        option.classList.add("active");
  
        currentMode = option.dataset.mode;
        if (currentMode === "student") {
          studentFields.classList.remove("hidden");
          teacherFields.classList.add("hidden");
        } else {
          teacherFields.classList.remove("hidden");
          studentFields.classList.add("hidden");
        }
      });
    });
  
    // Form submit
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      let data = {};
  
      if (currentMode === "student") {
        data = {
          userType: "student",
          email: document.getElementById("studentEmail").value,
          password: document.getElementById("studentPassword").value
        };
      } else {
        data = {
          userType: "teacher",
          email: document.getElementById("teacherEmail").value,
          password: document.getElementById("teacherPassword").value,
          code: document.getElementById("teacherCode").value
        };
      }
  
      try {
        const res = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });
  
        const result = await res.json();
  
        if (res.ok) {
          alert(result.message || "Login successful!");
          // Redirect if needed
          // window.location.href = "/dashboard.html";
        } else {
          alert(result.message || "Login failed");
        }
      } catch (err) {
        console.error("Login error:", err);
        alert("Something went wrong. Please try again later.");
      }
    });
  });
  