document.addEventListener('DOMContentLoaded', function() {
    const main = document.querySelector('main');
    const scrollspyLinks = document.querySelector('.scrollspy-links');
    const scrollspy = document.querySelector('#scrollspy');
    
    // Check if scrollspy exists
    if (!scrollspy) {
        return;
    }
    
    // Function to apply staggered transitions
    function applyStaggeredTransitions(isHiding) {
        const links = scrollspy.querySelectorAll('.scrollspy-link');
        const delayIncrement = 0.05; // 50ms between each link
        
        links.forEach((link, index) => {
            let delay;
            if (isHiding) {
                // Disappear from bottom to top
                delay = (links.length - 1 - index) * delayIncrement;
            } else {
                // Appear from top to bottom
                delay = index * delayIncrement;
            }
            link.style.transitionDelay = `${delay}s`;
        });
    }
    
    // Get all elements with "full-width-bg" class
    const fullWidthBgElements = document.querySelectorAll('.full-width-bg');
    
    // Function to check if any full-width-bg element is at scrollspy position
    function checkScrollspyVisibility() {
        const scrollspyViewportY = 24; // scrollspy is positioned at top: 24px in viewport
        
        // Get the scrollspy element's height to calculate its bottom position
        const scrollspyHeight = scrollspy.offsetHeight;
        const scrollspyBottomY = scrollspyViewportY + scrollspyHeight;
        
        const hasFullWidthBgIntersection = Array.from(fullWidthBgElements).some(element => {
            const rect = element.getBoundingClientRect();
            
            // Check if there's any intersection between the scrollspy and the full-width-bg element
            // scrollspy: from scrollspyViewportY to scrollspyBottomY
            // element: from rect.top to rect.bottom
            return !(rect.bottom < scrollspyViewportY || rect.top > scrollspyBottomY);
        });
        
        if (hasFullWidthBgIntersection) {
            applyStaggeredTransitions(true); // Apply disappearing delays
            scrollspy.classList.add('scrollspy-hidden');
        } else {
            applyStaggeredTransitions(false); // Apply appearing delays
            scrollspy.classList.remove('scrollspy-hidden');
        }
    }
    
    // Set up scroll listener for full-width-bg elements
    if (fullWidthBgElements.length > 0) {
        // Check on scroll
        window.addEventListener('scroll', checkScrollspyVisibility);
        
        // Check initial state
        checkScrollspyVisibility();
    }
    
    // Get all h2 and h3 elements from main
    const headings = Array.from(main.querySelectorAll('h2, h3')).filter(heading => {
        return !heading.classList.contains('np');
    });

    // Hide TOC if no headings are found
    if (headings.length === 0) {
        scrollspy.classList.add('scrollspy-hidden');
        return;
    }
    
    // Create TOC for other headings
    headings.forEach(heading => {
        const link = document.createElement('a');
        if (!heading.id) {
            heading.id = heading.textContent.toLowerCase().replace(/\s+/g, '-');
        }
        link.href = '#' + heading.id;
        link.textContent = heading.textContent;
        link.classList.add('scrollspy-link');
        
        // Add h3 class for indentation
        if (heading.tagName === 'H3') {
            link.classList.add('h3');
            scrollspyLinks.appendChild(link);
        } else if (heading.tagName === 'H2') {
            link.classList.add('h2');
            scrollspyLinks.appendChild(link);
        }
    });
    
    // Apply initial staggered transitions after creating links
    applyStaggeredTransitions(false);
    
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
            
            if (entry.isIntersecting) {
                document.querySelectorAll('.scrollspy-link').forEach(link => {
                    link.classList.remove('active');
                });
                link.classList.add('active');
            }
        });
    }, observerOptions);
    
    // Observe all headings and the overview section
    const overviewSection = document.getElementById('overview');
    if (overviewSection) {
        observer.observe(overviewSection);
    }
    headings.forEach(heading => {
        observer.observe(heading);
    });
}); 