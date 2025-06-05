document.addEventListener('DOMContentLoaded', function() {
    const main = document.querySelector('main');
    const scrollspyLinks = document.querySelector('.scrollspy-links');
    const collapseButton = document.querySelector('.scrollspy-collapse');
    
    // Get all h1 and h2 elements from main
    const headings = Array.from(main.querySelectorAll('h1, h2')).filter(heading => {
        return !heading.classList.contains('np');
    });

    // Hide TOC if no headings are found
    if (headings.length === 0) {
        scrollspyLinks.parentElement.style.display = 'none';
        return;
    }
    
    // Toggle collapse state
    collapseButton.addEventListener('click', function() {
        scrollspyLinks.classList.toggle('collapsed');
        collapseButton.textContent = scrollspyLinks.classList.contains('collapsed') ? '＋' : '－';
    });
    
    // Create TOC
    headings.forEach(heading => {
        const link = document.createElement('a');
        if (!heading.id) {
            heading.id = heading.textContent.toLowerCase().replace(/\s+/g, '-');
        }
        link.href = '#' + heading.id;
        link.textContent = heading.textContent;
        link.classList.add('scrollspy-link');
        
        // Add h2 class for indentation
        if (heading.tagName === 'H2') {
            link.classList.add('h2');
        } else if (heading.tagName === 'H1') {
            link.classList.add('h1');
        }
        
        scrollspyLinks.appendChild(link);
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