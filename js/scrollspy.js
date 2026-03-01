document.addEventListener('DOMContentLoaded', function() {
    const main = document.querySelector('main');
    const scrollspyLinks = document.querySelector('.scrollspy-links');
    const scrollspy = document.querySelector('#scrollspy');
    const scrollspyToggle = document.getElementById('scrollspy-toggle');

    if (!scrollspy) {
        return;
    }

    // Move scrollspy to body so its z-index can sit above the header (scrollspy is otherwise inside main, which has z-index 1)
    document.body.appendChild(scrollspy);

    // Create Overview link
    const overviewLink = document.createElement('a');
    overviewLink.href = '#overview';
    overviewLink.textContent = 'Overview';
    overviewLink.classList.add('scrollspy-link', 'h2');
    scrollspyLinks.appendChild(overviewLink);

    // Function to generate ID for h2
    function generateHeadingId(heading) {
        if (heading.tagName === 'H2' && heading.hasAttribute('index')) {
            const h2Index = heading.getAttribute('index');
            const h2Text = heading.textContent.toLowerCase().replace(/\s+/g, '-');
            return `${h2Index}-${h2Text}`;
        }
        const headingText = heading.textContent.toLowerCase().replace(/\s+/g, '-');
        return headingText;
    }

    // Get only h2 elements from main (no h3)
    const headings = Array.from(main.querySelectorAll('h2')).filter(heading => {
        return !heading.classList.contains('np');
    });

    // Hide TOC if no headings are found
    if (headings.length === 0) {
        scrollspy.classList.add('scrollspy-hidden');
        return;
    }

    // Create TOC for h2 headings only
    headings.forEach(heading => {
        const link = document.createElement('a');
        if (!heading.id) {
            heading.id = generateHeadingId(heading);
        }
        link.href = '#' + heading.id;
        link.textContent = heading.textContent;
        link.classList.add('scrollspy-link', 'h2');
        scrollspyLinks.appendChild(link);
    });

    // Create Retrospect link
    const retrospectLink = document.createElement('a');
    retrospectLink.href = '#retrospect';
    retrospectLink.textContent = 'Retrospect';
    retrospectLink.classList.add('scrollspy-link', 'h2');
    scrollspyLinks.appendChild(retrospectLink);

    // Show scrollspy only when overview section is out of viewport
    const overviewSection = document.getElementById('overview');
    const sectionIds = ['overview'].concat(headings.map(function(h) { return h.id || ''; }).filter(Boolean), ['retrospect']);

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

    function collapseScrollspyIfExpanded() {
        if (scrollspyLinks.classList.contains('collapsed')) return;
        scrollspyLinks.classList.add('collapsed');
        if (scrollspyToggle) {
            const icon = scrollspyToggle.querySelector('i');
            if (icon) {
                icon.classList.add('fa-chevron-down');
                icon.classList.remove('fa-chevron-up');
            }
            scrollspyToggle.setAttribute('aria-label', 'Show table of contents');
        }
    }
    window.addEventListener('scroll', function() {
        updateScrollspyVisibility();
        collapseScrollspyIfExpanded();
    });
    window.addEventListener('resize', updateScrollspyVisibility);
    updateScrollspyVisibility();

    // Expand/collapse toggle: default collapsed
    scrollspyLinks.classList.add('collapsed');
    if (scrollspyToggle) {
        scrollspyToggle.addEventListener('click', function() {
            scrollspyLinks.classList.toggle('collapsed');
            const icon = scrollspyToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-chevron-down', scrollspyLinks.classList.contains('collapsed'));
                icon.classList.toggle('fa-chevron-up', !scrollspyLinks.classList.contains('collapsed'));
            }
            scrollspyToggle.setAttribute('aria-label', scrollspyLinks.classList.contains('collapsed') ? 'Show table of contents' : 'Hide table of contents');
        });
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

    // Observe overview, retrospect and h2 sections only
    if (overviewSection) observer.observe(overviewSection);
    headings.forEach(heading => observer.observe(heading));
    const retrospectSection = document.getElementById('retrospect');
    if (retrospectSection) observer.observe(retrospectSection);
});
