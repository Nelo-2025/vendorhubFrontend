document.addEventListener("DOMContentLoaded", function () {
    var reveals = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window) || !reveals.length) {
        reveals.forEach(function (el) {
            el.classList.add("is-visible");
        });
        return;
    }

    var observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    reveals.forEach(function (el) {
        observer.observe(el);
    });
});
