document.querySelectorAll('[data-expand]').forEach(b => b.onclick = () => document.querySelectorAll('details').forEach(d => d.open = true));
document.querySelectorAll('[data-collapse]').forEach(b => b.onclick = () => document.querySelectorAll('details').forEach(d => d.open = false));
document.querySelectorAll('[data-print]').forEach(b => b.onclick = () => {
  document.querySelectorAll('details').forEach(d => d.open = true);
  window.print();
});

if (location.hash === '#print') document.querySelectorAll('details').forEach(d => d.open = true);

// Cover: dissolves on click; shows once per browser session (a session cookie, cleared when the browser closes), on whichever page the visitor lands.
const cover = document.getElementById('cover');
if (cover && document.documentElement.classList.contains('nocover')) {
  cover.remove();
} else if (cover) {
  document.body.style.overflow = 'hidden';
  cover.querySelector('button').onclick = () => {
    try { document.cookie = 'eunice_cover=1; path=/; SameSite=Lax'; } catch (e) {}
    const next = new URLSearchParams(location.search).get('next');
    if (next && /^\/(?!\/)/.test(next)) { location.replace(next); return; }
    cover.classList.add('dissolve');
    document.body.style.overflow = '';
    setTimeout(() => cover.remove(), 3100);
  };
}

// Home page tabs
const tabs = document.querySelectorAll('.tabs button');
if (tabs.length) {
  const show = id => {
    tabs.forEach(t => t.setAttribute('aria-selected', t.dataset.tab === id));
    document.querySelectorAll('.panel').forEach(p => p.hidden = p.id !== id);
  };
  tabs.forEach(t => t.onclick = () => { history.replaceState(null, '', '#' + t.dataset.tab); show(t.dataset.tab); });
  const fromHash = () => show(location.hash === '#technique' ? 'technique' : 'theme3');
  window.addEventListener('hashchange', fromHash);
  fromHash();
}
