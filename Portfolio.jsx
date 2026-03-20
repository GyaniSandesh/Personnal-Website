import { useState, useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";

// ─── DESIGN TOKENS ─────────────────────────────────────────────────────────
// Color rationale (science-backed):
//   Blue  #0077FF — trust, precision, authority. Aerospace/energy standard (GE, Siemens, BP).
//                   Most used color in engineering/tech for credibility signaling.
//   Amber #E8A020 — second-highest attention-capture after red. P&ID caution color.
//                   Used for data callouts, metrics, secondary highlights.
//   UNT Green #00853E — ONLY used for UNT institutional references. Signals affiliation.
//   Obsidian + Slate — high-contrast industrial dark base. Maximizes readability.
const C = {
  obsidian: "#0A0A0F",
  surface: "#0F0F16",
  card: "#13131C",
  cardHover: "#16161F",
  border: "#1C1C2E",
  borderMid: "#252538",
  slate: "#5E6078",
  slateLight: "#8B8FA8",
  white: "#EEEEF4",
  dim: "#2A2A3E",
  blue: "#0077FF",
  blueDim: "#003D85",
  blueGlow: "rgba(0,119,255,0.1)",
  blueMid: "#1A88FF",
  amber: "#E8A020",
  amberDim: "#7A5510",
  amberGlow: "rgba(232,160,32,0.1)",
  unt: "#00853E",
  untDim: "rgba(0,133,62,0.12)",
};

// ─── HOOKS ──────────────────────────────────────────────────────────────────
function useCountUp(target, duration = 1200, inView = true) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(+(p * target).toFixed(2));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);
  return val;
}

// ─── ATOMS ──────────────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, y = 28, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Tag({ children, color = "blue" }) {
  const colors = {
    blue: { border: C.blueDim, text: C.blue, bg: C.blueGlow },
    amber: { border: C.amberDim, text: C.amber, bg: C.amberGlow },
    unt: { border: "rgba(0,133,62,0.3)", text: C.unt, bg: C.untDim },
  };
  const c = colors[color];
  return (
    <span
      style={{
        border: `1px solid ${c.border}`,
        color: c.text,
        fontSize: "10px",
        letterSpacing: "0.12em",
        padding: "3px 10px",
        fontFamily: "'DM Mono', monospace",
        background: c.bg,
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 48 }}>
      <span style={{ color: C.blue, fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.25em" }}>
        {children}
      </span>
      <div style={{ flex: 1, height: "1px", background: C.border }} />
    </div>
  );
}

// ─── NAV ────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const links = ["Projects", "Expertise", "Academic", "Contact"];
  const scroll = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(10,10,15,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "none",
        transition: "all 0.3s ease", padding: "0 max(5vw, 24px)",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{ fontFamily: "'DM Mono', monospace", color: C.blue, fontSize: "13px", letterSpacing: "0.1em", background: "none", border: "none", cursor: "pointer" }}>
          SR /
        </button>
        <nav className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {links.map((l) => (
            <button key={l} onClick={() => scroll(l)}
              style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: C.slate, letterSpacing: "0.12em", background: "none", border: "none", cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.target.style.color = C.white)}
              onMouseLeave={(e) => (e.target.style.color = C.slate)}>
              {l.toLowerCase()}
            </button>
          ))}
          <a href="mailto:contact-sand_esh@proton.me"
            style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "#fff", background: C.blue, padding: "8px 20px", letterSpacing: "0.1em", textDecoration: "none", transition: "background 0.2s" }}
            onMouseEnter={(e) => (e.target.style.background = C.blueMid)}
            onMouseLeave={(e) => (e.target.style.background = C.blue)}>
            HIRE ME
          </a>
        </nav>
        <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: "none", border: "none", cursor: "pointer" }}>
          <div style={{ width: 22, display: "flex", flexDirection: "column", gap: 5 }}>
            <div style={{ height: 1, background: C.slateLight }} />
            <div style={{ height: 1, background: C.slateLight }} />
          </div>
        </button>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            style={{ background: C.surface, borderTop: `1px solid ${C.border}`, padding: "20px max(5vw, 24px)" }}>
            {links.map((l) => (
              <button key={l} onClick={() => scroll(l)}
                style={{ display: "block", fontFamily: "'DM Mono', monospace", fontSize: "13px", color: C.slateLight, letterSpacing: "0.1em", background: "none", border: "none", cursor: "pointer", padding: "12px 0", width: "100%", textAlign: "left" }}>
                {l.toLowerCase()}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────
function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, 50]);
  return (
    <section style={{ minHeight: "100vh", background: C.obsidian, display: "flex", alignItems: "center", padding: "0 max(5vw, 24px)", position: "relative", overflow: "hidden" }}>
      {/* Blueprint grid */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`, backgroundSize: "80px 80px", opacity: 0.4 }} />
      {/* Blue vignette — draws focus */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 65% 55% at 18% 50%, ${C.blueGlow} 0%, transparent 70%)`, pointerEvents: "none" }} />
      {/* Bottom accent */}
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "absolute", bottom: 0, left: 0, height: "2px", width: "100%", background: `linear-gradient(90deg, ${C.blue}, transparent 60%)`, transformOrigin: "left" }} />

      <motion.div style={{ y, position: "relative", maxWidth: 1100, margin: "0 auto", width: "100%" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          style={{ fontFamily: "'DM Mono', monospace", color: C.blue, fontSize: "10px", letterSpacing: "0.3em", marginBottom: 36 }}>
          001 — PORTFOLIO
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(56px, 11vw, 128px)", color: C.white, lineHeight: 0.92, letterSpacing: "0.02em", marginBottom: 8 }}>
          SANDESH<br />
          <span style={{ color: C.blue }}>REGMI</span>
        </motion.h1>

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.55 }}
          style={{ fontFamily: "'DM Mono', monospace", color: C.slate, fontSize: "clamp(10px, 1.8vw, 13px)", letterSpacing: "0.2em", marginTop: 28, marginBottom: 20 }}>
          MECHANICAL & ENERGY ENGINEERING —{" "}
          <span style={{ color: C.unt }}>UNIVERSITY OF NORTH TEXAS</span>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
          style={{ color: C.slateLight, fontSize: "clamp(15px, 2.2vw, 19px)", maxWidth: 560, lineHeight: 1.65, marginBottom: 48, fontFamily: "'DM Sans', sans-serif" }}>
          Developing high-efficiency mechanical systems and sustainable energy solutions.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
          style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
          <button onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            style={{ background: C.blue, color: "#fff", fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.14em", padding: "14px 32px", border: "none", cursor: "pointer", transition: "background 0.2s" }}
            onMouseEnter={(e) => (e.target.style.background = C.blueMid)}
            onMouseLeave={(e) => (e.target.style.background = C.blue)}>
            VIEW PROJECTS →
          </button>
          <a href="/resume.pdf" target="_blank"
            style={{ border: `1px solid ${C.borderMid}`, color: C.slateLight, fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.14em", padding: "14px 32px", textDecoration: "none", transition: "border-color 0.2s, color 0.2s" }}
            onMouseEnter={(e) => { e.target.style.borderColor = C.blue; e.target.style.color = C.white; }}
            onMouseLeave={(e) => { e.target.style.borderColor = C.borderMid; e.target.style.color = C.slateLight; }}>
            RÉSUMÉ
          </a>
        </motion.div>

        {/* GPA callout — amber for data metric, high attention */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
          className="hero-gpa"
          style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", textAlign: "right" }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 88, color: C.amber, lineHeight: 1 }}>3.77</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: C.slate, letterSpacing: "0.22em" }}>CUMULATIVE GPA</div>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
        style={{ position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: C.slate, letterSpacing: "0.25em" }}>SCROLL</div>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity }}
          style={{ width: 1, height: 30, background: C.blue }} />
      </motion.div>
    </section>
  );
}

// ─── PROJECTS ────────────────────────────────────────────────────────────────
function ProjectCard({ index, title, tag, problem, solution, result, metrics }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ border: `1px solid ${hovered ? C.blueDim : C.border}`, background: hovered ? C.cardHover : C.card, transition: "all 0.35s ease", padding: "clamp(28px, 5vw, 52px)", position: "relative", overflow: "hidden" }}>
      {/* Index bg number */}
      <div style={{ position: "absolute", top: 20, right: 28, fontFamily: "'Bebas Neue', sans-serif", fontSize: 80, lineHeight: 1, userSelect: "none", color: hovered ? C.borderMid : C.border, transition: "color 0.3s" }}>
        0{index + 1}
      </div>
      {/* Left blue accent bar */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "3px", height: hovered ? "100%" : "0%", background: C.blue, transition: "height 0.4s ease" }} />

      <Tag color="blue">{tag}</Tag>
      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(26px, 4vw, 42px)", color: C.white, letterSpacing: "0.03em", marginTop: 16, marginBottom: 36, lineHeight: 1 }}>
        {title}
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "24px 48px", marginBottom: 36 }}>
        {[{ label: "PROBLEM", text: problem }, { label: "SOLUTION", text: solution }, { label: "RESULT", text: result }].map(({ label, text }) => (
          <div key={label}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: C.blue, letterSpacing: "0.25em", marginBottom: 10 }}>{label}</div>
            <p style={{ color: C.slateLight, fontSize: 14, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>{text}</p>
          </div>
        ))}
      </div>

      {/* Metrics in amber — data callout color */}
      {metrics && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 28, borderTop: `1px solid ${C.border}`, paddingTop: 22 }}>
          {metrics.map((m) => (
            <div key={m.label} style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: C.amber }}>{m.value}</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: C.slate, letterSpacing: "0.14em" }}>{m.label}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function Projects() {
  const projects = [
    {
      title: "PASSIVE PROPELLED VEHICLE",
      tag: "MECHANICAL DESIGN / ENERGY EFFICIENCY",
      problem: "Design a vehicle that converts gravitational potential energy into forward motion with zero external power, while minimizing energy loss from friction and drag.",
      solution: "Engineered a low-friction chassis with optimized wheel geometry and mass distribution. Applied conservation of energy principles to maximize kinetic energy from a fixed elevation drop.",
      result: "Vehicle achieved peak efficiency by minimizing parasitic losses at axle bearings and reducing frontal area. Design validated through iterative physical testing and load analysis.",
      metrics: [{ value: "0W", label: "EXTERNAL POWER" }, { value: "∞", label: "ENERGY RATIO" }, { value: "Low-Friction", label: "BEARING DESIGN" }],
    },
    {
      title: "GRAVITY-BASED GOLF BALL SORTER",
      tag: "STRUCTURAL INTEGRITY / SORTING LOGIC",
      problem: "Build a passive sorting system that reliably separates solid golf balls from hollow practice balls without sensors, electronics, or external power.",
      solution: "Designed a dual-track gravity ramp exploiting density differences — solid balls follow the primary trajectory while hollow balls deflect via a calibrated aperture gate, using recycled structural materials.",
      result: "Achieved deterministic sort accuracy by leveraging physics over electronics. Structure remained rigid under repeated load cycles. Zero operational cost.",
      metrics: [{ value: "100%", label: "SORT ACCURACY" }, { value: "0", label: "POWERED COMPONENTS" }, { value: "Recycled", label: "MATERIAL SOURCE" }],
    },
  ];
  return (
    <section id="projects" style={{ background: C.obsidian, padding: "120px max(5vw, 24px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn><SectionLabel>002 — SELECTED PROJECTS</SectionLabel></FadeIn>
        <FadeIn delay={0.1}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(32px, 6vw, 68px)", color: C.white, letterSpacing: "0.02em", marginBottom: 56, lineHeight: 1.0 }}>
            ENGINEERING<br /><span style={{ color: C.slate }}>CASE STUDIES</span>
          </h2>
        </FadeIn>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {projects.map((p, i) => <ProjectCard key={i} index={i} {...p} />)}
        </div>
      </div>
    </section>
  );
}

// ─── EXPERTISE ──────────────────────────────────────────────────────────────
function SkillGroup({ label, skills, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, paddingBottom: 24 }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: C.blue, letterSpacing: "0.25em", marginBottom: 14 }}>{label}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {skills.map((s) => (
          <motion.div key={s} whileHover={{ y: -2 }}
            style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.slateLight, padding: "7px 14px", border: `1px solid ${C.border}`, background: C.card, cursor: "default", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.color = C.white; e.currentTarget.style.background = C.blueGlow; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.slateLight; e.currentTarget.style.background = C.card; }}>
            {s}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function Expertise() {
  const groups = [
    { label: "DESIGN & SIMULATION", skills: ["SolidWorks", "AutoCAD", "MATLAB", "FEA Analysis", "Thermodynamic Modeling"] },
    { label: "COMPUTATION & AUTOMATION", skills: ["Python", "SQL", "Linux / Bash", "Shell Scripting", "NumPy"] },
    { label: "ENGINEERING FUNDAMENTALS", skills: ["Statics & Dynamics", "Thermodynamics", "Fluid Mechanics", "Energy Systems", "Material Science"] },
  ];
  return (
    <section id="expertise" style={{ background: C.surface, padding: "120px max(5vw, 24px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn><SectionLabel>003 — TECHNICAL EXPERTISE</SectionLabel></FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 64, alignItems: "start" }}>
          <FadeIn delay={0.1}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(30px, 5vw, 56px)", color: C.white, lineHeight: 1.05, letterSpacing: "0.02em" }}>
              TOOLS THAT<br /><span style={{ color: C.blue }}>SOLVE PROBLEMS</span>
            </h2>
            <p style={{ color: C.slate, fontSize: 14, lineHeight: 1.75, marginTop: 24, fontFamily: "'DM Sans', sans-serif", maxWidth: 340 }}>
              Engineering is applied logic. Every tool below has been used to produce a measurable output — not just learned in isolation.
            </p>
            {/* YouTube block — amber draws eye to secondary content */}
            <div style={{ marginTop: 32, border: `1px solid ${C.amberDim}`, background: C.amberGlow, padding: "20px 24px" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: C.amber, letterSpacing: "0.25em", marginBottom: 8 }}>▶ YOUTUBE — TECHZWITHSANDESH</div>
              <p style={{ color: C.slateLight, fontSize: 13, lineHeight: 1.65, fontFamily: "'DM Sans', sans-serif" }}>
                Teaching Python and Linux to simplify engineering workflows. Real-world automation, not theory.
              </p>
              <a href="https://www.youtube.com/@techzwithsandesh" target="_blank" rel="noreferrer"
                style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.amber, textDecoration: "none", letterSpacing: "0.1em", display: "inline-block", marginTop: 10 }}>
                WATCH THE CHANNEL →
              </a>
            </div>
          </FadeIn>
          <div>
            {groups.map((g, i) => <SkillGroup key={g.label} delay={0.1 + i * 0.1} {...g} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── ACADEMIC ────────────────────────────────────────────────────────────────
function StatBlock({ value, label, delay, color = "amber" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const numericVal = parseFloat(value);
  const isNum = !isNaN(numericVal);
  const count = useCountUp(isNum ? numericVal : 0, 1000, inView);
  const accent = color === "blue" ? C.blue : C.amber;
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      style={{ borderTop: `2px solid ${accent}`, paddingTop: 18 }}>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(28px, 4vw, 50px)", color: accent, lineHeight: 1 }}>
        {isNum ? count.toFixed(value.includes(".") ? 2 : 0) : value}
      </div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: C.slate, letterSpacing: "0.18em", marginTop: 8 }}>{label}</div>
    </motion.div>
  );
}

function Academic() {
  // CORRECTED: Dallas College Fall 2024–Spring 2026 | UNT Fall 2026–Spring 2028
  const timeline = [
    {
      year: "FALL 2027",
      title: "Target: Tier-1 Energy Internship",
      desc: "Applying expertise in thermal systems, simulation, and automation to an industry-leading energy firm.",
      status: "target",
    },
    {
      year: "FALL 2026 – SPRING 2028",
      title: "University of North Texas — B.S. Mechanical & Energy Engineering",
      desc: "Transferring to UNT with a 3.77 GPA. Specialized coursework in energy systems, thermodynamics, fluid mechanics, and mechanical design.",
      status: "current",
    },
    {
      year: "FALL 2024 – SPRING 2026",
      title: "Dallas College — Foundation Engineering",
      desc: "Completed core mathematics and engineering prerequisites. Calculus III with an A. Built initial projects in structural design and computational engineering.",
      status: "done",
    },
  ];
  const dot = { target: C.amber, current: C.blue, done: C.slate };

  return (
    <section id="academic" style={{ background: C.obsidian, padding: "120px max(5vw, 24px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn><SectionLabel>004 — ACADEMIC PATH</SectionLabel></FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 64 }}>
          <FadeIn delay={0.1}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(30px, 5vw, 56px)", color: C.white, lineHeight: 1.05, letterSpacing: "0.02em", marginBottom: 40 }}>
              BUILT ON<br /><span style={{ color: C.white, opacity: 0.35 }}>DISCIPLINE</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
              <StatBlock value="3.77" label="CUMULATIVE GPA" delay={0.2} color="amber" />
              <StatBlock value="2028" label="GRADUATION TARGET" delay={0.3} color="blue" />
              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
                style={{ borderTop: `2px solid ${C.unt}`, paddingTop: 18 }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(22px, 3vw, 32px)", color: C.unt, lineHeight: 1 }}>UNT</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: C.slate, letterSpacing: "0.18em", marginTop: 8 }}>DESTINATION UNIVERSITY</div>
              </motion.div>
              <StatBlock value="ME" label="MECHANICAL & ENERGY" delay={0.5} color="blue" />
            </div>
          </FadeIn>

          {/* Timeline */}
          <FadeIn delay={0.2}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {timeline.map((item, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "12px 1fr", gap: 20 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: dot[item.status], flexShrink: 0 }} />
                    {i < timeline.length - 1 && <div style={{ flex: 1, width: "1px", background: C.border, marginTop: 6 }} />}
                  </div>
                  <div style={{ paddingBottom: 36 }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: dot[item.status], letterSpacing: "0.15em", marginBottom: 8 }}>{item.year}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: item.status === "done" ? C.slateLight : C.white, fontSize: 14, marginBottom: 8 }}>{item.title}</div>
                    <p style={{ color: C.slate, fontSize: 13, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────
function Contact() {
  const links = [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/regmisandesh/" },
    { label: "GitHub", href: "https://github.com/GyaniSandesh" },
    { label: "YouTube", href: "https://www.youtube.com/@techzwithsandesh" },
    { label: "Email", href: "mailto:contact-sand_esh@proton.me" },
  ];
  return (
    <section id="contact" style={{ background: C.surface, padding: "120px max(5vw, 24px)", borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn><SectionLabel>005 — CONTACT</SectionLabel></FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 80, alignItems: "start" }}>
          <FadeIn delay={0.1}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(36px, 6vw, 76px)", color: C.white, lineHeight: 0.95, letterSpacing: "0.02em", marginBottom: 24 }}>
              LET'S<br /><span style={{ color: C.blue }}>BUILD</span><br />SOMETHING.
            </h2>
            <p style={{ color: C.slate, fontSize: 14, lineHeight: 1.75, fontFamily: "'DM Sans', sans-serif", maxWidth: 340, marginBottom: 36 }}>
              Open to Fall 2027 internship opportunities in energy, mechanical systems, or sustainability engineering. Direct outreach only.
            </p>
            <a href="mailto:contact-sand_esh@proton.me"
              style={{ display: "inline-block", background: C.blue, color: "#fff", fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.14em", padding: "16px 40px", textDecoration: "none", transition: "background 0.2s" }}
              onMouseEnter={(e) => (e.target.style.background = C.blueMid)}
              onMouseLeave={(e) => (e.target.style.background = C.blue)}>
              SEND AN EMAIL →
            </a>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {links.map((l) => (
                <motion.a key={l.label} href={l.href} target="_blank" rel="noreferrer" whileHover={{ x: 8 }}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 0", borderBottom: `1px solid ${C.border}`, textDecoration: "none" }}
                  onMouseEnter={(e) => { e.currentTarget.querySelector(".lbl").style.color = C.blue; }}
                  onMouseLeave={(e) => { e.currentTarget.querySelector(".lbl").style.color = C.white; }}>
                  <span className="lbl" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: C.white, letterSpacing: "0.05em", transition: "color 0.2s" }}>{l.label}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.slate }}>↗</span>
                </motion.a>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: C.obsidian, borderTop: `1px solid ${C.border}`, padding: "24px max(5vw, 24px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.slate, letterSpacing: "0.12em" }}>© 2025 SANDESH REGMI</span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.unt, letterSpacing: "0.12em", opacity: 0.7 }}>UNT — MECHANICAL & ENERGY ENGINEERING</span>
      </div>
    </footer>
  );
}

// ─── ROOT ────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #0A0A0F; color: #EEEEF4; -webkit-font-smoothing: antialiased; }
        ::selection { background: #0077FF; color: #fff; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #0A0A0F; }
        ::-webkit-scrollbar-thumb { background: #0077FF; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .hero-gpa { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
          .hero-gpa { display: block !important; }
        }
      `}</style>
      <Nav />
      <main>
        <Hero />
        <Projects />
        <Expertise />
        <Academic />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
