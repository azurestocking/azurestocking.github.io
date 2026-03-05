document.addEventListener('DOMContentLoaded', function() {
    const scrollspyLinks = document.querySelector('.scrollspy-links');
    const scrollspy = document.querySelector('#scrollspy');

    if (!scrollspy) {
        return;
    }

    // On project pages scrollspy lives in .side-container; keep it there. Else move to body for z-index above header.
    if (!scrollspy.parentElement || !scrollspy.parentElement.classList.contains('side-container')) {
        document.body.appendChild(scrollspy);
    }

    // Use the .main-container that is sibling to scrollspy's column (same grid), so we don't pick the header's .main-container
    const grid = scrollspy.closest('.grid');
    const main = grid ? grid.querySelector('.main-container') : (document.querySelector('main') || document.querySelector('.main-container'));

    if (!main) {
        return;
    }

    // Function to generate ID from heading text
    function generateHeadingId(heading) {
        const headingText = heading.textContent.toLowerCase().replace(/\s+/g, '-');
        return headingText;
    }

    // Get h3 inside section with class "subtitle" only, in document order (exclude .np and .hide)
    const headings = Array.from(main.querySelectorAll('section.subtitle h3')).filter(heading => {
        return !heading.classList.contains('np') && !heading.classList.contains('hide');
    });

    const isInSideContainer = scrollspy.parentElement && scrollspy.parentElement.classList.contains('side-container');

    if (headings.length === 0 && !isInSideContainer) {
        scrollspy.classList.add('scrollspy-hidden');
        return;
    }

    // Build section ids: use parent section.subtitle id if present, else set from heading
    const sectionIds = [];

    headings.forEach(heading => {
        const link = document.createElement('a');
        const section = heading.closest('section.subtitle');
        const targetId = section && (section.id || (section.id = generateHeadingId(heading)));
        sectionIds.push(targetId);
        link.href = '#' + targetId;
        link.classList.add('scrollspy-link', heading.tagName.toLowerCase());
        link.textContent = heading.textContent;
        scrollspyLinks.appendChild(link);
    });

    // First section (for visibility when scrollspy is not in sidebar): overview or first linked section
    const overviewSection = document.getElementById('overview') || (sectionIds[0] ? document.getElementById(sectionIds[0]) : null);

    function setActiveLinkFromScrollPosition() {
        const viewportMid = window.scrollY + window.innerHeight / 2;
        let bestId = null;
        let bestTop = -Infinity;
        sectionIds.forEach(function(id) {
            const el = document.getElementById(id);
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const top = rect.top + window.scrollY;
            const bottom = top + rect.height;
            if (top <= viewportMid && bottom >= viewportMid) {
                if (top > bestTop) {
                    bestTop = top;
                    bestId = id;
                }
            } else if (bottom < viewportMid && bottom > bestTop) {
                bestTop = bottom;
                bestId = id;
            }
        });
        if (bestId) {
            const link = document.querySelector('.scrollspy-link[href="#' + bestId + '"]');
            if (link) {
                document.querySelectorAll('.scrollspy-link').forEach(function(l) { l.classList.remove('active'); });
                link.classList.add('active');
            }
        }
    }

    function updateScrollspyVisibility() {
        if (!overviewSection) {
            scrollspy.classList.remove('scrollspy-hidden');
            return;
        }
        // On project pages (scrollspy in sidebar) always show the TOC
        if (isInSideContainer) {
            scrollspy.classList.remove('scrollspy-hidden');
            setActiveLinkFromScrollPosition();
            return;
        }
        const rect = overviewSection.getBoundingClientRect();
        const halfViewport = window.innerHeight / 2;
        if (rect.bottom <= -halfViewport) {
            setActiveLinkFromScrollPosition();
            var hasActive = scrollspyLinks.querySelector('.scrollspy-link.active');
            if (hasActive) {
                scrollspy.classList.remove('scrollspy-hidden');
            } else {
                scrollspy.classList.add('scrollspy-hidden');
            }
        } else {
            scrollspy.classList.add('scrollspy-hidden');
        }
    }

    window.addEventListener('scroll', function() {
        updateScrollspyVisibility();
    });
    window.addEventListener('resize', updateScrollspyVisibility);
    updateScrollspyVisibility();

    // On project pages (sidebar) ensure visible from the start
    if (isInSideContainer) {
        scrollspy.classList.remove('scrollspy-hidden');
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

            if (entry.isIntersecting && link) {
                document.querySelectorAll('.scrollspy-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    }, observerOptions);

    // Observe each linked section/heading by id
    sectionIds.forEach(function(id) {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
    });
});
