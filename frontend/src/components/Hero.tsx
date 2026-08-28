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

      tl.from(".gsap-hero-badge", {
        opacity: 0,
        y: -15,
        duration: 0.6,
      })
        .from(
          ".gsap-hero-title",
          {
            opacity: 0,
            y: 30,
            duration: 0.8,
          },
          "-=0.3",
        )
        .from(
          ".gsap-hero-pitch",
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
          },
          "-=0.4",
        )
        .from(
          ".gsap-hero-lens",
          {
            opacity: 0,
            scale: 0.96,
            duration: 0.7,
          },
          "-=0.3",
        )
        .from(
          ".gsap-hero-cta",
          {
            opacity: 0,
            y: 20,
            stagger: 0.08,
            duration: 0.6,
          },
          "-=0.4",
        )
        .from(
          ".gsap-hero-stat",
          {
            opacity: 0,
            y: 20,
            stagger: 0.08,
            duration: 0.5,
          },
          "-=0.3",
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="min-h-screen pt-32 pb-16 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative"
    >
      <div className="max-w-6xl mx-auto w-full flex flex-col gap-10 text-center items-center">
        {/* Availability Status Badge */}
        <div className="gsap-hero-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 shadow-inner">
          <span className="size-2 rounded-full bg-emerald-400 animate-status-pulse" />
          <span>{portfolioData.personal.status}</span>
        </div>

        {/* Sculptural Typographic Header */}
        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
          <h1 className="gsap-hero-title font-display font-bold text-4xl sm:text-6xl md:text-7xl tracking-tight text-white leading-[1.05]">
            TURNING <span className="text-gradient-cyan">INTELLIGENCE</span>
            <br />
            INTO SOFTWARE.
          </h1>

          <p className="gsap-hero-pitch text-base sm:text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            {portfolioData.personal.pitch}
          </p>
        </div>

        {/* Interactive "Model vs System" Lens */}
        <div className="gsap-hero-lens max-w-2xl w-full p-1 rounded-2xl glass-panel border border-white/10 text-left">
          <div className="px-4 py-2.5 bg-slate-950/90 rounded-t-xl border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Cpu className="size-3.5 text-cyan-400" />
              <span>Engineering Philosophy:</span>
            </div>

            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
              <button
                onClick={() => setLensMode("model")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-all",
                  lensMode === "model"
                    ? "bg-slate-800 text-slate-200"
                    : "text-slate-500 hover:text-slate-300",
                )}
              >
                Raw Model
              </button>
              <button
                onClick={() => setLensMode("system")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-all flex items-center gap-1",
                  lensMode === "system"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    : "text-slate-500 hover:text-slate-300",
                )}
              >
                <Sparkles className="size-3 text-cyan-400" />
                <span>Engineered AI System</span>
              </button>
            </div>
          </div>

          <div className="p-5 font-mono text-xs leading-relaxed text-slate-300 bg-[#070b14]/90 rounded-b-xl min-h-[90px] flex flex-col justify-center">
            {lensMode === "model" ? (
              <div className="flex flex-col gap-1.5 text-slate-400">
                <div className="text-amber-400 font-semibold">
                  [Point Solution: Single Model]
                </div>
                <p>
                  Prompt ➔ Single LLM ➔ Unvalidated Output (Susceptible to
                  hallucinations, drift & quota drains)
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5 text-cyan-300">
                <div className="text-cyan-400 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-emerald-400" />
                  <span>
                    [Production Grade: Controlled AI Gateway Architecture]
                  </span>
                </div>
                <p className="text-slate-200">
                  Rate Limit ➔ Vector Retrieval (pgvector) ➔ Parallel LLMs ➔
                  Evaluator Consensus ➔ Zod Validation ➔{" "}
                  <strong className="text-emerald-400 font-semibold">
                    Reliable Product
                  </strong>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Hero CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="#ai-lab"
            className="gsap-hero-cta px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono text-xs font-semibold tracking-wider uppercase shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <Sparkles className="size-3.5" />
            <span>[ TEST LIVE AI GATEWAY ↗ ]</span>
          </a>

          <button
            onClick={onOpenResume}
            className="gsap-hero-cta px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 hover:text-white font-mono text-xs tracking-wider uppercase transition-all hover:-translate-y-0.5 flex items-center gap-2"
          >
            <FileText className="size-3.5 text-cyan-400" />
            <span>View Resume</span>
          </button>

          <a
            href="#projects"
            className="gsap-hero-cta px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-mono text-xs tracking-wider uppercase transition-all hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Terminal className="size-3.5 text-purple-400" />
            <span>Projects</span>
          </a>

          <a
            href={portfolioData.personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="gsap-hero-cta p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all hover:-translate-y-0.5"
            title="GitHub"
          >
            <Github className="size-4" />
          </a>

          <a
            href={portfolioData.personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="gsap-hero-cta p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all hover:-translate-y-0.5"
            title="LinkedIn"
          >
            <Linkedin className="size-4" />
          </a>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl pt-4">
          {portfolioData.stats.map((stat, sIdx) => (
            <div
              key={sIdx}
              className="gsap-hero-stat p-4 rounded-2xl glass-panel border border-white/5 flex flex-col items-center justify-center text-center"
            >
              <span className="font-display font-bold text-2xl text-gradient-cyan">
                {stat.value}
              </span>
              <span className="text-xs font-mono text-slate-300 mt-0.5">
                {stat.label}
              </span>
              <span className="text-[10px] font-mono text-cyan-400/80">
                {stat.highlight}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
