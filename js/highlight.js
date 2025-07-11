document.addEventListener("scroll", function() {
    const targetElements = [
        { id: "highlight", color: "{{ page.color }}" },
        { id: "process", color: "var(--background)" }
    ];

    let currentColor = "var(--background)";

    for (let i = 0; i < targetElements.length; i++) {
        const targetElement = document.getElementById(targetElements[i].id);
        const targetPosition = targetElement.getBoundingClientRect().top;

        if (targetPosition <= 240) {
            currentColor = targetElements[i].color;
        }
    }

    document.body.style.backgroundColor = currentColor;
}); 