(function () {
    var observer = null;

    function animateCounter(el) {
        if (!el || el.dataset.done === "1") return;
        el.dataset.done = "1";

        var target = parseInt(el.getAttribute("data-target") || "0", 10);
        var suffix = el.getAttribute("data-suffix") || "";
        var finalLabel = el.getAttribute("data-final-label") || "";
        var duration = 1400;
        var start = null;

        function tick(timestamp) {
            if (!start) start = timestamp;
            var progress = Math.min((timestamp - start) / duration, 1);
            var value = Math.floor(progress * target);
            el.textContent = value + suffix;

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else if (finalLabel) {
                el.innerHTML = finalLabel;
            }
        }

        requestAnimationFrame(tick);
    }

    function ensureObserver() {
        if (observer || !("IntersectionObserver" in window)) return;

        observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.35 });
    }

    function bindCounter(el) {
        if (!el || el.dataset.countBound === "1") return;
        el.dataset.countBound = "1";

        ensureObserver();
        if (observer) {
            observer.observe(el);
        } else {
            animateCounter(el);
        }
    }

    function initCounters() {
        var counters = document.querySelectorAll(".count-up");
        if (!counters.length) return;
        counters.forEach(bindCounter);
    }

    // Initial pass for normal page load.
    initCounters();
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initCounters);
    }

    // Re-run for AJAX page swaps (main-root replacement).
    setInterval(initCounters, 600);
})();
