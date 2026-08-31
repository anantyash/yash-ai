import React, { useState, useEffect, useRef } from "react";
import { portfolioData } from "../data/portfolioData";
import {
  Sparkles,
  Terminal,
  FileText,
  Github,
  Linkedin,
  Cpu,
  ShieldCheck,
  Award,
  Zap,
  CheckCircle2,
  Code2,
} from "lucide-react";
import { cn } from "../lib/utils";
import gsap from "gsap";

interface HeroProps {
  onOpenResume: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenResume }) => {
  const [lensMode, setLensMode] = useState<"system" | "model">("system");
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".gsap-hero-badge", { opacity: 0, y: -12, duration: 0.5 })
        .from(
          ".gsap-hero-title",
          { opacity: 0, y: 28, duration: 0.75 },
          "-=0.25",
        )
        .from(".gsap-hero-pitch", { opacity: 0, y: 18, duration: 0.6 }, "-=0.4")
        .from(
          ".gsap-hero-image",
          { opacity: 0, scale: 0.93, duration: 0.75 },
          "-=0.45",
        )
        .from(
          ".gsap-hero-lens",
          { opacity: 0, scale: 0.97, duration: 0.65 },
          "-=0.3",
        )
        .from(
          ".gsap-hero-cta",
          { opacity: 0, y: 18, stagger: 0.07, duration: 0.55 },
          "-=0.35",
        )
        .from(
          ".gsap-hero-stat",
          { opacity: 0, y: 16, stagger: 0.07, duration: 0.5 },
          "-=0.3",
        );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="min-h-screen pt-28 pb-16 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative"
    >
      <div className="max-w-6xl mx-auto w-full flex flex-col gap-12">
        {/* ── 1. Main 2-Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left: Intro */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left items-start">
            {/* Availability badge — only orange use: live pulse dot */}
            <div
              className="gsap-hero-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-mono"
              style={{
                background: "var(--bg-badge)",
                border: "1px solid var(--border-accent)",
                color: "var(--text-secondary)",
              }}
            >
              <span
                className="size-2 rounded-full animate-status-pulse"
                style={{ background: "var(--accent)" }}
              />
              <span>{portfolioData.personal.status}</span>
            </div>

            {/* Greeting & Title */}
            <div className="flex flex-col gap-2">
              <span
                className="text-sm font-mono font-semibold tracking-wide flex items-center gap-2"
                style={{ color: "var(--text-secondary)" }}
              >
                <Code2
                  className="size-4"
                  style={{ color: "var(--text-muted)" }}
                />
                Hi, I'm Yash
              </span>

              <h1
                className="gsap-hero-title font-display font-bold text-4xl sm:text-6xl tracking-tight leading-[1.07]"
                style={{ color: "var(--text-primary)" }}
              >
                TURNING{" "}
                <span className="text-gradient-highlight">INTELLIGENCE</span>
                <br />
                INTO SOFTWARE.
              </h1>
            </div>

            {/* Pitch */}
            <p
              className="gsap-hero-pitch text-base sm:text-lg font-light leading-relaxed max-w-xl"
              style={{ color: "var(--text-secondary)" }}
            >
              Generative AI & Full-Stack Engineer architecting{" "}
              <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                multi-model consensus engines
              </strong>
              ,{" "}
              <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                pgvector RAG pipelines
              </strong>
              , and{" "}
              <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                production web applications
              </strong>{" "}
              that ship.
            </p>

            {/* Skill pills — neutral, no orange */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                {
                  icon: <Zap className="size-3" />,
                  label: "MixChAI Consensus",
                },
                {
                  icon: <ShieldCheck className="size-3" />,
                  label: "pgvector RAG",
                },
                {
                  icon: <CheckCircle2 className="size-3" />,
                  label: "DigiCrow Full-Stack",
                },
              ].map(({ icon, label }) => (
                <span
                  key={label}
                  className="px-3 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5"
                  style={{
                    background: "var(--bg-badge)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {icon}
                  {label}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-3 w-full">
              {/* Primary — single accent use */}
              <a
                href="#ai-lab"
                className="gsap-hero-cta px-6 py-3.5 rounded-xl font-mono text-xs font-semibold tracking-wider uppercase transition-all hover:-translate-y-0.5 flex items-center gap-2 shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent-dim), var(--accent))",
                  color: "#fff",
                }}
              >
                <Sparkles className="size-3.5" />
                <span>[ Test Live AI Gateway ↗ ]</span>
              </a>

              {/* Secondary — ghost */}
              <button
                onClick={onOpenResume}
                className="gsap-hero-cta px-5 py-3.5 rounded-xl font-mono text-xs tracking-wider uppercase transition-all hover:-translate-y-0.5 flex items-center gap-2"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-mid)",
                  color: "var(--text-secondary)",
                }}
              >
                <FileText className="size-3.5" />
                <span>View Resume</span>
              </button>

              {/* Projects — ghost */}
              <a
                href="#projects"
                className="gsap-hero-cta px-5 py-3.5 rounded-xl font-mono text-xs tracking-wider uppercase transition-all hover:-translate-y-0.5 flex items-center gap-2"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-secondary)",
                }}
              >
                <Terminal className="size-3.5" />
                <span>Projects</span>
              </a>

              {/* Social icons */}
              <div className="flex items-center gap-2">
                {[
                  {
                    href: portfolioData.personal.github,
                    icon: <Github className="size-4" />,
                    title: "GitHub",
                  },
                  {
                    href: portfolioData.personal.linkedin,
                    icon: <Linkedin className="size-4" />,
                    title: "LinkedIn",
                  },
                ].map(({ href, icon, title }) => (
                  <a
                    key={title}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={title}
                    className="gsap-hero-cta p-3.5 rounded-xl transition-all hover:-translate-y-0.5"
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-subtle)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Portrait Card */}
          <div className="lg:col-span-5 flex items-center justify-center relative gsap-hero-image">
            {/* Subtle backlight */}
            <div
              className="absolute size-72 sm:size-80 rounded-full blur-3xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(155,57,34,0.20) 0%, transparent 70%)",
              }}
            />

            {/* Card frame */}
            <div
              className="relative w-full max-w-sm rounded-3xl p-2 shadow-2xl backdrop-blur-xl group"
              style={{
                background:
                  "linear-gradient(160deg, var(--bg-badge), var(--bg-base))",
                border: "1px solid var(--border-accent)",
              }}
            >
              {/* Image */}
              <div
                className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden"
                style={{ background: "var(--bg-surface)" }}
              >
                <img
                  src={portfolioData.personal.avatar}
                  alt="Yash — Generative AI & Full-Stack Engineer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                {/* Bottom fade overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Name tag overlay */}
                <div
                  className="absolute bottom-3 left-3 right-3 p-3 rounded-xl flex items-center justify-between backdrop-blur-md"
                  style={{
                    background: "rgba(12,12,12,0.88)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <div className="flex flex-col">
                    <span className="font-display font-bold text-sm text-white">
                      Yash
                    </span>
                    <span
                      className="text-[10px] font-mono"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Generative AI & Full-Stack Engineer
                    </span>
                  </div>
                  {/* Status badge — accent dot is intentional */}
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1"
                    style={{
                      background: "var(--bg-badge)",
                      border: "1px solid var(--border-accent)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <span
                      className="size-1.5 rounded-full animate-pulse"
                      style={{ background: "var(--accent)" }}
                    />
                    ONLINE
                  </span>
                </div>
              </div>

              {/* Floating badge: CGPA */}
              <div
                className="absolute -top-3 -right-3 px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 backdrop-blur-md shadow-lg"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-mid)",
                  color: "var(--text-secondary)",
                }}
              >
                <Award
                  className="size-3.5"
                  style={{ color: "var(--accent)" }}
                />
                <span
                  className="font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  8.71 CGPA
                </span>
                <span className="text-[10px]">B.Tech</span>
              </div>

              {/* Floating badge: DigiCrow */}
              <div
                className="absolute -bottom-3 -left-3 px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 backdrop-blur-md shadow-lg"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-mid)",
                  color: "var(--text-secondary)",
                }}
              >
                <Cpu className="size-3.5" />
                <span
                  className="font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Web Dev @ DigiCrow
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. Engineering Philosophy Lens ── */}
        <div
          className="gsap-hero-lens max-w-4xl w-full mx-auto rounded-2xl overflow-hidden"
          style={{ border: "1px solid var(--border-subtle)" }}
        >
          {/* Tab bar */}
          <div
            className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-subtle)",
            }}
          >
            <div
              className="flex items-center gap-2 text-xs font-mono"
              style={{ color: "var(--text-muted)" }}
            >
              <Cpu className="size-3.5" />
              <span>Engineering Philosophy:</span>
            </div>

            <div
              className="flex items-center gap-1 p-1 rounded-lg text-[11px] font-mono"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <button
                onClick={() => setLensMode("model")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-all",
                  lensMode === "model" ? "font-semibold" : "hover:opacity-80",
                )}
                style={{
                  background:
                    lensMode === "model" ? "var(--bg-badge)" : "transparent",
                  color:
                    lensMode === "model"
                      ? "var(--text-primary)"
                      : "var(--text-muted)",
                  border:
                    lensMode === "model"
                      ? "1px solid var(--border-mid)"
                      : "1px solid transparent",
                }}
              >
                Raw Model
              </button>
              <button
                onClick={() => setLensMode("system")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-all flex items-center gap-1",
                  lensMode === "system" ? "font-semibold" : "hover:opacity-80",
                )}
                style={{
                  background:
                    lensMode === "system" ? "var(--bg-badge)" : "transparent",
                  color:
                    lensMode === "system"
                      ? "var(--accent)"
                      : "var(--text-muted)",
                  border:
                    lensMode === "system"
                      ? "1px solid var(--border-accent)"
                      : "1px solid transparent",
                }}
              >
                <Sparkles className="size-3" />
                <span>Engineered AI System</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div
            className="p-5 font-mono text-xs leading-relaxed min-h-[85px] flex flex-col justify-center"
            style={{
              background: "var(--bg-base)",
              color: "var(--text-secondary)",
            }}
          >
            {lensMode === "model" ? (
              <div className="flex flex-col gap-1.5">
                <div
                  className="font-semibold"
                  style={{ color: "var(--text-muted)" }}
                >
                  [Point Solution: Single Model]
                </div>
                <p>
                  Prompt ➔ Single LLM ➔ Unvalidated Output
                  <span style={{ color: "var(--text-muted)" }}>
                    {" "}
                    (susceptible to hallucinations, drift & quota drains)
                  </span>
                </p>
              </div>
            ) : (
              <div
                className="flex flex-col gap-1.5"
                style={{ color: "var(--text-primary)" }}
              >
                <div
                  className="font-semibold flex items-center gap-1.5"
                  style={{ color: "var(--accent)" }}
                >
                  <ShieldCheck className="size-4" />
                  <span>
                    [Production Grade: Controlled AI Gateway Architecture]
                  </span>
                </div>
                <p style={{ color: "var(--text-secondary)" }}>
                  Rate Limit ➔ Vector Retrieval (pgvector) ➔ Parallel LLMs ➔
                  Evaluator Consensus ➔ Zod Validation ➔{" "}
                  <strong style={{ color: "var(--text-primary)" }}>
                    Reliable Product
                  </strong>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── 3. Stats Strip ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mx-auto">
          {portfolioData.stats.map((stat, sIdx) => (
            <div
              key={sIdx}
              className="gsap-hero-stat p-4 rounded-2xl glass-panel flex flex-col items-center justify-center text-center"
            >
              <span className="font-display font-bold text-2xl text-gradient-highlight">
                {stat.value}
              </span>
              <span
                className="text-xs font-mono mt-0.5"
                style={{ color: "var(--text-secondary)" }}
              >
                {stat.label}
              </span>
              <span
                className="text-[10px] font-mono mt-0.5"
                style={{ color: "var(--text-muted)" }}
              >
                {stat.highlight}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
