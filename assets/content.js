/* ===== content.js : Start-here guide and formula sheet ===== */
(function () {
'use strict';
const cov = [
  ['M1', 'Probability: standard definitions and concepts; rules for combining probabilities; mutually exclusive, complementary, independent events', '1.1 interactive Venn (MSE Q2a), 1.2 independent events &amp; series/parallel via complements', 'covered'],
  ['M1', 'Conditional probability, simultaneous occurrence of events', '1.1 P(B|A), 1.3 tree diagram (beads, product rule)', 'covered'],
  ['M1', "Bayes' theorem", '1.4 Bayes tree + table (MSE Q2b, robot, two-bag example), Monte Carlo', 'covered'],
  ['M1', 'Statistics &amp; distributions used in reliability (mean, median, variance; discrete and continuous pdf/cdf)', '1.5 central tendency &amp; spread from data, 1.6 binomial &amp; Poisson, 1.7 normal, uniform, CLT', 'covered'],
  ['M2', 'Reliability definitions; importance; quality assurance and reliability', '2.1 definitions deck, objectives, history, QC / QA / QE, gurus, 16-question self-test', 'covered (text + quiz)'],
  ['M2', 'Reliability functions f, F, R, h', '2.3 pdf / cdf / R / h for exponential, Weibull, normal, log-normal, uniform with h = f/R and R = exp(−∫h) check', 'covered'],
  ['M2', 'Causes and modes of failures; load–strength', '2.1 failure types / causes / modes, 2.2 load–strength interference with ageing + Monte Carlo', 'covered'],
  ['M2', 'Bathtub curve', '2.6 interactive composite bathtub (MSE Q2d), burn-in, Monte Carlo, Nowlan &amp; Heap patterns', 'covered (parameters demo)'],
  ['M2', 'Failure data analysis: failure density, MTTF, MTBF', '2.4 empirical hazard / density table + fleet Monte Carlo, 2.5 MTTF · MTBF · MTTR · availability', 'covered'],
  ['M2', 'Quality tools (control charts, FMEA, software)', '2.7 Pareto, 2.8 fishbone, 2.9 X̄ / individuals control charts + ARL; FMEA is in 6.1–6.2; reliability software not simulated', 'covered (check sheet, scatter, flow chart: text only)'],
  ['M3', 'Hazard rate, constant hazard, exponential', '3.1 exponential with MSE Q2c (λ, R(8000) = 0.527, MTTF 12 500 h), memoryless test', 'covered'],
  ['M3', 'Hazard models: constant, linearly increasing, time-dependent', '3.5 any h(t) → R(t) → MTTF (constant, linear, Rayleigh, mixed)', 'covered'],
  ['M3', 'Weibull model and distribution MTTF', '3.2 explorer, 3.3 calculator (B10, conditional R, PM), 3.4 median-rank plotting, 3.6 normal / log-normal comparison', 'covered'],
  ['M4', 'Series, parallel, mixed configurations', '4.1 RBD builder (nested series / parallel groups), 4.2 series circuit', 'covered'],
  ['M4', 'k-out-of-n structure', '4.3 binomial table + curve, also available as a group type in 4.1', 'covered'],
  ['M4', 'Complex systems', '4.6 bridge network (conditioning + all 32 states + path/cut sets)', 'covered (textbook demo)'],
  ['M4', 'Element redundancy, unit redundancy', '4.4 side-by-side with diagrams', 'covered'],
  ['M4', 'Standby redundancy', '4.5 standby vs active, switch reliability, Monte Carlo', 'covered (formulas from textbooks; slides are thin)'],
  ['M4', 'Markov analysis', '4.7 2-unit state diagram with R(t), A(t), RK4 + Monte Carlo; 4.8 example-PDF table', 'covered (2-unit rates are demo; the 13-state paper is shown as a table only)'],
  ['M5', 'Maintainability, M(t), MTTR', '5.1 (milling machine 6.881 h, μ 0.1453), log-normal comparison, Monte Carlo', 'covered'],
  ['M5', 'System downtime', '5.3 MIL-HDBK-472 components with stacked bar', 'covered (demo numbers)'],
  ['M5', 'Reliability and maintainability trade-off', '5.6 RAM table, heat map, design-alternative cost comparison', 'covered'],
  ['M5', 'Design for maintainability (factors, fault isolation / self-diagnostics, standardisation, modularisation, accessibility, repair vs replacement)', '5.7 eight factors what-if lab, rules checklist, repair-vs-replace', 'covered (what-if percentages are my assumptions)'],
  ['M5', 'Availability: qualitative aspects and measures (Ai, Aa, Ao; MTBM, MMT, MDT)', '5.2 MTBF / MTTR from data, 5.4 calculator, 5.5 animated up/down timeline', 'covered'],
  ['M5', 'Preventive maintenance', '5.8 Weibull PM example from L5', 'covered'],
  ['M6', 'FMEA, FMECA, severity / criticality analysis, examples', '6.1 concepts, 6.2 worksheet (CRN = S×O from L11, RPN = S×O×D from L6, MIL-STD-1629 Cm)', 'covered'],
  ['M6', 'Fault tree construction, symbols, analysis', '6.3 AND / OR / voting / XOR, basic and undeveloped events, top-event P, cut sets, importance', 'covered (transfer and priority-AND gates are described, not simulated)'],
  ['M6', 'Functional RBD development from a fault tree', '6.3 auto-converted RBD under every tree', 'covered'],
  ['M6', 'Event tree analysis', '6.4 editable tree with the IEC 60300-3-9 slide example', 'covered'],
  ['M6', 'FTA vs ETA vs RBD', '6.5 side-by-side with live numbers', 'covered']
];
$('#tab-guide').innerHTML = `
<article class="card">
 <h2>Welcome, Vivek 👋 <span class="chip lec">OEC7012 · Modules 1–6</span></h2>
 <p>This is a hands-on lab for all six modules of the course (OEC7012). Every card has the same rhythm: <b>🧒 plain-words explanation → formula in Dr. Pyne's notation → ⏱ exam tip → a "load lecture example" button → sliders to play with</b>. Slide numbers are reproduced exactly where the slides print them.</p>
 <div class="grid3">
  <div class="box feyn"><b>M1 · Probability</b><br>Interactive Venn (MSE Q2a: 0.6, 0.5, 0.3 → union 0.8), independent events, tree diagram, Bayes (MSE Q2b), mean / median / variance, binomial &amp; Poisson, normal &amp; CLT.</div>
  <div class="box feyn"><b>M2 · Reliability concepts</b><br>Definitions &amp; self-test, load–strength, f / F / R / h, empirical hazard, MTTF / MTBF / MTTR, bathtub curve (MSE Q2d), Pareto, fishbone, control charts.</div>
  <div class="box feyn"><b>M3 · Hazard models &amp; Weibull</b><br>Exponential (MSE Q2c), Weibull explorer and calculator (β = 2, η = 1000), median-rank plotting, linear / Rayleigh hazards, log-normal vs normal.</div>
 </div>
 <div class="grid3">
  <div class="box feyn"><b>M4 · System reliability</b><br>RBD builder, series circuit, k-out-of-n (rocket 3-of-4 = 0.9977), element vs unit redundancy, standby, bridge, 2-unit Markov, live R(t) and Monte Carlo.<br><br><a class="btn sm" href="#tab-m4">open M4 →</a></div>
  <div class="box good"><b>M5 · Maintainability &amp; availability</b><br>M(t) with μ, MTTR and MTBF from data, Ai / Aa / Ao, animated up-down timeline, R–M trade-off, 8 DFM factors, preventive maintenance.<br><br><a class="btn sm" href="#tab-m5">open M5 →</a></div>
  <div class="box tip"><b>M6 · FMECA · FTA · ETA</b><br>Sortable FMECA worksheet (CRN, RPN), fault-tree builder with cut sets and auto-RBD, event-tree builder with the IEC slide example, and a three-way comparison.<br><br><a class="btn sm" href="#tab-m6">open M6 →</a></div>
 </div>
 <div class="box good"><b>📄 Printable notes:</b> the 32-page infographic guide for all six modules is on the <a href="#tab-pdf">PDF Notes</a> tab (view in the page or <a href="assets/RE_Infographics.pdf" target="_blank" rel="noopener">open / download the PDF</a>).</div>
 <h3>How to read the labels</h3>
 <p>${CH.lec} the numbers are printed on Dr. Pyne's slides. ${CH.mse} the number comes from the SH 2026 mid-sem solution. ${CH.demo} I made the numbers up so you can experiment — never quote them as "official". ${CH.pred} a syllabus topic where the slides are thin, so the formula is the textbook one.</p>
 <h3>Preset results you can check in 30 seconds</h3>
 <div class="tblwrap"><table class="cover"><tr><th>Where</th><th>Preset</th><th>Expected</th></tr>
  <tr><td>M1 · 1.1</td><td>Venn: P(A) 0.6, P(B) 0.5, P(A∩B) 0.3 (MSE Q2a)</td><td>P(A∪B) = 0.8, P(A|B) = 0.6, P(B|A) = 0.5, independent (0.6×0.5 = 0.3)</td></tr>
  <tr><td>M1 · 1.4</td><td>Bayes: robot example; two-bag example</td><td>0.08933 (slide) / 0.08934; bag B 10/19 = 0.5263</td></tr>
  <tr><td>M1 · 1.2</td><td>8 parts × 0.99 in series; one weak part 0.5</td><td>0.9227; 0.4660</td></tr>
  <tr><td>M1 · 1.6</td><td>rocket 3-of-4 as a binomial; Poisson P(X = 0), mean 2</td><td>0.9977; 0.1353</td></tr>
  <tr><td>M2 · 2.2</td><td>load 300 ± 40, strength 450 ± 30 (DEMO)</td><td>z = 3, R = 0.99865</td></tr>
  <tr><td>M2 · 2.3</td><td>exponential λ = 0.00008 at 8000 h</td><td>R = 0.5273, MTTF 12 500, h = λ</td></tr>
  <tr><td>M2 · 2.4</td><td>1000 bulbs: 2, 3, 5 failures in 3, 2, 3 months</td><td>h = 0.000667, 0.0015, 0.00168 (rising)</td></tr>
  <tr><td>M2 · 2.5</td><td>life test 7, 12, 19, 29, 41, 67 h</td><td>MTTF = 175/6 = 29.17 h, λ = 0.03429</td></tr>
  <tr><td>M2 · 2.9</td><td>control chart, no shift</td><td>P(signal) 0.0027, ARL<sub>0</sub> = 370.4</td></tr>
  <tr><td>M3 · 3.1</td><td>MSE Q2c: 12 % in 1500 h, mission 8000 h</td><td>λ = 8×10⁻⁵, R = 0.527, MTTF 12 500 h (exact λ: R = 0.506)</td></tr>
  <tr><td>M3 · 3.2</td><td>Weibull β = 2, η = 1000 h</td><td>MTTF 886.2, median 832.6, B10 324.6, R(η) = 0.368</td></tr>
  <tr><td>M3 · 3.3</td><td>tire β = 2.5, η = 8000 km, 12 000 tires at 5000 km; β = ½, η = 2000; β = ⅓, η = 16 000</td><td>3 188 fail; MTTF 4000 (R(4000) = 0.243); 96 000</td></tr>
  <tr><td>M3 · 3.4</td><td>exponential test (exact median ranks)</td><td>10.91 … 89.09 %; 1/λ̂ ≈ 31 h</td></tr>
  <tr><td>M4 · 4.1</td><td>two missiles 0.92 in parallel (MSE)</td><td>0.9936</td></tr>
  <tr><td>M4 · 4.3</td><td>rocket, 3-of-4, R = 0.98</td><td>0.9977</td></tr>
  <tr><td>M4 · 4.2</td><td>circuit: λ<sub>s</sub> = 0.0001</td><td>R(10) = 0.999, R(100) = 0.990, R(1000) = 0.905</td></tr>
  <tr><td>M5 · 5.1</td><td>milling machine 84 repairs, 578 h</td><td>MTTR = 6.881 h, μ = 0.1453, M(1) = 0.1352, M(5) = 0.5164, M(20) = 0.9453</td></tr>
  <tr><td>M5 · 5.2</td><td>uptimes 50, 30, 60, 46 days</td><td>MTBF = 46.5 days</td></tr>
  <tr><td>M5 · 5.8</td><td>Weibull β = 2, η = 1000, PM at 300 h</td><td>3 023 → 1 647 failures, saves 1 376</td></tr>
  <tr><td>M6 · 6.2</td><td>flash-drum FMECA rows</td><td>CRN 30, 32, 27, 6, 21</td></tr>
  <tr><td>M6 · 6.3</td><td>missiles / rocket fault trees</td><td>P(top) 0.0064 → R 0.9936; 0.00234 → R 0.9977</td></tr></table></div>
 <h3>Things the simulator caught on the slides (write the correct version in the exam)</h3>
 <ul>
  <li>L3 Weibull slide: "the PDF becomes normal when β is 1" — wrong: β = 1 is the <b>exponential</b>; the bell shape appears for β ≈ 3–4.</li>
  <li>L3 Nowlan &amp; Heap bathtub slide: pattern F is printed as 69 % in one version; 68 % makes the six patterns sum to 100 %.</li>
  <li>M1 robot Bayes example: the slide gives 0.08933; exact arithmetic gives 0.08934.</li>
  <li>MSE Q2c: the model answer divides 12 % by 1500 h (λ = 8×10⁻⁵). Strictly, R(1500) = 0.88 gives λ = −ln 0.88/1500 = 8.52×10⁻⁵ and R(8000) = 0.506. Follow the model answer in the exam; tick "exact" in 3.1 to compare.</li>
  <li>L2 exponential life test: the slide's graph reads about 33 h by eye; the numerical fit gives 31 h (and the total-time-on-test MTTF is 29.2 h). Differences of this size are normal for graphical estimates.</li>
  <li>L6 "Parallel (Example 2)": (0.999)(0.99)(0.9) is <b>0.8901</b>; the slide prints 0.889.</li>
  <li>L6 rocket: the second term is C(4,4)·0.98⁴ (the slide types 4C3 again — typo); sum 0.9977.</li>
  <li>L8 milling machine: the slide rounds μ to 0.1453 before using it (M(5) = 0.5164; unrounded 84/578 gives 0.5165). Tick or untick the "round μ" box in 5.1 to see both.</li>
  <li>L11 ETA slide: the frequencies on rows 2 and 3 are swapped (7.9·10⁻⁶ and 8.0·10⁻⁵). Computed correctly: uncontrolled fire with alarm 8.0·10⁻⁵, controlled fire with no alarm 7.9·10⁻⁶.</li>
  <li>L9 prints the achieved availability with MTMA in one slide and MTBM in the next; they are the same thing here (mean time between maintenance actions).</li>
 </ul>
 <h3>Syllabus coverage (OEC7012 Modules 1–6)</h3>
 <div class="tblwrap"><table class="cover"><tr><th>Mod.</th><th>Syllabus topic</th><th>Where in the simulator</th><th>Status</th></tr>${cov.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td class="${/^covered$/.test(r[3]) ? 's-yes' : ''}">${r[3]}</td></tr>`).join('')}</table></div>
 <p class="src">Not simulated (text only): the MIL-STD / SAE history timelines of RCM, software maintainability, wind-turbine RAM case study (the Monte Carlo idea is in 4.1 and 5.5), the 13-state Markov paper (only its R(t) table).</p>
</article>`;

$('#tab-sheet').innerHTML = `
<article class="card">
 <h2>Formula sheet — Modules 1 to 6 <span class="chip lec">teacher's notation</span></h2>
 <div class="grid3">
 <div>
  <h3>M1 · Probability</h3>
  <div class="box formula">P(A∪B) = P(A) + P(B) − P(A∩B) · P(A') = 1 − P(A) · P(B|A) = P(A∩B)/P(A) · independent: P(A∩B) = P(A)P(B)<br>Total probability P(E) = ΣP(E|A<sub>i</sub>)P(A<sub>i</sub>) · Bayes P(A<sub>i</sub>|E) = P(E|A<sub>i</sub>)P(A<sub>i</sub>)/P(E)<br>Binomial P(X=k) = C(n,k)p<sup>k</sup>(1−p)<sup>n−k</sup> · Poisson P(X=k) = e<sup>−m</sup>m<sup>k</sup>/k! · normal z = (x − μ)/σ</div>
  <div class="box warn"><b>Traps:</b> mutually exclusive ≠ independent · do not add when events overlap · Bayes: posterior needs the <i>total</i> in the denominator · σ² divides by n (population) or n−1 (sample).</div>
  <h3>M2 · Reliability concepts</h3>
  <div class="box formula">R(t) = 1 − F(t) = ∫<sub>t</sub><sup>∞</sup>f · f = −dR/dt · h(t) = f/R · R(t) = exp(−∫h) · MTTF = ∫R dt<br>MTBF = total operating time / failures · MTTR = outage / repairs · A = up/(up + down)<br>Load–strength: R = Φ[(μ<sub>S</sub> − μ<sub>L</sub>)/√(σ<sub>S</sub>² + σ<sub>L</sub>²)] · bathtub: β &lt; 1, = 1, &gt; 1 · X̄ limits μ ± 3σ/√n</div>
  <h3>M3 · Hazard models</h3>
  <div class="box formula">Exponential: R = e<sup>−λt</sup>, MTTF = 1/λ, R(MTTF) = 0.368, memoryless<br>Linear: h = a + bt ⇒ R = exp(−at − bt²/2) · Weibull: R = exp[−((t−γ)/η)<sup>β</sup>], MTTF = γ + ηΓ(1+1/β), B10 = η(−ln 0.9)<sup>1/β</sup><br>R(t|s) = R(s+t)/R(s) · median ranks (j−0.3)/(n+0.4) · Weibull paper: slope = β</div>
 </div>
 <div>
  <h3>M4 · System reliability</h3>
  <div class="box formula">Series: R<sub>s</sub> = ΠR<sub>i</sub> ≤ min R<sub>i</sub>; exp.: R<sub>s</sub> = e<sup>−(Σn<sub>i</sub>λ<sub>i</sub>)t</sup><br>Parallel: R<sub>s</sub> = R<sub>1</sub>+R<sub>2</sub>−R<sub>1</sub>R<sub>2</sub> = 1−Π(1−R<sub>i</sub>) ≥ max R<sub>i</sub><br>k-of-n: R<sub>s</sub> = Σ<sub>i=k</sub><sup>n</sup> C(n,i)R<sup>i</sup>(1−R)<sup>n−i</sup>; k=n series, k=1 parallel<br>Series-parallel (4 units 0.94): [1−(1−R)²]² = 0.9928<br>Standby (perfect switch): e<sup>−λt</sup>(1+λt), MTTF = 2/λ<br>Markov: R(t) = Σ P<sub>up</sub>(t); absorbing failed state ⇒ R, repair out of it ⇒ A</div>
  <div class="box warn"><b>Traps:</b> never add reliabilities in series · hot-parallel formula ≠ cold standby · k-of-n sum starts at i = k · state independence · say "R = 1 − (both fail)" for "at least one hits" (MSE: 0.9936).</div>
  <h3>M5 · Maintainability &amp; availability</h3>
  <div class="box formula">M(t) = 1 − e<sup>−μt</sup>, μ = 1/MTTR = (number of repairs)/(total repair hours)<br>MTBF = Σ uptimes / number of failures (46.5 d)<br>A<sub>i</sub> = MTBF/(MTBF+MTTR) · A<sub>a</sub> = MTBM/(MTBM+MMT) · A<sub>o</sub> = MTBM/(MTBM+MMT+MLDT) = MTBM/(MTBM+MDT)<br>MLDT = LDT + ADT · A<sub>i</sub> ≥ A<sub>a</sub> ≥ A<sub>o</sub><br>Eight DFM factors: standardisation · modularisation · functional packaging · interchangeability · accessibility · malfunction annunciation · fault isolation · identification</div>
  <div class="box warn"><b>Traps:</b> maintainability ≠ maintenance · μ = repairs per hour (84/578) · divide MTBF by failures, not intervals · write A<sub>i</sub>, not just "A".</div>
 </div>
 <div>
  <h3>M6 · FMECA, FTA, ETA</h3>
  <div class="box formula">FMEA qualitative, FMECA quantitative criticality (MIL-STD-1629, "C" = criticality)<br>CRN = S × O (L11 example: 30, 32, 27, 6, 21) · RPN = S × O × D<br>FTA (Bell Labs 1962, Boeing): top-down, failure space<br>OR ↔ RBD series: R<sub>s</sub> = R<sub>A</sub>R<sub>B</sub>R<sub>C</sub> · AND ↔ RBD parallel: R<sub>s</sub> = R<sub>A</sub>+R<sub>B</sub>−R<sub>A</sub>R<sub>B</sub><br>AND: P = ΠP<sub>i</sub> · OR: P = 1−Π(1−P<sub>i</sub>) · voting OR ↔ k-out-of-n<br>Symbols: rectangle (event), circle (basic), diamond (undeveloped), AND, OR, transfer, priority AND, XOR<br>ETA: inductive, initiating event + barriers, path P = Π branches, frequency = f × P<br>FTA: how did it fail? ETA: what happens next? RBD: which paths still work?</div>
  <div class="box warn"><b>Traps:</b> FMEA ≠ FMECA · RPN alone doesn't choose the maintenance strategy · OR in failure space is series in success space · FTA and ETA are not the same · draw the tree, don't just list causes.</div>
  <h3>Every numerical: write it like this</h3>
  <div class="box tip">1) name the model and assumptions · 2) write the formula · 3) substitute with units · 4) box the answer · 5) one line of meaning ("13.52% chance of repair in 1 h").</div>
 </div></div>
</article>`;
})();
