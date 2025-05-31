document.addEventListener("DOMContentLoaded", function () {
    const toggleOptions = document.querySelectorAll(".toggle-option");
    const studentFields = document.querySelector(".student-fields");
    const teacherFields = document.querySelector(".teacher-fields");

    toggleOptions.forEach(option => {
        option.addEventListener("click", function () {
            // Remove 'active' class from both options
            toggleOptions.forEach(opt => opt.classList.remove("active"));
            // Add 'active' class to clicked option
            this.classList.add("active");

            // Get selected mode
            const mode = this.dataset.mode;

            // Show/hide corresponding fields
            if (mode === "student") {
                studentFields.classList.remove("hidden");
                teacherFields.classList.add("hidden");
            } else if (mode === "teacher") {
                teacherFields.classList.remove("hidden");
                studentFields.classList.add("hidden");
            }
        });
    });

    // Optional: Redirect to sign up page when link is clicked
    const signupLink = document.getElementById("signupLink");
    if (signupLink) {
        signupLink.addEventListener("click", function (e) {
            e.preventDefault();
            window.location.href = "/html/signup.html";
        });
    }
});
