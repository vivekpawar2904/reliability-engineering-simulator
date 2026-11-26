/* ===== m4.js : Module 4 — System reliability ===== */
(function () {
'use strict';
const root = $('#tab-m4');
const B = (name, R) => ({ t: 'blk', name, R });
const G = (type, ch, k) => ({ t: 'grp', type, k: k || 1, ch });

root.innerHTML = `
<div class="subnav">
 <a href="#m4-rbd">4.1 RBD builder</a><a href="#m4-circuit">4.2 Series circuit</a><a href="#m4-kn">4.3 k-out-of-n</a>
 <a href="#m4-elem">4.4 Element vs unit redundancy</a><a href="#m4-standby">4.5 Standby vs active</a>
 <a href="#m4-complex">4.6 Complex (bridge)</a><a href="#m4-markov">4.7 Markov 2-unit</a><a href="#m4-markovpdf">4.8 Markov example PDF</a>
</div>

${card('m4-rbd', '4.1', 'Reliability Block Diagram builder — series, parallel, mixed, k-out-of-n', `
 <div class="box feyn"><b>🧒 Plain words:</b> A block is a part. <b>Series</b> = a chain: every part must work, so one weak link drags the whole chain down. <b>Parallel</b> = lanes on a road: the system works if <i>any</i> lane works, so it fails only when <i>all</i> fail. <b>Mixed</b> = chains of lanes or lanes of chains — solve the inside groups first, then the outside.</div>
 <div class="box formula">Series: R<sub>s</sub> = R<sub>1</sub>·R<sub>2</sub>·…·R<sub>n</sub>, and R<sub>s</sub> ≤ min R<sub>i</sub><br>
 Parallel (teacher): R<sub>s</sub> = R<sub>1</sub> + R<sub>2</sub> − R<sub>1</sub>R<sub>2</sub> = 1 − (1−R<sub>1</sub>)(1−R<sub>2</sub>), and R<sub>s</sub> ≥ max R<sub>i</sub><br>
 Exponential parts: R<sub>i</sub>(t) = e<sup>−λ<sub>i</sub>t</sup>; series ⇒ R<sub>s</sub>(t) = e<sup>−(Σλ<sub>i</sub>)t</sup></div>
 <div class="box tip"><b>Exam tip:</b> always (1) state "components independent, two-state", (2) draw the RBD, (3) reduce parallel groups to one equivalent block, (4) multiply the series chain. Never add reliabilities in series.</div>
 <div class="row"><b>Load:</b>
  <button class="btn lec" data-pre="weak8">8 × 0.99 series</button>
  <button class="btn lec" data-pre="weak1">…one part 0.5</button>
  <button class="btn lec" data-pre="par2">R₁=0.90 ‖ R₂=0.98</button>
  <button class="btn lec" data-pre="ex2">[1‖2‖3]–[4‖5]–6 (all 0.9)</button>
  <button class="btn lec" data-pre="sp4">4 units 0.94 series-parallel</button>
  <button class="btn lec" data-pre="pp4">4 units 0.94 parallel-parallel</button>
  <button class="btn lec" data-pre="s37">[1‖2]–[3‖4‖5]–[6‖7‖8‖9]</button>
  <button class="btn lec" data-pre="solve">"Solve now" A–B–(C‖D)–(E‖F) ‖ G</button>
  <button class="btn lec" data-pre="miss">Two missiles ★MSE</button>
  <button class="btn lec" data-pre="rocket">Rocket 3-of-4</button>
  <button class="btn" data-pre="ps">Parallel-series (demo)</button>
 </div>
 <span class="src" id="rbd-src"></span>
 <div class="grid2">
  <div>
   <h3>Build it (edit values, add blocks or groups)</h3>
   <div class="tree" id="rbd-ed"></div>
   <div class="row"><button class="btn sm" id="rbd-wrap-s">wrap root in series</button><button class="btn sm" id="rbd-wrap-p">wrap root in parallel</button><button class="btn sm danger" id="rbd-reset">reset</button></div>
   ${ctl('rbd-T', 'Mission time T', 1, 1000, 1, 100, 'h')}
   ${ctl('rbd-tmax', 'Plot up to', 1, 10, 0.5, 3, '× T')}
   <div class="note box">Each R is the part's reliability <i>at the mission time T</i>. For the R(t) plot I assume exponential parts, so R<sub>i</sub>(t) = R<sub>i</sub><sup>t/T</sup> (λ<sub>i</sub> = −ln R<sub>i</sub> / T).</div>
  </div>
  <div>
   <h3>Diagram</h3><div class="svgbox" id="rbd-svg"></div>
   <div class="outs">${outBox('rbd-Rs', 'System reliability R<sub>s</sub>(T)')}${outBox('rbd-min', 'weakest part (min R<sub>i</sub>)')}${outBox('rbd-max', 'best part (max R<sub>i</sub>)')}${outBox('rbd-F', 'unreliability 1 − R<sub>s</sub>')}</div>
  </div>
 </div>
 <canvas class="plot" id="rbd-plot"></canvas>
 <h3>Monte Carlo — "build a thousand random systems and watch how many survive"</h3>
 <div class="row">${ctl('rbd-N', 'Systems N', 1000, 200000, 1000, 20000, '')}<button class="btn fill" id="rbd-mc">▶ Simulate</button></div>
 <div class="outs">${outBox('rbd-mcR', 'Monte Carlo R<sub>s</sub>(T)')}${outBox('rbd-mcA', 'analytic R<sub>s</sub>(T)')}${outBox('rbd-mcD', 'difference (≈ ±1/√N)')}</div>
 <span class="src">Each part gets a random life T<sub>i</sub> = −ln(U)/λ<sub>i</sub>. Series system life = min, parallel = max, k-of-n = k-th longest life. Dr. Pyne's L9 slides use exactly this idea (Monte-Carlo on an RBD) for RAM studies.</span>
`, CH.lec + ' ' + CH.mse)}

${card('m4-circuit', '4.2', 'Series circuit with constant failure rates (λ<sub>s</sub> = Σ n<sub>i</sub>λ<sub>i</sub>)', `
 <div class="box feyn"><b>🧒 Plain words:</b> In a series system with constant failure rates the <i>rates add up</i>. 4 transistors each at 0.00001 per hour is 0.00004 per hour from transistors alone. Total rate × time gives the exponent.</div>
 <div class="box formula">λ<sub>s</sub> = Σ n<sub>i</sub>λ<sub>i</sub>  ⇒  R<sub>s</sub>(t) = e<sup>−λ<sub>s</sub>t</sup>,  MTTF<sub>s</sub> = 1/λ<sub>s</sub></div>
 <div class="box tip"><b>Exam tip:</b> tabulate n<sub>i</sub>, λ<sub>i</sub>, n<sub>i</sub>λ<sub>i</sub>; add; then substitute t. Units of λ and t must match (per hour ⇒ hours).</div>
 <div class="row"><button class="btn lec" id="circ-lec">Load lecture example (L5–6)</button><button class="btn sm" id="circ-add">+ part type</button></div>
 <div class="tblwrap"><table id="circ-tbl"></table></div>
 <div class="row">${ctl('circ-t1', 'Time t₁', 1, 2000, 1, 10, 'h')}${ctl('circ-t2', 'Time t₂', 1, 2000, 1, 100, 'h')}${ctl('circ-t3', 'Time t₃', 1, 5000, 1, 1000, 'h')}</div>
 <div class="outs">${outBox('circ-ls', 'λ<sub>s</sub> (per hour)')}${outBox('circ-r1', 'R<sub>s</sub>(t₁)')}${outBox('circ-r2', 'R<sub>s</sub>(t₂)')}${outBox('circ-r3', 'R<sub>s</sub>(t₃)')}${outBox('circ-mttf', 'MTTF = 1/λ<sub>s</sub>')}</div>
 <div id="circ-share"></div>
 <canvas class="plot" id="circ-plot"></canvas>
 <span class="src">Slide: "An electronic circuit has 4 transistors, 10 diodes, 20 composite transistors and 10 capacitors … λ<sub>s</sub> = 0.0001, R<sub>s</sub>(10) = 0.999, R<sub>s</sub>(100) = 0.99, R<sub>s</sub>(1000) = 0.90."</span>
`, CH.lec)}

${card('m4-kn', '4.3', 'k-out-of-n structure (binomial)', `
 <div class="box feyn"><b>🧒 Plain words:</b> n identical parts, and the system needs <i>at least k</i> of them. Add up the chances of "exactly k work", "exactly k+1 work" … "all n work". k = n is series (all needed). k = 1 is parallel (one is enough).</div>
 <div class="box formula">R<sub>s</sub> = Σ<sub>i=k</sub><sup>n</sup> C(n,i) R<sup>i</sup> (1−R)<sup>n−i</sup>  = P(X=k) + P(X=k+1) + … + P(X=n)<br>
 exponential units: R = e<sup>−λt</sup> (slide: R(1)=Σ<sub>k</sub><sup>n</sup> n!/(k!(n−k)!) (e<sup>−λt</sup>)<sup>k</sup>(1−e<sup>−λt</sup>)<sup>n−k</sup>)</div>
 <div class="box tip"><b>Exam tip:</b> write n, k, R first; then list each binomial term with its C(n,i); the last term has C(n,n)=1 (the slide once prints 4C3 there by mistake — it's a typo).</div>
 <div class="row"><b>Load:</b><button class="btn lec" data-k="rocket">Rocket 3-of-4, R=0.98</button><button class="btn lec" data-k="boiler">Boiler valves 3-of-5, R=0.95</button><button class="btn lec" data-k="exp23">2-of-3 exponential, R(1)=0.995</button></div>
 <div class="grid2"><div>
  ${ctl('kn-n', 'n (units)', 1, 12, 1, 4, '')}${ctl('kn-k', 'k (needed)', 1, 12, 1, 3, '')}
  <label class="ctl"><span>unit reliability</span><span style="grid-column:2/5"><label style="display:inline-flex;gap:6px;align-items:center"><input type="checkbox" id="kn-exp" data-live> use R = e<sup>−λt</sup></label></span></label>
  <div id="kn-Rctl">${ctl('kn-R', 'Unit R', 0, 1, 0.001, 0.98, '')}</div>
  <div id="kn-expctl" style="display:none">${ctl('kn-lam', 'λ', 0.0001, 0.05, 0.0001, 0.005, '/h')}${ctl('kn-t', 'time t', 0, 2000, 1, 1, 'h')}</div>
  <div class="outs">${outBox('kn-Rs', 'R<sub>s</sub> = P(X ≥ k)')}${outBox('kn-Ru', 'unit R used')}${outBox('kn-ser', 'if series (k=n)')}${outBox('kn-par', 'if parallel (k=1)')}</div>
 </div><div><div class="tblwrap"><table id="kn-tbl"></table></div></div></div>
 <canvas class="plot" id="kn-plot"></canvas>
 <span class="src">Slides (L6): rocket 3 of 4 at 0.98 → 0.9977; 2-of-3 with R=0.995 (λ=0.005, t=1) → 0.999926; boiler with 5 relief valves, any 3 needed, valve failure prob. 0.05 → 0.99884.</span>
`, CH.lec)}

${card('m4-elem', '4.4', 'Redundancy techniques: element vs unit redundancy (and series-parallel vs parallel-series)', `
 <div class="box feyn"><b>🧒 Plain words:</b> Two ways to double a chain of parts. <b>Element (component) redundancy</b>: put a spare beside <i>each</i> part → a series of parallel pairs. <b>Unit (system) redundancy</b>: build a complete second chain → two parallel chains. Same number of parts, but element redundancy is always at least as good because a failure in one chain can still be bypassed in the other chain's good parts.</div>
 <div class="box formula">Element: R<sub>el</sub> = [1 − (1−R)<sup>m</sup>]<sup>n</sup> &nbsp;(series of n parallel groups)<br>Unit: R<sub>un</sub> = 1 − (1 − R<sup>n</sup>)<sup>m</sup> &nbsp;(m parallel chains of n in series)<br>Slide (4 units, R=0.94, n=2, m=2): R<sub>s</sub> = [1−(1−0.94)<sup>2</sup>]<sup>2</sup> = 0.9928</div>
 <div class="box tip"><b>Exam tip:</b> draw both diagrams, give both formulas, state R<sub>el</sub> ≥ R<sub>un</sub>, and mention cost: both use n×m parts, but element redundancy needs more connections/switching points.</div>
 <div class="row"><button class="btn lec" id="el-lec">Load lecture example (4 units, 0.94)</button><button class="btn" id="el-demo">Demo: 3 parts, 0.9, 2 copies</button></div>
 ${ctl('el-n', 'Parts in chain n', 1, 6, 1, 2, '')}${ctl('el-m', 'Copies m', 1, 5, 1, 2, '')}${ctl('el-R', 'Part R', 0.5, 0.999, 0.001, 0.94, '')}
 <div class="outs">${outBox('el-base', 'no redundancy R<sup>n</sup>')}${outBox('el-el', 'element redundancy')}${outBox('el-un', 'unit redundancy')}${outBox('el-gain', 'element − unit')}</div>
 <div class="grid2"><div><b>Element redundancy</b><div class="svgbox" id="el-svg1"></div></div><div><b>Unit redundancy</b><div class="svgbox" id="el-svg2"></div></div></div>
 <h3>Diminishing returns of parallel copies (one block)</h3><div id="el-dim"></div>
 <span class="src">Slide L6 ("system has four active, independent and identical units forming a series-parallel configuration, each R = 0.94") → 0.9928. Parallel-parallel is the slide's "try this".</span>
`, CH.lec + ' ' + CH.pred)}

${card('m4-standby', '4.5', 'Standby redundancy vs active (hot) parallel', `
 <div class="box feyn"><b>🧒 Plain words:</b> <b>Active parallel</b>: both engines run all the time, both wear. <b>Standby</b>: the spare sits switched off (like the spare tyre) and starts only when the first unit fails, so its life starts later. Standby gives longer life (MTTF 2/λ vs 1.5/λ) if the switch works.</div>
 <div class="box formula">Single: R = e<sup>−λt</sup>, MTTF = 1/λ<br>Active parallel (2 identical): R = 2e<sup>−λt</sup> − e<sup>−2λt</sup>, MTTF = 3/(2λ)<br>Standby (perfect switch, no dormant failure): R = e<sup>−λt</sup>(1 + λt), MTTF = 2/λ<br>Standby with switch reliability R<sub>sw</sub>: R = e<sup>−λt</sup>(1 + R<sub>sw</sub>λt)</div>
 <div class="box tip"><b>Exam tip:</b> always say "perfect switching, spare does not fail while on standby, constant λ". Do <b>not</b> use the hot-parallel formula for a cold standby.</div>
 <div class="box note">${CH.pred} Dr. Pyne's syllabus lists standby redundancy but the lecture slides say little; the formulas here are the textbook ones (Kapur &amp; Lamberson / O'Connor). Use the parameters below as ${CH.demo}.</div>
 <div class="row"><button class="btn" id="sb-demo">Load demo (λ = 0.01/h, t = 100 h)</button></div>
 ${ctl('sb-lam', 'λ per unit', 0.0005, 0.05, 0.0005, 0.01, '/h')}${ctl('sb-t', 'mission time t', 1, 500, 1, 100, 'h')}${ctl('sb-sw', 'switch R<sub>sw</sub>', 0, 1, 0.01, 1, '')}${ctl('sb-N', 'Monte Carlo N', 1000, 200000, 1000, 20000, '')}
 <div class="outs">${outBox('sb-r1', 'single R(t)')}${outBox('sb-r2', 'active parallel R(t)')}${outBox('sb-r3', 'standby R(t)')}${outBox('sb-m', 'MTTF: single / active / standby')}</div>
 <div class="row"><button class="btn fill" id="sb-mc">▶ Monte Carlo check</button><span id="sb-mcout" class="mono"></span></div>
 <canvas class="plot" id="sb-plot"></canvas>
`, CH.pred + ' ' + CH.demo)}

${card('m4-complex', '4.6', 'Complex (non-series-parallel) system — the bridge network', `
 <div class="box feyn"><b>🧒 Plain words:</b> Some networks can't be broken into series and parallel pieces. The classic is the <b>bridge</b>: unit E is a cross-link. Trick: <i>condition on E</i>. If E works, short the link and solve the easy network; if E fails, remove it and solve the other easy network. Then R = R<sub>E</sub>·(E works) + (1−R<sub>E</sub>)·(E fails). The simulator also checks by trying all 2<sup>5</sup> = 32 states.</div>
 <div class="box formula">R<sub>s</sub> = R<sub>E</sub>·R<sub>s</sub>|<sub>E good</sub> + (1−R<sub>E</sub>)·R<sub>s</sub>|<sub>E failed</sub><br>E good: (A‖B) in series with (C‖D) &nbsp; E failed: (A–C) ‖ (B–D)<br>Minimal paths: AC, BD, AED, BEC &nbsp; Minimal cuts: AB, CD, ADE, BCE<br>All R equal: R<sub>s</sub> = 2R² + 2R³ − 5R⁴ + 2R⁵</div>
 <div class="box tip"><b>Exam tip:</b> the syllabus says "complex systems". Show the decomposition (or path/cut sets), state which method you used and finish with a number. Do not force a bridge into series-parallel.</div>
 <div class="row"><button class="btn" id="br-demo">Load demo: all five at 0.9 (textbook value 0.97848)</button></div>
 <div class="grid2"><div>
  ${ctl('br-A', 'R of A', 0, 1, 0.001, 0.9, '')}${ctl('br-B', 'R of B', 0, 1, 0.001, 0.9, '')}${ctl('br-C', 'R of C', 0, 1, 0.001, 0.9, '')}${ctl('br-D', 'R of D', 0, 1, 0.001, 0.9, '')}${ctl('br-E', 'R of E (bridge)', 0, 1, 0.001, 0.9, '')}
  <div class="outs">${outBox('br-R', 'R<sub>s</sub> (conditioning)')}${outBox('br-R2', 'R<sub>s</sub> (all 32 states)')}${outBox('br-Rg', 'if E good')}${outBox('br-Rb', 'if E failed')}</div>
 </div><div><div class="svgbox" id="br-svg"></div><div id="br-sets" class="note box"></div></div></div>
`, CH.pred + ' ' + CH.demo)}

${card('m4-markov', '4.7', 'Markov analysis — two identical units (states 2 → 1 → 0)', `
 <div class="box feyn"><b>🧒 Plain words:</b> Count how many units are still up: state 2, state 1, state 0. Arrows show how fast you move: from 2 to 1 at rate <b>2λ</b> (either unit can fail), from 1 to 0 at <b>λ</b>, and a repair from 1 back to 2 at <b>μ</b>. Every state's probability P<sub>i</sub>(t) rises or falls according to "flow in minus flow out". <b>Reliability</b>: state 0 is a trap (no repair out of it) so R(t) = P<sub>2</sub> + P<sub>1</sub>. <b>Availability</b>: you repair from 0 too, so A(t) = P<sub>2</sub> + P<sub>1</sub> with a way back.</div>
 <div class="box formula">dP<sub>2</sub>/dt = −2λP<sub>2</sub> + μP<sub>1</sub><br>dP<sub>1</sub>/dt = 2λP<sub>2</sub> − (λ+μ)P<sub>1</sub> (+ μP<sub>0</sub> if repairing from 0)<br>dP<sub>0</sub>/dt = λP<sub>1</sub> (− μP<sub>0</sub> if repairing from 0)<br>Reliability: R(t) = P<sub>2</sub>(t) + P<sub>1</sub>(t), P(0) = (1,0,0); MTTF = (3λ + μ)/(2λ²)<br>Availability (single repair crew): A(∞) = P<sub>2</sub>+P<sub>1</sub> = (μ² + 2λμ)/(μ² + 2λμ + 2λ²)</div>
 <div class="box tip"><b>Exam tip:</b> draw the state diagram and label every arrow, write the dP/dt equations, say "initially all up", then define R or A from the up-states. Absorbing 0 ⇒ reliability; repair from 0 ⇒ availability. Don't solve all of it unless the question gives numbers.</div>
 <div class="box note">${CH.demo} The lecture set only a general Markov idea plus the example PDF in 4.8; the 2-unit rates below are made up for practice.</div>
 <div class="row"><button class="btn" id="mk-demo">Load demo (λ = 0.01, μ = 0.1)</button>
  <label><input type="radio" name="mk-mode" value="R" checked data-live> Reliability (state 0 absorbing)</label>
  <label><input type="radio" name="mk-mode" value="A" data-live> Availability (repair from 0 too)</label></div>
 <div class="grid2"><div>
  ${ctl('mk-lam', 'λ failure rate', 0.001, 0.2, 0.001, 0.01, '/h')}${ctl('mk-mu', 'μ repair rate', 0, 1, 0.005, 0.1, '/h')}${ctl('mk-tmax', 'plot to t =', 10, 2000, 10, 300, 'h')}${ctl('mk-ts', 'scrub time t', 0, 2000, 1, 100, 'h')}
  <div class="outs">${outBox('mk-P2', 'P₂(t) both up')}${outBox('mk-P1', 'P₁(t) one up')}${outBox('mk-P0', 'P₀(t) both down')}${outBox('mk-Rt', 'R(t) or A(t) = P₂+P₁')}${outBox('mk-mttf', 'MTTF (R mode) / A(∞) (A mode)')}</div>
 </div><div><div class="svgbox" id="mk-svg"></div></div></div>
 <canvas class="plot" id="mk-plot"></canvas>
 <div class="row">${ctl('mk-N', 'Monte Carlo N', 500, 100000, 500, 10000, '')}<button class="btn fill" id="mk-mc">▶ Simulate random failures &amp; repairs</button></div>
 <div class="outs">${outBox('mk-mcR', 'Monte Carlo at scrub time')}${outBox('mk-mcA', 'numerical (RK4)')}${outBox('mk-mcM', 'Monte Carlo mean life (R mode)')}</div>
`, CH.demo + ' ' + CH.pred)}

${card('m4-markovpdf', '4.8', 'The "Markov example" PDF — reliability falls as time passes', `
 <div class="box feyn"><b>🧒 Plain words:</b> The shared paper (Kalaiarasi et al., 2017) builds a 4-element, 13-state Markov model of a hospital system including human error. You are <i>not</i> expected to solve 13 equations. You are expected to know the message: R(t) falls and F(t) = 1 − R(t) rises as t grows.</div>
 <div class="box formula">R(t) = Σ P<sub>i</sub>(t) over non-failed states, F(t) = 1 − R(t)</div>
 <canvas class="plot" id="mp-plot"></canvas>
 <div class="tblwrap"><table><tr><th>t (years)</th><th>2</th><th>3</th><th>4</th><th>5</th></tr><tr><td>R(t)</td><td>0.7626</td><td>0.6143</td><td>0.5426</td><td>0.4588</td></tr><tr><td>F(t)=1−R</td><td>0.2374</td><td>0.3857</td><td>0.4574</td><td>0.5412</td></tr></table></div>
 <span class="src">Table 2 of Markov_example.pdf, copied verbatim. The simulator draws straight lines between the four printed points (it does not recompute the 13-state model).</span>
`, CH.lec)}
`;

/* ------------------------------------------------------------------ 4.1 RBD */
(function () {
  const card = $('#m4-rbd');
  let tree = G('series', [B('A', 0.95), G('parallel', [B('B', 0.9), B('C', 0.9)]), B('D', 0.98)]);
  let nameCtr = 0, mcLives = null;
  const plot = new Plot($('#rbd-plot'), { xmin: 0, xmax: 300, ymin: 0, ymax: 1, xlabel: 'time t (h)', ylabel: 'reliability' });
  const blocks = n => n.t === 'blk' ? [n] : n.ch.flatMap(blocks);

  function ed(n, path) {
    const p = path.join('.');
    if (n.t === 'blk') return `<li><div class="node" data-p="${p}"><input type="text" data-f="name" value="${esc(n.name)}" aria-label="name"><span>R =</span><input type="number" data-f="R" min="0" max="1" step="0.001" value="${n.R}"> ${path.length ? '<button class="btn sm danger" data-act="del" title="delete">✕</button>' : ''}</div></li>`;
    const sel = ['series', 'parallel', 'kofn'].map(t => `<option value="${t}"${n.type === t ? ' selected' : ''}>${t === 'kofn' ? 'k-out-of-n' : t}</option>`).join('');
    return `<li><div class="node gate" data-p="${p}"><b>Group</b><select data-f="type">${sel}</select>${n.type === 'kofn' ? `<span>k =</span><input type="number" data-f="k" min="1" max="${n.ch.length || 1}" step="1" value="${n.k}">` : ''}<button class="btn sm" data-act="addb">+ block</button><button class="btn sm" data-act="addg">+ group</button>${path.length ? '<button class="btn sm danger" data-act="del">✕</button>' : ''}</div><ul>${n.ch.map((c, i) => ed(c, path.concat(i))).join('')}</ul></li>`;
  }
  function nextName() { return String.fromCharCode(65 + (nameCtr++ % 26)) + (nameCtr > 26 ? Math.floor(nameCtr / 26) : ''); }
  function renumber() { nameCtr = 0; (function w(n) { if (n.t === 'blk') n.name = nextName(); else n.ch.forEach(w); })(tree); }
  function render() { $('#rbd-ed').innerHTML = `<ul>${ed(tree, [])}</ul>`; update(); }
  function update(noMC) {
    const T = Math.max(1e-9, V('rbd-T')), tm = V('rbd-tmax'), bl = blocks(tree);
    $('#rbd-svg').innerHTML = rbdSVG(tree);
    const Rs = rbdEval(tree, 1), mn = Math.min(...bl.map(b => b.R)), mx = Math.max(...bl.map(b => b.R));
    setBox('rbd-Rs', fR(Rs), 'system reliability R<sub>s</sub>(T)', 'hi'); setBox('rbd-min', fx(mn, 4), 'weakest part (min R<sub>i</sub>)'); setBox('rbd-max', fx(mx, 4), 'best part (max R<sub>i</sub>)'); setBox('rbd-F', fx(1 - Rs, 6), 'unreliability 1 − R<sub>s</sub>');
    const ser = [{ name: 'system R<sub>s</sub>(t)'.replace(/<[^>]+>/g, ''), color: '#2457d6', width: 3, f: x => rbdEval(tree, x / T) },
      { name: 'weakest part', color: '#d23b3b', dash: [6, 4], f: x => Math.pow(mn, x / T) }, { name: 'best part', color: '#12915b', dash: [6, 4], f: x => Math.pow(mx, x / T) }];
    if (mcLives) { const pts = []; const N = mcLives.length; for (let i = 0; i <= 60; i++) { const tau = tm * i / 60; let lo = 0, hi = N; while (lo < hi) { const m = (lo + hi) >> 1; if (mcLives[m] > tau) hi = m; else lo = m + 1; } pts.push([tau * T, (N - lo) / N]); } ser.push({ name: 'Monte Carlo', color: '#f59e0b', pts, dots: false, width: 2 }); }
    const low = Math.min(rbdEval(tree, tm), Math.pow(mn, tm)), ymin = low > 0.9 ? Math.floor(low * 50) / 50 : low > 0.5 ? Math.floor(low * 10) / 10 : 0;
    plot.set(ser, { axes: { xmin: 0, xmax: tm * T, ymin }, vlines: [{ x: T, color: '#64748b', label: 'T' }], marks: [{ x: T, y: Rs, label: 'R<sub>s</sub>(T)'.replace(/<[^>]+>/g, '') + '=' + Rs.toFixed(4) }] });
    if (!noMC) { mcLives = null; setBox('rbd-mcR', '—', 'Monte Carlo R<sub>s</sub>(T)'); setBox('rbd-mcA', fx(Rs, 4), 'analytic R<sub>s</sub>(T)'); setBox('rbd-mcD', '—', 'difference (≈ ±1/√N)'); }
  }
  card.addEventListener('input', e => {
    const f = e.target.dataset.f; if (!f) return;
    const nd = nodeAt(tree, parsePath(e.target.closest('[data-p]').dataset.p));
    if (f === 'name') nd.name = e.target.value; else if (f === 'R') nd.R = clamp(parseFloat(e.target.value) || 0, 0, 1); else if (f === 'k') nd.k = Math.max(1, parseInt(e.target.value) || 1);
    if (f !== 'type') update();
  });
  card.addEventListener('change', e => { if (e.target.dataset.f === 'type') { const nd = nodeAt(tree, parsePath(e.target.closest('[data-p]').dataset.p)); nd.type = e.target.value; if (nd.type === 'kofn') nd.k = clamp(nd.k || 1, 1, Math.max(1, nd.ch.length)); render(); } });
  card.addEventListener('click', e => {
    const a = e.target.closest('[data-act]'); if (!a) return;
    const path = parsePath(a.closest('[data-p]').dataset.p), nd = nodeAt(tree, path);
    if (a.dataset.act === 'addb') nd.ch.push(B(nextName(), 0.9));
    if (a.dataset.act === 'addg') nd.ch.push(G('parallel', [B(nextName(), 0.9), B(nextName(), 0.9)]));
    if (a.dataset.act === 'del') { const par = nodeAt(tree, path.slice(0, -1)); par.ch.splice(path[path.length - 1], 1); }
    render();
  });
  wire(card, e => { if (e.target.dataset.n === 'rbd-N' || e.target.dataset.r === 'rbd-N') return; update(); });
  $('#rbd-wrap-s').onclick = () => { tree = G('series', [tree]); render(); };
  $('#rbd-wrap-p').onclick = () => { tree = G('parallel', [tree]); render(); };
  $('#rbd-reset').onclick = () => { tree = G('series', [B('A', 0.95), B('B', 0.9)]); nameCtr = 2; render(); };

  const eq = (n, R, p) => { const a = []; for (let i = 0; i < n; i++) a.push(B('', R)); return a; };
  const PRE = {
    weak8: () => ({ s: 'L5–6: Rseries = 0.99⁸ = 0.92 (92%).', t: G('series', eq(8, 0.99)) }),
    weak1: () => { const a = eq(8, 0.99); a[5].R = 0.5; return { s: 'L5–6: with one part at 0.5 the series drops to 0.47 (47%): "effect of one low-reliability part on system".', t: G('series', a) }; },
    par2: () => ({ s: 'L6 "Parallel (Example 1)": R₁ = 0.90, R₂ = 0.98 → Rs = 1−(0.10)(0.02) = 0.998.', t: G('parallel', [B('1', 0.9), B('2', 0.98)]) }),
    ex2: () => ({ s: 'L6 "Parallel (Example 2)", all 0.90: (0.999)(0.99)(0.9). Slide prints 0.889, the exact product is 0.8901 (slide rounding).', t: G('series', [G('parallel', [B('1', .9), B('2', .9), B('3', .9)]), G('parallel', [B('4', .9), B('5', .9)]), B('6', .9)]) }),
    sp4: () => ({ s: 'L6: four identical units, R = 0.94, series-parallel: [1−(1−0.94)²]² = 0.9928.', t: G('series', [G('parallel', [B('1', .94), B('2', .94)]), G('parallel', [B('3', .94), B('4', .94)])]) }),
    pp4: () => ({ s: 'L6 "Try this, parallel-parallel": two parallel pairs in parallel, R = 0.94 each (answer not printed on the slide; computed here).', t: G('parallel', [G('parallel', [B('1', .94), B('2', .94)]), G('parallel', [B('3', .94), B('4', .94)])]) }),
    s37: () => ({ s: 'L6 slide: R₁,₂ = 0.99, R₃,₄,₅ = 0.992, R₆,₇,₈,₉ = 0.9919, R = 0.974.', t: G('series', [G('parallel', [B('1', .9), B('2', .9)]), G('parallel', [B('3', .8), B('4', .8), B('5', .8)]), G('parallel', [B('6', .7), B('7', .7), B('8', .7), B('9', .7)])]) }),
    solve: () => ({ s: 'L6 "Solve now" (A=0.95, B=0.97, C=0.92, D=0.94, E=0.90, F=0.88, G=0.98): the slide gives the question only; the answer is computed here.', t: G('parallel', [G('series', [B('A', .95), B('B', .97), G('parallel', [B('C', .92), B('D', .94)]), G('parallel', [B('E', .9), B('F', .88)])]), B('G', .98)]) }),
    miss: () => ({ s: 'MSE Q3.a: two missiles, each R = 0.92, at least one hits = 1−(0.08)² = 0.9936.', t: G('parallel', [B('M1', .92), B('M2', .92)]) }),
    rocket: () => ({ s: 'L6: rocket needs 3 of 4 engines, each 0.98 → 0.9977 (k-out-of-n group).', t: G('kofn', [B('E1', .98), B('E2', .98), B('E3', .98), B('E4', .98)], 3) }),
    ps: () => ({ s: 'DEMO (mine): two series chains in parallel (parallel-series).', t: G('parallel', [G('series', [B('A', .9), B('B', .9), B('C', .9)]), G('series', [B('D', .9), B('E', .9), B('F', .9)])]) })
  };
  $$('[data-pre]', card).forEach(b => b.addEventListener('click', () => { const o = PRE[b.dataset.pre](); tree = o.t; renumberUnnamed(); $('#rbd-src').innerHTML = (b.classList.contains('lec') ? CH.lec : CH.demo) + ' ' + esc(o.s); render(); }));
  function renumberUnnamed() { nameCtr = 0; (function w(n) { if (n.t === 'blk') { if (!n.name) n.name = nextName(); else nameCtr++; } else n.ch.forEach(w); })(tree); }
  $('#rbd-mc').onclick = () => {
    const N = Math.round(V('rbd-N')), L = new Float64Array(N); let ok = 0;
    for (let i = 0; i < N; i++) { L[i] = rbdLife(tree); if (L[i] > 1) ok++; }
    mcLives = Array.from(L).sort((a, b) => a - b); const emp = ok / N, an = rbdEval(tree, 1);
    setBox('rbd-mcR', fx(emp, 4), 'Monte Carlo R<sub>s</sub>(T), N=' + N, 'hi'); setBox('rbd-mcA', fx(an, 4), 'analytic R<sub>s</sub>(T)'); setBox('rbd-mcD', (emp - an >= 0 ? '+' : '') + fx(emp - an, 4), 'difference (95% band ±' + fx(1.96 * Math.sqrt(an * (1 - an) / N), 4) + ')');
    update(true);
  };
  renumber(); render();
  window.RBD_TEST = { get: () => tree };
})();

/* ------------------------------------------------------------------ 4.2 circuit */
(function () {
  const card = $('#m4-circuit');
  let rows = [{ n: 'Transistors', c: 4, l: 0.00001 }, { n: 'Diodes', c: 10, l: 0.000002 }, { n: 'Composite transistors', c: 20, l: 0.000001 }, { n: 'Capacitors', c: 10, l: 0.000002 }];
  const plot = new Plot($('#circ-plot'), { xmin: 0, xmax: 2000, ymin: 0, ymax: 1, xlabel: 'time t (h)', ylabel: 'R(t)' });
  function render() {
    $('#circ-tbl').innerHTML = '<tr><th>Part type</th><th>number n<sub>i</sub></th><th>λ<sub>i</sub> (per h)</th><th>n<sub>i</sub>λ<sub>i</sub></th><th></th></tr>' +
      rows.map((r, i) => `<tr data-i="${i}"><td><input type="text" data-f="n" value="${esc(r.n)}"></td><td><input type="number" data-f="c" min="0" step="1" value="${r.c}"></td><td><input type="number" data-f="l" min="0" step="any" value="${r.l}"></td><td class="mono" id="circ-c${i}"></td><td><button class="btn sm danger" data-del="${i}">✕</button></td></tr>`).join('');
    update();
  }
  function update() {
    const parts = rows.map(r => r.c * r.l), ls = parts.reduce((a, b) => a + b, 0);
    parts.forEach((p, i) => { const e = $('#circ-c' + i); if (e) e.textContent = sci(p, 3); });
    const t = [V('circ-t1'), V('circ-t2'), V('circ-t3')];
    setBox('circ-ls', sci(ls, 4), 'λ<sub>s</sub> (per hour)', 'hi');
    t.forEach((x, i) => setBox('circ-r' + (i + 1), fx(Math.exp(-ls * x), 4), 'R<sub>s</sub>(' + x + ' h)'));
    setBox('circ-mttf', ls > 0 ? fx(1 / ls, 0) + ' h' : '∞', 'MTTF = 1/λ<sub>s</sub>');
    $('#circ-share').innerHTML = '<h3>Who is eating the reliability?</h3>' + rows.map((r, i) => `<div class="barrow"><span>${esc(r.n)}</span><div class="bar"><i style="width:${ls ? 100 * parts[i] / ls : 0}%"></i></div><span>${ls ? (100 * parts[i] / ls).toFixed(0) : 0}%</span></div>`).join('');
    plot.set([{ name: 'R_s(t)=exp(−λ_s t)', color: '#2457d6', width: 3, f: x => Math.exp(-ls * x) }], { vlines: t.map((x, i) => ({ x, color: '#94a3b8' })), marks: t.map(x => ({ x, y: Math.exp(-ls * x), label: Math.exp(-ls * x).toFixed(3) })) });
  }
  card.addEventListener('input', e => { const tr = e.target.closest('tr[data-i]'); if (tr && e.target.dataset.f) { const r = rows[+tr.dataset.i], f = e.target.dataset.f; r[f] = f === 'n' ? e.target.value : parseFloat(e.target.value) || 0; update(); } });
  card.addEventListener('click', e => { if (e.target.dataset.del !== undefined) { rows.splice(+e.target.dataset.del, 1); render(); } });
  $('#circ-add').onclick = () => { rows.push({ n: 'New part', c: 1, l: 0.00001 }); render(); };
  wire(card, update);
  $('#circ-lec').onclick = () => { rows = [{ n: 'Transistors', c: 4, l: 0.00001 }, { n: 'Diodes', c: 10, l: 0.000002 }, { n: 'Composite transistors', c: 20, l: 0.000001 }, { n: 'Capacitors', c: 10, l: 0.000002 }]; setV('circ-t1', 10); setV('circ-t2', 100); setV('circ-t3', 1000); render(); };
  render();
})();

/* ------------------------------------------------------------------ 4.3 k-out-of-n */
(function () {
  const card = $('#m4-kn');
  const plot = new Plot($('#kn-plot'), { xmin: 0, xmax: 1, ymin: 0, ymax: 1, xlabel: 'unit reliability R', ylabel: 'system R_s' });
  function unitR() { return $('#kn-exp').checked ? Math.exp(-V('kn-lam') * V('kn-t')) : V('kn-R'); }
  function update() {
    const exp = $('#kn-exp').checked; $('#kn-Rctl').style.display = exp ? 'none' : ''; $('#kn-expctl').style.display = exp ? '' : 'none';
    let n = Math.round(V('kn-n')), k = Math.round(V('kn-k')); if (k > n) { k = n; setV('kn-k', k); }
    const kr = $('input[data-r="kn-k"]'); kr.max = n;
    const R = unitR(), Rs = kOutOfN(n, k, R);
    setBox('kn-Rs', fx(Rs, 6), 'R<sub>s</sub> = P(X ≥ k)', 'hi'); setBox('kn-Ru', fx(R, 6), 'unit R used'); setBox('kn-ser', fx(Math.pow(R, n), 6), 'if series (k=n)'); setBox('kn-par', fx(1 - Math.pow(1 - R, n), 6), 'if parallel (k=1)');
    let h = '<tr><th>i working</th><th>C(n,i)</th><th>R<sup>i</sup>(1−R)<sup>n−i</sup></th><th>P(X=i)</th><th></th></tr>';
    for (let i = n; i >= 0; i--) { const p = binomTerm(n, i, R); h += `<tr style="${i >= k ? 'background:#e8f8f0' : ''}"><td>${i}${i >= k ? ' ✓' : ''}</td><td>${nCr(n, i)}</td><td class="mono">${sci(Math.pow(R, i) * Math.pow(1 - R, n - i), 4)}</td><td class="mono"><b>${p.toFixed(5)}</b></td><td style="width:90px"><div class="bar"><i style="width:${100 * p}%;background:${i >= k ? '#12915b' : '#94a3b8'}"></i></div></td></tr>`; }
    $('#kn-tbl').innerHTML = h;
    if (exp) { const lam = V('kn-lam'), tm = Math.max(V('kn-t') * 3, 10 / Math.max(lam, 1e-9) * 0.3);
      plot.set([{ name: 'k-of-n (chosen)', color: '#2457d6', width: 3, f: x => kOutOfN(n, k, Math.exp(-lam * x)) }, { name: 'series (k=n)', color: '#d23b3b', dash: [6, 4], f: x => Math.pow(Math.exp(-lam * x), n) }, { name: 'parallel (k=1)', color: '#12915b', dash: [6, 4], f: x => 1 - Math.pow(1 - Math.exp(-lam * x), n) }, { name: 'single unit', color: '#64748b', dash: [2, 3], f: x => Math.exp(-lam * x) }],
        { axes: { xmin: 0, xmax: tm, xlabel: 'time t (h)', ylabel: 'R(t)' }, marks: [{ x: V('kn-t'), y: Rs, label: Rs.toFixed(6) }] });
    } else plot.set([{ name: 'k-of-n (chosen)', color: '#2457d6', width: 3, f: x => kOutOfN(n, k, x) }, { name: 'series (k=n)', color: '#d23b3b', dash: [6, 4], f: x => Math.pow(x, n) }, { name: 'parallel (k=1)', color: '#12915b', dash: [6, 4], f: x => 1 - Math.pow(1 - x, n) }, { name: 'single unit', color: '#64748b', dash: [2, 3], f: x => x }],
      { axes: { xmin: 0, xmax: 1, xlabel: 'unit reliability R', ylabel: 'system R_s' }, marks: [{ x: R, y: Rs, label: Rs.toFixed(4) }] });
  }
  wire(card, update);
  const P = {
    rocket: () => { $('#kn-exp').checked = false; setV('kn-n', 4); setV('kn-k', 3); setV('kn-R', 0.98); },
    boiler: () => { $('#kn-exp').checked = false; setV('kn-n', 5); setV('kn-k', 3); setV('kn-R', 0.95); },
    exp23: () => { $('#kn-exp').checked = true; setV('kn-n', 3); setV('kn-k', 2); setV('kn-lam', 0.005); setV('kn-t', 1); }
  };
  $$('[data-k]', card).forEach(b => b.onclick = () => { P[b.dataset.k](); update(); });
  update();
})();

/* ------------------------------------------------------------------ 4.4 element vs unit */
(function () {
  const card = $('#m4-elem');
  const chain = (n, R) => G('series', Array.from({ length: n }, (_, i) => B(String(i + 1), R)));
  function update() {
    const n = Math.round(V('el-n')), m = Math.round(V('el-m')), R = V('el-R');
    const el = Math.pow(1 - Math.pow(1 - R, m), n), un = 1 - Math.pow(1 - Math.pow(R, n), m);
    setBox('el-base', fx(Math.pow(R, n), 4), 'no redundancy R<sup>n</sup>'); setBox('el-el', fx(el, 5), 'element redundancy', 'hi'); setBox('el-un', fx(un, 5), 'unit redundancy', 'hi'); setBox('el-gain', fx(el - un, 5), 'element − unit (≥ 0)');
    const t1 = G('series', Array.from({ length: n }, (_, i) => m === 1 ? B(String(i + 1), R) : G('parallel', Array.from({ length: m }, (_, j) => B(i + 1 + String.fromCharCode(97 + j), R)))));
    const t2 = m === 1 ? chain(n, R) : G('parallel', Array.from({ length: m }, (_, j) => G('series', Array.from({ length: n }, (_, i) => B(i + 1 + String.fromCharCode(97 + j), R)))));
    $('#el-svg1').innerHTML = rbdSVG(t1); $('#el-svg2').innerHTML = rbdSVG(t2);
    $('#el-dim').innerHTML = [1, 2, 3, 4, 5, 6].map(k => { const r = 1 - Math.pow(1 - R, k); return `<div class="barrow"><span>${k} in parallel</span><div class="bar"><i style="width:${100 * r}%"></i></div><span>${r.toFixed(5)}</span></div>`; }).join('') + '<div class="note box">Each extra copy buys less: the first spare is worth a lot, the fifth almost nothing — and each costs the same.</div>';
  }
  wire(card, update);
  $('#el-lec').onclick = () => { setV('el-n', 2); setV('el-m', 2); setV('el-R', 0.94); update(); };
  $('#el-demo').onclick = () => { setV('el-n', 3); setV('el-m', 2); setV('el-R', 0.9); update(); };
  update();
})();

/* ------------------------------------------------------------------ 4.5 standby */
(function () {
  const card = $('#m4-standby');
  const plot = new Plot($('#sb-plot'), { xmin: 0, xmax: 500, ymin: 0, ymax: 1, xlabel: 'time t (h)', ylabel: 'R(t)' });
  const fS = (l, t) => Math.exp(-l * t), fA = (l, t) => 2 * Math.exp(-l * t) - Math.exp(-2 * l * t), fB = (l, t, s) => Math.exp(-l * t) * (1 + s * l * t);
  function update() {
    const l = V('sb-lam'), t = V('sb-t'), s = V('sb-sw');
    setBox('sb-r1', fx(fS(l, t), 4), 'single R(t)'); setBox('sb-r2', fx(fA(l, t), 4), 'active parallel R(t)'); setBox('sb-r3', fx(fB(l, t, s), 4), 'standby R(t)', 'hi');
    setBox('sb-m', `${fx(1 / l, 0)} / ${fx(1.5 / l, 0)} / ${fx((1 + s) / l, 0)} h`, 'MTTF: single / active / standby');
    plot.set([{ name: 'single unit', color: '#64748b', f: x => fS(l, x) }, { name: 'active parallel (2)', color: '#d97706', f: x => fA(l, x) }, { name: 'standby (R_sw=' + s + ')', color: '#2457d6', width: 3, f: x => fB(l, x, s) }],
      { axes: { xmax: Math.max(5 / l, 10) }, vlines: [{ x: t, color: '#94a3b8', label: 't' }] });
  }
  wire(card, update);
  $('#sb-demo').onclick = () => { setV('sb-lam', 0.01); setV('sb-t', 100); setV('sb-sw', 1); update(); };
  $('#sb-mc').onclick = () => {
    const l = V('sb-lam'), t = V('sb-t'), s = V('sb-sw'), N = Math.round(V('sb-N')); let a = 0, b = 0, c = 0, sum = [0, 0, 0];
    for (let i = 0; i < N; i++) { const t1 = rexp(l), t2 = rexp(l); const L1 = t1, L2 = Math.max(t1, t2), L3 = t1 + (Math.random() < s ? t2 : 0); if (L1 > t) a++; if (L2 > t) b++; if (L3 > t) c++; sum[0] += L1; sum[1] += L2; sum[2] += L3; }
    $('#sb-mcout').innerHTML = `MC (N=${N}): single ${(a / N).toFixed(4)} | active ${(b / N).toFixed(4)} | standby ${(c / N).toFixed(4)} &nbsp;·&nbsp; mean life ${(sum[0] / N).toFixed(0)} / ${(sum[1] / N).toFixed(0)} / ${(sum[2] / N).toFixed(0)} h`;
  };
  update();
})();

/* ------------------------------------------------------------------ 4.6 bridge */
(function () {
  const card = $('#m4-complex');
  const names = ['A', 'B', 'C', 'D', 'E'];
  function struct(st) { const [A, B_, C, D, E] = st; return (A && C) || (B_ && D) || (A && E && D) || (B_ && E && C); }
  function update() {
    const R = names.map(n => V('br-' + n)), [a, b, c, d, e] = R;
    const good = (1 - (1 - a) * (1 - b)) * (1 - (1 - c) * (1 - d));
    const bad = 1 - (1 - a * c) * (1 - b * d);
    const cond = e * good + (1 - e) * bad;
    let enumR = 0; for (let m = 0; m < 32; m++) { const st = names.map((_, i) => !!(m >> i & 1)); let p = 1; st.forEach((u, i) => p *= u ? R[i] : 1 - R[i]); if (struct(st)) enumR += p; }
    setBox('br-R', fx(cond, 5), 'R<sub>s</sub> (conditioning)', 'hi'); setBox('br-R2', fx(enumR, 5), 'R<sub>s</sub> (all 32 states)', 'hi'); setBox('br-Rg', fx(good, 5), 'if E good'); setBox('br-Rb', fx(bad, 5), 'if E failed');
    // minimal path & cut sets by brute force
    const paths = [], cuts = [];
    for (let m = 1; m < 32; m++) { const st = names.map((_, i) => !!(m >> i & 1)); if (struct(st) && !paths.some(p => (p & m) === p)) paths.push(m); }
    paths.sort((x, y) => pc(x) - pc(y));
    const minimalPaths = paths.filter(p => !paths.some(q => q !== p && (q & p) === q));
    for (let m = 1; m < 32; m++) { const st = names.map((_, i) => !(m >> i & 1)); if (!struct(st)) cuts.push(m); }
    const minimalCuts = cuts.filter(c => !cuts.some(q => q !== c && (q & c) === q));
    const nm = m => names.filter((_, i) => m >> i & 1).join('');
    $('#br-sets').innerHTML = '<b>Minimal paths</b> (work ⇒ system works): ' + minimalPaths.map(nm).join(', ') + '<br><b>Minimal cut sets</b> (fail ⇒ system fails): ' + minimalCuts.map(nm).join(', ');
    $('#br-svg').innerHTML = bridgeSVG(R);
    function pc(x) { let c = 0; while (x) { c += x & 1; x >>= 1; } return c; }
  }
  function bridgeSVG(R) {
    const bx = (x, y, nme, r) => `<rect x="${x}" y="${y}" width="64" height="34" rx="7" fill="#eaf0ff" stroke="#2457d6" stroke-width="1.5"/><text x="${x + 32}" y="${y + 14}" text-anchor="middle" font-size="12" font-weight="700" fill="#14224a">${nme}</text><text x="${x + 32}" y="${y + 28}" text-anchor="middle" font-size="11" fill="#334155">${(+r).toFixed(3)}</text>`;
    const ln = (a, b, c, d) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="#334155" stroke-width="1.6"/>`;
    return `<svg width="360" height="200" viewBox="0 0 360 200" font-family="system-ui">${ln(10, 100, 50, 100)}${ln(50, 45, 50, 155)}${ln(50, 45, 70, 45)}${ln(50, 155, 70, 155)}
      ${bx(70, 28, 'A', R[0])}${bx(70, 138, 'B', R[1])}${ln(134, 45, 160, 45)}${ln(134, 155, 160, 155)}${ln(180, 45, 180, 155)}${ln(160, 45, 226, 45)}${ln(160, 155, 226, 155)}
      <rect x="148" y="83" width="64" height="34" rx="7" fill="#fdf0ff" stroke="#7a3fd1" stroke-width="1.5" transform="translate(0,0)" /><text x="180" y="98" text-anchor="middle" font-size="12" font-weight="700" fill="#4c2a9a">E</text><text x="180" y="112" text-anchor="middle" font-size="11" fill="#334155">${(+R[4]).toFixed(3)}</text>
      ${bx(226, 28, 'C', R[2])}${bx(226, 138, 'D', R[3])}${ln(290, 45, 310, 45)}${ln(290, 155, 310, 155)}${ln(310, 45, 310, 155)}${ln(310, 100, 350, 100)}</svg>`;
  }
  wire(card, update);
  $('#br-demo').onclick = () => { names.forEach(n => setV('br-' + n, 0.9)); update(); };
  update();
})();

/* ------------------------------------------------------------------ 4.7 Markov 2-unit */
(function () {
  const card = $('#m4-markov');
  const plot = new Plot($('#mk-plot'), { xmin: 0, xmax: 300, ymin: 0, ymax: 1, xlabel: 'time t (h)', ylabel: 'probability' });
  const mode = () => $('input[name=mk-mode]:checked').value;
  function solve(lam, mu, rep0, tmax, steps) {
    let P = [1, 0, 0]; const f = p => { const [p2, p1, p0] = p; return [-2 * lam * p2 + mu * p1, 2 * lam * p2 - (lam + mu) * p1 + (rep0 ? mu * p0 : 0), lam * p1 - (rep0 ? mu * p0 : 0)]; };
    const out = [[0, P.slice()]], h = tmax / steps;
    for (let i = 0; i < steps; i++) {
      const k1 = f(P), k2 = f(P.map((v, j) => v + h / 2 * k1[j])), k3 = f(P.map((v, j) => v + h / 2 * k2[j])), k4 = f(P.map((v, j) => v + h * k3[j]));
      P = P.map((v, j) => v + h / 6 * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j])); out.push([(i + 1) * h, P.slice()]);
    }
    return out;
  }
  function at(sol, t) { const h = sol[1][0]; const i = clamp(Math.round(t / h), 0, sol.length - 1); return sol[i][1]; }
  let sol = null;
  function update() {
    const lam = V('mk-lam'), mu = V('mk-mu'), tmax = V('mk-tmax'), rep0 = mode() === 'A';
    const tsr = $('input[data-r="mk-ts"]'); tsr.max = tmax; if (V('mk-ts') > tmax) setV('mk-ts', tmax);
    const ts = V('mk-ts'); sol = solve(lam, mu, rep0, tmax, 2000);
    const P = at(sol, ts);
    setBox('mk-P2', fx(P[0], 4), 'P₂(t) both up'); setBox('mk-P1', fx(P[1], 4), 'P₁(t) one up'); setBox('mk-P0', fx(P[2], 4), 'P₀(t) both down');
    setBox('mk-Rt', fx(P[0] + P[1], 4), (rep0 ? 'A' : 'R') + '(t) = P₂+P₁', 'hi');
    if (rep0) { const Ainf = (mu * mu + 2 * lam * mu) / (mu * mu + 2 * lam * mu + 2 * lam * lam); setBox('mk-mttf', fx(Ainf, 4), 'steady-state A(∞)'); }
    else setBox('mk-mttf', fx((3 * lam + mu) / (2 * lam * lam), 1) + ' h', 'MTTF = (3λ+μ)/(2λ²)');
    const xs = i => sol.map(s => [s[0], s[1][i]]);
    const up = sol.map(s => [s[0], s[1][0] + s[1][1]]);
    plot.set([{ name: (rep0 ? 'A(t)' : 'R(t)') + ' = P2+P1', color: '#2457d6', width: 3, pts: up }, { name: 'P2 (both up)', color: '#12915b', pts: xs(0), dash: [5, 3] }, { name: 'P1 (one up)', color: '#d97706', pts: xs(1), dash: [5, 3] }, { name: 'P0 (down)', color: '#d23b3b', pts: xs(2), dash: [5, 3] }],
      { axes: { xmin: 0, xmax: tmax }, vlines: [{ x: ts, color: '#94a3b8', label: 't' }] });
    $('#mk-svg').innerHTML = mkSVG(lam, mu, rep0, P);
    setBox('mk-mcR', '—', 'Monte Carlo at scrub time'); setBox('mk-mcA', fx(P[0] + P[1], 4), 'numerical (RK4)'); setBox('mk-mcM', '—', 'Monte Carlo mean life (R mode)');
  }
  function mkSVG(lam, mu, rep0, P) {
    const st = (x, lbl, p, col) => `<circle cx="${x}" cy="80" r="${26 + 24 * p}" fill="${col}" fill-opacity=".25" stroke="${col}" stroke-width="2.5"/><text x="${x}" y="76" text-anchor="middle" font-size="15" font-weight="700" fill="#14224a">${lbl}</text><text x="${x}" y="94" text-anchor="middle" font-size="12" fill="#14224a">${p.toFixed(3)}</text>`;
    const ar = (x1, x2, y, lab, col) => `<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#334155"/></marker></defs><line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${col || '#334155'}" stroke-width="2" marker-end="url(#ah)"/><text x="${(x1 + x2) / 2}" y="${y + (y < 80 ? -6 : 16)}" text-anchor="middle" font-size="12" fill="${col || '#334155'}">${lab}</text>`;
    return `<svg width="470" height="165" viewBox="0 0 470 165" font-family="system-ui,sans-serif">${st(60, '2 up', P[0], '#12915b')}${st(230, '1 up', P[1], '#d97706')}${st(400, '0', P[2], '#d23b3b')}
      ${ar(92, 196, 60, '2λ = ' + (2 * lam).toFixed(3))}${ar(196, 92, 108, 'μ = ' + mu.toFixed(3), '#12915b')}${ar(264, 366, 60, 'λ = ' + lam.toFixed(3))}${rep0 ? ar(366, 264, 108, 'μ = ' + mu.toFixed(3), '#12915b') : `<text x="315" y="150" text-anchor="middle" font-size="12" fill="#d23b3b">no repair out of 0 ⇒ absorbing (reliability)</text>`}</svg>`;
  }
  wire(card, update);
  $('#mk-demo').onclick = () => { setV('mk-lam', 0.01); setV('mk-mu', 0.1); setV('mk-tmax', 300); setV('mk-ts', 100); update(); };
  $('#mk-mc').onclick = () => {
    const lam = V('mk-lam'), mu = V('mk-mu'), ts = V('mk-ts'), N = Math.round(V('mk-N')), rep0 = mode() === 'A'; let upAt = 0, life = 0;
    for (let i = 0; i < N; i++) {
      let s = 2, t = 0;
      if (!rep0) {
        while (s !== 0) { t += rexp(s === 2 ? 2 * lam : lam + mu); if (s === 2) s = 1; else if (Math.random() < lam / (lam + mu)) s = 0; else s = 2; }
        life += t; if (t > ts) upAt++;
      } else {
        while (true) {
          const dt = rexp(s === 2 ? 2 * lam : s === 1 ? lam + mu : mu); if (t + dt > ts) break; t += dt;
          if (s === 2) s = 1; else if (s === 1) s = Math.random() < lam / (lam + mu) ? 0 : 2; else s = 1;
        }
        if (s !== 0) upAt++;
      }
    }
    setBox('mk-mcR', fx(upAt / N, 4), (rep0 ? 'A' : 'R') + '(t) Monte Carlo, N=' + N, 'hi');
    if (!rep0) setBox('mk-mcM', fx(life / N, 1) + ' h', 'MC mean life (theory ' + fx((3 * lam + mu) / (2 * lam * lam), 1) + ')');
  };
  update();
})();

/* ------------------------------------------------------------------ 4.8 Markov PDF table */
(function () {
  const plot = new Plot($('#mp-plot'), { xmin: 1.5, xmax: 5.5, ymin: 0, ymax: 1, xlabel: 't (years)', ylabel: 'probability' });
  const R = [[2, .7626], [3, .6143], [4, .5426], [5, .4588]], F = R.map(p => [p[0], +(1 - p[1]).toFixed(4)]);
  plot.set([{ name: 'R(t) reliability', color: '#2457d6', width: 3, pts: R, dots: true }, { name: 'F(t) = 1 − R(t)', color: '#d23b3b', width: 3, pts: F, dots: true }]);
})();
})();
