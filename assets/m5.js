/* ===== m5.js : Module 5 — Maintainability & availability ===== */
(function () {
'use strict';
const root = $('#tab-m5');
const erf = x => { const s = Math.sign(x); x = Math.abs(x); const t = 1 / (1 + 0.3275911 * x); const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return s * y; };
const Phi = z => 0.5 * (1 + erf(z / Math.SQRT2));

root.innerHTML = `
<div class="subnav">
 <a href="#m5-mt">5.1 M(t)</a><a href="#m5-mtbf">5.2 MTBF / MTTR data</a><a href="#m5-down">5.3 Downtime anatomy</a><a href="#m5-av">5.4 Ai / Aa / Ao</a>
 <a href="#m5-sim">5.5 Up/down timeline</a><a href="#m5-rm">5.6 R–M trade-off</a><a href="#m5-dfm">5.7 Design for maintainability</a><a href="#m5-pm">5.8 Preventive maintenance</a><a href="#m5-ram">5.9 RAM study</a><a href="#m5-mc">5.10 Monte Carlo</a>
</div>

${card('m5-mt', '5.1', 'Maintainability function M(t) — "how fast will the mechanic finish?"', `
 <div class="box feyn"><b>🧒 Plain words:</b> Reliability R(t) = chance the machine <i>has not failed</i> by time t. Maintainability M(t) = chance the repair <i>has been finished</i> by time t. They are twins: R falls from 1, M climbs from 0. "90% maintainability in one hour" means 9 repairs out of 10 are done within an hour. <b>Maintainability is a design property, not the act of maintenance.</b></div>
 <div class="box formula">M(t) = P(T ≤ t) = ∫<sub>0</sub><sup>t</sup> g(τ)dτ = 1 − e<sup>−μt</sup> (exponential repair), μ = 1/MTTR, MTTR = Σt<sub>i</sub>/n = total repair hours / number of repairs<br>
 twin of reliability: R(t) = ∫<sub>t</sub><sup>∞</sup> f dτ ↔ M(t) = ∫<sub>0</sub><sup>t</sup> g dτ; λ(t) = f/R ↔ μ(t) = g/(1−M); MTTF ↔ MTTR; f = λ(t)R ↔ g = μ(t)(1−M)</div>
 <div class="box tip"><b>Exam tip:</b> μ is repairs <i>per hour</i> (84/578 = 0.1453), not 578/84. M(t) is a probability: between 0 and 1 and rising. Say that repair times are really log-normal and exponential is the working approximation (L8).</div>
 <div class="row"><button class="btn lec" id="mt-lec">Load lecture example (NC milling machine, L8)</button></div>
 <div class="row"><b>Drive M(t) from:</b>
  <label><input type="radio" name="mt-mode" value="data" checked data-live> repair count &amp; total hours</label>
  <label><input type="radio" name="mt-mode" value="list" data-live> list of repair times</label>
  <label><input type="radio" name="mt-mode" value="mu" data-live> μ slider</label>
  <label title="the slide rounds μ to 0.1453 before using it"><input type="checkbox" id="mt-round" data-live checked> round μ to 4 decimals (as the slide does)</label></div>
 <div class="grid2"><div>
  <div id="mt-data">${ctl('mt-n', 'number of repairs', 1, 500, 1, 84, '')}${ctl('mt-hrs', 'total repair hours', 1, 3000, 1, 578, 'h')}</div>
  <div id="mt-list" style="display:none"><textarea id="mt-lst" rows="2" data-live>2, 5, 9, 4, 7, 12, 3</textarea><span class="src">comma-separated repair times in hours (demo values)</span></div>
  <div id="mt-mu" style="display:none">${ctl('mt-muv', 'repair rate μ', 0.01, 3, 0.005, 0.1453, '/h')}</div>
  ${ctl('mt-t1', 't₁', 0.5, 100, 0.5, 1, 'h')}${ctl('mt-t2', 't₂', 0.5, 100, 0.5, 5, 'h')}${ctl('mt-t3', 't₃', 0.5, 100, 0.5, 20, 'h')}
  ${ctl('mt-p', 'target M', 0.5, 0.999, 0.001, 0.9, '')}
 </div><div>
  <div class="outs">${outBox('mt-mttr', 'MTTR (h)')}${outBox('mt-mu-o', 'μ = 1/MTTR (per h)')}${outBox('mt-m1', 'M(t₁)')}${outBox('mt-m2', 'M(t₂)')}${outBox('mt-m3', 'M(t₃)')}${outBox('mt-tp', 'time to reach target M')}</div>
 </div></div>
 <h3>Compare with reliability, and with real (log-normal) repair times</h3>
 <div class="row">${ctl('mt-lam', 'failure rate λ (for R(t))', 0.001, 1, 0.001, 0.1, '/h')}${ctl('mt-sig', 'log-normal σ', 0.2, 1.6, 0.05, 0.8, '')}</div>
 <canvas class="plot" id="mt-plot"></canvas>
 <div class="row">${ctl('mt-N', 'Monte Carlo N repairs', 500, 100000, 500, 5000, '')}<button class="btn fill" id="mt-mc">▶ Simulate repairs</button><span id="mt-mcout" class="mono"></span></div>
 <span class="src">L8 slide: "total number of failures of a numerically controlled milling machine in a year is 84; total maintenance hours 578" → μ = 84/578 = 0.1453, MTTR = 6.8810 h, M(1) = 0.1352, M(5) = 0.5164, M(20) = 0.9453 ("13.52% chance of being repaired in 1 hour, 94.53% in 20 hours").</span>
`, CH.lec)}

${card('m5-mtbf', '5.2', 'MTBF and MTTR from field data (uptime / downtime strips)', `
 <div class="box feyn"><b>🧒 Plain words:</b> Look at the machine's diary. Each green strip is an operating stretch that ended in a failure; each red strip is the repair. <b>MTBF = average green strip</b> (add the uptimes, divide by the number of failures). <b>MTTR = average red strip.</b> A machine that is up 46.5 days at a time and fixed in a day is up almost always.</div>
 <div class="box formula">MTBF = (1/n) Σ x<sub>i</sub> = (Σ uptimes) / (number of failures)<br>MTTR = (total maintenance time) / (number of repairs)<br>L9 timeline: MTBF = MTTF + MTTD (diagnose) + MTTR (repair) when measured from failure to failure</div>
 <div class="box tip"><b>Exam tip:</b> divide by the number of <i>failures</i> (4 here), not by 3 gaps, and never put downtime in the MTBF numerator (MTBF uses uptime only).</div>
 <div class="row"><button class="btn lec" id="mb-lec">Load lecture example (50, 30, 60, 46 days)</button><button class="btn" id="mb-dem">+ add demo downtimes</button></div>
 <label>Uptimes (days, one per failure)<input type="text" id="mb-up" data-live value="50, 30, 60, 46"></label>
 <label>Repair times (same unit, optional — ${CH.demo} unless you have data)<input type="text" id="mb-dn" data-live value=""></label>
 <div class="outs">${outBox('mb-n', 'number of failures')}${outBox('mb-mtbf', 'MTBF')}${outBox('mb-mttr', 'MTTR')}${outBox('mb-ai', 'A<sub>i</sub> = MTBF/(MTBF+MTTR)')}</div>
 <div class="svgbox" id="mb-svg"></div>
 <span class="src">L9 slide: "MTBF = (50+30+60+46)/4 = 46.5 days". MTBF is for repairable systems with constant failure rate.</span>
`, CH.lec)}

${card('m5-down', '5.3', 'System downtime anatomy (MIL-HDBK-472 components of maintainability)', `
 <div class="box feyn"><b>🧒 Plain words:</b> The lift is "down" from the moment it stops to the moment it's back — not only while the spanner turns. Add the wait for the technician, hunting for the fault, fetching the part, doing the repair, paperwork, and the final test.</div>
 <div class="box formula">Malfunction active repair time = prepare + verify + locate + get parts + repair + test<br>Malfunction repair time = active repair + administrative time<br>System repair time = (malfunction repair time) × (number of malfunctions)<br>System downtime = system logistic time + system repair time + system final test time<br>Total system downtime = system downtime + initial delay &nbsp;&nbsp;⇒ &nbsp;MDT ≥ MTTR</div>
 <div class="box tip"><b>Exam tip:</b> L7 lists six components: (1) elemental tasks (simple, short, e.g. opening a nut and bolt), (2) malfunction active repair time, (3) malfunction repair time, (4) system repair time, (5) system downtime, (6) total system downtime. Name all six.</div>
 <div class="box note">${CH.demo} The slides give the definitions only, so every number here is made up (hours).</div>
 <div class="row"><button class="btn" id="dt-demo">Load demo</button></div>
 <div class="grid2"><div>
  ${ctl('dt-prep', 'prepare', 0, 5, 0.1, 0.5, 'h')}${ctl('dt-ver', 'verify the fault', 0, 5, 0.1, 0.3, 'h')}${ctl('dt-loc', 'locate the fault', 0, 8, 0.1, 1.5, 'h')}${ctl('dt-get', 'get parts', 0, 8, 0.1, 1.0, 'h')}${ctl('dt-rep', 'repair / replace', 0, 8, 0.1, 2.0, 'h')}${ctl('dt-tst', 'test / check out', 0, 5, 0.1, 0.5, 'h')}
  ${ctl('dt-adm', 'administrative time', 0, 5, 0.1, 0.4, 'h')}${ctl('dt-nm', 'malfunctions in the event', 1, 5, 1, 1, '')}${ctl('dt-log', 'system logistic time', 0, 24, 0.5, 2, 'h')}${ctl('dt-fin', 'system final test', 0, 5, 0.1, 0.5, 'h')}${ctl('dt-ini', 'initial delay', 0, 24, 0.5, 1, 'h')}
 </div><div>
  <div class="outs">${outBox('dt-act', 'active repair time')}${outBox('dt-mrt', 'malfunction repair time')}${outBox('dt-srt', 'system repair time')}${outBox('dt-sd', 'system downtime')}${outBox('dt-tot', 'TOTAL system downtime')}</div>
  <div id="dt-bar"></div>
 </div></div>
`, CH.demo)}

${card('m5-av', '5.4', 'Availability: inherent A<sub>i</sub>, achieved A<sub>a</sub>, operational A<sub>o</sub>', `
 <div class="box feyn"><b>🧒 Plain words:</b> Availability = chance the system is ready when called at a random moment. Three ways to count the time you are <i>not</i> ready. <b>A<sub>i</sub></b>: only the repair after a failure (the brochure number: spares and mechanic appear instantly, no planned stops). <b>A<sub>a</sub></b>: adds planned (preventive) maintenance. <b>A<sub>o</sub></b>: adds waiting for parts and people (logistics + administrative delay), what the passenger actually feels.</div>
 <div class="box formula">A<sub>i</sub> = MTBF / (MTBF + MTTR) &nbsp; (corrective only)<br>A<sub>a</sub> = MTBM / (MTBM + MMT) &nbsp; (corrective + preventive) &nbsp; [slide also writes MTMA]<br>A<sub>o</sub> = MTBM / (MTBM + MMT + MLDT) = MTBM / (MTBM + MDT), &nbsp; MLDT = LDT + ADT<br><b>A<sub>i</sub> ≥ A<sub>a</sub> ≥ A<sub>o</sub></b></div>
 <div class="box tip"><b>Exam tip:</b> use his symbols: Ai, Aa, Ao, MTBM, MMT, MDT, LDT, ADT. Writing only "A = MTBF/(MTBF+MTTR)" earns partial marks. Note MTBF is for failures only; MTBM counts every maintenance action, so MTBM ≤ MTBF.</div>
 <div class="row"><button class="btn lec" id="av-lec">Load lecture MTBF = 46.5 d (rest demo)</button></div>
 <div class="grid2"><div>
  ${ctl('av-mtbf', 'MTBF', 1, 500, 0.5, 46.5, 'd')}${ctl('av-mttr', 'MTTR (repair only)', 0.01, 30, 0.01, 2, 'd')}${ctl('av-mtbm', 'MTBM (between any maintenance)', 1, 500, 0.5, 40, 'd')}${ctl('av-mmt', 'MMT (mean maintenance time)', 0.01, 30, 0.01, 3, 'd')}${ctl('av-ldt', 'LDT logistics delay', 0, 20, 0.1, 1.5, 'd')}${ctl('av-adt', 'ADT administrative delay', 0, 20, 0.1, 0.5, 'd')}
 </div><div>
  <div class="outs">${outBox('av-ai', 'A<sub>i</sub> inherent')}${outBox('av-aa', 'A<sub>a</sub> achieved')}${outBox('av-ao', 'A<sub>o</sub> operational')}${outBox('av-mdt', 'MDT = MMT + MLDT')}</div>
  <div id="av-chk"></div>
 </div></div>
 <div id="av-bars"></div>
 <h3>Which downtime does each availability count?</h3>
 <div class="tblwrap"><table class="cover"><tr><th>Downtime</th><th>A<sub>i</sub></th><th>A<sub>a</sub></th><th>A<sub>o</sub></th></tr>
  <tr><td>Corrective repair (MTTR)</td><td class="s-yes">✓</td><td class="s-yes">✓</td><td class="s-yes">✓</td></tr>
  <tr><td>Preventive maintenance</td><td>✗</td><td class="s-yes">✓</td><td class="s-yes">✓</td></tr>
  <tr><td>Logistics delay (waiting for parts)</td><td>✗</td><td>✗</td><td class="s-yes">✓</td></tr>
  <tr><td>Administrative delay (waiting for people / paperwork)</td><td>✗</td><td>✗</td><td class="s-yes">✓</td></tr></table></div>
 <span class="src">L9 slides: definitions of the three categories and formulas (A<sub>i</sub> = MTBF/(MTBF+MTTR); A<sub>A</sub> = MTBM/(MTBM+MMT); A<sub>o</sub> = MTBM/(MTBM+MMT+MLDT), LDT + ADT). Only MTBF = 46.5 d is a printed number; the others are my demo values.</span>
`, CH.lec + ' ' + CH.demo)}

${card('m5-sim', '5.5', 'Up / down timeline simulation (failures, repairs, planned maintenance, waiting)', `
 <div class="box feyn"><b>🧒 Plain words:</b> Watch one machine live its life. <span style="color:#12915b"><b>Green</b></span> = working, <span style="color:#d23b3b"><b>red</b></span> = being repaired after a failure, <span style="color:#f59e0b"><b>orange</b></span> = planned (preventive) maintenance, <span style="color:#7a3fd1"><b>purple</b></span> = waiting for parts/people. The running availability line settles near the formula value — and A<sub>i</sub> ≥ A<sub>a</sub> ≥ A<sub>o</sub> falls out of the picture.</div>
 <div class="box tip"><b>Exam tip:</b> a long run of simulated machines gives A<sub>i</sub> ≈ MTBF/(MTBF+MTTR). If you add PM stops and waiting time the <i>same</i> machine looks worse — that is exactly A<sub>a</sub> and A<sub>o</sub>.</div>
 <div class="row"><button class="btn" id="sm-demo">Load demo values</button><button class="btn lec" id="sm-lec">Use milling machine MTTR 6.881 h (L8)</button></div>
 <div class="grid2"><div>
  ${ctl('sm-mtbf', 'MTBF', 5, 1000, 5, 200, 'h')}${ctl('sm-mttr', 'MTTR (repair)', 0.5, 100, 0.5, 8, 'h')}${ctl('sm-ldt', 'logistics + admin delay', 0, 100, 0.5, 6, 'h')}
 </div><div>
  ${ctl('sm-pm', 'PM every (operating h; 0 = none)', 0, 1000, 10, 150, 'h')}${ctl('sm-pmd', 'PM duration', 0, 50, 0.5, 4, 'h')}${ctl('sm-H', 'horizon', 500, 20000, 100, 4000, 'h')}
 </div></div>
 <div class="row"><button class="btn fill" id="sm-run">▶ Run animation</button><button class="btn" id="sm-skip">⏭ Skip to end</button>${ctl('sm-dur', 'animation length', 2, 40, 1, 8, 's')}</div>
 <canvas id="sm-tl" class="tl" style="height:86px"></canvas>
 <div class="legend"><span><i style="background:#12915b"></i>up</span><span><i style="background:#d23b3b"></i>repair (corrective)</span><span><i style="background:#f59e0b"></i>planned maintenance</span><span><i style="background:#7a3fd1"></i>waiting (logistics + admin)</span></div>
 <canvas class="plot" id="sm-plot" style="height:200px"></canvas>
 <div class="outs">${outBox('sm-ai', 'A<sub>i</sub> this run (up ÷ up+repair)')}${outBox('sm-aa', 'A<sub>a</sub> this run (adds PM)')}${outBox('sm-ao', 'A<sub>o</sub> this run (adds waiting)')}${outBox('sm-nf', 'failures / PM stops')}</div>
 <div class="row">${ctl('sm-M', 'fleet size', 50, 5000, 50, 500, 'machines')}<button class="btn fill" id="sm-fleet">▶ Simulate the whole fleet</button></div>
 <div class="tblwrap"><table id="sm-tbl"><tr><th></th><th>simulation (fleet mean)</th><th>formula</th></tr><tr><td>A<sub>i</sub></td><td id="sm-f-ai">—</td><td id="sm-t-ai">—</td></tr><tr><td>A<sub>a</sub></td><td id="sm-f-aa">—</td><td id="sm-t-aa">—</td></tr><tr><td>A<sub>o</sub></td><td id="sm-f-ao">—</td><td id="sm-t-ao">—</td></tr></table></div>
 <span class="src">Method: up time ~ Exponential(mean MTBF); with PM every P operating hours the clock restarts after each maintenance action. Formula with PM: per cycle E[up] = (1−e<sup>−P/MTBF</sup>)·MTBF, P(failure) = 1−e<sup>−P/MTBF</sup>.</span>
`, CH.demo + ' ' + CH.lec)}

${card('m5-rm', '5.6', 'Reliability–maintainability trade-off (RAM relationship) and choosing a design', `
 <div class="box feyn"><b>🧒 Plain words:</b> Availability needs <i>both</i> legs. You can buy it with a tougher machine (higher MTBF) or an easier-to-fix machine (lower MTTR). L9's RAM table: reliability constant &amp; maintainability worse ⇒ availability falls; reliability worse &amp; maintainability constant ⇒ availability falls; improve either ⇒ availability rises.</div>
 <div class="box formula">A<sub>i</sub> = MTBF/(MTBF+MTTR) = 1/(1 + MTTR/MTBF) — depends on the <i>ratio</i> MTTR/MTBF only.<br>L7 analysis approach: alternatives → evaluate reliability–maintainability–cost → decision (e.g. "configuration A satisfies R &amp; M with least cost").</div>
 <div class="box tip"><b>Exam tip:</b> quote the four-row RAM table (R constant/M↓ ⇒ A↓, R constant/M↑ ⇒ A↑, R↑/M constant ⇒ A↑, R↓/M constant ⇒ A↓). Then say "same A can come from different MTBF/MTTR pairs, so choose on cost".</div>
 <div class="grid2"><div>
  ${ctl('rm-mtbf', 'baseline MTBF', 10, 2000, 5, 200, 'h')}${ctl('rm-mttr', 'baseline MTTR', 0.5, 200, 0.5, 8, 'h')}${ctl('rm-fr', 'reliability change (MTBF ×)', 0.25, 4, 0.05, 1, '×')}${ctl('rm-fm', 'MTTR change (×; &lt;1 = easier to fix)', 0.25, 4, 0.05, 1, '×')}
  <div class="outs">${outBox('rm-a0', 'A<sub>i</sub> before')}${outBox('rm-a1', 'A<sub>i</sub> after')}${outBox('rm-txt', 'reading of the RAM table')}</div>
 </div><div><canvas id="rm-heat" class="tl" style="height:300px"></canvas><span class="src">Heat map of A<sub>i</sub> (green = high). Lines = A<sub>i</sub> 0.9, 0.99, 0.999. ● before, ◆ after.</span></div></div>
 <h3>Pick a design: reliability + maintainability + cost ${CH.demo}</h3>
 <div class="row">${ctl('rm-dch', 'downtime cost', 0, 5000, 10, 300, '/h')}${ctl('rm-yrs', 'service life', 1, 20, 1, 5, 'yr')}${ctl('rm-hpy', 'operating hours / year', 1000, 8760, 10, 8760, 'h')}</div>
 <div class="tblwrap"><table id="rm-alt"></table></div>
`, CH.lec + ' ' + CH.demo)}

${card('m5-dfm', '5.7', 'Design for maintainability: eight factors, rules, and a what-if lab', `
 <div class="box feyn"><b>🧒 Plain words:</b> Maintainability is baked in at the drawing board; you can't add it later. Each DFM factor shortens a different part of the repair job. Tick the factors your design has and watch MTTR fall, M(t) rise and availability improve.</div>
 <div class="box formula">M(t) = 1 − e<sup>−μt</sup>, μ = 1/MTTR &nbsp;|&nbsp; MTTR = prepare + locate + get parts + access + repair + test<br>Eight factors (Fred Schenkelberg, L7): Standardisation · Modularisation · Functional packaging · Interchangeability · Accessibility · Malfunction annunciation · Fault isolation · Identification</div>
 <div class="box tip"><b>Exam tip:</b> open with "maintainability ≠ maintenance". List all eight with a one-line example each (one screw type; light-bulb socket; one kit for the faucet repair; no custom-fit parts; waist-to-chest height; the system says what's broken; narrow the cause and contain damage; unique part names). Mention that fault isolation and self-diagnostics cut the <i>locate</i> time.</div>
 <div class="box note">${CH.demo} The <i>percentages</i> in the what-if table are my illustrative assumptions of which repair task each factor shortens; the factors and their examples are Dr. Pyne's L7.</div>
 <div class="grid2"><div>
  <b>Tick the factors your design has</b>
  <div class="cl" id="dfm-list"></div>
  ${ctl('dfm-mtbf', 'MTBF of the machine', 20, 2000, 10, 200, 'h')}
 </div><div>
  <div class="outs">${outBox('dfm-m0', 'MTTR before')}${outBox('dfm-m1', 'MTTR after')}${outBox('dfm-a0', 'A<sub>i</sub> before')}${outBox('dfm-a1', 'A<sub>i</sub> after')}</div>
  <div id="dfm-bars"></div>
 </div></div>
 <canvas class="plot" id="dfm-plot" style="height:220px"></canvas>
 <h3>Rules of design for maintainability (L7–8, Andrew Taylor) — tick as you revise</h3>
 <div class="grid2"><div class="cl" id="rules-a"></div><div class="cl" id="rules-b"></div></div>
 <div class="row"><span class="pill" id="rules-count"></span><button class="btn sm" id="rules-clear">clear ticks</button></div>
 <h3>Factors that affect maintainability (L7–8)</h3>
 <div class="tag-list"><span class="pill">Drawings &amp; checklists</span><span class="pill">Training</span><span class="pill">Asset standardisation</span><span class="pill">Planned PM</span></div>
 <div class="tblwrap"><table class="cover"><tr><th>Factor</th><th>How it changes repair time</th><th>Source</th></tr>
 <tr><td>Drawings &amp; checklists</td><td>documented knowledge ⇒ standard procedure ⇒ shorter locate / verify time</td><td>${CH.lec}</td></tr>
 <tr><td>Training</td><td>skill sets the speed and quality of the repair ⇒ lower MTTR, fewer repeat failures</td><td>${CH.lec}</td></tr>
 <tr><td>Asset standardisation</td><td>interchangeable parts and tools ⇒ less time getting parts and on the asset</td><td>${CH.lec}</td></tr>
 <tr><td>Planned preventive maintenance</td><td>structured work ⇒ less unplanned downtime ⇒ higher A<sub>i</sub>, A<sub>o</sub></td><td>${CH.lec}</td></tr>
 <tr><td>Design: the eight DFM factors above</td><td>accessibility, modularity, fault isolation … shorten access / locate / repair</td><td>${CH.lec}</td></tr>
 <tr><td>Support: spares, tools, manuals, technicians</td><td>waiting for logistics is part of downtime (MLDT) — it does not affect inherent A<sub>i</sub> but lowers A<sub>o</sub></td><td>${CH.tb}</td></tr>
 <tr><td>Environment: light, noise, heat, space, safety</td><td>poor working conditions slow the technician and add errors</td><td>${CH.tb}</td></tr></table></div>
 <h3>Repair vs replacement ${CH.demo}</h3>
 <div class="box note">Syllabus: "Repair vs Replacement". L7 rule: <i>establish the maintenance philosophy (repair or dispose) before starting the design.</i> Cost per operating hour decides.</div>
 <div class="grid2"><div><b>Repair</b>${ctl('rr-c1', 'repair cost', 0, 20000, 50, 500, '')}${ctl('rr-d1', 'downtime', 0, 100, 0.5, 8, 'h')}${ctl('rr-l1', 'life gained', 100, 20000, 100, 2000, 'h')}</div>
 <div><b>Replace</b>${ctl('rr-c2', 'new part cost', 0, 20000, 50, 2000, '')}${ctl('rr-d2', 'downtime', 0, 100, 0.5, 3, 'h')}${ctl('rr-l2', 'life gained', 100, 20000, 100, 10000, 'h')}</div></div>
 ${ctl('rr-dc', 'cost of downtime per hour', 0, 5000, 10, 300, '/h')}
 <div class="outs">${outBox('rr-o1', 'repair: cost per operating hour')}${outBox('rr-o2', 'replace: cost per operating hour')}${outBox('rr-w', 'cheaper per hour of life')}</div>
`, CH.lec + ' ' + CH.demo)}

${card('m5-pm', '5.8', 'Preventive maintenance with Weibull wear-out (L5 example: PM at 300 h)', `
 <div class="box feyn"><b>🧒 Plain words:</b> A part that <i>wears out</i> (Weibull β &gt; 1) gets more fragile with age. A planned check that swaps it for a fresh one resets that clock, so far fewer fail in service. If β &lt; 1 (infant mortality) replacing a survivor with a new part makes things <i>worse</i>; if β = 1 (constant rate) it makes no difference.</div>
 <div class="box formula">R(t) = exp[−(t/η)<sup>β</sup>], F = 1 − R<br>Fleet of N, mission T, PM every τ (units reset to new): survivors = R(τ)<sup>m</sup>·R(T − mτ), with m = ⌊T/τ⌋<br>Without PM, conditional survival: R(T | t₀) = R(T)/R(t₀)</div>
 <div class="box tip"><b>Exam tip:</b> β &gt; 1 ⇒ wear-out ⇒ PM helps. State the assumption: PM restores "as-good-as-new".</div>
 <div class="row"><button class="btn lec" id="pm-lec">Load lecture example (β = 2, η = 1000 h, 10 000 parts)</button></div>
 <div class="grid2"><div>
  ${ctl('pm-b', 'shape β', 0.3, 5, 0.1, 2, '')}${ctl('pm-e', 'scale η', 100, 5000, 50, 1000, 'h')}${ctl('pm-T', 'mission T', 50, 3000, 10, 600, 'h')}${ctl('pm-tau', 'PM interval τ', 50, 3000, 10, 300, 'h')}${ctl('pm-N', 'fleet size N', 100, 100000, 100, 10000, '')}
 </div><div>
  <div class="outs">${outBox('pm-f0', 'failures, no PM')}${outBox('pm-f1', 'failures, PM every τ')}${outBox('pm-sv', 'saved by PM')}${outBox('pm-c', 'R(T)/R(τ) if parts are not replaced')}</div>
 </div></div>
 <canvas class="plot" id="pm-plot"></canvas>
 <span class="src">L5 slides: β = 2, η = 1000 h, 10 000 parts. No PM: 3 023 fail by 600 h. PM at 300 h: expected failures 3 023 → 1 647, saving 1 376; without replacement the chance to survive the next interval given 300 h survived is 76.34%.</span>
`, CH.lec)}

${card('m5-ram', '5.9', 'RAM study — Monte Carlo availability of a system of repairable units', `
 <div class="box feyn"><b>🧒 Plain words:</b> A <b>RAM study</b> (Reliability–Availability–Maintainability) asks "if we build the plant like this, how much of the time will it really be running, how much product do we lose, and where is the weak spot?" Formulas get hopeless once units are repaired, so the computer plays the plant's life many times: every unit fails and gets repaired at random, and we count the hours the system was up.</div>
 <div class="box formula">Inputs: configuration (RBD: k-of-n), failure data (MTBF), repair data (MTTR), mission length &nbsp;|&nbsp; Method: Monte Carlo of up/down timelines &nbsp;|&nbsp; Outputs: A(t), expected production, downtime per year<br>Unit: A<sub>i</sub> = MTBF/(MTBF+MTTR) &nbsp;|&nbsp; system, k needed out of n: A<sub>sys</sub> = Σ<sub>j≥k</sub> C(n,j) A<sub>i</sub><sup>j</sup>(1−A<sub>i</sub>)<sup>n−j</sup> (series k = n, parallel k = 1)</div>
 <div class="box tip"><b>Exam tip:</b> write the four RAM-study stages — (1) define system and RBD, (2) collect failure and repair data, (3) simulate (Monte Carlo), (4) report availability, production loss and criticality of items; then compare design alternatives (more reliable parts, faster repair, extra standby unit).</div>
 <div class="row"><button class="btn lec" id="rm-single">single unit MTBF 500, MTTR 20 (A<sub>i</sub> = 0.9615)</button><button class="btn" id="rm-par">2 units in parallel (1 of 2)</button><button class="btn" id="rm-ser">2 units in series</button><button class="btn fill" id="rm-run">▶ run Monte Carlo</button></div>
 <div class="grid2"><div>${ctl('rm-n', 'number of units n', 1, 6, 1, 2, '')}${ctl('rm-k', 'units needed k (1 = parallel, n = series)', 1, 6, 1, 1, '')}${ctl('rm-mtbf', 'unit MTBF', 50, 5000, 10, 500, 'h')}${ctl('rm-mttr', 'unit MTTR', 1, 200, 1, 20, 'h')}${ctl('rm-T', 'mission / study length', 500, 40000, 100, 8760, 'h')}${ctl('rm-N', 'Monte Carlo runs', 20, 2000, 10, 300, '')}${ctl('rm-rate', 'production rate when up', 1, 1000, 1, 100, 'units/h')}</div>
 <div><div class="outs">${outBox('rm-ai', 'unit A<sub>i</sub>')}${outBox('rm-as', 'system availability (formula)')}${outBox('rm-sim', 'system availability (Monte Carlo)')}${outBox('rm-dt', 'downtime per 8760 h (formula)')}${outBox('rm-prod', 'expected production over study')}${outBox('rm-se', 'Monte Carlo std. error')}</div></div></div>
 <canvas class="plot" id="rm-plot" style="height:230px"></canvas>
 <h3>Compare design alternatives (formula) ${CH.demo}</h3><div class="tblwrap"><table class="cover" id="rm-tbl"></table></div>
 <span class="src">L8–L9 (RAM study, Monte Carlo of availability, A<sub>i</sub> = MTBF/(MTBF+MTTR)). The k-of-n availability formula and the design-alternative table are textbook / DEMO values (exponential up and repair times, all units start up, repair crew per unit).</span>
`, CH.lec + ' ' + CH.tb + ' ' + CH.demo)}

${card('m5-mc', '5.10', 'Monte Carlo simulation — random numbers, inverse transform and a worked system', `
 <div class="box feyn"><b>🧒 Plain words:</b> Monte Carlo = "roll the dice thousands of times and count". To invent a random <i>lifetime</i>, pick a random number U between 0 and 1 (a height), go across to the F(t) curve and drop down to the time axis — that time is one random lifetime. Lifetimes made this way follow exactly the distribution you started with. Build many systems from them, count how many survive, and the fraction is your reliability estimate.</div>
 <div class="box formula">Steps: ① model ② generate U ~ U(0,1) ③ convert t = F<sup>−1</sup>(U) ④ evaluate the system ⑤ repeat N times ⑥ average<br>Inverse transform: exponential t = −ln(1−U)/λ &nbsp;|&nbsp; Weibull t = γ + η[−ln(1−U)]<sup>1/β</sup> &nbsp;|&nbsp; error of an estimated probability ≈ √(p(1−p)/N)</div>
 <div class="box tip"><b>Exam tip:</b> draw the F(t) curve with U on the vertical axis and t on the horizontal axis, show the arrow across then down, and state that U and 1−U are both uniform so t = −ln(U)/λ is also used. Say why: no closed form for repairable or complex systems; error falls as 1/√N.</div>
 <div class="row"><button class="btn" id="mcx-exp">exponential: λ = 0.001/h (β = 1, η = 1000)</button><button class="btn lec" id="mcx-w">Weibull β = 2, η = 1000 h</button><button class="btn" id="mcx-w3">3-par: β = 2, η = 1000, γ = 300</button></div>
 <div class="grid2"><div>${ctl('mcx-b', 'β (1 = exponential)', 0.3, 6, 0.05, 1, '')}${ctl('mcx-e', 'η = 1/λ', 100, 5000, 10, 1000, 'h')}${ctl('mcx-g', 'γ', 0, 1500, 10, 0, 'h')}${ctl('mcx-u', 'random number U', 0.001, 0.999, 0.001, 0.632, '')}</div>
 <div><div class="outs">${outBox('mcx-t', 't = F⁻¹(U)')}${outBox('mcx-cnt', 'lifetimes drawn')}${outBox('mcx-mean', 'sample mean')}${outBox('mcx-mttf', 'exact MTTF')}</div>
  <div class="row"><button class="btn fill" id="mcx-1">draw one random U</button><button class="btn" id="mcx-10">draw 10</button><button class="btn" id="mcx-1k">draw 1 000</button><button class="btn sm" id="mcx-clr">clear</button></div></div></div>
 <div class="grid2"><canvas class="plot" id="mcx-pF" style="height:230px"></canvas><canvas class="plot" id="mcx-pH" style="height:230px"></canvas></div>
 <h3>Worked system: k of n identical units, mission time t</h3>
 <div class="grid2"><div>${ctl('mcx-n', 'units n', 1, 6, 1, 2, '')}${ctl('mcx-k', 'needed k (1 = active parallel)', 1, 6, 1, 1, '')}${ctl('mcx-tm', 'mission time t', 10, 5000, 10, 500, 'h')}${ctl('mcx-N', 'trials N', 10, 200000, 10, 1000, '')}</div>
 <div><div class="outs">${outBox('mcx-R', 'Monte Carlo R̂')}${outBox('mcx-Rx', 'exact R (binomial)')}${outBox('mcx-se', 'std. error √(p(1−p)/N)')}${outBox('mcx-ok', 'within 2 std. errors?')}</div><div class="row"><button class="btn fill" id="mcx-run">▶ run N trials</button></div></div></div>
 <span class="src">L8–L9: Monte Carlo simulation (definition, steps, random numbers, use in RAM study). Inverse-transform formulas and the standard error √(p(1−p)/N) are textbook (Kapur &amp; Lamberson; O'Connor). Parallel-pair example with λ = 0.001/h, 500 h: exact R = 2e<sup>−0.5</sup> − e<sup>−1</sup> = 0.8452 (matches PDF card Q5.6).</span>
`, CH.lec + ' ' + CH.tb + ' ' + CH.demo)}

`;

/* ---------------------------------------------------------------- 5.1 M(t) */
(function () {
  const card = $('#m5-mt');
  const plot = new Plot($('#mt-plot'), { xmin: 0, xmax: 30, ymin: 0, ymax: 1, xlabel: 'time t (h)', ylabel: 'probability' });
  const mode = () => $('input[name=mt-mode]:checked').value;
  let mc = null, mttr = 6.881;
  function getMu() {
    const m = mode(); let mu, mt;
    if (m === 'data') { mu = V('mt-n') / V('mt-hrs'); mt = V('mt-hrs') / V('mt-n'); }
    else if (m === 'mu') { mu = V('mt-muv'); mt = 1 / mu; }
    else { const arr = $('#mt-lst').value.split(/[,\s;]+/).map(parseFloat).filter(x => x > 0); if (!arr.length) return NaN; mt = arr.reduce((a, b) => a + b, 0) / arr.length; mu = 1 / mt; }
    if ($('#mt-round').checked && m !== 'mu') mu = +mu.toFixed(4);
    mttr = mt; return mu;
  }
  function update() {
    const m = mode(); $('#mt-data').style.display = m === 'data' ? '' : 'none'; $('#mt-list').style.display = m === 'list' ? '' : 'none'; $('#mt-mu').style.display = m === 'mu' ? '' : 'none';
    const mu = getMu(); if (!(mu > 0)) return;
    const M = t => 1 - Math.exp(-mu * t), ts = [V('mt-t1'), V('mt-t2'), V('mt-t3')], lam = V('mt-lam'), sg = V('mt-sig'), p = V('mt-p');
    setBox('mt-mttr', fx(mttr, 4) + ' h', 'MTTR (h)', 'hi'); setBox('mt-mu-o', fx(mu, 4), 'μ = 1/MTTR (per h)', 'hi');
    ts.forEach((t, i) => setBox('mt-m' + (i + 1), fx(M(t), 4), `M(${t} h) = ${(100 * M(t)).toFixed(2)}%`));
    setBox('mt-tp', fx(-Math.log(1 - p) / mu, 2) + ' h', `time for M = ${p}`);
    const mln = Math.log(mttr) - sg * sg / 2;
    const tmax = Math.max(4 * mttr, ts[2] * 1.2, 5);
    const ser = [{ name: 'M(t) = 1−e^(−μt)', color: '#2457d6', width: 3, f: M }, { name: 'R(t) = e^(−λt)', color: '#d23b3b', dash: [6, 4], f: t => Math.exp(-lam * t) }, { name: 'log-normal M(t), same mean', color: '#7a3fd1', dash: [2, 3], f: t => t <= 0 ? 0 : Phi((Math.log(t) - mln) / sg) }];
    if (mc) ser.push({ name: 'Monte Carlo', color: '#f59e0b', pts: mc.pts(tmax), width: 2 });
    plot.set(ser, { axes: { xmax: tmax }, marks: ts.map(t => ({ x: t, y: M(t), label: M(t).toFixed(4) })) });
    mc = null; $('#mt-mcout').textContent = '';
  }
  wire(card, e => { if (e.target.id === 'mt-N' || e.target.dataset.r === 'mt-N') return; update(); });
  $('#mt-lec').onclick = () => { $('input[name=mt-mode][value=data]').checked = true; setV('mt-n', 84); setV('mt-hrs', 578); setV('mt-t1', 1); setV('mt-t2', 5); setV('mt-t3', 20); update(); };
  $('#mt-mc').onclick = () => {
    const mu = getMu() || 0.1, N = Math.round(V('mt-N')), T = new Float64Array(N); let sum = 0; for (let i = 0; i < N; i++) { T[i] = rexp(mu); sum += T[i]; }
    const s = Array.from(T).sort((a, b) => a - b);
    mc = { pts: tmax => { const o = []; for (let i = 0; i <= 80; i++) { const t = tmax * i / 80; let lo = 0, hi = N; while (lo < hi) { const m = (lo + hi) >> 1; if (s[m] <= t) lo = m + 1; else hi = m; } o.push([t, lo / N]); } return o; } };
    const t2 = V('mt-t2'); let c = 0; for (const x of s) { if (x <= t2) c++; else break; }
    update2(); $('#mt-mcout').textContent = `N=${N}: mean repair ${(sum / N).toFixed(3)} h (MTTR ${mttr.toFixed(3)}), M(${t2} h) ≈ ${(c / N).toFixed(4)} (theory ${(1 - Math.exp(-mu * t2)).toFixed(4)})`;
    function update2() { const keep = mc; update(); mc = keep; const M = t => 1 - Math.exp(-mu * t), tmax = Math.max(4 / mu, V('mt-t3') * 1.2, 5); const ser = plot.series.filter(x => x.name !== 'Monte Carlo'); ser.push({ name: 'Monte Carlo', color: '#f59e0b', pts: keep.pts(tmax), width: 2 }); plot.set(ser); }
  };
  update();
})();

/* ---------------------------------------------------------------- 5.2 MTBF data */
(function () {
  const card = $('#m5-mtbf');
  const parse = s => s.split(/[,\s;]+/).map(parseFloat).filter(x => isFinite(x) && x >= 0);
  function update() {
    const up = parse($('#mb-up').value), dn = parse($('#mb-dn').value), n = up.length; if (!n) return;
    const su = up.reduce((a, b) => a + b, 0), mtbf = su / n; const hasD = dn.length === n; const mttr = hasD ? dn.reduce((a, b) => a + b, 0) / n : NaN;
    setBox('mb-n', n, 'number of failures'); setBox('mb-mtbf', fx(mtbf, 2), 'MTBF = ' + su + ' ÷ ' + n, 'hi'); setBox('mb-mttr', hasD ? fx(mttr, 2) : '—', hasD ? 'MTTR' : 'MTTR (add one repair per failure)');
    setBox('mb-ai', hasD ? fx(mtbf / (mtbf + mttr), 4) : '—', 'A<sub>i</sub> = MTBF/(MTBF+MTTR)');
    // strips
    const tot = su + (hasD ? dn.reduce((a, b) => a + b, 0) : 0), W = 760, sc = (W - 40) / (tot || 1); let x = 20, s = '';
    s += `<svg width="${W}" height="110" viewBox="0 0 ${W} 110" font-family="system-ui"><line x1="20" y1="80" x2="${W - 10}" y2="80" stroke="#94a3b8"/>`;
    up.forEach((u, i) => { s += `<rect x="${x}" y="22" width="${u * sc}" height="34" fill="#12915b" fill-opacity=".85"/><text x="${x + u * sc / 2}" y="44" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">${u}</text>`; x += u * sc; const d = hasD ? dn[i] : Math.max(tot * 0.01, 0.0001) * 3; const w = hasD ? d * sc : 4; s += `<rect x="${x}" y="22" width="${Math.max(w, 3)}" height="34" fill="#d23b3b"/>${hasD ? `<text x="${x + w / 2}" y="72" text-anchor="middle" font-size="10" fill="#d23b3b">${dn[i]}</text>` : ''}<text x="${x + w / 2}" y="16" text-anchor="middle" font-size="10" fill="#475569">fail ${i + 1}</text>`; x += Math.max(w, 3); });
    s += `<text x="20" y="102" font-size="11" fill="#475569">green = uptime (MTBF uses these), red = repair (MTTR uses these)</text></svg>`;
    $('#mb-svg').innerHTML = s;
  }
  wire(card, update);
  $('#mb-lec').onclick = () => { $('#mb-up').value = '50, 30, 60, 46'; $('#mb-dn').value = ''; update(); };
  $('#mb-dem').onclick = () => { const n = parse($('#mb-up').value).length; $('#mb-dn').value = Array.from({ length: n }, (_, i) => [2, 3, 1, 4, 2, 3][i % 6]).join(', '); update(); };
  update();
})();

/* ---------------------------------------------------------------- 5.3 downtime */
(function () {
  const card = $('#m5-down');
  const ids = ['prep', 'ver', 'loc', 'get', 'rep', 'tst', 'adm', 'nm', 'log', 'fin', 'ini'];
  function update() {
    const v = {}; ids.forEach(i => v[i] = V('dt-' + i));
    const act = v.prep + v.ver + v.loc + v.get + v.rep + v.tst, mrt = act + v.adm, srt = mrt * v.nm, sd = v.log + srt + v.fin, tot = sd + v.ini;
    setBox('dt-act', fx(act, 1) + ' h', 'active repair time'); setBox('dt-mrt', fx(mrt, 1) + ' h', 'malfunction repair time'); setBox('dt-srt', fx(srt, 1) + ' h', 'system repair time (× ' + v.nm + ')'); setBox('dt-sd', fx(sd, 1) + ' h', 'system downtime'); setBox('dt-tot', fx(tot, 1) + ' h', 'TOTAL system downtime', 'bad');
    const parts = [['initial delay', v.ini, '#94a3b8'], ['logistic', v.log, '#7a3fd1'], ['prepare', v.prep * v.nm, '#38bdf8'], ['verify', v.ver * v.nm, '#0ea5e9'], ['locate', v.loc * v.nm, '#f59e0b'], ['get parts', v.get * v.nm, '#a855f7'], ['repair', v.rep * v.nm, '#d23b3b'], ['test', v.tst * v.nm, '#22c55e'], ['admin', v.adm * v.nm, '#64748b'], ['final test', v.fin, '#16a34a']];
    $('#dt-bar').innerHTML = '<div style="display:flex;height:34px;border-radius:8px;overflow:hidden;border:1px solid #cbd5e1">' + parts.map(p => `<div title="${p[0]}: ${p[1].toFixed(1)} h" style="width:${100 * p[1] / (tot || 1)}%;background:${p[2]}"></div>`).join('') + '</div><div class="legend">' + parts.map(p => `<span><i style="background:${p[2]}"></i>${p[0]} ${p[1].toFixed(1)}h</span>`).join('') + '</div>';
  }
  wire(card, update);
  $('#dt-demo').onclick = () => { const d = { prep: .5, ver: .3, loc: 1.5, get: 1, rep: 2, tst: .5, adm: .4, nm: 1, log: 2, fin: .5, ini: 1 }; ids.forEach(i => setV('dt-' + i, d[i])); update(); };
  update();
})();

/* ---------------------------------------------------------------- 5.4 availability */
(function () {
  const card = $('#m5-av');
  function update() {
    const mtbf = V('av-mtbf'), mttr = V('av-mttr'), mtbm = V('av-mtbm'), mmt = V('av-mmt'), ldt = V('av-ldt'), adt = V('av-adt'), mldt = ldt + adt, mdt = mmt + mldt;
    const ai = mtbf / (mtbf + mttr), aa = mtbm / (mtbm + mmt), ao = mtbm / (mtbm + mmt + mldt);
    setBox('av-ai', fx(ai, 4), 'A<sub>i</sub> = ' + (100 * ai).toFixed(2) + '%', 'hi'); setBox('av-aa', fx(aa, 4), 'A<sub>a</sub> = ' + (100 * aa).toFixed(2) + '%', 'hi'); setBox('av-ao', fx(ao, 4), 'A<sub>o</sub> = ' + (100 * ao).toFixed(2) + '%', 'hi'); setBox('av-mdt', fx(mdt, 2) + ' d', 'MDT = MMT + (LDT+ADT)');
    const msgs = [];
    if (mtbm > mtbf) msgs.push('MTBM is larger than MTBF — impossible: MTBM counts <i>every</i> maintenance action (failures + PM), so MTBM ≤ MTBF.');
    if (mmt < mttr) msgs.push('MMT is smaller than MTTR — MMT includes PM as well as repairs, so normally MMT ≥ MTTR.');
    $('#av-chk').innerHTML = (ai >= aa && aa >= ao) ? '<div class="box good">✓ A<sub>i</sub> ≥ A<sub>a</sub> ≥ A<sub>o</sub> holds: ' + ai.toFixed(4) + ' ≥ ' + aa.toFixed(4) + ' ≥ ' + ao.toFixed(4) + '</div>' : '<div class="box warn">✗ The inequality A<sub>i</sub> ≥ A<sub>a</sub> ≥ A<sub>o</sub> is broken by these inputs.</div>';
    if (msgs.length) $('#av-chk').innerHTML += '<div class="box warn">' + msgs.join('<br>') + '</div>';
    const row = (lab, up, parts) => { const tot = up + parts.reduce((a, p) => a + p[1], 0); return `<div class="barrow" style="grid-template-columns:70px 1fr 70px"><span>${lab}</span><div style="display:flex;height:22px;border-radius:6px;overflow:hidden;border:1px solid #cbd5e1"><div title="up" style="width:${100 * up / tot}%;background:#12915b"></div>${parts.map(p => `<div title="${p[0]}" style="width:${100 * p[1] / tot}%;background:${p[2]}"></div>`).join('')}</div><span>${(100 * up / tot).toFixed(1)}%</span></div>`; };
    $('#av-bars').innerHTML = '<h3>One average cycle (green = ready, other colours = not ready)</h3>' + row('A<sub>i</sub>', mtbf, [['repair', mttr, '#d23b3b']]) + row('A<sub>a</sub>', mtbm, [['maintenance MMT', mmt, '#f59e0b']]) + row('A<sub>o</sub>', mtbm, [['maintenance MMT', mmt, '#f59e0b'], ['logistics LDT', ldt, '#7a3fd1'], ['admin ADT', adt, '#64748b']]) +
      '<div class="legend"><span><i style="background:#12915b"></i>up (MTBF / MTBM)</span><span><i style="background:#d23b3b"></i>repair MTTR</span><span><i style="background:#f59e0b"></i>maintenance MMT</span><span><i style="background:#7a3fd1"></i>LDT</span><span><i style="background:#64748b"></i>ADT</span></div>';
  }
  wire(card, update);
  $('#av-lec').onclick = () => { setV('av-mtbf', 46.5); setV('av-mttr', 2); setV('av-mtbm', 40); setV('av-mmt', 3); setV('av-ldt', 1.5); setV('av-adt', 0.5); update(); };
  update();
})();

/* ---------------------------------------------------------------- 5.5 timeline sim */
(function () {
  const card = $('#m5-sim');
  const plot = new Plot($('#sm-plot'), { xmin: 0, xmax: 4000, ymin: 0.5, ymax: 1, xlabel: 'time (h)', ylabel: 'running availability' });
  const COL = { up: '#12915b', rep: '#d23b3b', pm: '#f59e0b', wait: '#7a3fd1' };
  function params() { return { mtbf: V('sm-mtbf'), mttr: V('sm-mttr'), delay: V('sm-ldt'), pm: V('sm-pm'), pmd: V('sm-pmd'), H: V('sm-H') }; }
  function gen(p) { // list of segments until horizon
    const seg = []; let t = 0, clock = 0;
    while (t < p.H) {
      const fail = rexp(1 / p.mtbf), toPM = p.pm > 0 ? p.pm - clock : Infinity;
      if (fail <= toPM) { seg.push(['up', t, t + fail]); t += fail; clock = 0; if (p.delay > 0) { seg.push(['wait', t, t + p.delay]); t += p.delay; } const r = rexp(1 / p.mttr); seg.push(['rep', t, t + r]); t += r; }
      else { seg.push(['up', t, t + toPM]); t += toPM; clock = 0; if (p.pmd > 0) { seg.push(['pm', t, t + p.pmd]); t += p.pmd; } }
    }
    return seg;
  }
  function stats(seg, upto) {
    const a = { up: 0, rep: 0, pm: 0, wait: 0, nf: 0, npm: 0 };
    for (const s of seg) { if (s[1] >= upto) break; const e = Math.min(s[2], upto); a[s[0]] += e - s[1]; if (s[0] === 'rep' && s[2] <= upto) a.nf++; if (s[0] === 'pm' && s[2] <= upto) a.npm++; }
    return a;
  }
  const meas = a => ({ ai: a.up / (a.up + a.rep || 1), aa: a.up / (a.up + a.rep + a.pm || 1), ao: a.up / (a.up + a.rep + a.pm + a.wait || 1) });
  function theory(p) {
    const lam = 1 / p.mtbf, ai = p.mtbf / (p.mtbf + p.mttr);
    if (!(p.pm > 0)) return { ai, aa: ai, ao: p.mtbf / (p.mtbf + p.mttr + p.delay) };
    const q = Math.exp(-lam * p.pm), U = (1 - q) * p.mtbf, pf = 1 - q, rep = pf * p.mttr, pm = q * p.pmd, wt = pf * p.delay;
    return { ai, aa: U / (U + rep + pm), ao: U / (U + rep + pm + wt) };
  }
  let seg = null, raf = 0, prog = 0, p0 = null;
  function drawTL(upto) {
    const c = $('#sm-tl'), W = c.clientWidth, H = c.clientHeight; if (!W) return; const dpr = devicePixelRatio || 1; c.width = W * dpr; c.height = H * dpr; const g = c.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
    const Hh = p0.H, X = t => 8 + t / Hh * (W - 16);
    g.fillStyle = '#eef2f7'; g.fillRect(8, 14, W - 16, 38);
    if (seg) for (const s of seg) { if (s[1] >= upto) break; const e = Math.min(s[2], upto, Hh); g.fillStyle = COL[s[0]]; g.fillRect(X(s[1]), 14, Math.max(0.6, X(e) - X(s[1])), 38); }
    g.fillStyle = '#475569'; g.font = '11px system-ui'; g.textBaseline = 'top'; g.textAlign = 'center';
    const tk = niceTicks(0, Hh, 6).ticks; tk.forEach(t => { g.fillRect(X(t), 52, 1, 5); g.fillText(tk.length > 8 ? '' : t, X(t), 60); });
    g.strokeStyle = '#0f172a'; g.lineWidth = 2; g.beginPath(); g.moveTo(X(upto), 8); g.lineTo(X(upto), 58); g.stroke();
    g.textAlign = 'left'; g.fillText('time (h) →  ' + upto.toFixed(0) + ' / ' + Hh, 8, 72);
  }
  function show(upto) {
    const a = stats(seg, upto), m = meas(a);
    setBox('sm-ai', fx(m.ai, 4), 'A<sub>i</sub> this run (up ÷ up+repair)'); setBox('sm-aa', fx(m.aa, 4), 'A<sub>a</sub> this run (adds PM)'); setBox('sm-ao', fx(m.ao, 4), 'A<sub>o</sub> this run (adds waiting)', 'hi'); setBox('sm-nf', a.nf + ' / ' + a.npm, 'failures / PM stops');
    drawTL(upto);
    const pts = [], n = 160; for (let i = 1; i <= n; i++) { const t = upto * i / n; const s = stats(seg, t); pts.push([t, s.up / (t || 1)]); }
    const th = theory(p0);
    plot.set([{ name: 'running uptime fraction (= A_o)', color: '#2457d6', width: 2.5, pts }, { name: 'formula A_i', color: '#12915b', dash: [6, 4], f: () => th.ai }, { name: 'formula A_a', color: '#f59e0b', dash: [6, 4], f: () => th.aa }, { name: 'formula A_o', color: '#7a3fd1', dash: [6, 4], f: () => th.ao }],
      { axes: { xmin: 0, xmax: p0.H, ymin: Math.max(0, Math.floor(Math.min(th.ao, 0.9) * 20 - 1) / 20) } });
  }
  function run(skip) {
    cancelAnimationFrame(raf); p0 = params(); seg = gen(p0); prog = 0;
    if (skip) { show(p0.H); return; }
    const dur = V('sm-dur') * 1000, t0 = performance.now();
    const step = now => { prog = Math.min(1, (now - t0) / dur); show(Math.max(1, prog * p0.H)); if (prog < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
  }
  $('#sm-run').onclick = () => run(false); $('#sm-skip').onclick = () => run(true);
  $('#sm-demo').onclick = () => { setV('sm-mtbf', 200); setV('sm-mttr', 8); setV('sm-ldt', 6); setV('sm-pm', 150); setV('sm-pmd', 4); setV('sm-H', 4000); run(true); };
  $('#sm-lec').onclick = () => { setV('sm-mttr', 6.881); run(true); };
  $('#sm-fleet').onclick = () => {
    const p = params(), M = Math.round(V('sm-M')); let ai = 0, aa = 0, ao = 0;
    for (let i = 0; i < M; i++) { const m = meas(stats(gen(p), p.H)); ai += m.ai; aa += m.aa; ao += m.ao; }
    const th = theory(p); [['ai', ai], ['aa', aa], ['ao', ao]].forEach(([k, v]) => { $('#sm-f-' + k).textContent = (v / M).toFixed(4); $('#sm-t-' + k).textContent = th[k].toFixed(4); });
  };
  wire(card, e => { if (['sm-dur', 'sm-M'].includes(e.target.id || e.target.dataset.r)) return; cancelAnimationFrame(raf); run(true); });
  p0 = params(); run(true);
})();

/* ---------------------------------------------------------------- 5.6 R-M trade-off */
(function () {
  const card = $('#m5-rm');
  const heat = $('#rm-heat');
  const MX = [10, 2000], MY = [0.5, 200];
  const alts = [{ n: 'Design A', mtbf: 300, mttr: 12, cost: 50000 }, { n: 'Design B', mtbf: 500, mttr: 20, cost: 80000 }, { n: 'Design C', mtbf: 250, mttr: 5, cost: 65000 }];
  function drawHeat(p0, p1) {
    const W = heat.clientWidth, H = heat.clientHeight; if (!W) return; const dpr = devicePixelRatio || 1; heat.width = W * dpr; heat.height = H * dpr; const g = heat.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const L = 44, B = 30, T = 8, R = 8, pw = W - L - R, ph = H - T - B;
    const lx = v => Math.log(v), X = v => L + (lx(v) - lx(MX[0])) / (lx(MX[1]) - lx(MX[0])) * pw, Y = v => T + ph - (lx(v) - lx(MY[0])) / (lx(MY[1]) - lx(MY[0])) * ph;
    const img = g.createImageData(Math.floor(pw), Math.floor(ph));
    for (let j = 0; j < img.height; j++) for (let i = 0; i < img.width; i++) {
      const mtbf = Math.exp(lx(MX[0]) + i / img.width * (lx(MX[1]) - lx(MX[0]))), mttr = Math.exp(lx(MY[0]) + (1 - j / img.height) * (lx(MY[1]) - lx(MY[0])));
      const A = mtbf / (mtbf + mttr), nines = clamp(-Math.log10(1 - A + 1e-9) / 3, 0, 1);
      const r = Math.round(235 - 200 * nines), gg = Math.round(90 + 130 * nines), b = Math.round(90 + 20 * nines); const k = (j * img.width + i) * 4; img.data[k] = r; img.data[k + 1] = gg; img.data[k + 2] = b; img.data[k + 3] = 255;
    }
    g.putImageData(img, L * dpr, T * dpr); g.save(); g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.strokeStyle = '#fff'; g.fillStyle = '#fff'; g.lineWidth = 1.5; g.font = '11px system-ui';
    [0.9, 0.99, 0.999].forEach(A => { g.beginPath(); let first = true; for (let i = 0; i <= 100; i++) { const mtbf = Math.exp(lx(MX[0]) + i / 100 * (lx(MX[1]) - lx(MX[0]))); const mttr = mtbf * (1 - A) / A; if (mttr < MY[0] || mttr > MY[1]) continue; const x = X(mtbf), y = Y(mttr); if (first) { g.moveTo(x, y); first = false; } else g.lineTo(x, y); } g.stroke(); const mtbf = 1500, mttr = mtbf * (1 - A) / A; if (mttr > MY[0] && mttr < MY[1]) g.fillText(A, X(mtbf) - 8, Y(mttr) - 4); });
    g.fillStyle = '#334155'; g.textAlign = 'right'; g.textBaseline = 'middle'; [1, 2, 5, 10, 20, 50, 100, 200].forEach(v => g.fillText(v, L - 4, Y(v))); g.textAlign = 'center'; g.textBaseline = 'top'; [10, 20, 50, 100, 200, 500, 1000, 2000].forEach(v => g.fillText(v, X(v), T + ph + 3));
    g.fillText('MTBF (h, log scale) →', L + pw / 2, H - 13); g.save(); g.translate(10, T + ph / 2); g.rotate(-Math.PI / 2); g.fillText('MTTR (h)', 0, 0); g.restore();
    g.strokeStyle = '#0f172a'; g.lineWidth = 2; g.strokeRect(L, T, pw, ph);
    g.fillStyle = '#0f172a'; g.beginPath(); g.arc(X(clamp(p0[0], MX[0], MX[1])), Y(clamp(p0[1], MY[0], MY[1])), 6, 0, 7); g.fill();
    const x1 = X(clamp(p1[0], MX[0], MX[1])), y1 = Y(clamp(p1[1], MY[0], MY[1])); g.fillStyle = '#2457d6'; g.strokeStyle = '#fff'; g.beginPath(); g.moveTo(x1, y1 - 8); g.lineTo(x1 + 8, y1); g.lineTo(x1, y1 + 8); g.lineTo(x1 - 8, y1); g.closePath(); g.fill(); g.stroke();
    g.restore();
  }
  function update() {
    const mtbf = V('rm-mtbf'), mttr = V('rm-mttr'), fr = V('rm-fr'), fm = V('rm-fm'), a0 = mtbf / (mtbf + mttr), m1 = mtbf * fr, t1 = mttr * fm, a1 = m1 / (m1 + t1);
    setBox('rm-a0', fx(a0, 4), 'A<sub>i</sub> before'); setBox('rm-a1', fx(a1, 4), 'A<sub>i</sub> after', a1 > a0 + 1e-9 ? 'hi' : a1 < a0 - 1e-9 ? 'bad' : '');
    const rtxt = fr === 1 ? 'R constant' : fr > 1 ? 'R increases' : 'R decreases', mtxt = fm === 1 ? 'M constant' : fm < 1 ? 'M increases (faster fix)' : 'M decreases (slower fix)';
    setBox('rm-txt', a1 > a0 + 1e-9 ? 'A increases' : a1 < a0 - 1e-9 ? 'A decreases' : 'A unchanged', rtxt + ', ' + mtxt);
    drawHeat([mtbf, mttr], [m1, t1]); alt();
  }
  function alt() {
    const dch = V('rm-dch'), yrs = V('rm-yrs'), hpy = V('rm-hpy');
    let h = '<tr><th>Alternative</th><th>MTBF (h)</th><th>MTTR (h)</th><th>purchase cost</th><th>A<sub>i</sub></th><th>downtime h/yr</th><th>downtime cost over life</th><th>total cost over life</th></tr>';
    const tot = alts.map(a => { const A = a.mtbf / (a.mtbf + a.mttr); const dt = hpy * (1 - A); return { A, dt, dc: dt * dch * yrs, total: a.cost + dt * dch * yrs }; });
    const best = tot.reduce((b, t, i) => t.total < tot[b].total ? i : b, 0);
    alts.forEach((a, i) => { h += `<tr data-i="${i}" ${i === best ? 'style="background:#e8f8f0"' : ''}><td><input type="text" data-f="n" value="${esc(a.n)}"></td><td><input type="number" data-f="mtbf" value="${a.mtbf}" min="1"></td><td><input type="number" data-f="mttr" value="${a.mttr}" min="0.1"></td><td><input type="number" data-f="cost" value="${a.cost}" min="0"></td><td>${tot[i].A.toFixed(4)}</td><td>${tot[i].dt.toFixed(1)}</td><td>${Math.round(tot[i].dc).toLocaleString()}</td><td><b>${Math.round(tot[i].total).toLocaleString()}</b>${i === best ? ' ✓ least' : ''}</td></tr>`; });
    $('#rm-alt').innerHTML = h;
  }
  $('#rm-alt').addEventListener('input', e => { const tr = e.target.closest('tr[data-i]'); if (!tr) return; const a = alts[+tr.dataset.i], f = e.target.dataset.f; a[f] = f === 'n' ? e.target.value : parseFloat(e.target.value) || 0; const act = document.activeElement; const sel = [act.dataset.f, tr.dataset.i]; alt(); const nx = $(`#rm-alt tr[data-i="${sel[1]}"] [data-f="${sel[0]}"]`); if (nx) { nx.focus(); try { nx.setSelectionRange(nx.value.length, nx.value.length); } catch (_) { } } });
  wire(card, update);
  window.addEventListener('resize', () => update());
  update();
})();

/* ---------------------------------------------------------------- 5.7 DFM */
(function () {
  const card = $('#m5-dfm');
  const tasks = [['prepare', 0.5], ['locate fault', 2.0], ['get parts', 1.0], ['access / remove', 1.5], ['repair / replace', 2.0], ['test', 0.5]];
  const F = [
    ['Standardisation', 'fewest part types — one screw instead of ten kinds', { 2: .30, 0: .20 }],
    ['Modularisation', 'swap a module like a light-bulb in its socket', { 4: .35, 5: .10 }],
    ['Functional packaging', 'washers, O-ring and grease in one repair kit', { 0: .40, 2: .40 }],
    ['Interchangeability', 'no custom-fit parts, controlled tolerances', { 2: .25, 4: .10 }],
    ['Accessibility', 'access panels, waist-to-chest height, no bruised knuckles', { 3: .50 }],
    ['Malfunction annunciation', 'the system tells the technician what is broken', { 1: .35 }],
    ['Fault isolation', 'narrow the cause and contain the damage (a blown fuse is a symptom)', { 1: .35, 4: .10 }],
    ['Identification', 'unique, memorable part names and labels', { 1: .10, 0: .10, 2: .10 }]
  ];
  const RA = ['Maintainability is created in design; no changes possible later.', 'Establish the maintenance philosophy (repair or dispose) before designing.', 'Consider the location of maintenance.', 'Consult the maintenance engineer in design; agree on handover documents.', 'Keep it super simple (KISS) — complex arrangements are harder to maintain.', 'Make it super surveillance (MISS) — testable, with diagnostic points.', 'Design reliability into items that are difficult to maintain.', 'Reduce maintenance frequency with higher factor of safety (ruggedness).', 'Warning labels where an engineer may be exposed to danger.', 'Instruction panels close to the point of maintenance.', 'Fail-safe design to protect maintenance staff.', 'Avoid special tools.'];
  const RB = ['Component units: modularise where appropriate.', 'Do not disturb a healthy unit when replacing a faulty one.', 'No permanent fastening (adhesive, riveting, welding) where separation is needed.', 'Unique fitting — interfaces defeat wrong installation; locating pins so parts only fit the right way round.', 'Build self-test and diagnostic routines into complex products.', 'Access: adjustment points reachable without removing components; space for tools, hand, arm.', 'Design access for the full range of body sizes, not the average.', 'Most comfortable working height: waist to chest; no heavy lifting.', 'Lowest-life units easiest to access; frequent-maintenance items at the outer edge.', 'Components: no "select on test" or made-to-measure parts; lock pre-set adjustments; chamfer mating edges.'];
  const plot = new Plot($('#dfm-plot'), { xmin: 0, xmax: 40, ymin: 0, ymax: 1, xlabel: 'time (h)', ylabel: 'M(t)' });
  $('#dfm-list').innerHTML = F.map((f, i) => `<label><input type="checkbox" data-live data-i="${i}"><span><b>${i + 1}. ${f[0]}</b> — ${f[1]}</span></label>`).join('');
  function calc() {
    const t = tasks.map(x => x[1]), on = $$('#dfm-list input').map(c => c.checked);
    const after = t.map((v, k) => { let m = 1; F.forEach((f, i) => { if (on[i] && f[2][k]) m *= 1 - f[2][k]; }); return v * m; });
    return { before: t, after };
  }
  function update() {
    const { before, after } = calc(), m0 = before.reduce((a, b) => a + b, 0), m1 = after.reduce((a, b) => a + b, 0), mtbf = V('dfm-mtbf');
    setBox('dfm-m0', fx(m0, 2) + ' h', 'MTTR before'); setBox('dfm-m1', fx(m1, 2) + ' h', 'MTTR after', m1 < m0 ? 'hi' : ''); setBox('dfm-a0', fx(mtbf / (mtbf + m0), 4), 'A<sub>i</sub> before'); setBox('dfm-a1', fx(mtbf / (mtbf + m1), 4), 'A<sub>i</sub> after', m1 < m0 ? 'hi' : '');
    $('#dfm-bars').innerHTML = '<h3>Where the repair time goes (h)</h3>' + tasks.map((x, k) => `<div class="barrow"><span>${x[0]}</span><div class="bar" title="before"><i style="width:${100 * before[k] / 2.2}%;background:#94a3b8"></i></div><span>${before[k].toFixed(2)}</span></div><div class="barrow"><span></span><div class="bar"><i style="width:${100 * after[k] / 2.2}%;background:#12915b"></i></div><span>${after[k].toFixed(2)}</span></div>`).join('') + '<div class="legend"><span><i style="background:#94a3b8"></i>before</span><span><i style="background:#12915b"></i>after</span></div>';
    plot.set([{ name: 'M(t) before', color: '#94a3b8', width: 2.5, f: t => 1 - Math.exp(-t / m0) }, { name: 'M(t) after DFM', color: '#12915b', width: 3, f: t => 1 - Math.exp(-t / m1) }], { axes: { xmax: Math.max(40, 5 * m0) }, });
  }
  const store = { get(k) { try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch (e) { return []; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } } };
  function rules() {
    const saved = new Set(store.get('re-rules')); let idx = 0;
    const mk = arr => arr.map(r => { const i = idx++; return `<label><input type="checkbox" data-rule="${i}" ${saved.has(i) ? 'checked' : ''}><span>${r}</span></label>`; }).join('');
    $('#rules-a').innerHTML = mk(RA); $('#rules-b').innerHTML = mk(RB); cnt();
  }
  function cnt() { const n = $$('[data-rule]').length, c = $$('[data-rule]').filter(x => x.checked).length; $('#rules-count').textContent = `${c} / ${n} rules revised`; }
  card.addEventListener('change', e => { if (e.target.dataset.rule !== undefined) { store.set('re-rules', $$('[data-rule]').filter(x => x.checked).map(x => +x.dataset.rule)); cnt(); } });
  $('#rules-clear').onclick = () => { store.set('re-rules', []); rules(); };
  wire(card, update); rules(); update();
  /* repair vs replace */
  function rr() {
    const dc = V('rr-dc'), a = (V('rr-c1') + V('rr-d1') * dc) / V('rr-l1'), b = (V('rr-c2') + V('rr-d2') * dc) / V('rr-l2');
    setBox('rr-o1', a.toFixed(4), 'repair: cost per operating hour'); setBox('rr-o2', b.toFixed(4), 'replace: cost per operating hour'); setBox('rr-w', a < b ? 'REPAIR' : 'REPLACE', 'cheaper per hour of life', 'hi');
  }
  $$('[id^=rr-]', card).forEach(() => { }); card.addEventListener('input', e => { if ((e.target.id || '').startsWith('rr-') || (e.target.dataset.r || '').startsWith('rr-')) rr(); }); rr();
})();

/* ---------------------------------------------------------------- 5.8 PM */
(function () {
  const card = $('#m5-pm');
  const plot = new Plot($('#pm-plot'), { xmin: 0, xmax: 900, ymin: 0, ymax: 1, xlabel: 'time (h)', ylabel: 'fraction surviving' });
  const Rw = (t, b, e) => Math.exp(-Math.pow(t / e, b));
  function Rpm(t, tau, b, e) { if (!(tau > 0)) return Rw(t, b, e); const m = Math.floor(t / tau + 1e-12); return Math.pow(Rw(tau, b, e), m) * Rw(t - m * tau, b, e); }
  function update() {
    const b = V('pm-b'), e = V('pm-e'), T = V('pm-T'), tau = V('pm-tau'), N = V('pm-N');
    const f0 = N * (1 - Rw(T, b, e)), f1 = N * (1 - Rpm(T, tau, b, e)), cond = Rw(T, b, e) / Rw(tau, b, e);
    setBox('pm-f0', Math.round(f0).toLocaleString(), 'failures, no PM'); setBox('pm-f1', Math.round(f1).toLocaleString(), 'failures, PM every ' + tau + ' h', f1 < f0 ? 'hi' : 'bad'); setBox('pm-sv', (f0 - f1 >= 0 ? '' : '−') + Math.abs(Math.round(f0 - f1)).toLocaleString(), f1 < f0 ? 'saved by PM' : 'PM makes it WORSE (β<1)', f1 < f0 ? 'hi' : 'bad');
    setBox('pm-c', pct(cond, 2), 'R(T)/R(τ): survive to T given τ survived (no replacement)');
    plot.set([{ name: 'no PM', color: '#d23b3b', f: t => Rw(t, b, e) }, { name: 'PM every τ (reset)', color: '#12915b', width: 3, f: t => Rpm(t, tau, b, e) }], { axes: { xmax: Math.max(T * 1.2, 100) }, vlines: [{ x: T, color: '#94a3b8', label: 'T' }] });
  }
  wire(card, update);
  $('#pm-lec').onclick = () => { setV('pm-b', 2); setV('pm-e', 1000); setV('pm-T', 600); setV('pm-tau', 300); setV('pm-N', 10000); update(); };
  update();
})();

/* ---------------------------------------------------------------- 5.9 RAM study */
(function () {
  const sec = $('#m5-ram'), plot = mkPlot('rm-plot', { xlabel: 'time (h)', ylabel: 'system availability A(t)' });
  const choose = (n, r) => { let c = 1; for (let i = 1; i <= r; i++) c = c * (n - r + i) / i; return c; };
  const kn = (n, k, a) => { let s_ = 0; for (let j = k; j <= n; j++) s_ += choose(n, j) * Math.pow(a, j) * Math.pow(1 - a, n - j); return s_; };
  function unit(T, mtbf, mttr) { const tr = []; let t = 0, up = true; while (t < T) { t += up ? rexp(1 / mtbf) : rexp(1 / mttr); tr.push(t); up = !up; } return tr; }
  function pars() { const n = V('rm-n'); let k = V('rm-k'); if (k > n) { k = n; setV('rm-k', k); } return { n, k, mtbf: V('rm-mtbf'), mttr: V('rm-mttr'), T: V('rm-T'), N: V('rm-N'), rate: V('rm-rate') }; }
  function formula() {
    const p = pars(), a = p.mtbf / (p.mtbf + p.mttr), A = kn(p.n, p.k, a);
    setBox('rm-ai', f4(a), 'MTBF/(MTBF+MTTR)'); setBox('rm-as', f4(A), `Σ C(n,j)a^j(1−a)^(n−j), j ≥ ${p.k}`, 'hi'); setBox('rm-dt', nice((1 - A) * 8760) + ' h', 'per year'); setBox('rm-prod', nice(A * p.rate * p.T), `A × rate × T (${p.rate}/h, ${p.T} h)`);
    const rows = [['baseline', p.n, p.k, p.mtbf, p.mttr], ['MTBF +25 % (reliability)', p.n, p.k, p.mtbf * 1.25, p.mttr], ['MTTR −25 % (maintainability)', p.n, p.k, p.mtbf, p.mttr * 0.75], ['one extra unit (n + 1)', p.n + 1, p.k, p.mtbf, p.mttr]];
    el('rm-tbl').innerHTML = '<tr><th>alternative</th><th>n / k</th><th>MTBF</th><th>MTTR</th><th>unit A<sub>i</sub></th><th>system A</th><th>downtime h/yr</th></tr>' + rows.map(r => { const a_ = r[3] / (r[3] + r[4]), A_ = kn(r[1], r[2], a_); return `<tr><td>${r[0]}</td><td>${r[1]} / ${r[2]}</td><td>${nice(r[3])}</td><td>${nice(r[4])}</td><td>${a_.toFixed(4)}</td><td><b>${A_.toFixed(4)}</b></td><td>${nice((1 - A_) * 8760)}</td></tr>`; }).join('');
    return { p, a, A };
  }
  function run() {
    const { p, A } = formula(), G = 200, acc = new Array(G).fill(0); let tot = 0; const per = [];
    for (let r = 0; r < p.N; r++) {
      const u = []; for (let i = 0; i < p.n; i++) u.push(unit(p.T, p.mtbf, p.mttr)); const ptr = new Array(p.n).fill(0); let up = 0;
      for (let g = 0; g < G; g++) { const x = (g + 0.5) * p.T / G; let c = 0; for (let i = 0; i < p.n; i++) { while (ptr[i] < u[i].length && u[i][ptr[i]] <= x) ptr[i]++; if (ptr[i] % 2 === 0) c++; } if (c >= p.k) { acc[g]++; up++; } }
      per.push(up / G); tot += up / G;
    }
    const A_hat = tot / p.N, sd = Math.sqrt(per.reduce((s_, v) => s_ + (v - A_hat) ** 2, 0) / Math.max(1, p.N - 1)), se = sd / Math.sqrt(p.N);
    setBox('rm-sim', f4(A_hat), `mean over ${p.N} runs (all units start up)`, 'hi'); setBox('rm-se', f4(se), 'sd of run availability / √N');
    plot.set([{ name: 'Monte Carlo A(t)', color: '#2457d6', pts: acc.map((c, g) => [(g + 0.5) * p.T / G, c / p.N]) }, { name: `steady state ${A.toFixed(4)}`, color: '#12915b', dash: [5, 4], f: () => A }], { axes: { xmin: 0, xmax: p.T, ymin: Math.max(0, Math.min(A, A_hat) - 0.1), ymax: 1.005 } });
  }
  wire(sec, formula);
  const S = (n, k, mb, mt) => { setV('rm-n', n); setV('rm-k', k); setV('rm-mtbf', mb); setV('rm-mttr', mt); run(); };
  on('rm-single', 'click', () => S(1, 1, 500, 20)); on('rm-par', 'click', () => S(2, 1, 500, 20)); on('rm-ser', 'click', () => S(2, 2, 500, 20)); on('rm-run', 'click', run);
  formula(); run();
})();

/* ---------------------------------------------------------------- 5.10 Monte Carlo */
(function () {
  const sec = $('#m5-mc'), pF = mkPlot('mcx-pF', { xlabel: 't (h)', ylabel: 'F(t) — U read on this axis' }), pH = mkPlot('mcx-pH', { xlabel: 't (h)', ylabel: 'density' });
  let samples = [], last = null;
  const inv = (u, b, e, g) => g + e * Math.pow(-Math.log(1 - u), 1 / b);
  const choose = (n, r) => { let c = 1; for (let i = 1; i <= r; i++) c = c * (n - r + i) / i; return c; };
  function draw() {
    const b = V('mcx-b'), e = V('mcx-e'), g = V('mcx-g'), D = DIST.weibull({ b, e, g }), u = V('mcx-u'), t = inv(u, b, e, g), tm = g + e * Math.max(2.5, Math.pow(5, 1 / b) * 1.5);
    setBox('mcx-t', nice(t), `γ + η[−ln(1−${u.toFixed(3)})]^(1/β)`, 'hi'); setBox('mcx-cnt', String(samples.length), 'stored lifetimes'); setBox('mcx-mttf', nice(g + e * gammaFn(1 + 1 / b)), 'γ + ηΓ(1+1/β)');
    setBox('mcx-mean', samples.length ? nice(samples.reduce((s_, v) => s_ + v, 0) / samples.length) : '—', samples.length ? 'average of drawn lifetimes' : 'draw some lifetimes');
    const shown = samples.slice(-60).map(v => [v, D.F(v)]);
    pF.set([{ name: 'F(t)', color: '#d98200', f: D.F }, { name: 'path: U → t', color: '#d23b3b', pts: [[0, u], [t, u], [t, 0]] }, { name: 'drawn lifetimes', color: '#2457d6', dots: true, nolines: true, pts: shown }], { axes: { xmin: 0, xmax: tm, ymin: 0, ymax: 1 }, marks: [{ x: t, y: u, label: 't', color: '#d23b3b' }] });
    const bins = 24, w = tm / bins, cnt = new Array(bins).fill(0); samples.forEach(v => { const i = Math.floor(v / w); if (i >= 0 && i < bins) cnt[i]++; });
    const N = Math.max(1, samples.length), fm = Math.max(...cnt.map(c => c / N / w), 1e-9);
    let fmax = 0; for (let i = 1; i <= 200; i++) { const v = D.f(g + (tm - g) * i / 200); if (isFinite(v)) fmax = Math.max(fmax, v); }
    pH.set([{ name: 'histogram of drawn lifetimes', color: '#94a3b8', bars: true, bw: w * 0.92, pts: cnt.map((c, i) => [(i + 0.5) * w, c / N / w]) }, { name: 'true f(t)', color: '#2457d6', f: x => { const v = D.f(x); return isFinite(v) ? v : 0; } }], { axes: { xmin: 0, xmax: tm, ymin: 0, ymax: Math.min(Math.max(fm, fmax) * 1.1, 12 / e) } });
  }
  const add = n => { const b = V('mcx-b'), e = V('mcx-e'), g = V('mcx-g'); let u = 0; for (let i = 0; i < n; i++) { u = Math.min(0.999, Math.max(0.001, Math.random())); samples.push(inv(u, b, e, g)); } if (n) setV('mcx-u', +u.toFixed(3)); draw(); };
  wire(sec, e => { if (e && e.target && /mcx-[beg]/.test(e.target.id + (e.target.dataset.r || ''))) samples = []; draw(); });
  on('mcx-1', 'click', () => add(1)); on('mcx-10', 'click', () => add(10)); on('mcx-1k', 'click', () => add(1000)); on('mcx-clr', 'click', () => { samples = []; draw(); });
  const L = (b, e, g) => { setV('mcx-b', b); setV('mcx-e', e); setV('mcx-g', g); samples = []; draw(); };
  on('mcx-exp', 'click', () => L(1, 1000, 0)); on('mcx-w', 'click', () => L(2, 1000, 0)); on('mcx-w3', 'click', () => L(2, 1000, 300));
  function sys() {
    const b = V('mcx-b'), e = V('mcx-e'), g = V('mcx-g'), n = V('mcx-n'); let k = V('mcx-k'); if (k > n) { k = n; setV('mcx-k', k); } const tm = V('mcx-tm'), N = V('mcx-N'), r = DIST.weibull({ b, e, g }).R(tm); let ok = 0;
    for (let i = 0; i < N; i++) { let c = 0; for (let j = 0; j < n; j++) if (inv(Math.random(), b, e, g) > tm) c++; if (c >= k) ok++; }
    let ex = 0; for (let j = k; j <= n; j++) ex += choose(n, j) * Math.pow(r, j) * Math.pow(1 - r, n - j);
    const ph = ok / N, se = Math.sqrt(Math.max(ph * (1 - ph), 1e-12) / N);
    setBox('mcx-R', f4(ph), `${ok} of ${N} trials survived`, 'hi'); setBox('mcx-Rx', f4(ex), `unit R(${tm}) = ${r.toFixed(4)}`); setBox('mcx-se', f4(se), 'error ≈ 1/√N'); setBox('mcx-ok', Math.abs(ph - ex) <= 2 * se + 1e-9 ? 'yes' : 'no (rare)', '|R̂ − R| ≤ 2·se', Math.abs(ph - ex) <= 2 * se + 1e-9 ? 'good' : '');
  }
  on('mcx-run', 'click', sys); sec.addEventListener('input', e => { if (/mcx-(n|k|tm|N)/.test(e.target.id + (e.target.dataset.r || ''))) { /* manual run only */ } });
  setV('mcx-u', 0.632); draw();
})();

})();
