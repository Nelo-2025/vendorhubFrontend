document.addEventListener("DOMContentLoaded", function () {

    var form = document.getElementById("profileForm");
    var nameInput = document.getElementById("profileName");
    var emailInput = document.getElementById("profileEmail");
    var message = document.getElementById("profileMessage");

    function loadProfile() {

        fetch("../vendorhub-back/get_profile.php", { credentials: "same-origin" })
            .then(function (response) { return response.json(); })
            .then(function (data) {

                if (!data.success) {
                    message.textContent = data.message || "Could not load profile";
                    message.className = "auth-message error";
                    return;
                }

                nameInput.value = data.name || "";
                emailInput.value = data.email || "";

                var welcome = document.getElementById("userName");
                if (welcome) {
                    welcome.textContent = data.name || "User";
                }

            })
            .catch(function () {
                message.textContent = "Could not reach server";
                message.className = "auth-message error";
            });

    }

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        message.textContent = "";
        message.className = "auth-message";

        var formData = new FormData();
        formData.append("name", nameInput.value.trim());

        fetch("../vendorhub-back/update_profile.php", {
            method: "POST",
            body: formData,
            credentials: "same-origin"
        })
            .then(function (response) { return response.json(); })
            .then(function (data) {

                if (data.success) {
                    message.textContent = data.message;
                    message.classList.add("success");

                    var welcome = document.getElementById("userName");
                    if (welcome) {
                        welcome.textContent = data.name;
                    }

                    return;
                }

                message.textContent = data.message || "Update failed";
                message.classList.add("error");

            })
            .catch(function () {
                message.textContent = "Could not reach server";
                message.classList.add("error");
            });

    });

    loadProfile();

});
