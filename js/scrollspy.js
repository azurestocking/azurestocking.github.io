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

    // Get h2 inside .module-header, in document order (exclude .np and .hide)
    const headings = Array.from(main.querySelectorAll('.module-header h2')).filter(heading => {
        return !heading.classList.contains('np') && !heading.classList.contains('hide');
    });

    const isInSideContainer = scrollspy.parentElement && scrollspy.parentElement.classList.contains('side-container');

    if (headings.length === 0 && !isInSideContainer) {
        scrollspy.classList.add('scrollspy-hidden');
        return;
    }

    // Build section ids: use parent section id if present, else set from heading
    const sectionIds = [];
    const linksById = new Map();

    headings.forEach((heading) => {
        const link = document.createElement('a');
        const section = heading.closest('section');
        const targetId = section && (section.id || (section.id = generateHeadingId(heading)));
        if (!targetId) {
            return;
        }

        sectionIds.push(targetId);
        link.href = '#' + targetId;
        link.classList.add('scrollspy-link', heading.tagName.toLowerCase());

        const moduleLabel = section ? section.querySelector('.module-label') : null;
        const chapterPrefix = moduleLabel ? moduleLabel.textContent.trim() : '';
        const headingText = heading.textContent.trim();
        link.append(chapterPrefix ? `${chapterPrefix}: ${headingText}` : headingText);
        scrollspyLinks.appendChild(link);
        linksById.set(targetId, link);
    });

    // First section (for visibility when scrollspy is not in sidebar): overview or first linked section
    const overviewSection = document.getElementById('overview') || (sectionIds[0] ? document.getElementById(sectionIds[0]) : null);

    function setActiveLinkFromScrollPosition() {
        const activationLine = window.scrollY + window.innerHeight * 0.35;
        let bestId = null;
        let bestTop = -Infinity;
        sectionIds.forEach(function(id) {
            const el = document.getElementById(id);
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const top = rect.top + window.scrollY;
            if (top <= activationLine && top > bestTop) {
                bestTop = top;
                bestId = id;
            }
        });
        if (!bestId && sectionIds.length > 0) {
            bestId = sectionIds[0];
        }
        document.querySelectorAll('.scrollspy-link').forEach(function(l) { l.classList.remove('active'); });
        if (bestId) {
            const link = linksById.get(bestId);
            if (link) link.classList.add('active');
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
});
