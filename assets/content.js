/* ===== content.js : Start-here guide and formula sheet ===== */
(function () {
'use strict';
const cov = [
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
 <h2>Welcome, Vivek 👋 <span class="chip lec">OEC7012 · Modules 4–6</span></h2>
 <p>This is a hands-on lab for the three modules the end-sem leans on. Every card has the same rhythm: <b>🧒 plain-words explanation → formula in Dr. Pyne's notation → ⏱ exam tip → a "load lecture example" button → sliders to play with</b>. Slide numbers are reproduced exactly where the slides print them.</p>
 <div class="grid3">
  <div class="box feyn"><b>M4 · System reliability</b><br>RBD builder, series circuit, k-out-of-n (rocket 3-of-4 = 0.9977), element vs unit redundancy, standby, bridge, 2-unit Markov, live R(t) and Monte Carlo.<br><br><a class="btn sm" href="#tab-m4">open M4 →</a></div>
  <div class="box good"><b>M5 · Maintainability &amp; availability</b><br>M(t) with μ, MTTR and MTBF from data, Ai / Aa / Ao, animated up-down timeline, R–M trade-off, 8 DFM factors, preventive maintenance.<br><br><a class="btn sm" href="#tab-m5">open M5 →</a></div>
  <div class="box tip"><b>M6 · FMECA · FTA · ETA</b><br>Sortable FMECA worksheet (CRN, RPN), fault-tree builder with cut sets and auto-RBD, event-tree builder with the IEC slide example, and a three-way comparison.<br><br><a class="btn sm" href="#tab-m6">open M6 →</a></div>
 </div>
 <h3>How to read the labels</h3>
 <p>${CH.lec} the numbers are printed on Dr. Pyne's slides. ${CH.mse} the number comes from the SH 2026 mid-sem solution. ${CH.demo} I made the numbers up so you can experiment — never quote them as "official". ${CH.pred} a syllabus topic where the slides are thin, so the formula is the textbook one.</p>
 <h3>Preset results you can check in 30 seconds</h3>
 <div class="tblwrap"><table class="cover"><tr><th>Where</th><th>Preset</th><th>Expected</th></tr>
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
  <li>L6 "Parallel (Example 2)": (0.999)(0.99)(0.9) is <b>0.8901</b>; the slide prints 0.889.</li>
  <li>L6 rocket: the second term is C(4,4)·0.98⁴ (the slide types 4C3 again — typo); sum 0.9977.</li>
  <li>L8 milling machine: the slide rounds μ to 0.1453 before using it (M(5) = 0.5164; unrounded 84/578 gives 0.5165). Tick or untick the "round μ" box in 5.1 to see both.</li>
  <li>L11 ETA slide: the frequencies on rows 2 and 3 are swapped (7.9·10⁻⁶ and 8.0·10⁻⁵). Computed correctly: uncontrolled fire with alarm 8.0·10⁻⁵, controlled fire with no alarm 7.9·10⁻⁶.</li>
  <li>L9 prints the achieved availability with MTMA in one slide and MTBM in the next; they are the same thing here (mean time between maintenance actions).</li>
 </ul>
 <h3>Syllabus coverage (OEC7012 Modules 4–6)</h3>
 <div class="tblwrap"><table class="cover"><tr><th>Mod.</th><th>Syllabus topic</th><th>Where in the simulator</th><th>Status</th></tr>${cov.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td class="${/^covered$/.test(r[3]) ? 's-yes' : ''}">${r[3]}</td></tr>`).join('')}</table></div>
 <p class="src">Not simulated (text only): the MIL-STD / SAE history timelines of RCM, software maintainability, wind-turbine RAM case study (the Monte Carlo idea is in 4.1 and 5.5), the 13-state Markov paper (only its R(t) table).</p>
</article>`;

$('#tab-sheet').innerHTML = `
<article class="card">
 <h2>Formula sheet — Modules 4, 5, 6 <span class="chip lec">teacher's notation</span></h2>
 <div class="grid2">
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
