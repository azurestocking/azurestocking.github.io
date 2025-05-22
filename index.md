---
layout: default
title: Index
---

<section>
    <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</h2>
    <div class="button-group">
        <a class="button" href="/">LinkedIn ↗</a>
        <a class="button" href="/">GitHub ↗</a>
        <a class="button" href="/">Resume ↗</a>
        <a class="button" href="/">E-Mail ↗</a>
    </div>
</section>

<section id="featured">
    <h1>FEATURED</h1>
    <div class="project">
        <div id="project-1">
            <img src="{{ '/images/placeholder.jpg' | relative_url }}" loading="lazy">
            <h3><a href="{{ '/project/opus' | relative_url }}">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore</a></h3>
            <h4>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</h4>
            <div class="tag-group">
                <span class="tag">DESIGN</span>
                <span class="tag">USER EXPERIENCE</span>
                <span class="tag">WEB APPLICATION</span>
                <span class="tag">GENERATIVE AI</span>
            </div>
        </div>
        <div id="project-2"> 
            <img src="{{ '/images/placeholder.jpg' | relative_url }}" loading="lazy">
            <h3><a href="{{ '/project/recount' | relative_url }}">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore</a></h3>
            <h4>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</h4>
            <div class="tag-group">
                <span class="tag">Tag 1</span>
                <span class="tag">Tag 2</span>
                <span class="tag">Tag 3</span>
            </div>
        </div>
    </div>
</section>

<section id="about" class="about">
    <h1>About</h1>
    <h3>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</h3>
    <div class="col-2">
        <div class="col-1 list-container">
            <div>
                <h5>EDUCATION</h5>
                <div class="list">
                    <div class="list-item">
                        <div class="list-item-1">
                            <div>Harvard University</div>
                            <div>2024</div>
                        </div>
                        <div class="list-item-2">
                            <div>Master in Design Studies</div>
                        </div>
                    </div>
                    <div class="list-item">
                        <div class="list-item-1">
                            <div>Tsinghua University</div>
                            <div>2020</div>
                        </div>
                        <div class="list-item-2">
                            <div>Bachelor of Arts</div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h5>EXPERIENCE</h5>
                <div class="list">
                    <div class="list-item">
                        <div class="list-item-1">
                            <div>Berkman Klein Center</div>
                            <div>2024</div>
                        </div>
                        <div class="list-item-2">
                            <div>Research Sprint Participant</div>
                        </div>
                    </div>
                    <div class="list-item">
                        <div class="list-item-1">
                            <div>Savills</div>
                            <div>2023</div>
                        </div>
                        <div class="list-item-2">
                            <div>Strategy Consultant Intern</div>
                        </div>
                    </div>
                    <div class="list-item">
                        <div class="list-item-1">
                            <div>Roland Berger</div>
                            <div>2022</div>
                        </div>
                        <div class="list-item-2">
                            <div>Strategy Consultant Intern</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-1 list-container">
            <div>
                <h5>RECOGNITION</h5>
                <div class="list">
                    <div class="list-item">
                        <div class="list-item-1">
                            <div>Red Dot Award</div>
                            <div>2024</div>
                        </div>
                        <div class="list-item-2">
                            <div>Winner</div>
                        </div>
                    </div>
                    <div class="list-item">
                        <div class="list-item-1">
                            <div>MUSE Creative Award</div>
                            <div>2024</div>
                        </div>
                        <div class="list-item-2">
                            <div>Platinum Winner</div>
                        </div>
                    </div>
                    <div class="list-item">
                        <div class="list-item-1">
                            <div>Museum of Science, Boston</div>
                            <div>2024</div>
                        </div>
                        <div class="list-item-2">
                            <div>Participant</div>
                        </div>
                    </div>
                    <div class="list-item">
                        <div class="list-item-1">
                            <div>Venice Biennale</div>
                            <div>2023</div>
                        </div>
                        <div class="list-item-2">
                            <div>Participant</div>
                        </div>
                    </div>
                    <div class="list-item">
                        <div class="list-item-1">
                            <div>National Exhibition of Fine Arts, China</div>
                            <div>2019</div>
                        </div>
                        <div class="list-item-2">
                            <div>Participant</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<script>
    document.addEventListener("scroll", function() {
        const targetElements = [
            { id: "project-1", color: "#e0d7e5" },
            { id: "project-2", color: "#e0e7f2" },
            { id: "about", color: "var(--background)" }
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