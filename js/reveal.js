// Scroll reveal: each top-level <section> fades and rises into place as it enters
// the viewport. Progressive enhancement — sections only start hidden once this
// script confirms it can run (adds .reveal-ready), so content stays visible with
// JS off or reduced motion. Coordinated with the page loader so the first screen
// animates in right as the loader clears, not behind it.
(function () {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var main = document.querySelector('main');
    if (!main || reduceMotion) return;

    var items = Array.prototype.filter.call(main.children, function (el) {
        return el.tagName === 'SECTION';
    });
    if (!items.length) return;

    document.documentElement.classList.add('reveal-ready');
    items.forEach(function (el) { el.classList.add('reveal'); });

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { rootMargin: '0px 0px -15% 0px', threshold: 0.12 });

    var started = false;
    function start() {
        if (started) return;
        started = true;
        requestAnimationFrame(function () {
            items.forEach(function (el) { observer.observe(el); });
        });
    }

    // If the page loader is up, wait for it to clear before revealing; otherwise start now.
    var loader = document.getElementById('page-loader');
    if (loader && !loader.classList.contains('is-done')) {
        document.addEventListener('pageloader:revealed', start, { once: true });
        setTimeout(start, 32000); // safety net past the loader's own timeout cap
    } else {
        start();
    }
})();
