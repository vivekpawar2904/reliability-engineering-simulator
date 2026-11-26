/* ===== m6.js : Module 6 — FMECA, fault tree, event tree ===== */
(function () {
'use strict';
const root = $('#tab-m6');
const pf = p => p === 0 ? '0' : p >= 0.001 ? (+p.toFixed(5)).toString() : p.toExponential(2);

root.innerHTML = `
<div class="subnav">
 <a href="#m6-concept">6.1 FMEA · FMECA · RCM</a><a href="#m6-fmeca">6.2 FMECA worksheet</a><a href="#m6-fta">6.3 Fault tree</a><a href="#m6-eta">6.4 Event tree</a><a href="#m6-cmp">6.5 FTA vs ETA vs RBD</a>
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
})();
