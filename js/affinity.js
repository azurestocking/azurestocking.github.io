// Affinity morph — re-group the same sticky notes between states, animating each
// note along its own path (FLIP). Fully attribute-driven; no per-note ids or JSON.
//
//   <div class="affinity-morph"
//        data-states="stakeholder:By stakeholder, theme:By theme"
//        data-order-theme="A, B, C">                 <!-- optional group order per state -->
//     <div class="sticky-board">
//       <div class="sticky blue" data-stakeholder="Engineer" data-theme="A">text…</div>
//       …
//     </div>
//   </div>
//
// For a state keyed "theme", notes are grouped by their data-theme value. Group
// titles come from the attribute values; group order is data-order-<key> if given,
// else first appearance. The toggle buttons are generated from data-states.
(function () {
    var ROTS = [-6, -3, -5, 3, -4, 4, -2, 2];

    function parseStates(attr) {
        return (attr || '').split(',').map(function (s) {
            var p = s.split(':');
            var key = (p[0] || '').trim();
            return key ? { key: key, label: (p.slice(1).join(':').trim() || key) } : null;
        }).filter(Boolean);
    }

    function build(morph) {
        var board = morph.querySelector('.sticky-board');
        if (!board) return;
        var states = parseStates(morph.getAttribute('data-states'));
        if (!states.length) return;

        var notes = Array.prototype.slice.call(board.querySelectorAll('.sticky'));
        notes.forEach(function (el, i) {
            el._rot = ROTS[i % ROTS.length];
            el.style.transform = 'rotate(' + el._rot + 'deg)';
        });

        // Generate the toggle (unless one was authored)
        var toggle = morph.querySelector('.affinity-toggle');
        if (!toggle) {
            toggle = document.createElement('div');
            toggle.className = 'affinity-toggle';
            states.forEach(function (st, i) {
                var b = document.createElement('button');
                b.type = 'button';
                b.setAttribute('data-state', st.key);
                b.textContent = st.label;
                if (i === 0) b.className = 'is-active';
                toggle.appendChild(b);
            });
            morph.insertBefore(toggle, board);
        }
        var buttons = toggle.querySelectorAll('button');
        var current = (toggle.querySelector('button.is-active') || buttons[0]).getAttribute('data-state');

        function groupsFor(key) {
            var map = {}, seen = [];
            notes.forEach(function (el) {
                var g = el.getAttribute('data-' + key) || '—';
                if (!map[g]) { map[g] = []; seen.push(g); }
                map[g].push(el);
            });
            var order = seen;
            var explicit = morph.getAttribute('data-order-' + key);
            if (explicit) {
                var listed = explicit.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
                order = listed.filter(function (g) { return map[g]; })
                    .concat(seen.filter(function (g) { return listed.indexOf(g) === -1; }));
            }
            // Optional per-group columns: data-cols-<key>="Group:2, Other:1"
            var cols = {}, colsAttr = morph.getAttribute('data-cols-' + key);
            if (colsAttr) colsAttr.split(',').forEach(function (pair) {
                var p = pair.split(':'), name = (p[0] || '').trim(), n = (p[1] || '').trim();
                if (name && n) cols[name] = n;
            });
            return order.map(function (g) { return { title: g, notes: map[g], cols: cols[g] }; });
        }

        function paint(key, animate) {
            var firsts;
            if (animate) firsts = notes.map(function (el) { return el.getBoundingClientRect(); });

            board.textContent = '';
            groupsFor(key).forEach(function (g) {
                var group = document.createElement('div');
                group.className = 'sticky-group';
                if (g.cols) group.setAttribute('data-cols', g.cols);
                var title = document.createElement('p');
                title.className = 'sticky-group-title';
                title.textContent = g.title;
                var stk = document.createElement('div');
                stk.className = 'stickies';
                g.notes.forEach(function (el) { stk.appendChild(el); });
                group.appendChild(title);
                group.appendChild(stk);
                board.appendChild(group);
            });

            if (animate) {
                notes.forEach(function (el, i) {
                    var last = el.getBoundingClientRect(), first = firsts[i];
                    el.style.transition = 'none';
                    el.style.transform = 'translate(' + (first.left - last.left) + 'px,' +
                        (first.top - last.top) + 'px) rotate(' + el._rot + 'deg)';
                });
                board.getBoundingClientRect(); // reflow
                notes.forEach(function (el, i) {
                    el.style.transition = 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)';
                    el.style.transitionDelay = (i % 12) * 12 + 'ms';
                    el.style.transform = 'rotate(' + el._rot + 'deg)';
                });
            }
            current = key;
        }

        buttons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var key = btn.getAttribute('data-state');
                if (key === current) return;
                buttons.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
                var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                paint(key, !reduce);
            });
        });

        paint(current, false); // group the flat notes into the initial state
    }

    document.querySelectorAll('.affinity-morph').forEach(build);
})();
