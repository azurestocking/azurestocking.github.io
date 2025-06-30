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
    overviewLink.classList.add('scrollspy-link', 'h2');
    scrollspyLinks.appendChild(overviewLink);

    // Create Design Process link
    const processLink = document.createElement('a');
    processLink.href = '#design-process';
    processLink.textContent = 'Design Process';
    processLink.classList.add('scrollspy-link', 'h2');
    scrollspyLinks.appendChild(processLink);
    
    // Apply staggered transitions
    function applyStaggeredTransitions(isHiding) {
        const links = scrollspy.querySelectorAll('.scrollspy-link');
        const delayIncrement = 0.05;
        
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
    
    // Check if any full-width-bg element is at scrollspy position
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
        window.addEventListener('scroll', checkScrollspyVisibility);
        checkScrollspyVisibility();
    }
    
    // Function to generate ID based on section-header index and h2 index
    function generateHeadingId(heading) {
        // Find all h2 headings
        const sectionHeader = heading.closest('.full-width-bg');
        if (sectionHeader) {
            // Find their index
            const allSectionHeaders = Array.from(document.querySelectorAll('.full-width-bg')).filter(el => 
                el.querySelector('h2') && !el.id // Exclude elements that already have IDs like overview
            );
            const sectionIndex = allSectionHeaders.indexOf(sectionHeader) + 1;
            // Find their heading text
            const h2Text = heading.textContent.toLowerCase().replace(/\s+/g, '-');
            
            return `${sectionIndex}-${h2Text}`;
        } else if (heading.tagName === 'H3' && heading.hasAttribute('index')) {
            // Find all h3 headings and their index, heading text
            const h3Index = heading.getAttribute('index');
            const h3Text = heading.textContent.toLowerCase().replace(/\s+/g, '-');
            return `${h3Index}-${h3Text}`;
        } else {
            // For h2/h3 elements not in section-headers and without index, use their text content
            const headingText = heading.textContent.toLowerCase().replace(/\s+/g, '-');
            return headingText;
        }
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
            heading.id = generateHeadingId(heading);
        }
        link.href = '#' + heading.id;
        
        // Check if h2 headings
        const sectionHeader = heading.closest('.full-width-bg');
        if (sectionHeader && heading.tagName === 'H2') {
            // Find their index
            const allSectionHeaders = Array.from(document.querySelectorAll('.full-width-bg')).filter(el => 
                el.querySelector('h2') && !el.id // Exclude elements that already have IDs like overview
            );
            const sectionIndex = allSectionHeaders.indexOf(sectionHeader) + 1;
            link.textContent = `${sectionIndex} ${heading.textContent}`;
        } else if (heading.tagName === 'H3' && heading.hasAttribute('index')) {
            // For h3 elements with index attribute, display index + text
            const h3Index = heading.getAttribute('index');
            link.textContent = `${h3Index} ${heading.textContent}`;
        } else {
            link.textContent = heading.textContent;
        }
        
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
    
    // Create Retrospect link
    const retrospectLink = document.createElement('a');
    retrospectLink.href = '#retrospect';
    retrospectLink.textContent = 'Retrospect';
    retrospectLink.classList.add('scrollspy-link', 'h2');
    scrollspyLinks.appendChild(retrospectLink);
    
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

    const retrospectSection = document.getElementById('retrospect');
    if (retrospectSection) {
        observer.observe(retrospectSection);
    }

    const processSection = document.getElementById('design-process');
    if (processSection) {
        observer.observe(processSection);
    }
}); 