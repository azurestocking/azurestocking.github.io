document.addEventListener('DOMContentLoaded', function() {
    const main = document.querySelector('main');
    const scrollspyLinks = document.querySelector('.scrollspy-links');
    
    // Get all h2 and h3 elements from main
    const headings = Array.from(main.querySelectorAll('h2, h3')).filter(heading => {
        return !heading.classList.contains('np');
    });

    // Hide TOC if no headings are found
    if (headings.length === 0) {
        scrollspyLinks.parentElement.style.display = 'none';
        return;
    }
    
    // Create Overview link first
    const overviewLink = document.createElement('a');
    overviewLink.href = '#overview';
    overviewLink.textContent = 'Overview';
    overviewLink.classList.add('scrollspy-link', 'h2');
    scrollspyLinks.appendChild(overviewLink);
    
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