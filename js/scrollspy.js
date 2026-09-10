document.addEventListener('DOMContentLoaded', function() {
    const main = document.querySelector('main');
    const scrollspyLinks = document.querySelector('.scrollspy-links');
    const scrollspy = document.querySelector('#scrollspy');

    if (!scrollspy) {
        return;
    }

    // Turn arbitrary text into a URL-safe id fragment
    function slug(text) {
        return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }

    // Guarantee unique ids across all entries (repeated labels like
    // think/make/check, or duplicate h3 text, get a numeric suffix)
    const usedIds = new Set();
    function uniqueId(base) {
        base = base || 'section';
        let id = base, n = 2;
        while (usedIds.has(id)) id = `${base}-${n++}`;
        usedIds.add(id);
        return id;
    }

    // Build the TOC from <h2> phase/section headings
    const nodes = Array.from(main.querySelectorAll('h2')).filter(h => !h.classList.contains('np'));
    const tocTargets = [];

    nodes.forEach(node => {
        const text = node.textContent.trim();
        if (!text) return;

        if (node.id) usedIds.add(node.id);       // respect any existing id
        else node.id = uniqueId(slug(text));

        const link = document.createElement('a');
        link.href = '#' + node.id;
        link.textContent = text;
        link.classList.add('scrollspy-link');
        scrollspyLinks.appendChild(link);
        tocTargets.push(node);
    });

    // Hide TOC if there is nothing to link to
    if (tocTargets.length === 0) {
        scrollspy.classList.add('hide');
        return;
    }

    // The active section is the last heading whose top has passed the viewport
    // center. It stays active until the NEXT heading reaches the center — so the
    // previous row never turns off in the gap between sections.
    let activeLink = null;

    function updateActive() {
        const centerY = window.innerHeight / 2;
        let current = tocTargets[0];
        for (const t of tocTargets) {
            if (t.getBoundingClientRect().top <= centerY) current = t;
            else break;
        }
        const link = document.querySelector(`.scrollspy-link[href="#${current.id}"]`);
        if (!link || link === activeLink) return;
        if (activeLink) activeLink.classList.remove('active');
        link.classList.add('active');
        activeLink = link;
        revealActive(link);
    }

    // When the dock overflows and the active link isn't fully visible, snap it
    // to the left edge so it becomes the first item (page-style, not one-by-one)
    function revealActive(link) {
        const c = scrollspyLinks;
        if (c.scrollWidth <= c.clientWidth) return;   // nothing to scroll
        const l = link.getBoundingClientRect();
        const box = c.getBoundingClientRect();
        if (l.left < box.left || l.right > box.right) {
            c.scrollBy({ left: l.left - box.left, behavior: 'smooth' });
        }
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('resize', updateActive);
    updateActive();

});