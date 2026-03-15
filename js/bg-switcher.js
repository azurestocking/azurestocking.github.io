---
---
(function() {
    var defaultBg = "var(--background)";

    function runProjectPageSwitcher() {
        var el = document.querySelector("[data-project-color]");
        var projectColor = el && el.getAttribute("data-project-color");
        var fullBgSections = document.querySelectorAll(".full-bg");
        if (!projectColor || !fullBgSections.length) return false;

        var overlay = document.createElement("div");
        overlay.id = "viewport-bg-overlay";
        overlay.setAttribute("aria-hidden", "true");
        overlay.style.cssText = "position:fixed;inset:0;z-index:-1;pointer-events:none;transition:background-color 0.2s ease;";
        document.body.appendChild(overlay);

        document.documentElement.style.backgroundColor = "transparent";
        document.body.style.backgroundColor = "transparent";

        function setOverlay(inView) {
            overlay.style.backgroundColor = inView ? projectColor : defaultBg;
        }

        function sectionCoversViewportCenter(section) {
            var r = section.getBoundingClientRect();
            var centerY = window.innerHeight / 2;
            return r.top <= centerY && r.bottom >= centerY;
        }

        function updateOverlay() {
            var anyInView = false;
            fullBgSections.forEach(function(section) {
                if (sectionCoversViewportCenter(section)) anyInView = true;
            });
            setOverlay(anyInView);
        }

        var observer = new IntersectionObserver(
            updateOverlay,
            { root: null, rootMargin: "0px", threshold: 0 }
        );

        fullBgSections.forEach(function(section) {
            observer.observe(section);
        });

        window.addEventListener("scroll", updateOverlay, { passive: true });
        window.addEventListener("resize", updateOverlay);

        updateOverlay();
        return true;
    }

    function runIndexPageSwitcher() {
        var projects = [
            {% assign visible_projects = site.projects | where_exp: "item", "item.draft != true" %}
            {% for project in visible_projects %}
            { id: "{{ project.slug }}", color: "{{ project.color }}" }{% unless forloop.last %},{% endunless %}
            {% endfor %}
        ];
        if (!projects.length) return;

        function update() {
            var currentColor = defaultBg;
            for (var i = 0; i < projects.length; i++) {
                var section = projects[i];
                var element = document.getElementById(section.id);
                if (element && element.getBoundingClientRect().top <= 240) {
                    currentColor = section.color;
                }
            }
            document.body.style.backgroundColor = currentColor;
        }

        document.addEventListener("scroll", update, { passive: true });
        update();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    function init() {
        if (!runProjectPageSwitcher()) {
            runIndexPageSwitcher();
        }
    }
})();
