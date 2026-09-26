// Calculation generator
(function () {
  const $ = id => document.getElementById(id);
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  let mode = 'pct', cur = null;
  const round = (x, d = 2) => Math.round(x * 10 ** d) / 10 ** d;
  const gen = {
    pct() { const o = ri(20, 90) * 10, n = o + ri(-15, 25) * 10 / 2 * 2; const ans = round((n - o) / o * 100);
      return { q: `Sales rose from ${o} thousand to ${n} thousand. Calculate the percentage change in sales (2 d.p.).`, ans, work: `(${n} − ${o}) ÷ ${o} × 100 = ${ans}%` }; },
    ped() { const p0 = ri(4, 12), p1 = p0 + ri(1, 3), q0 = ri(20, 60) * 10, q1 = q0 - ri(2, 8) * 10;
      const dp = (p1 - p0) / p0 * 100, dq = (q1 - q0) / q0 * 100, ans = round(dq / dp);
      return { q: `The price of a product rises from £${p0} to £${p1}. Quantity demanded falls from ${q0} to ${q1}. Calculate PED (2 d.p.).`, ans, work: `%ΔP = (${p1} − ${p0}) ÷ ${p0} × 100 = ${round(dp)}%<br>%ΔQ = (${q1} − ${q0}) ÷ ${q0} × 100 = ${round(dq)}%<br>PED = ${round(dq)} ÷ ${round(dp)} = ${ans} (${Math.abs(ans) > 1 ? 'elastic' : Math.abs(ans) < 1 ? 'inelastic' : 'unit elastic'})` }; },
    tr() { const p = ri(5, 30), q = ri(10, 90) * 10, tc = Math.round(p * q * ri(60, 95) / 100 / 10) * 10, tr = p * q, pr = tr - tc, ans = round(pr / tr * 100, 1);
      return { q: `A firm sells ${q} units at £${p} each. Its total cost is £${tc}. Calculate its profit margin (1 d.p.).`, ans, work: `TR = ${p} × ${q} = £${tr}<br>Profit = ${tr} − ${tc} = £${pr}<br>Profit margin = ${pr} ÷ ${tr} × 100 = ${ans}%` }; }
  };
  const next = () => { cur = gen[mode](); $('q').textContent = cur.q; $('ans').value = ''; $('res').textContent = ''; $('work').hidden = true; };
  document.querySelector('[data-new]').onclick = next;
  document.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => { mode = b.dataset.mode; next(); });
  document.querySelector('[data-check]').onclick = () => {
    const v = parseFloat($('ans').value); if (isNaN(v)) { $('res').textContent = 'Enter a number first.'; return; }
    const ok = Math.abs(v - cur.ans) <= 0.011 || (mode === 'ped' && Math.abs(Math.abs(v) - Math.abs(cur.ans)) <= 0.011);
    $('res').textContent = ok ? 'Correct.' : 'Not quite. Try again or show the working.';
  };
  document.querySelector('[data-work]').onclick = () => { $('work').innerHTML = cur.work; $('work').hidden = false; };
  next();
})();

// Bar chart: fictional market shares
(function () {
  const data = [['Firm A', 32], ['Firm B', 24], ['Firm C', 18], ['Firm D', 10], ['Firm E', 6], ['Others', 10]];
  const svg = el('svg', { viewBox: '0 0 520 260', class: 'chart', role: 'img', 'aria-label': 'Market shares of firms' }, document.getElementById('bar'));
  el('path', { d: 'M50 15V215H505', class: 'axis' }, svg);
  data.forEach(([n, v], i) => {
    const x = 70 + i * 72, h = v * 5.4;
    el('rect', { x, y: 215 - h, width: 48, height: h, fill: '#2f5bd3', 'fill-opacity': .8 }, svg);
    const t = el('text', { x: x + 24, y: 209 - h, class: 'lab', 'text-anchor': 'middle' }, svg); t.textContent = v + '%';
    const l = el('text', { x: x + 24, y: 233, class: 'lab', 'text-anchor': 'middle' }, svg); l.textContent = n;
  });
  const yt = el('text', { x: 12, y: 115, class: 'axlab', 'text-anchor': 'middle', transform: 'rotate(-90 12 115)' }, svg); yt.textContent = 'Market share (%)';
})();
makeQuiz('quiz', [
  { q: 'What is the three-firm concentration ratio?', options: ['56%', '74%', '84%', '32%'], answer: 1, why: '32 + 24 + 18 = 74%.' },
  { q: 'Firm A is how many percentage points ahead of Firm C?', options: ['14', '18', '44%', '1.8'], answer: 0, why: '32 − 18 = 14 percentage points.' },
  { q: 'Firm B\'s share is what proportion of Firm A\'s share?', options: ['24%', '75%', '133%', '56%'], answer: 1, why: '24 ÷ 32 × 100 = 75%.' }
]);
makeQuiz('quiz2', [
  { q: 'A rate rises from 5% to 8%. Which statement is correct?', options: ['A rise of 3%', 'A rise of 3 percentage points, or 60%', 'A rise of 38%', 'A rise of 0.6 percentage points'], answer: 1, why: '8 − 5 = 3 percentage points; 3 ÷ 5 × 100 = 60% rise.' },
  { q: 'Price rises 10% and quantity demanded falls 15%. PED is:', options: ['−1.5, elastic', '−0.67, inelastic', '+1.5, elastic', '−5, elastic'], answer: 0, why: '−15 ÷ 10 = −1.5. The size is above 1, so demand is elastic.' },
  { q: 'The base for a percentage change is:', options: ['The new value', 'The original value', 'The average', 'The larger value'], answer: 1, why: 'Always divide the change by the original value.' },
  { q: 'Why quote data from the extract?', options: ['To fill space', 'To support and apply a point in the chain of reasoning', 'To copy the passage', 'It is not needed'], answer: 1, why: 'Application marks reward using evidence at the right step in an argument.' }
]);
