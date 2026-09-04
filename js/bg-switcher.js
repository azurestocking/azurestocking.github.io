<script>
    document.addEventListener("scroll", function() {
        const projects = [
            {% for project in site.projects %}
            {
                id: "{{ project.slug }}",
                color: "{{ project.color }}"
            }{% unless forloop.last %},{% endunless %}
            {% endfor %}
        ];
        
        let currentColor = "var(--background)";

        // Check if we're at the top
        const firstProject = projects[0];
        if (firstProject) {
            const firstElement = document.getElementById(firstProject.id);
            if (firstElement && firstElement.getBoundingClientRect().top > 240) {
                currentColor = "var(--background)";
            }
        }

        // Check each project section
        for (const section of projects) {
            const element = document.getElementById(section.id);
            if (element && element.getBoundingClientRect().top <= 240) {
                currentColor = section.color;
            }
        }

        document.body.style.backgroundColor = currentColor;
    });
</script>