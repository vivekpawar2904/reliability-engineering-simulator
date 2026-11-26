/* ===== m6.js : Module 6 — FMECA, fault tree, event tree ===== */
(function () {
'use strict';
const root = $('#tab-m6');
const pf = p => p === 0 ? '0' : p >= 0.001 ? (+p.toFixed(5)).toString() : p.toExponential(2);

root.innerHTML = `
<div class="subnav">
 <a href="#m6-concept">6.1 FMEA · FMECA · RCM</a><a href="#m6-fmeca">6.2 FMECA worksheet</a><a href="#m6-fta">6.3 Fault tree</a><a href="#m6-eta">6.4 Event tree</a><a href="#m6-cmp">6.5 FTA vs ETA vs RBD</a><a href="#m6-sod">6.2b S·O·D scales</a><a href="#m6-sym">6.6 FTA symbols</a><a href="#m6-rcm">6.7 RCM 7 steps</a><a href="#m6-rcmv">6.8 RCM vs FMEA/FMECA</a><a href="#m6-cbm">6.9 CBM · P–F</a>
</div>

${card('m6-concept', '6.1', 'FMEA vs FMECA vs RCM — the big picture', `
 <div class="box feyn"><b>🧒 Plain words:</b> <b>FMEA</b> = a worksheet of "what can break, and what happens then?" (qualitative). <b>FMECA</b> adds the C: a number for <i>how critical</i> each failure mode is (quantitative), so you can rank them. <b>RCM</b> starts the other way round, from what the system must <i>do</i> (functions), and asks how those functions can fail.</div>
 <div class="grid2"><div class="tblwrap"><table><tr><th></th><th>FMEA</th><th>FMECA</th><th>RCM (top-down)</th></tr>
  <tr><td><b>Nature</b></td><td>qualitative</td><td>quantitative criticality</td><td>function-led strategy</td></tr>
  <tr><td><b>Starts from</b></td><td>component failure modes (bottom-up)</td><td>same + criticality</td><td>functions in operating context</td></tr>
  <tr><td><b>Standard</b></td><td>—</td><td>MIL-STD-1629 (C = criticality), SAE J1739 (auto)</td><td>SAE JA 1011 / JA 1012</td></tr>
  <tr><td><b>Result</b></td><td>modes + effects</td><td>ranked risks (CRN / RPN)</td><td>PM / PdM / CM / RTF / redesign</td></tr></table></div>
 <div>
  <b>The seven RCM questions (SAE JA1011)</b>
  <ol style="margin:4px 0;padding-left:20px;font-size:14px"><li>Functions &amp; performance standards</li><li>Functional failures</li><li>Failure modes (what causes each)</li><li>Failure effects (what happens)</li><li>Failure consequences (why it matters)</li><li>Proactive tasks &amp; intervals</li><li>Default actions (if no task is suitable)</li></ol>
 </div></div>
 <div class="box formula">RE framework (L6): RBD → Reliability analysis → Criticality / risk → FMEA/FMECA → P-F analysis → Maintenance strategy → CBM → Feedback<br>RPN = Severity × Occurrence × Detection &nbsp;(prioritise; do <b>not</b> pick the maintenance strategy from RPN alone)<br>Lecture example ranks by CRN = S × O</div>
 <div class="box tip"><b>Exam tip:</b> define FMEA (qualitative) and FMECA (quantitative criticality); procedure: item → function → failure modes → causes → effects → S, O (, D) → rank → action → re-score. Mention bottom-up (FMEA) vs top-down (RCM), and one 1–2 row example.</div>
 <details><summary>Logic tree: every failure mode goes into a bin (L10, RCM step 6)</summary><div class="tag-list" style="margin-top:6px"><span class="pill">Safety related</span><span class="pill">Outage related</span><span class="pill">Economics related</span><span class="pill">Hidden-failure consequences</span></div><p style="font-size:13px">"All failure modes are not created equal" — the logic-tree analysis (LTA) decides how much effort each deserves.</p></details>
 <details><summary>Definitions to quote (L11)</summary><p style="font-size:14px"><b>Failure</b> = inability of an asset to do what its users want. <b>Functional failure</b> = inability to fulfil a function to an acceptable standard. <b>Failure mode</b> = the way a failure of a part is <i>observed</i> (an external effect, not the cause). <b>Failure effect</b> = what happens when the mode occurs. <b>Indenture level</b> = how far a part is indented below its parent in the system list.</p></details>
`, CH.lec)}

${card('m6-fmeca', '6.2', 'FMECA worksheet — add rows, rank by CRN or RPN, colour the risk', `
 <div class="box feyn"><b>🧒 Plain words:</b> Score each failure mode for <b>S</b>everity (how bad if it happens), <b>O</b>ccurrence (how likely) and optionally <b>D</b>etection (how likely you'll miss it — 10 = you'd never see it coming). Multiply to rank: the biggest number gets fixed first. Dr. Pyne's lecture example ranks by <b>CRN = S × O</b>; the general framework uses <b>RPN = S × O × D</b>. After a fix, re-score (O′, D′) to see the residual risk.</div>
 <div class="box formula">CRN = S × O &nbsp;(L11 example, S and O on 1–10) &nbsp;|&nbsp; RPN = S × O × D (L6)<br>MIL-STD-1629 criticality: C<sub>m</sub> = β·α·λ<sub>p</sub>·t &nbsp;and&nbsp; C<sub>r</sub> = Σ C<sub>m</sub> (see calculator below)</div>
 <div class="box tip"><b>Exam tip:</b> draw the table with columns: item, function, failure mode (with cause), effect, S, O, (D), CRN/RPN, action. Rank, then say which two rows you would attack first. Remember RPN does not choose the strategy by itself.</div>
 <div class="row"><button class="btn lec" id="fm-lec">Load lecture example (flash drum, CRN = S×O)</button><button class="btn" id="fm-demo">Load demo (S×O×D)</button><button class="btn" id="fm-add">+ add row</button><button class="btn" id="fm-csv">⬇ export CSV</button><button class="btn danger sm" id="fm-clear">clear</button></div>
 <div class="row"><b>Rank by:</b>
  <label><input type="radio" name="fm-metric" value="crn" checked data-live> CRN = S×O</label>
  <label><input type="radio" name="fm-metric" value="rpn" data-live> RPN = S×O×D</label>
  <label><input type="checkbox" id="fm-sort" data-live checked> auto-sort (after you leave a cell)</label></div>
 <div class="row">${ctl('fm-hi', 'red from ≥', 1, 1000, 1, 30, '')}${ctl('fm-md', 'amber from ≥', 1, 1000, 1, 15, '')}<span class="src">Colour thresholds are ${CH.demo} (the lecture gives no cut-offs); they reset to sensible values when you switch metric.</span></div>
 <div class="tblwrap"><table id="fm-tbl"></table></div>
 <span class="src" id="fm-note"></span>
 <div class="grid2"><div><h3>Criticality matrix (severity × occurrence)</h3><div class="svgbox" id="fm-mat"></div></div><div><h3>Ranking (Pareto)</h3><div id="fm-par"></div></div></div>
 <details><summary>Severity index (L11 slide) and occurrence index</summary>
  <div class="grid2"><div class="tblwrap"><table><tr><th>Severity</th><th>Definition</th><th>Index</th></tr>
   <tr><td>Extremely high</td><td>may cause safety hazard or major damage to equipment, or production loss &gt; 24 h</td><td>10, 9</td></tr>
   <tr><td>Very high</td><td>major disruption, production loss &lt; 24 h and &gt; 12 h</td><td>8, 7</td></tr>
   <tr><td>High</td><td>major disruption, production loss &lt; 12 h and &gt; 4 h</td><td>6, 5</td></tr>
   <tr><td>Moderate</td><td>disruption, loss &lt; 4 h and/or high maintenance cost</td><td>4, 3</td></tr>
   <tr><td>Low</td><td>no significant effect on production</td><td>2, 1</td></tr></table></div>
  <div class="tblwrap"><table><tr><th>Probability of occurrence</th><th>Definition</th></tr>
   <tr><td>Frequent</td><td>failure with repetitive history in less than 1 year</td></tr><tr><td>Reasonably probable</td><td>incidents with single occurrence, may re-occur</td></tr><tr><td>Occasional</td><td>no history but has potential of occurrence</td></tr><tr><td>Remote</td><td>less potential of occurrence</td></tr><tr><td>Extremely unlikely</td><td>rare chance of occurrence</td></tr></table></div></div>
  <span class="src">The slide prints one severity index number per row boundary, so I show each band as a pair (10-9, 8-7, …). The occurrence slide has no index numbers.</span></details>
 <h3>MIL-STD-1629 criticality calculator ${CH.pred} ${CH.demo}</h3>
 <div class="box note">The lecture says "the C in FMECA represents the criticality calculation (MIL-STD-1629)" without a worked example. Here is the standard quantitative form with demo numbers.<br>C<sub>m</sub> = β × α × λ<sub>p</sub> × t: β = probability the effect causes loss of function, α = failure-mode ratio (share of the part's failures that take this mode), λ<sub>p</sub> = part failure rate, t = operating time.</div>
 <div class="tblwrap"><table id="cm-tbl"></table></div>
`, CH.lec + ' ' + CH.demo)}

${card('m6-sod', '6.2b', 'Severity, Occurrence, Detection scales (1–10) and RPN — pick a rating, read the meaning', `
 <div class="box feyn"><b>🧒 Plain words:</b> Give each failure three marks out of 10: <b>S</b> — how bad is it if it happens, <b>O</b> — how often will it happen, <b>D</b> — how likely are we to <i>miss</i> it before it hurts (10 = we would never see it coming; 1 = certain to be caught). Multiply: <b>RPN = S × O × D</b>, between 1 and 1000. Biggest RPN gets attention first.</div>
 <div class="box formula">RPN = S × O × D (1 – 1000) &nbsp;|&nbsp; CRN = S × O (1 – 100, L11 flash-drum example) &nbsp;|&nbsp; after an action: re-score and recompute</div>
 <div class="box tip"><b>Exam tip:</b> always say that the <i>scales are chosen by the team</i> — quote your own bands. D is "ability to detect": a high D is <b>bad</b>. RPN has ties and exaggerates small differences, so it prioritises investigation; it does not choose the maintenance strategy alone.</div>
 <div class="row"><button class="btn lec" id="sod-before">Before: seal leak S 7, O 4, D 5 (RPN 140)</button><button class="btn" id="sod-after">After leak sensor + better seal: S 7, O 2, D 2 (RPN 28)</button><button class="btn lec" id="sod-fd">Flash drum overpressure S 10, O 3 (CRN 30)</button></div>
 <div class="grid2"><div>${ctl('sod-s', 'Severity S', 1, 10, 1, 7, '')}${ctl('sod-o', 'Occurrence O', 1, 10, 1, 4, '')}${ctl('sod-d', 'Detection D', 1, 10, 1, 5, '')}</div>
 <div><div class="outs">${outBox('sod-rpn', 'RPN = S×O×D')}${outBox('sod-crn', 'CRN = S×O')}${outBox('sod-band', 'priority band')}</div></div></div>
 <div class="box note" id="sod-txt"></div>
 <div class="tblwrap"><table class="cover"><tr><th>Rating</th><th>Severity S (lecture L11: production-loss bands)</th><th>Occurrence O (typical textbook)</th><th>Detection D (typical textbook)</th></tr>
 <tr><td>10</td><td>safety hazard / major equipment damage / loss &gt; 24 h</td><td>very high: ≥ 1 in 2</td><td>absolutely cannot detect (no control)</td></tr>
 <tr><td>9 – 8</td><td>production loss 12 – 24 h (very high)</td><td>high: 1 in 3 to 1 in 8</td><td>very remote – remote</td></tr>
 <tr><td>7 – 6</td><td>loss 4 – 12 h (high)</td><td>moderate: 1 in 20 to 1 in 80</td><td>low – moderate</td></tr>
 <tr><td>5 – 4</td><td>loss &lt; 4 h / high maintenance cost</td><td>low: 1 in 400 to 1 in 2 000</td><td>moderately high – high</td></tr>
 <tr><td>3 – 2</td><td>no significant effect on production</td><td>remote: 1 in 15 000 to 1 in 150 000</td><td>very high</td></tr>
 <tr><td>1</td><td>no effect</td><td>very remote: ≤ 1 in 1 500 000</td><td>almost certain to detect (error-proof)</td></tr></table></div>
 <span class="src">${CH.lec} Severity bands and CRN = S×O: L11 flash-drum slides; RPN = S×O×D: L6. ${CH.tb} The occurrence ratios and the detection wording are typical AIAG-style tables from the textbooks — state your own ranges in the exam.</span>
`, CH.lec + ' ' + CH.tb)}

${card('m6-fta', '6.3', 'Fault tree builder and evaluator (AND / OR / voting / XOR)', `
 <div class="box feyn"><b>🧒 Plain words:</b> Pick one bad thing (the <b>top event</b>) and ask "how can this happen?" Break the answer into smaller causes joined by gates. <b>OR</b> gate: <i>any</i> one cause is enough (probabilities nearly add; looks like a series RBD). <b>AND</b> gate: <i>all</i> causes must happen together (probabilities multiply; looks like a parallel RBD). Circles are basic events (root causes), diamonds are undeveloped events. Fault trees live in <b>failure space</b>; RBDs in <b>success space</b>.</div>
 <div class="box formula">AND: P = ΠP<sub>i</sub> &nbsp; (RBD parallel: R<sub>s</sub> = R<sub>A</sub> + R<sub>B</sub> − R<sub>A</sub>R<sub>B</sub>)<br>OR: P = 1 − Π(1 − P<sub>i</sub>) &nbsp; (RBD series: R<sub>s</sub> = R<sub>A</sub>·R<sub>B</sub>·R<sub>C</sub>)<br>Voting OR (k of n fail): P = P(at least k of n events) ↔ RBD (n−k+1)-out-of-n success<br>R<sub>s</sub> = 1 − P(top) when the logic is the same. Minimal cut set = smallest set of basic events that together cause the top event; a cut set of one event is a single point of failure.</div>
 <div class="box tip"><b>Exam tip:</b> history: Bell Telephone Laboratories 1962 for the US Air Force, then Boeing. Draw a real tree with symbols (rectangle event, circle basic, diamond undeveloped, AND, OR, transfer). State OR ↔ series, AND ↔ parallel, and "FTA fails / RBD succeeds". Basic events assumed independent.</div>
 <div class="row"><b>Load:</b>
  <button class="btn lec" data-ft="light">No light in the room</button>
  <button class="btn lec" data-ft="fire">Fire-protection system fails</button>
  <button class="btn lec" data-ft="car">Car will not start</button>
  <button class="btn lec" data-ft="exam">Fail (project / two exams)</button>
  <button class="btn lec" data-ft="combo">FTD ↔ RBD combination (A…Q)</button>
  <button class="btn lec" data-ft="miss">Two missiles ★MSE</button>
  <button class="btn lec" data-ft="rocket">3-of-4 rocket twin (voting 2/4)</button></div>
 <span class="src" id="ft-src"></span>
 <div class="grid2"><div>
  <h3>Edit the tree</h3><div class="tree" id="ft-ed"></div>
  <div class="row"><button class="btn sm" id="ft-wrap-or">wrap in OR</button><button class="btn sm" id="ft-wrap-and">wrap in AND</button></div>
 </div><div>
  <div class="outs">${outBox('ft-top', 'P(top event)')}${outBox('ft-R', 'R<sub>s</sub> = 1 − P(top)')}${outBox('ft-n', 'basic events / gates')}${outBox('ft-spf', 'single points of failure')}</div>
  <h3>Minimal cut sets</h3><div id="ft-cs" class="note box"></div>
 </div></div>
 <h3>Fault tree diagram</h3><div class="svgbox" id="ft-svg"></div>
 <h3>Equivalent reliability block diagram (failure space → success space)</h3><div class="svgbox" id="ft-rbd"></div><div id="ft-rbdnote" class="note box"></div>
 <h3>Which basic event matters most? (Birnbaum importance = ∂P(top)/∂p<sub>i</sub>)</h3><div class="tblwrap"><table id="ft-imp"></table></div>
 <span class="src">Structures are Dr. Pyne's L11–12 trees. The slides print no event probabilities, so those are ${'<b>demo</b>'} values — except the MSE missiles (0.08 each) and the rocket twin (0.02 each, from the L6 numerical).</span>
`, CH.lec + ' ' + CH.demo)}

${card('m6-eta', '6.4', 'Event tree analysis — start with an initiating event, branch on each safety barrier', `
 <div class="box feyn"><b>🧒 Plain words:</b> Something starts going wrong (the <b>initiating event</b>). Then, one after another, safety barriers either work or don't. Each path from left to right is a story with its own probability (multiply along the branches) and its own ending — from "all fine" to "disaster". The fault tree looks <i>backwards</i> from a failure; the event tree looks <i>forward</i> from a trigger.</div>
 <div class="box formula">path probability = Π (branch probabilities) &nbsp;|&nbsp; outcome frequency = f<sub>initiating</sub> × path probability &nbsp;|&nbsp; Σ(all outcomes) = f<sub>initiating</sub><br>ETA is inductive; barriers written as negative statements ("sprinkler does not function"): True = failure of the barrier.</div>
 <div class="box tip"><b>Exam tip:</b> steps (L12, Rausand): define the initiating event → identify the barriers → construct the tree → describe the sequences → determine frequency and conditional probabilities → calculate outcome frequencies → present. Draw a 2-branch tree left to right with True/False and probabilities.</div>
 <div class="row"><b>Load:</b><button class="btn lec" data-et="iec">Explosion → fire → sprinkler → alarm (IEC 60300-3-9)</button><button class="btn lec" data-et="gas">Gas outlet blocked (structure)</button><button class="btn" data-et="demo">Short-circuit (demo)</button></div>
 <span class="src" id="et-src"></span>
 <div class="grid2"><div>
  <label>Initiating event<input type="text" id="et-name" data-live value="Explosion"></label>
  ${ctl('et-f', 'frequency (per year)', 0.000001, 1, 0.000001, 0.01, '/yr')}
  <h3>Barriers / questions (left to right)</h3><div id="et-cols"></div>
  <div class="row"><button class="btn sm" id="et-add">+ add barrier</button></div>
 </div><div>
  <div class="tblwrap"><table id="et-tbl"></table></div>
  <h3>Totals by outcome</h3><div class="tblwrap"><table id="et-sum"></table></div>
  <div class="row">${ctl('et-N', 'Monte Carlo events', 1000, 1000000, 1000, 100000, '')}<button class="btn fill" id="et-mc">▶ Simulate</button></div>
 </div></div>
 <div class="svgbox" id="et-svg"></div>
`, CH.lec + ' ' + CH.demo)}

${card('m6-cmp', '6.5', 'FTA vs ETA vs RBD — the same system seen three ways', `
 <div class="box feyn"><b>🧒 Plain words:</b> Main cooling pump P1 with a standby pump P2. <b>RBD</b>: "which paths still work?" — two lanes in parallel. <b>FTA</b>: "how can we lose cooling?" — AND of both pumps failing. <b>ETA</b>: "P1 fails — what happens next?" — does the standby start? All three give the <i>same</i> number when the logic is the same.</div>
 <div class="row"><button class="btn lec" id="cm-miss">Load ★MSE missiles (0.08, 0.08)</button><button class="btn" id="cm-demo">Demo pumps (0.1, 0.2)</button></div>
 ${ctl('cm-p1', 'P(P1 fails)', 0, 1, 0.001, 0.1, '')}${ctl('cm-p2', 'P(P2 fails)', 0, 1, 0.001, 0.2, '')}
 <div class="outs">${outBox('cm-rbd', 'RBD: R<sub>s</sub> = R₁+R₂−R₁R₂')}${outBox('cm-fta', 'FTA: P(top) = p₁·p₂')}${outBox('cm-eta', 'ETA: P(loss of cooling path)')}${outBox('cm-chk', 'R<sub>s</sub> + P(top) = 1 ?')}</div>
 <div class="grid3"><div><b>RBD (success space)</b><div class="svgbox" id="cm-s1"></div></div><div><b>Fault tree (failure space)</b><div class="svgbox" id="cm-s2"></div></div><div><b>Event tree (forward in time)</b><div class="svgbox" id="cm-s3"></div></div></div>
 <div class="tblwrap" style="margin-top:10px"><table><tr><th></th><th>RBD</th><th>FTA</th><th>ETA</th></tr>
  <tr><td><b>Direction</b></td><td>success paths, left → right</td><td>top → down (deductive)</td><td>left → right in time (inductive)</td></tr>
  <tr><td><b>Question</b></td><td>which paths still work?</td><td>how did this failure happen?</td><td>what happens next?</td></tr>
  <tr><td><b>Logic / symbols</b></td><td>blocks: series, parallel, k-of-n</td><td>AND, OR, voting, basic ○, undeveloped ◇</td><td>initiating event, barriers, True/False branches</td></tr>
  <tr><td><b>Space</b></td><td>success</td><td>failure</td><td>sequences and consequences</td></tr>
  <tr><td><b>Result</b></td><td>R<sub>s</sub></td><td>P(top), cut sets</td><td>outcome probabilities / frequencies</td></tr></table></div>
 <div class="box tip"><b>Exam tip (L12):</b> "In an RBD we work in success space, in a fault tree in failure space. An FTA is usually easy to convert into an RBD, the reverse is harder for complex graphs. The results are the same if the logic is the same."</div>
`, CH.lec + ' ' + CH.mse)}

${card('m6-sym', '6.6', 'Fault tree symbols — gates, events, and the transfer / inhibit / priority-AND explained', `
 <div class="box feyn"><b>🧒 Plain words:</b> A fault tree is a family tree of a disaster drawn upside-down. <b>Gates</b> say how parents combine (AND = all needed, OR = any one enough). <b>Events</b> are boxes, circles and diamonds: a circle is a root cause we have a number for, a diamond is a cause we stopped digging into. The <b>triangle</b> is a "continue on another sheet" button.</div>
 <div class="box formula">AND: P = ΠP<sub>i</sub> (≙ parallel RBD) &nbsp;|&nbsp; OR: P = 1 − Π(1 − P<sub>i</sub>) (≙ series RBD) &nbsp;|&nbsp; Inhibit: P = P(input)·P(condition) &nbsp;|&nbsp; Priority-AND: P = P(both) × P(correct order)</div>
 <div class="symgrid" id="sym-grid"></div>
 <h3>Try the three special symbols</h3>
 <div class="grid2">
  <div class="box"><b>Priority AND</b> — fires only if the inputs occur in the stated order (A before B).
   <div class="row"><label><input type="radio" name="pa-seq" value="ab" data-live checked> A first, then B</label><label><input type="radio" name="pa-seq" value="ba" data-live> B first, then A</label><label><input type="radio" name="pa-seq" value="a" data-live> only A occurs</label></div>
   <div class="outs">${outBox('pa-and', 'ordinary AND')}${outBox('pa-pand', 'priority AND (A→B)')}</div>
   <span class="src" id="pa-note"></span></div>
  <div class="box"><b>Inhibit gate</b> — the input causes the output only if the side condition (ellipse) holds.
   ${ctl('ih-pi', 'P(input event)', 0, 1, 0.01, 0.2, '')}${ctl('ih-pc', 'P(condition holds)', 0, 1, 0.01, 0.3, '')}
   <div class="outs">${outBox('ih-out', 'P(output) = P(i)·P(c)')}${outBox('ih-and', 'same as AND of the two')}</div></div>
 </div>
 <div class="box"><b>Transfer triangle</b> — the sub-tree "T1" is drawn on sheet 2 but counted on sheet 1.
  <div class="row"><label><input type="radio" name="tf-sheet" value="1" data-live checked> sheet 1 (top)</label><label><input type="radio" name="tf-sheet" value="2" data-live> sheet 2 (sub-tree T1)</label></div>
  <div class="grid2"><div class="svgbox" id="tf-svg"></div><div>${ctl('tf-px', 'P(X) basic event', 0, 1, 0.001, 0.02, '')}${ctl('tf-pa', 'P(A)', 0, 1, 0.001, 0.1, '')}${ctl('tf-pb', 'P(B)', 0, 1, 0.001, 0.2, '')}
  <div class="outs">${outBox('tf-t1', 'P(T1) = P(A)·P(B)')}${outBox('tf-top', 'P(top) = 1 − (1−P(X))(1−P(T1))')}</div></div></div></div>
 <h3>How to construct a fault tree (7 steps)</h3>
 <ol><li>Define the top event, system boundary and initial conditions precisely ("no cooling water to reactor", not "failure").</li><li>Ask "what is the <b>immediate</b>, necessary and sufficient cause?" — write it below the top event (a rectangle).</li><li>Connect causes with the right gate: all needed → AND; any one → OR; k of n → voting; condition → inhibit.</li><li>Keep going down one level at a time; do not skip levels, and do not gate to a gate.</li><li>Stop at basic events (circles), undeveloped events (diamonds) or when you reach external events (house).</li><li>Use transfer triangles to continue on another sheet.</li><li>Evaluate: minimal cut sets, then P(top) from basic-event data (OR adds, AND multiplies).</li></ol>
 <span class="src">${CH.lec} AND, OR, voting OR, XOR, priority AND, basic, undeveloped, intermediate, transfer, conditional symbols (L10–L12; "FTA symbols" slide and the FTD vs RBD slide). ${CH.tb} House and Inhibit symbols and the 7-step construction wording (Kapur &amp; Lamberson; O'Connor). Numbers in the demos are my own.</span>
`, CH.lec + ' ' + CH.tb)}

${card('m6-rcm', '6.7', 'Reliability Centered Maintenance — walk a component through the 7 RCM questions', `
 <div class="box feyn"><b>🧒 Plain words:</b> RCM is seven questions asked in order about every important machine, so you only pay for maintenance that matters: (1) what is it <i>for</i>? (2) how can it stop doing that? (3) what makes it stop? (4) what happens then? (5) does it matter — safety, production, money, or is the failure hidden? (6) is there a task that prevents it or warns us early? (7) if not, what is the default — test it, redesign it, or let it run to failure?</div>
 <div class="box formula">SAE JA1011 questions: 1 functions &amp; performance standards · 2 functional failures · 3 failure modes · 4 failure effects · 5 failure consequences · 6 proactive tasks &amp; intervals · 7 default actions<br>Task test (applicable AND effective). Consequence classes: hidden · safety/environment · operational · non-operational.</div>
 <div class="box tip"><b>Exam tip:</b> list the seven questions in order with one phrase each, then give a one-line worked example (pump: function → no flow → bearing seizes → loss of cooling → operational → vibration monitoring → …). Do not confuse these with the lecture's 7-step <i>implementation</i> (select system → boundary → description → functions &amp; functional failures → FMEA → logic tree → task selection).</div>
 <div class="row"><label>Component <select id="rc-comp" data-live style="width:auto"><option value="pump">cooling-water pump (operational)</option><option value="relief">pressure relief valve (hidden / safety)</option><option value="light">office corridor light (non-operational)</option><option value="belt">conveyor belt (wear-out, operational)</option></select></label><span class="pill" id="rc-step-pill"></span></div>
 <div class="rcm-steps" id="rc-bar"></div>
 <div class="box" id="rc-body"></div>
 <div class="row"><button class="btn" id="rc-prev">◀ previous question</button><button class="btn fill" id="rc-next">next question ▶</button><button class="btn sm" id="rc-reset">restart</button></div>
 <h3>RCM worksheet row built from your answers</h3><div class="tblwrap"><table class="cover" id="rc-sum"></table></div>
 <div class="box note" id="rc-rec"></div>
 <span class="src">${CH.lec} The seven RCM questions, consequence classes and the applicable-and-effective test: L10–L12 (SAE JA1011 / JA1012). ${CH.tb} Task names (on-condition, scheduled restoration, discard, failure-finding) from Moubray / JA1012. The four example components and their answers are ${CH.demo}.</span>
`, CH.lec + ' ' + CH.tb + ' ' + CH.demo)}

${card('m6-rcmv', '6.8', 'RCM vs FMEA / FMECA — bottom-up component thinking vs top-down function thinking', `
 <div class="box feyn"><b>🧒 Plain words:</b> Take a car. <b>FMEA</b> looks at each part and asks "how could you break?" (brake pad wears, hose splits) — start at the parts, work up. <b>RCM</b> looks at what the car is for ("stop within 40 m") and asks "how could stopping fail, does it matter, and what is the cheapest way to stay safe?" — start at the function, work down. RCM <i>uses</i> an FMEA as its step 5, then adds consequences and a task decision.</div>
 <div class="box formula">FMEA/FMECA: component → failure mode → effect → rating (S, O, D / CRN / C<sub>m</sub>) → action<br>RCM: function → functional failure → failure mode → effect → <b>consequence</b> → <b>task / default action</b> &nbsp; (RCM ⊃ FMEA + consequence logic + task selection)</div>
 <div class="box tip"><b>Exam tip:</b> a table with 5–6 rows (direction, focus, purpose, quantification, output, standard) earns the marks; finish with one line: "FMEA/FMECA is an input to RCM; RCM is the maintenance <i>strategy</i> process."</div>
 <div class="tblwrap"><table class="cover" id="rv-tbl"></table></div>
 <h3>Self-test: which method?</h3><div id="rv-quiz"></div><div class="row"><span class="pill" id="rv-score"></span><button class="btn sm" id="rv-reset">reset</button></div>
 <span class="src">${CH.lec} "bottom-up" vs "top-down", focus and purpose rows: L11–L12 FMEA/FMECA vs RCM slide; relationship (FMEA = RCM step 5) from the RCM implementation steps. ${CH.tb} Standards: MIL-STD-1629A / IEC 60812 vs SAE JA1011/JA1012; quantification row.</span>
`, CH.lec + ' ' + CH.tb)}

${card('m6-cbm', '6.9', 'Condition-Based Monitoring — the P–F curve and how often to inspect', `
 <div class="box feyn"><b>🧒 Plain words:</b> Most machines do not fail without warning — they get sick first. A bearing wears, then gets noisy, then hot, then seizes. The moment the sickness can <i>first be measured</i> is <b>P</b> (potential failure); the moment it stops working is <b>F</b> (functional failure). The time between is the <b>P–F interval</b> — your warning time. Condition-based monitoring means measuring the right thing often enough to catch the machine between P and F, then fixing it on <i>your</i> schedule.</div>
 <div class="box formula">P–F interval = t<sub>F</sub> − t<sub>P</sub> &nbsp;|&nbsp; inspect at interval Δ ≤ ½ (P–F) so that at least one check (usually two) falls inside the window &nbsp;|&nbsp; P(detect) ≈ min(1, (P–F)/Δ) &nbsp;|&nbsp; warning left = t<sub>F</sub> − t<sub>detect</sub><br>Chain: asset → failure mode → degradation mechanism → technology → measurement → frequency → limits → diagnosis → action</div>
 <div class="box tip"><b>Exam tip:</b> draw condition (vertical) against time with points P and F and the P–F interval; add "inspection interval ≤ ½ P–F". Name the technique for the failure mechanism (vibration for bearings, oil analysis for wear debris, thermography for loose electrical joints, ultrasound for leaks) and say CBM suits wear-out (β &gt; 1), not random failures.</div>
 <div class="row"><button class="btn lec" id="cb-bearing">bearing: P–F 6 weeks, inspect every 3</button><button class="btn" id="cb-late">inspect too rarely: every 10 weeks</button><button class="btn" id="cb-thermo">thermography: P–F 3 weeks, every 1</button><button class="btn" id="cb-oil">oil analysis: P–F 10 weeks, every 4</button></div>
 <div class="grid2"><div>${ctl('cb-pf', 'P–F interval', 1, 30, 0.5, 6, 'weeks')}${ctl('cb-dt', 'inspection interval Δ', 0.5, 30, 0.5, 3, 'weeks')}${ctl('cb-ph', 'first inspection at', 0, 30, 0.5, 1, 'weeks')}${ctl('cb-k', 'wear speed (curve shape)', 1, 6, 0.5, 3, '')}</div>
 <div><div class="outs">${outBox('cb-tp', 't<sub>P</sub> (fault first measurable)')}${outBox('cb-n', 'inspections inside P–F')}${outBox('cb-pd', 'P(detect) ≈ min(1, PF/Δ)')}${outBox('cb-res', 'result')}${outBox('cb-warn', 'warning left after detection')}${outBox('cb-rule', 'rule Δ ≤ ½ P–F')}</div></div></div>
 <canvas class="plot" id="cb-plot" style="height:250px"></canvas>
 <div class="tblwrap"><table class="cover"><tr><th>Technique</th><th>What it measures</th><th>Typical faults found</th><th>Rough lead time (P–F)</th></tr>
 <tr><td>Vibration analysis</td><td>acceleration / velocity spectrum, envelope</td><td>imbalance, misalignment, looseness, bearing and gear defects</td><td>weeks – months</td></tr>
 <tr><td>Oil analysis</td><td>wear debris, viscosity, water, contamination</td><td>abnormal wear, contamination, lubricant failure</td><td>weeks – months</td></tr>
 <tr><td>Thermography (infrared)</td><td>surface temperature pattern</td><td>loose electrical joints, overload, hot bearings</td><td>days – weeks</td></tr>
 <tr><td>Acoustic / ultrasonic</td><td>high-frequency sound</td><td>leaks, poor lubrication, early bearing damage, arcing</td><td>weeks</td></tr>
 <tr><td>Motor current, NDT, process data</td><td>current spectrum, cracks, flow / pressure trends</td><td>rotor bars, cracks, fouling, performance loss</td><td>varies</td></tr></table></div>
 <span class="src">${CH.lec} CBM chain, closed loop (detection → diagnosis → prognosis → work order → learning) and "P–F analysis" in the RE framework (L6, L12). ${CH.tb} P–F interval definition, the ½ P–F rule and the lead-time ranges (Moubray, RCM II). Curve and numbers are ${CH.demo}.</span>
`, CH.lec + ' ' + CH.tb + ' ' + CH.demo)}

`;

/* ============================================================ 6.2 FMECA */
(function () {
  const card = $('#m6-fmeca');
  const LEC = [
    ['1.1.1.1', 'Flash Drum V04', 'Rupture of drum (weld failure, corrosion, over-pressurization)', 10, 3], ['1.1.1.2', 'Flash Drum V04', 'Gasket leakage due to MOC, installation, thermal shock, aging, mal-operation', 8, 4], ['1.1.1.3', 'Flash Drum V04', 'Nozzle failure', 9, 3],
    ['1.1.1.4', 'Flash drum PSV 127A and B', 'Valve fails to close (after pop up) due to jamming', 3, 2], ['1.1.1.5', 'Flash drum PSV 127A and B', 'Bellow failure', 3, 7]].map(r => ({ fn: r[0], item: r[1], mode: r[2], S: r[3], O: r[4], D: 1, S2: r[3], O2: r[4], D2: 1 }));
  const DEMO = [['Pump', 'Mechanical seal leaks', 6, 7, 4], ['Motor', 'Bearing seizure', 8, 4, 5], ['Coupling', 'Shaft misalignment', 5, 6, 3], ['Controller', 'Sensor drift gives false reading', 7, 5, 8], ['Valve', 'Fails to open on demand', 9, 2, 6]].map(r => ({ fn: 'Circulate coolant', item: r[0], mode: r[1], S: r[2], O: r[3], D: r[4], S2: r[2], O2: r[3], D2: r[4] }));
  let rows;
  try { rows = JSON.parse(localStorage.getItem('re-fmeca') || 'null'); } catch (e) { rows = null; }
  if (!Array.isArray(rows) || !rows.length) rows = LEC.map(r => ({ ...r }));
  const metric = () => $('input[name=fm-metric]:checked').value;
  const val = r => metric() === 'crn' ? r.S * r.O : r.S * r.O * r.D;
  const val2 = r => metric() === 'crn' ? r.S2 * r.O2 : r.S2 * r.O2 * r.D2;
  const cls = v => v >= V('fm-hi') ? 'risk-h' : v >= V('fm-md') ? 'risk-m' : 'risk-l';
  const save = () => { try { localStorage.setItem('re-fmeca', JSON.stringify(rows)); } catch (e) { } };
  const num = (r, k, mx) => `<input type="number" data-f="${k}" min="1" max="${mx || 10}" step="1" value="${r[k]}" style="width:56px">`;
  function table() {
    const sorted = $('#fm-sort').checked; if (sorted) rows.sort((a, b) => val(b) - val(a));
    let h = '<tr><th>#</th><th>Function / func. failure</th><th>Item</th><th>Failure mode (with cause)</th><th>S</th><th>O</th><th>D</th><th>CRN S×O</th><th>RPN S×O×D</th><th>S′</th><th>O′</th><th>D′</th><th>new ' + (metric() === 'crn' ? 'CRN' : 'RPN') + '</th><th>Δ</th><th></th></tr>';
    rows.forEach((r, i) => { h += `<tr data-i="${i}"><td>${i + 1}</td><td><input type="text" data-f="fn" value="${esc(r.fn)}" style="min-width:90px"></td><td><input type="text" data-f="item" value="${esc(r.item)}" style="min-width:90px"></td><td><input type="text" data-f="mode" value="${esc(r.mode)}" style="min-width:180px"></td><td>${num(r, 'S')}</td><td>${num(r, 'O')}</td><td>${num(r, 'D')}</td><td class="mono" data-c="crn"></td><td class="mono" data-c="rpn"></td><td>${num(r, 'S2')}</td><td>${num(r, 'O2')}</td><td>${num(r, 'D2')}</td><td class="mono" data-c="new"></td><td class="mono" data-c="d"></td><td><button class="btn sm danger" data-del="${i}">✕</button></td></tr>`; });
    $('#fm-tbl').innerHTML = h; calc();
  }
  function calc() {
    $$('#fm-tbl tr[data-i]').forEach(tr => {
      const r = rows[+tr.dataset.i], v = val(r), v2 = val2(r), crn = r.S * r.O, rpn = r.S * r.O * r.D;
      const set = (k, t, c) => { const td = tr.querySelector(`[data-c=${k}]`); td.textContent = t; td.className = 'mono ' + (c || ''); };
      set('crn', crn, metric() === 'crn' ? cls(crn) : ''); set('rpn', rpn, metric() === 'rpn' ? cls(rpn) : ''); set('new', v2, cls(v2)); set('d', v ? (v2 === v ? '0%' : (v2 < v ? '−' : '+') + Math.abs(Math.round(100 * (v - v2) / v)) + '%') : '—', v2 < v ? 'ok' : v2 > v ? 'bad' : '');
    });
    matrix(); pareto(); save();
    $('#fm-note').innerHTML = metric() === 'crn' ? 'Ranking by CRN = S × O as in the L11 example. D is ignored (set to 1 in the lecture preset because the slide has no D column).' : 'Ranking by RPN = S × O × D. A high RPN says "look here first", not "choose this maintenance strategy".';
  }
  function matrix() {
    const c = 34, W = 11 * c + 20, H = 11 * c + 30; let s = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="system-ui" font-size="10">`;
    for (let sv = 10; sv >= 1; sv--) for (let o = 1; o <= 10; o++) { const v = sv * o; s += `<rect x="${30 + (o - 1) * c}" y="${6 + (10 - sv) * c}" width="${c}" height="${c}" fill="${v >= (metric() === 'crn' ? V('fm-hi') : V('fm-hi') / 10) ? '#fbd0d0' : v >= (metric() === 'crn' ? V('fm-md') : V('fm-md') / 10) ? '#ffe9bd' : '#d6f1e2'}" stroke="#fff"/>`; }
    for (let i = 1; i <= 10; i++) s += `<text x="${30 + (i - 1) * c + c / 2}" y="${6 + 10 * c + 14}" text-anchor="middle" fill="#475569">${i}</text><text x="22" y="${6 + (10 - i) * c + c / 2 + 4}" text-anchor="end" fill="#475569">${i}</text>`;
    s += `<text x="${30 + 5 * c}" y="${H - 2}" text-anchor="middle" fill="#334155" font-size="11">Occurrence O →</text><text transform="translate(8 ${6 + 5 * c}) rotate(-90)" text-anchor="middle" fill="#334155" font-size="11">Severity S →</text>`;
    const cnt = {}; rows.forEach((r, i) => { const k = r.S + ',' + r.O; const n = cnt[k] = (cnt[k] || 0) + 1; const x = 30 + (clamp(r.O, 1, 10) - 1) * c + c / 2 + ((n - 1) % 2) * 12 - 6 * Math.min(1, n - 1), y = 6 + (10 - clamp(r.S, 1, 10)) * c + c / 2 + Math.floor((n - 1) / 2) * 12; s += `<circle cx="${x}" cy="${y}" r="9" fill="#2457d6" stroke="#fff"/><text x="${x}" y="${y + 3.5}" text-anchor="middle" fill="#fff" font-weight="700">${i + 1}</text>`; });
    $('#fm-mat').innerHTML = s + '</svg>';
  }
  function pareto() {
    const arr = rows.map((r, i) => [i + 1, r.mode, val(r)]).sort((a, b) => b[2] - a[2]), mx = Math.max(1, ...arr.map(a => a[2]));
    $('#fm-par').innerHTML = arr.map(a => `<div class="barrow" style="grid-template-columns:150px 1fr 40px"><span title="${esc(a[1])}">#${a[0]} ${esc(a[1].slice(0, 20))}${a[1].length > 20 ? '…' : ''}</span><div class="bar"><i style="width:${100 * a[2] / mx}%;background:${a[2] >= V('fm-hi') ? '#d23b3b' : a[2] >= V('fm-md') ? '#f59e0b' : '#12915b'}"></i></div><span>${a[2]}</span></div>`).join('');
  }
  card.addEventListener('input', e => {
    const tr = e.target.closest('tr[data-i]'); if (!tr || !e.target.dataset.f) return; const r = rows[+tr.dataset.i], f = e.target.dataset.f;
    if (['fn', 'item', 'mode'].includes(f)) r[f] = e.target.value; else r[f] = clamp(parseInt(e.target.value) || 1, 1, 10);
    calc();
  });
  card.addEventListener('change', e => { if (e.target.dataset.f && $('#fm-sort').checked) { const tr = e.target.closest('tr'); const id = rows[+tr.dataset.i]; table(); } });
  card.addEventListener('click', e => { if (e.target.dataset.del !== undefined) { rows.splice(+e.target.dataset.del, 1); table(); } });
  wire(card, e => { if (e.target.name === 'fm-metric') { if (metric() === 'crn') { setV('fm-hi', 30); setV('fm-md', 15); } else { setV('fm-hi', 200); setV('fm-md', 100); } } if (e.target.id === 'fm-sort' || (e.target.name === 'fm-metric')) table(); else calc(); });
  $('#fm-add').onclick = () => { rows.push({ fn: '', item: 'New item', mode: 'New failure mode', S: 5, O: 5, D: 5, S2: 5, O2: 5, D2: 5 }); table(); };
  $('#fm-lec').onclick = () => { rows = LEC.map(r => ({ ...r })); $('input[name=fm-metric][value=crn]').checked = true; setV('fm-hi', 30); setV('fm-md', 15); table(); };
  $('#fm-demo').onclick = () => { rows = DEMO.map(r => ({ ...r })); $('input[name=fm-metric][value=rpn]').checked = true; setV('fm-hi', 200); setV('fm-md', 100); table(); };
  $('#fm-clear').onclick = () => { rows = []; table(); };
  $('#fm-csv').onclick = () => { const q = s => '"' + String(s).replace(/"/g, '""') + '"'; const csv = ['No,Function,Item,Failure mode,S,O,D,CRN,RPN,S2,O2,D2'].concat(rows.map((r, i) => [i + 1, q(r.fn), q(r.item), q(r.mode), r.S, r.O, r.D, r.S * r.O, r.S * r.O * r.D, r.S2, r.O2, r.D2].join(','))).join('\n'); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'fmeca.csv'; a.click(); };
  table();
  /* criticality calculator */
  const cm = [{ item: 'Pump', mode: 'External leakage', a: 0.4, b: 0.5, l: 20, t: 1000 }, { item: 'Pump', mode: 'Fails to deliver', a: 0.6, b: 1, l: 20, t: 1000 }, { item: 'Relief valve', mode: 'Fails to open', a: 0.3, b: 1, l: 5, t: 1000 }];
  function cmRender() {
    let h = '<tr><th>Item</th><th>Failure mode</th><th>α (mode ratio)</th><th>β (loss prob.)</th><th>λ<sub>p</sub> (per 10⁶ h)</th><th>t (h)</th><th>C<sub>m</sub> = β·α·λ<sub>p</sub>·t</th></tr>';
    cm.forEach((r, i) => h += `<tr data-i="${i}"><td><input type="text" data-f="item" value="${esc(r.item)}"></td><td><input type="text" data-f="mode" value="${esc(r.mode)}"></td><td><input type="number" data-f="a" step="0.05" min="0" max="1" value="${r.a}"></td><td><input type="number" data-f="b" step="0.05" min="0" max="1" value="${r.b}"></td><td><input type="number" data-f="l" step="any" value="${r.l}"></td><td><input type="number" data-f="t" step="any" value="${r.t}"></td><td class="mono" data-c="m"></td></tr>`);
    $('#cm-tbl').innerHTML = h + '<tr><td colspan="6"><b>C<sub>r</sub> per item (sum of its C<sub>m</sub>)</b></td><td id="cm-cr" class="mono"></td></tr>'; cmCalc();
  }
  function cmCalc() { const cr = {}; $$('#cm-tbl tr[data-i]').forEach(tr => { const r = cm[+tr.dataset.i], v = r.b * r.a * r.l * 1e-6 * r.t; tr.querySelector('[data-c=m]').textContent = sci(v, 3); cr[r.item] = (cr[r.item] || 0) + v; }); $('#cm-cr').innerHTML = Object.keys(cr).map(k => esc(k) + ': ' + sci(cr[k], 3)).join('<br>'); }
  $('#cm-tbl').addEventListener('input', e => { const tr = e.target.closest('tr[data-i]'); if (!tr) return; const r = cm[+tr.dataset.i], f = e.target.dataset.f; r[f] = (f === 'item' || f === 'mode') ? e.target.value : parseFloat(e.target.value) || 0; cmCalc(); });
  cmRender();
})();

/* ============================================================ 6.3 Fault tree */
(function () {
  const card = $('#m6-fta');
  const E = (name, p, kind) => ({ t: 'ev', kind: kind || 'basic', name, p });
  const Gt = (type, name, ch, k) => ({ t: 'gate', type, name, ch, k: k || 2 });
  let tree = Gt('OR', 'Top event', [E('Cause A', 0.01), Gt('AND', 'Both fail', [E('Unit B', 0.05), E('Unit C', 0.1)])]);
  const PRE = {
    light: ['L11 slide "No light in the room" (structure from the slide; probabilities are demo)', () => Gt('OR', 'No light in the room', [Gt('AND', 'All bulbs burnt', [E('Lamp 1 burned', 0.05), E('Lamp 2 burned', 0.05)]), E('Switch failed', 0.01), Gt('OR', 'No voltage at input', [E('No V in network', 0.02), E('Fuse burned', 0.01)])])],
    fire: ['L11 slide "Failure of fire protection system" (structure from the slide; probabilities demo)', () => Gt('OR', 'Failure of fire protection system', [Gt('AND', 'Fire detection system fails', [E('Smoke fail', 0.05), E('Heat fail', 0.08)]), Gt('OR', 'Fire suppression system fails', [E('Pump fail', 0.02), E('Nozzle fail', 0.03)])])],
    car: ['L11 slide "Car will not start" (structure from the slide; probabilities demo)', () => Gt('OR', 'Car will not start', [Gt('AND', 'Controls status', [E('In park', 0.3), E('Foot on brake', 0.2)]), Gt('OR', 'Electrical fault', [E('Starter faulty', 0.02), E('Broken wire', 0.01)])])],
    exam: ['L11 slide "Fail" (structure from the slide; probabilities demo)', () => Gt('OR', 'Fail', [E('Proj = F', 0.1), Gt('AND', 'Both exams', [E('Exam1 = F', 0.2), E('Exam2 = F', 0.2)])])],
    combo: ['L11 slide "Configuration in combination": OR(A,B,C,D, 2/3(E,F,G), AND(OR(H–L), OR(M,N,O,AND(P,Q)))) (structure from the slide; probabilities demo)', () => Gt('OR', 'System fail', ['A', 'B', 'C', 'D'].map(n => E(n, 0.01)).concat([Gt('VOTE', '2/3', ['E', 'F', 'G'].map(n => E(n, 0.05)), 2), Gt('AND', 'AND', [Gt('OR', 'H–L', ['H', 'I', 'J', 'K', 'L'].map(n => E(n, 0.03))), Gt('OR', 'M–Q', [E('M', 0.04), E('N', 0.04), E('O', 0.04), Gt('AND', 'P and Q', [E('P', 0.2), E('Q', 0.2)])])])]))],
    miss: ['MSE Q3.a as a fault tree: top event "no missile hits" = AND(missile 1 fails, missile 2 fails), p = 1−0.92 = 0.08 each → 0.0064, R = 0.9936', () => Gt('AND', 'No missile hits', [E('Missile 1 fails', 0.08), E('Missile 2 fails', 0.08)])],
    rocket: ['L6 rocket (3 of 4 engines, R = 0.98) as the failure-space twin: voting OR, 2 of 4 failures (p = 0.02) → P(top) = 0.00234, R = 0.9977', () => Gt('VOTE', 'Rocket misses orbit', ['E1', 'E2', 'E3', 'E4'].map(n => E(n + ' fails', 0.02)), 2)]
  };
  function ev(n) {
    if (n.t === 'ev') return P(n);
    const ps = n.ch.map(ev);
    if (!ps.length) return 0;
    if (n.type === 'AND') return ps.reduce((a, b) => a * b, 1);
    if (n.type === 'OR') return 1 - ps.reduce((a, b) => a * (1 - b), 1);
    if (n.type === 'VOTE') return atLeastK(ps, clamp(Math.round(n.k), 1, ps.length));
    return exactlyK(ps, 1);
  }
  let ov = null; const P = n => ov && ov.n === n ? ov.v : n.p;
  const leaves = n => n.t === 'ev' ? [n] : n.ch.flatMap(leaves);
  const gates = n => n.t === 'ev' ? 0 : 1 + n.ch.reduce((a, c) => a + gates(c), 0);
  // minimal cut sets (MOCUS)
  function cuts(n) {
    if (n.t === 'ev') return [[n]];
    const cs = n.ch.map(cuts);
    if (!cs.length) return [];
    const minim = a => { const u = []; a.forEach(s => { s = Array.from(new Set(s)); if (!u.some(x => x.length === s.length && x.every(y => s.includes(y)))) u.push(s); }); return u.filter(s => !u.some(o => o !== s && o.length < s.length && o.every(y => s.includes(y)))); };
    if (n.type === 'OR' || n.type === 'XOR') return minim([].concat(...cs));
    const prod = list => list.reduce((acc, c) => { const out = []; for (const a of acc) for (const b of c) { out.push(a.concat(b)); if (out.length > 5000) return minim(out); } return minim(out); }, [[]]);
    if (n.type === 'AND') return prod(cs);
    const k = clamp(Math.round(n.k), 1, cs.length), res = []; // VOTE
    (function comb(start, pick) { if (pick.length === k) { res.push(...prod(pick.map(i => cs[i]))); return; } for (let i = start; i < cs.length; i++) comb(i + 1, pick.concat(i)); })(0, []);
    return minim(res);
  }
  // ---- conversion to RBD
  function toRBD(n) {
    if (n.t === 'ev') return { t: 'blk', name: (n.name || '').slice(0, 11), R: 1 - n.p };
    const ch = n.ch.map(toRBD); if (ch.some(c => c === null)) return null;
    if (n.type === 'AND') return { t: 'grp', type: 'parallel', k: 1, ch };
    if (n.type === 'OR') return { t: 'grp', type: 'series', k: 1, ch };
    if (n.type === 'VOTE') return { t: 'grp', type: 'kofn', k: ch.length - clamp(Math.round(n.k), 1, ch.length) + 1, ch };
    return null;
  }
  // ---- SVG
  const CW = 132, LH = 160;
  const wid = n => n.t === 'ev' ? CW : Math.max(CW, n.ch.reduce((a, c) => a + wid(c), 0) || CW);
  const depthOf = n => n.t === 'ev' ? 0 : 1 + Math.max(0, ...n.ch.map(depthOf));
  const clip = (s, k) => { s = s || ''; return s.length > k ? s.slice(0, k - 1) + '…' : s; };
  function wrap(s, k) { s = (s || '').trim(); if (s.length <= k) return [s]; let cut = s.lastIndexOf(' ', k); if (cut < 6) cut = k; const a = s.slice(0, cut).trim(), b = s.slice(cut).trim(); return [a, clip(b, k)]; }
  function draw(n, left, d, out) {
    const w = wid(n), y0 = d * LH;
    if (n.t === 'ev') {
      const cx = left + w / 2, cy = y0 + 28;
      out.push(n.kind === 'undev' ? `<path d="M${cx} ${cy - 20} L${cx + 22} ${cy} L${cx} ${cy + 20} L${cx - 22} ${cy} Z" fill="#fff7e6" stroke="#d97706" stroke-width="2"/>` : `<circle cx="${cx}" cy="${cy}" r="19" fill="#eef4ff" stroke="#2457d6" stroke-width="2"/>`);
      out.push(`<text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="10" font-weight="700" fill="#14224a">${pf(n.p)}</text><text text-anchor="middle" font-size="10.5" fill="#334155"><title>${esc(n.name)}</title>${wrap(n.name, 19).map((t, i) => `<tspan x="${cx}" y="${cy + 36 + i * 12}">${esc(t)}</tspan>`).join('')}</text>`);
      return { cx, top: cy - 19 };
    }
    const kids = []; let l = left; n.ch.forEach(c => { kids.push(draw(c, l, d + 1, out)); l += wid(c); });
    const cx = kids.length ? (kids[0].cx + kids[kids.length - 1].cx) / 2 : left + w / 2, gy = y0 + 86, p = ev(n), nm = wrap(n.name, 20);
    out.push(`<rect x="${cx - 62}" y="${y0 + 4}" width="124" height="54" rx="5" fill="#fff" stroke="#334155" stroke-width="1.6"/><text text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f172a"><title>${esc(n.name)}</title>${nm.map((t, i) => `<tspan x="${cx}" y="${y0 + 19 + i * 12}">${esc(t)}</tspan>`).join('')}</text><text x="${cx}" y="${y0 + 52}" text-anchor="middle" font-size="10.5" fill="#b91c1c">P = ${pf(p)}</text>`);
    out.push(`<line x1="${cx}" y1="${y0 + 58}" x2="${cx}" y2="${gy - 18}" stroke="#334155" stroke-width="1.6"/>`);
    const sh = n.type === 'AND' ? 'M-17 16 V0 A17 17 0 0 1 17 0 V16 Z' : 'M-17 16 Q0 6 17 16 Q15 -6 0 -18 Q-15 -6 -17 16 Z';
    out.push(`<g transform="translate(${cx} ${gy})"><path d="${sh}" fill="#eef2ff" stroke="#334155" stroke-width="1.8"/>${n.type === 'XOR' ? '<path d="M-17 21 Q0 11 17 21" fill="none" stroke="#334155" stroke-width="1.8"/>' : ''}<text y="${n.type === 'AND' ? 11 : 10}" text-anchor="middle" font-size="9" font-weight="700" fill="#14224a">${n.type === 'VOTE' ? Math.round(n.k) + '/' + n.ch.length : n.type === 'XOR' ? 'XOR' : n.type}</text></g>`);
    const my = y0 + 130;
    if (kids.length) { out.push(`<line x1="${cx}" y1="${gy + 16}" x2="${cx}" y2="${my}" stroke="#334155" stroke-width="1.6"/><line x1="${kids[0].cx}" y1="${my}" x2="${kids[kids.length - 1].cx}" y2="${my}" stroke="#334155" stroke-width="1.6"/>`); kids.forEach(k => out.push(`<line x1="${k.cx}" y1="${my}" x2="${k.cx}" y2="${k.top}" stroke="#334155" stroke-width="1.6"/>`)); }
    return { cx, top: y0 + 4 };
  }
  function svg() { const out = [], w = wid(tree), h = depthOf(tree) * LH + 92; draw(tree, 0, 0, out); return `<svg width="${w + 10}" height="${h}" viewBox="-5 0 ${w + 10} ${h}" font-family="system-ui,sans-serif">${out.join('')}</svg>`; }
  // ---- editor
  function ed(n, path) {
    const p = path.join('.');
    if (n.t === 'ev') return `<li><div class="node" data-p="${p}"><select data-f="kind" title="symbol"><option value="basic"${n.kind === 'basic' ? ' selected' : ''}>○ basic</option><option value="undev"${n.kind === 'undev' ? ' selected' : ''}>◇ undeveloped</option></select><input type="text" data-f="name" value="${esc(n.name)}"><span>p =</span><input type="number" data-f="p" min="0" max="1" step="0.001" value="${n.p}">${path.length ? '<button class="btn sm danger" data-act="del">✕</button>' : ''}</div></li>`;
    const sel = ['AND', 'OR', 'VOTE', 'XOR'].map(t => `<option value="${t}"${n.type === t ? ' selected' : ''}>${t === 'VOTE' ? 'voting OR (k of n)' : t}</option>`).join('');
    return `<li><div class="node gate" data-p="${p}"><b>Gate</b><select data-f="type">${sel}</select>${n.type === 'VOTE' ? `<span>k =</span><input type="number" data-f="k" min="1" max="${n.ch.length || 1}" value="${n.k}">` : ''}<input type="text" data-f="name" value="${esc(n.name)}"><span class="pill" data-pp>P=…</span><button class="btn sm" data-act="adde">+ event</button><button class="btn sm" data-act="addg">+ gate</button>${path.length ? '<button class="btn sm danger" data-act="del">✕</button>' : ''}</div><ul>${n.ch.map((c, i) => ed(c, path.concat(i))).join('')}</ul></li>`;
  }
  function render() { $('#ft-ed').innerHTML = `<ul>${ed(tree, [])}</ul>`; update(); }
  function update() {
    ov = null; const top = ev(tree), ls = leaves(tree), cs = cuts(tree).sort((a, b) => a.length - b.length);
    const spf = cs.filter(c => c.length === 1);
    setBox('ft-top', fR2(top), 'P(top event)', 'bad'); setBox('ft-R', fR(1 - top), 'R<sub>s</sub> = 1 − P(top)', 'hi'); setBox('ft-n', ls.length + ' / ' + gates(tree), 'basic events / gates'); setBox('ft-spf', spf.length, spf.length ? spf.map(c => c[0].name).join(', ') : 'none (every cut set needs ≥ 2 events)', spf.length ? 'bad' : 'hi');
    $('#ft-cs').innerHTML = cs.length ? cs.slice(0, 60).map(c => `<span class="pill" style="margin:2px;display:inline-block;${c.length === 1 ? 'background:#fde1e1;color:#b91c1c' : ''}">{ ${c.map(e => esc(e.name)).join(' · ')} }</span>`).join('') + (cs.length > 60 ? ` … ${cs.length} in total` : '') + `<div style="margin-top:6px">order-1 sets (red) are single points of failure; ${cs.length} minimal cut set${cs.length === 1 ? '' : 's'}.</div>` : 'none';
    $$('#ft-ed [data-pp]').forEach(sp => { const nd = nodeAt(tree, parsePath(sp.closest('[data-p]').dataset.p)); sp.textContent = 'P=' + pf(ev(nd)); });
    $('#ft-svg').innerHTML = svg();
    const rb = toRBD(tree);
    if (rb) { $('#ft-rbd').innerHTML = rbdSVG(rb); const R = rbdEval(rb, 1); $('#ft-rbdnote').innerHTML = `RBD reliability = <b>${fR(R)}</b> and 1 − P(top) = <b>${fR(1 - top)}</b> — ${Math.abs(R - (1 - top)) < 1e-9 ? '<span class="ok">identical</span>' : '<span class="bad">different</span>'}. Rule used: AND → parallel, OR → series, voting (k of n fail) → (n−k+1)-out-of-n success. Block R = 1 − p.`; }
    else { $('#ft-rbd').innerHTML = '<p style="padding:10px">An XOR gate is not coherent, so it has no ordinary RBD equivalent.</p>'; $('#ft-rbdnote').textContent = ''; }
    // Birnbaum
    const rows = ls.map(l => { ov = { n: l, v: 1 }; const a = ev(tree); ov = { n: l, v: 0 }; const b = ev(tree); ov = null; return [l, a - b]; }).sort((x, y) => y[1] - x[1]), mx = Math.max(1e-12, rows[0] ? rows[0][1] : 0);
    $('#ft-imp').innerHTML = '<tr><th>Basic event</th><th>p</th><th>Birnbaum I<sub>B</sub></th><th></th></tr>' + rows.slice(0, 12).map(r => `<tr><td>${esc(r[0].name)}</td><td>${pf(r[0].p)}</td><td class="mono">${r[1].toFixed(4)}</td><td style="width:40%"><div class="bar"><i style="width:${100 * r[1] / mx}%"></i></div></td></tr>`).join('');
  }
  const fR2 = x => x === 0 ? '0' : x < 0.0001 ? x.toExponential(3) : x.toFixed(x < 0.01 ? 6 : 5);
  card.addEventListener('input', e => {
    const f = e.target.dataset.f; if (!f) return; const nd = nodeAt(tree, parsePath(e.target.closest('[data-p]').dataset.p));
    if (f === 'name') nd.name = e.target.value; else if (f === 'p') nd.p = clamp(parseFloat(e.target.value) || 0, 0, 1); else if (f === 'k') nd.k = Math.max(1, parseInt(e.target.value) || 1);
    if (f !== 'type' && f !== 'kind') update();
  });
  card.addEventListener('change', e => { const f = e.target.dataset.f; if (f === 'type' || f === 'kind') { const nd = nodeAt(tree, parsePath(e.target.closest('[data-p]').dataset.p)); nd[f] = e.target.value; if (nd.type === 'VOTE') nd.k = clamp(nd.k || 2, 1, Math.max(1, nd.ch.length)); render(); } });
  card.addEventListener('click', e => {
    const a = e.target.closest('[data-act]'); if (!a) return; const path = parsePath(a.closest('[data-p]').dataset.p), nd = nodeAt(tree, path);
    if (a.dataset.act === 'adde') nd.ch.push(E('New event', 0.05)); if (a.dataset.act === 'addg') nd.ch.push(Gt('OR', 'Sub-event', [E('Cause 1', 0.05), E('Cause 2', 0.05)]));
    if (a.dataset.act === 'del') nodeAt(tree, path.slice(0, -1)).ch.splice(path[path.length - 1], 1);
    render();
  });
  $$('[data-ft]', card).forEach(b => b.onclick = () => { const o = PRE[b.dataset.ft]; tree = o[1](); $('#ft-src').innerHTML = (b.classList.contains('lec') ? CH.lec : CH.demo) + ' ' + esc(o[0]); render(); });
  $('#ft-wrap-or').onclick = () => { tree = Gt('OR', 'New top', [tree, E('Extra cause', 0.01)]); render(); };
  $('#ft-wrap-and').onclick = () => { tree = Gt('AND', 'New top', [tree, E('Extra cause', 0.5)]); render(); };
  render();
  window.FT_TEST = { top: () => ev(tree) };
})();

/* ============================================================ 6.4 Event tree */
(function () {
  const card = $('#m6-eta');
  let et = { name: 'Explosion', f: 0.01, cols: [{ name: 'Start of fire', p: 0.8, termF: true }, { name: 'Sprinkler system does not function', p: 0.01, termF: false }, { name: 'Fire alarm is not activated', p: 0.001, termF: false }], labels: {} };
  const PRE = {
    iec: ['Slide "ETA Examples" (adapted from IEC 60300-3-9): explosion 10⁻² per year, P(start of fire) 0.80, P(sprinkler does not function) 0.01, P(alarm not activated) 0.001. Note: the slide prints the frequencies of rows 2 and 3 swapped (7.9·10⁻⁶ and 8.0·10⁻⁵); the simulator computes them from the branch probabilities (rows 2 → 8.0·10⁻⁵, 3 → 7.9·10⁻⁶).',
      { name: 'Explosion', f: 0.01, cols: [{ name: 'Start of fire', p: 0.8, termF: true }, { name: 'Sprinkler system does not function', p: 0.01, termF: false }, { name: 'Fire alarm is not activated', p: 0.001, termF: false }], labels: { TTT: 'Uncontrolled fire with no alarm', TTF: 'Uncontrolled fire with alarm', TFT: 'Controlled fire with no alarm', TFF: 'Controlled fire with alarm', F: 'No fire' } }],
    gas: ['Slide "ETA Examples" gas-outlet-blocked separator (structure from the slide; the slide shows no probabilities, so these are demo).',
      { name: 'Gas outlet blocked', f: 0.5, cols: [{ name: 'PSDs do not close flow into separator', p: 0.05, termF: true }, { name: 'PSVs do not relieve pressure', p: 0.1, termF: true }, { name: 'Rupture disc does not open', p: 0.02, termF: false }], labels: { F: 'Controlled shutdown, no gas lost', TF: 'Gas relieved to flare', TTT: 'Rupture or explosion of separator', TTF: 'Gas flowing out of rupture disc' } }],
    demo: ['Demo (mine): short circuit in a panel; barriers are the MCB, a smoke alarm and the operator.',
      { name: 'Short circuit in panel', f: 0.1, cols: [{ name: 'MCB does not trip', p: 0.05, termF: true }, { name: 'Smoke alarm does not sound', p: 0.1, termF: false }, { name: 'Operator fails to extinguish', p: 0.2, termF: false }], labels: { F: 'Safe: MCB trips', TTT: 'Fire spreads (no alarm, no action)', TTF: 'Fire put out late', TFT: 'Fire spreads (alarm but no action)', TFF: 'Fire put out' } }]
  };
  function paths() {
    const out = [], cols = et.cols;
    (function rec(i, key, prob) { if (i === cols.length) { out.push({ key, prob }); return; } const c = cols[i];
      rec(i + 1, key + 'T', prob * c.p);
      if (c.termF) out.push({ key: key + 'F', prob: prob * (1 - c.p) }); else rec(i + 1, key + 'F', prob * (1 - c.p)); })(0, '', 1);
    return out;
  }
  const label = (k, i) => et.labels[k] !== undefined ? et.labels[k] : 'Outcome ' + (i + 1);
  function colsHTML() {
    $('#et-cols').innerHTML = et.cols.map((c, i) => `<div class="node" data-i="${i}" style="margin:4px 0"><b>${i + 1}</b><input type="text" data-f="name" value="${esc(c.name)}" style="width:190px"><span>P(True) =</span><input type="number" data-f="p" min="0" max="1" step="0.001" value="${c.p}"><label title="the False branch ends the sequence here" style="font-size:12px"><input type="checkbox" data-f="termF" ${c.termF ? 'checked' : ''}> False ends</label><button class="btn sm danger" data-del="${i}">✕</button></div>`).join('') + '<span class="src">Statements are negative: True = "the barrier does not work" (or the additional event occurs), False = it works.</span>';
  }
  function update() {
    const ps = paths(), f = et.f; $('#et-name').value !== et.name && ($('#et-name').value = et.name);
    et.name = $('#et-name').value; et.f = V('et-f');
    let h = '<tr><th>Path</th><th>P(path)</th><th>frequency /yr</th><th>Outcome (editable)</th></tr>';
    ps.forEach((p, i) => { const pr = p.key.split('').map((c, j) => `${c === 'T' ? '✗' : '✓'}${j + 1}`).join(' '); h += `<tr data-k="${p.key}"><td class="mono" title="✗ = True (barrier fails / event occurs), ✓ = False">${p.key}</td><td class="mono">${sci(p.prob, 4)}</td><td class="mono"><b>${sci(et.f * p.prob, 3)}</b></td><td><input type="text" data-lab value="${esc(label(p.key, i))}"></td></tr>`; });
    $('#et-tbl').innerHTML = h;
    sums(ps); $('#et-svg').innerHTML = svg(ps);
  }
  function sums(ps) {
    const m = {}; ps.forEach((p, i) => { const l = label(p.key, i); m[l] = (m[l] || 0) + et.f * p.prob; }); const tot = Object.values(m).reduce((a, b) => a + b, 0);
    $('#et-sum').innerHTML = '<tr><th>Outcome</th><th>frequency /yr</th><th>share</th></tr>' + Object.entries(m).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<tr><td>${esc(k)}</td><td class="mono">${sci(v, 3)}</td><td class="mono">${(100 * v / tot).toFixed(4)}%</td></tr>`).join('') + `<tr><td><b>Total</b></td><td class="mono"><b>${sci(tot, 4)}</b></td><td>= f<sub>initiating</sub> ✓</td></tr>`;
  }
  function svg(ps) {
    const cols = et.cols, RH = 42, X0 = 20, XS = 190, n = cols.length; let li = 0; const ys = {}; const out = [];
    const hdr = y => cols.map((c, i) => { let a = c.name, b = ''; if (a.length > 27) { let cut = a.lastIndexOf(' ', 27); if (cut < 8) cut = 27; b = a.slice(cut).trim(); a = a.slice(0, cut); } return `<text x="${X0 + 120 + i * XS + 4}" y="${y}" font-size="11" font-weight="700" fill="#334155"><tspan x="${X0 + 120 + i * XS + 4}" y="${y}">${esc(a)}</tspan><tspan x="${X0 + 120 + i * XS + 4}" y="${y + 13}">${esc(clip(b, 30))}</tspan></text>`; }).join('');
    function rec(i, key, prob) {
      const x = X0 + 120 + i * XS;
      if (i === n) { const y = 58 + li++ * RH; ys[key] = y; const lab = label(key, ps.findIndex(p => p.key === key)); out.push(`<text x="${x + 6}" y="${y - 2}" font-size="11" fill="#0f172a"><tspan font-weight="700">${esc(clip(lab, 34))}</tspan></text><text x="${x + 6}" y="${y + 12}" font-size="10.5" fill="#b91c1c">${sci(et.f * prob, 3)} /yr</text>`); return { y, leaf: true }; }
      const c = cols[i], a = rec(i + 1, key + 'T', prob * c.p);
      let b;
      if (c.termF) { const y = 58 + li++ * RH; const k2 = key + 'F'; const lab = label(k2, ps.findIndex(p => p.key === k2)); out.push(`<text x="${x + XS + 6}" y="${y - 2}" font-size="11" fill="#0f172a"><tspan font-weight="700">${esc(clip(lab, 34))}</tspan></text><text x="${x + XS + 6}" y="${y + 12}" font-size="10.5" fill="#b91c1c">${sci(et.f * prob * (1 - c.p), 3)} /yr</text>`); b = { y, term: true }; }
      else b = rec(i + 1, key + 'F', prob * (1 - c.p));
      const y = (a.y + b.y) / 2, nx = x + XS;
      out.push(`<line x1="${x}" y1="${y}" x2="${x + 20}" y2="${y}" stroke="#334155" stroke-width="1.6"/><line x1="${x + 20}" y1="${a.y}" x2="${x + 20}" y2="${b.y}" stroke="#334155" stroke-width="1.6"/>`);
      out.push(`<line x1="${x + 20}" y1="${a.y}" x2="${nx}" y2="${a.y}" stroke="#334155" stroke-width="1.6"/><text x="${x + 28}" y="${a.y - 4}" font-size="10" fill="#475569">True ${pf(c.p)}</text>`);
      out.push(`<line x1="${x + 20}" y1="${b.y}" x2="${nx}" y2="${b.y}" stroke="#334155" stroke-width="1.6"/><text x="${x + 28}" y="${b.y + 13}" font-size="10" fill="#475569">False ${pf(1 - c.p)}</text>`);
      return { y };
    }
    const root = rec(0, '', 1), W = X0 + 120 + n * XS + 200, H = 58 + li * RH + 10;
    return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="system-ui,sans-serif">${hdr(14)}<rect x="${X0}" y="${root.y - 22}" width="112" height="44" rx="6" fill="#eef4ff" stroke="#2457d6" stroke-width="1.6"/><text x="${X0 + 56}" y="${root.y - 4}" text-anchor="middle" font-size="10.5" font-weight="700" fill="#14224a">${esc(clip(et.name, 17))}</text><text x="${X0 + 56}" y="${root.y + 11}" text-anchor="middle" font-size="10" fill="#334155">${sci(et.f, 3)} /yr</text><line x1="${X0 + 112}" y1="${root.y}" x2="${X0 + 120}" y2="${root.y}" stroke="#334155" stroke-width="1.6"/>${out.join('')}</svg>`;
  }
  const clip = (s, k) => s.length > k ? s.slice(0, k - 1) + '…' : s;
  card.addEventListener('input', e => {
    if (e.target.dataset.lab !== undefined) { const k = e.target.closest('tr').dataset.k; et.labels[k] = e.target.value; sums(paths()); $('#et-svg').innerHTML = svg(paths()); return; }
    const nd = e.target.closest('.node[data-i]'); if (nd && e.target.dataset.f) { const c = et.cols[+nd.dataset.i], f = e.target.dataset.f; if (f === 'name') c.name = e.target.value; else if (f === 'p') c.p = clamp(parseFloat(e.target.value) || 0, 0, 1); update(); }
  });
  card.addEventListener('change', e => { const nd = e.target.closest('.node[data-i]'); if (nd && e.target.dataset.f === 'termF') { et.cols[+nd.dataset.i].termF = e.target.checked; update(); } });
  card.addEventListener('click', e => { if (e.target.dataset.del !== undefined) { et.cols.splice(+e.target.dataset.del, 1); et.labels = {}; colsHTML(); update(); } });
  $('#et-add').onclick = () => { if (et.cols.length >= 6) return; et.cols.push({ name: 'New barrier does not work', p: 0.1, termF: false }); et.labels = {}; colsHTML(); update(); };
  wire(card, e => { if (e.target.id === 'et-N' || e.target.dataset.r === 'et-N') return; update(); });
  $$('[data-et]', card).forEach(b => b.onclick = () => { const o = PRE[b.dataset.et]; et = JSON.parse(JSON.stringify(o[1])); $('#et-name').value = et.name; setV('et-f', et.f); $('#et-src').innerHTML = (b.classList.contains('lec') ? CH.lec : CH.demo) + ' ' + esc(o[0]); colsHTML(); update(); });
  $('#et-mc').onclick = () => {
    const N = Math.round(V('et-N')), cnt = {}, ps = paths();
    for (let i = 0; i < N; i++) { let key = ''; for (const c of et.cols) { const t = Math.random() < c.p; key += t ? 'T' : 'F'; if (!t && c.termF) break; } cnt[key] = (cnt[key] || 0) + 1; }
    const rows = ps.map((p, i) => `<tr><td>${esc(label(p.key, i))}</td><td class="mono">${sci(p.prob, 3)}</td><td class="mono">${sci((cnt[p.key] || 0) / N, 3)}</td></tr>`).join('');
    $('#et-sum').innerHTML += `<tr><th colspan="3">Monte Carlo (${N} initiating events): P(path) formula vs simulated</th></tr>${rows}`;
  };
  setV('et-f', et.f); $('#et-name').value = et.name; et.labels = PRE.iec[1].labels; colsHTML(); update();
})();

/* ============================================================ 6.5 comparison */
(function () {
  const card = $('#m6-cmp');
  function update() {
    const p1 = V('cm-p1'), p2 = V('cm-p2'), r1 = 1 - p1, r2 = 1 - p2, R = r1 + r2 - r1 * r2, top = p1 * p2, eta = p1 * p2;
    setBox('cm-rbd', fR(R), 'RBD: R<sub>s</sub> = R₁+R₂−R₁R₂', 'hi'); setBox('cm-fta', top.toFixed(5), 'FTA: P(top) = p₁·p₂', 'bad'); setBox('cm-eta', eta.toFixed(5), 'ETA: P(P1 fails)·P(P2 fails)', 'bad'); setBox('cm-chk', Math.abs(R + top - 1) < 1e-12 ? 'yes ✓' : 'no', 'R<sub>s</sub> + P(top) = 1 ?', 'hi');
    $('#cm-s1').innerHTML = rbdSVG({ t: 'grp', type: 'parallel', k: 1, ch: [{ t: 'blk', name: 'P1', R: r1 }, { t: 'blk', name: 'P2', R: r2 }] });
    const ln = (a, b, c, d) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="#334155" stroke-width="1.6"/>`;
    $('#cm-s2').innerHTML = `<svg width="250" height="190" viewBox="0 0 250 190" font-family="system-ui" font-size="11"><rect x="70" y="6" width="110" height="38" rx="5" fill="#fff" stroke="#334155" stroke-width="1.6"/><text x="125" y="22" text-anchor="middle" font-weight="700">No cooling</text><text x="125" y="37" text-anchor="middle" fill="#b91c1c">P = ${top.toFixed(4)}</text>${ln(125, 44, 125, 58)}<g transform="translate(125 76)"><path d="M-17 16 V0 A17 17 0 0 1 17 0 V16 Z" fill="#eef2ff" stroke="#334155" stroke-width="1.8"/><text y="11" text-anchor="middle" font-size="9" font-weight="700">AND</text></g>${ln(125, 92, 125, 110)}${ln(60, 110, 190, 110)}${ln(60, 110, 60, 126)}${ln(190, 110, 190, 126)}<circle cx="60" cy="146" r="19" fill="#eef4ff" stroke="#2457d6" stroke-width="2"/><text x="60" y="150" text-anchor="middle" font-size="10" font-weight="700">${p1}</text><text x="60" y="180" text-anchor="middle">P1 fails</text><circle cx="190" cy="146" r="19" fill="#eef4ff" stroke="#2457d6" stroke-width="2"/><text x="190" y="150" text-anchor="middle" font-size="10" font-weight="700">${p2}</text><text x="190" y="180" text-anchor="middle">P2 fails</text></svg>`;
    $('#cm-s3').innerHTML = `<svg width="300" height="190" viewBox="0 0 300 190" font-family="system-ui" font-size="11"><rect x="6" y="70" width="84" height="44" rx="6" fill="#eef4ff" stroke="#2457d6" stroke-width="1.6"/><text x="48" y="88" text-anchor="middle" font-weight="700">P1 fails</text><text x="48" y="104" text-anchor="middle" fill="#334155">p₁ = ${p1}</text>${ln(90, 92, 110, 92)}${ln(110, 40, 110, 150)}${ln(110, 40, 150, 40)}${ln(110, 150, 150, 150)}<text x="114" y="34" fill="#475569">standby P2 works (${(1 - p2).toFixed(3)})</text><text x="114" y="144" fill="#475569">P2 fails (${p2})</text><text x="154" y="56" font-weight="700">Cooling kept</text><text x="154" y="70" fill="#b91c1c">${(p1 * (1 - p2)).toFixed(4)}</text><text x="154" y="166" font-weight="700">Loss of cooling</text><text x="154" y="180" fill="#b91c1c">${(p1 * p2).toFixed(4)}</text></svg>`;
  }
  wire(card, update);
  $('#cm-miss').onclick = () => { setV('cm-p1', 0.08); setV('cm-p2', 0.08); update(); };
  $('#cm-demo').onclick = () => { setV('cm-p1', 0.1); setV('cm-p2', 0.2); update(); };
  update();
})();

/* ---------------------------------------------------------------- 6.2b S O D scales */
(function () {
  const sec = $('#m6-sod');
  const SV = ['', 'no effect', 'no significant effect on production', 'no significant effect on production', 'loss < 4 h and / or high maintenance cost', 'loss < 4 h and / or high maintenance cost', 'major disruption, loss 4 – 12 h', 'major disruption, loss 4 – 12 h', 'major disruption, loss 12 – 24 h', 'major disruption, loss 12 – 24 h (or safety hazard)', 'safety hazard / major equipment damage / production loss > 24 h'];
  const OC = ['', 'very remote: ≤ 1 in 1 500 000', 'remote: 1 in 150 000', 'remote: 1 in 15 000', 'low: 1 in 2 000', 'low: 1 in 400', 'moderate: 1 in 80', 'moderate: 1 in 20', 'high: 1 in 8', 'high: 1 in 3', 'very high: ≥ 1 in 2'];
  const DT = ['', 'almost certain to detect (error-proof)', 'very high detection', 'high detection', 'moderately high detection', 'moderate detection', 'low detection', 'very low detection', 'remote chance of detection', 'very remote chance', 'absolutely cannot detect (no control)'];
  function calc() {
    const S = V('sod-s'), O = V('sod-o'), D = V('sod-d'), rpn = S * O * D, crn = S * O;
    setBox('sod-rpn', rpn, 'out of 1000', 'hi'); setBox('sod-crn', crn, 'out of 100'); const b = rpn >= 200 ? 'high — act now' : rpn >= 100 ? 'medium — plan action' : 'low — monitor'; setBox('sod-band', b, 'cut-offs 100 / 200 are DEMO', rpn >= 200 ? 'bad' : rpn >= 100 ? 'warn' : 'good');
    el('sod-txt').innerHTML = `<b>S = ${S}</b>: ${SV[S]}<br><b>O = ${O}</b>: ${OC[O]}<br><b>D = ${D}</b>: ${DT[D]}`;
  }
  wire(sec, calc);
  on('sod-before', 'click', () => { setV('sod-s', 7); setV('sod-o', 4); setV('sod-d', 5); calc(); }); on('sod-after', 'click', () => { setV('sod-s', 7); setV('sod-o', 2); setV('sod-d', 2); calc(); }); on('sod-fd', 'click', () => { setV('sod-s', 10); setV('sod-o', 3); setV('sod-d', 1); calc(); });
  calc();
})();

/* ---------------------------------------------------------------- 6.6 FTA symbols */
(function () {
  const sec = $('#m6-sym');
  const line = (d, c) => `<path d="${d}" fill="none" stroke="${c || '#334'}" stroke-width="2"/>`;
  const AND = '<path d="M14 44 V26 Q14 6 40 6 Q66 6 66 26 V44 Z" fill="#e8f0ff" stroke="#2457d6" stroke-width="2"/>';
  const OR = '<path d="M12 46 Q40 36 68 46 Q66 10 40 4 Q14 10 12 46 Z" fill="#fff4e0" stroke="#d98200" stroke-width="2"/>';
  const legs = line('M26 44V58M54 44V58M40 6V-2');
  const G = {
    and: AND + legs, or: OR + line('M26 42V58M54 42V58M40 4V-2'),
    vote: OR + line('M26 42V58M54 42V58M40 4V-2') + '<text x="40" y="30" text-anchor="middle" font-size="13" font-weight="700" fill="#7a4d00">k/n</text>',
    xor: OR + line('M12 53 Q40 43 68 53', '#d98200') + line('M26 50V60M54 50V60M40 4V-2'),
    pand: AND + line('M14 52 H66 M60 48 L66 52 L60 56', '#2457d6') + line('M26 52V60M54 52V60M40 6V-2'),
    inh: '<path d="M26 6 H54 L66 26 L54 46 H26 L14 26 Z" fill="#f3e8ff" stroke="#7a3fd0" stroke-width="2"/>' + line('M66 26 H78') + '<ellipse cx="88" cy="26" rx="10" ry="8" fill="#fff" stroke="#7a3fd0" stroke-width="2"/>' + line('M40 46V58M40 6V-2'),
    basic: '<circle cx="40" cy="30" r="20" fill="#e6f7ee" stroke="#12915b" stroke-width="2"/>' + line('M40 50V58M40 10V-2'),
    undev: '<path d="M40 8 L66 30 L40 52 L14 30 Z" fill="#fde8e8" stroke="#d23b3b" stroke-width="2"/>' + line('M40 8V-2'),
    house: '<path d="M40 6 L68 24 V50 H12 V24 Z" fill="#eef2f6" stroke="#556" stroke-width="2"/>' + line('M40 6V-2'),
    inter: '<rect x="12" y="10" width="56" height="34" rx="3" fill="#eef2f6" stroke="#334" stroke-width="2"/>' + line('M40 44V58M40 10V-2'),
    trans: '<path d="M40 6 L70 52 H10 Z" fill="#fff9d6" stroke="#a88300" stroke-width="2"/>' + line('M40 6V-2'),
    cond: '<ellipse cx="40" cy="28" rx="28" ry="18" fill="#fff" stroke="#556" stroke-width="2" stroke-dasharray="4 3"/>' + line('M68 28H78')
  };
  const T = [['and', 'AND gate', 'output only if ALL inputs occur', '≙ parallel RBD', 'lec'], ['or', 'OR gate', 'output if ANY input occurs', '≙ series RBD', 'lec'], ['vote', 'Voting OR (k/n)', 'output if k of the n inputs occur', '≙ k-out-of-n', 'lec'], ['xor', 'XOR gate', 'output if EXACTLY ONE input occurs', '', 'lec'], ['pand', 'Priority AND', 'all inputs in a SPECIFIC SEQUENCE (A before B)', 'sequence matters', 'lec'], ['inh', 'Inhibit gate', 'input causes output only if the condition (ellipse) holds', 'P = P(i)·P(c)', 'tb'],
  ['basic', 'Basic event (circle)', 'fundamental failure with known probability / λ — not developed further', 'one RBD block', 'lec'], ['undev', 'Undeveloped event (diamond)', 'could be expanded but is not (no data / low importance)', '', 'lec'], ['house', 'House event', 'normally ON or OFF (probability 1 or 0): switches a branch in or out', '', 'tb'], ['inter', 'Intermediate / top event (rectangle)', 'output of a gate; TOP = the undesired event analysed', '', 'lec'], ['trans', 'Transfer in / out (triangle)', 'continues the tree on another sheet or sub-tree', '≙ RBD sub-diagram', 'lec'], ['cond', 'Conditional / trigger event (ellipse)', 'states a condition on a gate; a trigger sets a path ON (1) or OFF (0)', '', 'lec']];
  el('sym-grid').innerHTML = T.map(t => `<div class="symcell"><svg viewBox="-4 -6 106 70" width="100%" height="84">${G[t[0]]}</svg><b>${t[1]}</b><span>${t[2]}</span>${t[3] ? `<i>${t[3]}</i>` : ''}${t[4] === 'lec' ? CH.lec : CH.tb}</div>`).join('');
  function pa() {
    const v = document.querySelector('input[name=pa-seq]:checked').value, both = v !== 'a', ok = v === 'ab';
    setBox('pa-and', both ? 'fires' : 'no output', both ? 'both A and B occurred' : 'B never occurred', both ? 'bad' : 'good'); setBox('pa-pand', ok ? 'fires' : 'no output', ok ? 'A occurred before B' : both ? 'wrong order — no output' : 'B never occurred', ok ? 'bad' : 'good');
    el('pa-note').textContent = 'Example: standby pump fails ONLY matters if the primary pump failed first; if the standby failed first it was repaired / noticed in time.';
  }
  function ih() { const pi = V('ih-pi'), pc = V('ih-pc'); setBox('ih-out', f4(pi * pc), `${pi} × ${pc}`, 'hi'); setBox('ih-and', f4(pi * pc), 'AND of the two events (independent)'); }
  function tf() {
    const px = V('tf-px'), pa_ = V('tf-pa'), pb = V('tf-pb'), t1 = pa_ * pb, top = 1 - (1 - px) * (1 - t1), sh = document.querySelector('input[name=tf-sheet]:checked').value;
    setBox('tf-t1', f4(t1), 'sub-tree T1 (sheet 2)', 'hi'); setBox('tf-top', f4(top), 'OR of X and T1 (sheet 1)', 'hi');
    const box = (x, y, w, h, t) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="#eef2f6" stroke="#334" stroke-width="1.6"/><text x="${x + w / 2}" y="${y + h / 2 + 4}" text-anchor="middle" font-size="11">${t}</text>`;
    const circ = (x, y, t, p) => `<circle cx="${x}" cy="${y}" r="16" fill="#e6f7ee" stroke="#12915b" stroke-width="1.6"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-size="11">${t}</text><text x="${x}" y="${y + 30}" text-anchor="middle" font-size="9" fill="#555">${p}</text>`;
    const tri = (x, y, t) => `<path d="M${x} ${y - 16} L${x + 20} ${y + 16} H${x - 20} Z" fill="#fff9d6" stroke="#a88300" stroke-width="1.6"/><text x="${x}" y="${y + 12}" text-anchor="middle" font-size="10">${t}</text>`;
    const L = (a, b, c, d) => `<path d="M${a} ${b} L${c} ${d}" stroke="#334" stroke-width="1.6" fill="none"/>`;
    const gate = (x, y, t, c) => `<path d="M${x - 20} ${y + 14} V${y} Q${x - 20} ${y - 18} ${x} ${y - 18} Q${x + 20} ${y - 18} ${x + 20} ${y} V${y + 14} Z" fill="#fff" stroke="${c}" stroke-width="1.6"/><text x="${x}" y="${y + 6}" text-anchor="middle" font-size="11" font-weight="700" fill="${c}">${t}</text>`;
    el('tf-svg').innerHTML = sh === '1' ? `<svg viewBox="0 0 260 190" width="100%">${box(80, 4, 100, 26, 'Plant trip (top)')}${L(130, 30, 130, 52)}${gate(130, 70, 'OR', '#d98200')}${L(110, 84, 70, 128)}${L(150, 84, 190, 128)}${circ(70, 140, 'X', 'P=' + px)}${tri(190, 140, 'T1')}<text x="190" y="176" text-anchor="middle" font-size="9" fill="#555">to sheet 2 · P=${t1.toFixed(4)}</text></svg>` : `<svg viewBox="0 0 260 190" width="100%">${tri(130, 24, 'T1')}<text x="130" y="58" text-anchor="middle" font-size="9" fill="#555">from sheet 1</text>${L(130, 40, 130, 70)}${gate(130, 88, 'AND', '#2457d6')}${L(110, 102, 70, 128)}${L(150, 102, 190, 128)}${circ(70, 140, 'A', 'P=' + pa_)}${circ(190, 140, 'B', 'P=' + pb)}</svg>`;
  }
  wire(sec, e => { pa(); ih(); tf(); }); pa(); ih(); tf();
})();

/* ---------------------------------------------------------------- 6.7 RCM 7 steps */
(function () {
  const sec = $('#m6-rcm');
  const Q = ['Functions &amp; performance standards', 'Functional failures', 'Failure modes', 'Failure effects', 'Failure consequences', 'Proactive task &amp; interval', 'Default action'];
  const PQ = ['What is the item supposed to do (standard of performance)?', 'In what ways can it fail to do that?', 'What causes each functional failure?', 'What happens when each failure mode occurs?', 'Why does it matter? (hidden, safety / environment, operational, non-operational)', 'What can be done to predict or prevent the failure? (applicable AND effective)', 'If no proactive task is suitable, what then? (failure-finding, redesign, run-to-failure)'];
  const P = {
    pump: { n: 'Cooling-water pump', t: ['Deliver 50 m³/h at ≥ 3 bar to the reactor jacket', 'Delivers no flow; delivers less than 50 m³/h', 'Bearing seizes; impeller worn; shaft seal leaks', 'Jacket temperature rises, high-temp alarm, trip within 10 min, 4 h lost output'], c: 'op', ind: true, age: true, cost: true },
    relief: { n: 'Pressure relief valve', t: ['Open at 10 bar and relieve the vessel', 'Fails to open at set pressure; opens too early', 'Spring fatigue; seat fouled by polymer; stuck stem', 'Nothing happens until the vessel is over-pressured AND the control system also fails'], c: 'hidden', ind: false, age: false, cost: true },
    light: { n: 'Office corridor light', t: ['Light the corridor to 100 lux', 'No light', 'Lamp burns out; ballast fails', 'Corridor dim — no safety or output effect; replace when noticed'], c: 'nonop', ind: false, age: false, cost: false },
    belt: { n: 'Conveyor belt', t: ['Carry 200 t/h at 1.5 m/s', 'Belt stops; belt slips; belt tears', 'Edge fraying and abrasion; splice failure; roller seizes', 'Line stops, 6 h to replace, product loss'], c: 'op', ind: false, age: true, cost: true }
  };
  const CL = { hidden: 'Hidden failure', safety: 'Safety / environmental', op: 'Operational', nonop: 'Non-operational' };
  let step = 0, cur = null, d = null;
  function load() { cur = el('rc-comp').value; const p = P[cur]; d = { t: p.t.slice(), c: p.c, ind: p.ind, age: p.age, cost: p.cost }; step = 0; render(); }
  function rec() {
    let task = null; if (d.ind) task = 'On-condition task (condition-based monitoring): inspect at ≤ ½ P–F interval'; else if (d.age) task = 'Scheduled restoration / discard at the age limit (wear-out)';
    if (task && (d.c === 'op' || d.c === 'nonop') && !d.cost) task = null;
    if (task) return { step: 6, text: task, ok: true };
    if (d.c === 'hidden') return { step: 7, text: 'Default: failure-finding task (functional test) at an interval that gives the required availability', ok: true };
    if (d.c === 'safety') return { step: 7, text: 'Default: redesign — a safety / environmental failure must be reduced to a tolerable risk', ok: true };
    return { step: 7, text: 'Default: run-to-failure (no scheduled maintenance) — redesign only if the cost is unacceptable', ok: true };
  }
  function render() {
    el('rc-step-pill').textContent = `question ${step + 1} of 7 — ${Q[step].replace(/&amp;/g, '&')}`;
    el('rc-bar').innerHTML = Q.map((q, i) => `<button class="rcm-s ${i === step ? 'on' : ''} ${i < step ? 'done' : ''}" data-st="${i}"><b>${i + 1}</b> ${q}</button>`).join('');
    let b = `<b>Question ${step + 1}: ${PQ[step]}</b>`;
    if (step < 4) b += `<label>Your answer for “${P[cur].n}”<input type="text" id="rc-in" value="${d.t[step].replace(/"/g, '&quot;')}"></label>`;
    else if (step === 4) b += `<div class="row"><label>Consequence class <select id="rc-cons">${Object.keys(CL).map(k => `<option value="${k}" ${d.c === k ? 'selected' : ''}>${CL[k]}</option>`).join('')}</select></label></div><div class="box note">Hidden: no direct impact but exposes the plant to multiple failures (needs a failure-finding test). Safety / environmental: could hurt someone or breach a standard — must be reduced to a tolerable risk. Operational: affects output, quality or cost. Non-operational: only the direct repair cost.</div>`;
    else if (step === 5) b += `<div class="cl"><label><input type="checkbox" id="rc-ind" ${d.ind ? 'checked' : ''}> a condition indicator exists with a usable P–F interval (vibration, oil, temperature …)</label><label><input type="checkbox" id="rc-age" ${d.age ? 'checked' : ''}> failure is age-related (wear-out, β &gt; 1)</label><label><input type="checkbox" id="rc-cost" ${d.cost ? 'checked' : ''}> the task costs less than the failure it prevents (cost-effective)</label></div><div class="box ${rec().step === 6 ? 'good' : 'warn'}"><b>${rec().step === 6 ? 'Proactive task found:' : 'No suitable proactive task →'}</b> ${rec().step === 6 ? rec().text : 'go to question 7'}</div>`;
    else b += `<div class="box ${rec().step === 7 ? 'warn' : 'good'}"><b>${rec().step === 6 ? 'Not needed — a proactive task was selected at question 6.' : rec().text}</b></div>`;
    el('rc-body').innerHTML = b;
    const r = rec(), cons = CL[d.c];
    el('rc-sum').innerHTML = '<tr><th>1 Function</th><th>2 Functional failure</th><th>3 Failure mode</th><th>4 Effect</th><th>5 Consequence</th><th>6/7 Task</th></tr>' + `<tr><td>${esc(d.t[0])}</td><td>${esc(d.t[1])}</td><td>${esc(d.t[2])}</td><td>${esc(d.t[3])}</td><td id="rc-sum-c">${cons}</td><td id="rc-sum-t">${r.text}</td></tr>`;
    el('rc-rec').innerHTML = `<b>RCM outcome for ${P[cur].n}:</b> ${r.text}. <span id="rc-q">(decided at question ${r.step})</span>`;
    el('rc-prev').style.opacity = step === 0 ? 0.45 : 1; el('rc-next').style.opacity = step === 6 ? 0.45 : 1;
  }
  sec.addEventListener('input', e => { const t = e.target; if (t.id === 'rc-in') d.t[step] = t.value; });
  sec.addEventListener('change', e => { const t = e.target; if (t.id === 'rc-cons') d.c = t.value; if (t.id === 'rc-ind') d.ind = t.checked; if (t.id === 'rc-age') d.age = t.checked; if (t.id === 'rc-cost') d.cost = t.checked; if (['rc-cons', 'rc-ind', 'rc-age', 'rc-cost'].includes(t.id)) render(); if (t.id === 'rc-comp') load(); });
  sec.addEventListener('click', e => { const b = e.target.closest('[data-st]'); if (b) { step = +b.dataset.st; render(); } });
  on('rc-prev', 'click', () => { if (step > 0) { step--; render(); } }); on('rc-next', 'click', () => { if (step < 6) { step++; render(); } }); on('rc-reset', 'click', load);
  load();
})();

/* ---------------------------------------------------------------- 6.8 RCM vs FMEA/FMECA */
(function () {
  const sec = $('#m6-rcmv');
  const R = [['Direction', '“bottom-up” from component failure modes', '“top-down” from system functions'], ['Focus', 'failure modes of the components within a system', 'functions of the system and how they fail in the operating context (functional failures)'], ['Purpose', 'design engineer: how may the design fail · reliability engineer: identify a maintenance strategy', 'identify strategies that preserve the function of the system / asset in its operating context'], ['Quantification', 'FMEA qualitative; FMECA adds criticality (CRN, RPN, C<sub>m</sub>)', 'qualitative; consequence classes decide the task; risk matrix optional'], ['Output', 'ranked failure-mode list, recommended actions', 'a maintenance programme: task, interval, default action per failure mode'], ['Standard', 'MIL-STD-1629A / IEC 60812 (textbook)', 'SAE JA1011 (criteria), JA1012 (guide)'], ['Team / timing', 'design or reliability engineer; early design and operation', 'cross-functional team (facilitator, operations, engineering, craftsman); in service'], ['Relationship', 'one input to RCM (step 5: FMEA)', 'RCM = FMEA + consequence logic + task selection']];
  el('rv-tbl').innerHTML = '<tr><th>Aspect</th><th>FMEA / FMECA</th><th>RCM</th></tr>' + R.map(r => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('');
  const QZ = [['“Start from each component and ask how it can fail.”', 0], ['“Start from the function in its operating context.”', 1], ['“Produces a Risk Priority Number for each failure mode.”', 0], ['“Classifies each failure as hidden, safety, operational or non-operational.”', 1], ['“Output is a maintenance task and interval.”', 1], ['“Its worksheet is step 5 of the other method.”', 0]];
  let ans = {};
  function render() {
    el('rv-quiz').innerHTML = QZ.map((q, i) => `<div class="box ${ans[i] === undefined ? 'note' : (ans[i] === q[1] ? 'good' : 'warn')}"><b>${i + 1}.</b> ${q[0]}<div class="row"><label style="margin-right:12px"><input type="radio" name="rv${i}" data-q="${i}" data-o="0" ${ans[i] === 0 ? 'checked' : ''}> FMEA / FMECA</label><label><input type="radio" name="rv${i}" data-q="${i}" data-o="1" ${ans[i] === 1 ? 'checked' : ''}> RCM</label></div></div>`).join('');
    const n = Object.keys(ans).length, ok = Object.keys(ans).filter(i => ans[i] === QZ[i][1]).length; el('rv-score').textContent = `score ${ok} / ${n} answered (of ${QZ.length})`;
  }
  sec.addEventListener('change', e => { const t = e.target; if (t.dataset && t.dataset.q !== undefined) { ans[+t.dataset.q] = +t.dataset.o; render(); } });
  on('rv-reset', 'click', () => { ans = {}; render(); }); render();
})();

/* ---------------------------------------------------------------- 6.9 CBM P-F */
(function () {
  const sec = $('#m6-cbm'), plot = mkPlot('cb-plot', { xlabel: 'time (weeks)', ylabel: 'condition (100 = new, 0 = failed)' });
  const TF = 40;
  function calc() {
    const pf = V('cb-pf'), dt = V('cb-dt'), ph = V('cb-ph'), k = V('cb-k'), tp = TF - pf, cond = t => 100 * (1 - Math.pow(Math.max(0, t) / TF, k)), insp = [];
    for (let t = ph; t < TF * 1.0; t += dt) insp.push(t); const inside = insp.filter(t => t >= tp && t < TF), det = inside[0];
    setBox('cb-tp', f2(tp) + ' wk', `t_F = ${TF} wk`); setBox('cb-n', String(inside.length), 'checks between P and F', inside.length >= 2 ? 'good' : inside.length === 1 ? 'warn' : 'bad'); setBox('cb-pd', f2(Math.min(1, pf / dt)), 'chance a random-phase check lands in the window');
    setBox('cb-res', det !== undefined ? 'DETECTED' : 'MISSED', det !== undefined ? `first caught at week ${f2(det)}` : 'failed between two inspections', det !== undefined ? 'good' : 'bad'); setBox('cb-warn', det !== undefined ? f2(TF - det) + ' wk' : '—', 'time left to plan the repair'); setBox('cb-rule', dt <= pf / 2 + 1e-9 ? 'satisfied' : 'violated', `Δ = ${dt} vs ½ P–F = ${f2(pf / 2)}`, dt <= pf / 2 + 1e-9 ? 'good' : 'bad');
    plot.set([{ name: 'condition', color: '#2457d6', f: t => cond(Math.min(t, TF)) }, { name: 'inspections', color: '#d98200', dots: true, nolines: true, pts: insp.map(t => [t, cond(t)]) }], { axes: { xmin: 0, xmax: TF + 4, ymin: 0, ymax: 105 }, vlines: [{ x: tp, color: '#12915b', label: 'P' }, { x: TF, color: '#d23b3b', label: 'F' }], marks: det !== undefined ? [{ x: det, y: cond(det), label: 'caught', color: '#12915b' }] : [] });
  }
  wire(sec, calc);
  const S = (pf, dt, ph) => { setV('cb-pf', pf); setV('cb-dt', dt); setV('cb-ph', ph); calc(); };
  on('cb-bearing', 'click', () => S(6, 3, 1)); on('cb-late', 'click', () => S(6, 10, 1)); on('cb-thermo', 'click', () => S(3, 1, 0.5)); on('cb-oil', 'click', () => S(10, 4, 2));
  calc();
})();

})();
