(function () {

    var STORAGE_KEY = "vendorhub_sidebar_collapsed";

    function redirectToLogin() {
        window.location.href = "login.html";
    }

    function wrapNavLabels(sidebar) {
        sidebar.querySelectorAll("a").forEach(function (link) {
            if (link.querySelector(".nav-label")) return;

            var nodes = [];
            link.childNodes.forEach(function (node) {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                    nodes.push(node);
                }
            });

            if (!nodes.length) return;

            var label = document.createElement("span");
            label.className = "nav-label";
            label.textContent = nodes.map(function (n) {
                return n.textContent.trim();
            }).join(" ");

            nodes.forEach(function (n) {
                link.removeChild(n);
            });

            link.appendChild(label);
        });
    }

    function isMobileNav() {
        return window.matchMedia("(max-width: 768px)").matches;
    }

    function applyCollapsed(collapsed) {
        var sidebar = document.querySelector(".sidebar");
        var shell = document.querySelector(".dashboard");
        var toggle = document.querySelector(".sidebar-toggle");

        if (!sidebar || !shell) return;

        // Bottom nav on mobile — never use collapsed sidebar mode
        if (isMobileNav()) {
            sidebar.classList.remove("is-collapsed");
            shell.classList.remove("sidebar-collapsed");
            return;
        }

        sidebar.classList.toggle("is-collapsed", collapsed);
        shell.classList.toggle("sidebar-collapsed", collapsed);

        if (toggle) {
            var icon = toggle.querySelector("i");
            if (icon) {
                icon.className = collapsed ? "fas fa-angles-right" : "fas fa-angles-left";
            }
            toggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
            toggle.setAttribute("title", collapsed ? "Expand sidebar" : "Collapse sidebar");
        }
    }

    function initSidebarToggle() {
        var sidebar = document.querySelector(".sidebar");
        var shell = document.querySelector(".dashboard");
        if (!sidebar || !shell) return;

        wrapNavLabels(sidebar);

        var logo = sidebar.querySelector(".logo");

        if (!sidebar.querySelector(".sidebar-toggle")) {
            var btn = document.createElement("button");
            btn.type = "button";
            btn.className = "sidebar-toggle";
            btn.setAttribute("aria-label", "Toggle sidebar");
            btn.setAttribute("title", "Collapse sidebar");
            btn.innerHTML = '<i class="fas fa-angles-left"></i>';

            if (logo) {
                logo.appendChild(btn);
            } else {
                sidebar.insertBefore(btn, sidebar.firstChild);
            }

            btn.addEventListener("click", function () {
                if (isMobileNav()) return;
                var collapsed = !sidebar.classList.contains("is-collapsed");
                localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
                applyCollapsed(collapsed);
            });
        }

        var saved = localStorage.getItem(STORAGE_KEY) === "1";
        applyCollapsed(saved);

        window.addEventListener("resize", function () {
            applyCollapsed(localStorage.getItem(STORAGE_KEY) === "1");
        });
    }

    fetch("../vendorhub-back/check_session.php", { credentials: "same-origin" })
        .then(function (response) { return response.json(); })
        .then(function (data) {
            if (!data.logged_in) {
                redirectToLogin();
                return;
            }

            var nameEl = document.getElementById("userName");
            if (nameEl && data.name) {
                nameEl.textContent = data.name;
            }
        })
        .catch(function () {
            redirectToLogin();
        });

    window.logoutUser = function () {

        fetch("../vendorhub-back/logout.php", { credentials: "same-origin" })
            .then(function () {
                redirectToLogin();
            })
            .catch(function () {
                redirectToLogin();
            });

    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initSidebarToggle);
    } else {
        initSidebarToggle();
    }

})();
