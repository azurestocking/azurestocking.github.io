---
layout: default
title: Opus
---

<section>
    <div class="heading">Lorem ipsum dolor sit amet, consectetur adipiscing elit</div>
    <h3>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </h3>
</section>

<section>
    <img src="{{ '/images/placeholder.jpg' | relative_url }}" loading="lazy">
</section>

<section>
    <div class="col-1-3">
        <div class="col-1">
            <p><span style="color: var(--tertiary)">Role</span><br>Product Designer</p>
            <p><span style="color: var(--tertiary)">Duration</span><br>4 Months</p>
            <p><span style="color: var(--tertiary)">Client</span><br>Opus Clip</p>
        </div>
        <div class="col-3">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </div>
    </div>
</section>

<section>
    <h1>Highlight</h1>
    <div class="p-l">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </div>
</section>

<section class="content">
    <div>
        <img src="{{ '/images/placeholder.jpg' | relative_url }}" loading="lazy">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </div>
    <div>
        <img src="{{ '/images/placeholder.jpg' | relative_url }}" loading="lazy">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </div>
</section>

<section>
    <h1>Market Analysis</h1>
    <div class="p-l">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </div>
</section>

<section>
    <h1>Concept Testing</h1>
    <div class="p-l">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </div>
</section>

<script>
    document.addEventListener("scroll", function() {
        const targetElements = [
            { id: "highlight", color: "#e0d7e5" },
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
</script> 