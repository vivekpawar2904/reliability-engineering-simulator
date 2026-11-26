/* ===== m3.js : Module 3 — Hazard models, exponential, Weibull ===== */
(function () {
'use strict';
const root = $('#tab-m3');
const WQ = [
  ['Weibull with β = 1 reduces to the …', ['normal', 'exponential', 'log-normal', 'Rayleigh'], 1, 'h = (β/η)(t/η)^(β−1) = 1/η constant ⇒ exponential. (One lecture slide says "becomes normal when β is 1" — that is a slip; the bell shape appears for β ≈ 3–4.)'],
  ['Weibull with β = 2 is the …', ['exponential', 'Rayleigh (linearly increasing hazard)', 'uniform', 'normal'], 1, 'h(t) = 2t/η² — linear in t.'],
  ['R(t = η) for any Weibull is …', ['0.5', '0.632', '0.368', '0.9'], 2, 'e⁻¹; 63.2 % have failed by the characteristic life.'],
  ['The location (guarantee) parameter γ of the 3-parameter Weibull means …', ['failures can occur before γ', 'no failures before t = γ', 'the mean life', 'infant mortality'], 1, 'Replace t by (t − γ): the population is failure-free until γ.'],
  ['Falling hazard (β < 1) is typical of …', ['infant mortality', 'random failures', 'wear-out'], 0, 'DFR = early-life defects; β = 1 random; β > 1 wear-out.'],
  ['The memoryless property says that for the exponential …', ['R(t + s | s) = R(t)', 'h(t) rises with age', 'MTTF = η', 'F(t) = e^−λt'], 0, 'An item that has survived s hours is "as good as new".'],
  ['MTTF of a Weibull is …', ['η', 'ηΓ(1 + 1/β)', 'η/β', 'γ + β'], 1, 'For β = 1 it reduces to η; for β = 2: 0.8862 η.'],
  ['B10 life is the time by which …', ['10 % have failed', '90 % have failed', '10 % survive', 'the mean is reached'], 0, 'B10 = η(−ln 0.9)^(1/β).']
];

root.innerHTML = `
<div class="subnav"><a href="#m3-exp">3.1 Exponential &amp; MSE Q2c</a><a href="#m3-wb">3.2 Weibull explorer</a><a href="#m3-wc">3.3 Weibull calculator</a><a href="#m3-mr">3.4 Median-rank plotting</a><a href="#m3-hm">3.5 Hazard models</a><a href="#m3-gal">3.6 Other life distributions</a><a href="#m3-qz">3.7 Cheat sheet &amp; self-test</a><a href="#m3-gam">3.8 Gamma function</a></div>

${card('m3-exp', '3.1', 'Exponential distribution — constant hazard (MSE Q2c)', `
 <div class="box feyn"><b>🧒 Plain words:</b> The exponential says "an item is exactly as likely to fail in the next hour whether it is new or old": no memory, no ageing. That is the <b>useful-life</b> flat part of the bathtub. One number, the failure rate λ (failures per hour), tells everything: the average life is 1/λ, and the chance to survive t hours is e<sup>−λt</sup>. After MTTF hours only <b>36.8 %</b> survive, not 50 %.</div>
 <div class="box formula">f(t) = λe<sup>−λt</sup> &nbsp; F(t) = 1 − e<sup>−λt</sup> &nbsp; R(t) = e<sup>−λt</sup> &nbsp; h(t) = λ &nbsp; MTTF = 1/λ = θ<br>Memoryless: R(t + s | s) = R(t+s)/R(s) = R(t) &nbsp;|&nbsp; B10 = −ln(0.9)/λ = 0.1054/λ &nbsp;|&nbsp; median = 0.693/λ</div>
 <div class="box tip"><b>Exam tip (MSE Q2c, 4 M):</b> (i) λ = failures / (units × time) = 12 % / 1500 h = 0.12/1500 = 8×10⁻⁵ per h; (ii) R(8000) = e<sup>−0.00008·8000</sup> = e<sup>−0.64</sup> = 0.527; (iii) MTTF = 1/λ = 12 500 h. The teacher's λ is the simple division; the exact value from R(1500) = 0.88 would be −ln(0.88)/1500 = 8.52×10⁻⁵ (tick the box to see the difference).</div>
 <div class="row"><button class="btn mse" id="ex-mse">Load MSE Q2c: 12 % fail in 1500 h, mission 8000 h</button><button class="btn" id="ex-amp">DEMO: amplifier MTBF 2500 h, 1000 h mission</button><button class="btn" id="ex-800">DEMO: "800-year MTBF", 1-year mission</button><label><input type="checkbox" id="ex-exact" data-live> use exact λ = −ln(1 − p)/T</label></div>
 <div class="grid2"><div>${ctl('ex-p', 'fraction failed p (%)', 0.1, 99, 0.1, 12, '%')}${ctl('ex-T', 'over observation time T', 1, 20000, 10, 1500, 'h')}${ctl('ex-t', 'mission time t', 1, 40000, 10, 8000, 'h')}${ctl('ex-s', 'already survived s (memoryless test)', 0, 20000, 10, 3000, 'h')}</div>
 <div><div class="outs">${outBox('ex-l', 'λ')}${outBox('ex-R', 'R(t)')}${outBox('ex-F', 'F(t)')}${outBox('ex-m', 'MTTF = 1/λ')}${outBox('ex-b10', 'B10 life')}${outBox('ex-cond', 'R(t | survived s)')}${outBox('ex-r1', 'R at t = MTTF')}</div>
  <div class="row"><button class="btn fill" id="ex-mc">▶ simulate 100 000 units for time t</button></div></div></div>
 <canvas class="plot" id="ex-plot" style="height:230px"></canvas>
 <span class="src">MSE Q2c (Reliability Engineering MSE solution). L2/L3: exponential pdf, cdf, R(t), h(t) = λ, MTTF = 1/λ, memoryless / constant hazard. Amplifier and "800-year MTBF" use my own parameters chosen to give 0.6703 and 0.99875 (DEMO).</span>
`, CH.mse + ' ' + CH.lec + ' ' + CH.demo)}

${card('m3-wb', '3.2', 'Weibull explorer — β (shape), η (scale), γ (location)', `
 <div class="box feyn"><b>🧒 Plain words:</b> The Weibull is a "stretchy" life model with a dial for the <b>kind of ageing</b>. β &lt; 1: the older it is, the <i>safer</i> it gets (weak items die first). β = 1: no ageing (exponential). β &gt; 1: it wears out — the larger β, the sharper the wall. η (the characteristic life) is the time by which 63.2 % have failed, whatever β is. γ slides everything to the right: nothing fails before γ.</div>
 <div class="box formula">f(t) = (β/η)((t−γ)/η)<sup>β−1</sup> exp[−((t−γ)/η)<sup>β</sup>] &nbsp; F(t) = 1 − exp[−((t−γ)/η)<sup>β</sup>] &nbsp; R(t) = exp[−((t−γ)/η)<sup>β</sup>] &nbsp; h(t) = (β/η)((t−γ)/η)<sup>β−1</sup><br>MTTF = γ + ηΓ(1 + 1/β) &nbsp;|&nbsp; median = γ + η(ln 2)<sup>1/β</sup> &nbsp;|&nbsp; B10 = γ + η(−ln 0.9)<sup>1/β</sup> &nbsp;|&nbsp; R(γ + η) = 0.368</div>
 <div class="box tip"><b>Exam tip:</b> know the β table — &lt;1 DFR early life · =1 CFR random · &gt;1 IFR wear-out (β = 2 Rayleigh, linear h; β ≈ 3.4 nearly symmetric bell). MTTF ≠ η unless β = 1.</div>
 <div class="row"><button class="btn lec" id="wb-lec">Lecture: β = 2, η = 1000 h</button><button class="btn lec" id="wb-b05">Lecture: β = 0.5, η = 2500 h (mean 5000)</button><button class="btn lec" id="wb-b1">β = 1 ⇒ exponential</button><button class="btn" id="wb-b35">DEMO: β = 3.5 (bell-like)</button><button class="btn" id="wb-g">DEMO: γ = 300 h guarantee time</button></div>
 <div class="grid2"><div>${ctl('wb-b', 'shape β', 0.2, 8, 0.05, 2, '')}${ctl('wb-e', 'scale η', 100, 10000, 10, 1000, 'h')}${ctl('wb-g2', 'location γ', 0, 2000, 10, 0, 'h')}${ctl('wb-t', 'evaluate at t', 1, 20000, 1, 500, 'h')}</div>
 <div><div class="outs">${outBox('wb-F', 'F(t)')}${outBox('wb-R', 'R(t)')}${outBox('wb-h', 'h(t)')}${outBox('wb-mttf', 'MTTF = γ + ηΓ(1+1/β)')}${outBox('wb-med', 'median life')}${outBox('wb-b10', 'B10 life')}${outBox('wb-class', 'hazard type')}${outBox('wb-mode', 'model in use')}${outBox('wb-Reta', 'R(γ+η)')}</div></div></div>
 <div class="grid2"><canvas class="plot" id="wb-pf" style="height:190px"></canvas><canvas class="plot" id="wb-pF" style="height:190px"></canvas><canvas class="plot" id="wb-pR" style="height:190px"></canvas><canvas class="plot" id="wb-ph" style="height:190px"></canvas></div>
 <h3>Compare several β at the same η</h3><canvas class="plot" id="wb-pm" style="height:220px"></canvas>
 <div class="row"><button class="btn fill" id="wb-mc">▶ simulate 10 000 units and compare with F(t)</button><span id="wb-mcout" class="mono"></span></div>
 <div class="tblwrap"><table class="cover"><tr><th>β</th><th>hazard</th><th>shape of f(t)</th><th>typical</th></tr><tr><td>0 &lt; β &lt; 1</td><td>decreasing (DFR)</td><td>J-shaped, pile-up near 0</td><td>infant mortality, early life</td></tr><tr><td>β = 1</td><td>constant (CFR)</td><td>exponential</td><td>random failures, useful life</td></tr><tr><td>1 &lt; β &lt; 2</td><td>increasing, concave</td><td>skewed right</td><td>early wear-out</td></tr><tr><td>β = 2</td><td>linear increase</td><td>Rayleigh</td><td>wear-out</td></tr><tr><td>β ≈ 3 – 4</td><td>steep increase</td><td>≈ bell-shaped (3.44 ≈ normal)</td><td>fatigue, corrosion</td></tr></table></div>
 <span class="src">L3 Weibull slides: formulas, β effects, η, γ, MTTF = ηΓ(1+1/β), the exponential case β = 1; the slide's statement "Weibull PDF becomes normal when β is 1" is incorrect — β = 1 is exponential (my correction, shown in the guide).</span>
`, CH.lec + ' ' + CH.demo)}

${card('m3-wc', '3.3', 'Weibull calculator — reliability, life at a given R, conditional reliability, PM interval', `
 <div class="box feyn"><b>🧒 Plain words:</b> Once β and η are known, four questions come up all the time: <b>(a)</b> what fraction survives to t? <b>(b)</b> by when do only 10 % fail (the B10 life — the age where you must act)? <b>(c)</b> I have run s hours, what is the chance of surviving t <i>more</i>? <b>(d)</b> what preventive-replacement age keeps the survival chance above, say, 95 %?</div>
 <div class="box formula">R(t) = exp[−((t−γ)/η)<sup>β</sup>] &nbsp;|&nbsp; t<sub>R</sub> = γ + η(−ln R)<sup>1/β</sup> &nbsp;|&nbsp; R(t | s) = R(s + t)/R(s) = exp{[(s−γ)/η]<sup>β</sup> − [(s+t−γ)/η]<sup>β</sup>}<br>Expected failures in a fleet of N by time t: N·F(t) &nbsp;|&nbsp; mean residual life uses ∫R(t|s)dt</div>
 <div class="box tip"><b>Exam tip:</b> for β &gt; 1 conditional reliability <i>falls</i> with age (an old item is worse than new) — for β = 1 it stays equal (memoryless), for β &lt; 1 it improves; use that to justify or reject age-based replacement.</div>
 <div class="row"><button class="btn lec" id="wc-tire">Lecture: tire β = 2.5, η = 8000 km, fleet 12 000, t = 5000 km</button><button class="btn lec" id="wc-valve">Lecture-style: β = ½, η = 2000 h (MTTF 4000 h)</button><button class="btn lec" id="wc-third">β = 1/3, η = 16 000 h (MTTF 96 000 h)</button><button class="btn" id="wc-pm">DEMO: PM at R = 0.95 for β = 3, η = 1000</button></div>
 <div class="grid2"><div>${ctl('wc-b', 'β', 0.2, 8, 0.05, 2.5, '')}${ctl('wc-e', 'η', 100, 100000, 10, 8000, 'units')}${ctl('wc-g', 'γ', 0, 5000, 10, 0, 'units')}${ctl('wc-t', 'mission t', 1, 100000, 1, 5000, 'units')}${ctl('wc-s', 'age s (conditional)', 0, 100000, 1, 2000, 'units')}${ctl('wc-R', 'target R (for life & PM)', 0.5, 0.999, 0.001, 0.9, '')}${ctl('wc-N', 'fleet size N', 1, 100000, 1, 12000, '')}</div>
 <div><div class="outs">${outBox('wc-Rt', 'R(t)')}${outBox('wc-Ft', 'F(t)')}${outBox('wc-n', 'failures expected N·F(t)')}${outBox('wc-tr', 'life at target R (B-life)')}${outBox('wc-hb', 'h at that life')}${outBox('wc-cond', 'R(t | survived s)')}${outBox('wc-mttf', 'MTTF')}${outBox('wc-mrl', 'mean residual life at s')}</div></div></div>
 <canvas class="plot" id="wc-plot" style="height:230px"></canvas>
 <span class="src">L3 Weibull examples (β = 2, η = 1000 h; β = ½ with mean 5000 h ⇒ η = 2500 h; tire with β = 2.5, η = 8000 km). Valve (β = ½, η = 2000 h) and β = ⅓, η = 16 000 reproduce the MTTF values 4000 and 96 000 quoted from the slides; the PM example is DEMO.</span>
`, CH.lec + ' ' + CH.demo)}

${card('m3-mr', '3.4', 'Median-rank plotting — fit exponential and Weibull to test data', `
 <div class="box feyn"><b>🧒 Plain words:</b> You tested a few items to failure. Line the failure times up in order, give each a "rough percent failed" (its <b>median rank</b>), and plot on a special paper where a Weibull population becomes a <b>straight line</b>. The slope of the line is β; where it crosses 63.2 % gives η. For an exponential population the line is straight on ordinary-log paper through the origin and 1/slope = MTTF.</div>
 <div class="box formula">Median rank (exact): F<sub>j</sub> with P(Bin(n, F) ≥ j) = 0.5 &nbsp;|&nbsp; Bernard: F<sub>j</sub> ≈ (j − 0.3)/(n + 0.4)<br>Weibull paper: x = ln t, y = ln[−ln(1 − F)] = β ln t − β ln η ⇒ β = slope, η = exp(−intercept/β)<br>Exponential: −ln(1 − F) = λt (through origin) ⇒ λ̂ = Σ t·y / Σ t²</div>
 <div class="box tip"><b>Exam tip:</b> sort the data, compute ranks, plot, draw the best straight line, read β (slope) and η (at F = 63.2 %). With censored (suspended) data, use <b>Johnson's adjusted rank</b>: type the survivor times in the suspensions box below and the table shows the reverse rank, increment and adjusted rank (textbook method; the lecture only says the ranks must be adjusted).</div>
 <div class="row"><button class="btn lec" id="mr-exp">Lecture: exponential test 7, 12, 19, 29, 41, 67 h</button><button class="btn lec" id="mr-wb">Lecture: Weibull test 17, 24, 26, 43, 43, 46, 50</button><label>rank method <select id="mr-m" data-live style="width:auto"><option value="exact">exact median rank</option><option value="bernard">Bernard (j−0.3)/(n+0.4)</option></select></label><button class="btn" id="mr-gen">DEMO: generate 10 random Weibull failures (β 2.5, η 500)</button></div>
 <div class="grid2"><label>Failure times (ordered automatically)<input type="text" id="mr-d" data-live value="17, 24, 26, 43, 43, 46, 50"></label><label>Suspensions / censored times (survivors removed or still running — leave blank if none)<input type="text" id="mr-s" data-live value="" placeholder="e.g. 1100, 1500, 1900"></label></div>
 <div class="row"><button class="btn" id="mr-cens">DEMO censored: failures 410, 780, 1230, 1710, 2350 with suspensions 1100, 1500, 1900</button><span class="mono" id="mr-cnote"></span></div>
 <div class="outs">${outBox('mr-b', 'Weibull β (slope)')}${outBox('mr-e', 'η (63.2 % point)')}${outBox('mr-b10', 'B10 from fit')}${outBox('mr-r2', 'R² of fit')}${outBox('mr-l', 'exponential through origin: 1/λ̂')}${outBox('mr-mean', 'Weibull MTTF')}</div>
 <div class="tblwrap"><table id="mr-tbl"></table></div>
 <div class="grid2"><canvas class="plot" id="mr-p1" style="height:260px"></canvas><canvas class="plot" id="mr-p2" style="height:260px"></canvas></div>
 <span class="src">L3 slides: exponential life test (6 items; ranks from the median-rank table) and Weibull plotting example 17, 24, 26, 43, 43, 46, 50. The slide reads the exponential line by eye as ≈ 33 h; the numerical through-origin fit is shown here — small differences are expected. Regression here is Y-on-X (β̂ = slope); the lecture's by-eye graph reads β ≈ 2.8, η ≈ 42 h for the Weibull data.</span>
`, CH.lec + ' ' + CH.demo)}

${card('m3-hm', '3.5', 'Hazard models — from any h(t) to R(t) and MTTF', `
 <div class="box feyn"><b>🧒 Plain words:</b> If you can say how dangerous each moment is — h(t) — everything else follows. Add the danger up over time (the cumulative hazard H = ∫h); survival is e<sup>−H</sup>. Choose h to be flat (exponential), a straight line (Rayleigh/linear), a power law (Weibull) or a mix: you have a reliability model.</div>
 <div class="box formula">R(t) = exp[−∫<sub>0</sub><sup>t</sup> h(x)dx] = e<sup>−H(t)</sup> &nbsp;|&nbsp; f = hR &nbsp;|&nbsp; MTTF = ∫<sub>0</sub><sup>∞</sup> R(t)dt<br>Constant: h = λ ⇒ R = e<sup>−λt</sup> · Linear: h = a + bt ⇒ R = exp(−at − bt²/2) · Power: h = (β/η)(t/η)<sup>β−1</sup> ⇒ Weibull</div>
 <div class="box tip"><b>Exam tip:</b> be able to integrate the hazard: ∫(a+bt)dt = at + bt²/2. Mixed (competing) causes <i>add</i> hazards, so reliabilities <i>multiply</i> (series system).</div>
 <div class="row"><button class="btn" id="hm-c">DEMO: constant 0.001/h</button><button class="btn" id="hm-l">DEMO: linear h = 0.0002 + 0.000004 t</button><button class="btn" id="hm-r">Rayleigh: a = 0, b = 2/η² (η = 1000)</button><button class="btn" id="hm-mix">DEMO: sum of constant + linear (competing causes)</button></div>
 <div class="grid2"><div>${ctl('hm-a', 'a — constant part', 0, 0.005, 0.00001, 0.0002, '/h')}${ctl('hm-bb', 'b — slope (per h²)', 0, 0.00002, 0.0000001, 0.000004, '/h²')}${ctl('hm-t', 'evaluate at t', 1, 5000, 1, 500, 'h')}</div>
 <div><div class="outs">${outBox('hm-h', 'h(t)')}${outBox('hm-H', 'H(t) = ∫h')}${outBox('hm-R', 'R(t) = e^−H')}${outBox('hm-m', 'MTTF = ∫R dt')}${outBox('hm-ma', 'closed form')}</div></div></div>
 <div class="grid2"><canvas class="plot" id="hm-ph" style="height:200px"></canvas><canvas class="plot" id="hm-pR" style="height:200px"></canvas></div>
 <span class="src">L2/L3: R(t) = exp(−∫h), constant hazard (exponential), Weibull hazard; linear and mixed hazards are DEMO illustrations of the same relation.</span>
`, CH.lec + ' ' + CH.demo)}

${card('m3-gal', '3.6', 'Other life distributions — normal, log-normal and which to choose', `
 <div class="box feyn"><b>🧒 Plain words:</b> <b>Normal</b> suits wear-out times that cluster tightly around an average. <b>Log-normal</b> suits repair times and fatigue lives that have a long tail on the right (its log is normal). <b>Exponential</b> is for random failures, <b>Weibull</b> is the flexible one when you need to <i>fit</i>. Compare their hazards at the same mean and standard deviation — they behave very differently.</div>
 <div class="box formula">Normal: f = φ((t−μ)/σ)/σ, R = 1 − Φ((t−μ)/σ), h = f/R (increasing) &nbsp;|&nbsp; Log-normal: R = 1 − Φ((ln t − μ<sub>y</sub>)/σ<sub>y</sub>), mean = exp(μ<sub>y</sub> + σ<sub>y</sub>²/2) (h rises then falls)<br>Moment-matching: σ<sub>y</sub>² = ln(1 + (σ/m)²), μ<sub>y</sub> = ln m − σ<sub>y</sub>²/2</div>
 <div class="box tip"><b>Exam tip:</b> normal ⇒ IFR (wear-out); log-normal ⇒ hazard rises then falls; exponential ⇒ CFR; Weibull ⇒ any monotone shape; only the exponential is memoryless.</div>
 <div class="row"><button class="btn" id="gl-d">DEMO: mean 1000 h, σ 300 h</button><button class="btn" id="gl-w">DEMO: mean 1000 h, σ 800 h</button></div>
 <div class="grid2"><div>${ctl('gl-m', 'mean life', 100, 10000, 10, 1000, 'h')}${ctl('gl-s', 'standard deviation', 20, 5000, 10, 300, 'h')}</div><div><div class="outs">${outBox('gl-n', 'normal: R(mean)')}${outBox('gl-l', 'log-normal: R(mean) · median')}${outBox('gl-w2', 'Weibull (matched mean, σ): β, η')}${outBox('gl-x', 'exponential R(mean)')}</div></div></div>
 <canvas class="plot" id="gl-pf" style="height:200px"></canvas><canvas class="plot" id="gl-ph" style="height:200px;margin-top:8px"></canvas>
 <span class="src">L4 "Reliability characteristics distribution" table (normal, log-normal, exponential, Weibull); the matched-moment numbers are computed here (DEMO inputs).</span>
`, CH.lec + ' ' + CH.demo)}

${card('m3-qz', '3.7', 'Cheat sheet and self-test — Weibull and exponential', `
 <div class="tblwrap"><table class="cover"><tr><th>Quantity</th><th>Exponential</th><th>Weibull (γ=0)</th></tr><tr><td>R(t)</td><td>e<sup>−λt</sup></td><td>exp[−(t/η)<sup>β</sup>]</td></tr><tr><td>h(t)</td><td>λ</td><td>(β/η)(t/η)<sup>β−1</sup></td></tr><tr><td>MTTF</td><td>1/λ</td><td>ηΓ(1+1/β)</td></tr><tr><td>median</td><td>0.693/λ</td><td>η(ln 2)<sup>1/β</sup></td></tr><tr><td>B10</td><td>0.1054/λ</td><td>η(−ln 0.9)<sup>1/β</sup></td></tr><tr><td>R at MTTF / η</td><td>0.368</td><td>R(η) = 0.368</td></tr><tr><td>conditional</td><td>R(t) (memoryless)</td><td>R(s+t)/R(s)</td></tr></table></div>
 <div id="wq-quiz"></div><div class="row"><span class="pill" id="wq-score"></span><button class="btn sm" id="wq-reset">reset</button></div>
`, CH.lec)}

${card('m3-gam', '3.8', 'Gamma function Γ(x) — calculator, table and MTTF of the Weibull', `
 <div class="box feyn"><b>🧒 Plain words:</b> Γ(x) is just the "factorial for any number": Γ(n) = (n−1)! for whole numbers, and it fills in the gaps between them (Γ(½) = √π ≈ 1.7725). The Weibull mean needs it because averaging t·f(t) over a stretched exponential produces exactly this integral. So <b>MTTF = γ + η·Γ(1 + 1/β)</b> — read Γ(1+1/β) off the table, multiply by η, add γ.</div>
 <div class="box formula">Γ(x) = ∫<sub>0</sub><sup>∞</sup> y<sup>x−1</sup>e<sup>−y</sup> dy &nbsp;|&nbsp; Γ(x+1) = xΓ(x) &nbsp;|&nbsp; Γ(n) = (n−1)! &nbsp;|&nbsp; Γ(½) = √π<br>Weibull: MTTF = γ + ηΓ(1+1/β) &nbsp; Var = η²[Γ(1+2/β) − Γ²(1+1/β)] &nbsp; (table is tabulated for 1 ≤ x ≤ 2, so use Γ(x+1) = xΓ(x) to move into that range)</div>
 <div class="box tip"><b>Exam tip:</b> the lecture gives the table only as an image. This card computes the same numbers exactly (Lanczos). To use the table for e.g. Γ(3.5): Γ(3.5) = 2.5 × 1.5 × Γ(1.5) = 2.5 × 1.5 × 0.8862 = 3.3234. Typical values: β = 1 → Γ(2) = 1 (MTTF = η); β = 2 → Γ(1.5) = 0.8862; β = 0.5 → Γ(3) = 2 (MTTF = 2η).</div>
 <div class="row"><button class="btn lec" id="gm-half">Γ(½) = √π</button><button class="btn" id="gm-5">Γ(5) = 4! = 24</button><button class="btn lec" id="gm-b2">β = 2, η = 1000 → MTTF 886.2</button><button class="btn lec" id="gm-b05">β = 0.5, η = 2500 → MTTF 5000</button><button class="btn" id="gm-g3">3-parameter: β = 2, η = 1000, γ = 300</button></div>
 <div class="grid2"><div>${ctl('gm-x', 'argument x (for Γ(x))', 0.1, 8, 0.05, 1.5, '')}${ctl('gm-b', 'Weibull β', 0.2, 10, 0.05, 2, '')}${ctl('gm-e', 'Weibull η', 100, 10000, 10, 1000, 'h')}${ctl('gm-g', 'Weibull γ', 0, 3000, 10, 0, 'h')}</div>
 <div><div class="outs">${outBox('gm-gx', 'Γ(x)')}${outBox('gm-rec', 'recursion (x−1)Γ(x−1)')}${outBox('gm-fact', 'factorial check')}${outBox('gm-g1', 'Γ(1 + 1/β)')}${outBox('gm-mttf', 'MTTF = γ + ηΓ(1+1/β)')}${outBox('gm-sd', 'standard deviation σ')}</div></div></div>
 <canvas class="plot" id="gm-plot" style="height:220px"></canvas>
 <h3>Γ(1 + 1/β) and MTTF/η for common β (computed)</h3><div class="tblwrap"><table class="cover" id="gm-tbl"></table></div>
 <span class="src">L3/L4: MTTF = ηΓ(1+1/β) and the printed Gamma-function table (an image in the slides; the numbers here are computed). Γ recursion, Γ(½) = √π and Γ(n) = (n−1)! are standard textbook results (Kapur &amp; Lamberson, Appendix).</span>
`, CH.lec + ' ' + CH.tb)}
`;

/* ===== 3.1 exponential ===== */
(function () {
  const sec = el('m3-exp'), plot = mkPlot('ex-plot', { xlabel: 't (h)', ylabel: 'R(t) · F(t)', xmin: 0, xmax: 1, ymin: 0, ymax: 1 });
  function lam() { const p = V('ex-p') / 100, T = V('ex-T'); return el('ex-exact').checked ? -Math.log(1 - p) / T : p / T; }
  function calc() {
    const l = lam(), t = V('ex-t'), s = V('ex-s'), R = Math.exp(-l * t);
    setBox('ex-l', nice(l), el('ex-exact').checked ? 'exact −ln(1−p)/T per h' : 'p / T per h'); setBox('ex-R', f4(R), `e^(−λt), λt = ${(l * t).toFixed(4)}`, 'hi'); setBox('ex-F', f4(1 - R), '1 − R(t)'); setBox('ex-m', nice(1 / l), 'h'); setBox('ex-b10', nice(-Math.log(0.9) / l), 'h (10 % failed)');
    setBox('ex-cond', f4(Math.exp(-l * (s + t)) / Math.exp(-l * s)), `R(${s + t})/R(${s}) = R(t)`); setBox('ex-r1', '0.3679', 'R(MTTF) = e⁻¹');
    const tm = Math.max(3 / l, t * 1.2);
    plot.set([{ name: 'R(t)', color: '#12915b', f: x => Math.exp(-l * x) }, { name: 'F(t)', color: '#d98200', f: x => 1 - Math.exp(-l * x) }], { axes: { xmin: 0, xmax: tm, ymin: 0, ymax: 1 }, marks: [{ x: t, y: R, label: 'R = ' + R.toFixed(4) }, { x: 1 / l, y: 0.3679, label: 'MTTF: 0.368', color: '#2457d6' }] });
  }
  wire(sec, calc);
  on('ex-mse', 'click', () => { el('ex-exact').checked = false; setV('ex-p', 12); setV('ex-T', 1500); setV('ex-t', 8000); calc(); });
  on('ex-amp', 'click', () => { el('ex-exact').checked = false; setV('ex-T', 2500); setV('ex-t', 1000); el('ex-exact').checked = true; setV('ex-p', 100 * (1 - Math.exp(-1))); calc(); });
  on('ex-800', 'click', () => { el('ex-exact').checked = false; setV('ex-p', 0.125); setV('ex-T', 1); setV('ex-t', 1); calc(); });
  on('ex-mc', 'click', () => { const N = 100000, l = lam(), t = V('ex-t'); let ok = 0; for (let i = 0; i < N; i++) if (rexp(l) > t) ok++; setBox('ex-r1', (ok / N).toFixed(4), `Monte Carlo survivors at t, ${ok}/${N}`, 'hi'); });
  calc();
})();

/* ===== 3.2 Weibull explorer ===== */
(function () {
  const sec = el('m3-wb'), P = { f: mkPlot('wb-pf', { xlabel: 't', ylabel: 'f(t)' }), F: mkPlot('wb-pF', { xlabel: 't', ylabel: 'F(t)' }), R: mkPlot('wb-pR', { xlabel: 't', ylabel: 'R(t)' }), h: mkPlot('wb-ph', { xlabel: 't', ylabel: 'h(t)' }), m: mkPlot('wb-pm', { xlabel: 't (units of η)', ylabel: 'h(t) · η' }) };
  function calc() {
    const b = V('wb-b'), e = V('wb-e'), g = V('wb-g2'), t = V('wb-t'), D = DIST.weibull({ b, e, g }), tm = g + e * Math.max(2.2, Math.pow(4, 1 / b) * 1.4);
    setBox('wb-F', f4(D.F(t)), 'F(t)'); setBox('wb-R', f4(D.R(t)), 'R(t)', 'hi'); setBox('wb-h', nice(D.h(t)), 'h(t) per unit'); setBox('wb-mttf', nice(g + e * gammaFn(1 + 1 / b)), 'γ + ηΓ(1+1/β)'); setBox('wb-med', nice(g + e * Math.pow(Math.LN2, 1 / b)), 'γ + η(ln2)^(1/β)'); setBox('wb-b10', nice(g + e * Math.pow(-Math.log(0.9), 1 / b)), 'γ + η(−ln0.9)^(1/β)');
    setBox('wb-mode', g > 0 ? '3-parameter' : '2-parameter', g > 0 ? `no failures before γ = ${g}; curve = 2-par shifted right by γ` : 'γ = 0 → (β, η) only', g > 0 ? 'hi' : ''); setBox('wb-class', b < 0.995 ? 'DFR (early life)' : b > 1.005 ? 'IFR (wear-out)' : 'CFR (random)', `β = ${b}`); setBox('wb-Reta', f4(Math.exp(-1)), 'always e⁻¹');
    const ax = { xmin: 0, xmax: tm }; let fm = 0, hm = 0; for (let i = 1; i <= 300; i++) { const x = g + (tm - g) * i / 300; fm = Math.max(fm, D.f(x)); hm = Math.max(hm, D.h(x)); }
    const mk = (fn, c) => [{ color: c, f: x => { const v = fn(x); return isFinite(v) ? v : 0; } }], mrk = (y) => [{ x: t, y }];
    P.f.set(mk(D.f, '#2457d6'), { axes: { ...ax, ymin: 0, ymax: Math.min(fm, 12 / e) * 1.1 }, marks: mrk(Math.min(D.f(t), 12 / e)) }); P.F.set(mk(D.F, '#d98200'), { axes: { ...ax, ymin: 0, ymax: 1 }, marks: mrk(D.F(t)) });
    P.R.set(mk(D.R, '#12915b'), { axes: { ...ax, ymin: 0, ymax: 1 }, marks: mrk(D.R(t)) }); P.h.set(mk(D.h, '#d23b3b'), { axes: { ...ax, ymin: 0, ymax: Math.min(hm, 6 / e * Math.max(b, 1)) * 1.1 }, marks: mrk(Math.min(D.h(t), 6 / e * Math.max(b, 1))) });
    const cols = { 0.5: '#d98200', 1: '#12915b', 2: '#2457d6', 3.5: '#7a3fd0', 5: '#d23b3b' };
    P.m.set(Object.keys(cols).map(k => ({ name: 'β = ' + k, color: cols[k], f: x => { const v = (k / 1) * Math.pow(Math.max(x, 1e-9), k - 1); return v; } })).concat([{ name: 'your β = ' + b, color: '#111', dash: [5, 4], f: x => b * Math.pow(Math.max(x, 1e-9), b - 1) }]), { axes: { xmin: 0, xmax: 2, ymin: 0, ymax: 8 } });
  }
  wire(sec, calc);
  const L = (b, e, g, t) => { setV('wb-b', b); setV('wb-e', e); setV('wb-g2', g); setV('wb-t', t); calc(); };
  on('wb-lec', 'click', () => L(2, 1000, 0, 500)); on('wb-b05', 'click', () => L(0.5, 2500, 0, 1500)); on('wb-b1', 'click', () => L(1, 1000, 0, 1000)); on('wb-b35', 'click', () => L(3.5, 1000, 0, 900)); on('wb-g', 'click', () => L(2, 1000, 300, 800));
  on('wb-mc', 'click', () => { const b = V('wb-b'), e = V('wb-e'), g = V('wb-g2'), t = V('wb-t'), N = 10000; let c = 0; for (let i = 0; i < N; i++) if (rweib(b, e, g) <= t) c++; el('wb-mcout').textContent = `${c} of ${N} failed by t = ${t}: ${(c / N).toFixed(4)} vs F(t) = ${DIST.weibull({ b, e, g }).F(t).toFixed(4)}`; });
  calc();
})();

/* ===== 3.3 Weibull calculator ===== */
(function () {
  const sec = el('m3-wc'), plot = mkPlot('wc-plot', { xlabel: 'time', ylabel: 'R(t)  ·  R(t | s)', xmin: 0, xmax: 1, ymin: 0, ymax: 1 });
  function calc() {
    const b = V('wc-b'), e = V('wc-e'), g = V('wc-g'), t = V('wc-t'), s = V('wc-s'), Rt = V('wc-R'), N = V('wc-N'), D = DIST.weibull({ b, e, g }), cr = (a, x) => D.R(a + x) / D.R(a);
    const tr = g + e * Math.pow(-Math.log(Rt), 1 / b), mt = g + e * gammaFn(1 + 1 / b);
    setBox('wc-Rt', f4(D.R(t)), 'R(t)', 'hi'); setBox('wc-Ft', f4(D.F(t)), 'F(t)'); setBox('wc-n', Math.round(N * D.F(t)), `of ${N} units`); setBox('wc-tr', nice(tr), `t where R = ${Rt}`); setBox('wc-hb', nice(D.h(tr)), 'h at that age'); setBox('wc-cond', f4(cr(s, t)), `R(${s}+${t})/R(${s})`, cr(s, t) < D.R(t) ? 'bad' : ''); setBox('wc-mttf', nice(mt), 'γ + ηΓ(1+1/β)');
    const hi = g + e * 4, mrl = simpson(x => cr(s, x), 0, hi, 2000); setBox('wc-mrl', nice(mrl), 'numerical ∫R(t|s)dt');
    plot.set([{ name: 'R(t) new item', color: '#2457d6', f: D.R }, { name: `R(t | survived ${s})`, color: '#d23b3b', f: x => cr(s, x) }], { axes: { xmin: 0, xmax: g + e * 2.2, ymin: 0, ymax: 1 }, marks: [{ x: t, y: D.R(t) }, { x: t, y: cr(s, t), color: '#d23b3b' }], vlines: [{ x: tr, label: 'B-life', color: '#12915b' }] });
  }
  wire(sec, calc);
  const L = (b, e, t, s, R, N) => { setV('wc-b', b); setV('wc-e', e); setV('wc-g', 0); setV('wc-t', t); setV('wc-s', s); setV('wc-R', R); setV('wc-N', N); calc(); };
  on('wc-tire', 'click', () => L(2.5, 8000, 5000, 2000, 0.9, 12000)); on('wc-valve', 'click', () => L(0.5, 2000, 4000, 1000, 0.9, 1000)); on('wc-third', 'click', () => L(1 / 3, 16000, 20000, 5000, 0.9, 1000)); on('wc-pm', 'click', () => L(3, 1000, 600, 300, 0.95, 1000));
  calc();
})();

/* ===== 3.4 median-rank plotting ===== */
(function () {
  const sec = el('m3-mr'), p1 = mkPlot('mr-p1', { xlabel: 'ln t', ylabel: 'ln(−ln(1−F))  (Weibull paper)' }), p2 = mkPlot('mr-p2', { xlabel: 't', ylabel: '−ln(1−F)  (exponential paper)' });
  function johnson(fails, sus) {
    const all = fails.map(t => ({ t, f: 1 })).concat(sus.map(t => ({ t, f: 0 }))).sort((a, b) => a.t - b.t || b.f - a.f), n = all.length; let prev = 0; const rows = [];
    all.forEach((x, i) => { const r = n - i; if (x.f) { const inc = (n + 1 - prev) / (1 + r); prev += inc; rows.push({ pos: i + 1, t: x.t, f: 1, r, inc, adj: prev, F: (prev - 0.3) / (n + 0.4) }); } else rows.push({ pos: i + 1, t: x.t, f: 0, r }); });
    return rows;
  }
  function calcCens(sus) {
    const fl = parseList(el('mr-d').value).filter(x => x > 0), rows = johnson(fl, sus), fr = rows.filter(r => r.f), n = rows.length;
    el('mr-cnote').textContent = `n = ${n} (${fr.length} failures, ${sus.length} suspensions) · Johnson adjusted ranks + Bernard (adj − 0.3)/(n + 0.4)`;
    el('mr-tbl').innerHTML = '<tr><th>pos</th><th>t</th><th>status</th><th>reverse rank</th><th>increment I</th><th>adjusted rank</th><th>median rank F (%)</th></tr>' + rows.map(r => r.f ? `<tr><td>${r.pos}</td><td>${r.t}</td><td>F</td><td>${r.r}</td><td>${r.inc.toFixed(4)}</td><td>${(+r.adj.toFixed(4))}</td><td>${(100 * r.F).toFixed(2)}</td></tr>` : `<tr class="dim"><td>${r.pos}</td><td>${r.t}</td><td>S (suspended)</td><td>${r.r}</td><td>—</td><td>—</td><td>—</td></tr>`).join('');
    if (fr.length < 3) { ['mr-b', 'mr-e', 'mr-b10', 'mr-r2', 'mr-l', 'mr-mean'].forEach(i => setBox(i, '—', 'need ≥ 3 failures')); return; }
    const X = fr.map(r => Math.log(r.t)), Y = fr.map(r => Math.log(-Math.log(1 - r.F))), Z = fr.map(r => -Math.log(1 - r.F)), mx = mean(X), my = mean(Y); let sxy = 0, sxx = 0, syy = 0; X.forEach((x, i) => { sxy += (x - mx) * (Y[i] - my); sxx += (x - mx) ** 2; syy += (Y[i] - my) ** 2; });
    const b = sxy / sxx, a = my - b * mx, eta = Math.exp(-a / b), r2 = sxy * sxy / (sxx * syy); let st = 0, ss = 0; fr.forEach((r, i) => { st += r.t * Z[i]; ss += r.t * r.t; }); const lam = st / ss;
    setBox('mr-b', f2(b), 'β̂ (failures only, adjusted ranks)', 'hi'); setBox('mr-e', nice(eta), 'η̂ = exp(−a/β)'); setBox('mr-b10', nice(eta * Math.pow(-Math.log(0.9), 1 / b)), 'η(−ln0.9)^(1/β)'); setBox('mr-r2', r2.toFixed(4), 'straightness'); setBox('mr-l', nice(1 / lam), `λ̂ = ${sci(lam, 3)} per unit`); setBox('mr-mean', nice(eta * gammaFn(1 + 1 / b)), 'ηΓ(1+1/β)');
    const lo = Math.min(...X) - 0.3, hi = Math.max(...X) + 0.3;
    p1.set([{ name: 'failures', color: '#d23b3b', dots: true, pts: X.map((x, i) => [x, Y[i]]), nolines: true }, { name: `fit β = ${b.toFixed(2)}`, color: '#2457d6', f: x => a + b * x }], { axes: { xmin: lo, xmax: hi, ymin: Math.min(...Y) - 0.4, ymax: Math.max(...Y) + 0.4 }, marks: [{ x: Math.log(eta), y: 0, label: 'η (F=63.2 %)', color: '#12915b' }] });
    const tm = Math.max(...fr.map(r => r.t)) * 1.2; p2.set([{ name: 'failures', color: '#d23b3b', dots: true, pts: fr.map((r, i) => [r.t, Z[i]]) }, { name: 'through origin', color: '#12915b', f: x => lam * x }], { axes: { xmin: 0, xmax: tm, ymin: 0, ymax: Math.max(...Z, lam * tm) * 1.1 } });
  }
  window.johnsonRanks = johnson;
  function calc() {
    const sus = parseList(el('mr-s').value).filter(x => x > 0); if (sus.length) return calcCens(sus);
    el('mr-cnote').textContent = '';
    const d = parseList(el('mr-d').value).filter(x => x > 0).sort((a, b) => a - b), n = d.length; if (n < 3) return;
    const bern = el('mr-m').value === 'bernard', F = d.map((_, i) => bern ? bernardRank(i + 1, n) : medianRankExact(i + 1, n)), X = d.map(Math.log), Y = F.map(f => Math.log(-Math.log(1 - f)));
    const mx = mean(X), my = mean(Y); let sxy = 0, sxx = 0, syy = 0; X.forEach((x, i) => { sxy += (x - mx) * (Y[i] - my); sxx += (x - mx) ** 2; syy += (Y[i] - my) ** 2; });
    const b = sxy / sxx, a = my - b * mx, eta = Math.exp(-a / b), r2 = sxy * sxy / (sxx * syy);
    const Z = F.map(f => -Math.log(1 - f)); let st = 0, ss = 0; d.forEach((t, i) => { st += t * Z[i]; ss += t * t; }); const lam = st / ss;
    setBox('mr-b', f2(b), 'β̂ = slope of ln−ln line', 'hi'); setBox('mr-e', nice(eta), 'η̂ = exp(−a/β)'); setBox('mr-b10', nice(eta * Math.pow(-Math.log(0.9), 1 / b)), 'η(−ln0.9)^(1/β)'); setBox('mr-r2', r2.toFixed(4), 'straightness'); setBox('mr-l', nice(1 / lam), `λ̂ = ${sci(lam, 3)} per unit`); setBox('mr-mean', nice(eta * gammaFn(1 + 1 / b)), 'ηΓ(1+1/β)');
    el('mr-tbl').innerHTML = '<tr><th>j</th><th>t</th><th>' + (bern ? 'Bernard' : 'median') + ' rank F (%)</th><th>ln t</th><th>ln(−ln(1−F))</th></tr>' + d.map((t, i) => `<tr><td>${i + 1}</td><td>${t}</td><td>${(100 * F[i]).toFixed(2)}</td><td>${X[i].toFixed(3)}</td><td>${Y[i].toFixed(3)}</td></tr>`).join('');
    const lo = Math.min(...X) - 0.3, hi = Math.max(...X) + 0.3;
    p1.set([{ name: 'data', color: '#d23b3b', dots: true, pts: X.map((x, i) => [x, Y[i]]).map(p => p), nolines: true }, { name: `fit β = ${b.toFixed(2)}`, color: '#2457d6', f: x => a + b * x }], { axes: { xmin: lo, xmax: hi, ymin: Math.min(...Y) - 0.4, ymax: Math.max(...Y) + 0.4 }, marks: [{ x: Math.log(eta), y: 0, label: 'η (F=63.2 %)', color: '#12915b' }] });
    const tm = Math.max(...d) * 1.2; p2.set([{ name: 'data', color: '#d23b3b', dots: true, pts: d.map((t, i) => [t, Z[i]]) }, { name: 'through origin', color: '#12915b', f: x => lam * x }], { axes: { xmin: 0, xmax: tm, ymin: 0, ymax: Math.max(...Z, lam * tm) * 1.1 } });
  }
  wire(sec, calc);
  on('mr-cens', 'click', () => { el('mr-d').value = '410, 780, 1230, 1710, 2350'; el('mr-s').value = '1100, 1500, 1900'; el('mr-m').value = 'bernard'; calc(); });
  on('mr-exp', 'click', () => { el('mr-s').value = ''; el('mr-d').value = '7, 12, 19, 29, 41, 67'; el('mr-m').value = 'exact'; calc(); });
  on('mr-wb', 'click', () => { el('mr-s').value = ''; el('mr-d').value = '17, 24, 26, 43, 43, 46, 50'; el('mr-m').value = 'bernard'; calc(); });
  on('mr-gen', 'click', () => { el('mr-s').value = ''; const a = []; for (let i = 0; i < 10; i++) a.push(Math.round(rweib(2.5, 500))); el('mr-d').value = a.join(', '); calc(); });
  calc();
})();

/* ===== 3.5 hazard models ===== */
(function () {
  const sec = el('m3-hm'), ph = mkPlot('hm-ph', { xlabel: 't (h)', ylabel: 'h(t)' }), pR = mkPlot('hm-pR', { xlabel: 't (h)', ylabel: 'R(t)' });
  let mode = 'lin';
  function calc() {
    const a = V('hm-a'), bb = V('hm-bb'), t = V('hm-t'), h = x => a + bb * x, H = x => a * x + bb * x * x / 2, R = x => Math.exp(-H(x));
    const tmax = bb > 0 ? Math.max(5 * Math.sqrt(2 / bb), 100) : (a > 0 ? 6 / a : 1000), mttf = simpson(R, 0, tmax, 6000);
    setBox('hm-h', nice(h(t)), 'a + bt'); setBox('hm-H', nice(H(t)), 'at + bt²/2'); setBox('hm-R', f4(R(t)), 'exp(−H)', 'hi'); setBox('hm-m', nice(mttf), `∫₀^${nice(tmax)} R dt`);
    setBox('hm-ma', bb === 0 && a > 0 ? nice(1 / a) + ' (=1/a)' : a === 0 && bb > 0 ? nice(Math.sqrt(Math.PI / (2 * bb))) + ' (=√(π/2b))' : '—', bb === 0 ? 'constant hazard' : a === 0 ? 'Rayleigh' : 'no simple form (erfc)');
    const tm = Math.min(tmax, 5000); ph.set([{ color: '#d23b3b', f: h }], { axes: { xmin: 0, xmax: tm, ymin: 0, ymax: Math.max(h(tm), 1e-9) * 1.1 }, marks: [{ x: t, y: h(t) }] }); pR.set([{ color: '#12915b', f: R }], { axes: { xmin: 0, xmax: tm, ymin: 0, ymax: 1 }, marks: [{ x: t, y: R(t) }] });
  }
  wire(sec, calc);
  const L = (a, b, t) => { setV('hm-a', a); setV('hm-bb', b); setV('hm-t', t || 500); calc(); };
  on('hm-c', 'click', () => L(0.001, 0)); on('hm-l', 'click', () => L(0.0002, 0.000004)); on('hm-r', 'click', () => L(0, 2 / 1e6)); on('hm-mix', 'click', () => L(0.0005, 0.000003));
  calc();
})();

/* ===== 3.6 other life distributions ===== */
(function () {
  const sec = el('m3-gal'), pf = mkPlot('gl-pf', { xlabel: 't (h)', ylabel: 'f(t)' }), ph = mkPlot('gl-ph', { xlabel: 't (h)', ylabel: 'h(t)' });
  function fitW(m, s) { const cv = s / m; let lo = 0.2, hi = 20; for (let i = 0; i < 80; i++) { const b = (lo + hi) / 2, c = Math.sqrt(gammaFn(1 + 2 / b) / Math.pow(gammaFn(1 + 1 / b), 2) - 1); if (c > cv) lo = b; else hi = b; } const b = (lo + hi) / 2; return { b, e: m / gammaFn(1 + 1 / b) }; }
  function calc() {
    const m = V('gl-m'), s = V('gl-s'), sy2 = Math.log(1 + (s / m) ** 2), sy = Math.sqrt(sy2), my = Math.log(m) - sy2 / 2, N = DIST.normal({ m, s }), LN = DIST.lognormal({ m: my, s: sy }), W0 = fitW(m, s), W = DIST.weibull(W0), E = DIST.exponential({ l: 1 / m });
    setBox('gl-n', f4(N.R(m)), 'normal R(mean) = 0.5'); setBox('gl-l', `${f4(LN.R(m))} · ${nice(Math.exp(my))}`, 'R(mean) · median = e^μy'); setBox('gl-w2', `${W0.b.toFixed(2)}, ${nice(W0.e)}`, `Weibull R(mean) = ${f4(W.R(m))}`); setBox('gl-x', f4(E.R(m)), 'e⁻¹ (σ = mean)');
    const tm = m + 4 * Math.max(s, 0.3 * m); const L_ = [['normal', N, '#2457d6'], ['log-normal', LN, '#d98200'], ['Weibull', W, '#12915b'], ['exponential', E, '#d23b3b']];
    let hm = 0; L_.forEach(([_, D]) => { for (let i = 1; i <= 100; i++) { const v = D.h(tm * i / 100); if (isFinite(v)) hm = Math.max(hm, Math.min(v, 6 / m * 6)); } });
    pf.set(L_.map(([n, D, c]) => ({ name: n, color: c, f: x => { const v = D.f(Math.max(x, 1e-6)); return isFinite(v) ? Math.min(v, 6 / m) : 0; } })), { axes: { xmin: 0, xmax: tm, ymin: 0, ymax: 4 / m } });
    ph.set(L_.map(([n, D, c]) => ({ name: n, color: c, f: x => { const v = D.h(Math.max(x, 1e-6)); return isFinite(v) ? Math.min(v, 36 / m) : 0; } })), { axes: { xmin: 0, xmax: tm, ymin: 0, ymax: Math.max(hm, 2 / m) * 1.1 } });
  }
  wire(sec, calc); on('gl-d', 'click', () => { setV('gl-m', 1000); setV('gl-s', 300); calc(); }); on('gl-w', 'click', () => { setV('gl-m', 1000); setV('gl-s', 800); calc(); }); calc();
})();

/* ===== 3.7 quiz ===== */
(function () {
  let ans = {};
  function render() {
    el('wq-quiz').innerHTML = WQ.map((q, i) => `<div class="box ${ans[i] === undefined ? 'note' : (ans[i] === q[2] ? 'good' : 'warn')}"><b>${i + 1}.</b> ${esc(q[0])}<div class="row">${q[1].map((o, j) => `<label style="margin-right:12px"><input type="radio" name="wq${i}" data-q="${i}" data-o="${j}" ${ans[i] === j ? 'checked' : ''}> ${esc(o)}</label>`).join('')}</div>${ans[i] === undefined ? '' : `<div class="src"><b>${ans[i] === q[2] ? '✓ correct' : '✗ answer: ' + esc(q[1][q[2]])}</b> — ${esc(q[3])}</div>`}</div>`).join('');
    const done = Object.keys(ans).length, ok = Object.keys(ans).filter(i => ans[i] === WQ[i][2]).length; el('wq-score').textContent = `score ${ok} / ${done} answered (of ${WQ.length})`;
  }
  el('m3-qz').addEventListener('change', e => { const t = e.target; if (t.dataset && t.dataset.q !== undefined) { ans[+t.dataset.q] = +t.dataset.o; render(); } });
  on('wq-reset', 'click', () => { ans = {}; render(); }); render();
})();


/* ===== 3.8 Gamma function ===== */
(function () {
  const sec = el('m3-gam'), pl = mkPlot('gm-plot', { xlabel: 'x', ylabel: 'Γ(x)' });
  function calc() {
    const x = V('gm-x'), b = V('gm-b'), e = V('gm-e'), g = V('gm-g'), G = gammaFn(x), g1 = gammaFn(1 + 1 / b), g2 = gammaFn(1 + 2 / b);
    setBox('gm-gx', f4(G), `Γ(${x})`, 'hi'); setBox('gm-rec', x > 1 ? f4((x - 1) * gammaFn(x - 1)) : '—', 'equals Γ(x) (Γ(x+1)=xΓ(x))');
    setBox('gm-fact', Math.abs(x - Math.round(x)) < 1e-9 && x >= 1 ? `${x - 1}! = ${Math.round(G)}` : 'x not an integer', 'Γ(n) = (n−1)!');
    setBox('gm-g1', f4(g1), `β = ${b}`, 'hi'); setBox('gm-mttf', nice(g + e * g1), 'γ + η·Γ(1+1/β)', 'hi'); setBox('gm-sd', nice(e * Math.sqrt(Math.max(0, g2 - g1 * g1))), 'η√[Γ(1+2/β) − Γ²(1+1/β)]');
    pl.set([{ name: 'Γ(x)', color: '#2457d6', f: t => Math.min(gammaFn(Math.max(t, 0.05)), 12) }], { axes: { xmin: 0, xmax: 5, ymin: 0, ymax: 8 }, marks: [{ x: Math.min(x, 5), y: Math.min(G, 8), label: 'x' }, { x: 1.5, y: gammaFn(1.5), label: 'Γ(1.5)=0.886', color: '#12915b' }] });
  }
  const B = [0.3, 0.5, 0.7, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 10];
  el('gm-tbl').innerHTML = '<tr><th>β</th>' + B.map(v => `<td>${v}</td>`).join('') + '</tr><tr><th>1 + 1/β</th>' + B.map(v => `<td>${(1 + 1 / v).toFixed(3)}</td>`).join('') + '</tr><tr><th>Γ(1+1/β) = MTTF/η</th>' + B.map(v => `<td>${gammaFn(1 + 1 / v).toFixed(4)}</td>`).join('') + '</tr>';
  wire(sec, calc);
  on('gm-half', 'click', () => { setV('gm-x', 0.5); calc(); }); on('gm-5', 'click', () => { setV('gm-x', 5); calc(); });
  on('gm-b2', 'click', () => { setV('gm-b', 2); setV('gm-e', 1000); setV('gm-g', 0); calc(); }); on('gm-b05', 'click', () => { setV('gm-b', 0.5); setV('gm-e', 2500); setV('gm-g', 0); calc(); });
  on('gm-g3', 'click', () => { setV('gm-b', 2); setV('gm-e', 1000); setV('gm-g', 300); calc(); });
  calc();
})();

})();
