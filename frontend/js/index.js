document.addEventListener("DOMContentLoaded", function () {
    const toggleOptions = document.querySelectorAll(".toggle-option");
    const studentFields = document.querySelector(".student-fields");
    const teacherFields = document.querySelector(".teacher-fields");
    const loginForm = document.getElementById("loginForm");

    let currentMode = "student"; // Default mode

    // Toggle between Student and Teacher
    toggleOptions.forEach(option => {
        option.addEventListener("click", function () {
            toggleOptions.forEach(opt => opt.classList.remove("active"));
            this.classList.add("active");
            currentMode = this.dataset.mode;
    
            if (currentMode === "student") {
                studentFields.classList.remove("hidden");
                teacherFields.classList.add("hidden");
    
                // Enable required on student inputs
                studentFields.querySelectorAll("input").forEach(input => input.setAttribute("required", "required"));
                // Disable required on teacher inputs
                teacherFields.querySelectorAll("input").forEach(input => input.removeAttribute("required"));
    
            } else {
                teacherFields.classList.remove("hidden");
                studentFields.classList.add("hidden");
    
                // Enable required on teacher inputs
                teacherFields.querySelectorAll("input").forEach(input => input.setAttribute("required", "required"));
                // Disable required on student inputs
                studentFields.querySelectorAll("input").forEach(input => input.removeAttribute("required"));
            }
        });
    });
    
    // Redirect to signup
    const signupLink = document.getElementById("signupLink");
    if (signupLink) {
        signupLink.addEventListener("click", function (e) {
            e.preventDefault();
            window.location.href = "/html/signup.html";
        });
    }

    // Handle Login Submission
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
    
        // Disable required for hidden fields before validation
        if (currentMode === "student") {
            // Remove required from teacher fields
            teacherFields.querySelectorAll("input").forEach(input => {
                input.removeAttribute("required");
            });
            // Ensure required on student fields
            studentFields.querySelectorAll("input").forEach(input => {
                input.setAttribute("required", "required");
            });
        } else {
            // Remove required from student fields
            studentFields.querySelectorAll("input").forEach(input => {
                input.removeAttribute("required");
            });
            // Ensure required on teacher fields
            teacherFields.querySelectorAll("input").forEach(input => {
                input.setAttribute("required", "required");
            });
        }
    
        // Now your existing payload and fetch logic
        let payload = {};
        let url = "";
    
        if (currentMode === "student") {
            payload = {
                email: document.getElementById("studentEmail").value,
                password: document.getElementById("studentPassword").value,
                role: "student"
            };
            url = "/api/auth/login";
        } else {
            payload = {
                email: document.getElementById("teacherEmail").value,
                password: document.getElementById("teacherPassword").value,
                role: "teacher"
            };
            url = "/api/auth/login";
        }
    
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                if (currentMode === "student") {
                    window.location.href = "/html/student-dashboard.html";
                } else {
                    window.location.href = "/html/teacher-dashboard.html";
                }
            } else {
                alert(data.message || "Login failed");
            }
        })
        .catch(err => {
            console.error(err);
            alert("Something went wrong. Please try again.");
        });
    });  
});
