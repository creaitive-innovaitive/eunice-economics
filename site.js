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

// Chapter downloads list, read from downloads.json so it stays in sync with the Downloads page.
document.querySelectorAll('[data-downloads]').forEach(ul => {
  const pre = ul.dataset.prefix || '';
  fetch(pre + 'downloads.json').then(r => r.json()).then(d => {
    const key = ul.dataset.downloads;
    let files = [];
    if (key.startsWith('tech:')) files = d.other.flatMap(o => o.files).filter(f => f.name.startsWith(key.slice(5)));
    else { const ch = d.themes.flatMap(t => t.chapters).find(c => String(c.number) === key); if (ch) files = ch.files; }
    ul.innerHTML = '';
    if (!files.length) { ul.innerHTML = '<li>Nothing here yet.</li>'; return; }
    files.forEach(f => {
      const li = document.createElement('li'), a = document.createElement('a');
      a.href = pre + encodeURI(f.path); a.textContent = f.name + ' (' + (f.type || 'PDF') + ')'; a.setAttribute('download', '');
      li.appendChild(a); ul.appendChild(li);
    });
  }).catch(() => { ul.innerHTML = '<li>Could not load the list.</li>'; });
});
