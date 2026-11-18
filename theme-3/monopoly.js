// Natural monopoly diagram. Illustrative: LRAC = 20 + 800/Q (large fixed cost, constant marginal cost of 20), demand P = 80 - 0.5Q.
(function () {
  const LRAC = q => 20 + 800 / q, D = q => 80 - 0.5 * q, MCV = () => 20;
  // Where demand meets LRAC on its falling stretch (larger root of 0.5Q^2 - 60Q + 800 = 0).
  const q1 = (120 + Math.sqrt(120 * 120 - 4 * 1600)) / 2, q2 = q1 / 2, qmc = 120;
  makeStepper('nm', {
    chart: { xmax: 135, ymax: 90, xlab: 'Quantity of passenger journeys', ylab: 'Price / costs', label: 'Natural monopoly: LRAC, LRMC and demand' },
    steps: [
      '<b>LRAC</b> falls across the whole range. Laying track and building stations are huge fixed costs, spread over more passengers as output rises.',
      '<b>LRMC</b> is low and constant: one more passenger or train adds little cost. Because MC stays below AC, AC keeps falling.',
      '<b>Demand (D)</b> cuts LRAC while LRAC is still falling. This is what makes it a natural monopoly: the market is too small for the cost curve to turn up.',
      '<b>One network</b> supplies Q<sub>1</sub> at average cost C<sub>1</sub>, using all the economies of scale.',
      '<b>Two networks</b> would each supply Q<sub>1</sub>/2, where average cost is higher. Duplicated track pushes average cost up, so fares must rise.',
      '<b>Allocative efficiency</b> (P = MC) is at a quantity where the price is below average cost, so the network makes a loss and needs a subsidy to fund off-peak services.'
    ],
    draw(c) {
      c.curve(LRAC, 'ac', 0, 16, 132, 'LRAC', 70);
      c.curve(MCV, 'mc', 1, 8, 132, 'LRMC', 50);
      c.curve(D, 'ar', 2, 8, 128, 'D', 12);
      c.dash(q1, LRAC(q1), 3); c.dot(q1, LRAC(q1), 3);
      c.tag(q1, 0, 'Q₁', 3, 0, 14); c.tag(0, LRAC(q1), 'C₁', 3, -14, 4);
      c.dash(q2, LRAC(q2), 4); c.dot(q2, LRAC(q2), 4);
      c.tag(q2, 0, 'Q₁/2', 4, 0, 14); c.tag(0, LRAC(q2), 'C₂', 4, -14, 4);
      c.dot(qmc, MCV(), 5); c.dot(qmc, LRAC(qmc), 5);
      c.tag(qmc, MCV(), 'P = MC', 5, -6, 16);
      c.tag(qmc, LRAC(qmc), 'AC above P', 5, -10, -10);
    }
  });
  makeQuiz('nmquiz', [
    { q: 'Which is the best definition of a natural monopoly?', options: ['A firm owned by the state', 'One firm can supply the whole market at a lower average cost than two or more firms because LRAC keeps falling over the range of demand', 'A firm with legal barriers that block entry', 'A firm with a large market share'], answer: 1, why: 'The idea is about the cost structure, not ownership, market share or barriers.' },
    { q: 'Why would two rail networks raise average cost?', options: ['Each would have to pay higher wages', 'Fixed costs of track and stations would be duplicated and spread over fewer passengers each', 'Marginal cost would be higher for each passenger', 'Demand would fall'], answer: 1, why: 'Duplicated fixed costs spread over less output push average cost up, which means higher fares.' },
    { q: 'How should the transport secretary\'s support for private sector involvement be used?', options: ['As proof competition would lower costs', 'As a viewpoint from someone with a stake, which shows government sees part of the network as contestable', 'It should be ignored', 'As evidence the network is a natural monopoly'], answer: 1, why: 'Evaluation marks reward recognising viewpoints and being critical of the evidence.' },
    { q: 'Which part of the rail industry fits the natural monopoly definition least well?', options: ['The track', 'The stations', 'Train operating companies', 'The whole network'], answer: 2, why: 'Train operators already compete to run services on the lines. The infrastructure is where the cost structure applies.' }
  ]);
})();
