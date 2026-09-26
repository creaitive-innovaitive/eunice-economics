// Objectives diagram: AR = 40 - 2Q, MR = 40 - 4Q, AC = 8 + 0.3(Q-5)^2, MC = 0.9Q^2 - 6Q + 15.5
(function () {
  const AR = q => 40 - 2 * q, MR = q => 40 - 4 * q, AC = q => 8 + 0.3 * (q - 5) ** 2, MC = q => 0.9 * q * q - 6 * q + 15.5;
  const q1 = (2 + Math.sqrt(4 + 4 * 0.9 * 24.5)) / 1.8, q2 = 10, q3 = (1 + Math.sqrt(1 + 4 * 0.3 * 24.5)) / 0.6;
  makeStepper('obj', {
    chart: { xmax: 14, ymax: 44, label: 'Business objectives diagram' },
    steps: [
      'Demand (<b>AR</b>) slopes down. <b>MR</b> starts at the same point on the price axis and is twice as steep.',
      'Add <b>MC</b> and <b>AC</b>. MC cuts AC at its lowest point.',
      '<b>Profit maximisation:</b> MC = MR at Q1. Read up to AR for the price, P1.',
      '<b>Revenue maximisation:</b> MR = 0 at Q2. Total revenue is at its peak, output is higher and price lower than at Q1.',
      '<b>Sales maximisation:</b> AC = AR at Q3, the highest output that still earns normal profit.',
      'Order of output: <b>Q1 &lt; Q2 &lt; Q3</b>. Order of price: P1 &gt; P2 &gt; P3. A firm moving from profit maximisation to sales maximisation trades profit for volume.'
    ],
    draw(c) {
      c.curve(AR, 'ar', 0, 0, 14, 'AR', 11.5); c.curve(MR, 'mr', 0, 0, 10.9, 'MR', 9.4);
      c.curve(MC, 'mc', 1, 2, 10.5, 'MC', 9.8); c.curve(AC, 'ac', 1, 0.3, 14, 'AC', 13);
      const mark = (q, y, l, step) => { c.dash(q, y, step); c.dot(q, y, step); c.tag(q, 0, l, step, 0, 14); };
      mark(q1, MR(q1), 'Q1', 2); c.dash(q1, AR(q1), 2); c.dot(q1, AR(q1), 2); c.tag(0, AR(q1), 'P1', 2, -14, 4);
      mark(q2, 0, 'Q2', 3); c.dash(q2, AR(q2), 3); c.dot(q2, AR(q2), 3); c.tag(0, AR(q2), 'P2', 3, -14, 4);
      mark(q3, AR(q3), 'Q3', 4); c.tag(0, AR(q3), 'P3', 4, -14, 4);
    }
  });
})();

makeQuiz('quiz', [
  { q: 'Where should you put the label Q1 on a profit-maximising diagram?', options: ['On the curve', 'On the quantity axis where the dashed line meets it', 'Next to the title', 'On the price axis'], answer: 1, why: 'Dashed lines drop to the axis and the value is written where they meet it.' },
  { q: 'MC should cut the AC curve:', options: ['At any point', 'At AC\'s lowest point', 'At the start of AC', 'Above AC\'s peak'], answer: 1, why: 'MC pulls AC down while below it and up while above it, so they meet at the minimum.' },
  { q: 'Which diagram do you draw for "assess whether a firm should stay in the market in the short run"?', options: ['Only AR and MR', 'AR against AVC, with the shut-down rule', 'The circular flow', 'A PPF'], answer: 1, why: 'The short-run shut-down point is where AR falls below AVC.' },
  { q: 'Your diagram shows a shift of demand. What must you add?', options: ['Nothing', 'The new curve labelled D2, an arrow, and the new Q2 and P2', 'A second title', 'Only the arrow'], answer: 1, why: 'Label the new curve and equilibrium so it can be referred to in the text.' },
  { q: 'What makes a diagram earn analysis marks?', options: ['It is neat', 'It is used and referred to in the argument', 'It is large', 'It is in colour'], answer: 1, why: 'The diagram supports the chain of reasoning only when the text uses it.' }
]);
