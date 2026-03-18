import { useState, useEffect } from "react";
import { Analytics } from '@vercel/analytics/react';

// ─── TOKENS ───────────────────────────────────────────────────────────────────
var BG = "#080810";
var CARD = "#0E0E1A";
var LIGHT = "#13131F";
var BORDER = "#1E1E30";
var BLUE = "#4F6EF7";
var BLUE_DIM = "#2A3A8A";
var BLUE_GLOW = "rgba(79,110,247,0.15)";
var WHITE = "#F0F0FF";
var DIM = "#8888AA";
var MUTED = "#44445A";
var GREEN = "#2ECC8A";
var RED = "#E05555";
var YELLOW = "#F7C44F";

// ─── DATA ─────────────────────────────────────────────────────────────────────
var CATS = [
  { id: "money", icon: "💰", label: "Money & Finance", color: "#F7C44F", desc: "Bills, refunds, insurance, loans", list: ["Dispute a medical bill", "Challenge insurance denial", "Negotiate a refund", "Dispute credit card charge", "Challenge bank fees", "Request debt forgiveness"] },
  { id: "work", icon: "💼", label: "Work & Career", color: "#4F6EF7", desc: "Salary, contracts, unfair treatment", list: ["Negotiate a salary raise", "Respond to unfair review", "Request flexible working", "Challenge wrongful dismissal", "Ask for a promotion", "Negotiate job offer"] },
  { id: "legal", icon: "⚖️", label: "Legal & Rights", color: "#E05555", desc: "Landlords, disputes, demand letters", list: ["Challenge unfair eviction", "Write a legal demand letter", "Dispute contract terms", "Challenge a parking fine", "Report a business", "Respond to legal threat"] },
  { id: "biz", icon: "🚀", label: "Business & Sales", color: "#2ECC8A", desc: "Pitches, proposals, client disputes", list: ["Pitch to an investor", "Win a contract proposal", "Handle difficult client", "Raise your prices", "Chase unpaid invoice", "Respond to negative review"] },
  { id: "personal", icon: "🤝", label: "Personal & Social", color: "#B44FF7", desc: "Difficult conversations, boundaries", list: ["Set a boundary firmly", "Address a conflict", "Decline without burning bridges", "Confront someone fairly", "Repair a relationship", "Ask for an apology"] },
  { id: "health", icon: "🏥", label: "Health & Medical", color: "#4FD1F7", desc: "Doctors, insurers, second opinions", list: ["Request a second opinion", "Challenge a diagnosis", "Dispute medical charges", "Advocate for better care", "Request medical records", "Escalate ignored symptoms"] },
];

var PLANS = [
  { id: "personal", name: "Personal", mo: 19, yr: 182, tag: "For individuals navigating hard moments.", features: ["20 situations/month", "All categories", "Email & letter formats", "Copy & download", "Basic tone control"], paystackUrl: "https://paystack.shop/pay/mirar-personal" },
  { id: "pro", name: "Professional", mo: 79, yr: 758, badge: "Most popular", tag: "For freelancers and small business owners.", features: ["Unlimited situations", "All categories", "Advanced tone & format", "Follow-up sequences", "Save history", "Priority generation"], paystackUrl: "https://paystack.shop/pay/mirar-professional" },
  { id: "business", name: "Business", mo: 199, yr: 1910, tag: "For growing teams.", features: ["Everything in Pro", "5 team seats", "Brand voice training", "CRM-ready exports", "API access", "Dedicated onboarding"], paystackUrl: "https://paystack.shop/pay/mirar-business" },
];

var PAYSTACK_KEY = "pk_live_aeca5e435625d6885b49d2625aff660c97492d87";

// ─── STYLES ───────────────────────────────────────────────────────────────────
function Styles() {
  useEffect(function() {
    var el = document.createElement("style");
    el.id = "v-styles";
    el.textContent = "@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');\n*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}\nbody{background:" + BG + ";color:" + WHITE + ";font-family:'Outfit',sans-serif;-webkit-font-smoothing:antialiased}\ninput,textarea,button,select{font-family:'Outfit',sans-serif}\ninput::placeholder,textarea::placeholder{color:" + MUTED + "}\n::-webkit-scrollbar{width:4px}\n::-webkit-scrollbar-thumb{background:" + BORDER + ";border-radius:2px}\n@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}\n@keyframes spin{to{transform:rotate(360deg)}}\n@keyframes toast{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}";
    if (!document.getElementById("v-styles")) document.head.appendChild(el);
    return function() { try { var s = document.getElementById("v-styles"); if (s) s.parentNode.removeChild(s); } catch(e) {} };
  }, []);
  return null;
}

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────
function Btn(p) {
  var hov = useState(false);
  var isH = hov[0]; var setH = hov[1];
  var bg = p.danger ? (isH ? "#c04" : RED) : p.ghost ? "transparent" : p.disabled ? BLUE_DIM : isH ? "#6B84F9" : BLUE;
  var bd = p.ghost ? "1px solid " + (isH ? BLUE : BORDER) : p.danger ? "1px solid " + RED : "1px solid transparent";
  var col = p.ghost ? (isH ? BLUE : DIM) : WHITE;
  return (
    <button
      onClick={p.onClick} disabled={p.disabled}
      onMouseEnter={function() { setH(true); }}
      onMouseLeave={function() { setH(false); }}
      style={{ background: bg, border: bd, color: col, fontSize: p.sm ? "12px" : "14px", fontWeight: 500, padding: p.sm ? "7px 13px" : "12px 22px", borderRadius: "8px", cursor: p.disabled ? "not-allowed" : "pointer", width: p.full ? "100%" : "auto", opacity: p.disabled ? 0.45 : 1, boxShadow: !p.ghost && !p.danger && isH && !p.disabled ? "0 0 24px rgba(79,110,247,0.3)" : "none", transition: "all 160ms ease" }}>
      {p.children}
    </button>
  );
}

function Input(p) {
  var foc = useState(false);
  var isF = foc[0]; var setF = foc[1];
  var base = { background: LIGHT, border: "1px solid " + (p.err ? RED : isF ? BLUE : BORDER), borderRadius: "8px", color: WHITE, fontSize: "14px", lineHeight: "1.6", outline: "none", padding: "12px 14px", width: "100%", transition: "border-color 160ms", boxShadow: isF && !p.err ? "0 0 0 3px " + BLUE_GLOW : "none" };
  return (
    <div>
      {p.label && <div style={{ fontSize: "11px", color: DIM, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "5px" }}>{p.label}</div>}
      {p.multi
        ? <textarea value={p.value} onChange={p.onChange} placeholder={p.ph} rows={p.rows || 4} onFocus={function() { setF(true); }} onBlur={function() { setF(false); }} style={{ ...base, resize: "vertical" }} />
        : <input type={p.type || "text"} value={p.value} onChange={p.onChange} placeholder={p.ph} onFocus={function() { setF(true); }} onBlur={function() { setF(false); }} style={base} />
      }
      {p.err && <div style={{ fontSize: "12px", color: RED, marginTop: "4px" }}>{p.err}</div>}
      {p.hint && !p.err && <div style={{ fontSize: "11px", color: MUTED, marginTop: "4px" }}>{p.hint}</div>}
    </div>
  );
}

function Card(p) {
  return <div onClick={p.onClick} style={{ background: CARD, border: "1px solid " + BORDER, borderRadius: "12px", padding: p.pad || "24px", boxShadow: p.glow ? "0 0 40px " + BLUE_GLOW : "none", cursor: p.onClick ? "pointer" : "auto", ...(p.style || {}) }}>{p.children}</div>;
}

function Tag(p) {
  var c = p.color || BLUE;
  return <span style={{ background: c + "22", border: "1px solid " + c + "44", color: c, fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "20px", letterSpacing: "0.05em" }}>{p.children}</span>;
}

function Toggle(p) {
  return (
    <div onClick={p.onChange} style={{ width: "38px", height: "20px", borderRadius: "10px", background: p.on ? BLUE : BORDER, position: "relative", cursor: "pointer", transition: "background 200ms", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: "3px", left: p.on ? "21px" : "3px", width: "14px", height: "14px", borderRadius: "50%", background: WHITE, transition: "left 200ms" }} />
    </div>
  );
}

function Spin() {
  return <div style={{ width: "28px", height: "28px", border: "3px solid " + BORDER, borderTopColor: BLUE, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />;
}

function Bg() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(79,110,247,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(79,110,247,0.03) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      <div style={{ position: "absolute", top: "-20%", left: "55%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle,rgba(79,110,247,0.07) 0%,transparent 70%)" }} />
      <div style={{ position: "absolute", bottom: "-10%", left: "-10%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle,rgba(46,204,138,0.04) 0%,transparent 70%)" }} />
    </div>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast(p) {
  useEffect(function() { var t = setTimeout(p.onDone, 3000); return function() { clearTimeout(t); }; }, []);
  var c = p.type === "success" ? GREEN : p.type === "error" ? RED : BLUE;
  return (
    <div style={{ position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)", background: CARD, border: "1px solid " + c, borderRadius: "10px", padding: "12px 20px", zIndex: 9999, animation: "toast 250ms ease", boxShadow: "0 8px 32px rgba(0,0,0,0.5)", display: "flex", alignItems: "center", gap: "10px", minWidth: "220px", justifyContent: "center" }}>
      <span style={{ color: c }}>{p.type === "success" ? "✓" : p.type === "error" ? "✗" : "i"}</span>
      <span style={{ fontSize: "13px", color: WHITE }}>{p.msg}</span>
    </div>
  );
}

function useToast() {
  var st = useState(null);
  var toast = st[0]; var setToast = st[1];
  function show(msg, type) { setToast({ msg: msg, type: type || "success", id: Date.now() }); }
  return { toast: toast, show: show, hide: function() { setToast(null); } };
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal(p) {
  useEffect(function() {
    function onKey(e) { if (e.key === "Escape") p.onClose(); }
    document.addEventListener("keydown", onKey);
    return function() { document.removeEventListener("keydown", onKey); };
  }, []);
  return (
    <div onClick={p.onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div onClick={function(e) { e.stopPropagation(); }} style={{ background: CARD, border: "1px solid " + BORDER, borderRadius: "14px", padding: "28px", width: "100%", maxWidth: "420px", animation: "fadeUp 200ms ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <div style={{ fontSize: "17px", fontWeight: 700, color: WHITE }}>{p.title}</div>
          <span onClick={p.onClose} style={{ fontSize: "18px", color: DIM, cursor: "pointer" }}>✕</span>
        </div>
        {p.children}
      </div>
    </div>
  );
}

// ─── COOKIE BANNER ────────────────────────────────────────────────────────────
function Cookie(p) {
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: CARD, borderTop: "1px solid " + BORDER, padding: "14px 20px", zIndex: 200, display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap", justifyContent: "space-between" }}>
      <div style={{ fontSize: "12px", color: DIM, lineHeight: 1.6, maxWidth: "580px" }}>
        We use essential session cookies only — no tracking, no ads. <span style={{ color: BLUE, cursor: "pointer" }}>Privacy Policy</span>
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <Btn sm ghost onClick={p.onAccept}>Decline non-essential</Btn>
        <Btn sm onClick={p.onAccept}>Accept</Btn>
      </div>
    </div>
  );
}

// ─── LANDING ──────────────────────────────────────────────────────────────────
function Landing(p) {
  var vis = useState(false);
  var show = vis[0]; var setShow = vis[1];
  useEffect(function() { var t = setTimeout(function() { setShow(true); }, 60); return function() { clearTimeout(t); }; }, []);
  var proof = [
    { icon: "💊", t: "Maria recovered $8,400 from a denied insurance claim." },
    { icon: "💼", t: "James negotiated a $24k salary increase in one conversation." },
    { icon: "🏠", t: "Priya stopped an illegal eviction with one letter in 40 seconds." },
    { icon: "📋", t: "David won a $60k contract with a proposal in 3 minutes." },
  ];
  var anim = { opacity: show ? 1 : 0, transform: show ? "none" : "translateY(14px)", transition: "all 700ms ease" };
  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 32px", borderBottom: "1px solid " + BORDER }}>
        <div style={{ fontSize: "22px", fontWeight: 800, color: WHITE, letterSpacing: "-0.02em" }}>Mirar<span style={{ color: BLUE }}>.</span></div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span onClick={p.onSignIn} style={{ fontSize: "14px", color: DIM, cursor: "pointer" }}>Sign in</span>
          <Btn onClick={p.onSignUp}>Get started free</Btn>
        </div>
      </nav>

      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "80px 24px 60px", textAlign: "center", ...anim }}>
        <Tag color={GREEN}>Available globally · Works in 190+ countries</Tag>
        <h1 style={{ fontSize: "clamp(36px,7vw,72px)", fontWeight: 800, color: WHITE, lineHeight: 1.05, letterSpacing: "-0.03em", margin: "18px 0" }}>
          Say the right thing.<br /><span style={{ color: BLUE }}>Every time.</span>
        </h1>
        <p style={{ fontSize: "clamp(15px,2vw,18px)", color: DIM, lineHeight: 1.7, maxWidth: "520px", margin: "0 auto 36px" }}>
          Mirar gives anyone the exact right words for any high-stakes situation — instantly. Negotiations, disputes, demands, pitches. Whatever you're facing, we tell you exactly what to say.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Btn onClick={p.onSignUp}>Try free — no card needed</Btn>
          <Btn ghost onClick={p.onOwner}>Owner Preview</Btn>
        </div>
        <p style={{ marginTop: "10px", fontSize: "12px", color: MUTED }}>No credit card · 7-day trial · Cancel anytime</p>
      </div>

      <div style={{ maxWidth: "820px", margin: "0 auto 64px", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: "12px" }}>
        {proof.map(function(item, i) {
          return (
            <Card key={i} style={{ animation: show ? "fadeUp 500ms ease " + (i * 80 + 200) + "ms both" : "none" }}>
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>{item.icon}</div>
              <div style={{ fontSize: "13px", color: DIM, lineHeight: 1.6 }}>{item.t}</div>
            </Card>
          );
        })}
      </div>

      <div style={{ borderTop: "1px solid " + BORDER, borderBottom: "1px solid " + BORDER, padding: "40px 24px", marginBottom: "64px" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: "24px", textAlign: "center" }}>
          {[["2.3B+", "People losing out from saying the wrong thing"], ["$480B", "Lost annually to failed negotiations"], ["94%", "Don't know their rights when facing an institution"]].map(function(s) {
            return (
              <div key={s[0]}>
                <div style={{ fontSize: "38px", fontWeight: 800, color: BLUE, marginBottom: "6px" }}>{s[0]}</div>
                <div style={{ fontSize: "13px", color: DIM, lineHeight: 1.5 }}>{s[1]}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ maxWidth: "820px", margin: "0 auto 64px", padding: "0 24px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: 700, color: WHITE, textAlign: "center", marginBottom: "8px" }}>Every situation. Covered.</h2>
        <p style={{ fontSize: "14px", color: DIM, textAlign: "center", marginBottom: "28px" }}>From insurance disputes to investor pitches.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "10px" }}>
          {CATS.map(function(c) {
            return (
              <Card key={c.id}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "22px", flexShrink: 0 }}>{c.icon}</span>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: WHITE, marginBottom: "2px" }}>{c.label}</div>
                    <div style={{ fontSize: "12px", color: DIM, lineHeight: 1.5 }}>{c.desc}</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "64px 24px", borderTop: "1px solid " + BORDER }}>
        <h2 style={{ fontSize: "clamp(26px,4vw,44px)", fontWeight: 800, color: WHITE, marginBottom: "12px", letterSpacing: "-0.02em" }}>Stop losing because you didn't<br />say the right thing.</h2>
        <p style={{ fontSize: "15px", color: DIM, marginBottom: "32px" }}>Join thousands who finally have the words.</p>
        <Btn onClick={p.onSignUp}>Start for free</Btn>
        <div style={{ marginTop: "28px", display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
          {["Terms & Conditions", "Privacy Policy", "Contact"].map(function(l) { return <span key={l} style={{ fontSize: "12px", color: MUTED, cursor: "pointer" }}>{l}</span>; })}
          <span onClick={p.onOwner} style={{ fontSize: "12px", color: MUTED, cursor: "pointer" }}>Owner Preview →</span>
        </div>
      </div>
    </div>
  );
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function Auth(p) {
  var isUp = p.mode === "signup";
  var s = {
    name: useState(""), email: useState(""), pass: useState(""), confirm: useState(""),
    showPass: useState(false), agreed: useState(false), forgot: useState(false),
    forgotSent: useState(false), loading: useState(false), verify: useState(false),
    strength: useState(0), errors: useState({}), showTerms: useState(false), showPrivacy: useState(false),
  };

  function getS(k) { return s[k][0]; }
  function setS(k, v) { s[k][1](v); }

  function calcStrength(v) {
    var n = 0;
    if (v.length >= 8) n++;
    if (/[A-Z]/.test(v)) n++;
    if (/[0-9]/.test(v)) n++;
    if (/[^A-Za-z0-9]/.test(v)) n++;
    setS("strength", n);
  }

  function validate() {
    var e = {};
    if (isUp && !getS("name").trim()) e.name = "Name is required";
    if (!getS("email").includes("@") || !getS("email").includes(".")) e.email = "Enter a valid email";
    if (getS("pass").length < 8) e.pass = "At least 8 characters";
    if (isUp && getS("pass") !== getS("confirm")) e.confirm = "Passwords do not match";
    if (isUp && !getS("agreed")) e.agreed = "Please accept the terms";
    setS("errors", e);
    return Object.keys(e).length === 0;
  }

  function submit() {
    if (!validate()) return;
    setS("loading", true);
    setTimeout(function() {
      setS("loading", false);
      if (isUp) setS("verify", true);
      else p.onSuccess(getS("email").split("@")[0] || "Member");
    }, 900);
  }

  var SC = ["", RED, YELLOW, BLUE, GREEN];
  var SL = ["", "Weak", "Fair", "Good", "Strong"];
  var errs = getS("errors");

  if (getS("loading")) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", position: "relative", zIndex: 1 }}>
      <Spin /><div style={{ fontSize: "14px", color: DIM }}>Just a moment...</div>
    </div>
  );

  if (getS("verify")) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: "400px", width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📬</div>
        <div style={{ fontSize: "22px", fontWeight: 700, color: WHITE, marginBottom: "8px" }}>Check your inbox</div>
        <div style={{ fontSize: "14px", color: DIM, lineHeight: 1.7, marginBottom: "24px" }}>
          A verification link has been sent to <strong style={{ color: WHITE }}>{getS("email")}</strong>. Click it to activate your account.
        </div>
        <div style={{ fontSize: "12px", color: MUTED, marginBottom: "20px" }}>Didn't get it? Check your spam folder.</div>
        <Btn full onClick={function() { p.onSuccess(getS("name") || "Member"); }}>I've verified — continue →</Btn>
        <div style={{ marginTop: "14px" }}>
          <span onClick={function() { setS("verify", false); }} style={{ fontSize: "13px", color: BLUE, cursor: "pointer" }}>← Back</span>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", position: "relative", zIndex: 1 }}>
      {getS("showTerms") && <TermsModal onClose={function() { setS("showTerms", false); }} />}
      {getS("showPrivacy") && (
        <Modal title="Privacy Policy" onClose={function() { setS("showPrivacy", false); }}>
          <div style={{ fontSize: "13px", color: DIM, lineHeight: 1.8, maxHeight: "360px", overflowY: "auto" }}>
            <p><strong style={{ color: WHITE }}>What we collect:</strong> Name, email, situation history, preferences.</p><br />
            <p><strong style={{ color: WHITE }}>What we never do:</strong> Sell data, share with advertisers, or use your situations to train AI without consent.</p><br />
            <p><strong style={{ color: WHITE }}>Payments:</strong> Processed by Paystack. Full card numbers never stored.</p><br />
            <p><strong style={{ color: WHITE }}>Your rights:</strong> Download or delete all data anytime from Settings. Deletion completes within 30 days.</p><br />
            <p><strong style={{ color: WHITE }}>Cookies:</strong> Essential session cookies only. No tracking cookies.</p><br />
            <p><strong style={{ color: WHITE }}>Contact:</strong> privacy@mirar.app</p>
          </div>
          <div style={{ marginTop: "18px" }}><Btn full onClick={function() { setS("showPrivacy", false); }}>Close</Btn></div>
        </Modal>
      )}
      <div style={{ maxWidth: "400px", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "24px", fontWeight: 800, color: WHITE, marginBottom: "6px" }}>
            {isUp ? "Create your account" : getS("forgot") ? "Reset your password" : "Welcome back"}
          </div>
          <div style={{ fontSize: "14px", color: DIM }}>
            {isUp ? "Free to start. No card needed." : getS("forgot") ? "Enter your email for a reset link." : "Sign in to your Mirar account."}
          </div>
        </div>

        {!getS("forgot") && (
          <>
            <div style={{ display: "flex", gap: "10px", marginBottom: "18px" }}>
              {[["G", "Google"], ["A", "Apple"]].map(function(item) {
                return (
                  <button key={item[0]} onClick={function() { p.onSuccess("Member"); }} style={{ flex: 1, background: CARD, border: "1px solid " + BORDER, borderRadius: "8px", padding: "10px", cursor: "pointer", color: DIM, fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <strong style={{ color: WHITE }}>{item[0]}</strong> Continue with {item[1]}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
              <div style={{ flex: 1, height: "1px", background: BORDER }} />
              <span style={{ fontSize: "12px", color: MUTED }}>or with email</span>
              <div style={{ flex: 1, height: "1px", background: BORDER }} />
            </div>
          </>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {isUp && <Input label="Full name" ph="Your full name" value={getS("name")} onChange={function(e) { setS("name", e.target.value); }} err={errs.name} />}
          <Input label="Email" ph="your@email.com" type="email" value={getS("email")} onChange={function(e) { setS("email", e.target.value); }} err={errs.email} />
          {!getS("forgot") && (
            <div>
              <div style={{ position: "relative" }}>
                <Input label="Password" ph="At least 8 characters" type={getS("showPass") ? "text" : "password"} value={getS("pass")} onChange={function(e) { setS("pass", e.target.value); if (isUp) calcStrength(e.target.value); }} err={errs.pass} />
                <span onClick={function() { setS("showPass", !getS("showPass")); }} style={{ position: "absolute", right: "12px", bottom: errs.pass ? "26px" : "12px", fontSize: "12px", color: BLUE, cursor: "pointer" }}>{getS("showPass") ? "Hide" : "Show"}</span>
              </div>
              {isUp && getS("pass").length > 0 && (
                <div style={{ marginTop: "6px" }}>
                  <div style={{ display: "flex", gap: "3px", marginBottom: "3px" }}>
                    {[1,2,3,4].map(function(n) { return <div key={n} style={{ flex: 1, height: "3px", borderRadius: "2px", background: n <= getS("strength") ? SC[getS("strength")] : BORDER, transition: "background 200ms" }} />; })}
                  </div>
                  <div style={{ fontSize: "11px", color: SC[getS("strength")] }}>{SL[getS("strength")]}</div>
                </div>
              )}
            </div>
          )}
          {isUp && <Input label="Confirm password" ph="Repeat your password" type="password" value={getS("confirm")} onChange={function(e) { setS("confirm", e.target.value); }} err={errs.confirm} />}
        </div>

        {isUp && (
          <div style={{ marginTop: "14px" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <div onClick={function() { setS("agreed", !getS("agreed")); }} style={{ width: "16px", height: "16px", flexShrink: 0, marginTop: "2px", border: "1px solid " + (getS("agreed") ? BLUE : BORDER), borderRadius: "3px", background: getS("agreed") ? BLUE : "transparent", cursor: "pointer", transition: "all 140ms", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {getS("agreed") && <span style={{ color: WHITE, fontSize: "10px" }}>✓</span>}
              </div>
              <div style={{ fontSize: "12px", color: DIM, lineHeight: 1.6 }}>
                I agree to the <span onClick={function() { setS("showTerms", true); }} style={{ color: BLUE, cursor: "pointer" }}>Terms & Conditions</span> and <span onClick={function() { setS("showPrivacy", true); }} style={{ color: BLUE, cursor: "pointer" }}>Privacy Policy</span>. Mirar never sells my data.
              </div>
            </div>
            {errs.agreed && <div style={{ fontSize: "12px", color: RED, marginTop: "5px" }}>{errs.agreed}</div>}
          </div>
        )}

        <div style={{ marginTop: "18px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {getS("forgot") ? (
            getS("forgotSent") ? (
              <Card><div style={{ fontSize: "13px", color: DIM, lineHeight: 1.7, textAlign: "center" }}>If that email exists in our system, a reset link is on its way. Check inbox and spam.</div></Card>
            ) : (
              <Btn full onClick={function() { setS("forgotSent", true); }}>Send reset link</Btn>
            )
          ) : (
            <Btn full onClick={submit}>{isUp ? "Create account" : "Sign in"}</Btn>
          )}
          {!isUp && (
            <div style={{ textAlign: "center" }}>
              <span onClick={function() { setS("forgot", !getS("forgot")); setS("forgotSent", false); }} style={{ fontSize: "13px", color: BLUE, cursor: "pointer" }}>
                {getS("forgot") ? "← Back to sign in" : "Forgot password?"}
              </span>
            </div>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: "16px", fontSize: "13px", color: DIM }}>
          {isUp ? "Already have an account? " : "Don't have an account? "}
          <span onClick={p.onSwitch} style={{ color: BLUE, cursor: "pointer" }}>{isUp ? "Sign in" : "Sign up free"}</span>
        </div>

        {isUp && (
          <Card style={{ marginTop: "16px" }}>
            <div style={{ fontSize: "11px", color: MUTED, lineHeight: 1.7 }}>🔒 Data encrypted at rest and in transit. We never sell your information. Delete your account and all data anytime from Settings.</div>
          </Card>
        )}
      </div>
    </div>
  );
}

// ─── PRICING ──────────────────────────────────────────────────────────────────
function Pricing(p) {
  var b = useState("monthly");
  var billing = b[0]; var setBilling = b[1];
  return (
    <div style={{ position: "relative", zIndex: 1, padding: p.embed ? "0" : "56px 24px" }}>
      {!p.embed && (
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "clamp(26px,5vw,42px)", fontWeight: 800, color: WHITE, marginBottom: "8px", letterSpacing: "-0.02em" }}>Simple, honest pricing.</h2>
          <p style={{ fontSize: "14px", color: DIM }}>Cancel anytime. No hidden fees. No surprises.</p>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
        <div style={{ background: CARD, padding: "4px", borderRadius: "8px", display: "flex", gap: "4px" }}>
          {["monthly", "annual"].map(function(x) {
            return (
              <button key={x} onClick={function() { setBilling(x); }} style={{ background: billing === x ? BLUE : "transparent", border: "none", borderRadius: "6px", color: billing === x ? WHITE : DIM, fontSize: "13px", fontWeight: 500, padding: "8px 16px", cursor: "pointer", transition: "all 160ms" }}>
                {x === "monthly" ? "Monthly" : "Annual · Save 20%"}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center", maxWidth: "900px", margin: "0 auto" }}>
        {PLANS.map(function(plan, i) {
          var price = billing === "monthly" ? plan.mo : Math.round(plan.yr / 12);
          var mid = i === 1;
          var cur = p.current === plan.id;
          return (
            <div key={plan.id} style={{ background: mid ? LIGHT : CARD, border: "1px solid " + (mid ? BLUE : BORDER), borderRadius: "14px", padding: plan.badge ? "36px 24px 28px" : "28px 24px", width: "270px", position: "relative", boxShadow: mid ? "0 0 36px " + BLUE_GLOW : "none" }}>
              {plan.badge && <div style={{ position: "absolute", top: "-1px", left: "50%", transform: "translateX(-50%)", background: BLUE, color: WHITE, fontSize: "11px", fontWeight: 600, padding: "4px 14px", borderRadius: "0 0 10px 10px", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{plan.badge}</div>}
              {cur && <div style={{ position: "absolute", top: "-11px", right: "16px" }}><Tag color={GREEN}>Current</Tag></div>}
              <div style={{ fontSize: "19px", fontWeight: 700, color: WHITE, marginBottom: "3px" }}>{plan.name}</div>
              <div style={{ fontSize: "12px", color: DIM, marginBottom: "18px", lineHeight: 1.5 }}>{plan.tag}</div>
              <div>
                <span style={{ fontSize: "40px", fontWeight: 800, color: WHITE }}>${price}</span>
                <span style={{ fontSize: "13px", color: DIM }}>/mo</span>
              </div>
              {billing === "annual" && <div style={{ fontSize: "12px", color: GREEN, marginTop: "3px", marginBottom: "10px" }}>${plan.yr}/year</div>}
              <div style={{ height: "1px", background: BORDER, margin: "16px 0" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "22px" }}>
                {plan.features.map(function(f) {
                  return (
                    <div key={f} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                      <span style={{ color: GREEN, fontSize: "11px", marginTop: "2px", flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: "13px", color: DIM, lineHeight: 1.4 }}>{f}</span>
                    </div>
                  );
                })}
              </div>
              {cur
                ? <div style={{ fontSize: "12px", color: GREEN, textAlign: "center", padding: "8px" }}>✓ Your current plan</div>
                : <Btn full ghost={!mid} onClick={function() { p.onSelect(plan); }}>Get started</Btn>
              }
            </div>
          );
        })}
      </div>
      <div style={{ textAlign: "center", marginTop: "28px", fontSize: "12px", color: MUTED, lineHeight: 1.8 }}>
        7-day free trial on all plans · Auto-renewal disclosed before charge · Cancel anytime from Settings
      </div>
    </div>
  );
}

// ─── PAYMENT — REAL PAYSTACK ──────────────────────────────────────────────────
function Payment(p) {
  var em = useState("");
  var email = em[0]; var setEmail = em[1];
  var nm = useState("");
  var name = nm[0]; var setName = nm[1];
  var ld = useState(false);
  var loading = ld[0]; var setLoading = ld[1];
  var dn = useState(false);
  var done = dn[0]; var setDone = dn[1];
  var er = useState({});
  var errs = er[0]; var setErrs = er[1];

  // Load Paystack script once
  useEffect(function() {
    if (document.getElementById("paystack-script")) return;
    var script = document.createElement("script");
    script.id = "paystack-script";
    script.src = "https://js.paystack.co/v1/inline.js";
    document.head.appendChild(script);
  }, []);

  function validate() {
    var e = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.includes("@") || !email.includes(".")) e.email = "Enter a valid email address";
    setErrs(e);
    return Object.keys(e).length === 0;
  }

  function pay() {
    if (!validate()) return;
    setLoading(true);

    var handler = window.PaystackPop.setup({
      key: PAYSTACK_KEY,
      email: email,
      amount: p.plan.mo * 100, // Paystack uses kobo/cents
      currency: "USD",
      ref: "mirar_" + Date.now(),
      metadata: {
        custom_fields: [
          { display_name: "Customer Name", variable_name: "name", value: name },
          { display_name: "Plan", variable_name: "plan", value: p.plan.name },
        ]
      },
      callback: function(response) {
        setLoading(false);
        setDone(true);
        setTimeout(function() { p.onSuccess(p.plan); }, 3000);
      },
      onClose: function() {
        setLoading(false);
      },
    });

    handler.openIframe();
  }

  // Also provide direct payment page link as fallback
  function openDirect() {
    window.open(p.plan.paystackUrl + "?email=" + encodeURIComponent(email), "_blank");
    setDone(true);
    setTimeout(function() { p.onSuccess(p.plan); }, 2000);
  }

  if (done) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "40px", position: "relative", zIndex: 1 }}>
      <div style={{ fontSize: "52px", marginBottom: "18px" }}>⚡</div>
      <h2 style={{ fontSize: "40px", fontWeight: 800, color: WHITE, marginBottom: "10px", letterSpacing: "-0.02em" }}>You're in.</h2>
      <p style={{ fontSize: "15px", color: DIM }}>Welcome to Mirar. Your payment is being processed.</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: "420px", width: "100%" }}>
        <span onClick={p.onBack} style={{ fontSize: "13px", color: BLUE, cursor: "pointer", display: "block", marginBottom: "24px" }}>← Change plan</span>

        <div style={{ fontSize: "22px", fontWeight: 700, color: WHITE, marginBottom: "4px" }}>Complete your upgrade.</div>
        <div style={{ fontSize: "14px", color: BLUE, marginBottom: "24px" }}>{p.plan.name} — ${p.plan.mo}/month</div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
          <Input label="Full name" ph="Your full name" value={name} onChange={function(e) { setName(e.target.value); }} err={errs.name} />
          <Input label="Email address" ph="your@email.com" type="email" value={email} onChange={function(e) { setEmail(e.target.value); }} err={errs.email} hint="Your receipt and account access will be sent here" />
        </div>

        <Card style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "11px", color: MUTED, lineHeight: 1.7 }}>
            🔒 Payments processed securely by <strong style={{ color: DIM }}>Paystack</strong>. Your card details are handled entirely by Paystack — Mirar never sees or stores them. Statement shows <strong style={{ color: DIM }}>MIRAR</strong>.
          </div>
        </Card>

        <Btn full onClick={pay} disabled={loading}>
          {loading ? "Opening payment..." : "Pay $" + p.plan.mo + "/month with Paystack"}
        </Btn>

        <div style={{ margin: "14px 0", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ flex: 1, height: "1px", background: BORDER }} />
          <span style={{ fontSize: "11px", color: MUTED }}>or</span>
          <div style={{ flex: 1, height: "1px", background: BORDER }} />
        </div>

        <Btn full ghost onClick={openDirect} disabled={!email || !email.includes("@")}>
          Pay via Paystack payment page →
        </Btn>

        <div style={{ marginTop: "12px", fontSize: "11px", color: MUTED, textAlign: "center", lineHeight: 1.7 }}>
          Cancel anytime from Settings · Subscription managed by Paystack
        </div>
      </div>
    </div>
  );
}

// ─── BUILDER ──────────────────────────────────────────────────────────────────
function Builder(p) {
  var st = useState("cat");
  var step = st[0]; var setStep = st[1];
  var ct = useState(null);
  var cat = ct[0]; var setCat = ct[1];
  var si = useState("");
  var sit = si[0]; var setSit = si[1];
  var de = useState("");
  var details = de[0]; var setDetails = de[1];
  var ou = useState("");
  var outcome = ou[0]; var setOutcome = ou[1];
  var to = useState("firm");
  var tone = to[0]; var setTone = to[1];
  var fm = useState("email");
  var fmt = fm[0]; var setFmt = fm[1];

  var tones = ["firm", "assertive", "professional", "empathetic", "urgent"];
  var fmts = ["email", "letter", "script", "message", "proposal"];

  if (step === "cat") return (
    <div>
      <div style={{ fontSize: "22px", fontWeight: 700, color: WHITE, marginBottom: "6px" }}>What's the situation?</div>
      <div style={{ fontSize: "14px", color: DIM, marginBottom: "22px" }}>Choose a category to get started.</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "10px" }}>
        {CATS.map(function(c) {
          return (
            <div key={c.id} onClick={function() { setCat(c); setStep("sit"); }}
              style={{ background: CARD, border: "1px solid " + BORDER, borderRadius: "10px", padding: "16px", cursor: "pointer", transition: "all 160ms" }}
              onMouseEnter={function(e) { e.currentTarget.style.borderColor = c.color; e.currentTarget.style.background = c.color + "11"; }}
              onMouseLeave={function(e) { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.background = CARD; }}>
              <div style={{ fontSize: "22px", marginBottom: "7px" }}>{c.icon}</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: WHITE, marginBottom: "2px" }}>{c.label}</div>
              <div style={{ fontSize: "12px", color: DIM, lineHeight: 1.4 }}>{c.desc}</div>
            </div>
          );
        })}
      </div>
      {p.history.length > 0 && (
        <div style={{ marginTop: "32px" }}>
          <div style={{ fontSize: "14px", fontWeight: 600, color: WHITE, marginBottom: "10px" }}>Recent</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {p.history.slice(0, 3).map(function(h, i) {
              return (
                <div key={i} onClick={function() { p.onGen(h); }} style={{ background: CARD, border: "1px solid " + BORDER, borderRadius: "8px", padding: "12px 14px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "13px", color: WHITE }}>{h.situation}</div>
                    <div style={{ fontSize: "11px", color: DIM, marginTop: "2px" }}>{h.category} · {h.format}</div>
                  </div>
                  <span style={{ color: BLUE, fontSize: "12px" }}>→</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  if (step === "sit") return (
    <div>
      <button onClick={function() { setStep("cat"); }} style={{ background: "none", border: "none", color: BLUE, fontSize: "13px", cursor: "pointer", marginBottom: "18px", padding: 0 }}>← Back</button>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
        <span style={{ fontSize: "22px" }}>{cat.icon}</span>
        <div style={{ fontSize: "20px", fontWeight: 700, color: WHITE }}>{cat.label}</div>
      </div>
      <div style={{ fontSize: "14px", color: DIM, marginBottom: "20px" }}>Choose a situation or describe your own.</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "8px", marginBottom: "16px" }}>
        {cat.list.map(function(s) {
          return (
            <div key={s} onClick={function() { setSit(s); setStep("details"); }}
              style={{ background: sit === s ? cat.color + "22" : CARD, border: "1px solid " + (sit === s ? cat.color : BORDER), borderRadius: "8px", padding: "11px 14px", cursor: "pointer", fontSize: "13px", color: WHITE, transition: "all 140ms" }}>
              {s}
            </div>
          );
        })}
      </div>
      <Input ph="Or describe your own situation..." value={sit} onChange={function(e) { setSit(e.target.value); }} />
      <div style={{ marginTop: "14px" }}><Btn onClick={function() { if (sit) setStep("details"); }} disabled={!sit}>Continue →</Btn></div>
    </div>
  );

  return (
    <div>
      <button onClick={function() { setStep("sit"); }} style={{ background: "none", border: "none", color: BLUE, fontSize: "13px", cursor: "pointer", marginBottom: "18px", padding: 0 }}>← Back</button>
      <div style={{ fontSize: "20px", fontWeight: 700, color: WHITE, marginBottom: "4px" }}>Tell us what happened.</div>
      <div style={{ fontSize: "14px", color: DIM, marginBottom: "22px" }}>The more detail, the more powerful the output.</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <Input label="Situation details" ph="Describe exactly what happened, who is involved, and any relevant context..." value={details} onChange={function(e) { setDetails(e.target.value); }} multi rows={5} />
        <Input label="Desired outcome" ph="What do you want to achieve? (e.g. full refund, $15k raise, eviction notice withdrawn)" value={outcome} onChange={function(e) { setOutcome(e.target.value); }} />
        <div>
          <div style={{ fontSize: "11px", color: DIM, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "9px" }}>Tone</div>
          <div style={{ display: "flex", gap: "7px", flexWrap: "wrap" }}>
            {tones.map(function(t) {
              return <button key={t} onClick={function() { setTone(t); }} style={{ background: tone === t ? BLUE : CARD, border: "1px solid " + (tone === t ? BLUE : BORDER), color: tone === t ? WHITE : DIM, fontSize: "13px", padding: "7px 13px", borderRadius: "20px", cursor: "pointer", transition: "all 140ms", textTransform: "capitalize" }}>{t}</button>;
            })}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "11px", color: DIM, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "9px" }}>Format</div>
          <div style={{ display: "flex", gap: "7px", flexWrap: "wrap" }}>
            {fmts.map(function(f) {
              return <button key={f} onClick={function() { setFmt(f); }} style={{ background: fmt === f ? BLUE : CARD, border: "1px solid " + (fmt === f ? BLUE : BORDER), color: fmt === f ? WHITE : DIM, fontSize: "13px", padding: "7px 13px", borderRadius: "20px", cursor: "pointer", transition: "all 140ms", textTransform: "capitalize" }}>{f}</button>;
            })}
          </div>
        </div>
      </div>
      <div style={{ marginTop: "24px" }}>
        <Btn full onClick={function() { if (details) p.onGen({ situation: sit, details: details, outcome: outcome, tone: tone, format: fmt, category: cat.label }); }} disabled={!details}>⚡ Mirar it</Btn>
      </div>
    </div>
  );
}

// ─── OUTPUT ───────────────────────────────────────────────────────────────────
function Output(p) {
  var out = useState("");
  var output = out[0]; var setOutput = out[1];
  var ld = useState(true);
  var loading = ld[0]; var setLoading = ld[1];
  var er = useState(null);
  var err = er[0]; var setErr = er[1];
  var tb = useState("main");
  var tab = tb[0]; var setTab = tb[1];
  var sv = useState(false);
  var saved = sv[0]; var setSaved = sv[1];
  var fup = useState("");
  var followup = fup[0]; var setFollowup = fup[1];
  var pb = useState("");
  var pushback = pb[0]; var setPushback = pb[1];

  var ph = useState(0);
  var phraseIdx = ph[0]; var setPhraseIdx = ph[1];

  var PHRASES = [
    "Mirar is reading your situation...",
    "Mirar is choosing the right words...",
    "Mirar is finding your voice...",
    "Mirar is crafting your message...",
    "Mirar is making it count...",
    "Almost ready. This one matters.",
  ];

  useEffect(function() {
    if (!loading) return;
    setPhraseIdx(0);
    var iv = setInterval(function() {
      setPhraseIdx(function(i) { return i < PHRASES.length - 1 ? i + 1 : i; });
    }, 1800);
    return function() { clearInterval(iv); };
  }, [loading]);

  useEffect(function() { gen(); }, []);

  function gen() {
    setLoading(true); setErr(null); setOutput(""); setFollowup(""); setPushback("");

    var systemPrompt = "You are Mirar — a communication expert who helps real people say the right thing in difficult, high-stakes moments. You write like a trusted advisor who genuinely cares about the person's outcome. Your outputs always feel human — warm where warmth helps, firm where firmness is needed, never robotic or cold. You understand that behind every situation is a real person under real pressure. Write with that in mind. Never add preamble, meta-commentary, or explanations. Produce only the output itself, ready to use immediately.";

    var mainPrompt = "Situation: " + p.req.situation + "\nCategory: " + p.req.category + "\nDetails: " + p.req.details + "\nDesired outcome: " + (p.req.outcome || "Best possible outcome") + "\nTone: " + p.req.tone + "\nFormat: " + p.req.format + "\n\nGenerate a complete, ready-to-use " + p.req.format + " for this person. Make it powerful, human, and specific. It should feel like it was written by someone who genuinely understands what this person is going through — not a template.";

    var bgPrompt = "Situation: " + p.req.situation + "\nCategory: " + p.req.category + "\nDetails: " + p.req.details + "\nTone: " + p.req.tone + "\nFormat: " + p.req.format + "\n\nGenerate TWO outputs separated exactly by ---PUSHBACK---:\n\n1. A follow-up " + p.req.format + " to send in 5-7 days if no response. Same human tone. Reference the situation naturally.\n\n---PUSHBACK---\n\n2. A response if they push back or deny. Calm but immovable. Human but firm.";

    // First call — main output, fast
    fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 800,
        system: systemPrompt,
        messages: [{ role: "user", content: mainPrompt }],
      }),
    })
    .then(function(r) {
      if (!r.ok) return r.text().then(function(t) { throw new Error(t || r.status); });
      return r.json();
    })
    .then(function(d) {
      var main = (d.content || []).map(function(b) { return b.text || ""; }).join("").trim();
      if (!main) throw new Error("empty");
      setOutput(main);
      setLoading(false);

      // Second call — background, follow-up + pushback
      fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: "user", content: bgPrompt }],
        }),
      })
      .then(function(r) { return r.json(); })
      .then(function(d) {
        var text = (d.content || []).map(function(b) { return b.text || ""; }).join("");
        var parts = text.split("---PUSHBACK---");
        setFollowup(parts[0] ? parts[0].trim() : "");
        setPushback(parts[1] ? parts[1].trim() : "");
      })
      .catch(function() {}); // silent fail on background call
    })
    .catch(function(e) {
      setErr(navigator.onLine ? "Generation failed. Please try again." : "You appear to be offline. Please check your connection.");
      setLoading(false);
    });
  }

  function copy() {
    var content = tab === "main" ? output : tab === "followup" ? followup : pushback;
    navigator.clipboard.writeText(content).then(function() { p.toast("Copied to clipboard", "success"); }).catch(function() { p.toast("Copy failed — select text manually", "error"); });
  }

  function save() {
    if (saved) return;
    p.onSave(p.req, output);
    setSaved(true);
    p.toast("Saved to history", "success");
  }

  var tabs = [["main", "Your " + p.req.format], ["followup", "Follow-up"], ["pushback", "If they say no"]];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", marginBottom: "5px" }}>
            <Tag color={GREEN}>{p.req.category}</Tag>
            <Tag color={BLUE}>{p.req.format}</Tag>
            <Tag color={YELLOW}>{p.req.tone}</Tag>
          </div>
          <div style={{ fontSize: "17px", fontWeight: 700, color: WHITE }}>{p.req.situation}</div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <Btn sm ghost onClick={gen}>Regenerate</Btn>
          <Btn sm ghost onClick={p.onNew}>New</Btn>
        </div>
      </div>
      <div style={{ display: "flex", gap: "3px", marginBottom: "12px", background: CARD, padding: "4px", borderRadius: "8px", width: "fit-content" }}>
        {tabs.map(function(t) {
          return <button key={t[0]} onClick={function() { setTab(t[0]); }} style={{ background: tab === t[0] ? BLUE : "transparent", border: "none", borderRadius: "6px", color: tab === t[0] ? WHITE : DIM, fontSize: "12px", fontWeight: 500, padding: "6px 11px", cursor: "pointer", transition: "all 140ms" }}>{t[1]}</button>;
        })}
      </div>
      <Card glow style={{ minHeight: "240px" }}>
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "240px", gap: "16px" }}>
            <Spin />
            <div style={{ fontSize: "14px", color: BLUE, fontWeight: 500, textAlign: "center", transition: "opacity 400ms", minHeight: "22px" }}>
              {PHRASES[phraseIdx]}
            </div>
          </div>
        ) : err ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <div style={{ fontSize: "28px", marginBottom: "10px" }}>⚠️</div>
            <div style={{ fontSize: "13px", color: RED, marginBottom: "16px" }}>{err}</div>
            <Btn ghost onClick={gen}>Try again</Btn>
          </div>
        ) : (
          <div>
            {tab === "main" && <pre style={{ fontSize: "14px", color: WHITE, lineHeight: 1.8, whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0 }}>{output}</pre>}
            {tab === "followup" && (
              followup
                ? <pre style={{ fontSize: "14px", color: WHITE, lineHeight: 1.8, whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0 }}>{followup}</pre>
                : <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "160px", gap: "12px" }}>
                    <Spin /><div style={{ fontSize: "13px", color: DIM }}>Mirar is preparing your follow-up...</div>
                  </div>
            )}
            {tab === "pushback" && (
              pushback
                ? <pre style={{ fontSize: "14px", color: WHITE, lineHeight: 1.8, whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0 }}>{pushback}</pre>
                : <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "160px", gap: "12px" }}>
                    <Spin /><div style={{ fontSize: "13px", color: DIM }}>Mirar is preparing your response...</div>
                  </div>
            )}
          </div>
        )}
      </Card>
      {!loading && !err && (
        <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
          <Btn onClick={copy}>Copy to clipboard</Btn>
          <Btn ghost onClick={save} disabled={saved}>{saved ? "✓ Saved" : "Save to history"}</Btn>
        </div>
      )}
      {!loading && !err && (
        <Card style={{ marginTop: "16px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <span style={{ flexShrink: 0 }}>💡</span>
            <div style={{ fontSize: "13px", color: DIM, lineHeight: 1.7 }}><strong style={{ color: WHITE }}>Pro tip:</strong> Send within 24 hours. Keep a copy. For financial or legal disputes, always communicate via email — it creates a paper trail.</div>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── TERMS & CONDITIONS MODAL ─────────────────────────────────────────────────
function TermsModal(p) {
  return (
    <Modal title="Terms & Conditions" onClose={p.onClose}>
      <div style={{ fontSize: "13px", color: DIM, lineHeight: 1.8, maxHeight: "400px", overflowY: "auto" }}>
        <p><strong style={{ color: WHITE }}>Last updated: March 2026</strong></p><br />

        <p><strong style={{ color: WHITE }}>1. Acceptance</strong></p>
        <p>By creating an account or using Mirar, you agree to these Terms. If you do not agree, do not use the service.</p><br />

        <p><strong style={{ color: WHITE }}>2. What Mirar Is</strong></p>
        <p>Mirar is an AI-powered communication tool that helps users draft words for high-stakes situations. Mirar does not provide legal, financial, or medical advice. Outputs are for communication purposes only. Always consult a qualified professional for legal or financial matters.</p><br />

        <p><strong style={{ color: WHITE }}>3. Your Account</strong></p>
        <p>You are responsible for maintaining the security of your account and all activity under it. You must be 18 or older to use Mirar. You may not share your account with others.</p><br />

        <p><strong style={{ color: WHITE }}>4. Subscriptions & Billing</strong></p>
        <p>Subscriptions are billed monthly or annually via Paystack. Your subscription auto-renews unless cancelled. You may cancel at any time from Settings — cancellation takes effect at the end of the current billing period. No refunds are issued for partial periods. We reserve the right to change pricing with 30 days notice.</p><br />

        <p><strong style={{ color: WHITE }}>5. Free Trial</strong></p>
        <p>New subscribers receive a 7-day free trial. You will not be charged during the trial period. If you cancel before the trial ends, you will not be charged. After the trial, your selected plan billing begins automatically.</p><br />

        <p><strong style={{ color: WHITE }}>6. Acceptable Use</strong></p>
        <p>You may not use Mirar to generate content that is fraudulent, threatening, harassing, or illegal. You may not use outputs to impersonate others or make false claims. We reserve the right to suspend accounts that violate these terms without refund.</p><br />

        <p><strong style={{ color: WHITE }}>7. AI-Generated Content</strong></p>
        <p>Mirar uses AI to generate communication outputs. While we aim for quality and accuracy, we do not guarantee any specific outcome from using our outputs. Results depend on how outputs are used and the circumstances of each situation.</p><br />

        <p><strong style={{ color: WHITE }}>8. Intellectual Property</strong></p>
        <p>Outputs generated by Mirar using your inputs belong to you. The Mirar platform, brand, and underlying technology belong to Mirar. You may not copy, resell, or redistribute the Mirar platform or its interface.</p><br />

        <p><strong style={{ color: WHITE }}>9. Privacy</strong></p>
        <p>Your use of Mirar is governed by our Privacy Policy, which is incorporated into these Terms by reference.</p><br />

        <p><strong style={{ color: WHITE }}>10. Limitation of Liability</strong></p>
        <p>Mirar is provided as-is. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service. Our total liability to you shall not exceed the amount you paid us in the 3 months preceding any claim.</p><br />

        <p><strong style={{ color: WHITE }}>11. Changes to Terms</strong></p>
        <p>We may update these Terms from time to time. We will notify you by email at least 14 days before material changes take effect. Continued use after that date constitutes acceptance.</p><br />

        <p><strong style={{ color: WHITE }}>12. Contact</strong></p>
        <p>Questions about these Terms: legal@mirar.app</p>
      </div>
      <div style={{ marginTop: "18px" }}><Btn full onClick={p.onClose}>I understand — close</Btn></div>
    </Modal>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dash(p) {
  var nv = useState("Generate");
  var nav = nv[0]; var setNav = nv[1];
  var rq = useState(null);
  var req = rq[0]; var setReq = rq[1];
  var hi = useState([]);
  var hist = hi[0]; var setHist = hi[1];
  var sb = useState(false);
  var open = sb[0]; var setOpen = sb[1];

  // Settings state
  var pn = useState(p.userName);
  var profName = pn[0]; var setProfName = pn[1];
  var pe = useState("member@email.com");
  var profEmail = pe[0]; var setProfEmail = pe[1];
  var cp = useState("");
  var curPass = cp[0]; var setCurPass = cp[1];
  var np = useState("");
  var newPass = np[0]; var setNewPass = np[1];
  var cnp = useState("");
  var confPass = cnp[0]; var setConfPass = cnp[1];
  var n1 = useState(true);
  var notif1 = n1[0]; var setN1 = n1[1];
  var n2 = useState(false);
  var notif2 = n2[0]; var setN2 = n2[1];

  // Modals
  var cm = useState(false);
  var cancelMod = cm[0]; var setCancelMod = cm[1];
  var dm = useState(false);
  var deleteMod = dm[0]; var setDeleteMod = dm[1];
  var dt = useState("");
  var delText = dt[0]; var setDelText = dt[1];
  var um = useState(false);
  var updateMod = um[0]; var setUpdateMod = um[1];
  var pm = useState(false);
  var privMod = pm[0]; var setPrivMod = pm[1];
  var tm = useState(false);
  var termsMod = tm[0]; var setTermsMod = tm[1];

  var NAV = ["Generate", "History", "Pricing", "Settings"];

  function go(item) { setNav(item); setReq(null); setOpen(false); }

  function saveProfile() { p.toast("Profile updated", "success"); }
  function changePass() {
    if (!curPass) { p.toast("Enter current password", "error"); return; }
    if (newPass.length < 8) { p.toast("New password must be 8+ characters", "error"); return; }
    if (newPass !== confPass) { p.toast("Passwords don't match", "error"); return; }
    setCurPass(""); setNewPass(""); setConfPass("");
    p.toast("Password updated", "success");
  }
  function download() {
    var blob = new Blob([JSON.stringify({ name: profName, email: profEmail, history: hist, exported: new Date().toISOString() }, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a"); a.href = url; a.download = "mirar-data.json"; a.click();
    URL.revokeObjectURL(url);
    p.toast("Data downloaded", "success");
  }

  return (
    <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>

      {/* Modals */}
      {termsMod && <TermsModal onClose={function() { setTermsMod(false); }} />}

      {privMod && (
        <Modal title="Privacy Policy" onClose={function() { setPrivMod(false); }}>
          <div style={{ fontSize: "13px", color: DIM, lineHeight: 1.8, maxHeight: "360px", overflowY: "auto" }}>
            <p><strong style={{ color: WHITE }}>What we collect:</strong> Name, email, situation history, preferences.</p><br />
            <p><strong style={{ color: WHITE }}>What we never do:</strong> Sell data, share with advertisers, or use your situations to train AI without consent.</p><br />
            <p><strong style={{ color: WHITE }}>Payments:</strong> Processed by Paystack. Full card numbers never stored.</p><br />
            <p><strong style={{ color: WHITE }}>Your rights:</strong> Download or delete all data anytime from Settings. Deletion completes within 30 days.</p><br />
            <p><strong style={{ color: WHITE }}>Cookies:</strong> Essential session cookies only. No tracking cookies.</p><br />
            <p><strong style={{ color: WHITE }}>Contact:</strong> privacy@mirar.app</p>
          </div>
          <div style={{ marginTop: "18px" }}><Btn full onClick={function() { setPrivMod(false); }}>Close</Btn></div>
        </Modal>
      )}

      {cancelMod && (
        <Modal title="Cancel subscription" onClose={function() { setCancelMod(false); }}>
          <div style={{ fontSize: "14px", color: DIM, lineHeight: 1.7, marginBottom: "18px" }}>Your access continues until the billing period ends. Data and history are preserved. Resubscribe anytime.</div>
          <div style={{ display: "flex", gap: "10px" }}>
            <Btn full ghost onClick={function() { setCancelMod(false); }}>Keep subscription</Btn>
            <Btn full danger onClick={function() { setCancelMod(false); p.toast("Subscription cancelled. Access continues until period ends.", "success"); }}>Yes, cancel</Btn>
          </div>
        </Modal>
      )}

      {deleteMod && (
        <Modal title="Delete everything" onClose={function() { setDeleteMod(false); setDelText(""); }}>
          <div style={{ fontSize: "14px", color: DIM, lineHeight: 1.7, marginBottom: "14px" }}>This permanently deletes your account, all history, all outputs, and all personal data. Cannot be undone.</div>
          <Input label='Type "delete" to confirm' ph="delete" value={delText} onChange={function(e) { setDelText(e.target.value); }} />
          <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
            <Btn full ghost onClick={function() { setDeleteMod(false); setDelText(""); }}>Cancel</Btn>
            <Btn full danger disabled={delText.toLowerCase() !== "delete"} onClick={function() { setDeleteMod(false); p.toast("Account deleted.", "success"); }}>Delete permanently</Btn>
          </div>
        </Modal>
      )}

      {updateMod && (
        <Modal title="Update payment method" onClose={function() { setUpdateMod(false); }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Input label="Card number" ph="1234 5678 9012 3456" value="" onChange={function() {}} />
            <div style={{ display: "flex", gap: "12px" }}>
              <Input label="Expiry" ph="MM/YY" value="" onChange={function() {}} />
              <Input label="CVV" ph="···" value="" onChange={function() {}} />
            </div>
          </div>
          <div style={{ marginTop: "14px" }}><Btn full onClick={function() { setUpdateMod(false); p.toast("Payment method updated", "success"); }}>Save card</Btn></div>
          <div style={{ marginTop: "8px", fontSize: "11px", color: MUTED }}>🔒 Processed by Stripe. Full card never stored.</div>
        </Modal>
      )}

      {/* Sidebar overlay — only the dark backdrop, not the sidebar itself */}
      {open && (
        <div
          onClick={function() { setOpen(false); }}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 40 }}
        />
      )}

      {/* Sidebar — always fixed, slides off-screen when closed */}
      <div style={{
        position: "fixed", top: 0, left: open ? 0 : "-220px",
        width: "200px", height: "100%",
        background: BG, borderRight: "1px solid " + BORDER,
        display: "flex", flexDirection: "column",
        zIndex: 50, transition: "left 260ms ease",
        overflowY: "auto",
      }}>
        <div style={{ padding: "18px 18px 16px", borderBottom: "1px solid " + BORDER, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "19px", fontWeight: 800, color: WHITE, letterSpacing: "-0.02em" }}>Mirar<span style={{ color: BLUE }}>.</span></div>
          <span onClick={function() { setOpen(false); }} style={{ fontSize: "17px", color: DIM, cursor: "pointer", lineHeight: 1 }}>✕</span>
        </div>
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px", padding: "10px 8px" }}>
          {NAV.map(function(item) {
            return (
              <button key={item} onClick={function() { go(item); }}
                style={{ background: nav === item ? BLUE_GLOW : "transparent", border: "1px solid " + (nav === item ? BLUE_DIM : "transparent"), color: nav === item ? WHITE : DIM, fontSize: "13px", fontWeight: nav === item ? 600 : 400, padding: "9px 14px", borderRadius: "8px", cursor: "pointer", textAlign: "left", transition: "all 140ms" }}>
                {item}
              </button>
            );
          })}
        </nav>
        <div style={{ padding: "14px 18px", borderTop: "1px solid " + BORDER }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: GREEN, flexShrink: 0 }} />
            <div style={{ fontSize: "11px", color: GREEN, fontWeight: 600 }}>{p.plan ? p.plan.name : "Free"} Plan</div>
          </div>
          <div style={{ fontSize: "11px", color: MUTED, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "10px" }}>{p.userName}</div>
          {p.onExit && <span onClick={p.onExit} style={{ fontSize: "11px", color: MUTED, cursor: "pointer" }}>← Exit preview</span>}
        </div>
      </div>

      {/* Top bar — always full width */}
      <div style={{ position: "sticky", top: 0, zIndex: 30, background: BG, borderBottom: "1px solid " + BORDER, display: "flex", alignItems: "center", padding: "13px 18px", gap: "12px" }}>
        <button onClick={function() { setOpen(true); }} style={{ background: "none", border: "none", cursor: "pointer", color: WHITE, fontSize: "19px", lineHeight: 1, padding: "2px 6px 2px 0", flexShrink: 0 }}>☰</button>
        <div style={{ fontSize: "15px", fontWeight: 600, color: WHITE }}>{nav}</div>
        <div style={{ marginLeft: "auto", fontSize: "11px", color: GREEN, fontWeight: 600 }}>{p.plan ? p.plan.name : "Free"}</div>
      </div>

      {/* Page content — full width, tapping closes sidebar */}
      <div
        onClick={function() { if (open) setOpen(false); }}
        style={{ padding: "22px 18px", maxWidth: "720px", margin: "0 auto" }}
      >
        {nav === "Generate" && (
          req
            ? <Output req={req} onNew={function() { setReq(null); }} onSave={function(r, o) { setHist(function(prev) { return [{ situation: r.situation, category: r.category, format: r.format, tone: r.tone, details: r.details, outcome: r.outcome, output: o, date: new Date().toLocaleDateString() }].concat(prev); }); }} toast={p.toast} />
            : <Builder onGen={function(r) { setReq(r); }} history={hist} />
        )}

        {nav === "History" && (
          <div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: WHITE, marginBottom: "6px" }}>History</div>
            <div style={{ fontSize: "14px", color: DIM, marginBottom: "22px" }}>Your saved situations and outputs.</div>
            {hist.length === 0 ? (
              <Card style={{ textAlign: "center", padding: "48px" }}>
                <div style={{ fontSize: "30px", marginBottom: "10px" }}>📋</div>
                <div style={{ fontSize: "14px", color: DIM, marginBottom: "14px" }}>No saved situations yet.</div>
                <Btn ghost onClick={function() { go("Generate"); }}>Generate your first situation</Btn>
              </Card>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {hist.map(function(h, i) {
                  return (
                    <Card key={i} onClick={function() { setReq(h); setNav("Generate"); }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div style={{ display: "flex", gap: "6px", marginBottom: "6px", flexWrap: "wrap" }}>
                            <Tag color={BLUE}>{h.category}</Tag>
                            <Tag color={GREEN}>{h.format}</Tag>
                          </div>
                          <div style={{ fontSize: "14px", color: WHITE, marginBottom: "2px" }}>{h.situation}</div>
                          <div style={{ fontSize: "11px", color: DIM }}>{h.date}</div>
                        </div>
                        <span style={{ color: BLUE, fontSize: "13px", flexShrink: 0, marginLeft: "10px" }}>View →</span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {nav === "Pricing" && (
          <div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: WHITE, marginBottom: "6px" }}>Your Plan</div>
            <div style={{ fontSize: "14px", color: DIM, marginBottom: "22px" }}>Upgrade for unlimited situations and advanced features.</div>
            <Pricing onSelect={p.onUpgrade} current={p.plan ? p.plan.id : null} embed={true} />
          </div>
        )}

        {nav === "Settings" && (
          <div style={{ maxWidth: "480px" }}>
            <div style={{ fontSize: "20px", fontWeight: 700, color: WHITE, marginBottom: "24px" }}>Settings</div>

            {[
              {
                title: "Profile",
                content: (
                  <div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <Input label="Full name" value={profName} onChange={function(e) { setProfName(e.target.value); }} ph="Your name" />
                      <Input label="Email" value={profEmail} onChange={function(e) { setProfEmail(e.target.value); }} ph="your@email.com" type="email" />
                    </div>
                    <div style={{ marginTop: "12px" }}><Btn ghost onClick={saveProfile}>Save changes</Btn></div>
                  </div>
                )
              },
              {
                title: "Change Password",
                content: (
                  <div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <Input label="Current password" ph="Current password" type="password" value={curPass} onChange={function(e) { setCurPass(e.target.value); }} />
                      <Input label="New password" ph="At least 8 characters" type="password" value={newPass} onChange={function(e) { setNewPass(e.target.value); }} />
                      <Input label="Confirm new password" ph="Repeat new password" type="password" value={confPass} onChange={function(e) { setConfPass(e.target.value); }} />
                    </div>
                    <div style={{ marginTop: "12px" }}><Btn ghost onClick={changePass}>Update password</Btn></div>
                  </div>
                )
              },
              {
                title: "Notifications",
                content: (
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {[["Weekly tips & updates", notif1, function() { setN1(!notif1); }], ["Product announcements", notif2, function() { setN2(!notif2); }]].map(function(row) {
                      return (
                        <div key={row[0]} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "13px", color: DIM }}>{row[0]}</span>
                          <Toggle on={row[1]} onChange={row[2]} />
                        </div>
                      );
                    })}
                  </div>
                )
              },
              {
                title: "Privacy & Data",
                content: (
                  <div>
                    <div style={{ fontSize: "13px", color: DIM, lineHeight: 1.7, marginBottom: "14px" }}>Mirar stores your situation history and account details only. We never sell your data. Everything is encrypted at rest and in transit.</div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <Btn sm ghost onClick={download}>Download my data</Btn>
                      <Btn sm ghost onClick={function() { setPrivMod(true); }}>Privacy policy</Btn>
                      <Btn sm ghost onClick={function() { setTermsMod(true); }}>Terms & conditions</Btn>
                    </div>
                  </div>
                )
              },
              {
                title: "Billing",
                content: (
                  <div>
                    <div style={{ fontSize: "13px", color: DIM, marginBottom: "4px" }}>Current plan: <strong style={{ color: WHITE }}>{p.plan ? p.plan.name : "Free"}</strong></div>
                    <div style={{ fontSize: "13px", color: DIM, marginBottom: "14px" }}>Next billing date: <strong style={{ color: WHITE }}>April 18, 2026</strong></div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
                      <Btn sm ghost onClick={function() { setUpdateMod(true); }}>Update payment method</Btn>
                      <Btn sm ghost onClick={function() { p.toast("Invoice sent to your email", "success"); }}>Email invoices</Btn>
                    </div>
                    <div style={{ fontSize: "12px", color: MUTED, marginBottom: "12px" }}>Statement shows <strong style={{ color: DIM }}>MIRAR</strong> — no other branding.</div>
                    <span onClick={function() { setCancelMod(true); }} style={{ fontSize: "13px", color: RED, cursor: "pointer" }}>Cancel subscription</span>
                  </div>
                )
              },
            ].map(function(section) {
              return (
                <div key={section.title} style={{ paddingBottom: "24px", marginBottom: "24px", borderBottom: "1px solid " + BORDER }}>
                  <div style={{ fontSize: "11px", color: DIM, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "14px" }}>{section.title}</div>
                  {section.content}
                </div>
              );
            })}

            <div>
              <div style={{ fontSize: "11px", color: MUTED, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>Danger Zone</div>
              <div style={{ fontSize: "13px", color: DIM, lineHeight: 1.7, marginBottom: "12px" }}>Permanently delete your account and all data. Cannot be reversed.</div>
              <Btn sm danger onClick={function() { setDeleteMod(true); }}>Delete account permanently</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  Styles();
  var sc = useState("landing");
  var screen = sc[0]; var setScreen = sc[1];
  var un = useState("");
  var userName = un[0]; var setUserName = un[1];
  var pl = useState(null);
  var plan = pl[0]; var setPlan = pl[1];
  var pp = useState(null);
  var pending = pp[0]; var setPending = pp[1];
  var ck = useState(false);
  var cookie = ck[0]; var setCookie = ck[1];
  var toaster = useToast();

  function go(s) { setScreen(s); }
  function owner() { setUserName("Allan"); setPlan(PLANS[1]); setCookie(true); go("dashboard"); }

  return (
    <div style={{ minHeight: "100vh", background: BG }}>
      <Bg />
      {screen === "landing" && <Landing onSignUp={function() { go("signup"); }} onSignIn={function() { go("signin"); }} onOwner={owner} />}
      {screen === "signup" && <Auth mode="signup" onSuccess={function(n) { setUserName(n); setCookie(true); go("dashboard"); }} onSwitch={function() { go("signin"); }} />}
      {screen === "signin" && <Auth mode="signin" onSuccess={function(n) { setUserName(n); setPlan(PLANS[0]); setCookie(true); go("dashboard"); }} onSwitch={function() { go("signup"); }} />}
      {screen === "payment" && pending && <Payment plan={pending} onSuccess={function(pl) { setPlan(pl); go("dashboard"); toaster.show("Welcome to " + pl.name + "!", "success"); }} onBack={function() { go(plan ? "dashboard" : "pricing"); }} />}
      {screen === "dashboard" && <Dash userName={userName} plan={plan} onUpgrade={function(pl) { setPending(pl); go("payment"); }} onExit={function() { go("landing"); }} toast={toaster.show} />}
      {!cookie && screen === "landing" && <Cookie onAccept={function() { setCookie(true); }} />}
      {toaster.toast && <Toast key={toaster.toast.id} msg={toaster.toast.msg} type={toaster.toast.type} onDone={toaster.hide} />}
      <Analytics />
    </div>
  );
}
