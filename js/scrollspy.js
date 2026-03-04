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

    // Create Overview link
    const overviewLink = document.createElement('a');
    overviewLink.href = '#overview';
    overviewLink.textContent = 'Overview';
    overviewLink.classList.add('scrollspy-link', 'h2');
    scrollspyLinks.appendChild(overviewLink);

    // Function to generate ID for any heading
    function generateHeadingId(heading) {
        if (heading.tagName === 'H2' && heading.hasAttribute('index')) {
            const h2Index = heading.getAttribute('index');
            const h2Text = heading.textContent.toLowerCase().replace(/\s+/g, '-');
            return `${h2Index}-${h2Text}`;
        }
        const headingText = heading.textContent.toLowerCase().replace(/\s+/g, '-');
        return headingText;
    }

    // Get h2 and h3 elements from main in document order (exclude .np and .hide)
    const headings = Array.from(main.querySelectorAll('h2, h3')).filter(heading => {
        return !heading.classList.contains('np') && !heading.classList.contains('hide');
    });

    const isInSideContainer = scrollspy.parentElement && scrollspy.parentElement.classList.contains('side-container');

    // When not in side-container and no headings: hide and stop. Otherwise continue so we at least have Overview.
    if (headings.length === 0 && !isInSideContainer) {
        scrollspy.classList.add('scrollspy-hidden');
        return;
    }

    // Create TOC for h2 and h3 headings (class h2/h3 for styling/indent)
    headings.forEach(heading => {
        const link = document.createElement('a');
        if (!heading.id) {
            heading.id = generateHeadingId(heading);
        }
        link.href = '#' + heading.id;
        link.textContent = heading.textContent;
        link.classList.add('scrollspy-link', heading.tagName.toLowerCase());
        scrollspyLinks.appendChild(link);
    });

    // Show scrollspy only when overview section is out of viewport
    const overviewSection = document.getElementById('overview');
    const sectionIds = ['overview'].concat(headings.map(function(h) { return h.id || ''; }).filter(Boolean));

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

    // Observe overview and all headings (h2 + h3)
    if (overviewSection) observer.observe(overviewSection);
    headings.forEach(heading => observer.observe(heading));
});
