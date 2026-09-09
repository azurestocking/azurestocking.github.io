document.addEventListener('DOMContentLoaded', function() {
    const main = document.querySelector('main');
    const scrollspyLinks = document.querySelector('.scrollspy-links');
    const scrollspy = document.querySelector('#scrollspy');

    if (!scrollspy) {
        return;
    }

    // Create Overview link
    const overviewLink = document.createElement('a');
    overviewLink.href = '#overview';
    overviewLink.textContent = 'Overview';
    overviewLink.classList.add('scrollspy-link');
    scrollspyLinks.appendChild(overviewLink);

    // Turn arbitrary text into a URL-safe id fragment
    function slug(text) {
        return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }

    // Capitalize each word: "think" -> "Think"
    function titleCase(text) {
        return text.replace(/\b\w/g, ch => ch.toUpperCase());
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

    // Build the TOC from <hr> section dividers, each labelled by the
    // aria-label on its container (e.g. <div class="grid" aria-label="think">)
    const nodes = Array.from(main.querySelectorAll('hr'));
    const tocTargets = [];

    nodes.forEach(node => {
        const labelled = node.closest('[aria-label]');
        const label = labelled && labelled.getAttribute('aria-label');
        if (!label) return;                 // unlabelled divider → skip
        const text = titleCase(label);

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

    // Update active state on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const link = document.querySelector(`.scrollspy-link[href="#${id}"]`);
            if (!link) return;

            if (entry.isIntersecting) {
                document.querySelectorAll('.scrollspy-link').forEach(link => {
                    link.classList.remove('active');
                });
                link.classList.add('active');
            }
        });
    }, observerOptions);

    // Observe the overview section and every TOC target
    const overviewSection = document.getElementById('overview');
    if (overviewSection) {
        observer.observe(overviewSection);
    }
    tocTargets.forEach(target => {
        observer.observe(target);
    });

    // Disappear / reappear: hide the TOC whenever a full-width band scrolls
    // behind it. #scrollspy is height:0, so measure the actual TOC content box.
    const tocBox = scrollspy.querySelector('.scrollspy-content');
    const fullWidthBgElements = Array.from(document.querySelectorAll('.full-width-bg'));

    function updateScrollspyVisibility() {
        const toc = tocBox.getBoundingClientRect();
        const behindBand = fullWidthBgElements.some(el => {
            const r = el.getBoundingClientRect();
            return !(r.bottom < toc.top || r.top > toc.bottom);
        });
        scrollspy.classList.toggle('scrollspy-hidden', behindBand);
    }

    if (fullWidthBgElements.length > 0) {
        window.addEventListener('scroll', updateScrollspyVisibility, { passive: true });
        window.addEventListener('resize', updateScrollspyVisibility);
        updateScrollspyVisibility();
    }

});