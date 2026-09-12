// Collapse long accordions to a capped number of rows, with a View more / Show less toggle.
// Opt in per accordion: <div class="accordion" data-collapse="3">…</div>
(function () {
    function setup(acc) {
        var max = parseInt(acc.getAttribute('data-collapse'), 10);
        if (!max || isNaN(max)) return;

        var items = Array.prototype.filter.call(acc.children, function (el) {
            return el.classList.contains('accordion-item');
        });
        if (items.length <= max) return;

        var hidden = items.slice(max);
        var expanded = false;

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'accordion-more';
        btn.setAttribute('aria-controls', '');

        function render() {
            hidden.forEach(function (el) { el.hidden = !expanded; });
            btn.textContent = expanded
                ? '↑ Show less'
                : '↓ View more (' + hidden.length + ')';
            btn.setAttribute('aria-expanded', String(expanded));
        }

        btn.addEventListener('click', function () {
            expanded = !expanded;
            if (!expanded) {
                hidden.forEach(function (el) { el.open = false; }); // collapse before hiding
            }
            render();
        });

        render();
        acc.parentNode.insertBefore(btn, acc.nextSibling);
    }

    document.querySelectorAll('.accordion[data-collapse]').forEach(setup);
})();