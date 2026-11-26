/* ===== m2.js : Module 2 — Reliability concepts, failure data, bathtub curve, quality tools ===== */
(function () {
'use strict';
const root = $('#tab-m2');

const QUIZ = [
  ['The first advisory group on reliability, AGREE, was established in …', ['UK, 1951', 'USA, 1952', 'USA, 1950', 'UK, 1957'], 2, 'L1: "Department of Defence in 1950 established AGREE (Advisory Group)".'],
  ['The distinction between quality and reliability lies in …', ['total items passed', 'obeying statistical laws', 'mission time (time dependence)', 'probability distribution'], 2, 'L1 slide "Quality & Reliability": quality is a pass/fail, not time-dependent snapshot; reliability is "continuing fitness for the purpose" over time.'],
  ['The objectives of reliability engineering are to prevent failures, correct their causes, cope with unfixed failures and estimate / analyse new designs.', ['True', 'False'], 0, 'MSE Q1d: Prevent failures · Correct root causes · Cope with unfixed failures · Estimate and analyse.'],
  ['The probability that an item can be returned to a specified condition within a given period of time is …', ['Maintenance', 'Availability', 'Reliability', 'Repair rate', 'Maintainability'], 4, 'L1 "Reliability other indices".'],
  ['Depending on frequency, duration and consequence, failures are …', ['Sporadic and Chronic', 'Potential and Hidden', 'Primary and Secondary', 'Effects and Mechanism'], 0, 'L1 "Failures": sporadic (serious, rare) vs chronic (less serious, frequent). The other pairs describe degree/state or modes/effects.'],
  ['Failure will not occur as long as the applied load does not exceed the strength.', ['True', 'False'], 0, 'L1 load–strength slide.'],
  ['A system that does not work properly although every part works has a …', ['Creep', 'Wear-out', 'Sneak', 'Code error'], 2, 'L1: "sneaks (a condition in which system does not work properly, even though every part works)".'],
  ['The time interval characteristic of failures in repairable items is …', ['MTTF', 'MTBF', 'MTD', 'all of these'], 1, 'MSE Q1b: MTBF is for repairable systems, MTTF for non-repairable.'],
  ['During ageing of equipment the stress and strength curves come …', ['nearer', 'broader', 'both', 'none'], 0, 'Strength falls with age, so the two curves approach and overlap grows.'],
  ['Quality-control tools are mainly meant to remove which type of failure?', ['latent failure', 'creep mode', 'patent failure', 'both latent and patent'], 2, 'L1: "Patent failures are removed by QC methods"; latent failures show up over time (reliability).'],
  ['Which is NOT one of the QC tools: histogram, Pareto diagram, cause-and-effect (fishbone), bathtub curve?', ['histogram', 'Pareto diagram', 'fishbone diagram', 'bathtub curve'], 3, 'The bathtub curve is a failure-rate model, not a QC tool.'],
  ['Innovation in the quality movement over the decades went …', ['QA – QC – QM – TQM', 'QC – QA – QM – TQM', 'TQM – QM – QA – QC'], 1, 'L1 "Evolution of quality": quality control → quality assurance → quality management → total quality management.'],
  ['Hazard rate h(t) equals …', ['f(t) · R(t)', 'f(t) / R(t)', 'R(t) / f(t)', '1 − R(t)'], 1, 'MSE Q1e: h(t) = f(t)/R(t).'],
  ['The Poisson distribution models the … while the exponential models the …', ['time between events … number of events', 'number of events … time between events', 'both model counts'], 1, 'L2: Poisson = events per unit time; exponential = time per event.'],
  ['Weibull shape β < 1 means …', ['wear-out (rising hazard)', 'constant hazard', 'early-life / infant-mortality (falling hazard)'], 2, 'L3 β-effects table: 0 < β < 1 = DFR, models infant mortality.'],
  ['For any Weibull shape β, the reliability at t = η is …', ['0.5', '0.632', '0.368', 'depends on β'], 2, 'R(η) = e⁻¹ = 0.368, so 63.2% have failed at the characteristic life.']
];

root.innerHTML = `
<div class="subnav">
 <a href="#m2-deck">2.1 Concepts &amp; definitions</a><a href="#m2-ls">2.2 Load–strength</a><a href="#m2-rf">2.3 f · F · R · h</a><a href="#m2-eh">2.4 Failure data &amp; hazard</a><a href="#m2-mx">2.5 MTTF · MTBF · MTTR</a>
 <a href="#m2-bt">2.6 Bathtub curve</a><a href="#m2-pa">2.7 Pareto</a><a href="#m2-fb">2.8 Fishbone</a><a href="#m2-cc">2.9 Control charts</a>
</div>

${card('m2-deck', '2.1', 'Reliability concepts, failures, quality — definitions deck and self-test', `
 <div class="box feyn"><b>🧒 Plain words:</b> <b>Quality</b> asks "does it pass the test today?" <b>Reliability</b> asks "will it <i>keep</i> working, for how long, under which conditions?" — so reliability is quality <i>plus time</i>, and because failures are random, it is a <b>probability</b> between 0 and 1. A <b>failure</b> is loss of function; the <b>mode</b> is <i>how</i> it fails (cracked, overheated), the <b>cause</b> is <i>why</i>.</div>
 <div class="box formula">R(t) = P(T &gt; t) ∈ [0, 1] &nbsp;|&nbsp; unreliability F(t) = 1 − R(t) &nbsp;|&nbsp; "ability" = probability: reliability, availability, maintainability, dependability<br>Load–strength: failure ⇔ load &gt; strength; no failure if known strength exceeds known load; variation in both ⇒ avoid overlap</div>
 <div class="box tip"><b>Exam tip:</b> a good definition of reliability has <b>four keywords</b>: probability, intended function, stated conditions, specified period of time. For modes always give a <i>mode</i> (cracking, overheating), not an effect (plant stops).</div>
 <div class="row"><button class="btn lec" id="q-mse">Load MSE Q1 model answers (a–e)</button>
  <button class="btn pane on" data-pane="q-p1">Definitions</button><button class="btn pane" data-pane="q-p2">Why RE · objectives · history</button><button class="btn pane" data-pane="q-p3">Failures: types · causes · modes</button><button class="btn pane" data-pane="q-p4">Repairable vs non-repairable</button><button class="btn pane" data-pane="q-p5">Quality ↔ reliability · gurus</button><button class="btn pane" data-pane="q-p6">Self-test (16 questions)</button></div>
 <div id="q-mseans" class="box good" style="display:none"><b>MSE Q1 (any four, 2 marks each)</b><br>
  <b>a)</b> Independent events: P(A ∩ B) = P(A)·P(B) (2 M).<br><b>b)</b> MTTF = average time a <i>non-repairable</i> system or component operates before it fails (1 M). MTBF = average time between two consecutive failures of a <i>repairable</i> system, including the operating time between failures (1 M).<br>
  <b>c)</b> Failure mode = the specific manner in which a component or system fails to perform its function (1 M); e.g. cracking, overheating (0.5 M each).<br><b>d)</b> Prevent failures · correct root causes · cope with unfixed failures · estimate and analyse (0.5 M each).<br><b>e)</b> Hazard rate = instantaneous rate at which a surviving component fails at time t (1 M); h(t) = f(t)/R(t) (1 M).</div>
 <div class="pane-box" id="q-p1">
  <div class="grid2"><div class="box feyn"><b>Reliability (formal)</b><br>The ability of an item to operate under designated operating conditions for a designated period of time.</div>
  <div class="box feyn"><b>Reliability (military)</b><br>The chance of completing the mission; the chance of success (absence of failures).</div>
  <div class="box feyn"><b>Availability</b><br>Probability that an item, under stated conditions in an <i>ideal support</i> environment (spares, people, tools), is operational at a given point in time.</div>
  <div class="box feyn"><b>Dependability</b><br>Probability that an item is available on demand <i>and</i> reliable over the demanded mission time.</div>
  <div class="box feyn"><b>Maintainability</b><br>Probability that an item can be kept in, or returned to, a specified condition within a given period of time.</div>
  <div class="box feyn"><b>Durability</b><br>Ability to withstand the effects of time (fatigue, wear, corrosion): the minimum time before wear-out failures.</div>
  <div class="box feyn"><b>MTTF / MTBF</b><br>MTTF: mean time to failure of a <i>non-repairable</i> item. MTBF: mean time between consecutive failures of a <i>repairable</i> system; MTBF = total operating time / number of failures = 1/λ (constant λ).</div>
  <div class="box feyn"><b>Reliability engineering</b><br>A discipline combining engineering, science, mathematics and statistics, applying scientific know-how so that a product, process or plant performs its function without failure for the required time in a specified environment.</div></div></div>
 <div class="pane-box" id="q-p2" style="display:none">
  <div class="grid2"><div><b>Objectives (MSE Q1d, L1)</b><ol><li>Apply engineering knowledge to <b>prevent</b> or reduce the likelihood / frequency of failures.</li><li><b>Identify and correct the causes</b> of failures that occur despite prevention.</li><li><b>Cope with failures</b> whose causes have not been corrected.</li><li><b>Estimate</b> the likely reliability of new designs and <b>analyse</b> reliability data.</li></ol>
  <b>Why reliability engineering?</b> Education is deterministic but reality is <i>variability</i> (materials, processes, humans, applications). Pressures: competition, warranty costs, safety, public liability, market risks, legal and customer needs. "Reliability is money"; "unreliability experience is very infectious!"; it is a business issue.</div>
  <div><b>History (L1)</b><div class="tblwrap"><table class="cover"><tr><td>1930</td><td>probability applied to electric power generation</td></tr><tr><td>WW II</td><td>Germany applies the concept to rockets</td></tr><tr><td>1947</td><td>Cornell University study of electronic tubes</td></tr><tr><td>1950</td><td>US DoD establishes AGREE advisory group</td></tr><tr><td>1951</td><td>Weibull publishes the Weibull distribution paper</td></tr><tr><td>1952</td><td>Davis publishes failure data fitting the exponential</td></tr><tr><td>1954</td><td>first conference on reliability &amp; quality control</td></tr><tr><td>1962</td><td>first Master's programme in RE (USAF Institute of Technology)</td></tr></table></div>
  <span class="src">Disasters used to motivate: Challenger 1986, Chernobyl 1986, Bhopal 1984, NLC Neyveli 2020.</span></div></div></div>
 <div class="pane-box" id="q-p3" style="display:none">
  <div class="grid2"><div><b>Types of failure (L1, OREDA)</b><ul><li><b>Degree &amp; state:</b> primary, secondary · total, partial · potential, hidden</li><li><b>Severity (OREDA):</b> <i>critical</i> (immediate, complete loss of output) · <i>degraded</i> (not critical but out of specification; may become critical) · <i>incipient</i> (no immediate loss; may develop if unattended) · <i>unknown</i></li><li><b>Frequency, duration, consequence:</b> <i>sporadic</i> (serious, rare) vs <i>chronic</i> (less serious, frequent)</li><li><b>Description:</b> modes (causes) · effects · mechanisms · time-interval patterns</li></ul></div>
  <div><b>Why items fail (L1)</b><ul><li>design inherently incapable (resonance, out-of-spec power)</li><li><b>overstress</b>: stress &gt; strength</li><li><b>variation</b>: load and strength both vary; overlap must be avoided</li><li><b>wear-out</b>: strength decreases with age</li><li><b>time-dependent</b> mechanisms: creep, battery run-down</li><li><b>sneaks</b>: system fails though every part works (space circuits, software design)</li><li><b>errors</b>: specification, software coding, assembly, misuse, maintenance</li></ul><div class="box good">All failures, in principle and in practice, can be prevented.</div></div></div>
  <div class="tblwrap"><table class="cover"><tr><th>Concept</th><th>Meaning</th><th>Example</th></tr><tr><td>failure mode (MSE Q1c)</td><td>the specific way an item fails to perform its function</td><td>cracking, overheating</td></tr><tr><td>cause</td><td>why it happened</td><td>fatigue, overload, poor lubrication, bad weld</td></tr><tr><td>effect</td><td>what the system / user sees</td><td>pump stops, plant trips</td></tr><tr><td>mechanism</td><td>physical / chemical process behind it</td><td>corrosion, creep, wear, fatigue</td></tr></table></div><span class="src">The cause and mechanism examples are my illustrations (DEMO); the categories are L1's.</span></div>
 <div class="pane-box" id="q-p4" style="display:none"><div class="grid2"><div class="box feyn"><b>Repairable items</b><ul><li>Reliability = probability that failure will <i>not occur</i> in the period of interest, when more than one failure can occur.</li><li>Expressed as failure rate / rate of occurrence of failures (ROCOF).</li><li>Characterised by <b>MTBF</b>, only under the condition of a constant failure rate.</li><li>A part contributes to the system failure rate by its own amount.</li></ul></div>
  <div class="box feyn"><b>Non-repairable items</b><ul><li>Reliability = survival probability over the item's expected life, when only one failure can occur.</li><li>Instantaneous probability of the first and only failure = <b>hazard rate</b>.</li><li><b>MTTF</b> = expected life (or the age by which a certain percentage has failed).</li><li>Bulb, transistor, spacecraft part; when a part fails in a non-repairable system the system fails.</li></ul></div></div>
  <span class="src">L1 "Repairable items &amp; non-repairable items". Terminology note (L2): "failure rate" is used for both; the proper term is <i>hazard rate</i> (non-repairable) and <i>ROCOF</i> (repairable).</span></div>
 <div class="pane-box" id="q-p5" style="display:none"><div class="grid2"><div><div class="tblwrap"><table class="cover"><tr><th>Quality ("fitness for purpose")</th><th>Reliability ("continuing fitness")</th></tr><tr><td>Producer-oriented / inspector's view of acceptance</td><td>Time-based concept of acceptance</td></tr><tr><td>Not time-dependent</td><td>Time-dependent; failures in the time domain</td></tr><tr><td>Pass / fail against a specification</td><td>Latent failures can be detected</td></tr><tr><td>Patent failures removed by QC methods</td><td>Numerical estimates: failure rate, MTBF, reliability, availability, maintainability</td></tr><tr><td>Lot-dependent; AQL %</td><td>Numbers help compare two designs at bid stage</td></tr></table></div></div>
  <div><b>QC, QA, QE (L1)</b><ul><li><b>Quality control:</b> operational techniques to fulfil quality requirements. Juran's 3 steps: <i>evaluate</i> actual performance → <i>compare</i> with goals → <i>act</i> on the difference.</li><li>QC of manufacturing processes is an integral part of a reliability programme.</li></ul>
  <b>Gurus (L1):</b> Shewhart 1920s (SPC; "grandfather of quality control"), Deming 1940s (continual improvement; "father of quality control"; 14 points), Juran 1950s (quality toolbox), Crosby 1970s (quality by requirement), Galvin 1980s (micro-scale error reduction).<br><b>Evolution:</b> quality control → quality assurance → quality management → total quality management.<br><b>QC 7 tools:</b> histogram · cause-and-effect (fishbone) · check sheet · Pareto · flow chart · scatter diagram · control chart. Simulated here: Pareto 2.7, fishbone 2.8, control chart + histogram 2.9.</div></div></div>
 <div class="pane-box" id="q-p6" style="display:none"><div id="q-quiz"></div><div class="row"><span class="pill" id="q-score"></span><button class="btn sm" id="q-reset">reset</button></div><span class="src">Questions adapted from the "Let us recapitulate" slides (L1–L3); answers are my reading of the slides — the explanation under each answer says which.</span></div>
`, CH.lec + ' ' + CH.mse)}

${card('m2-ls', '2.2', 'Load–strength interference — why variation causes failure', `
 <div class="box feyn"><b>🧒 Plain words:</b> Every part has a <b>strength</b> and every use puts a <b>load</b> on it. Both vary from item to item. If every strength were above every load, nothing would ever fail. Failures happen in the <b>overlap</b> where an unlucky weak item meets an unlucky heavy load. With age, strength slides down, the curves move together, the overlap grows — that is wear-out.</div>
 <div class="box formula">Failure ⇔ L &gt; S &nbsp;|&nbsp; R = P(S &gt; L) = P(S − L &gt; 0) = Φ(z), z = (μ<sub>S</sub> − μ<sub>L</sub>) / √(σ<sub>S</sub>² + σ<sub>L</sub>²) (both normal) &nbsp;|&nbsp; safety factor = μ<sub>S</sub>/μ<sub>L</sub><br>Ageing (demo model): μ<sub>S</sub>(t) = μ<sub>S0</sub> − d·t</div>
 <div class="box tip"><b>Exam tip:</b> a safety factor greater than 1 is <i>not</i> a guarantee; only when the distributions don't overlap is R = 1. Say "variation in both load and strength; overlap should be avoided; ageing brings the curves nearer".</div>
 <div class="row"><button class="btn" id="ls-demo">Load DEMO (load 300 ± 40, strength 450 ± 30 MPa)</button><button class="btn" id="ls-sf">DEMO: big safety factor, big scatter</button><span class="pill">the lectures give the concept only — no numbers</span></div>
 <div class="grid2"><div>
  ${ctl('ls-ml', 'mean load μ_L', 50, 1000, 1, 300, 'MPa')}${ctl('ls-sl', 'load σ_L', 0, 200, 1, 40, 'MPa')}${ctl('ls-ms', 'mean strength μ_S0', 50, 1500, 1, 450, 'MPa')}${ctl('ls-ss', 'strength σ_S', 0, 200, 1, 30, 'MPa')}${ctl('ls-d', 'strength loss d', 0, 100, 1, 20, 'MPa / 1000 h')}${ctl('ls-t', 'age t', 0, 12, 0.1, 0, '×1000 h')}
 </div><div><div class="outs">${outBox('ls-z', 'z = (μ_S − μ_L)/√(σ_S²+σ_L²)')}${outBox('ls-R', 'R = Φ(z)')}${outBox('ls-F', 'P(failure) = 1 − R')}${outBox('ls-sf2', 'safety factor μ_S/μ_L')}${outBox('ls-mc', 'Monte Carlo')}</div>
  <div class="row"><button class="btn fill" id="ls-run">▶ 200 000 random (load, strength) pairs</button></div></div></div>
 <canvas class="plot" id="ls-plot" style="height:230px"></canvas><canvas class="plot" id="ls-plot2" style="height:190px;margin-top:8px"></canvas>
`, CH.lec + ' ' + CH.demo)}

${card('m2-rf', '2.3', 'The four reliability functions f(t), F(t), R(t), h(t) — and how they connect', `
 <div class="box feyn"><b>🧒 Plain words:</b> Start with <b>f(t)</b>, the "failure-time histogram" (how many fail around time t). Add it up to the left: <b>F(t)</b> = fraction failed by t. The rest, <b>R(t) = 1 − F(t)</b>, is the survivors. <b>h(t) = f(t)/R(t)</b> asks the sharper question: among those <i>still alive</i> at t, how fast are they dying? f is the overall speed of failures, h is the instantaneous (dynamic) speed.</div>
 <div class="box formula">R(t) = P(T &gt; t) = ∫<sub>t</sub><sup>∞</sup> f(x)dx = 1 − F(t), &nbsp; F(t) = ∫<sub>0</sub><sup>t</sup> f(x)dx<br>f(t) = dF/dt = −dR/dt &nbsp;|&nbsp; h(t) = f(t)/R(t) &nbsp;|&nbsp; R(t) = exp[−∫<sub>0</sub><sup>t</sup> h(x)dx] &nbsp;|&nbsp; f(t) = h(t)·R(t)<br>MTTF = ∫<sub>0</sub><sup>∞</sup> R(t)dt = ∫<sub>0</sub><sup>∞</sup> t f(t)dt</div>
 <div class="box tip"><b>Exam tip:</b> write all four with the chain h = f/R and R = e<sup>−∫h</sup>. Exponential: f = λe<sup>−λt</sup>, F = 1−e<sup>−λt</sup>, R = e<sup>−λt</sup>, h = λ (constant). Weibull: h = (β/η)(t/η)<sup>β−1</sup>.</div>
 <div class="row"><button class="btn lec" id="rf-exp">Lecture: exponential shapes (λ = 0.00008, MSE Q2c)</button><button class="btn lec" id="rf-wb">Lecture: Weibull β = 2, η = 1000 h</button><button class="btn lec" id="rf-wb05">Lecture: Weibull β = 0.5, η = 2500 h</button><button class="btn" id="rf-ln">DEMO: log-normal</button><button class="btn" id="rf-no">DEMO: normal</button><label style="margin-left:8px">distribution <select id="rf-d" data-live style="width:auto"><option value="exponential">Exponential</option><option value="weibull" selected>Weibull</option><option value="normal">Normal</option><option value="lognormal">Log-normal</option><option value="uniform">Uniform</option></select></label></div>
 <div class="grid2"><div id="rf-par"></div><div>${ctl('rf-tmax', 'plot to t =', 100, 30000, 50, 3000, 'h')}${ctl('rf-t', 'evaluate at t =', 1, 30000, 1, 500, 'h')}</div></div>
 <div class="outs">${outBox('rf-f', 'f(t)')}${outBox('rf-F', 'F(t)')}${outBox('rf-R', 'R(t) = 1 − F(t)')}${outBox('rf-h', 'h(t) = f/R')}${outBox('rf-chk', 'check R = exp(−∫h)')}${outBox('rf-mttf', 'MTTF formula')}${outBox('rf-mttf2', 'MTTF = ∫R dt (numerical)')}</div>
 <div class="grid2"><div><canvas class="plot" id="rf-pf" style="height:190px"></canvas></div><div><canvas class="plot" id="rf-pF" style="height:190px"></canvas></div><div><canvas class="plot" id="rf-pR" style="height:190px"></canvas></div><div><canvas class="plot" id="rf-ph" style="height:190px"></canvas></div></div>
 <span class="src">L2: "Exponential distributions, pdf, cdf, R(t), h(t)" (R = e^−λt, F = 1−e^−λt, f = λe^−λt, h = λ), "Failure rate / hazard rate: R(t) = ∫f, φ(t) = f(t)/R(t)". L3: Weibull formulas. Log-normal and normal formulas: L4 "Reliability characteristics distribution" table.</span>
`, CH.lec + ' ' + CH.mse + ' ' + CH.demo)}

${card('m2-eh', '2.4', 'Failure data analysis — empirical failure density and hazard from a table', `
 <div class="box feyn"><b>🧒 Plain words:</b> You don't need a formula to see the hazard — just count. In each time interval, divide the number that failed by the number <i>still alive at the start</i> and by the length of the interval. If that number keeps growing the item is wearing out; if it is flat it is in useful life; if it falls it is infant mortality. Divide by the <i>original</i> number instead and you get the failure density f(t).</div>
 <div class="box formula">h(t) ≈ (number failing in Δt) / (number surviving at start of Δt × Δt) &nbsp;|&nbsp; f(t) ≈ (number failing in Δt) / (N<sub>0</sub> × Δt) &nbsp;|&nbsp; R(t) ≈ n(t)/N<sub>0</sub> &nbsp;|&nbsp; h = f/R<br>Constant hazard: the same <i>proportion</i> of survivors fails in equal intervals (2000 switches, 1 %/month: 20, then 19, then 19 …)</div>
 <div class="box tip"><b>Exam tip:</b> the denominator of the hazard is the <b>survivors</b> (1000, 998, 995 …), not the original 1000. Quote the trend: increasing h(t) ⇒ wear-out (β &gt; 1).</div>
 <div class="row"><button class="btn lec" id="eh-bulb">Lecture: 1000 bulbs (2 in 3 mo, 3 in 2 mo, 5 in 3 mo)</button><button class="btn lec" id="eh-sw">Lecture: 2000 switches, 1 % per month</button></div>
 <div class="grid2"><div>${ctl('eh-n0', 'N₀ units at the start', 10, 100000, 1, 1000, '')}<label>Unit of time<input type="text" id="eh-u" data-live value="month"></label></div>
 <div><span class="src">Edit the table: interval length Δt and failures in that interval.</span></div></div>
 <div class="tblwrap"><table id="eh-tbl"></table></div>
 <div class="row"><button class="btn sm" id="eh-add">+ interval</button><button class="btn sm danger" id="eh-del">− last</button><span id="eh-trend" class="pill"></span></div>
 <canvas class="plot" id="eh-plot" style="height:210px"></canvas>
 <h3>Simulate a fleet and watch the empirical hazard follow the theory (Monte Carlo)</h3>
 <div class="grid2"><div>${ctl('eh-b', 'Weibull β', 0.3, 5, 0.05, 2, '')}${ctl('eh-e', 'Weibull η', 100, 5000, 50, 1000, 'h')}</div><div>${ctl('eh-N', 'fleet size', 200, 50000, 100, 5000, '')}${ctl('eh-w', 'interval width', 20, 500, 10, 100, 'h')}</div></div>
 <div class="row"><button class="btn fill" id="eh-mc">▶ Simulate fleet (DEMO Weibull)</button><span id="eh-mcout" class="mono"></span></div>
 <canvas class="plot" id="eh-plot2" style="height:230px"></canvas>
 <span class="src">L2 slides: "Constant hazard rate" (1 % of 2000 switches fail per month: 20, then 1 % of 1980 = 19 …) and bulbs: 2/(3×1000) = 0.00066, 3/(2×998) = 0.0015, 5/(3×995) = 0.0017 per month — "there is an increasing rate of h(t)". The fleet simulation uses a DEMO Weibull.</span>
`, CH.lec + ' ' + CH.demo)}

${card('m2-mx', '2.5', 'MTTF, MTBF, MTTR — operating time, outage time, availability', `
 <div class="box feyn"><b>🧒 Plain words:</b> Look at one machine's diary: <span style="color:#12915b"><b>green</b></span> stretches of working time, <span style="color:#d23b3b"><b>red</b></span> stretches of repair. <b>MTBF = average green</b>, <b>MTTR = average red</b>. λ is the same information turned upside down: failures per hour of operation. For items that cannot be repaired we speak of MTTF — and units still running when the test stops must still be counted (total time on test).</div>
 <div class="box formula">MTBF = (Σ operating time) / (number of failures) = Σt<sub>i</sub>/n &nbsp;|&nbsp; MTTR = (Σ outage time)/(number of repairs) &nbsp;|&nbsp; λ = (number of failures)/(total operating time) &nbsp;|&nbsp; MTBF = 1/λ<br>Availability = (total operating time) / (total operating time + total outage time)<br>Non-repairable with suspended units: λ̂ = r / [Σ t<sub>failed</sub> + Σ t<sub>suspended</sub>], MTTF = 1/λ̂</div>
 <div class="box tip"><b>Exam tip:</b> MTTF and MTBF are <i>not</i> the same words: MTTF for non-repairable items (time to the first and only failure), MTBF for repairable ones (between consecutive failures). MTBF = 1/λ holds only for a constant failure rate.</div>
 <div class="row"><button class="btn lec" id="mx-lec">Lecture data: uptimes 50, 30, 60, 46 d</button><button class="btn lec" id="mx-life">Non-repairable: life test 7, 12, 19, 29, 41, 67 h</button><button class="btn" id="mx-sus">+ 2 units still running at 70 h (DEMO)</button></div>
 <div class="grid2"><div><label>Operating times between failures (repairable)<input type="text" id="mx-up" data-live value="50, 30, 60, 46"></label><label>Repair (outage) times — ${CH.demo} unless you have data<input type="text" id="mx-dn" data-live value="2, 3, 1, 4"></label></div>
 <div><label>Failure times (non-repairable test)<input type="text" id="mx-ft" data-live value="7, 12, 19, 29, 41, 67"></label><label>Suspended (still running) times<input type="text" id="mx-st" data-live value=""></label></div></div>
 <div class="svgbox" id="mx-svg"></div>
 <div class="outs">${outBox('mx-mtbf', 'MTBF')}${outBox('mx-lam', 'λ = n / Σt')}${outBox('mx-mttr', 'MTTR')}${outBox('mx-av', 'availability')}${outBox('mx-mttf', 'MTTF = T / r (test)')}${outBox('mx-lam2', 'λ̂ = r / T')}</div>
 <span class="src">L2 slide "MTBF &amp; Availability concept": MTBF = total operating time / number of failures, MTTR = total outage time / number of repairs, availability = operating/(operating + outage), λ = number of failures / total operating time, MTBF = 1/λ. L2 life-test data 7, 12, 19, 29, 41, 67 h (also used in 3.7). 50, 30, 60, 46 d as in 5.2. The slide's own graph reads 1/λ ≈ 33 h by eye; the formula gives T/r = 175/6 = 29.17 h.</span>
`, CH.lec + ' ' + CH.mse + ' ' + CH.demo)}

${card('m2-bt', '2.6', 'The bathtub curve — hazard rate over a product\'s life (MSE Q2d)', `
 <div class="box feyn"><b>🧒 Plain words:</b> Think of a population of people: babies are fragile (<b>infant mortality</b>), young adults die mostly by accident (<b>useful life</b>, random), the old wear out (<b>wear-out</b>). Plot the death rate against age and you get a bathtub. For machines the three effects <b>add</b>: weak parts fail early (β &lt; 1, falling), random overloads strike at a constant rate (β = 1), ageing makes failures climb (β &gt; 1). Burn-in throws away the weak ones before shipping; planned replacement dodges the wear-out wall.</div>
 <div class="box formula">h(t) = h<sub>early</sub>(t) + λ + h<sub>wear</sub>(t), with Weibull parts h(t) = (β/η)(t/η)<sup>β−1</sup>: β &lt; 1 DFR (early life) · β = 1 CFR (useful life) · β &gt; 1 IFR (wear-out)<br>Phases (MSE Q2d): <b>Infant mortality</b> — defects, workmanship, material flaws, installation errors; controlled by screening, burn-in, inspection. <b>Useful life</b> — random failures from unexpected stress; constant hazard assumed in most analyses. <b>Wear-out</b> — ageing, fatigue, corrosion, degradation; managed by preventive maintenance and replacement.</div>
 <div class="box tip"><b>Exam tip (4 M):</b> draw the curve with axes "time" and "failure rate (hazard) h(t)", label the 3 regions, give <i>causes</i> and <i>controls</i> for each (1 M sketch + 1 M each). Mention that real items rarely show the full bathtub (second tab: Nowlan &amp; Heap).</div>
 <div class="row"><button class="btn lec" id="bt-mse">Load MSE Q2d bathtub (β&lt;1, β=1, β&gt;1)</button><button class="btn" id="bt-burn">DEMO: add a 300 h burn-in</button><button class="btn pane2 on" data-pane="bt-a">Interactive bathtub</button><button class="btn pane2" data-pane="bt-b">Six failure patterns (Nowlan &amp; Heap)</button></div>
 <div id="bt-a"><div class="grid2"><div><b>Early life (infant mortality)</b>${ctl('bt-b1', 'β₁ (&lt; 1)', 0.2, 0.95, 0.01, 0.5, '')}${ctl('bt-e1', 'η₁', 500, 50000, 100, 8000, 'h')}<b>Useful life (random)</b>${ctl('bt-l', 'λ constant', 0.00001, 0.002, 0.00001, 0.0002, '/h')}</div>
  <div><b>Wear-out</b>${ctl('bt-b3', 'β₃ (&gt; 1)', 1.2, 10, 0.1, 4, '')}${ctl('bt-e3', 'η₃', 500, 20000, 50, 3500, 'h')}<b>Display</b>${ctl('bt-tm', 'plot to t =', 500, 10000, 100, 4500, 'h')}${ctl('bt-bi', 'burn-in time', 0, 2000, 10, 0, 'h')}</div></div>
  <div class="outs">${outBox('bt-hmin', 'minimum hazard')}${outBox('bt-tmin', 'at t =')}${outBox('bt-use', 'useful-life window (h ≤ 1.2 h<sub>min</sub>)')}${outBox('bt-scr', 'screened out by burn-in F(burn-in)')}</div>
  <canvas class="plot" id="bt-plot" style="height:260px"></canvas>
  <div class="row">${ctl('bt-N', 'simulated units', 500, 50000, 500, 8000, '')}<button class="btn fill" id="bt-mc">▶ Simulate N units (Monte Carlo)</button><span id="bt-mcout" class="mono"></span></div>
  <canvas class="plot" id="bt-plot2" style="height:210px"></canvas><span class="src">Dots = empirical hazard of the simulated population; lines = theory. Colours in the histogram show which failure mechanism killed each unit. All parameter values are DEMO, chosen to give a clear bathtub.</span></div>
 <div id="bt-b" style="display:none"><div class="svgbox" id="bt-pat"></div><div class="box note">Slide "Significance of bathtub curve" (Nowlan &amp; Heap, aircraft maintenance study): only <b>11 %</b> of component types show an age-related failure pattern (A, B, C); <b>89 %</b> are random (D, E, F). Only 4 % follow the classical bathtub (B). The slide prints F as 69 % on one version and 68 % on another; 2+4+5+7+14+68 = 100, so 68 % is consistent. <b>Lesson:</b> age-based replacement helps only a minority; for the rest use condition monitoring.</div></div>
 <div class="tblwrap"><table class="cover"><tr><th>Region</th><th>β</th><th>hazard</th><th>causes</th><th>control</th></tr><tr><td>Infant mortality (early life)</td><td>&lt; 1</td><td>high, decreasing (DFR)</td><td>manufacturing defects, poor workmanship, material flaws, installation errors</td><td>screening, burn-in, quality inspection</td></tr><tr><td>Useful life (normal life)</td><td>= 1</td><td>≈ constant (CFR)</td><td>random, unexpected stresses or chance events</td><td>design margin, monitoring; constant-hazard analysis</td></tr><tr><td>Wear-out</td><td>&gt; 1</td><td>increasing (IFR)</td><td>ageing, fatigue, corrosion, material degradation</td><td>preventive maintenance, replacement policy</td></tr></table></div>
 <span class="src">L3: bathtub with β &lt; 1, β = 1, β &gt; 1 and η; composite of several failure distributions; software bathtub (burn-in/test and debug → useful life with upgrades → obsolescence), HASS / HALT hazard function. MSE Q2d model answer for phases.</span>
`, CH.mse + ' ' + CH.lec + ' ' + CH.demo)}

${card('m2-pa', '2.7', 'Pareto chart — find the vital few (quality-control tool 1)', `
 <div class="box feyn"><b>🧒 Plain words:</b> Count each type of defect or downtime, sort the bars from tallest to shortest, and add a running-total line. Usually a <b>few causes</b> produce <b>most of the trouble</b> (the 80/20 rule). Fix those first.</div>
 <div class="box formula">Pareto principle (≈ 80/20): about 80 % of the effects come from 20 % of the causes. Cumulative % = (running total / grand total) × 100.<br>Bars: descending frequency · line: cumulative percentage · "vital few" vs "trivial many"</div>
 <div class="box tip"><b>Exam tip (MSE Q3b):</b> define QC (monitor, inspect, test, correct to meet standards; aim = consistency, reliability, less waste, satisfaction) then give two tools. Pareto: bar graph of problems in descending order of frequency (1.5 M), based on the 80/20 rule, shows the few critical causes, prioritises improvement.</div>
 <div class="row"><button class="btn" id="pa-lost">DEMO: lost-time Pareto (shape like the L2 slide)</button><button class="btn" id="pa-cnc">DEMO: CNC machine downtime causes</button><button class="btn" id="pa-add">+ category</button><button class="btn danger" id="pa-del">− last</button></div>
 <div class="tblwrap"><table id="pa-tbl"></table></div>
 <div class="outs">${outBox('pa-tot', 'total')}${outBox('pa-few', 'vital few (to reach 80 %)')}${outBox('pa-fp', 'share of the vital few')}</div>
 <div class="svgbox" id="pa-svg"></div>
 <span class="src">L2 slides "Quality control tools": Pareto chart (descending frequency, cumulative line), "Lost time Pareto chart", "vital few / trivial many". The numbers here are DEMO.</span>
`, CH.mse + ' ' + CH.lec + ' ' + CH.demo)}

${card('m2-fb', '2.8', 'Ishikawa (fishbone / cause-and-effect) diagram — quality-control tool 2', `
 <div class="box feyn"><b>🧒 Plain words:</b> Write the problem (the "fish head") at the right. Draw a spine to it. Each big bone is a family of possible causes — Man, Machine, Material, Method, Measurement, Environment. Hang the specific causes on the bones. It makes a team <i>think of every cause systematically</i> before guessing.</div>
 <div class="box formula">Effect (problem) ← causes grouped in categories (the 6 M's): <b>Man · Machine · Material · Method · Measurement · Environment</b><br>Developed by Kaoru Ishikawa; also called cause-and-effect diagram</div>
 <div class="box tip"><b>Exam tip (MSE Q3b, 1.5 M):</b> name Ishikawa; say it identifies and analyses <i>root causes</i>; list the six categories; add "helps teams investigate quality issues systematically and implement corrective actions". Draw a small fish with 3 bones.</div>
 <div class="row"><button class="btn lec" id="fb-lec">Lecture slide: "diameter out of specification"</button><button class="btn" id="fb-mse">DEMO with the MSE six categories</button></div>
 <label>Effect (problem)<input type="text" id="fb-eff" data-live value="Diameter out of specification"></label>
 <div class="grid3" id="fb-cats"></div>
 <div class="svgbox"><div id="fb-svg"></div></div>
 <span class="src">L2 slide "Quality control tools" fishbone: Material · Measurement · Machine · Method · Environment · Employee, effect "Diameter out of specification" (causes as read from the slide). MSE Q3b model answer: Man, Machine, Material, Method, Measurement, Environment.</span>
`, CH.mse + ' ' + CH.lec + ' ' + CH.demo)}

${card('m2-cc', '2.9', 'Control charts (statistical process control) and histogram', `
 <div class="box feyn"><b>🧒 Plain words:</b> Measure a few items every hour and plot the average on a chart with a centre line and two fences (control limits) three standard errors either side. As long as the dots wander randomly between the fences, the process is "in control". A dot outside, or a long run on one side, says "something changed — go and look". Control charts are how <b>quality control</b> keeps the process steady so that reliability is not designed-in and then lost in manufacturing.</div>
 <div class="box formula">X̄ chart: CL = μ<sub>0</sub> &nbsp; UCL = μ<sub>0</sub> + 3σ/√n &nbsp; LCL = μ<sub>0</sub> − 3σ/√n<br>Signal probability per point (shift δσ): p = Φ(−3 − δ√n) + 1 − Φ(3 − δ√n) &nbsp;⇒&nbsp; average run length ARL = 1/p (δ = 0: ARL<sub>0</sub> = 370.4)<br>Individuals chart: CL = x̄, UCL/LCL = x̄ ± 2.66·MR̄ (MR̄ = mean moving range)</div>
 <div class="box tip"><b>Exam tip:</b> control limits are <i>voice of the process</i> (from data), specification limits are <i>voice of the customer</i> — never mix them. In the slide's picture: upper control limit, target value, lower control limit, time on the x-axis.</div>
 <div class="row"><button class="btn" id="cc-in">DEMO: process in control</button><button class="btn" id="cc-sh">DEMO: mean shifts +1.5σ at subgroup 16</button><button class="btn fill" id="cc-gen">▶ generate new random data</button></div>
 <div class="grid2"><div>${ctl('cc-m', 'target μ₀', 10, 200, 0.5, 50, '')}${ctl('cc-s', 'process σ', 0.2, 20, 0.1, 2, '')}${ctl('cc-n', 'subgroup size n', 1, 15, 1, 5, '')}</div><div>${ctl('cc-k', 'number of subgroups', 10, 60, 1, 30, '')}${ctl('cc-d', 'shift δ (in σ)', 0, 3, 0.1, 0, 'σ')}${ctl('cc-at', 'shift starts at subgroup', 2, 60, 1, 16, '')}</div></div>
 <div class="outs">${outBox('cc-ucl', 'UCL')}${outBox('cc-lcl', 'LCL')}${outBox('cc-sig', 'signals (3σ or 8-in-a-row)')}${outBox('cc-first', 'first signal at subgroup')}${outBox('cc-p', 'P(signal) per point · ARL (theory)')}</div>
 <canvas class="plot" id="cc-plot" style="height:240px"></canvas>
 <canvas class="plot" id="cc-hist" style="height:170px;margin-top:8px"></canvas>
 <h3>How quickly does the chart notice a shift? (average run length)</h3>
 <div class="row"><button class="btn fill" id="cc-arl">▶ Monte Carlo ARL table for this n (rule 1 only)</button></div><div class="tblwrap"><table id="cc-arlt"></table></div>
 <h3>Individuals chart from your own data</h3>
 <label>Paste measurements in time order<input type="text" id="cc-own" data-live value="50.2, 49.1, 51.0, 50.4, 49.7, 50.9, 51.3, 49.5, 50.1, 50.8, 49.9, 51.1, 50.6, 53.9, 50.3"></label>
 <div class="outs">${outBox('cc-oc', 'CL = x̄')}${outBox('cc-ol', 'LCL / UCL (±2.66 MR̄)')}${outBox('cc-oo', 'points outside')}</div><canvas class="plot" id="cc-oplot" style="height:200px"></canvas>
 <span class="src">L2 slide "Quality control tools": histogram and statistical process control chart (upper control limit, target value, lower control limit). Shewhart (1920s) is the "grandfather of quality control". Chart parameters and data are DEMO; the formulas are standard Shewhart limits (the slides show only the picture).</span>
`, CH.pred + ' ' + CH.demo)}
`;

/* ===== 2.1 deck ===== */
(function () {
  const sec = el('m2-deck');
  sec.addEventListener('click', e => { const b = e.target.closest('button.pane'); if (!b) return; sec.querySelectorAll('button.pane').forEach(x => x.classList.toggle('on', x === b)); sec.querySelectorAll('.pane-box').forEach(p => p.style.display = p.id === b.dataset.pane ? '' : 'none'); });
  on('q-mse', 'click', () => { const a = el('q-mseans'); a.style.display = a.style.display === 'none' ? '' : 'none'; });
  let ans = {};
  function render() {
    el('q-quiz').innerHTML = QUIZ.map((q, i) => `<div class="box ${ans[i] === undefined ? 'note' : (ans[i] === q[2] ? 'good' : 'warn')}"><b>${i + 1}.</b> ${esc(q[0])}<div class="row">${q[1].map((o, j) => `<label style="margin-right:12px"><input type="radio" name="qq${i}" data-q="${i}" data-o="${j}" ${ans[i] === j ? 'checked' : ''}> ${esc(o)}</label>`).join('')}</div>${ans[i] === undefined ? '' : `<div class="src"><b>${ans[i] === q[2] ? '✓ correct' : '✗ answer: ' + esc(q[1][q[2]])}</b> — ${esc(q[3])}</div>`}</div>`).join('');
    const done = Object.keys(ans).length, ok = Object.keys(ans).filter(i => ans[i] === QUIZ[i][2]).length; el('q-score').textContent = `score ${ok} / ${done} answered (of ${QUIZ.length})`;
  }
  sec.addEventListener('change', e => { const t = e.target; if (t.dataset && t.dataset.q !== undefined) { ans[+t.dataset.q] = +t.dataset.o; render(); } });
  on('q-reset', 'click', () => { ans = {}; render(); }); render();
})();

/* ===== 2.2 load–strength ===== */
(function () {
  const sec = el('m2-ls'), p1 = mkPlot('ls-plot', { xlabel: 'stress / strength (MPa)', ylabel: 'density', xmin: 0, xmax: 1, ymin: 0, ymax: 1 }), p2 = mkPlot('ls-plot2', { xlabel: 'age (×1000 h)', ylabel: 'R = P(S > L)', xmin: 0, xmax: 12, ymin: 0, ymax: 1 });
  const Rof = (ml, sl, ms, ss) => { const sd = Math.hypot(sl, ss); return sd === 0 ? (ms > ml ? 1 : 0) : Phi((ms - ml) / sd); };
  function calc() {
    const ml = V('ls-ml'), sl = V('ls-sl'), ms0 = V('ls-ms'), ss = V('ls-ss'), d = V('ls-d'), t = V('ls-t'), ms = ms0 - d * t, sd = Math.hypot(sl, ss), R = Rof(ml, sl, ms, ss);
    setBox('ls-z', sd ? ((ms - ml) / sd).toFixed(3) : (ms > ml ? '+∞' : '−∞'), 'z = (μ_S − μ_L)/√(σ_S²+σ_L²)'); setBox('ls-R', R.toFixed(5), 'R = Φ(z)', 'hi'); setBox('ls-F', sci(1 - R, 3), 'P(failure) = P(L > S)', R < 0.99 ? 'bad' : ''); setBox('ls-sf2', (ms / ml).toFixed(3), 'safety factor μ_S(t)/μ_L');
    const lo = Math.max(0, Math.min(ml - 4 * sl, ms - 4 * ss) - 10), hi = Math.max(ml + 4 * sl, ms0 + 4 * ss) + 10, fl = x => sl > 0 ? phiPdf((x - ml) / sl) / sl : 0, fs = x => ss > 0 ? phiPdf((x - ms) / ss) / ss : 0;
    const ov = []; for (let i = 0; i <= 240; i++) { const x = lo + (hi - lo) * i / 240; ov.push([x, Math.min(fl(x), fs(x))]); }
    p1.set([{ name: 'load', color: '#d98200', f: fl }, { name: `strength at age ${t}`, color: '#2457d6', f: fs }, { name: 'overlap (visual cue)', color: '#d23b3b', fill: 'rgba(210,59,59,.3)', pts: ov }], { axes: { xmin: lo, xmax: hi, ymin: 0, ymax: Math.max(sl ? 1 / (sl * 2.5) : 0, ss ? 1 / (ss * 2.5) : 0, 0.001) * 1.2 } });
    p2.set([{ name: 'R(age)', color: '#12915b', f: a => Rof(ml, sl, ms0 - d * a, ss) }], { axes: { xmin: 0, xmax: 12, ymin: 0, ymax: 1 }, marks: [{ x: t, y: R, label: R.toFixed(4) }] });
  }
  wire(sec, calc);
  on('ls-demo', 'click', () => { setV('ls-ml', 300); setV('ls-sl', 40); setV('ls-ms', 450); setV('ls-ss', 30); setV('ls-d', 20); setV('ls-t', 0); calc(); });
  on('ls-sf', 'click', () => { setV('ls-ml', 200); setV('ls-sl', 60); setV('ls-ms', 500); setV('ls-ss', 90); setV('ls-d', 10); setV('ls-t', 0); calc(); });
  on('ls-run', 'click', () => { const N = 200000, ml = V('ls-ml'), sl = V('ls-sl'), ms = V('ls-ms') - V('ls-d') * V('ls-t'), ss = V('ls-ss'); let f = 0; for (let i = 0; i < N; i++) if (ml + sl * rnorm() > ms + ss * rnorm()) f++; setBox('ls-mc', (1 - f / N).toFixed(5), `Monte Carlo R, ${f} failures in ${N}`, 'hi'); });
  calc();
})();

/* ===== 2.3 f F R h ===== */
(function () {
  const sec = el('m2-rf');
  const PAR = {
    exponential: [['l', 'λ', 0.00001, 0.05, 0.00001, 0.001, '/h'], ['g', 'γ (shift)', 0, 1000, 10, 0, 'h']],
    weibull: [['b', 'β shape', 0.2, 8, 0.05, 2, ''], ['e', 'η scale', 50, 10000, 10, 1000, 'h'], ['g', 'γ (shift)', 0, 1000, 10, 0, 'h']],
    normal: [['m', 'μ', 10, 10000, 10, 1000, 'h'], ['s', 'σ', 10, 3000, 10, 250, 'h']],
    lognormal: [['m', 'μ (of ln t)', 1, 10, 0.05, 6.9, ''], ['s', 'σ (of ln t)', 0.1, 1.5, 0.05, 0.5, '']],
    uniform: [['a', 'a (min)', 0, 5000, 10, 0, 'h'], ['b', 'b (max)', 100, 10000, 10, 2000, 'h']]
  };
  const plots = { f: mkPlot('rf-pf', { xlabel: 't (h)', ylabel: 'f(t)' }), F: mkPlot('rf-pF', { xlabel: 't (h)', ylabel: 'F(t)' }), R: mkPlot('rf-pR', { xlabel: 't (h)', ylabel: 'R(t)' }), h: mkPlot('rf-ph', { xlabel: 't (h)', ylabel: 'h(t)' }) };
  let cur = '';
  function build(kind, vals) { cur = kind; el('rf-par').innerHTML = PAR[kind].map(p => ctl('rf-' + p[0], p[1], p[2], p[3], p[4], vals && vals[p[0]] !== undefined ? vals[p[0]] : p[5], p[6])).join(''); }
  const getD = () => { const p = {}; PAR[cur].forEach(q => p[q[0]] = V('rf-' + q[0])); return DIST[cur](p); };
  function calc() {
    const kind = el('rf-d').value; if (kind !== cur) build(kind);
    const D = getD(), tm = V('rf-tmax'), t = V('rf-t');
    const f = D.f(t), F = D.F(t), R = D.R(t), h = D.h(t), H = simpson(D.h, 0, Math.max(t, 1e-9), 600);
    setBox('rf-f', nice(f), 'f(t) = dF/dt'); setBox('rf-F', f4(F), 'F(t) = ∫f dt'); setBox('rf-R', f4(R), 'R(t) = 1 − F(t)', 'hi'); setBox('rf-h', nice(h), 'h(t) = f(t)/R(t)');
    setBox('rf-chk', isFinite(H) ? `${f4(Math.exp(-H))} vs ${f4(R)}` : '—', 'exp(−∫₀ᵗ h dx) vs R(t)');
    const tq = D.q ? D.q(1 - 1e-7) : tm * 5, mt2 = simpson(D.R, 0, isFinite(tq) ? tq : tm * 5, 4000);
    setBox('rf-mttf', nice(D.mean), kind === 'weibull' ? 'γ + ηΓ(1+1/β)' : kind === 'exponential' ? 'γ + 1/λ' : kind === 'lognormal' ? 'exp(μ + σ²/2)' : kind === 'normal' ? 'μ' : '(a+b)/2'); setBox('rf-mttf2', nice(mt2), '∫₀^∞ R(t) dt');
    const base = { xmin: 0, xmax: tm };
    let fmax = 0, hmax = 0; for (let i = 0; i <= 200; i++) { const x = tm * i / 200, a = D.f(x), b = D.h(x); if (isFinite(a)) fmax = Math.max(fmax, a); if (isFinite(b)) hmax = Math.max(hmax, b); }
    const mk = (fn, nm, c) => [{ name: nm, color: c, f: fn }];
    plots.f.set(mk(D.f, 'f(t) pdf', '#2457d6'), { axes: { ...base, ymin: 0, ymax: fmax * 1.1 || 1 }, marks: [{ x: t, y: Math.min(f, fmax * 1.1) }] });
    plots.F.set(mk(D.F, 'F(t) cdf', '#d98200'), { axes: { ...base, ymin: 0, ymax: 1 }, marks: [{ x: t, y: F }] });
    plots.R.set(mk(D.R, 'R(t)', '#12915b'), { axes: { ...base, ymin: 0, ymax: 1 }, marks: [{ x: t, y: R }] });
    plots.h.set(mk(D.h, 'h(t) hazard', '#d23b3b'), { axes: { ...base, ymin: 0, ymax: Math.min(hmax, 50 * (D.h(tm * 0.2) || hmax)) * 1.1 || 1 }, marks: [{ x: t, y: isFinite(h) ? h : 0 }] });
  }
  wire(sec, calc);
  const L = (kind, vals, tmax, t) => { el('rf-d').value = kind; build(kind, vals); setV('rf-tmax', tmax); setV('rf-t', t); calc(); };
  on('rf-exp', 'click', () => L('exponential', { l: 0.00008, g: 0 }, 25000, 8000)); on('rf-wb', 'click', () => L('weibull', { b: 2, e: 1000, g: 0 }, 2500, 500)); on('rf-wb05', 'click', () => L('weibull', { b: 0.5, e: 2500, g: 0 }, 8000, 1500));
  on('rf-ln', 'click', () => L('lognormal', { m: 6.9, s: 0.5 }, 4000, 1000)); on('rf-no', 'click', () => L('normal', { m: 1000, s: 250 }, 2500, 800));
  build('weibull', { b: 2, e: 1000, g: 0 }); calc();
})();

/* ===== 2.4 empirical hazard ===== */
(function () {
  const sec = el('m2-eh'), plot = mkPlot('eh-plot', { xlabel: 'time', ylabel: 'hazard per unit time', xmin: 0, xmax: 1, ymin: 0, ymax: 1 }), p2 = mkPlot('eh-plot2', { xlabel: 'age (h)', ylabel: 'hazard h(t) (per h)', xmin: 0, xmax: 1, ymin: 0, ymax: 1 });
  let rows = [{ dt: 3, d: 2 }, { dt: 2, d: 3 }, { dt: 3, d: 5 }];
  function table() { el('eh-tbl').innerHTML = '<tr><th>#</th><th>Δt</th><th>failures</th><th>alive at start n<sub>i</sub></th><th>h = d/(n·Δt)</th><th>f = d/(N₀·Δt)</th><th>R at end = n/N₀</th><th>f/R(start) check</th></tr>' + rows.map((r, i) => `<tr><td>${i + 1}</td><td><input type="number" step="any" data-eh="dt" data-i="${i}" value="${r.dt}"></td><td><input type="number" step="1" data-eh="d" data-i="${i}" value="${r.d}"></td><td id="ehr-n${i}"></td><td id="ehr-h${i}"></td><td id="ehr-f${i}"></td><td id="ehr-r${i}"></td><td id="ehr-c${i}"></td></tr>`).join(''); }
  sec.addEventListener('input', e => { const t = e.target; if (t.dataset && t.dataset.eh) { rows[+t.dataset.i][t.dataset.eh] = parseFloat(t.value) || 0; calc(); } });
  function calc() {
    const N0 = V('eh-n0'), u = el('eh-u').value || 'unit'; let n = N0, T = 0; const hs = [], pts = [];
    rows.forEach((r, i) => { const h = r.dt > 0 && n > 0 ? r.d / (n * r.dt) : 0, f = r.d / (N0 * r.dt || 1), Rs = n / N0, Re = (n - r.d) / N0;
      el('ehr-n' + i).textContent = n; el('ehr-h' + i).textContent = (+h.toPrecision(3)).toString(); el('ehr-f' + i).textContent = (+f.toPrecision(3)).toString(); el('ehr-r' + i).textContent = Re.toFixed(4); el('ehr-c' + i).textContent = (+(f / Rs).toPrecision(3)).toString();
      pts.push([T, h]); hs.push(h); n -= r.d; T += r.dt; });
    pts.push([T, hs[hs.length - 1] || 0]); const first = hs[0], last = hs[hs.length - 1], ratio = first ? last / first : 1;
    el('eh-trend').textContent = rows.length < 2 ? '—' : ratio > 1.15 ? 'hazard rising ⇒ wear-out (β > 1)' : ratio < 0.87 ? 'hazard falling ⇒ infant mortality (β < 1)' : 'hazard ≈ constant ⇒ useful life (β ≈ 1)';
    plot.set([{ name: `hazard per ${u}`, color: '#d23b3b', step: true, pts }], { axes: { xmin: 0, xmax: T, ymin: 0, ymax: Math.max(...hs, 1e-9) * 1.25 } });
  }
  wire(sec, calc);
  on('eh-add', 'click', () => { rows.push({ dt: rows.length ? rows[rows.length - 1].dt : 1, d: 0 }); table(); calc(); });
  on('eh-del', 'click', () => { if (rows.length > 1) { rows.pop(); table(); calc(); } });
  on('eh-bulb', 'click', () => { rows = [{ dt: 3, d: 2 }, { dt: 2, d: 3 }, { dt: 3, d: 5 }]; setV('eh-n0', 1000); el('eh-u').value = 'month'; table(); calc(); });
  on('eh-sw', 'click', () => { let n = 2000; rows = []; for (let i = 0; i < 6; i++) { const d = Math.floor(0.01 * n); rows.push({ dt: 1, d }); n -= d; } setV('eh-n0', 2000); el('eh-u').value = 'month'; table(); calc(); });
  on('eh-mc', 'click', () => {
    const b = V('eh-b'), e = V('eh-e'), N = Math.round(V('eh-N')), w = V('eh-w'), D = DIST.weibull({ b, e }), tm = Math.ceil(D.q(0.97) / w) * w, nb = Math.max(2, Math.round(tm / w)), cnt = new Array(nb).fill(0);
    for (let i = 0; i < N; i++) { const t = rweib(b, e); const k = Math.floor(t / w); if (k < nb) cnt[k]++; }
    let alive = N; const pts = []; for (let k = 0; k < nb; k++) { if (alive > 5) pts.push([(k + 0.5) * w, cnt[k] / (alive * w)]); alive -= cnt[k]; }
    const mxe = Math.max(...pts.map(p => p[1]));
    p2.set([{ name: 'theory h(t)', color: '#2457d6', f: t => D.h(Math.max(t, 1e-6)) }, { name: 'empirical (failures ÷ survivors ÷ width)', color: '#d23b3b', dots: true, nolines: true, pts }], { axes: { xmin: 0, xmax: tm, ymin: 0, ymax: Math.min(D.h(tm), mxe * 3) * 1.15 || mxe * 1.3 } });
    el('eh-mcout').textContent = `${N} units, first interval hazard ${pts.length ? sci(pts[0][1], 3) : '—'}, last ${pts.length ? sci(pts[pts.length - 1][1], 3) : '—'}`;
  });
  table(); calc();
})();

/* ===== 2.5 MTTF / MTBF / MTTR ===== */
(function () {
  const sec = el('m2-mx');
  function calc() {
    const up = parseList(el('mx-up').value), dn = parseList(el('mx-dn').value), n = up.length, S = up.reduce((s, x) => s + x, 0);
    const mtbf = n ? S / n : NaN, lam = S ? n / S : NaN, mttr = dn.length ? dn.reduce((s, x) => s + x, 0) / dn.length : NaN, av = dn.length ? S / (S + dn.reduce((s, x) => s + x, 0)) : NaN;
    setBox('mx-mtbf', nice(mtbf), 'MTBF = Σt/n', 'hi'); setBox('mx-lam', nice(lam), `λ = n/Σt; 1/λ = ${nice(1 / lam)}`); setBox('mx-mttr', nice(mttr), 'MTTR = Σ outage / repairs'); setBox('mx-av', isFinite(av) ? f4(av) : '—', 'Σop / (Σop + Σout)');
    const ft = parseList(el('mx-ft').value), st = parseList(el('mx-st').value), r = ft.length, Tt = ft.reduce((s, x) => s + x, 0) + st.reduce((s, x) => s + x, 0);
    setBox('mx-mttf', nice(r ? Tt / r : NaN), `T = ${nice(Tt)} unit-h, r = ${r}`, 'hi'); setBox('mx-lam2', nice(r ? r / Tt : NaN), st.length ? `with ${st.length} suspended unit(s) counted` : 'no suspended units');
    const tot = S + dn.reduce((s, x) => s + x, 0) || 1, W = 700, sc = (W - 20) / tot; let x = 10, svg = `<svg width="${W}" height="64" viewBox="0 0 ${W} 64" style="max-width:100%">`;
    for (let i = 0; i < n; i++) { const w1 = up[i] * sc; svg += `<rect x="${x}" y="8" width="${w1}" height="26" fill="#12915b" rx="3"/><text x="${x + w1 / 2}" y="26" text-anchor="middle" font-size="11" fill="#fff">t${i + 1}=${up[i]}</text>`; x += w1; if (dn[i] !== undefined) { const w2 = dn[i] * sc; svg += `<rect x="${x}" y="8" width="${Math.max(2, w2)}" height="26" fill="#d23b3b" rx="3"/>`; if (w2 > 22) svg += `<text x="${x + w2 / 2}" y="26" text-anchor="middle" font-size="10" fill="#fff">${dn[i]}</text>`; x += w2; } }
    svg += `<text x="10" y="54" font-size="11.5" fill="#475569">green = operating (MTBF = average green) · red = outage / repair (MTTR = average red) · failure at the end of each green strip</text></svg>`; el('mx-svg').innerHTML = svg;
  }
  wire(sec, calc);
  on('mx-lec', 'click', () => { el('mx-up').value = '50, 30, 60, 46'; el('mx-dn').value = '2, 3, 1, 4'; calc(); });
  on('mx-life', 'click', () => { el('mx-ft').value = '7, 12, 19, 29, 41, 67'; el('mx-st').value = ''; calc(); });
  on('mx-sus', 'click', () => { el('mx-st').value = '70, 70'; calc(); });
  calc();
})();

/* ===== 2.6 bathtub ===== */
(function () {
  const sec = el('m2-bt'), plot = mkPlot('bt-plot', { xlabel: 'time t (h)', ylabel: 'hazard rate h(t)', xmin: 0, xmax: 1, ymin: 0, ymax: 1 }), p2 = mkPlot('bt-plot2', { xlabel: 't (h)', ylabel: 'hazard (per h)', xmin: 0, xmax: 1, ymin: 0, ymax: 1 });
  sec.addEventListener('click', e => { const b = e.target.closest('button.pane2'); if (!b) return; sec.querySelectorAll('button.pane2').forEach(x => x.classList.toggle('on', x === b)); ['bt-a', 'bt-b'].forEach(i => el(i).style.display = i === b.dataset.pane ? '' : 'none'); });
  const wh = (b, e) => t => t <= 0 ? (b < 1 ? 1e3 : 0) : (b / e) * Math.pow(t / e, b - 1);
  function parts() { const b1 = V('bt-b1'), e1 = V('bt-e1'), l = V('bt-l'), b3 = V('bt-b3'), e3 = V('bt-e3'); return { b1, e1, l, b3, e3, h1: wh(b1, e1), h2: () => l, h3: wh(b3, e3) }; }
  function calc() {
    const P = parts(), tm = V('bt-tm'), bi = V('bt-bi'), H = t => P.h1(t) + P.l + P.h3(t);
    let best = Infinity, tb = 0; for (let i = 1; i <= 2000; i++) { const t = tm * i / 2000, v = H(t); if (v < best) { best = v; tb = t; } }
    let lo = null, hi = null; for (let i = 1; i <= 2000; i++) { const t = tm * i / 2000; if (H(t) <= 1.2 * best) { if (lo === null) lo = t; hi = t; } }
    setBox('bt-hmin', sci(best, 3), 'min of h₁ + λ + h₃', 'hi'); setBox('bt-tmin', nice(tb), 'h'); 
    setBox('bt-use', lo === null ? '—' : `${nice(lo)} – ${nice(hi)} h`, 'flat part of the tub'); 
    const Fb = bi > 0 ? 1 - Math.exp(-(Math.pow(bi / P.e1, P.b1) + P.l * bi + Math.pow(bi / P.e3, P.b3))) : 0; setBox('bt-scr', (100 * Fb).toFixed(2) + ' %', 'fraction failing in burn-in (weeded out)');
    const ymax = Math.min(Math.max(H(tm), best * 6), best * 30) * 1.05;
    const s = [{ name: 'early life h₁ (β<1)', color: '#d98200', dash: [5, 4], f: t => P.h1(Math.max(t, 1)) }, { name: 'useful life λ', color: '#12915b', dash: [5, 4], f: () => P.l }, { name: 'wear-out h₃ (β>1)', color: '#7a3fd0', dash: [5, 4], f: P.h3 }, { name: 'total hazard h(t)', color: '#d23b3b', f: t => H(Math.max(t, 1)) }];
    const marks = []; if (bi > 0) marks.push({ x: bi, y: H(bi), label: 'after burn-in' });
    plot.set(s, { axes: { xmin: 0, xmax: tm, ymin: 0, ymax }, vlines: bi > 0 ? [{ x: bi, label: 'burn-in', color: '#2457d6' }] : [], marks });
  }
  wire(sec, calc);
  on('bt-mse', 'click', () => { setV('bt-b1', 0.5); setV('bt-e1', 8000); setV('bt-l', 0.0002); setV('bt-b3', 4); setV('bt-e3', 3500); setV('bt-tm', 4500); setV('bt-bi', 0); calc(); });
  on('bt-burn', 'click', () => { setV('bt-bi', 300); calc(); });
  on('bt-mc', 'click', () => {
    const P = parts(), N = Math.round(V('bt-N')), tm = V('bt-tm'), nb = 30, w = tm / nb, cnt = new Array(nb).fill(0), c1 = new Array(nb).fill(0), c2 = new Array(nb).fill(0), c3 = new Array(nb).fill(0);
    for (let i = 0; i < N; i++) { const t1 = rweib(P.b1, P.e1), t2 = rexp(P.l), t3 = rweib(P.b3, P.e3), t = Math.min(t1, t2, t3), k = Math.floor(t / w); if (k < nb) { cnt[k]++; (t === t1 ? c1 : t === t2 ? c2 : c3)[k]++; } }
    let alive = N; const pts = []; let shares = [0, 0, 0]; for (let k = 0; k < nb; k++) { if (alive > 5) pts.push([(k + 0.5) * w, cnt[k] / (alive * w)]); alive -= cnt[k]; shares[0] += c1[k]; shares[1] += c2[k]; shares[2] += c3[k]; }
    const H = t => P.h1(Math.max(t, 1)) + P.l + P.h3(t), best = Math.min(...pts.map(p => p[1]));
    p2.set([{ name: 'theory h(t)', color: '#d23b3b', f: t => H(Math.max(t, 1)) }, { name: 'empirical hazard', color: '#2457d6', dots: true, nolines: true, pts }], { axes: { xmin: 0, xmax: tm, ymin: 0, ymax: Math.min(Math.max(...pts.map(p => p[1])), best * 20) * 1.1 } });
    const tot = shares[0] + shares[1] + shares[2] || 1; el('bt-mcout').textContent = `${N} units; deaths by cause: early ${(100 * shares[0] / tot).toFixed(0)} % · random ${(100 * shares[1] / tot).toFixed(0)} % · wear-out ${(100 * shares[2] / tot).toFixed(0)} %`;
  });
  /* Nowlan & Heap patterns */
  const pat = [['A', '4 %', 'bathtub (infant + random + wear-out)', 'M0,10 C6,60 14,40 24,40 L44,40 C52,40 58,0 62,0'], ['B', '2 %', 'constant, then wear-out', 'M0,40 L36,40 C50,40 55,5 62,0'], ['C', '5 %', 'gradually increasing', 'M0,45 L62,8'], ['D', '7 %', 'low at first, then constant', 'M0,48 C8,40 12,28 20,28 L62,28'], ['E', '14 %', 'constant (random)', 'M0,26 L62,26'], ['F', '68 %', 'infant mortality, then constant', 'M0,2 C6,30 16,40 26,40 L62,40']];
  el('bt-pat').innerHTML = '<svg width="720" height="190" viewBox="0 0 720 190" style="max-width:100%">' + pat.map((p, i) => { const x = 10 + (i % 3) * 235, y = 6 + Math.floor(i / 3) * 92; return `<g transform="translate(${x},${y})"><rect width="220" height="86" rx="8" fill="#f8fafc" stroke="#cbd5e1"/><g transform="translate(14,14) scale(2.2,1.1)"><path d="${p[3]}" fill="none" stroke="${i < 3 ? '#d98200' : '#12915b'}" stroke-width="1.6"/></g><text x="8" y="14" font-size="11" font-weight="700">${p[0]} — ${p[1]}</text><text x="8" y="80" font-size="10.5" fill="#475569">${p[2]}</text></g>`; }).join('') + '</svg>';
  calc();
})();

/* ===== 2.7 Pareto ===== */
(function () {
  let rows = [['Machine breakdown', 46], ['Material shortage', 24], ['Set-up / changeover', 13], ['Operator absence', 7], ['Quality rework', 5], ['Other', 3]];
  const sec = el('m2-pa');
  function table() { el('pa-tbl').innerHTML = '<tr><th>Category</th><th>Count</th></tr>' + rows.map((r, i) => `<tr><td><input type="text" data-pa="0" data-i="${i}" value="${esc(r[0])}"></td><td><input type="number" min="0" step="any" data-pa="1" data-i="${i}" value="${r[1]}"></td></tr>`).join(''); }
  sec.addEventListener('input', e => { const t = e.target; if (t.dataset && t.dataset.pa !== undefined) { rows[+t.dataset.i][+t.dataset.pa] = t.dataset.pa === '1' ? parseFloat(t.value) || 0 : t.value; draw(); } });
  function draw() {
    const s = rows.slice().sort((a, b) => b[1] - a[1]), tot = s.reduce((a, r) => a + r[1], 0) || 1; let cum = 0, few = 0, fshare = 0; const cp = s.map(r => (cum += r[1], cum / tot * 100)); for (let i = 0; i < cp.length; i++) { if (few === 0 && cp[i] >= 80) { few = i + 1; fshare = cp[i]; } }
    setBox('pa-tot', tot, 'all categories'); setBox('pa-few', `${few} of ${s.length}`, 'first categories whose cumulative ≥ 80 %', 'hi'); setBox('pa-fp', fshare.toFixed(1) + ' %', 'cumulative share at that point');
    const W = 720, H = 300, L = 46, R = 46, T = 20, B = 70, pw = W - L - R, ph = H - T - B, bw = pw / s.length, mx = Math.max(...s.map(r => r[1]), 1);
    let g = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="max-width:100%"><rect x="${L}" y="${T}" width="${pw}" height="${ph}" fill="#fff" stroke="#cbd5e1"/>`;
    [0, 25, 50, 75, 100].forEach(p => { const y = T + ph * (1 - p / 100); g += `<line x1="${L}" x2="${L + pw}" y1="${y}" y2="${y}" stroke="#eef2f7"/><text x="${L + pw + 6}" y="${y + 4}" font-size="11" fill="#d23b3b">${p}%</text><text x="${L - 6}" y="${y + 4}" text-anchor="end" font-size="11" fill="#475569">${Math.round(mx * p / 100)}</text>`; });
    g += `<line x1="${L}" x2="${L + pw}" y1="${T + ph * 0.2}" y2="${T + ph * 0.2}" stroke="#d23b3b" stroke-dasharray="4 3"/>`;
    s.forEach((r, i) => { const h = ph * r[1] / mx, x = L + i * bw; g += `<rect x="${x + 4}" y="${T + ph - h}" width="${bw - 8}" height="${h}" fill="${i < few ? '#2457d6' : '#9db2e0'}" rx="2"/><text x="${x + bw / 2}" y="${T + ph - h - 4}" text-anchor="middle" font-size="11" fill="#1e293b">${r[1]}</text><text transform="translate(${x + bw / 2},${T + ph + 12}) rotate(25)" font-size="11" fill="#334155">${esc(r[0].slice(0, 18))}</text>`; });
    g += `<polyline fill="none" stroke="#d23b3b" stroke-width="2.2" points="${cp.map((c, i) => `${L + (i + 0.5) * bw},${T + ph * (1 - c / 100)}`).join(' ')}"/>` + cp.map((c, i) => `<circle cx="${L + (i + 0.5) * bw}" cy="${T + ph * (1 - c / 100)}" r="3.5" fill="#d23b3b"/>`).join('') + '</svg>';
    el('pa-svg').innerHTML = g;
  }
  on('pa-lost', 'click', () => { rows = [['Machine breakdown', 46], ['Material shortage', 24], ['Set-up / changeover', 13], ['Operator absence', 7], ['Quality rework', 5], ['Other', 3]]; table(); draw(); });
  on('pa-cnc', 'click', () => { rows = [['Spindle bearing', 38], ['Coolant pump', 21], ['Tool wear', 17], ['Controller fault', 9], ['Hydraulic leak', 8], ['Electrical supply', 4], ['Others', 3]]; table(); draw(); });
  on('pa-add', 'click', () => { rows.push(['New category', 1]); table(); draw(); });
  on('pa-del', 'click', () => { if (rows.length > 2) { rows.pop(); table(); draw(); } });
  table(); draw();
})();

/* ===== 2.8 fishbone ===== */
(function () {
  const LEC = { eff: 'Diameter out of specification', c: { Material: ['Raw material variation', 'Wrong grade'], Measurement: ['Gauge not calibrated', 'Reading error'], Machine: ['Tool wear', 'Spindle vibration'], Method: ['Wrong feed / speed', 'No work instruction'], Environment: ['Temperature changes', 'Dust'], Employee: ['Insufficient training', 'Fatigue'] } };
  const MSE = { eff: 'High defect rate in product', c: { Man: ['Untrained operator', 'Fatigue'], Machine: ['Poor maintenance', 'Worn tooling'], Material: ['Supplier variation', 'Impurities'], Method: ['Unclear procedure', 'No SOP'], Measurement: ['Instrument error', 'No calibration'], Environment: ['High humidity', 'Poor lighting'] } };
  let D = JSON.parse(JSON.stringify(LEC));
  function cats() { el('fb-cats').innerHTML = Object.keys(D.c).map(k => `<div class="box note"><b>${esc(k)}</b><textarea rows="3" data-fb="${esc(k)}" style="width:100%">${esc(D.c[k].join('\n'))}</textarea></div>`).join(''); }
  function draw() {
    const ks = Object.keys(D.c), W = 760, H = 330, sy = 165, hx = 610; let g = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="max-width:100%"><line x1="20" y1="${sy}" x2="${hx}" y2="${sy}" stroke="#1e293b" stroke-width="3"/><polygon points="${hx},${sy - 8} ${hx + 12},${sy} ${hx},${sy + 8}" fill="#1e293b"/><rect x="${hx + 10}" y="${sy - 34}" width="138" height="68" rx="8" fill="#fde8e8" stroke="#d23b3b"/>`;
    const words = D.eff.split(' '); let lines = [], cur = ''; words.forEach(w => { if ((cur + ' ' + w).length > 17) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }); lines.push(cur); lines.slice(0, 4).forEach((l, i) => g += `<text x="${hx + 79}" y="${sy - 12 + i * 15 + (4 - Math.min(4, lines.length)) * 7}" text-anchor="middle" font-size="11.5" font-weight="700" fill="#7f1d1d">${esc(l)}</text>`);
    const per = Math.ceil(ks.length / 2), step = 540 / per;
    ks.forEach((k, i) => { const top = i < per, idx = i % per, bx = 60 + idx * step + 90, by = top ? 20 : H - 20, jx = bx + 70, jy = sy; g += `<line x1="${bx}" y1="${by}" x2="${jx}" y2="${jy}" stroke="#2457d6" stroke-width="2.4"/><rect x="${bx - 50}" y="${top ? 0 : H - 20}" width="100" height="20" rx="5" fill="#2457d6"/><text x="${bx}" y="${top ? 14 : H - 6}" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">${esc(k)}</text>`;
      D.c[k].filter(Boolean).slice(0, 5).forEach((c, j) => { const f = (j + 1) / (Math.min(5, D.c[k].filter(Boolean).length) + 1), x = bx + (jx - bx) * f, y = by + (jy - by) * f; g += `<line x1="${x - 40}" y1="${y}" x2="${x}" y2="${y}" stroke="#94a3b8"/><text x="${x - 42}" y="${y + 3.5}" text-anchor="end" font-size="10.5" fill="#334155">${esc(c.slice(0, 24))}</text>`; }); });
    el('fb-svg').innerHTML = g + '</svg>';
  }
  function load(s) { D = JSON.parse(JSON.stringify(s)); el('fb-eff').value = D.eff; cats(); draw(); }
  el('m2-fb').addEventListener('input', e => { const t = e.target; if (t.id === 'fb-eff') { D.eff = t.value; draw(); } else if (t.dataset && t.dataset.fb) { D.c[t.dataset.fb] = t.value.split('\n').map(x => x.trim()).filter(Boolean); draw(); } });
  on('fb-lec', 'click', () => load(LEC)); on('fb-mse', 'click', () => load(MSE)); cats(); draw();
})();

/* ===== 2.9 control charts ===== */
(function () {
  const sec = el('m2-cc'), plot = mkPlot('cc-plot', { xlabel: 'subgroup number', ylabel: 'subgroup mean', xmin: 0, xmax: 1, ymin: 0, ymax: 1 }), ph = mkPlot('cc-hist', { xlabel: 'subgroup mean', ylabel: 'count', xmin: 0, xmax: 1, ymin: 0, ymax: 1 }), po = mkPlot('cc-oplot', { xlabel: 'observation', ylabel: 'value', xmin: 0, xmax: 1, ymin: 0, ymax: 1 });
  let data = [];
  function gen() { const m = V('cc-m'), s = V('cc-s'), n = Math.round(V('cc-n')), k = Math.round(V('cc-k')), d = V('cc-d'), at = Math.round(V('cc-at')); data = []; for (let i = 1; i <= k; i++) { let sum = 0; const mu = m + (i >= at ? d * s : 0); for (let j = 0; j < n; j++) sum += mu + s * rnorm(); data.push(sum / n); } }
  function calc(regen) {
    if (regen || data.length !== Math.round(V('cc-k'))) gen();
    const m = V('cc-m'), s = V('cc-s'), n = Math.round(V('cc-n')), d = V('cc-d'), se = s / Math.sqrt(n), U = m + 3 * se, Lw = m - 3 * se;
    setBox('cc-ucl', U.toFixed(3), 'μ₀ + 3σ/√n'); setBox('cc-lcl', Lw.toFixed(3), 'μ₀ − 3σ/√n');
    let first = null, sig = 0; const flags = new Array(data.length).fill(false);
    data.forEach((x, i) => { if (x > U || x < Lw) flags[i] = true; if (i >= 7) { const w = data.slice(i - 7, i + 1); if (w.every(v => v > m) || w.every(v => v < m)) flags[i] = true; } if (flags[i]) { sig++; if (first === null) first = i + 1; } });
    const p = Phi(-3 - d * Math.sqrt(n)) + 1 - Phi(3 - d * Math.sqrt(n));
    setBox('cc-sig', sig, 'points flagged', sig ? 'bad' : 'good'); setBox('cc-first', first === null ? 'none' : first, 'subgroup #'); setBox('cc-p', `${p.toFixed(4)} · ${(1 / p).toFixed(1)}`, 'P(beyond 3σ limits) · ARL = 1/p (for current δ)');
    const pts = data.map((x, i) => [i + 1, x]), red = data.map((x, i) => [i + 1, x]).filter((_, i) => flags[i]);
    plot.set([{ name: 'subgroup mean', color: '#2457d6', pts }, { name: 'signal', color: '#d23b3b', dots: true, nolines: true, pts: red }, { name: 'UCL', color: '#d23b3b', dash: [5, 4], f: () => U }, { name: 'CL', color: '#12915b', f: () => m }, { name: 'LCL', color: '#d23b3b', dash: [5, 4], f: () => Lw }], { axes: { xmin: 0.5, xmax: data.length + 0.5, ymin: m - 4.5 * se, ymax: m + 4.5 * se } });
    const nb = 14, lo = m - 4 * se, w = 8 * se / nb, cnt = new Array(nb).fill(0); data.forEach(x => { const k = Math.floor((x - lo) / w); if (k >= 0 && k < nb) cnt[k]++; });
    ph.set([{ name: 'histogram of means', color: '#2457d6', bars: true, bw: w * 0.9, pts: cnt.map((c, k) => [lo + (k + 0.5) * w, c]) }, { name: 'normal curve (scaled)', color: '#d23b3b', f: x => data.length * w * phiPdf((x - m) / se) / se }], { axes: { xmin: lo, xmax: lo + 8 * se, ymin: 0, ymax: Math.max(...cnt, 3) * 1.25 } });
  }
  wire(sec, () => calc(false));
  on('cc-gen', 'click', () => calc(true));
  on('cc-in', 'click', () => { setV('cc-d', 0); calc(true); }); on('cc-sh', 'click', () => { setV('cc-d', 1.5); setV('cc-at', 16); setV('cc-k', 30); calc(true); });
  on('cc-arl', 'click', () => { const n = Math.round(V('cc-n')), rows = [0, 0.5, 1, 1.5, 2, 3]; el('cc-arlt').innerHTML = '<tr><th>shift δ (σ)</th><th>ARL theory = 1/p</th><th>ARL Monte Carlo (2000 runs)</th></tr>' + rows.map(dl => { const pp = Phi(-3 - dl * Math.sqrt(n)) + 1 - Phi(3 - dl * Math.sqrt(n)); let tot = 0; const R = 2000; for (let r = 0; r < R; r++) { let c = 0; while (true) { c++; if (Math.abs(dl * Math.sqrt(n) + rnorm()) > 3) break; if (c > 100000) break; } tot += c; } return `<tr><td>${dl}</td><td>${(1 / pp).toFixed(1)}</td><td>${(tot / R).toFixed(1)}</td></tr>`; }).join(''); });
  function own() {
    const x = parseList(el('cc-own').value); if (x.length < 3) return; const mean = x.reduce((a, b) => a + b, 0) / x.length, mr = []; for (let i = 1; i < x.length; i++) mr.push(Math.abs(x[i] - x[i - 1])); const mrb = mr.reduce((a, b) => a + b, 0) / mr.length, U = mean + 2.66 * mrb, Lw = mean - 2.66 * mrb, out = x.map((v, i) => [i + 1, v]).filter(p => p[1] > U || p[1] < Lw);
    setBox('cc-oc', mean.toFixed(3), `MR̄ = ${mrb.toFixed(3)}`); setBox('cc-ol', `${Lw.toFixed(2)} / ${U.toFixed(2)}`, 'x̄ ± 2.66·MR̄'); setBox('cc-oo', out.length ? out.map(p => '#' + p[0]).join(', ') : 'none', 'points outside', out.length ? 'bad' : 'good');
    po.set([{ name: 'data', color: '#2457d6', pts: x.map((v, i) => [i + 1, v]) }, { name: 'signal', color: '#d23b3b', dots: true, nolines: true, pts: out }, { name: 'UCL', color: '#d23b3b', dash: [5, 4], f: () => U }, { name: 'CL', color: '#12915b', f: () => mean }, { name: 'LCL', color: '#d23b3b', dash: [5, 4], f: () => Lw }], { axes: { xmin: 0.5, xmax: x.length + 0.5, ymin: Math.min(Lw, ...x) - mrb, ymax: Math.max(U, ...x) + mrb } });
  }
  sec.addEventListener('input', e => { if (e.target.id === 'cc-own') own(); }); calc(true); own();
})();

})();
