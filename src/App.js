
import { useState, useEffect } from "react";

const B = "#5478FF";
// const API = "http://localhost:5000/api";
const API = "https://rajpandith-healthsuggestionnodejsbackend.hf.space/api";
const themeCss = `:root{--bg:#F5F7FB;--bg2:#FFFFFF;--card:#FFFFFF;--cardH:#F0F3FF;--accent:${B};--warm:#D97706;--red:#DC2626;--green:#16A34A;--purple:#7C3AED;--t1:#0F172A;--t2:#475569;--t3:#94A3B8;--bdr:rgba(0,0,0,0.08);--bdrA:rgba(84,120,255,0.25);--glow:rgba(84,120,255,0.06);--shd:0 2px 12px rgba(0,0,0,0.06);--inp:rgba(0,0,0,0.03)}`;
const baseCss = `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}input::placeholder{color:var(--t3)}select option{background:var(--card)}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:rgba(84,120,255,0.15);border-radius:3px}@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse{0%,100%{opacity:.5}50%{opacity:1}}@media(max-width:768px){header>div{flex-wrap:wrap!important;gap:6px!important}main{padding:12px!important}main>div{display:flex!important;flex-direction:column!important;gap:12px!important}aside{position:relative!important;top:auto!important;width:100%!important}div[style*="gridTemplateColumns"]{grid-template-columns:1fr!important}footer>div{flex-direction:column!important;text-align:center!important;gap:4px!important}}`;
const ff = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif";

// ─── Storage helpers (works everywhere: localStorage, window.storage, or memory) ───
let _mem = {};
function ls(k, v) {
  if (arguments.length === 1) {
    try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : null; }
    catch { return _mem[k] || null; }
  }
  try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); }
  catch { if (v === null) delete _mem[k]; else _mem[k] = v; }
}

// ─── Backend API call ───
async function api(path, opts = {}) {
  const tk = ls("hs_token");
  try {
    const r = await fetch(API + path, { ...opts, headers: { "Content-Type": "application/json", ...(tk ? { "Authorization": "Bearer " + tk } : {}) } });
    return await r.json();
  } catch { return { success: false, error: "offline" }; }
}

const DEFAULT_PLANS = [
  { id: "hdfc", name: "HDFC ERGO Optima Secure", ins: "HDFC ERGO", logo: "🏛️", csr: 97.1, rat: 4.6, si: [5e5, 2e7], bp: { a25: 6800, a35: 9500, a45: 16200, a55: 28500, a65: 52000 }, room: "No Limit", copay: "None", ped: 3, hosp: 13000, feat: ["4X coverage multiplier", "Consumables covered (68+)", "AYUSH treatments", "Home healthcare", "Organ donor cover", "Daycare procedures"], adds: ["PED wait reduction", "Unlimited restoration", "OPD cover", "Hospital cash", "Maternity"], best: "Comprehensive coverage seekers", type: ["individual", "family_floater"], pp: "60/180d", rest: "100% once", ncb: "50%/yr up to 100%", tag: "Most Reliable", src: "policybazaar.com", on: true, url: "https://www.hdfcergo.com/health-insurance/optima-secure" },
  { id: "birla", name: "Aditya Birla Activ One Max", ins: "Aditya Birla Health", logo: "🌿", csr: 95.8, rat: 4.5, si: [5e5, 2e7], bp: { a25: 7200, a35: 10200, a45: 17500, a55: 30000, a65: 55000 }, room: "No Limit", copay: "None", ped: 3, hosp: 10500, feat: ["Unlimited restoration", "100% HealthReturns", "Cumulative bonus 100%/yr", "Wellness rewards", "AYUSH cover"], adds: ["PED wait reduction", "OPD cover", "Air ambulance", "Gym membership"], best: "Health-conscious families", type: ["individual", "family_floater"], pp: "60/180d", rest: "Unlimited", ncb: "100%/yr up to 500%", tag: "Best NCB", src: "joinditto.in", on: true, url: "https://www.adityabirlahealthinsurance.com/health-insurance-plans/activ-one-max" },
  { id: "care", name: "Care Supreme", ins: "Care Health Insurance", logo: "💙", csr: 94.2, rat: 4.3, si: [5e5, 6e7], bp: { a25: 5500, a35: 7800, a45: 13500, a55: 24000, a65: 44000 }, room: "No Limit", copay: "None", ped: 3, hosp: 9200, feat: ["Wide customizable coverage", "No disease sub-limits", "Consumables covered", "Flexible add-ons", "AYUSH treatments"], adds: ["PED wait reduction", "Unlimited restoration", "OPD", "Hospital cash", "Maternity", "Air ambulance"], best: "Budget-conscious with flexibility", type: ["individual", "family_floater"], pp: "60/120d", rest: "100% once", ncb: "50%/yr up to 100%", tag: "Best Value", src: "beshak.org", on: true, url: "https://www.careinsurance.com/health-insurance/care-supreme" },
  { id: "niva", name: "Niva Bupa ReAssure 2.0", ins: "Niva Bupa", logo: "🛡️", csr: 91.9, rat: 4.2, si: [5e5, 1.5e7], bp: { a25: 5800, a35: 8200, a45: 14000, a55: 25500, a65: 46000 }, room: "No Limit", copay: "None", ped: 3, hosp: 8500, feat: ["Unlimited restoration", "Age lock feature", "Cumulative bonus", "No sub-limits", "Wellness benefits"], adds: ["PED wait reduction", "OPD cover", "Hospital cash", "Maternity"], best: "Long-term premium stability", type: ["individual", "family_floater"], pp: "60/180d", rest: "Unlimited", ncb: "50%/yr up to 100%", tag: "Stable Premiums", src: "nivabupa.com", on: true, url: "https://www.nivabupa.com/health-insurance-plans/reassure-2.html" },
  { id: "star", name: "Star Comprehensive", ins: "Star Health", logo: "⭐", csr: 89.5, rat: 4.1, si: [5e5, 1e7], bp: { a25: 5200, a35: 7400, a45: 12800, a55: 23000, a65: 42000 }, room: "No Limit", copay: "None", ped: 3, hosp: 14200, feat: ["Largest hospital network", "Automatic recharge", "Modern treatment cover", "Bariatric surgery", "AYUSH cover"], adds: ["PED wait reduction", "OPD cover", "Hospital cash"], best: "Wide hospital access", type: ["individual", "family_floater"], pp: "60/120d", rest: "100% once", ncb: "25%/yr up to 100%", tag: "Largest Network", src: "starhealth.in", on: true, url: "https://www.starhealth.in/health-insurance/comprehensive" },
  { id: "bajaj", name: "Bajaj Allianz Health Guard", ins: "Bajaj Allianz", logo: "🔷", csr: 90.2, rat: 4.0, si: [2e5, 5e7], bp: { a25: 4800, a35: 6800, a45: 11500, a55: 21000, a65: 39000 }, room: "1% of SI", copay: "None", ped: 4, hosp: 9800, feat: ["Modular plan design", "OPD benefit 2X", "International cover", "Customizable", "Quick claims"], adds: ["Critical illness", "Personal accident", "Hospital cash", "Maternity"], best: "Self-employed & freelancers", type: ["individual", "family_floater"], pp: "60/90d", rest: "100% once", ncb: "50%/yr up to 100%", tag: "Most Customizable", src: "bajajallianz.com", on: true, url: "https://www.bajajallianz.com/health-insurance/health-guard.html" },
  { id: "manipal", name: "ManipalCigna Prime Senior", ins: "ManipalCigna", logo: "🏥", csr: 88.7, rat: 4.0, si: [2e5, 2.5e6], bp: { a25: 0, a35: 0, a45: 0, a55: 22000, a65: 38000 }, room: "1% of SI", copay: "10-20%", ped: 2, hosp: 8000, feat: ["2-year PED waiting", "Free health check-ups", "Up to 35% discount", "Domiciliary hospitalization", "AYUSH cover"], adds: ["Critical illness", "Hospital cash"], best: "Senior citizens (60+)", type: ["individual", "senior_citizen"], pp: "30/60d", rest: "50% once", ncb: "10%/yr up to 50%", tag: "Best for Seniors", src: "manipalcigna.com", on: true, url: "https://www.manipalcigna.com/prime-senior" },
  { id: "icici", name: "ICICI Lombard Elevate", ins: "ICICI Lombard", logo: "🌐", csr: 92.3, rat: 4.3, si: [5e5, 3e7], bp: { a25: 7500, a35: 10800, a45: 18200, a55: 32000, a65: 58000 }, room: "No Limit", copay: "None", ped: 2, hosp: 8800, feat: ["Global cover option", "High-end diagnostics OPD", "Compassionate travel", "2-year PED wait", "Consumables covered"], adds: ["Global treatment", "OPD cover", "Maternity", "Air ambulance"], best: "Frequent travelers", type: ["individual", "family_floater"], pp: "60/180d", rest: "100% twice", ncb: "50%/yr up to 150%", tag: "Global Cover", src: "icicilombard.com", on: true, url: "https://www.icicilombard.com/health-insurance/elevate" },
  { id: "tata", name: "Tata AIA Pro-Fit", ins: "Tata AIA", logo: "🔰", csr: 93.1, rat: 4.1, si: [5e5, 1e7], bp: { a25: 6200, a35: 8800, a45: 15000, a55: 27000, a65: 49000 }, room: "No Limit", copay: "None", ped: 3, hosp: 7500, feat: ["Market-linked returns", "Holistic well-being", "Health+Investment", "Wealth generation", "AYUSH cover"], adds: ["Critical illness", "Hospital cash", "Personal accident"], best: "Investment-focused", type: ["individual", "family_floater"], pp: "60/120d", rest: "100% once", ncb: "25%/yr up to 100%", tag: "Health+Wealth", src: "tataaia.com", on: true, url: "https://www.tataaia.com/health-insurance/pro-fit.html" },
  { id: "digit", name: "Go Digit Health Insurance", ins: "Go Digit", logo: "📱", csr: 87.5, rat: 3.9, si: [2e5, 2.5e6], bp: { a25: 4200, a35: 5900, a45: 10200, a55: 19000, a65: 35000 }, room: "1% of SI", copay: "None", ped: 3, hosp: 6800, feat: ["Digital-first experience", "Fast online claims", "No medical tests <45", "Simple docs", "AYUSH cover"], adds: ["PED wait reduction", "Hospital cash", "Critical illness"], best: "Young professionals", type: ["individual", "family_floater"], pp: "60/90d", rest: "100% once", ncb: "50%/yr up to 100%", tag: "Digital First", src: "godigit.com", on: true, url: "https://www.godigit.com/health-insurance" }
];

function doRec(plans, p) { const { age, salary, familySize: fs, preExisting: pe, priorities: pr, city } = p; const ai = salary * 12; let si = ai <= 5e5 ? 5e5 : ai <= 1e6 ? 1e6 : ai <= 2e6 ? 1.5e6 : ai <= 5e6 ? 2.5e6 : 5e6; if (city === "metro") si = Math.max(si, 1.5e6); if (fs > 3) si = Math.round(si * 1.3); return plans.filter(x => x.on).map(pl => { let s = 50; const w = []; const k = age <= 25 ? "a25" : age <= 35 ? "a35" : age <= 45 ? "a45" : age <= 55 ? "a55" : "a65"; const bp = pl.bp?.[k] || 0; if (!bp) return null; const ep = Math.round(bp * (fs > 1 ? 1 + (fs - 1) * 0.35 : 1)); if (age >= 60 && pl.type?.includes("senior_citizen")) { s += 20; w.push("For seniors"); } if (age < 35 && bp < 6000) { s += 10; w.push("Affordable for young"); } if (fs > 1 && pl.type?.includes("family_floater")) { s += 15; w.push("Family floater"); } if (fs >= 4 && pl.rest === "Unlimited") { s += 10; w.push("Unlimited restore"); } if (pe && pl.ped <= 2) { s += 15; w.push("Short PED (" + pl.ped + "yr)"); } if (pe && pl.adds?.includes("PED wait reduction")) { s += 8; w.push("PED reduction"); } if (ai > 0) { const af = (ep / ai) * 100; if (af < 2) s += 10; if (af > 5) s -= 15; } if (pl.csr > 95) { s += 10; w.push("Excellent CSR"); } else if (pl.csr > 90) s += 6; if (pr?.includes("network") && pl.hosp > 10000) { s += 12; w.push("Large network"); } if (pr?.includes("premium") && ep < 10000) { s += 12; w.push("Low premium"); } if (pr?.includes("coverage") && pl.room === "No Limit") { s += 12; w.push("Max coverage"); } if (pr?.includes("restoration") && pl.rest === "Unlimited") { s += 12; w.push("Unlimited restore"); } return { ...pl, score: Math.min(100, Math.max(0, Math.round(s))), ep, rsi: si, w }; }).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 5); }
const fmt = n => { if (n >= 1e7) return "₹" + (n / 1e7).toFixed(n % 1e7 === 0 ? 0 : 1) + " Cr"; if (n >= 1e5) return "₹" + (n / 1e5).toFixed(n % 1e5 === 0 ? 0 : 1) + " L"; return "₹" + n.toLocaleString("en-IN"); };

function Ring({ v, sz = 52, c }) { const r = (sz - 3.5) / 2, ci = 2 * Math.PI * r, o = ci - (v / 100) * ci; return (<svg width={sz} height={sz} style={{ transform: "rotate(-90deg)" }}><circle cx={sz / 2} cy={sz / 2} r={r} fill="none" stroke="var(--bdr)" strokeWidth={3.5} /><circle cx={sz / 2} cy={sz / 2} r={r} fill="none" stroke={c} strokeWidth={3.5} strokeDasharray={ci} strokeDashoffset={o} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.8s" }} /><text x={sz / 2} y={sz / 2} textAnchor="middle" dominantBaseline="central" fill={c} fontSize={sz * 0.22} fontWeight="700" style={{ transform: "rotate(90deg)", transformOrigin: "center" }}>{v}%</text></svg>); }
function Inp({ label, type = "text", value, onChange, ph, icon }) { return (<div style={{ marginBottom: 14 }}>{label && <label style={{ display: "block", marginBottom: 5, fontSize: 11, fontWeight: 600, color: "var(--t3)", letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</label>}<div style={{ position: "relative" }}>{icon && <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", fontSize: 15 }}>{icon}</span>}<input type={type} value={value} onChange={e => onChange(type === "number" ? Number(e.target.value) : e.target.value)} placeholder={ph} style={{ width: "100%", padding: icon ? "10px 12px 10px 36px" : "10px 12px", background: "var(--inp)", border: "1px solid var(--bdr)", borderRadius: 8, color: "var(--t1)", fontSize: 13, fontFamily: ff, outline: "none", boxSizing: "border-box" }} /></div></div>); }
function Tag({ children, filled }) { return <span style={{ display: "inline-flex", padding: "2px 9px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: filled ? B : "transparent", color: filled ? "#fff" : B, border: "1px solid " + B }}>{children}</span>; }

function PCard({ pl, prof, onCmp, isCmp, onSel }) { const k = (prof?.age || 30) <= 25 ? "a25" : (prof?.age || 30) <= 35 ? "a35" : (prof?.age || 30) <= 45 ? "a45" : (prof?.age || 30) <= 55 ? "a55" : "a65"; const prem = pl.ep || (pl.bp?.[k] ? Math.round(pl.bp[k] * ((prof?.familySize || 1) > 1 ? 1 + ((prof?.familySize || 1) - 1) * 0.35 : 1)) : null); const sc = pl.score || Math.round(pl.csr); const scc = sc > 80 ? "var(--green)" : sc > 60 ? "var(--warm)" : "var(--red)"; const [h, setH] = useState(false); return (<div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={() => onSel(pl)} style={{ background: h ? "var(--cardH)" : "var(--card)", border: pl.bestValue ? "2px solid var(--green)" : "1px solid " + (h ? "var(--bdrA)" : "var(--bdr)"), borderRadius: 14, padding: 20, cursor: "pointer", transition: "all 0.25s", boxShadow: h ? "var(--shd)" : pl.bestValue ? "0 0 20px rgba(22,163,106,0.12)" : "none", transform: h ? "translateY(-2px)" : "none", position: "relative" }}>{pl.src && <div style={{ position: "absolute", top: 12, right: 12, display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", animation: "pulse 2s infinite" }} /><span style={{ fontSize: 9, color: "var(--t3)", fontWeight: 600 }}>LIVE</span></div>}<div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}><div style={{ width: 44, height: 44, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", background: B + "18", fontSize: 22 }}>{pl.logo}</div><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 15, fontWeight: 700, color: "var(--t1)", lineHeight: 1.3 }}>{pl.name}</div><div style={{ fontSize: 11, color: "var(--t3)" }}>{pl.ins}</div></div></div><div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}><Ring v={sc} c={scc} /><div style={{ textAlign: "right" }}><div style={{ fontSize: 10, color: "var(--t3)" }}>EST. PREMIUM/YR</div><div style={{ fontSize: 20, fontWeight: 700, color: B }}>{prem ? fmt(prem) : "N/A"}</div>{pl.ep5 > 0 && <div style={{ fontSize: 10, color: "var(--t3)", marginTop: 2 }}>~{fmt(pl.ep5)} / 5yr</div>}</div></div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 12 }}>{[{ l: "CSR", v: pl.csr + "%" }, { l: "Hospitals", v: (pl.hosp || 0).toLocaleString() }, { l: "Room Rent", v: pl.room }, { l: "PED Wait", v: pl.ped + "yr" }].map((s, i) => (<div key={i} style={{ background: "var(--inp)", borderRadius: 7, padding: "5px 9px" }}><div style={{ fontSize: 9, color: "var(--t3)" }}>{s.l}</div><div style={{ fontSize: 12, fontWeight: 600, color: "var(--t1)" }}>{s.v}</div></div>))}</div><div style={{ marginBottom: 12, display: "flex", gap: 6, flexWrap: "wrap" }}><Tag filled>{pl.tag}</Tag>{pl.bestValue && <Tag filled>{"\u2705 Best Value"}</Tag>}</div><div style={{ display: "flex", gap: 8 }}><button onClick={e => { e.stopPropagation(); onCmp(pl.id); }} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "1px solid " + (isCmp ? B : "var(--bdr)"), background: isCmp ? "var(--glow)" : "transparent", color: isCmp ? B : "var(--t3)", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: ff }}>{isCmp ? "✓ Comparing" : "Compare"}</button><button onClick={e => { e.stopPropagation(); onSel(pl); }} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", background: B, color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: ff }}>View Details</button></div></div>); }

function Det({ pl, prof, onBack }) { const k = (prof?.age || 30) <= 25 ? "a25" : (prof?.age || 30) <= 35 ? "a35" : (prof?.age || 30) <= 45 ? "a45" : (prof?.age || 30) <= 55 ? "a55" : "a65"; const prem = pl.ep || (pl.bp?.[k] ? Math.round(pl.bp[k] * ((prof?.familySize || 1) > 1 ? 1 + ((prof?.familySize || 1) - 1) * 0.35 : 1)) : null); const tx = prem ? Math.min((prof?.age || 30) >= 60 ? 50000 : 25000, prem) : 0; return (<div><button onClick={onBack} style={{ background: "none", border: "none", color: B, fontSize: 13, cursor: "pointer", fontWeight: 600, marginBottom: 16, fontFamily: ff }}>← Back</button><div style={{ background: "var(--card)", borderRadius: 14, padding: 28, border: "1px solid var(--bdr)" }}><div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, flexWrap: "wrap" }}><div style={{ width: 60, height: 60, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", background: B + "18", fontSize: 30 }}>{pl.logo}</div><div style={{ flex: 1, minWidth: 200 }}><div style={{ fontSize: 22, fontWeight: 700, color: "var(--t1)" }}>{pl.name}</div><div style={{ fontSize: 13, color: "var(--t3)" }}>{pl.ins} · CSR: {pl.csr}% · ⭐ {pl.rat}/5</div></div><div style={{ textAlign: "right" }}><div style={{ fontSize: 11, color: "var(--t3)" }}>Est. Annual Premium</div><div style={{ fontSize: 28, fontWeight: 700, color: B }}>{prem ? fmt(prem) : "N/A"}</div>{prem && <div style={{ fontSize: 12, color: "var(--green)" }}>Effective: {fmt(prem - tx)}/yr (80D)</div>}{pl.ep5 > 0 && <div style={{ fontSize: 11, color: "var(--t3)", marginTop: 2 }}>~{fmt(pl.ep5)} est. for 5 years</div>}{pl.bestValue && <div style={{ display: "inline-block", marginTop: 6, padding: "3px 10px", borderRadius: 20, background: "var(--green)", color: "#fff", fontSize: 10, fontWeight: 700 }}>✅ BEST VALUE</div>}</div></div><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginBottom: 24 }}>{[{ i: "🏥", l: "Hospitals", v: (pl.hosp || 0).toLocaleString() }, { i: "🛏️", l: "Room Rent", v: pl.room }, { i: "💰", l: "Co-Pay", v: pl.copay }, { i: "⏳", l: "PED Wait", v: pl.ped + " yrs" }, { i: "🔄", l: "Restoration", v: pl.rest }, { i: "📈", l: "NCB", v: pl.ncb }, { i: "📋", l: "Pre/Post", v: pl.pp }, { i: "💎", l: "Sum Insured", v: fmt(pl.si?.[0] || 5e5) + " – " + fmt(pl.si?.[1] || 1e7) }].map((x, i) => (<div key={i} style={{ background: "var(--inp)", borderRadius: 10, padding: 14, border: "1px solid var(--bdr)" }}><div style={{ fontSize: 18, marginBottom: 4 }}>{x.i}</div><div style={{ fontSize: 9, color: "var(--t3)", textTransform: "uppercase", marginBottom: 3 }}>{x.l}</div><div style={{ fontSize: 13, fontWeight: 700, color: "var(--t1)" }}>{x.v}</div></div>))}</div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}><div><h3 style={{ fontSize: 13, fontWeight: 700, color: B, marginBottom: 10, textTransform: "uppercase" }}>Features</h3>{(pl.feat || []).map((f, i) => <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}><span style={{ color: "var(--green)" }}>✓</span><span style={{ fontSize: 12, color: "var(--t2)" }}>{f}</span></div>)}</div><div><h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--warm)", marginBottom: 10, textTransform: "uppercase" }}>Add-Ons</h3>{(pl.adds || []).map((a, i) => <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}><span style={{ color: "var(--warm)" }}>+</span><span style={{ fontSize: 12, color: "var(--t2)" }}>{a}</span></div>)}</div></div>{pl.w?.length > 0 && <div style={{ marginTop: 20, padding: 16, background: "var(--glow)", borderRadius: 12, border: "1px solid var(--bdrA)" }}><div style={{ fontSize: 13, fontWeight: 700, color: B, marginBottom: 8 }}>⚡ AI Analysis — Why this plan suits you</div>{pl.w.map((r, i) => <div key={i} style={{ fontSize: 12, color: "var(--t2)", marginBottom: 4 }}>• {r}</div>)}</div>}{pl.url && <a href={pl.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", marginTop: 20, padding: "16px 0", borderRadius: 12, background: B, color: "#fff", fontSize: 15, fontWeight: 700, textAlign: "center", textDecoration: "none", fontFamily: ff, boxShadow: "0 4px 16px rgba(84,120,255,0.3)", cursor: "pointer" }}>🔗 Visit Policy Website →</a>}</div></div>); }

function Cmp({ plans }) { if (plans.length < 2) return <div style={{ textAlign: "center", padding: 60, color: "var(--t3)" }}><div style={{ fontSize: 40, marginBottom: 12 }}>⚖️</div>Select 2+ plans to compare</div>; const R = [{ l: "Insurer", k: p => p.ins }, { l: "CSR", k: p => p.csr + "%" }, { l: "Rating", k: p => p.rat + "/5" }, { l: "Room Rent", k: p => p.room }, { l: "Co-Pay", k: p => p.copay }, { l: "PED", k: p => p.ped + "yr" }, { l: "Hospitals", k: p => (p.hosp || 0).toLocaleString() }, { l: "Restoration", k: p => p.rest }, { l: "NCB", k: p => p.ncb }, { l: "Best For", k: p => p.best }]; return (<div style={{ overflowX: "auto", borderRadius: 14, border: "1px solid var(--bdr)" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: ff }}><thead><tr><th style={{ position: "sticky", left: 0, background: "var(--bg2)", padding: 12, textAlign: "left", color: "var(--t3)", fontSize: 10, textTransform: "uppercase", borderBottom: "1px solid var(--bdr)", zIndex: 2, minWidth: 100 }}>Feature</th>{plans.map(p => <th key={p.id} style={{ padding: 12, textAlign: "center", borderBottom: "1px solid var(--bdr)", background: "var(--bg2)", minWidth: 140 }}><div style={{ fontSize: 18 }}>{p.logo}</div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--t1)", marginTop: 4 }}>{p.name}</div></th>)}</tr></thead><tbody>{R.map((r, i) => <tr key={i}><td style={{ position: "sticky", left: 0, background: i % 2 ? "var(--card)" : "var(--bg2)", padding: "9px 12px", fontWeight: 600, color: "var(--t2)", borderBottom: "1px solid var(--bdr)", zIndex: 1 }}>{r.l}</td>{plans.map(p => <td key={p.id} style={{ padding: "9px 12px", textAlign: "center", color: "var(--t1)", borderBottom: "1px solid var(--bdr)", background: i % 2 ? "var(--card)" : "transparent" }}>{r.k(p)}</td>)}</tr>)}</tbody></table></div>); }

function Rsk({ prof, recs }) { const rl = prof.age > 55 ? "High" : prof.age > 40 ? "Moderate" : "Low"; const rc = rl === "High" ? "var(--red)" : rl === "Moderate" ? "var(--warm)" : "var(--green)"; const rs = rl === "High" ? 85 : rl === "Moderate" ? 55 : 25; const ai = (prof.salary || 0) * 12; const top = recs[0]; const ep = top?.ep || 0; const tb = Math.min(prof.age >= 60 ? 50000 : 25000, ep); return (<div style={{ display: "grid", gap: 16 }}><div style={{ background: "var(--card)", borderRadius: 14, padding: 24, border: "1px solid var(--bdr)" }}><h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--t1)", marginBottom: 16 }}>Risk Assessment</h3><div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}><Ring v={rs} sz={72} c={rc} /><div style={{ flex: 1 }}>{[{ l: "Age", v: rl }, { l: "Family", v: prof.familySize > 3 ? "Higher cover" : "Standard" }, { l: "Pre-existing", v: prof.preExisting ? "Yes" : "None" }, { l: "City", v: prof.city === "metro" ? "Metro" : "Non-metro" }].map((r, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}><span style={{ fontSize: 12, color: "var(--t2)" }}>{r.l}</span><span style={{ fontSize: 12, fontWeight: 600, color: "var(--t1)" }}>{r.v}</span></div>)}</div></div></div><div style={{ background: "var(--card)", borderRadius: 14, padding: 24, border: "1px solid var(--bdr)" }}><h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--t1)", marginBottom: 16 }}>Coverage Recommendation</h3><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 12 }}>{[{ i: "🎯", l: "Recommended SI", v: top ? fmt(top.rsi) : "₹10L" }, { i: "💳", l: "Annual Premium", v: ep ? fmt(ep) : "N/A" }, { i: "📅", l: "Monthly", v: ep ? fmt(Math.round(ep / 12)) : "N/A" }, { i: "🧾", l: "Tax 80D", v: fmt(tb) }, { i: "💰", l: "Effective", v: ep ? fmt(ep - tb) : "N/A" }, { i: "📊", l: "% Income", v: ai > 0 ? ((ep / ai) * 100).toFixed(1) + "%" : "N/A" }].map((x, i) => (<div key={i} style={{ background: "var(--inp)", borderRadius: 10, padding: 14, textAlign: "center" }}><div style={{ fontSize: 22, marginBottom: 4 }}>{x.i}</div><div style={{ fontSize: 9, color: "var(--t3)", textTransform: "uppercase", marginBottom: 3 }}>{x.l}</div><div style={{ fontSize: 15, fontWeight: 700, color: B }}>{x.v}</div></div>))}</div></div></div>); }

// ─── CHATBOT (via backend proxy) ───
function Chatbot({ currentUser }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ role: "assistant", content: "Hi! I'm your health insurance assistant. Ask me anything about health insurance plans, coverage, premiums, or claims. How can I help you today?" }]);
  const [inp, setInp] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!inp.trim() || loading) return;
    const userMsg = { role: "user", content: inp.trim() };
    const updated = [...msgs, userMsg];
    setMsgs(updated); setInp(""); setLoading(true);
    try {
      const r = await fetch(API + "/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: updated.slice(-10), userName: currentUser?.name || "Guest", userEmail: currentUser?.email || "" }) });
      const data = await r.json();
      const reply = data.success ? data.reply : "Sorry, I couldn't process that. Please try again.";
      setMsgs(m => [...m, { role: "assistant", content: reply }]);
    } catch { setMsgs(m => [...m, { role: "assistant", content: "I'm having trouble connecting. Please check if the backend is running." }]); }
    setLoading(false);
  };

  if (!open) return (<button onClick={() => setOpen(true)} style={{ position: "fixed", bottom: 80, right: 24, width: 56, height: 56, borderRadius: 16, border: "none", background: B, color: "#fff", fontSize: 24, cursor: "pointer", boxShadow: "0 8px 32px rgba(84,120,255,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s" }} onMouseEnter={e => e.target.style.transform = "scale(1.1)"} onMouseLeave={e => e.target.style.transform = "scale(1)"}>💬</button>);

  return (<div style={{ position: "fixed", bottom: 80, right: 24, width: 380, height: 520, borderRadius: 16, background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 16px 48px rgba(0,0,0,0.15)", zIndex: 1000, display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: ff }}>
    <div style={{ padding: "14px 18px", background: B, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>💬</div><div><div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>PolicyDoctor Assistant</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>Powered by AI</div></div></div>
      <button onClick={() => setOpen(false)} style={{ width: 28, height: 28, borderRadius: 7, border: "none", background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
    </div>
    <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
      {msgs.map((m, i) => <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}><div style={{ maxWidth: "82%", padding: "10px 14px", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: m.role === "user" ? B : "#F5F7FB", color: m.role === "user" ? "#fff" : "#0F172A", fontSize: 13, lineHeight: 1.5 }}>{m.content}</div></div>)}
      {loading && <div style={{ display: "flex", justifyContent: "flex-start" }}><div style={{ padding: "10px 14px", borderRadius: "14px 14px 14px 4px", background: "#F5F7FB", color: "#94A3B8", fontSize: 13 }}>
        <span style={{ display: "inline-flex", gap: 4 }}><span style={{ animation: "pulse 1s infinite" }}>●</span><span style={{ animation: "pulse 1s 0.2s infinite" }}>●</span><span style={{ animation: "pulse 1s 0.4s infinite" }}>●</span></span>
      </div></div>}
    </div>
    <div style={{ padding: "12px 14px", borderTop: "1px solid rgba(0,0,0,0.08)", display: "flex", gap: 8 }}>
      <input value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask about health insurance..." style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.08)", background: "#F5F7FB", color: "#0F172A", fontSize: 13, fontFamily: ff, outline: "none" }} />
      <button onClick={send} disabled={loading || !inp.trim()} style={{ width: 40, height: 40, borderRadius: 10, border: "none", background: inp.trim() ? B : "#94A3B833", color: "#fff", fontSize: 16, cursor: inp.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center" }}>➤</button>
    </div>
  </div>);
}

// ═══════════════ MAIN APP ═══════════════
export default function App() {
  const [user, setUser] = useState(() => ls("hs_user"));
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [authErr, setAuthErr] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [apiOk, setApiOk] = useState(false);
  const [plans, setPlans] = useState(DEFAULT_PLANS);
  const [tab, setTab] = useState("recommend");
  const [prof, setProf] = useState({ age: 30, salary: 50000, familySize: 2, preExisting: false, priorities: [], city: "metro" });
  const [recs, setRecs] = useState([]);
  const [cmpIds, setCmpIds] = useState([]);
  const [sel, setSel] = useState(null);
  const [show, setShow] = useState(false);
  const [recStage, setRecStage] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  // Save compare list per user
  useEffect(() => {
    if (user) { const uid = user.id || user._id || user.email; ls("hs_cmp_" + uid, cmpIds); }
  }, [cmpIds, user]);

  // Check backend on mount and load plans
  useEffect(() => {
    (async () => {
      const r = await api("/plans");
      if (r.success && r.data?.length > 0) {
        setPlans(r.data.map(p => ({ ...p, id: p.planId || p._id, ins: p.insurer, rat: p.rating, hosp: p.networkHospitals, feat: p.features, adds: p.addOns, best: p.bestFor, pp: p.prePostHosp, rest: p.restoration, room: p.roomRentLimit, copay: p.coPay, ped: p.preExistingWait, si: [p.sumInsuredRange?.min || 5e5, p.sumInsuredRange?.max || 1e7], bp: { a25: p.basePremium?.age25 || 0, a35: p.basePremium?.age35 || 0, a45: p.basePremium?.age45 || 0, a55: p.basePremium?.age55 || 0, a65: p.basePremium?.age65 || 0 }, on: p.isActive !== false, src: p.source || "", url: p.policyUrl || "" })));
        setApiOk(true);
      }
    })();
  }, []);

  // ─── AUTH: tries backend API first, falls back to localStorage ───
  const handleAuth = async () => {
    setAuthErr(""); setAuthBusy(true);
    const { name, email, password } = authForm;
    if (!email.trim()) { setAuthErr("Email is required"); setAuthBusy(false); return; }
    if (!email.includes("@")) { setAuthErr("Enter a valid email"); setAuthBusy(false); return; }
    if (password.length < 6) { setAuthErr("Password must be at least 6 characters"); setAuthBusy(false); return; }
    if (authMode === "register" && !name.trim()) { setAuthErr("Name is required"); setAuthBusy(false); return; }

    // Try backend API first
    const endpoint = authMode === "login" ? "/auth/login" : "/auth/register";
    const body = authMode === "login" ? { email, password } : { name, email, password };
    const res = await api(endpoint, { method: "POST", body: JSON.stringify(body) });

    if (res.success) {
      // Backend auth worked
      ls("hs_token", res.token);
      ls("hs_user", res.data);
      // Restore this user's saved data
      const uid = res.data.id || res.data._id || res.data.email;
      const savedCmp = ls("hs_cmp_" + uid) || [];
      setUser(res.data); setShow(false); setRecs([]); setCmpIds(savedCmp); setSel(null); setTab("recommend"); setRecStage(null);
      setAuthBusy(false);
      return;
    }

    // Backend not available — use localStorage fallback
    if (res.error === "offline") {
      const allUsers = ls("hs_local_users") || [];
      if (authMode === "register") {
        if (allUsers.find(u => u.email === email.toLowerCase())) { setAuthErr("Email already registered"); setAuthBusy(false); return; }
        allUsers.push({ name: name.trim(), email: email.toLowerCase(), password });
        ls("hs_local_users", allUsers);
        setAuthMode("login");
        setAuthForm({ name: "", email, password: "" });
        setAuthErr("✅ Account created! Now sign in.");
        setAuthBusy(false);
        return;
      }
      const found = allUsers.find(u => u.email === email.toLowerCase());
      if (!found) { setAuthErr("No account found. Create an account first."); setAuthBusy(false); return; }
      if (found.password !== password) { setAuthErr("Incorrect password."); setAuthBusy(false); return; }
      const userData = { id: Date.now(), name: found.name, email: found.email };
      ls("hs_user", userData);
      setUser(userData);
      setAuthBusy(false);
      return;
    }

    // Backend returned an error (wrong password, etc)
    setAuthErr(res.error || "Authentication failed");
    setAuthBusy(false);
  };

  const logout = () => { ls("hs_user", null); ls("hs_token", null); setUser(null); setShow(false); setRecs([]); setCmpIds([]); setSel(null); setTab("recommend"); setRecStage(null); setShowMenu(false); };

  const tabs = [{ id: "recommend", label: "AI Recommend", icon: "🤖" }, { id: "browse", label: "All Plans", icon: "📋" }, { id: "compare", label: "Compare" + (cmpIds.length ? " (" + cmpIds.length + ")" : ""), icon: "⚖️" }, { id: "report", label: "Risk Report", icon: "📊" }];
  const pOpts = [{ id: "network", label: "🏥 Hospitals" }, { id: "premium", label: "💰 Low Cost" }, { id: "coverage", label: "🛡️ Coverage" }, { id: "restoration", label: "🔄 Restore" }];

  // ───── AUTH SCREEN ─────
  if (!user) return (<>
    <style>{themeCss}{baseCss}</style>
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", padding: 20, fontFamily: ff }}>
      <div style={{ width: "100%", maxWidth: 420, animation: "slideUp 0.5s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", background: B, fontSize: 24, fontWeight: 800, color: "#fff", boxShadow: "0 8px 32px rgba(84,120,255,0.35)" }}>P</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "var(--t1)" }}>PolicyDoctor<span style={{ color: B }}>AI</span></div>
          <div style={{ fontSize: 13, color: "var(--t3)", marginTop: 6 }}>Indian Health Insurance Intelligence Platform</div>
        </div>
        <div style={{ background: "var(--card)", borderRadius: 16, padding: 32, border: "1px solid var(--bdr)", boxShadow: "var(--shd)" }}>
          <div style={{ display: "flex", marginBottom: 24, borderRadius: 10, background: "var(--inp)", padding: 3 }}>
            {["login", "register"].map(m => <button key={m} onClick={() => { setAuthMode(m); setAuthErr(""); }} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: ff, background: authMode === m ? B : "transparent", color: authMode === m ? "#fff" : "var(--t3)", transition: "all 0.2s" }}>{m === "login" ? "Sign In" : "Create Account"}</button>)}
          </div>
          <div>
            {authMode === "register" && <Inp label="Full Name" value={authForm.name} onChange={v => setAuthForm(f => ({ ...f, name: v }))} ph="Your full name" icon="👤" />}
            <Inp label="Email Address" type="email" value={authForm.email} onChange={v => setAuthForm(f => ({ ...f, email: v }))} ph="you@example.com" icon="📧" />
            <Inp label="Password" type="password" value={authForm.password} onChange={v => setAuthForm(f => ({ ...f, password: v }))} ph="Min 6 characters" icon="🔒" />
            {authErr && <div style={{ padding: "8px 12px", borderRadius: 8, background: authErr.startsWith("✅") ? "rgba(74,222,128,0.1)" : "rgba(255,87,87,0.1)", border: "1px solid " + (authErr.startsWith("✅") ? "rgba(74,222,128,0.3)" : "rgba(255,87,87,0.2)"), color: authErr.startsWith("✅") ? "var(--green)" : "var(--red)", fontSize: 12, marginBottom: 14 }}>{authErr}</div>}
            <button onClick={handleAuth} disabled={authBusy} style={{ width: "100%", padding: "14px 0", borderRadius: 10, border: "none", cursor: authBusy ? "wait" : "pointer", background: B, color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: ff, boxShadow: "0 4px 16px rgba(84,120,255,0.3)", marginTop: 4, opacity: authBusy ? 0.7 : 1 }}>
              {authBusy ? "Please wait..." : (authMode === "login" ? "Sign In" : "Create Account")}
            </button>
          </div>
          <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "var(--t3)" }}>
            {authMode === "login" ? "Don't have an account? " : "Already have an account? "}
            <span onClick={() => { setAuthMode(authMode === "login" ? "register" : "login"); setAuthErr(""); }} style={{ color: B, cursor: "pointer", fontWeight: 600 }}>{authMode === "login" ? "Sign up" : "Sign in"}</span>
          </div>
        </div>
      </div>
    </div>
  </>);

  // ───── MAIN DASHBOARD ─────
  const active = plans.filter(p => p.on);
  const cPlans = (show ? recs : plans).filter(p => cmpIds.includes(p.id));
  const goRec = async () => {
    setRecStage("analyzing"); setShow(false); setTab("recommend"); setSel(null);
    // Stage 1: Analyzing (0-2s)
    await new Promise(r => setTimeout(r, 2000));
    setRecStage("extracting");
    // Stage 2: Extracting (2-4s) — fetch data during this stage
    const resPromise = api("/plans/recommend", { method: "POST", body: JSON.stringify({ ...prof, source: "web" }) });
    await new Promise(r => setTimeout(r, 2000));
    setRecStage("matching");
    // Stage 3: Matching (4-6s)
    const res = await resPromise;
    await new Promise(r => setTimeout(r, 2000));
    // Process results
    if (res.success && res.data?.length > 0) {
      setRecs(res.data.map(p => ({ ...p, id: p.planId || p._id || ("ai_" + Math.random().toString(36).slice(2, 8)), ins: p.insurer, rat: p.rating, hosp: p.networkHospitals, feat: p.features || [], adds: p.addOns || [], best: p.bestFor, pp: p.prePostHosp || "60/180d", rest: p.restoration || "100%", room: p.roomRentLimit || "No Limit", copay: p.coPay || "None", ped: p.preExistingWait || 3, si: [p.sumInsuredRange?.min || 5e5, p.sumInsuredRange?.max || 1e7], on: true, ep: p.estimatedPremium, ep5: p.estimatedCost5yr || 0, rsi: p.recommendedSI, w: p.reasons || [], score: p.score, url: p.policyUrl || "", bestValue: !!p.bestValue })));
      setShow(true);
    } else {
      setRecs([]); setShow(false);
      alert(res.error || "AI could not generate results. Please try again.");
    }
    setRecStage(null); setShow(true);
  };

  return (<>
    <style>{themeCss}{baseCss}</style>
    <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--t1)", fontFamily: ff, display: "flex", flexDirection: "column" }}>
      <header style={{ background: "var(--bg2)", borderBottom: "1px solid var(--bdr)", padding: "14px 24px", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(16px)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: B, fontSize: 16, fontWeight: 800, color: "#fff" }}>P</div><div><div style={{ fontSize: 16, fontWeight: 700 }}>PolicyDoctor<span style={{ color: B }}>AI</span></div><div style={{ fontSize: 10, color: "var(--t3)", display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: apiOk ? "var(--green)" : "var(--warm)" }}></span>{apiOk ? "API Connected" : "Offline Mode"}</div></div></div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>{tabs.map(t => <button key={t.id} onClick={() => { setTab(t.id); setSel(null); }} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 8, border: "none", background: tab === t.id ? B + "15" : "transparent", color: tab === t.id ? B : "var(--t3)", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", fontFamily: ff, transition: "all 0.2s" }}>{t.icon} {t.label}</button>)}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setShowMenu(!showMenu)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 8, background: "var(--card)", border: "1px solid var(--bdr)", cursor: "pointer", fontFamily: ff }}><div style={{ width: 28, height: 28, borderRadius: 7, background: B, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>{(user.name || "U")[0]}</div><span style={{ fontSize: 12, fontWeight: 600, color: "var(--t1)" }}>{user.name}</span></button>
            {showMenu && <button onClick={logout} style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: "rgba(220,38,38,0.1)", color: "var(--red)", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: ff, animation: "fadeIn 0.2s ease" }}>Logout</button>}
          </div>
        </div>
      </header>
      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 20px", flex: 1, width: "100%" }}>
        {tab === "recommend" ? <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20 }}>
          <aside style={{ background: "var(--card)", borderRadius: 14, padding: 22, border: "1px solid var(--bdr)", height: "fit-content", position: "sticky", top: 88, animation: "slideUp 0.4s ease" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 18, color: "var(--t1)" }}>Your Profile</h2>
            <Inp label="Age" type="number" value={prof.age} onChange={v => setProf(p => ({ ...p, age: v }))} icon="🎂" />
            <Inp label="Monthly Salary (₹)" type="number" value={prof.salary} onChange={v => setProf(p => ({ ...p, salary: v }))} icon="💰" />
            <Inp label="Family Size" type="number" value={prof.familySize} onChange={v => setProf(p => ({ ...p, familySize: v }))} icon="👨‍👩‍👧‍👦" />
            <div style={{ marginBottom: 14 }}><label style={{ display: "block", marginBottom: 5, fontSize: 11, fontWeight: 600, color: "var(--t3)", textTransform: "uppercase" }}>City Type</label><select value={prof.city} onChange={e => setProf(p => ({ ...p, city: e.target.value }))} style={{ width: "100%", padding: "10px 12px", background: "var(--inp)", border: "1px solid var(--bdr)", borderRadius: 8, color: "var(--t1)", fontSize: 13, fontFamily: ff, outline: "none", boxSizing: "border-box" }}><option value="metro">Metro</option><option value="tier2">Tier-2</option><option value="other">Other</option></select></div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "var(--t2)", marginBottom: 14 }}><input type="checkbox" checked={prof.preExisting} onChange={e => setProf(p => ({ ...p, preExisting: e.target.checked }))} style={{ accentColor: B, width: 16, height: 16 }} />Pre-existing conditions</label>
            <div style={{ marginBottom: 18 }}><label style={{ display: "block", marginBottom: 6, fontSize: 11, fontWeight: 600, color: "var(--t3)", textTransform: "uppercase" }}>Priorities</label><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>{pOpts.map(o => <button key={o.id} onClick={() => setProf(p => ({ ...p, priorities: p.priorities.includes(o.id) ? p.priorities.filter(x => x !== o.id) : [...p.priorities, o.id] }))} style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid " + (prof.priorities.includes(o.id) ? B : "var(--bdr)"), background: prof.priorities.includes(o.id) ? B + "12" : "transparent", color: prof.priorities.includes(o.id) ? B : "var(--t3)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: ff }}>{o.label}</button>)}</div></div>
            <button onClick={goRec} disabled={!!recStage} style={{ width: "100%", padding: "14px 0", borderRadius: 10, border: "none", background: recStage ? B + "99" : B, color: "#fff", fontSize: 14, fontWeight: 700, cursor: recStage ? "wait" : "pointer", fontFamily: ff, boxShadow: "0 4px 16px rgba(84,120,255,0.3)" }}>{recStage ? "⏳ AI is working..." : "Get AI Recommendations"}</button>
            {show && recs.length > 0 && <div style={{ marginTop: 14, padding: 12, background: B + "0D", borderRadius: 8, border: "1px solid " + B + "33" }}><div style={{ fontSize: 10, color: B, fontWeight: 600 }}>TOP MATCH</div><div style={{ fontSize: 12, color: "var(--t2)", lineHeight: 1.6 }}><strong style={{ color: "var(--t1)" }}>{recs[0].name}</strong> ({recs[0].score}%)</div></div>}
          </aside>
          <div key="recommend" style={{ animation: "fadeIn 0.4s ease" }}>
            {!sel && (<div><h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>{recStage ? "AI Analysis in Progress" : show ? "Your Recommendations" : "AI Plan Finder"}</h1><p style={{ fontSize: 13, color: "var(--t3)", marginBottom: 20 }}>{recStage ? "Please wait while our AI analyzes your profile..." : show ? "Top " + recs.length + " plans ranked by AI" + (apiOk ? " · ⚡ Powered by Groq LLaMA" : "") : "Fill profile and click Get Recommendations"}</p>{recStage ? <div style={{ textAlign: "center", padding: "60px 20px" }}><div style={{ width: 80, height: 80, borderRadius: 20, margin: "0 auto 24px", background: B + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, animation: "pulse 1.5s infinite" }}>⚡</div><div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 360, margin: "0 auto" }}>{[{ k: "analyzing", icon: "🔍", label: "Analyzing your profile & risk factors" }, { k: "extracting", icon: "📊", label: "Extracting market data & CSR ratings" }, { k: "matching", icon: "🎯", label: "Matching best plans for your needs" }].map((s, i) => { const done = s.k === "analyzing" && recStage !== "analyzing" || s.k === "extracting" && recStage === "matching"; const active = s.k === recStage; return <div key={s.k} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 12, background: active ? B + "12" : done ? "rgba(74,222,128,0.08)" : "var(--inp)", border: "1px solid " + (active ? B + "33" : done ? "rgba(74,222,128,0.2)" : "var(--bdr)"), transition: "all 0.4s" }}><div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: active ? B : done ? "var(--green)" : "var(--inp)", fontSize: 16, transition: "all 0.3s" }}>{done ? "✓" : s.icon}</div><div style={{ flex: 1, textAlign: "left" }}><div style={{ fontSize: 13, fontWeight: 600, color: active ? "var(--t1)" : done ? "var(--green)" : "var(--t3)" }}>{s.label}</div>{active && <div style={{ fontSize: 11, color: B, marginTop: 2 }}>Processing...</div>}</div></div> })}</div></div> : show ? <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 16 }}>{recs.map(p => <PCard key={p.id} pl={p} prof={prof} onCmp={id => setCmpIds(c => c.includes(id) ? c.filter(x => x !== id) : c.length < 4 ? [...c, id] : c)} isCmp={cmpIds.includes(p.id)} onSel={setSel} />)}</div> : <div style={{ textAlign: "center", padding: "70px 20px" }}><div style={{ fontSize: 52, marginBottom: 16 }}>🏥</div><div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Find Your Perfect Plan</div><div style={{ fontSize: 13, color: "var(--t3)", maxWidth: 400, margin: "0 auto", lineHeight: 1.7 }}>Enter your details and get personalized recommendations.</div></div>}</div>)}
            {sel && <Det pl={sel} prof={prof} onBack={() => setSel(null)} />}
          </div>
        </div>
          : <div key={tab} style={{ animation: "fadeIn 0.4s ease" }}>
            {tab === "browse" && !sel && (<div><h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>All Plans ({active.length} active)</h1><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 16 }}>{active.map(p => <PCard key={p.id} pl={{ ...p, score: Math.round(p.csr), rsi: 1e6 }} prof={prof} onCmp={id => setCmpIds(c => c.includes(id) ? c.filter(x => x !== id) : c.length < 4 ? [...c, id] : c)} isCmp={cmpIds.includes(p.id)} onSel={setSel} />)}</div></div>)}
            {tab === "browse" && sel && <Det pl={{ ...sel, rsi: 1e6 }} prof={prof} onBack={() => setSel(null)} />}
            {tab === "compare" && <div><h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Compare Plans</h1><Cmp plans={cPlans} /></div>}
            {tab === "report" && <div><h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Risk Report</h1><Rsk prof={prof} recs={show ? recs : doRec(active, prof)} /></div>}
          </div>}
      </main>
      <footer style={{ borderTop: "1px solid var(--bdr)", padding: "16px 24px", background: "var(--bg2)", marginTop: "auto" }}><div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--t3)" }}><span>PolicyDoctorAI © 2026</span><span>Premiums are indicative · Not financial advice</span></div></footer>
      <Chatbot currentUser={user} />
    </div>
  </>);
}