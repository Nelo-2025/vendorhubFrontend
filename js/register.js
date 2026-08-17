document.addEventListener("DOMContentLoaded", function () {

    fetch("../vendorhub-back/check_session.php", { credentials: "same-origin" })
        .then(function (response) { return response.json(); })
        .then(function (data) {
            if (data.logged_in) {
                window.location.href = "dashboard.html";
            }
        })
        .catch(function () {});

    var form = document.getElementById("registerForm");
    var message = document.getElementById("authMessage");
    var passwordInput = document.getElementById("password");
    var confirmInput = document.getElementById("confirmPassword");

    document.querySelectorAll(".password-toggle").forEach(function (btn) {

        btn.addEventListener("click", function () {

            var input = document.getElementById(btn.getAttribute("data-target"));
            var icon = btn.querySelector("i");

            if (!input) return;

            if (input.type === "password") {
                input.type = "text";
                icon.classList.remove("fa-eye");
                icon.classList.add("fa-eye-slash");
                btn.setAttribute("aria-label", "Hide password");
            } else {
                input.type = "password";
                icon.classList.remove("fa-eye-slash");
                icon.classList.add("fa-eye");
                btn.setAttribute("aria-label", "Show password");
            }

        });

    });

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        message.textContent = "";
        message.className = "auth-message";

        if (passwordInput.value !== confirmInput.value) {
            message.textContent = "Passwords do not match";
            message.classList.add("error");
            return;
        }

        var formData = new FormData(form);
        formData.delete("confirmPassword");

        fetch("../vendorhub-back/register.php", {
            method: "POST",
            body: formData,
            credentials: "same-origin"
        })
            .then(function (response) { return response.text(); })
            .then(function (text) {

                var result = text.trim();

                if (result === "success") {
                    message.textContent = "Account created. Redirecting to login…";
                    message.classList.add("success");
                    setTimeout(function () {
                        window.location.href = "login.html";
                    }, 800);
                    return;
                }

                message.textContent = result || "Registration failed";
                message.classList.add("error");

            })
            .catch(function () {
                message.textContent = "Could not reach server";
                message.classList.add("error");
            });

    });

});
