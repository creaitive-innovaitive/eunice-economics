// Shared interactive components: charts, steppers, reveal lists, quizzes, flashcards.
const NS = 'http://www.w3.org/2000/svg';
const el = (tag, attrs = {}, parent) => {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
};

// Axes-based chart. x and y run from 0 to xmax / ymax.
function makeChart(host, o) {
  const W = 520, H = 340, L = 52, B = 44, T = 16, R = 20;
  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, class: 'chart', role: 'img', 'aria-label': o.label || 'Economics diagram' });
  host.appendChild(svg);
  const X = x => L + (x / o.xmax) * (W - L - R);
  const Y = y => H - B - (y / o.ymax) * (H - B - T);
  el('path', { d: `M${L} ${T}V${H - B}H${W - R}`, class: 'axis' }, svg);
  const xt = el('text', { x: (W + L) / 2, y: H - 8, class: 'axlab', 'text-anchor': 'middle' }, svg); xt.textContent = o.xlab || 'Quantity';
  const yt = el('text', { x: 14, y: (H - B + T) / 2, class: 'axlab', 'text-anchor': 'middle', transform: `rotate(-90 14 ${(H - B + T) / 2})` }, svg); yt.textContent = o.ylab || 'Price / costs (£)';
  const api = { svg, X, Y, W, H, L, B, T, R };
  api.curve = (fn, cls, step, from = 0, to = o.xmax, label, lx) => {
    let d = '';
    for (let i = 0; i <= 120; i++) {
      const x = from + (to - from) * i / 120, y = fn(x);
      if (y < -0.001 || y > o.ymax) { if (d) d += ' '; d += '\u0000'; continue; }
      d += (d === '' || d.endsWith('\u0000') ? 'M' : 'L') + X(x).toFixed(1) + ' ' + Y(y).toFixed(1);
    }
    const g = el('g', step != null ? { 'data-step': step } : {}, svg);
    el('path', { d: d.replace(/\u0000/g, ''), class: 'line ' + cls }, g);
    if (label) {
      const xx = lx != null ? lx : to;
      const t = el('text', { x: X(xx) + 4, y: Y(fn(xx)) - 4, class: 'lab ' + cls }, g); t.textContent = label;
    }
    return g;
  };
  api.dash = (x, y, step, cls = 'guide') => {
    const g = el('g', step != null ? { 'data-step': step } : {}, svg);
    if (x != null && y != null) {
      el('path', { d: `M${X(x)} ${Y(y)}V${Y(0)}M${X(x)} ${Y(y)}H${X(0)}`, class: cls }, g);
    } else if (x != null) el('path', { d: `M${X(x)} ${Y(0)}V${T}`, class: cls }, g);
    return g;
  };
  api.dot = (x, y, step, cls = '') => { const g = el('g', step != null ? { 'data-step': step } : {}, svg); el('circle', { cx: X(x), cy: Y(y), r: 5, class: 'dot ' + cls }, g); return g; };
  api.tag = (x, y, text, step, dx = 0, dy = 0, cls = '') => { const g = el('g', step != null ? { 'data-step': step } : {}, svg); const t = el('text', { x: X(x) + dx, y: Y(y) + dy, class: 'lab ' + cls, 'text-anchor': 'middle' }, g); t.textContent = text; return g; };
  api.rect = (x1, y1, x2, y2, step, cls) => { const g = el('g', step != null ? { 'data-step': step } : {}, svg); el('rect', { x: X(x1), y: Y(y2), width: X(x2) - X(x1), height: Y(y1) - Y(y2), class: cls }, g); return g; };
  api.clear = () => svg.querySelectorAll('.dyn').forEach(n => n.remove());
  return api;
}

// Stepper: steps = [captions]; draw(chart, state) is called once; elements with data-step <= current are shown.
function makeStepper(id, o) {
  const root = document.getElementById(id);
  const host = root.querySelector('.chart-host');
  const chart = makeChart(host, o.chart);
  o.draw(chart, root);
  const cap = root.querySelector('.cap'), count = root.querySelector('.count');
  const prev = root.querySelector('[data-prev]'), next = root.querySelector('[data-next]');
  const all = root.querySelector('.allcaps');
  o.steps.forEach(s => { const li = document.createElement('li'); li.innerHTML = s; all.appendChild(li); });
  let cur = 0;
  const render = () => {
    chart.svg.querySelectorAll('[data-step]').forEach(g => g.style.display = +g.dataset.step <= cur ? '' : 'none');
    cap.innerHTML = o.steps[cur];
    count.textContent = `Step ${cur + 1} of ${o.steps.length}`;
    prev.disabled = cur === 0; next.disabled = cur === o.steps.length - 1;
    if (o.onStep) o.onStep(cur, chart, root);
  };
  prev.onclick = () => { cur--; render(); };
  next.onclick = () => { cur++; render(); };
  render();
  return { chart, root, render, get step() { return cur; } };
}

// Reveal list: button shows the next item.
function initReveals() {
  document.querySelectorAll('.reveal').forEach(r => {
    const items = [...r.querySelectorAll(':scope > li')];
    const btn = r.nextElementSibling;
    let n = 0;
    items.forEach((li, i) => li.hidden = i >= 1);
    n = 1;
    btn.onclick = () => {
      if (n < items.length) items[n++].hidden = false;
      if (n >= items.length) btn.disabled = true;
    };
    const rs = btn.parentElement.querySelector('[data-reset]');
    if (rs) rs.onclick = () => { items.forEach((li, i) => li.hidden = i >= 1); n = 1; btn.disabled = false; };
  });
}

// Quiz: questions = [{q, options[], answer, why}]
function makeQuiz(id, questions) {
  const root = document.getElementById(id);
  let score = 0, answered = 0;
  const board = document.createElement('p'); board.className = 'score';
  questions.forEach((q, qi) => {
    const box = document.createElement('div'); box.className = 'q';
    box.innerHTML = `<p><strong>${qi + 1}.</strong> ${q.q}</p>`;
    const fb = document.createElement('p'); fb.className = 'fb'; fb.hidden = true;
    q.options.forEach((opt, oi) => {
      const b = document.createElement('button'); b.className = 'opt'; b.textContent = opt;
      b.onclick = () => {
        if (box.dataset.done) return;
        box.dataset.done = 1; answered++;
        const ok = oi === q.answer; if (ok) score++;
        b.classList.add(ok ? 'right' : 'wrong');
        if (!ok) box.querySelectorAll('.opt')[q.answer].classList.add('right');
        fb.hidden = false; fb.innerHTML = (ok ? 'Correct. ' : 'Not quite. ') + q.why;
        board.textContent = `Score: ${score} / ${answered} answered (of ${questions.length})`;
      };
      box.appendChild(b);
    });
    box.appendChild(fb); root.appendChild(box);
  });
  root.appendChild(board);
}

function makeFlashcards(id, cards) {
  const root = document.getElementById(id);
  cards.forEach(([term, def]) => {
    const c = document.createElement('button'); c.className = 'card';
    c.innerHTML = `<span class="front">${term}</span><span class="back">${def}</span>`;
    c.onclick = () => c.classList.toggle('flipped');
    root.appendChild(c);
  });
}
document.addEventListener('DOMContentLoaded', initReveals);
