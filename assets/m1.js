/* ===== m1.js : Module 1 — Probability theory ===== */
(function () {
'use strict';
const root = $('#tab-m1');
root.innerHTML = `
<div class="subnav">
 <a href="#m1-venn">1.1 Venn &amp; rules</a><a href="#m1-ind">1.2 Independent events</a><a href="#m1-tree">1.3 Tree diagram</a><a href="#m1-bayes">1.4 Conditional &amp; Bayes</a>
 <a href="#m1-cen">1.5 Mean · median · variance</a><a href="#m1-disc">1.6 Binomial &amp; Poisson</a><a href="#m1-cont">1.7 Normal &amp; uniform</a>
</div>

${card('m1-venn', '1.1', 'Probability basics — union, conditional, independence (interactive Venn)', `
 <div class="box feyn"><b>🧒 Plain words:</b> Probability is a number from 0 ("never") to 1 ("sure") that says how likely something is. Draw a box for <i>everything that can happen</i> (area = 1). Event A is a blob inside, event B is another blob; the bigger the blob, the likelier. <b>OR</b> = anywhere in A <i>or</i> B (don't count the overlap twice!). <b>AND</b> = only the overlap. <b>"Given B"</b> = you already know you are inside B, so the new "universe" is just B and you ask what share of B is also A.</div>
 <div class="box formula">0 ≤ P(A) ≤ 1, P(A) = n/N, P(A) = 1 − P(A<sup>c</sup>)<br>
 Addition theorem: P(A ∪ B) = P(A) + P(B) − P(A ∩ B) &nbsp; (the slides write P(A+B))<br>
 Mutually exclusive (cannot occur together): P(A ∩ B) = 0 ⇒ P(A ∪ B) = P(A) + P(B) — "see OR, think ADD"<br>
 Conditional: P(A | B) = P(A ∩ B) / P(B), P(B | A) = P(A ∩ B) / P(A) &nbsp;⇒&nbsp; P(A ∩ B) = P(A)·P(B | A) = P(B)·P(A | B)<br>
 Independent: P(A ∩ B) = P(A)·P(B) (the slides write P(AB)) — "see AND, think MULTIPLY"</div>
 <div class="box tip"><b>Exam tip:</b> (1) write the formula, (2) substitute, (3) compute. For MSE Q2a: 0.6 + 0.5 − 0.3 = 0.8, then 0.3/0.5 = 0.6 and 0.3/0.6 = 0.5. Note P(A)P(B) = 0.6 × 0.5 = 0.30 = P(A ∩ B), so these two events are in fact <i>independent</i> — that is why P(A | B) = P(A) = 0.6.</div>
 <div class="row"><button class="btn lec" id="v-mse">Load MSE Q2a (0.6, 0.5, 0.3)</button><button class="btn lec" id="v-ind">Lecture: two missiles 0.85, independent</button><button class="btn" id="v-ex">DEMO: mutually exclusive</button><button class="btn" id="v-dep">DEMO: dependent events</button></div>
 <div class="grid2"><div>
  ${ctl('v-a', 'P(A)', 0, 1, 0.01, 0.6, '')}${ctl('v-b', 'P(B)', 0, 1, 0.01, 0.5, '')}${ctl('v-ab', 'P(A ∩ B)', 0, 1, 0.01, 0.3, '')}
  <div id="v-note" class="src"></div>
  <div class="outs">${outBox('v-un', 'P(A ∪ B)')}${outBox('v-ab1', 'P(A | B)')}${outBox('v-ba1', 'P(B | A)')}${outBox('v-ind1', 'independent?')}${outBox('v-ac', 'P(A<sup>c</sup>)')}${outBox('v-no', 'P(neither)')}</div>
 </div><div><div class="svgbox" id="v-svg"></div>
  <div class="row"><button class="btn fill" id="v-mc">▶ Monte Carlo (20 000 trials)</button><span id="v-mcout" class="mono"></span></div></div></div>
 <span class="src">Lecture L2: "Probability fundamentals", "Laws / rules of probability" (additive: mutually exclusive; multiplicative: independent), P(A+B) = P(A)+P(B)−P(A)P(B). MSE Q1a (P(A∩B) = P(A)P(B)) and Q2a (0.6, 0.5, 0.3 → 0.8, 0.6, 0.5).</span>
`, CH.mse + ' ' + CH.lec)}

${card('m1-ind', '1.2', 'Independent events — at least one, exactly k, all (and the outcome tree)', `
 <div class="box feyn"><b>🧒 Plain words:</b> If events don't influence each other, multiply for "this <i>and</i> that". "At least one" is easiest the back way: 1 − (chance that <i>none</i> happens). In reliability this is the whole difference between a <b>series</b> system (all must work) and a <b>parallel</b> one (at least one must work).</div>
 <div class="box formula">P(A ∩ B ∩ C) = P(A)·P(B)·P(C) &nbsp;|&nbsp; P(at least one) = 1 − Π(1 − p<sub>i</sub>) &nbsp;|&nbsp; P(A + B) = P(A) + P(B) − P(A)P(B)<br>
 Tree rules: <b>multiply</b> along the branches (across), <b>add</b> the leaves you want (down); all leaves add to 1.<br>
 Reliability reading: all succeed = series R<sub>s</sub> = ΠR<sub>i</sub>; at least one succeeds = parallel R<sub>s</sub> = 1 − Π(1 − R<sub>i</sub>)</div>
 <div class="box tip"><b>Exam tip:</b> "at least one" ⇒ <i>complement</i>. MSE Q3a: P(both fail) = 0.08 × 0.08 = 0.0064, so P(at least one hit) = 1 − 0.0064 = 0.9936. Say "independently" out loud — it is what lets you multiply.</div>
 <div class="row"><button class="btn lec" id="i-stu">Lecture: Fatimah ½, Emily ⅔, Rani ¾ (test)</button><button class="btn lec" id="i-mis">Lecture: salvo of two missiles, R = 0.85</button><button class="btn lec" id="i-mse">MSE Q3a: missiles R = 0.92</button><button class="btn lec" id="i-sh8">Lecture: 8 parts of 0.99 in series</button><button class="btn lec" id="i-sh1">…with one weak part 0.5</button></div>
 <label>Probability that each event happens (decimals or fractions, comma-separated, up to 8)<input type="text" id="i-p" data-live value="1/2, 2/3, 3/4"></label>
 ${ctl('i-k', 'k = "at least k happen"', 1, 8, 1, 2, '')}
 <div class="outs">${outBox('i-all', 'all happen (series)')}${outBox('i-one', 'exactly one')}${outBox('i-atk', 'at least k')}${outBox('i-atl', 'at least one (parallel)')}${outBox('i-none', 'none happen')}${outBox('i-mc', 'Monte Carlo: at least k')}</div>
 <div class="row"><button class="btn fill" id="i-run">▶ Simulate 50 000 trials</button></div>
 <canvas class="plot" id="i-plot" style="height:220px"></canvas>
 <div class="tblwrap"><table id="i-tree"></table></div>
 <span class="src">Lecture L2 slides: test example ⇒ (a) only one passes = 1/4, (b) at least two = 17/24, (c) at least one = 23/24; missiles "P(at least one hit) = 1 − 0.0225 = 0.9775" (R = 0.85); L5: eight 0.99 parts give 0.92, one 0.5 part gives 0.47. P = pass, F = fail (success / failure).</span>
`, CH.lec + ' ' + CH.mse)}

${card('m1-tree', '1.3', 'Tree diagram — multiply across, add down (the two-beads example)', `
 <div class="box feyn"><b>🧒 Plain words:</b> A tree draws every "first this, then that" story. Each path is one possible story. Its chance is the <b>product</b> of the numbers on its branches. Want "same colour twice"? Add the paths that end that way. Check yourself: all paths together must add to 1.</div>
 <div class="box formula">P(RR) = P(R<sub>1</sub>)·P(R<sub>2</sub> | R<sub>1</sub>) ... P(same colour) = P(RR) + P(BB)<br>with replacement: (R² + B²)/N² &nbsp;|&nbsp; without replacement: [R(R−1) + B(B−1)] / [N(N−1)]</div>
 <div class="box tip"><b>Exam tip:</b> draw the tree first, write the branch probabilities, multiply across, then add. Show the "= 1" check; it earns the last mark and catches slips. Without replacement the second-stage probabilities change — that is conditional probability at work.</div>
 <div class="row"><button class="btn lec" id="t-bead">Lecture: 5 red, 7 blue, with replacement ⇒ 37/72</button><button class="btn" id="t-wo">Same bag, without replacement (DEMO)</button></div>
 <div class="grid2"><div>
  ${ctl('t-r', 'red beads', 1, 20, 1, 5, '')}${ctl('t-bl', 'blue beads', 1, 20, 1, 7, '')}
  <label><input type="checkbox" id="t-rep" data-live checked> put the first bead back (with replacement)</label>
  <div class="outs">${outBox('t-same', 'P(same colour)')}${outBox('t-diff', 'P(different colour)')}${outBox('t-sum', 'sum of all four paths')}</div>
 </div><div><div class="svgbox" id="t-svg"></div></div></div>
 <span class="src">Lecture L2: "5/12 red, 7/12 blue … P(red and red) = 25/144, P(red and blue) = 35/144, P(blue and red) = 35/144, P(blue and blue) = 49/144, probabilities add up to 1 ⇒ P(same colour) = 74/144 = 37/72".</span>
`, CH.lec)}

${card('m1-bayes', '1.4', 'Conditional probability and Bayes\' theorem (prior → posterior)', `
 <div class="box feyn"><b>🧒 Plain words:</b> You start with a belief (the <b>prior</b>). Then you see evidence. Bayes tells you how to update the belief into the <b>posterior</b>. Surprise: a very accurate robot that flags "defective" is usually <i>wrong</i> when defects are very rare, because the huge pile of good items produces more false alarms than the few bad items produce true alarms.</div>
 <div class="box formula">P(A | B) = P(B | A)·P(A) / P(B) &nbsp;(MSE Q2b), P(B) ≠ 0<br>Law of total probability: P(B) = Σ P(B | A<sub>i</sub>)·P(A<sub>i</sub>) &nbsp;⇒&nbsp; P(A<sub>j</sub> | B) = P(B | A<sub>j</sub>)P(A<sub>j</sub>) / Σ P(B | A<sub>i</sub>)P(A<sub>i</sub>)<br>posterior ∝ prior × likelihood; a posterior can become the next prior as more evidence arrives</div>
 <div class="box tip"><b>Exam tip (MSE Q2b, 4 marks):</b> state the theorem in words (2 M), write the formula (1 M), give three applications (1 M): <b>reliability engineering</b> (estimate component / system failure probability from observed data), <b>fault diagnosis</b> (most probable cause of an equipment failure), <b>medical diagnosis</b> (disease given a test result).</div>
 <div class="row"><button class="btn lec" id="b-rob">Lecture: defect-detecting robot (0.98 / 0.99 / 0.1 %)</button><button class="btn lec" id="b-bag">Lecture: bag A (2w,3r) vs bag B (4w,5b)</button><button class="btn" id="b-dem">DEMO: which machine made the bad part?</button><button class="btn" id="b-next">↻ use posterior as next prior</button></div>
 <div class="tblwrap"><table id="b-tbl"></table></div>
 <div class="outs" id="b-outs"></div>
 <div class="grid2"><div><div class="svgbox" id="b-svg"></div></div><div>
  <b>Natural-frequency picture</b> <span class="src">same numbers as counts, per N items</span>
  ${ctl('b-N', 'N items', 1000, 1000000, 1000, 100000, '')}<div id="b-freq"></div>
  <div class="row"><button class="btn fill" id="b-mc">▶ Monte Carlo</button><span id="b-mcout" class="mono"></span></div></div></div>
 <h3>How the answer depends on the prior (hypothesis 1)</h3>
 <canvas class="plot" id="b-plot" style="height:230px"></canvas>
 <span class="src">Lecture L2 (robot): P(says defective | defective) = 0.98, P(says defective | not defective) = 1 − 0.99 = 0.01, P(defective) = 0.001 ⇒ P(says defective) = 0.01097 ⇒ P(defective | says defective) = 0.00098/0.01097 = 0.0893 ("less than 10 per cent"; the slide prints 0.08933, exact 0.08934). Bags: P(B | white) = (1/2)(4/9) / (38/90) = 10/19.</span>
`, CH.mse + ' ' + CH.lec + ' ' + CH.demo)}

${card('m1-cen', '1.5', 'Mean, median, mode and spread (central tendency)', `
 <div class="box feyn"><b>🧒 Plain words:</b> A pile of numbers needs a "typical" value and a "how wobbly" value. <b>Mean</b> = fair-share average. <b>Median</b> = the middle one when sorted (doesn't care about extreme outliers). <b>Mode</b> = the most common. <b>Variance</b> = the average squared distance from the mean; <b>σ</b> is its square root, back in the original units.</div>
 <div class="box formula">μ = Σx<sub>i</sub>/N &nbsp;|&nbsp; σ² = Σ(x<sub>i</sub> − μ)²/N (population) &nbsp;|&nbsp; s² = Σ(x<sub>i</sub> − x̄)²/(n − 1) (sample)<br>σ = √σ² &nbsp;|&nbsp; continuous: μ = ∫ x f(x)dx, σ² = ∫ (x − μ)² f(x)dx</div>
 <div class="box tip"><b>Exam tip:</b> say whether the data is a population (÷N) or a sample (÷(n−1)); a long right tail (typical of life data) drags the mean above the median.</div>
 <div class="row"><button class="btn lec" id="c-life">Lecture data: life test 7, 12, 19, 29, 41, 67 h</button><button class="btn lec" id="c-cyc">Lecture data: cycles to fail 17, 24, 26, 43, 43, 46, 50</button><button class="btn" id="c-skew">DEMO: skewed repair times</button></div>
 <label>Data (any separators)<input type="text" id="c-d" data-live value="7, 12, 19, 29, 41, 67"></label>
 <div class="outs">${outBox('c-n', 'n')}${outBox('c-mean', 'mean')}${outBox('c-med', 'median')}${outBox('c-mode', 'mode')}${outBox('c-var', 'σ² (÷ N)')}${outBox('c-s2', 's² (÷ n−1)')}${outBox('c-sd', 'σ')}</div>
 <canvas class="plot" id="c-plot" style="height:210px"></canvas>
 <span class="src">Data are the L2 life-test and L4 Weibull-plotting numbers. Formulas are from the "Measure of Central Tendency" slide (L5). Statistics themselves are computed live.</span>
`, CH.lec)}

${card('m1-disc', '1.6', 'Discrete distributions — Binomial and Poisson', `
 <div class="box feyn"><b>🧒 Plain words:</b> Discrete = you can <i>count</i> it (0, 1, 2 … failures). <b>Binomial</b>: n independent tries, each succeeds with the same chance p — "how many of my n engines work?". <b>Poisson</b>: events arriving randomly at a steady average rate — "how many failures in 1000 h?". The <b>gaps</b> between Poisson events follow the exponential distribution (the "inverse" of Poisson).</div>
 <div class="box formula">Binomial: P(X = k) = C(n,k) p<sup>k</sup> (1 − p)<sup>n−k</sup>, E[X] = np, Var = np(1 − p) &nbsp;(P(X ≥ k) is the k-out-of-n reliability of Module 4)<br>Poisson: P(X = k) = e<sup>−m</sup> m<sup>k</sup> / k!, m = λt, E[X] = Var = m &nbsp;|&nbsp; P(no failure in t) = e<sup>−λt</sup> = R(t)</div>
 <div class="box tip"><b>Exam tip:</b> "at least k of n" is a binomial <i>sum</i> (k to n). For rare events over a long period use Poisson with m = λt; "time between failures" use exponential.</div>
 <div class="row"><button class="btn lec" id="d-rock">Lecture: rocket, 3 of 4 engines, R = 0.98</button><button class="btn" id="d-pois">DEMO: Poisson, λ = 0.002 /h over 1000 h</button><label style="margin-left:8px"><input type="radio" name="d-mode" value="bin" checked data-live> Binomial</label><label><input type="radio" name="d-mode" value="poi" data-live> Poisson</label></div>
 <div class="grid2"><div id="d-binp">
  ${ctl('d-n', 'n (trials / engines)', 1, 60, 1, 4, '')}${ctl('d-p', 'p (success each)', 0, 1, 0.005, 0.98, '')}</div>
  <div id="d-poip" style="display:none">${ctl('d-lam', 'λ (events per hour)', 0.0001, 0.05, 0.0001, 0.002, '/h')}${ctl('d-t', 't (hours)', 10, 5000, 10, 1000, 'h')}</div>
  <div>${ctl('d-k', 'k', 0, 60, 1, 3, '')}</div></div>
 <div class="outs">${outBox('d-pk', 'P(X = k)')}${outBox('d-le', 'P(X ≤ k)')}${outBox('d-ge', 'P(X ≥ k)')}${outBox('d-mu', 'mean')}${outBox('d-vr', 'variance')}</div>
 <canvas class="plot" id="d-plot" style="height:230px"></canvas>
 <div class="row"><button class="btn fill" id="d-mc">▶ Monte Carlo (20 000 runs)</button><span id="d-mcout" class="mono"></span></div>
 <h3>Discrete vs continuous data (L2)</h3>
 <div class="tblwrap"><table class="cover"><tr><th></th><th>Discrete</th><th>Continuous</th></tr><tr><td>Meaning</td><td>clear gaps between values; can be counted</td><td>any value in a range; measured</td></tr><tr><td>Graph</td><td>bar chart</td><td>histogram / curve</td></tr><tr><td>Examples (slide)</td><td>number of pages, shoe size, people in a race</td><td>film length, temperature, time to run a race</td></tr><tr><td>Distributions (slide)</td><td>Binomial, Poisson</td><td>Normal, Uniform, Exponential</td></tr></table></div>
 <span class="src">Lecture L2: probability-distribution tree (Binomial, Poisson | Normal, Uniform, Exponential); Poisson ↔ exponential slide ("events per unit time" vs "time per event"); L4/L5 binomial reliability for the rocket: R<sub>s</sub> = 4C3(0.98)³(0.02) + (0.98)⁴ = 0.9977.</span>
`, CH.lec + ' ' + CH.demo)}

${card('m1-cont', '1.7', 'Continuous distributions — Normal and Uniform (and the central limit theorem)', `
 <div class="box feyn"><b>🧒 Plain words:</b> For measured quantities (strength, a dimension, a life) we use a smooth curve; <b>area under the curve</b> between two values is the probability. The <b>normal</b> is the bell curve: symmetric around the mean μ, width set by σ. Convert any normal value to a z-score z = (x − μ)/σ and look it up. <b>Uniform</b>: every value in [a, b] equally likely. <b>Central limit theorem</b>: the <i>average</i> of many small independent effects looks bell-shaped, whatever each effect looks like.</div>
 <div class="box formula">Normal: f(x) = (1/σ√2π) exp[−½((x − μ)/σ)²], z = (x − μ)/σ, F(x) = Φ(z) &nbsp;|&nbsp; P(μ ± σ) = 0.6827, P(μ ± 2σ) = 0.9545, P(μ ± 3σ) = 0.9973<br>Uniform on [a, b]: f = 1/(b − a), mean = (a + b)/2, Var = (b − a)²/12<br>Exponential (slides): f(x) = λe<sup>−λx</sup>, F = 1 − e<sup>−λx</sup>, E = 1/λ, E[X²] = 2/λ², Var = 1/λ² → Module 3</div>
 <div class="box tip"><b>Exam tip:</b> sketch the bell, shade the asked region, convert to z, then use Φ(−z) = 1 − Φ(z). The normal is a life model only for high-stress / wear-out items (L4 table); most life data are right-skewed, hence Weibull and log-normal.</div>
 <div class="row"><button class="btn" id="n-demo">DEMO: strength 1000 ± 100 MPa, P(X &lt; 900)</button><button class="btn" id="n-68">DEMO: μ ± 1σ, 2σ, 3σ</button><label style="margin-left:8px"><input type="radio" name="n-mode" value="n" checked data-live> Normal</label><label><input type="radio" name="n-mode" value="u" data-live> Uniform</label></div>
 <div class="grid2"><div>
  ${ctl('n-m', 'μ (or a)', 0, 2000, 1, 1000, '')}${ctl('n-s', 'σ (or b)', 1, 2000, 1, 100, '')}
  ${ctl('n-x1', 'lower x₁', 0, 2500, 1, 900, '')}${ctl('n-x2', 'upper x₂', 0, 2500, 1, 1100, '')}
  ${ctl('n-p', 'percentile p', 0.001, 0.999, 0.001, 0.95, '')}
 </div><div><div class="outs">${outBox('n-pr', 'P(x₁ &lt; X &lt; x₂)')}${outBox('n-z', 'z₁, z₂')}${outBox('n-lo', 'P(X &lt; x₁)')}${outBox('n-hi', 'P(X &gt; x₂)')}${outBox('n-q', 'value at percentile p')}</div></div></div>
 <canvas class="plot" id="n-plot" style="height:230px"></canvas>
 <h3>Central limit theorem (Monte Carlo)</h3>
 <div class="row">${ctl('n-clt', 'average of k uniform(0,1) numbers', 1, 30, 1, 1, '')}<button class="btn fill" id="n-run">▶ Draw 20 000 averages</button></div>
 <canvas class="plot" id="n-cltp" style="height:200px"></canvas>
 <span class="src">Lecture L5 and L4 comparison table (normal: "life distribution of high-stress components"), L2 exponential slide. The numbers on the buttons are DEMO.</span>
`, CH.lec + ' ' + CH.demo)}
`;

/* ============ 1.1 Venn ============ */
(function () {
  const lens = (r1, r2, d) => { if (d >= r1 + r2) return 0; if (d <= Math.abs(r1 - r2)) return Math.PI * Math.min(r1, r2) ** 2; const a = r1 * r1 * Math.acos((d * d + r1 * r1 - r2 * r2) / (2 * d * r1)), b = r2 * r2 * Math.acos((d * d + r2 * r2 - r1 * r1) / (2 * d * r2)), c = 0.5 * Math.sqrt((-d + r1 + r2) * (d + r1 - r2) * (d - r1 + r2) * (d + r1 + r2)); return a + b - c; };
  const sec = el('m1-venn'); let rd = {};
  function calc() {
    let a = V('v-a'), b = V('v-b'), ab = V('v-ab'); const lo = Math.max(0, a + b - 1), hi = Math.min(a, b);
    const clamped = ab < lo - 1e-9 || ab > hi + 1e-9; ab = clamp(ab, lo, hi); if (clamped) setV('v-ab', +ab.toFixed(4));
    el('v-note').textContent = `P(A ∩ B) must lie between max(0, P(A)+P(B)−1) = ${lo.toFixed(2)} and min(P(A), P(B)) = ${hi.toFixed(2)}` + (clamped ? ' — value adjusted' : '');
    const un = a + b - ab, cAB = b > 0 ? ab / b : NaN, cBA = a > 0 ? ab / a : NaN, indep = Math.abs(ab - a * b) < 1e-9;
    setBox('v-un', f4(un), 'P(A ∪ B) = P(A)+P(B)−P(A∩B)', 'hi'); setBox('v-ab1', f4(cAB), 'P(A | B) = P(A∩B)/P(B)'); setBox('v-ba1', f4(cBA), 'P(B | A) = P(A∩B)/P(A)');
    setBox('v-ind1', indep ? 'yes ✓' : 'no', `P(A)P(B) = ${f4(a * b)} vs P(A∩B) = ${f4(ab)}` + (ab === 0 ? ' · mutually exclusive' : ''), indep ? 'hi' : '');
    setBox('v-ac', f4(1 - a), 'P(A<sup>c</sup>) = 1 − P(A)'); setBox('v-no', f4(1 - un), 'P(neither) = 1 − P(A ∪ B)');
    rd = { a, b, ab, un };
    // venn
    const W = 380, H = 230, U = W * H, r1 = Math.sqrt(a * U / Math.PI), r2 = Math.sqrt(b * U / Math.PI);
    let d = r1 + r2; if (ab > 0 && a > 0 && b > 0) { let l = Math.abs(r1 - r2), h = r1 + r2; for (let i = 0; i < 60; i++) { const m = (l + h) / 2; if (lens(r1, r2, m) > ab * U) l = m; else h = m; } d = (l + h) / 2; } else d = r1 + r2 + 8;
    const span = r1 + d + r2, left = (W - span) / 2, ax = left + r1, bx = ax + d, cy = H / 2;
    const ovL = bx - r2, ovR = ax + r1, tx = (x, p) => `<text x="${x}" y="${cy}" text-anchor="middle" font-size="12" fill="#14224a"><tspan x="${x}" dy="-2" font-weight="700">${p}</tspan></text>`;
    el('v-svg').innerHTML = `<svg width="${W}" height="${H + 22}" viewBox="0 0 ${W} ${H + 22}" style="max-width:100%"><defs><clipPath id="v-cu"><rect x="0" y="0" width="${W}" height="${H}"/></clipPath><clipPath id="v-ca"><circle cx="${ax}" cy="${cy}" r="${r1}"/></clipPath></defs>
      <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" fill="#fff" stroke="#64748b" rx="6"/><g clip-path="url(#v-cu)">
      <circle cx="${ax}" cy="${cy}" r="${r1}" fill="#3b82f6" fill-opacity=".35" stroke="#2457d6" stroke-width="1.6"/><circle cx="${bx}" cy="${cy}" r="${r2}" fill="#f59e0b" fill-opacity=".38" stroke="#d98200" stroke-width="1.6"/>
      <circle cx="${bx}" cy="${cy}" r="${r2}" fill="#7a3fd1" fill-opacity=".45" clip-path="url(#v-ca)"/></g>
      <text x="${Math.max(10, ax - r1 * 0.6)}" y="20" font-weight="700" fill="#2457d6" font-size="15">A</text><text x="${Math.min(W - 20, bx + r2 * 0.6)}" y="20" font-weight="700" fill="#b45f00" font-size="15">B</text>
      ${a - ab > 0.004 ? tx(Math.max(left + 18, (left + ovL) / 2), f2(a - ab)) : ''}${ab > 0.004 ? tx((ovL + ovR) / 2, f2(ab)) : ''}${b - ab > 0.004 ? tx(Math.min(left + span - 18, (ovR + left + span) / 2), f2(b - ab)) : ''}
      <text x="${W - 8}" y="${H - 8}" text-anchor="end" font-size="12" fill="#475569">neither ${f2(1 - un)}</text>
      <text x="${W / 2}" y="${H + 16}" text-anchor="middle" font-size="11.5" fill="#475569">area ∝ probability · whole box = 1 · A-only ${f2(a - ab)} · A∩B ${f2(ab)} · B-only ${f2(b - ab)}</text></svg>`;
  }
  wire(sec, calc);
  const load = (a, b, ab) => { setV('v-a', a); setV('v-b', b); setV('v-ab', ab); calc(); };
  on('v-mse', 'click', () => load(0.6, 0.5, 0.3)); on('v-ind', 'click', () => load(0.85, 0.85, 0.7225)); on('v-ex', 'click', () => load(0.3, 0.4, 0)); on('v-dep', 'click', () => load(0.5, 0.4, 0.35));
  on('v-mc', 'click', () => {
    const { a, b, ab } = rd, N = 20000; let u = 0, nb = 0, na = 0, both = 0;
    for (let i = 0; i < N; i++) { const r = Math.random(); const inA = r < a, inB = (r < ab) || (r >= a && r < a + b - ab); // regions: both [0,ab) , A-only [ab,a), B-only [a, a+b-ab)
      const bothR = r < ab, aOnly = r >= ab && r < a, bOnly = r >= a && r < a + b - ab; const A = bothR || aOnly, B = bothR || bOnly; if (A || B) u++; if (B) { nb++; if (A) both++; } if (A) na++; }
    // P(B|A) estimate from same trials
    let aN = 0, abN = 0; for (let i = 0; i < N; i++) { const r = Math.random(), bothR = r < ab, aOnly = r >= ab && r < a; if (bothR || aOnly) { aN++; if (bothR) abN++; } }
    el('v-mcout').textContent = `P(A∪B) ≈ ${(u / N).toFixed(4)} · P(A|B) ≈ ${nb ? (both / nb).toFixed(4) : '—'} · P(B|A) ≈ ${aN ? (abN / aN).toFixed(4) : '—'}`;
  });
  calc();
})();

/* ============ 1.2 independent events ============ */
(function () {
  const sec = el('m1-ind'), plot = mkPlot('i-plot', { xlabel: 'number of events that happen, k', ylabel: 'probability', xmin: -0.5, xmax: 3.5, ymin: 0, ymax: 1 });
  let P = [];
  function calc() {
    P = parseList(el('i-p').value).slice(0, 8).map(p => clamp(p, 0, 1)); const n = P.length; if (!n) return;
    const k = clamp(Math.round(V('i-k')), 1, n), all = P.reduce((s, p) => s * p, 1), none = P.reduce((s, p) => s * (1 - p), 1), one = exactlyK(P, 1), atk = atLeastK(P, k);
    const fs = x => { const f = fracStr(x); return f && f !== '0/1' && f !== '1/1' ? ` = ${f}` : ''; };
    setBox('i-all', f4(all), 'all happen = Πp' + fs(all)); setBox('i-one', f4(one), 'exactly one' + fs(one)); setBox('i-atk', f4(atk), `at least ${k}` + fs(atk), 'hi'); setBox('i-atl', f4(1 - none), 'at least one = 1 − Π(1−p)' + fs(1 - none), 'hi'); setBox('i-none', f4(none), 'none happen' + fs(none));
    const pts = [], cum = []; for (let j = 0; j <= n; j++) { pts.push([j, exactlyK(P, j)]); } plot.set([{ name: 'P(exactly k)', color: '#2457d6', bars: true, bw: 0.7, pts }], { axes: { xmin: -0.6, xmax: n + 0.6, ymin: 0, ymax: Math.max(0.05, Math.ceil(Math.max(...pts.map(p => p[1])) * 11) / 10) } });
    if (n <= 5) {
      let rows = '<tr><th>outcome (P = pass/succeed, F = fail)</th><th>probability = product across</th><th>#P</th><th>counts for "at least k"?</th></tr>', sum = 0;
      for (let m = 0; m < (1 << n); m++) { let s = '', pr = 1, c = 0; for (let i = 0; i < n; i++) { const ok = (m >> (n - 1 - i)) & 1; s += ok ? 'P' : 'F'; pr *= ok ? P[i] : 1 - P[i]; c += ok; } sum += pr; rows += `<tr class="${c >= k ? 'rowhi' : ''}"><td class="mono">${s}</td><td>${f4(pr)}${fs(pr)}</td><td>${c}</td><td>${c >= k ? '✓' : ''}</td></tr>`; }
      rows += `<tr><td><b>total (add down)</b></td><td><b>${sum.toFixed(6)}</b></td><td colspan="2"></td></tr>`; el('i-tree').innerHTML = rows;
    } else el('i-tree').innerHTML = '<tr><td>Outcome tree hidden for more than 5 events (2<sup>n</sup> rows); the numbers above are exact.</td></tr>';
  }
  wire(sec, calc);
  const L = (s, k) => { el('i-p').value = s; if (k) setV('i-k', k); calc(); };
  on('i-stu', 'click', () => L('1/2, 2/3, 3/4', 2)); on('i-mis', 'click', () => L('0.85, 0.85', 1)); on('i-mse', 'click', () => L('0.92, 0.92', 1)); on('i-sh8', 'click', () => L('0.99,0.99,0.99,0.99,0.99,0.99,0.99,0.99', 8)); on('i-sh1', 'click', () => L('0.99,0.99,0.99,0.99,0.99,0.5,0.99,0.99', 8));
  on('i-run', 'click', () => { const N = 50000, n = P.length, k = clamp(Math.round(V('i-k')), 1, n); let c = 0; for (let t = 0; t < N; t++) { let m = 0; for (let i = 0; i < n; i++) if (Math.random() < P[i]) m++; if (m >= k) c++; } setBox('i-mc', (c / N).toFixed(4), `Monte Carlo, N = ${N}`, 'hi'); });
  calc();
})();

/* ============ 1.3 tree ============ */
(function () {
  const sec = el('m1-tree');
  function calc() {
    const R = Math.round(V('t-r')), B = Math.round(V('t-bl')), N = R + B, rep = el('t-rep').checked;
    const pR1 = R / N, pB1 = B / N, pR2R = rep ? R / N : (R - 1) / (N - 1), pB2R = 1 - pR2R, pR2B = rep ? R / N : R / (N - 1), pB2B = 1 - pR2B;
    const leaves = [['RR', pR1 * pR2R], ['RB', pR1 * pB2R], ['BR', pB1 * pR2B], ['BB', pB1 * pB2B]]; const same = leaves[0][1] + leaves[3][1], sum = leaves.reduce((s, l) => s + l[1], 0);
    const den = rep ? N * N : N * (N - 1), num = rep ? R * R + B * B : R * (R - 1) + B * (B - 1), g = (a, b) => b ? g(b, a % b) : a, gg = g(num, den);
    const frac = (n, d) => { const q = g(n, d); return `${n / q}/${d / q}`; };
    setBox('t-same', f4(same), `= ${num}/${den} = ${frac(num, den)}`, 'hi'); setBox('t-diff', f4(1 - same), `= ${frac(den - num, den)}`); setBox('t-sum', sum.toFixed(6), 'must be 1 ✓');
    const fr = (p, n, d) => `${n}/${d}`;
    const d1 = N, d2 = rep ? N : N - 1, nR2R = rep ? R : R - 1, nR2B = R, nB2R = rep ? B : B - 1 + 0, nB2B = rep ? B : B - 1;
    const lab = [[`${R}/${d1}`, 'red'], [`${B}/${d1}`, 'blue']];
    const l2 = [[`${rep ? R : R - 1}/${d2}`, `${rep ? B : B}/${d2}`], [`${R}/${d2}`, `${rep ? B : B - 1}/${d2}`]];
    const ys = [40, 100, 160, 220], cn = [R * (rep ? R : R - 1), R * B, B * R, B * (rep ? B : B - 1)]; const lv = (i, txt, c) => `<text x="258" y="${ys[i] + 4}" font-size="12.5" fill="#0f172a"><tspan font-weight="700">${txt}</tspan> = ${frac(cn[i], den)} = ${c}</text>`;
    el('t-svg').innerHTML = `<svg width="460" height="262" viewBox="0 0 460 262" style="max-width:100%"><g stroke="#334155" stroke-width="1.6" fill="none"><path d="M20 130 L120 70 M20 130 L120 190 M120 70 L250 40 M120 70 L250 100 M120 190 L250 160 M120 190 L250 220"/></g>
     <text x="40" y="94" font-size="12" fill="#dc2626">red ${lab[0][0]}</text><text x="40" y="178" font-size="12" fill="#2563eb">blue ${lab[1][0]}</text>
     <text x="136" y="48" font-size="11.5" fill="#dc2626">red ${l2[0][0]}</text><text x="136" y="104" font-size="11.5" fill="#2563eb">blue ${l2[0][1]}</text><text x="136" y="168" font-size="11.5" fill="#dc2626">red ${l2[1][0]}</text><text x="136" y="224" font-size="11.5" fill="#2563eb">blue ${l2[1][1]}</text>
     <text x="40" y="130" font-size="11" fill="#475569">1st pick</text><text x="130" y="128" font-size="11" fill="#475569">2nd pick →</text>
     ${leaves.map((l, i) => lv(i, l[0], `${f4(l[1])}`)).join('')}</svg>`;
  }
  wire(sec, calc);
  on('t-bead', 'click', () => { setV('t-r', 5); setV('t-bl', 7); el('t-rep').checked = true; calc(); });
  on('t-wo', 'click', () => { setV('t-r', 5); setV('t-bl', 7); el('t-rep').checked = false; calc(); });
  calc();
})();

/* ============ 1.4 Bayes ============ */
(function () {
  const sec = el('m1-bayes'); const plot = mkPlot('b-plot', { xlabel: 'prior P(H₁)', ylabel: 'posterior P(H₁ | E)', xmin: 0, xmax: 0.05, ymin: 0, ymax: 1 });
  let rows = [{ n: 'defective', p: 0.001, l: 0.98 }, { n: 'not defective', p: 0.999, l: 0.01 }], evName = 'robot says "defective"', post = [];
  function table() {
    el('b-tbl').innerHTML = `<tr><th>#</th><th>hypothesis Aᵢ</th><th>prior P(Aᵢ)</th><th>likelihood P(E | Aᵢ)</th><th>joint P(E | Aᵢ)·P(Aᵢ)</th><th>posterior P(Aᵢ | E)</th></tr>` +
      rows.map((r, i) => `<tr><td>${i + 1}</td><td><input type="text" data-b="n" data-i="${i}" value="${esc(r.n)}"></td><td><input type="number" data-b="p" data-i="${i}" step="any" value="${r.p}"></td><td><input type="number" data-b="l" data-i="${i}" step="any" value="${r.l}"></td><td id="b-j${i}"></td><td id="b-q${i}"><b></b></td></tr>`).join('') +
      `<tr><td colspan="6"><button class="btn sm" id="b-add">+ hypothesis</button> <button class="btn sm danger" id="b-del">− remove last</button> evidence E = <input type="text" id="b-ev" style="width:60%;display:inline-block" value="${esc(evName)}"></td></tr>`;
    el('b-add').onclick = () => { if (rows.length < 5) { rows.push({ n: 'H' + (rows.length + 1), p: 0, l: 0.5 }); table(); calc(); } }; el('b-del').onclick = () => { if (rows.length > 2) { rows.pop(); table(); calc(); } };
    el('b-ev').oninput = () => { evName = el('b-ev').value; calc(); };
  }
  sec.addEventListener('input', e => { const t = e.target; if (t.dataset && t.dataset.b) { const r = rows[+t.dataset.i]; r[t.dataset.b] = t.dataset.b === 'n' ? t.value : parseFloat(t.value) || 0; calc(); } });
  function calc() {
    const sp = rows.reduce((s, r) => s + r.p, 0) || 1, pr = rows.map(r => r.p / sp), joint = rows.map((r, i) => r.l * pr[i]), PE = joint.reduce((s, x) => s + x, 0); post = joint.map(j => PE ? j / PE : 0);
    rows.forEach((r, i) => { el('b-j' + i).textContent = (+joint[i].toPrecision(6)).toString(); el('b-q' + i).innerHTML = `<b>${post[i].toFixed(5)}</b>`; });
    const warn = Math.abs(sp - 1) > 1e-9 ? `<div class="src" style="grid-column:1/-1">Priors sum to ${(+sp.toPrecision(6))}; they are normalised to 1 for the calculation.</div>` : '';
    el('b-outs').innerHTML = `${outBox('b-pe', 'P(E) = Σ P(E|Aᵢ)P(Aᵢ)')}${outBox('b-post1', 'P(A₁ | E)')}${outBox('b-prior1', 'prior P(A₁)')}${outBox('b-lift', 'evidence moves A₁ by ×')}${warn}`;
    setBox('b-pe', (+PE.toPrecision(5)).toString(), 'law of total probability'); setBox('b-post1', post[0].toFixed(5), `P(${esc(rows[0].n)} | E) — Bayes`, 'hi'); setBox('b-prior1', pr[0].toFixed(5), 'before the evidence'); setBox('b-lift', pr[0] ? (post[0] / pr[0]).toFixed(1) : '—', 'posterior ÷ prior');
    // svg tree
    const n = rows.length, H = Math.max(120, n * 76 + 40), y0 = i => 46 + i * 76;
    el('b-svg').innerHTML = `<svg width="460" height="${H}" viewBox="0 0 460 ${H}" style="max-width:100%"><g stroke="#334155" stroke-width="1.5" fill="none">${rows.map((r, i) => `<path d="M12 ${H / 2} L150 ${y0(i)} M150 ${y0(i)} L300 ${y0(i) - 16} M150 ${y0(i)} L300 ${y0(i) + 16}"/>`).join('')}</g>` +
      rows.map((r, i) => `<text x="154" y="${y0(i) - 30}" font-size="11.5" font-weight="700" fill="#14224a">${esc(r.n)} · prior ${(+pr[i].toPrecision(4))}</text><text x="196" y="${y0(i) - 8}" font-size="10.5" fill="#12915b">E ${(+r.l.toPrecision(4))}</text><text x="196" y="${y0(i) + 24}" font-size="10.5" fill="#64748b">not E ${(+(1 - r.l).toPrecision(4))}</text><text x="306" y="${y0(i) - 12}" font-size="11.5" fill="#0f172a">= ${(+joint[i].toPrecision(4))}</text><text x="306" y="${y0(i) + 20}" font-size="10.5" fill="#94a3b8">= ${(+(pr[i] * (1 - r.l)).toPrecision(3))}</text>`).join('') +
      `<text x="306" y="${H - 8}" font-size="11.5" fill="#0f172a" font-weight="700">add the E leaves: P(E) = ${(+PE.toPrecision(4))}</text></svg>`;
    // natural frequencies
    const N = V('b-N'); el('b-freq').innerHTML = '<div class="tblwrap"><table><tr><th>hypothesis</th><th>items</th><th>show E</th><th>share of E</th></tr>' + rows.map((r, i) => `<tr><td>${esc(r.n)}</td><td>${Math.round(N * pr[i]).toLocaleString()}</td><td>${(N * joint[i]).toLocaleString(undefined, { maximumFractionDigits: 1 })}</td><td><b>${(100 * post[i]).toFixed(2)}%</b></td></tr>`).join('') + `<tr><td><b>total</b></td><td>${N.toLocaleString()}</td><td>${(N * PE).toLocaleString(undefined, { maximumFractionDigits: 1 })}</td><td>100%</td></tr></table></div>`;
    // posterior vs prior curve for hypothesis 1
    const others = pr.slice(1).reduce((s, x) => s + x, 0), xm = Math.max(0.02, Math.min(1, +(pr[0] * 4).toPrecision(2)));
    const f = x => { const sc = others > 0 ? (1 - x) / others : 0; let den = rows[0].l * x; for (let i = 1; i < n; i++) den += rows[i].l * pr[i] * sc; return den ? rows[0].l * x / den : 0; };
    plot.set([{ name: 'posterior P(A₁|E)', color: '#2457d6', f }], { axes: { xmin: 0, xmax: xm, ymin: 0, ymax: 1 }, marks: [{ x: pr[0], y: post[0], label: 'now ' + post[0].toFixed(3) }] });
  }
  const setRows = (r, ev) => { rows = r; evName = ev; table(); calc(); };
  on('b-rob', 'click', () => setRows([{ n: 'defective', p: 0.001, l: 0.98 }, { n: 'not defective', p: 0.999, l: 0.01 }], 'robot says "defective"'));
  on('b-bag', 'click', () => setRows([{ n: 'bag B (4w, 5b)', p: 0.5, l: 4 / 9 }, { n: 'bag A (2w, 3r)', p: 0.5, l: 0.4 }], 'a white ball is drawn'));
  on('b-dem', 'click', () => setRows([{ n: 'machine 1', p: 0.5, l: 0.01 }, { n: 'machine 2', p: 0.3, l: 0.02 }, { n: 'machine 3', p: 0.2, l: 0.05 }], 'the part is defective'));
  on('b-next', 'click', () => { rows.forEach((r, i) => r.p = +post[i].toPrecision(8)); table(); calc(); });
  on('b-mc', 'click', () => { const N = 200000, sp = rows.reduce((s, r) => s + r.p, 0), cnt = rows.map(() => 0); let e = 0; for (let t = 0; t < N; t++) { let u = Math.random() * sp, i = 0; while (i < rows.length - 1 && u > rows[i].p) { u -= rows[i].p; i++; } if (Math.random() < rows[i].l) { e++; cnt[i]++; } } el('b-mcout').textContent = `E seen ${e} times; share by hypothesis: ` + cnt.map((c, i) => `${rows[i].n} ${(100 * c / e).toFixed(2)}%`).join(' · '); });
  wire(sec, calc); table(); calc();
})();

/* ============ 1.5 central tendency ============ */
(function () {
  const sec = el('m1-cen'), plot = mkPlot('c-plot', { xlabel: 'value', ylabel: 'count', xmin: 0, xmax: 1, ymin: 0, ymax: 1 });
  function calc() {
    const d = parseNums(el('c-d').value); if (!d.length) return; const n = d.length, m = mean(d), md = median(d), mo = modes(d), v = variancePop(d), s2 = n > 1 ? varianceSamp(d) : NaN;
    setBox('c-n', n, 'observations'); setBox('c-mean', nice(m), 'mean = Σx/n', 'hi'); setBox('c-med', nice(md), 'median'); setBox('c-mode', mo.length ? mo.join(', ') : 'none', 'mode (most frequent)'); setBox('c-var', nice(v), 'σ² = Σ(x−μ)²/N'); setBox('c-s2', nice(s2), 's² = Σ(x−x̄)²/(n−1)'); setBox('c-sd', nice(Math.sqrt(v)), 'σ (population)');
    const lo = Math.min(...d), hi = Math.max(...d), bins = Math.min(12, Math.max(4, Math.ceil(Math.sqrt(n) + 1))), w = (hi - lo) / bins || 1, cnt = new Array(bins).fill(0); d.forEach(x => cnt[Math.min(bins - 1, Math.floor((x - lo) / w))]++);
    plot.set([{ name: 'histogram', color: '#94a3b8', bars: true, bw: w * 0.92, pts: cnt.map((c, i) => [lo + (i + 0.5) * w, c]) }], { axes: { xmin: lo - w, xmax: hi + w, ymin: 0, ymax: Math.max(...cnt) + 1 }, vlines: [{ x: m, color: '#d23b3b', label: 'mean' }, { x: md, color: '#12915b', label: 'median' }] });
  }
  wire(sec, calc);
  const L = s => { el('c-d').value = s; calc(); };
  on('c-life', 'click', () => L('7, 12, 19, 29, 41, 67')); on('c-cyc', 'click', () => L('17, 24, 26, 43, 43, 46, 50')); on('c-skew', 'click', () => L('1, 2, 2, 3, 3, 3, 4, 5, 6, 8, 12, 20, 41'));
  calc();
})();

/* ============ 1.6 binomial & poisson ============ */
(function () {
  const sec = el('m1-disc'), plot = mkPlot('d-plot', { xlabel: 'k', ylabel: 'probability', xmin: -0.5, xmax: 5, ymin: 0, ymax: 1 });
  const mode = () => (sec.querySelector('input[name=d-mode]:checked') || {}).value;
  function pmfOf() { if (mode() === 'bin') { const n = Math.round(V('d-n')), p = V('d-p'); return { max: n, pm: k => binomPmf(n, p, k), mu: n * p, vr: n * p * (1 - p) }; } const m = V('d-lam') * V('d-t'); return { max: Math.max(10, Math.ceil(m + 5 * Math.sqrt(m) + 3)), pm: k => poisPmf(m, k), mu: m, vr: m }; }
  function calc() {
    el('d-binp').style.display = mode() === 'bin' ? '' : 'none'; el('d-poip').style.display = mode() === 'bin' ? 'none' : '';
    const D = pmfOf(), k = Math.round(V('d-k')); let le = 0, ge = 0; const pts = []; for (let j = 0; j <= D.max; j++) { const p = D.pm(j); pts.push([j, p]); if (j <= k) le += p; if (j >= k) ge += p; }
    setBox('d-pk', f4(D.pm(k)), 'P(X = k)'); setBox('d-le', f4(Math.min(1, le)), 'P(X ≤ k)'); setBox('d-ge', f4(Math.min(1, ge)), 'P(X ≥ k)' + (mode() === 'bin' ? ' = k-out-of-n reliability' : ''), 'hi'); setBox('d-mu', nice(D.mu), mode() === 'bin' ? 'np' : 'm = λt'); setBox('d-vr', nice(D.vr), mode() === 'bin' ? 'np(1−p)' : 'm');
    plot.set([{ name: mode() === 'bin' ? 'Binomial pmf' : 'Poisson pmf', color: '#2457d6', bars: true, bw: 0.7, pts }, { name: 'k selected', color: '#d23b3b', bars: true, bw: 0.7, pts: [[k, D.pm(k)]] }], { axes: { xmin: -0.6, xmax: D.max + 0.6, ymin: 0, ymax: Math.max(0.05, Math.min(1, Math.max(...pts.map(p => p[1])) * 1.12)) } });
  }
  wire(sec, calc);
  on('d-rock', 'click', () => { sec.querySelector('input[name=d-mode][value=bin]').checked = true; setV('d-n', 4); setV('d-p', 0.98); setV('d-k', 3); calc(); });
  on('d-pois', 'click', () => { sec.querySelector('input[name=d-mode][value=poi]').checked = true; setV('d-lam', 0.002); setV('d-t', 1000); setV('d-k', 0); calc(); });
  on('d-mc', 'click', () => {
    const N = 20000, D = pmfOf(), k = Math.round(V('d-k')); let hit = 0, tot = 0;
    for (let r = 0; r < N; r++) { let x = 0; if (mode() === 'bin') { const n = Math.round(V('d-n')), p = V('d-p'); for (let i = 0; i < n; i++) if (Math.random() < p) x++; } else { const lam = V('d-lam'), T = V('d-t'); let t = rexp(lam); while (t <= T) { x++; t += rexp(lam); } } tot += x; if (x === k) hit++; }
    el('d-mcout').textContent = `P(X = k) ≈ ${(hit / N).toFixed(4)} (exact ${D.pm(k).toFixed(4)}) · mean ≈ ${(tot / N).toFixed(3)} (exact ${nice(D.mu)})` + (mode() === 'poi' ? ' — events generated from exponential gaps' : '');
  });
  calc();
})();

/* ============ 1.7 normal & uniform ============ */
(function () {
  const sec = el('m1-cont'), plot = mkPlot('n-plot', { xlabel: 'x', ylabel: 'f(x)', xmin: 0, xmax: 1, ymin: 0, ymax: 1 }), pc = mkPlot('n-cltp', { xlabel: 'average', ylabel: 'density', xmin: 0, xmax: 1, ymin: 0, ymax: 1 });
  const mode = () => (sec.querySelector('input[name=n-mode]:checked') || {}).value;
  function calc() {
    const N = mode() === 'n', m = V('n-m'), s = V('n-s'); const D = N ? DIST.normal({ m, s }) : DIST.uniform({ a: Math.min(m, s), b: Math.max(m, s) + 1e-9 });
    let x1 = V('n-x1'), x2 = V('n-x2'); if (x2 < x1) { const t = x1; x1 = x2; x2 = t; }
    const pr = D.F(x2) - D.F(x1); setBox('n-pr', f4(pr), 'P(x₁ < X < x₂) = F(x₂) − F(x₁)', 'hi'); setBox('n-z', N ? `${((x1 - m) / s).toFixed(3)}, ${((x2 - m) / s).toFixed(3)}` : '—', N ? 'z = (x−μ)/σ' : 'n/a for uniform'); setBox('n-lo', f4(D.F(x1)), 'P(X < x₁)'); setBox('n-hi', f4(1 - D.F(x2)), 'P(X > x₂)'); setBox('n-q', nice(D.q(V('n-p'))), `x with P(X ≤ x) = ${V('n-p')}`);
    const lo = N ? m - 4 * s : Math.min(m, s) - 0.1 * Math.abs(s - m), hi = N ? m + 4 * s : Math.max(m, s) + 0.1 * Math.abs(s - m), shade = []; for (let i = 0; i <= 60; i++) { const x = x1 + (x2 - x1) * i / 60; shade.push([x, D.f(x)]); }
    const ymax = N ? 1 / (s * Math.sqrt(2 * Math.PI)) * 1.15 : 1 / Math.abs(s - m) * 1.3;
    plot.set([{ name: 'f(x)', color: '#2457d6', f: D.f }, { name: 'P(x₁<X<x₂)', color: '#d98200', fill: 'rgba(245,158,11,.35)', pts: shade }], { axes: { xmin: lo, xmax: hi, ymin: 0, ymax } });
  }
  wire(sec, calc);
  on('n-demo', 'click', () => { sec.querySelector('input[name=n-mode][value=n]').checked = true; setV('n-m', 1000); setV('n-s', 100); setV('n-x1', 0); setV('n-x2', 900); calc(); });
  on('n-68', 'click', () => { sec.querySelector('input[name=n-mode][value=n]').checked = true; setV('n-m', 1000); setV('n-s', 100); setV('n-x1', 900); setV('n-x2', 1100); calc(); });
  on('n-run', 'click', () => {
    const k = Math.round(V('n-clt')), N = 20000, bins = 40, cnt = new Array(bins).fill(0); for (let i = 0; i < N; i++) { let s = 0; for (let j = 0; j < k; j++) s += Math.random(); const a = s / k; cnt[Math.min(bins - 1, Math.floor(a * bins))]++; }
    const sd = Math.sqrt(1 / 12 / k); pc.set([{ name: 'simulated averages', color: '#94a3b8', bars: true, bw: 1 / bins * 0.95, pts: cnt.map((c, i) => [(i + 0.5) / bins, c / N * bins]) }, { name: `normal(0.5, ${sd.toFixed(3)})`, color: '#d23b3b', f: x => phiPdf((x - 0.5) / sd) / sd }], { axes: { xmin: 0, xmax: 1, ymin: 0, ymax: Math.max(1.2, 1.1 / (sd * 2.5), Math.max(...cnt) / N * bins * 1.1) } });
  });
  calc(); el('n-run').click();
})();
})();
