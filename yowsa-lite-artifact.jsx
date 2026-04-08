import { useState, useCallback } from "react";

const NAVY = "#12151F", NAVY_MID = "#1C2340", GOLD = "#C8980E", GOLD_DARK = "#B8860B";
const GOLD_DEEP = "#9A6B00", GOLD_LT = "#F0EAD6", CREAM = "#F7F4EE", WHITE = "#FFFFFF";
const SLATE = "#2C3450", MUTED = "#6B7A99", RULE = "#E2DDD4";
const GREEN = "#1A6B4A", GREEN_BG = "#EAF5F0", GREEN_BDR = "#7EC8A4";
const AMBER = "#8B6000", AMBER_BG = "#FBF6EA", AMBER_BDR = "#D4B870";
const RED = "#8B1A1A", RED_BG = "#FAF0F0", RED_BDR = "#D4908A";
const CRIT = "#6B0A14", CRIT_BG = "#FFF0F2", CRIT_BDR = "#C87880";

const QUESTIONS = [
  { domain:"Governance and Policy", critical:true,
    q:"Does your organization have a written safeguarding or child protection policy that has been formally reviewed and approved within the last 12 months?",
    opts:[{v:2,t:"Yes — written, current, and board-approved"},{v:1,t:"Yes — but not reviewed recently or formally approved"},{v:0,t:"No — or we are not sure"}]},
  { domain:"Governance and Policy", critical:true,
    q:"Is there a formally designated Safeguarding Lead appointed in writing with defined responsibilities?",
    opts:[{v:2,t:"Yes — designated in writing with a clear role description"},{v:1,t:"Someone handles this informally but it is not formally documented"},{v:0,t:"No designated lead exists"}]},
  { domain:"Recruitment and Screening", critical:true,
    q:"Do all staff and volunteers with access to youth undergo background checks before starting, renewed periodically?",
    opts:[{v:2,t:"Yes — all youth-facing personnel including volunteers, with periodic renewal"},{v:1,t:"Partially — some roles or groups are screened inconsistently"},{v:0,t:"No — or checks are not consistently completed before access to youth"}]},
  { domain:"Training and Education", critical:true,
    q:"Have all coaches, staff, and volunteers completed safeguarding training from a recognized provider within the last two years?",
    opts:[{v:2,t:"Yes — all youth-facing personnel, trained by a recognized provider"},{v:1,t:"Some have, but training is inconsistent or not from an accredited provider"},{v:0,t:"No — or training has not been completed within the last two years"}]},
  { domain:"Reporting and Response", critical:true,
    q:"Does your organization have a documented reporting procedure staff can follow — including escalation to statutory authorities?",
    opts:[{v:2,t:"Yes — written procedure, trained staff, includes statutory escalation"},{v:1,t:"We have general guidance but it is not formalized or consistently trained"},{v:0,t:"No documented procedure exists"}]},
  { domain:"Safe Sport Culture", critical:false,
    q:"Are one-on-one interactions between adults and youth avoided or conducted only in observable settings, per a defined policy?",
    opts:[{v:2,t:"Yes — a defined policy is in place and followed consistently"},{v:1,t:"Generally practiced but not formally documented or enforced"},{v:0,t:"No — private adult-youth interactions are not formally restricted"}]},
  { domain:"Athlete Welfare", critical:false,
    q:"Do athletes have access to welfare support and an independent channel to raise concerns outside the coaching structure?",
    opts:[{v:2,t:"Yes — a dedicated welfare officer or independent reporting mechanism exists"},{v:1,t:"Informally available but no dedicated channel or person"},{v:0,t:"No independent welfare channel exists for athletes"}]},
  { domain:"Audit and Accountability", critical:false,
    q:"Has your organization's safeguarding framework been independently reviewed or audited within the last three years?",
    opts:[{v:2,t:"Yes — an independent external review has been completed"},{v:1,t:"Internal review only, or informal peer review"},{v:0,t:"No independent review has ever been conducted"}]},
];

const RUBRIC = [
  { min:14, max:16, label:"Strong Foundation", color:GREEN, bg:GREEN_BG, border:GREEN_BDR,
    summary:"Your responses suggest a solid safeguarding foundation. A full YOWSA audit would verify, document, and strengthen what you already have — converting good practice into defensible, evidenced compliance.",
    cta:"Verify and document your strong foundation with a full YOWSA audit." },
  { min:10, max:13, label:"Developing — Gaps Present", color:AMBER, bg:AMBER_BG, border:AMBER_BDR,
    summary:"Your responses indicate a partial safeguarding framework with meaningful gaps. These represent real legal, reputational, and regulatory risk. A YOWSA audit will identify your priority areas and guide you to a compliant system before a gap becomes an incident.",
    cta:"Address your gaps with a targeted YOWSA compliance audit." },
  { min:5, max:9, label:"Significant Gaps — Action Required", color:RED, bg:RED_BG, border:RED_BDR,
    summary:"Your responses suggest significant safeguarding deficiencies. This represents material legal, reputational, and regulatory risk. We strongly recommend engaging a safeguarding consultant before your next program season.",
    cta:"Protect your organization — schedule a YOWSA consultation today." },
  { min:0, max:4, label:"Critical Vulnerabilities Identified", color:CRIT, bg:CRIT_BG, border:CRIT_BDR,
    summary:"Your responses indicate critical safeguarding gaps requiring urgent attention. Your organization may be significantly exposed to liability. Please contact Safeguardia Group directly to discuss immediate next steps.",
    cta:"Contact Safeguardia immediately to discuss urgent safeguarding needs." },
];

const RISKS = [
  { name:"Governance and Policy Exposure",  domain:"Governance and Policy" },
  { name:"Screening and Recruitment Risk",  domain:"Recruitment and Screening" },
  { name:"Training Liability Gap",           domain:"Training and Education" },
  { name:"Reporting Failure Risk",           domain:"Reporting and Response" },
  { name:"Safe Environment Vulnerability",  domain:"Safe Sport Culture" },
  { name:"Athlete Welfare Exposure",         domain:"Athlete Welfare" },
  { name:"Audit Trail Deficiency",           domain:"Audit and Accountability" },
];

function getRubric(score) {
  return RUBRIC.find(r => score >= r.min && score <= r.max) || RUBRIC[3];
}

const s = {
  shell: { maxWidth:680, margin:"0 auto", padding:"0 20px 60px" },
  header: { background:NAVY, borderBottom:`2.5px solid ${GOLD}` },
  headerInner: { maxWidth:680, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px" },
  logoMark: { display:"flex", alignItems:"center", gap:11 },
  logoName: { fontFamily:"Georgia,serif", fontSize:16, fontWeight:700, color:GOLD, letterSpacing:.5, lineHeight:1 },
  logoSub: { fontSize:8, letterSpacing:2.5, color:MUTED, textTransform:"uppercase", fontWeight:500, marginTop:2 },
  badge: { fontSize:9, letterSpacing:2, color:GOLD, border:`1px solid rgba(200,152,14,.3)`, padding:"4px 12px", borderRadius:20, textTransform:"uppercase", fontWeight:700 },
  hero: { background:NAVY, padding:"52px 20px 44px", textAlign:"center", position:"relative", overflow:"hidden" },
  eyebrow: { fontSize:9, letterSpacing:4, color:GOLD, textTransform:"uppercase", fontWeight:600, marginBottom:14 },
  heroTitle: { fontFamily:"Georgia,serif", fontSize:48, fontWeight:700, color:WHITE, lineHeight:1, marginBottom:6 },
  heroTitleEm: { color:GOLD, fontStyle:"italic" },
  heroSub: { fontFamily:"Georgia,serif", fontSize:16, fontStyle:"italic", color:"rgba(240,234,214,.65)", marginBottom:28 },
  heroBody: { background:"rgba(28,35,64,.7)", border:`1px solid rgba(200,152,14,.15)`, borderRadius:12, padding:"22px 26px", maxWidth:500, margin:"0 auto 24px", textAlign:"left" },
  heroBodyP: { fontSize:13, color:"rgba(240,234,214,.7)", lineHeight:1.8, marginBottom:10 },
  chips: { display:"flex", flexWrap:"wrap", gap:7, justifyContent:"center", marginBottom:28 },
  chip: { fontSize:10, color:GOLD_LT, background:"rgba(200,152,14,.08)", border:`1px solid rgba(200,152,14,.18)`, padding:"4px 12px", borderRadius:20 },
  btnStart: { display:"inline-flex", alignItems:"center", gap:9, background:GOLD, color:NAVY, border:"none", borderRadius:10, padding:"14px 36px", fontFamily:"inherit", fontSize:14, fontWeight:700, cursor:"pointer" },
  disclaimer: { fontSize:10, color:"rgba(107,122,153,.5)", marginTop:14 },
  progWrap: { background:NAVY, padding:"0 20px 14px" },
  progInner: { maxWidth:680, margin:"0 auto" },
  progMeta: { display:"flex", justifyContent:"space-between", marginBottom:7, fontSize:10, letterSpacing:1.5 },
  progLabel: { color:MUTED, textTransform:"uppercase" },
  progPct: { color:GOLD, fontWeight:600 },
  progTrack: { height:2.5, background:"rgba(255,255,255,.07)", borderRadius:2, overflow:"hidden" },
  card: { background:WHITE, border:`1px solid ${RULE}`, borderRadius:14, boxShadow:"0 4px 24px rgba(18,21,31,.07)", padding:"32px 32px 28px", marginTop:24 },
  cardEyebrow: { fontSize:9, letterSpacing:3, color:GOLD, textTransform:"uppercase", fontWeight:600, marginBottom:8 },
  cardTitle: { fontFamily:"Georgia,serif", fontSize:24, fontWeight:700, color:NAVY, marginBottom:5, lineHeight:1.2 },
  cardDesc: { fontSize:12.5, color:MUTED, marginBottom:24, lineHeight:1.65 },
  fieldGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 },
  field: { display:"flex", flexDirection:"column", gap:5 },
  fieldLabel: { fontSize:9.5, letterSpacing:1.5, color:NAVY, textTransform:"uppercase", fontWeight:600 },
  fieldInput: { border:`1.5px solid ${RULE}`, borderRadius:8, padding:"10px 13px", fontFamily:"inherit", fontSize:13, color:NAVY, background:CREAM, outline:"none" },
  nav: { display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:24 },
  btnBack: { background:"transparent", border:`1.5px solid ${RULE}`, borderRadius:8, padding:"9px 18px", fontFamily:"inherit", fontSize:13, color:MUTED, cursor:"pointer" },
  btnNext: (disabled) => ({ background:disabled?"#ccc":NAVY, color:WHITE, border:"none", borderRadius:8, padding:"10px 26px", fontFamily:"inherit", fontSize:13, fontWeight:600, cursor:disabled?"not-allowed":"pointer", opacity:disabled?.4:1 }),
  qDomain: { display:"inline-flex", alignItems:"center", gap:7, fontSize:9.5, letterSpacing:2, color:GOLD_DEEP, textTransform:"uppercase", fontWeight:600, marginBottom:8 },
  qCritical: { display:"inline-flex", alignItems:"center", fontSize:9, color:RED, background:RED_BG, border:`1px solid ${RED_BDR}`, padding:"2px 8px", borderRadius:20, fontWeight:600, marginLeft:8 },
  qText: { fontFamily:"Georgia,serif", fontSize:20, fontWeight:600, color:NAVY, lineHeight:1.4, marginBottom:22 },
  opt: (selected) => ({ display:"flex", alignItems:"flex-start", gap:13, padding:"14px 16px", border:`1.5px solid ${selected?GOLD:RULE}`, borderRadius:10, background:selected?"#FFFDF5":CREAM, cursor:"pointer", textAlign:"left", width:"100%", marginBottom:9, fontFamily:"inherit", boxShadow:selected?"0 0 0 3px rgba(200,152,14,.1)":"none" }),
  optRadio: (selected) => ({ width:17, height:17, borderRadius:"50%", border:`1.5px solid ${selected?GOLD:RULE}`, flexShrink:0, marginTop:2, background:selected?GOLD:"transparent", position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }),
  optText: { fontSize:13, color:SLATE, lineHeight:1.55, fontWeight:300, flex:1, textAlign:"left" },
  optBadge: (v) => ({ flexShrink:0, width:21, height:21, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9.5, fontWeight:700, marginTop:1, background:v===2?GREEN_BG:v===1?AMBER_BG:RED_BG, color:v===2?GREEN:v===1?AMBER:RED }),
  resultsHero: { background:NAVY, padding:"36px 20px 30px", textAlign:"center" },
  resultsOrg: { fontSize:9.5, letterSpacing:3, color:MUTED, textTransform:"uppercase", marginBottom:4 },
  resultsTitle: { fontFamily:"Georgia,serif", fontSize:26, fontWeight:700, color:WHITE, marginBottom:3 },
  resultsDate: { fontSize:11, color:"rgba(107,122,153,.6)" },
  ringWrap: { display:"flex", flexDirection:"column", alignItems:"center", margin:"24px auto 16px" },
  ringOuter: { position:"relative", width:120, height:120 },
  scoreLabel: (rubric) => ({ fontSize:11.5, fontWeight:700, letterSpacing:.5, marginTop:10, padding:"4px 16px", borderRadius:20, background:rubric.bg, color:rubric.color, border:`1px solid ${rubric.border}` }),
  resultBand: (rubric) => ({ borderRadius:12, padding:"22px 26px", marginTop:20, border:`1.5px solid ${rubric.border}`, background:rubric.bg }),
  resultSummary: (rubric) => ({ fontSize:13.5, lineHeight:1.78, marginBottom:12, fontWeight:300, color:rubric.color }),
  critWrap: { display:"flex", alignItems:"flex-start", gap:9, padding:"10px 14px", borderRadius:8, fontSize:12, background:CRIT_BG, border:`1px solid ${CRIT_BDR}`, color:CRIT, lineHeight:1.55 },
  breakdown: { background:WHITE, border:`1px solid ${RULE}`, borderRadius:12, boxShadow:"0 2px 12px rgba(18,21,31,.05)", padding:"24px 24px 18px", marginTop:16 },
  breakdownTitle: { fontFamily:"Georgia,serif", fontSize:19, fontWeight:600, color:NAVY, marginBottom:16 },
  respRow: { display:"flex", gap:11, alignItems:"flex-start", padding:"11px 0", borderBottom:`1px solid #F5F2EC` },
  respDot: (critical) => ({ width:7, height:7, borderRadius:"50%", flexShrink:0, marginTop:5, background:critical?GOLD:"#B0BACC" }),
  respDomain: { fontSize:9.5, letterSpacing:1.5, color:MUTED, textTransform:"uppercase", marginBottom:2, fontWeight:500 },
  respQ: { fontSize:12, color:NAVY, marginBottom:5, lineHeight:1.5 },
  respAns: (v) => ({ display:"inline-flex", alignItems:"center", gap:5, fontSize:10.5, padding:"3px 9px", borderRadius:5, fontWeight:500, border:"1px solid", background:v===2?GREEN_BG:v===1?AMBER_BG:RED_BG, color:v===2?GREEN:v===1?AMBER:RED, borderColor:v===2?GREEN_BDR:v===1?AMBER_BDR:RED_BDR }),
  riskSummary: { background:CREAM, border:`1px solid ${RULE}`, borderRadius:12, padding:"22px 24px", marginTop:16 },
  riskTitle: { fontFamily:"Georgia,serif", fontSize:18, fontWeight:600, color:NAVY, marginBottom:14 },
  riskRow: { display:"grid", gridTemplateColumns:"1fr auto", gap:10, alignItems:"center", padding:"8px 0", borderBottom:`1px solid rgba(226,221,212,.55)` },
  riskName: { fontSize:12.5, color:SLATE },
  riskTag: (cls) => {
    const m = {l:[GREEN_BG,GREEN,GREEN_BDR],m:[AMBER_BG,AMBER,AMBER_BDR],h:[RED_BG,RED,RED_BDR],c:[CRIT_BG,CRIT,CRIT_BDR]};
    const [bg,col,bdr] = m[cls]||[CREAM,MUTED,RULE];
    return { fontSize:9.5, padding:"2px 10px", borderRadius:20, fontWeight:700, letterSpacing:.3, border:`1px solid ${bdr}`, background:bg, color:col };
  },
  sendBlock: { background:WHITE, border:`1.5px solid ${GOLD}`, borderRadius:12, padding:"24px 26px", marginTop:16 },
  sendTitle: { fontFamily:"Georgia,serif", fontSize:20, fontWeight:700, color:NAVY, marginBottom:8 },
  sendDesc: { fontSize:13, color:MUTED, lineHeight:1.7, marginBottom:18 },
  sendRow: { display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" },
  btnSend: (sending, sent) => ({ display:"inline-flex", alignItems:"center", gap:8, background:sent?GREEN:NAVY, color:WHITE, border:"none", borderRadius:9, padding:"12px 26px", fontFamily:"inherit", fontSize:13, fontWeight:700, cursor:sending||sent?"default":"pointer", opacity:sending?.7:1 }),
  btnPdf: { background:"transparent", color:MUTED, border:`1.5px solid ${RULE}`, borderRadius:9, padding:"12px 20px", fontFamily:"inherit", fontSize:13, cursor:"pointer" },
  statusBox: (type) => {
    const m = {sending:["#EEF2FF","#3B4BA0","#C7D0F0"],success:[GREEN_BG,GREEN,GREEN_BDR],error:[RED_BG,RED,RED_BDR]};
    const [bg,col,bdr] = m[type]||[CREAM,MUTED,RULE];
    return { fontSize:12, marginTop:12, padding:"10px 14px", borderRadius:8, lineHeight:1.55, background:bg, color:col, border:`1px solid ${bdr}` };
  },
  cta: { background:NAVY, borderRadius:12, padding:28, marginTop:16, textAlign:"center" },
  ctaEyebrow: { fontSize:9, letterSpacing:3, color:GOLD, textTransform:"uppercase", fontWeight:700, marginBottom:8 },
  ctaTitle: { fontFamily:"Georgia,serif", fontSize:22, fontWeight:700, color:WHITE, lineHeight:1.3, marginBottom:8 },
  ctaBody: { fontSize:12.5, color:"rgba(255,255,255,.4)", lineHeight:1.75, marginBottom:12, fontWeight:300 },
  ctaContact: { fontSize:10.5, color:"rgba(255,255,255,.2)" },
};

function Shield() {
  return (
    <svg width="32" height="36" viewBox="0 0 36 42" fill="none">
      <path d="M18 1L3 7.5V20C3 29.5 9.5 38 18 41C26.5 38 33 29.5 33 20V7.5L18 1Z" fill="#1C2340" stroke="#C8980E" strokeWidth="1.5"/>
      <path d="M18 5L6 10.5V20C6 28 11.5 35.5 18 38C24.5 35.5 30 28 30 20V10.5L18 5Z" fill="#12151F" stroke="rgba(200,152,14,0.3)" strokeWidth="0.75"/>
      <text x="18" y="27" textAnchor="middle" fontFamily="serif" fontSize="15" fontWeight="700" fill="#C8980E">S</text>
    </svg>
  );
}

function ScoreRing({ score, rubric }) {
  const pct = score / 16;
  const r = 50, circ = 2 * Math.PI * r;
  const offset = circ - pct * circ;
  return (
    <div style={s.ringWrap}>
      <div style={s.ringOuter}>
        <svg width="120" height="120" style={{transform:"rotate(-90deg)"}}>
          <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="9"/>
          <circle cx="60" cy="60" r={r} fill="none" stroke={rubric.ringColor||rubric.color} strokeWidth="9" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset} style={{transition:"stroke-dashoffset 1s ease"}}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <span style={{fontFamily:"Georgia,serif",fontSize:36,fontWeight:700,color:WHITE,lineHeight:1}}>{score}</span>
          <span style={{fontSize:10,color:MUTED,marginTop:1}}>/ 16</span>
        </div>
      </div>
      <div style={s.scoreLabel(rubric)}>{rubric.label}</div>
    </div>
  );
}

export default function YOWSALite() {
  const [step, setStep]       = useState(0); // 0=welcome, 1=details, 2-9=questions, 10=results
  const [answers, setAnswers] = useState({});
  const [form, setForm]       = useState({ org:"", type:"", name:"", role:"", email:"", phone:"", size:"" });
  const [sendState, setSendState] = useState("idle"); // idle | sending | success | error
  const [statusMsg, setStatusMsg] = useState("");

  const score  = Object.values(answers).reduce((a,b)=>a+b,0);
  const rubric = getRubric(score);
  const crits  = [...new Set(QUESTIONS.filter((q,i)=>q.critical && answers[i]===0).map(q=>q.domain))];
  const qIdx   = step - 2;
  const currentQ = step >= 2 && step <= 9 ? QUESTIONS[qIdx] : null;
  const progress = step === 0 || step === 10 ? 0 : Math.round(((step) / (QUESTIONS.length + 2)) * 100);
  const detailsValid = form.org.trim() && form.name.trim() && form.email.trim() && form.email.includes("@");

  const go = (n) => setStep(n);

  const selectAnswer = (qi, v) => setAnswers(prev => ({ ...prev, [qi]: v }));

  const updateForm = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const sendResults = useCallback(async () => {
    setSendState("sending");
    setStatusMsg("Sending your results...");

    const date = new Date().toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" });
    const answerLines = QUESTIONS.map((q,i) => {
      const v = answers[i];
      const opt = q.opts.find(o => o.v === v);
      const tag = v===2?"COMPLIANT":v===1?"PARTIAL":"GAP";
      return `[${tag}] ${q.domain}\n   ${opt ? opt.t : "No answer"}`;
    }).join("\n\n");

    const subject = `YOWSA Lite Results -- ${form.org} (${score}/16 -- ${rubric.label})`;
    const message = [
      "YOWSA LITE SELF-ASSESSMENT RESULTS",
      "====================================","",
      "ORGANIZATION DETAILS",
      "--------------------",
      `Organization:   ${form.org}`,
      `Type:           ${form.type||"Not specified"}`,
      `Participants:   ${form.size||"Not specified"}`,
      `Contact Name:   ${form.name}`,
      `Role:           ${form.role||"Not specified"}`,
      `Email:          ${form.email}`,
      `Phone:          ${form.phone||"Not provided"}`,
      `Date:           ${date}`,"",
      "ASSESSMENT RESULTS",
      "------------------",
      `Score:          ${score} / 16`,
      `Band:           ${rubric.label}`,
      `Critical Gaps:  ${crits.length ? crits.join(", ") : "None identified"}`,"",
      "DETAILED RESPONSES",
      "------------------",
      answerLines,
    ].join("\n");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          access_key: "8a38673c-7589-448a-aec4-c34d1d6e844b",
          subject, message,
          name: form.name,
          email: form.email,
          botcheck: "",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSendState("success");
        setStatusMsg("Your results have been sent successfully. Sheldon Phillips, JD will follow up within one business day — at no obligation.");
      } else {
        throw new Error(data.message || "Submission failed");
      }
    } catch (err) {
      setSendState("error");
      setStatusMsg("Could not send automatically. Please email your results directly to sheldonphillips@mac.com or call 443-735-3504.");
      console.error("Web3Forms error:", err);
    }
  }, [answers, form, score, rubric, crits]);

  const fieldStyle = (focused) => ({ ...s.fieldInput, borderColor: focused ? GOLD : RULE });

  return (
    <div style={{ fontFamily:"'DM Sans',system-ui,sans-serif", fontWeight:300, background:CREAM, minHeight:"100vh" }}>

      {/* HEADER */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <div style={s.logoMark}>
            <Shield/>
            <div>
              <div style={s.logoName}>Safeguardia Group</div>
              <div style={s.logoSub}>Independent Safeguarding Advisory</div>
            </div>
          </div>
          <span style={s.badge}>YOWSA Lite</span>
        </div>
      </header>

      {/* PROGRESS */}
      {step > 0 && step < 10 && (
        <div style={s.progWrap}>
          <div style={s.progInner}>
            <div style={s.progMeta}>
              <span style={s.progLabel}>{step===1?"Your Details":`Question ${qIdx+1} of ${QUESTIONS.length}`}</span>
              <span style={s.progPct}>{progress}%</span>
            </div>
            <div style={s.progTrack}>
              <div style={{...s.progTrack, background:`linear-gradient(90deg,${GOLD_DARK},${GOLD})`, width:`${progress}%`, transition:"width .4s ease"}}/>
            </div>
          </div>
        </div>
      )}

      {/* WELCOME */}
      {step === 0 && (
        <div style={s.hero}>
          <div style={s.eyebrow}>Complimentary Risk Assessment</div>
          <h1 style={s.heroTitle}>YOWSA <em style={s.heroTitleEm}>Lite</em></h1>
          <p style={s.heroSub}>Youth Organization Welfare and Safeguarding Audit</p>
          <div style={s.heroBody}>
            <p style={s.heroBodyP}>This <strong style={{color:GOLD}}>8-question self-assessment</strong> evaluates your organization's safeguarding posture across seven critical risk domains — the same framework underpinning a full YOWSA compliance audit.</p>
            <p style={s.heroBodyP}>Your results identify gaps in your risk management strategy, flag areas of critical exposure, and show where a Safeguardia engagement adds the most value.</p>
            <p style={{...s.heroBodyP, marginBottom:0}}>Takes <strong style={{color:GOLD}}>4–6 minutes</strong>. Results generated immediately and sent directly to Safeguardia Group.</p>
          </div>
          <div style={s.chips}>
            {["Governance & Policy","Recruitment & Screening","Training","Reporting & Response","Safe Sport Culture","Athlete Welfare","Audit & Review"].map(c=>(
              <span key={c} style={s.chip}>{c}</span>
            ))}
          </div>
          <button style={s.btnStart} onClick={()=>go(1)}>Begin Assessment →</button>
          <p style={s.disclaimer}>Your responses are confidential and used solely to generate your results. We do not share your data with third parties.</p>
        </div>
      )}

      {/* DETAILS */}
      {step === 1 && (
        <div style={s.shell}>
          <div style={s.card}>
            <div style={s.cardEyebrow}>Step 1 of 2 — Your Details</div>
            <h2 style={s.cardTitle}>Tell us about your organization</h2>
            <p style={s.cardDesc}>Fields marked <span style={{color:GOLD}}>*</span> are required.</p>
            <div style={s.fieldGrid}>
              <div style={s.field}>
                <label style={s.fieldLabel}>Organization Name <span style={{color:GOLD}}>*</span></label>
                <input style={s.fieldInput} value={form.org} onChange={e=>updateForm("org",e.target.value)} placeholder="e.g. River City FC"/>
              </div>
              <div style={s.field}>
                <label style={s.fieldLabel}>Organization Type</label>
                <select style={s.fieldInput} value={form.type} onChange={e=>updateForm("type",e.target.value)}>
                  <option value="">Select type...</option>
                  {["Youth Sports Club","School / Academy","Nonprofit / Community Program","League or Governing Body","Summer Camp / Recreation Program","Religious Youth Organization","Other Youth-Serving Organization"].map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div style={s.fieldGrid}>
              <div style={s.field}>
                <label style={s.fieldLabel}>Your Name <span style={{color:GOLD}}>*</span></label>
                <input style={s.fieldInput} value={form.name} onChange={e=>updateForm("name",e.target.value)} placeholder="First and last name"/>
              </div>
              <div style={s.field}>
                <label style={s.fieldLabel}>Your Role</label>
                <input style={s.fieldInput} value={form.role} onChange={e=>updateForm("role",e.target.value)} placeholder="e.g. Executive Director"/>
              </div>
            </div>
            <div style={s.fieldGrid}>
              <div style={s.field}>
                <label style={s.fieldLabel}>Email Address <span style={{color:GOLD}}>*</span></label>
                <input style={s.fieldInput} type="email" value={form.email} onChange={e=>updateForm("email",e.target.value)} placeholder="your@email.com"/>
              </div>
              <div style={s.field}>
                <label style={s.fieldLabel}>Phone (optional)</label>
                <input style={s.fieldInput} type="tel" value={form.phone} onChange={e=>updateForm("phone",e.target.value)} placeholder="For follow-up call"/>
              </div>
            </div>
            <div style={s.field}>
              <label style={s.fieldLabel}>Approx. number of youth participants</label>
              <select style={s.fieldInput} value={form.size} onChange={e=>updateForm("size",e.target.value)}>
                <option value="">Select range...</option>
                {["Fewer than 50","50 to 200","200 to 500","500 to 1,000","More than 1,000"].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div style={s.nav}>
              <button style={s.btnBack} onClick={()=>go(0)}>← Back</button>
              <button style={s.btnNext(!detailsValid)} onClick={()=>detailsValid&&go(2)} disabled={!detailsValid}>Continue →</button>
            </div>
          </div>
        </div>
      )}

      {/* QUESTIONS */}
      {currentQ && (
        <div style={s.shell}>
          <div style={s.card}>
            <div style={{marginBottom:12}}>
              <span style={s.qDomain}>{currentQ.domain}</span>
              {currentQ.critical && <span style={s.qCritical}>⚠ Core Compliance</span>}
            </div>
            <p style={s.qText}>{currentQ.q}</p>
            <div style={{marginBottom:26}}>
              {currentQ.opts.map((opt,oi)=>{
                const selected = answers[qIdx] === opt.v;
                return (
                  <button key={oi} style={s.opt(selected)} onClick={()=>selectAnswer(qIdx, opt.v)}>
                    <span style={s.optRadio(selected)}>
                      {selected && <span style={{width:6,height:6,borderRadius:"50%",background:WHITE,display:"block"}}/>}
                    </span>
                    <span style={s.optText}>{opt.t}</span>
                    <span style={s.optBadge(opt.v)}>{opt.v===2?"✓":opt.v===1?"~":"✕"}</span>
                  </button>
                );
              })}
            </div>
            <div style={s.nav}>
              <button style={s.btnBack} onClick={()=>go(step-1)}>← Back</button>
              <button style={s.btnNext(answers[qIdx]===undefined)} onClick={()=>answers[qIdx]!==undefined&&go(step+1)} disabled={answers[qIdx]===undefined}>
                {qIdx === QUESTIONS.length-1 ? "View My Results →" : "Next →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESULTS */}
      {step === 10 && (
        <>
          <div style={s.resultsHero}>
            <div style={s.resultsOrg}>{form.org || "Your Organization"}</div>
            <h2 style={s.resultsTitle}>Safeguarding Self-Assessment Results</h2>
            <div style={s.resultsDate}>
              Completed by {form.name}{form.role ? `, ${form.role}` : ""} · {new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}
            </div>
            <ScoreRing score={score} rubric={rubric}/>
          </div>

          <div style={s.shell}>
            {/* Result band */}
            <div style={s.resultBand(rubric)}>
              <p style={s.resultSummary(rubric)}>{rubric.summary}</p>
              {crits.length > 0 && (
                <div style={s.critWrap}>
                  <span style={{fontSize:16,flexShrink:0}}>⚠</span>
                  <span><strong>Critical compliance gaps identified in: {crits.join(", ")}.</strong> These represent your highest-priority risk exposures and should be addressed before the next program season.</span>
                </div>
              )}
            </div>

            {/* Response breakdown */}
            <div style={s.breakdown}>
              <div style={s.breakdownTitle}>Response Summary</div>
              {QUESTIONS.map((q,i)=>{
                const v = answers[i];
                const opt = q.opts.find(o=>o.v===v);
                return (
                  <div key={i} style={{...s.respRow, borderBottom:i<QUESTIONS.length-1?`1px solid #F5F2EC`:"none"}}>
                    <div style={s.respDot(q.critical)}/>
                    <div style={{flex:1}}>
                      <div style={s.respDomain}>{q.domain}{q.critical?" · Core Compliance":""}</div>
                      <div style={s.respQ}>{q.q}</div>
                      {opt && <span style={s.respAns(v)}>{v===2?"✓":v===1?"~":"✕"} {opt.t}</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Risk register */}
            <div style={s.riskSummary}>
              <div style={s.riskTitle}>Risk Register — Where You Stand</div>
              {RISKS.map((risk,i)=>{
                const qi = QUESTIONS.findIndex(q=>q.domain===risk.domain);
                const v = qi>=0 ? answers[qi] : null;
                let tag, cls;
                if(v===2){tag="Managed";cls="l";}
                else if(v===1){tag="Moderate Risk";cls="m";}
                else if(v===0&&qi>=0&&QUESTIONS[qi].critical){tag="Critical";cls="c";}
                else if(v===0){tag="High Risk";cls="h";}
                else{tag="Not Assessed";cls="";}
                return (
                  <div key={i} style={{...s.riskRow, borderBottom:i<RISKS.length-1?`1px solid rgba(226,221,212,.55)`:"none"}}>
                    <span style={s.riskName}>{risk.name}</span>
                    <span style={s.riskTag(cls)}>{tag}</span>
                  </div>
                );
              })}
            </div>

            {/* Send block */}
            <div style={s.sendBlock}>
              <div style={s.sendTitle}>Send Your Results to Safeguardia Group</div>
              <p style={s.sendDesc}>Click the button below to send your results directly to Sheldon Phillips, JD. Your score, responses, and organization details are included automatically. He will follow up within one business day — at no obligation.</p>
              <div style={s.sendRow}>
                <button
                  style={s.btnSend(sendState==="sending", sendState==="success")}
                  onClick={sendState==="idle"||sendState==="error" ? sendResults : undefined}
                  disabled={sendState==="sending"||sendState==="success"}
                >
                  {sendState==="sending"?"Sending..." : sendState==="success"?"✓ Results Sent" : "Send My Results →"}
                </button>
              </div>
              {sendState !== "idle" && (
                <div style={s.statusBox(sendState)}>
                  {sendState==="success" ? <><strong>Results sent successfully.</strong> {statusMsg}</> : statusMsg}
                </div>
              )}
            </div>

            {/* CTA */}
            <div style={s.cta}>
              <div style={s.ctaEyebrow}>Next Step</div>
              <h3 style={s.ctaTitle}>{rubric.cta}</h3>
              <p style={s.ctaBody}>A full YOWSA audit covers 55 items across 7 weighted domains and produces a comprehensive compliance report, priority gap analysis, and documented due diligence record. The first consultation is always complimentary.</p>
              <div style={s.ctaContact}>sheldonphillips@mac.com · 443-735-3504 · safeguardiagroup.com</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
