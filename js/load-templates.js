// Function to load HTML templates
async function loadTemplate(elementId, templatePath) {
    try {
        const response = await fetch(templatePath);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error(`Error loading template ${templatePath}:`, error);
    }
}

// Load templates when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadTemplate('header-container', '/templates/header.html');
    loadTemplate('footer-container', '/templates/footer.html');
}); 