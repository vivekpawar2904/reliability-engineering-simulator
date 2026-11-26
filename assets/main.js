/* ===== main.js : tabs and navigation ===== */
(function () {
  'use strict';
  const btns = $$('.tab-btn');
  function show(id, scrollTo) {
    btns.forEach(b => b.classList.toggle('active', b.dataset.tab === id));
    $$('.tab').forEach(t => t.classList.toggle('active', t.id === 'tab-' + id));
    Plot.redrawAll();
    if (scrollTo) { const el = document.getElementById(scrollTo); if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30); } else window.scrollTo(0, 0);
    try { history.replaceState(null, '', '#' + (scrollTo || id)); } catch (e) { }
  }
  btns.forEach(b => b.addEventListener('click', () => show(b.dataset.tab)));
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const id = a.getAttribute('href').slice(1); const el = document.getElementById(id); if (!el) return;
    e.preventDefault(); const tab = el.closest('.tab'); if (tab) show(tab.id.replace('tab-', ''), id === tab.id ? null : id); else show(id);
  });
  const h = location.hash.slice(1);
  if (h) { const el = document.getElementById(h); if (el) { const tab = el.closest('.tab'); if (tab) show(tab.id.replace('tab-', ''), el === tab ? null : h); } }
  window.addEventListener('load', () => Plot.redrawAll());
})();
