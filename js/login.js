document.addEventListener("DOMContentLoaded", function () {

    // If already logged in, go to dashboard
    fetch("../vendorhub-back/check_session.php", { credentials: "same-origin" })
        .then(function (response) { return response.json(); })
        .then(function (data) {
            if (data.logged_in) {
                window.location.href = "dashboard.html";
            }
        })
        .catch(function () {});

    var form = document.getElementById("loginForm");
    var message = document.getElementById("authMessage");

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        message.textContent = "";
        message.className = "auth-message";

        var formData = new FormData(form);

        fetch("../vendorhub-back/login.php", {
            method: "POST",
            body: formData,
            credentials: "same-origin"
        })
            .then(function (response) { return response.text(); })
            .then(function (text) {

                var result = text.trim();

                if (result === "success") {
                    window.location.href = "dashboard.html";
                    return;
                }

                message.textContent = result || "Login failed";
                message.classList.add("error");

            })
            .catch(function () {
                message.textContent = "Could not reach server";
                message.classList.add("error");
            });

    });

});
