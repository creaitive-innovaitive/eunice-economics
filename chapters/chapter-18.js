// Revenue widget
(function () {
  const AR = q => 40 - 2 * q, TR = q => 40 * q - 2 * q * q, MR = q => 40 - 4 * q;
  const a = makeChart(document.getElementById('rev-ar'), { xmax: 20, ymax: 40, label: 'AR and MR' });
  a.curve(AR, 'ar', null, 0, 20, 'AR = D', 15); a.curve(MR, 'mr', null, 0, 10, 'MR', 8);
  const pt = a.svg.appendChild(document.createElementNS(NS, 'g'));
  const b = makeChart(document.getElementById('rev-tr'), { xmax: 20, ymax: 210, ylab: 'Total revenue (£)', label: 'Total revenue' });
  b.curve(TR, 'tr', null, 0, 20, 'TR', 17);
  const pt2 = b.svg.appendChild(document.createElementNS(NS, 'g'));
  const s = document.getElementById('revq');
  const upd = () => {
    const q = +s.value; document.getElementById('revqo').textContent = q;
    const mr = MR(q);
    document.getElementById('r-p').textContent = '£' + AR(q);
    document.getElementById('r-tr').textContent = '£' + TR(q);
    document.getElementById('r-mr').textContent = '£' + mr;
    document.getElementById('r-ped').textContent = mr > 0 ? 'elastic' : mr === 0 ? 'unit elastic' : 'inelastic';
    pt.innerHTML = ''; pt2.innerHTML = '';
    el('circle', { cx: a.X(q), cy: a.Y(AR(q)), r: 5, class: 'dot' }, pt);
    el('circle', { cx: a.X(q), cy: a.Y(Math.max(mr, 0)), r: 5, class: 'dot' }, pt);
    el('path', { d: `M${a.X(q)} ${a.Y(0)}V${a.Y(AR(q))}`, class: 'guide' }, pt);
    el('circle', { cx: b.X(q), cy: b.Y(TR(q)), r: 5, class: 'dot' }, pt2);
    el('path', { d: `M${b.X(q)} ${b.Y(0)}V${b.Y(TR(q))}`, class: 'guide' }, pt2);
  };
  s.oninput = upd; upd();
})();

// Cost curves: TC = Q^3 - 9Q^2 + 30Q + 40
(function () {
  const MC = q => 3 * q * q - 18 * q + 30, AVC = q => q * q - 9 * q + 30, AC = q => q * q - 9 * q + 30 + 40 / q;
  makeStepper('costs', {
    chart: { xmax: 9, ymax: 60, label: 'Short-run cost curves' },
    steps: [
      'Axes: output (Q) along the bottom, costs per unit (£) up the side.',
      '<b>MC</b> falls at first (specialisation) then rises as diminishing marginal productivity sets in.',
      '<b>AVC</b> follows the same U shape. MC cuts AVC at its minimum point.',
      '<b>AC</b> = AVC + AFC. AFC falls as output rises, so AC and AVC get closer together.',
      'MC cuts AC at its lowest point (the point of productive efficiency in the short run). Left of it MC pulls AC down; right of it MC drags AC up.'
    ],
    draw(c) {
      c.curve(MC, 'mc', 1, 0.05, 8, 'MC', 7.0);
      c.curve(AVC, 'avc', 2, 0.05, 8.2, 'AVC', 7.6);
      c.curve(AC, 'ac', 3, 0.6, 8.2, 'AC', 8);
      const q = 5.22; c.dash(q, AC(q), 4); c.dot(q, AC(q), 4);
      c.tag(q, 0, 'min AC', 4, 0, 14);
    }
  });
})();

// LRAC
(function () {
  const sr = (k, m, w) => q => m + w * (q - k) * (q - k);
  const cfg = [[2, 26, 1.7], [4, 20, 1.3], [6.2, 17, 1.0], [8.2, 17, 1.2], [10.2, 21, 1.5], [12, 28, 1.8]];
  const lr = q => Math.min(...cfg.map(([k, m, w]) => sr(k, m, w)(q)));
  makeStepper('lrac', {
    chart: { xmax: 14, ymax: 44, label: 'Long-run average cost' },
    steps: [
      'Each grey curve is the short-run average cost curve for one size of plant.',
      'Bigger plants have lower minimum costs at first (economies of scale) and then higher ones (diseconomies).',
      'The LRAC is the lower envelope of every SRAC: the cheapest way to produce each output when the firm can choose its plant size.',
      'The minimum efficient scale (MES) is the lowest output at which LRAC reaches its minimum.'
    ],
    draw(c) {
      cfg.forEach(([k, m, w], i) => c.curve(sr(k, m, w), 'sr', 0, Math.max(0.3, k - 3.3), Math.min(13.9, k + 3.3)));
      c.svg.querySelectorAll('.sr').forEach(p => p.parentNode.setAttribute('data-step', 0));
      c.curve(lr, 'lr', 2, 0.6, 13.5, 'LRAC', 12);
      c.tag(3, 30, 'Economies of scale', 1, 0, 0, 'lr');
      c.tag(11.6, 12, 'Diseconomies of scale', 1, 0, 0, 'lr');
      const mes = 6.2; c.dash(mes, 17, 3); c.dot(mes, 17, 3); c.tag(mes, 0, 'MES', 3, 0, 14);
    }
  });
})();

// Profit maximisation with demand slider
(function () {
  const MCf = q => 3 * q * q - 18 * q + 30, ACf = q => q * q - 9 * q + 30 + 40 / q;
  let a = 44;
  const ARf = q => a - 3 * q, MRf = q => a - 6 * q;
  const solve = () => { // 3q^2 - 12q + 30 - a = 0
    const disc = 144 - 12 * (30 - a); return (12 + Math.sqrt(Math.max(disc, 0))) / 6;
  };
  const st = makeStepper('profit', {
    chart: { xmax: 9, ymax: 60, label: 'Profit maximisation' },
    steps: [
      'The firm faces a downward-sloping demand curve, <b>AR</b>, with <b>MR</b> below it and twice as steep.',
      'Add the cost curves: <b>MC</b> and <b>AC</b>.',
      'Profit is maximised where <b>MC = MR</b>. Read down to find the profit-maximising output, Q*.',
      'Go up to the AR curve to find the price the firm charges, P*.',
      'Go across to the AC curve at Q* to find the cost per unit, C*.',
      'Profit = (P* − C*) × Q*. This is the shaded rectangle. Use the slider to move demand.'
    ],
    draw() {},
    onStep(cur, c, root) {
      c.svg.querySelectorAll('.dyn').forEach(n => n.remove());
      const g = (step, node) => { node.classList.add('dyn'); return node; };
      const add = (fn) => { const grp = el('g', { class: 'dyn' }, c.svg); fn(grp); };
      const q = solve(), p = ARf(q), cost = ACf(q);
      const line = (fn, cls, to, label, lx) => add(grp => {
        let d = ''; for (let i = 0; i <= 100; i++) { const x = to * i / 100, y = fn(x); if (y >= 0 && y <= 60) d += (d ? 'L' : 'M') + c.X(x).toFixed(1) + ' ' + c.Y(y).toFixed(1); }
        el('path', { d, class: 'line ' + cls }, grp);
        const t = el('text', { x: c.X(lx) + 4, y: c.Y(fn(lx)) - 4, class: 'lab ' + cls }, grp); t.textContent = label;
      });
      line(ARf, 'ar', 9, 'AR', Math.min(8.5, a / 3 - 0.3));
      line(MRf, 'mr', 9, 'MR', Math.min(6.4, a / 6 - 0.4));
      if (cur >= 1) { line(MCf, 'mc', 8, 'MC', 7.0); line(ACf, 'ac', 8.2, 'AC', 8); }
      if (cur >= 2) add(grp => { el('path', { d: `M${c.X(q)} ${c.Y(0)}V${c.Y(MCf(q))}`, class: 'guide' }, grp); el('circle', { cx: c.X(q), cy: c.Y(MCf(q)), r: 5, class: 'dot' }, grp); const t = el('text', { x: c.X(q), y: c.Y(0) + 14, class: 'lab', 'text-anchor': 'middle' }, grp); t.textContent = 'Q*'; });
      if (cur >= 3) add(grp => { el('path', { d: `M${c.X(q)} ${c.Y(p)}H${c.X(0)}`, class: 'guide' }, grp); el('circle', { cx: c.X(q), cy: c.Y(p), r: 5, class: 'dot' }, grp); const t = el('text', { x: c.X(0) - 6, y: c.Y(p) + 4, class: 'lab', 'text-anchor': 'end' }, grp); t.textContent = 'P*'; });
      if (cur >= 4) add(grp => { el('path', { d: `M${c.X(q)} ${c.Y(cost)}H${c.X(0)}`, class: 'guide' }, grp); el('circle', { cx: c.X(q), cy: c.Y(cost), r: 5, class: 'dot' }, grp); const t = el('text', { x: c.X(0) - 6, y: c.Y(cost) + 4, class: 'lab', 'text-anchor': 'end' }, grp); t.textContent = 'C*'; });
      if (cur >= 5) add(grp => {
        const gain = p >= cost;
        el('rect', { x: c.X(0), y: c.Y(Math.max(p, cost)), width: c.X(q) - c.X(0), height: Math.abs(c.Y(p) - c.Y(cost)), class: gain ? 'profit' : 'loss' }, grp);
        const t = el('text', { x: c.X(q / 2), y: c.Y((p + cost) / 2) + 4, class: 'lab', 'text-anchor': 'middle' }, grp);
        t.textContent = Math.abs(p - cost) < 0.4 ? 'normal profit' : gain ? 'supernormal profit' : 'loss';
      });
      const sl = document.getElementById('profit-slider'); sl.hidden = cur < 5;
    }
  });
  document.getElementById('dem').oninput = e => { a = +e.target.value; st.render(); };
})();

makeFlashcards('flash', [
  ['Total revenue', 'Price × quantity sold.'],
  ['Average revenue', 'TR ÷ Q. Equals price, and is the firm\'s demand curve.'],
  ['Marginal revenue', 'The extra revenue from selling one more unit.'],
  ['Marginal cost', 'The extra cost of producing one more unit.'],
  ['Fixed costs', 'Costs that do not change with output in the short run.'],
  ['Variable costs', 'Costs that change with output.'],
  ['Diminishing marginal productivity', 'Beyond some point, each extra worker adds less to output than the last when a factor is fixed.'],
  ['Economies of scale', 'Falls in long-run average cost as output rises.'],
  ['Diseconomies of scale', 'Rises in long-run average cost as output rises further.'],
  ['Minimum efficient scale', 'Lowest output at which LRAC is at its minimum.'],
  ['Normal profit', 'Minimum profit to keep the firm in the industry. AR = AC.'],
  ['Supernormal profit', 'Profit above normal. AR > AC.'],
  ['Shut-down point (short run)', 'AR falls below AVC.'],
  ['Shut-down point (long run)', 'AR falls below AC.'],
  ['Satisficing', 'Aiming for a satisfactory level of profit rather than the maximum.'],
  ['Profit maximisation', 'Producing where MC = MR.']
]);

makeQuiz('quiz', [
  { q: 'A firm\'s MR is negative. Demand at that output is:', options: ['Price elastic', 'Unit elastic', 'Price inelastic', 'Perfectly elastic'], answer: 2, why: 'When MR &lt; 0, cutting price lowers total revenue, so demand is inelastic.' },
  { q: 'Which output does a revenue-maximising firm choose?', options: ['MC = MR', 'MR = 0', 'AC = AR', 'AR = MR'], answer: 1, why: 'Total revenue peaks where MR = 0.' },
  { q: 'MC cuts AC at:', options: ['AC\'s minimum point', 'AC\'s maximum point', 'The fixed cost level', 'Zero output'], answer: 0, why: 'Below AC, MC pulls the average down; above AC it pulls it up, so they meet at the minimum.' },
  { q: 'A firm in the short run has AR above AVC but below AC. It should:', options: ['Shut down immediately', 'Keep producing in the short run', 'Raise fixed costs', 'Merge'], answer: 1, why: 'It covers variable costs and part of fixed costs, so losses are smaller than if it shut down.' },
  { q: 'Which is an external economy of scale?', options: ['Bulk buying discounts', 'A local pool of skilled workers', 'Cheaper loans for a big firm', 'Specialist managers'], answer: 1, why: 'External economies come from the size of the industry, not the firm. The others are internal.' },
  { q: 'Supernormal profit exists when:', options: ['AR = AC', 'AR &lt; AC', 'AR &gt; AC', 'MC = MR'], answer: 2, why: 'Profit per unit is AR − AC, so it is above normal when AR is above AC.' }
]);
