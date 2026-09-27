// Project loading screen: keep an overlay up until the first fraction of the page's
// media (in document order) has rendered, so a visitor who lands and immediately
// scrolls doesn't hit a wall of empty placeholders. The rest keeps lazy-loading as
// they browse. A hard timeout guarantees the page always reveals, and cached
// (returning) visitors pass through instantly.
(function () {
    var loader = document.getElementById('page-loader');
    if (!loader) return;

    var cfg = window.PAGE_LOADER || {};
    var fraction = typeof cfg.fraction === 'number' ? cfg.fraction : 0.34;
    var timeout = typeof cfg.timeout === 'number' ? cfg.timeout : 6000;
    // Reveal this many ms after progress last advanced (a stalled connection that
    // stops loading clears soon after, instead of waiting out the full timeout).
    var stall = typeof cfg.stall === 'number' ? cfg.stall : 10000;

    var root = document.documentElement;
    var bar = loader.querySelector('.page-loader-bar span');
    var pct = loader.querySelector('.page-loader-pct');
    var stallTimer;

    function armStall() {
        clearTimeout(stallTimer);
        stallTimer = setTimeout(reveal, stall);
    }

    function reveal() {
        if (loader.classList.contains('is-done')) return;
        clearTimeout(stallTimer);
        loader.classList.add('is-done');
        root.classList.remove('is-loading');
        document.dispatchEvent(new Event('pageloader:revealed'));
        setTimeout(function () {
            if (loader.parentNode) loader.parentNode.removeChild(loader);
        }, 600);
    }

    var media = Array.prototype.slice.call(document.querySelectorAll('main img, main video'));
    if (!media.length) { reveal(); return; }

    var need = Math.max(1, Math.ceil(media.length * fraction));
    var priority = media.slice(0, need);
    var loaded = 0;

    function isReady(el) {
        return el.tagName === 'IMG'
            ? el.complete && el.naturalWidth > 0
            : el.readyState >= 2; // HAVE_CURRENT_DATA
    }

    function bump() {
        loaded++;
        var percent = Math.min(100, Math.round(loaded / priority.length * 100));
        if (bar) bar.style.width = percent + '%';
        if (pct) pct.textContent = percent + '%';
        if (loaded >= priority.length) reveal();
        else armStall(); // progress advanced — restart the stall countdown
    }

    priority.forEach(function (el) {
        // Promote the priority media out of lazy loading so they fetch now.
        if (el.tagName === 'IMG') {
            el.loading = 'eager';
        } else {
            el.preload = 'auto';
            try { el.load(); } catch (e) {}
        }
        if (isReady(el)) { bump(); return; }
        var ev = el.tagName === 'IMG' ? 'load' : 'loadeddata';
        var done = function () {
            el.removeEventListener(ev, done);
            el.removeEventListener('error', done);
            bump();
        };
        el.addEventListener(ev, done);
        el.addEventListener('error', done);
    });

    // Start the stall countdown (covers a hang before any media loads), and keep
    // the absolute cap as a final backstop so the overlay never traps the visitor.
    if (!loader.classList.contains('is-done')) armStall();
    setTimeout(reveal, timeout);
})();
