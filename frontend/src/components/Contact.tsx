import React, { useState } from "react";
import { portfolioData } from "../data/portfolioData";
import { Mail, Linkedin, Github, Copy, Check, MessageCircle, ArrowUpRight } from "lucide-react";

interface ContactProps {
  onNotify: (message: string) => void;
}

export const Contact: React.FC<ContactProps> = ({ onNotify }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(portfolioData.personal.email).then(() => {
      setCopied(true);
      onNotify("Email copied — " + portfolioData.personal.email);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section
      id="contact"
      className="py-24 px-4 sm:px-6 lg:px-8 border-t"
      style={{ borderColor: "var(--border-subtle)" }}
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-14">

        {/* Header */}
        <div className="flex flex-col gap-3 text-center items-center">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider"
            style={{
              background: "var(--bg-badge)",
              border: "1px solid var(--border-accent)",
              color: "var(--accent)",
            }}
          >
            <MessageCircle className="size-3.5" />
            Let's Connect
          </div>

          <h2
            className="font-display font-bold text-3xl sm:text-5xl leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Open to <span className="text-gradient-highlight">Opportunities</span>
          </h2>

          <p
            className="text-sm sm:text-base font-light leading-relaxed max-w-xl"
            style={{ color: "var(--text-secondary)" }}
          >
            I'm actively looking for roles in{" "}
            <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>
              Generative AI, LLM engineering, and full-stack development
            </strong>
            . The fastest way to reach me is LinkedIn — I check it daily.
          </p>
        </div>

        {/* LinkedIn CTA — hero card */}
        <a
          href={portfolioData.personal.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col sm:flex-row items-center gap-6 p-8 rounded-3xl glass-panel transition-all hover:-translate-y-0.5"
          style={{ border: "1px solid var(--border-accent)" }}
        >
          {/* Icon */}
          <div
            className="size-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-105"
            style={{
              background: "linear-gradient(135deg, var(--accent-dim), var(--accent))",
              boxShadow: "0 8px 24px rgba(242,97,63,0.25)",
            }}
          >
            <Linkedin className="size-8 text-white" />
          </div>

          {/* Text */}
          <div className="flex flex-col gap-1.5 text-center sm:text-left flex-1">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span
                className="size-2 rounded-full animate-status-pulse"
                style={{ background: "var(--accent)" }}
              />
              <span className="text-xs font-mono uppercase tracking-wider" style={{ color: "var(--accent)" }}>
                Active on LinkedIn · Replies within 24h
              </span>
            </div>
            <span className="font-display font-bold text-xl" style={{ color: "var(--text-primary)" }}>
              DM me on LinkedIn
            </span>
            <span className="text-sm font-mono" style={{ color: "var(--text-secondary)" }}>
              linkedin.com/in/anantyash · Best for hiring discussions, collabs &amp; intros
            </span>
          </div>

          <ArrowUpRight
            className="size-5 flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            style={{ color: "var(--accent)" }}
          />
        </a>

        {/* Secondary channels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email */}
          <div
            className="glass-panel p-5 rounded-2xl flex items-center justify-between gap-4"
            style={{ border: "1px solid var(--border-subtle)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="size-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--bg-badge)", border: "1px solid var(--border-mid)" }}
              >
                <Mail className="size-4" style={{ color: "var(--accent)" }} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Email
                </span>
                <a
                  href={`mailto:${portfolioData.personal.email}`}
                  className="text-xs sm:text-sm font-mono truncate transition-opacity hover:opacity-70"
                  style={{ color: "var(--text-primary)" }}
                >
                  {portfolioData.personal.email}
                </a>
              </div>
            </div>
            <button
              onClick={handleCopyEmail}
              title="Copy email"
              className="p-2 rounded-lg transition-all flex-shrink-0 hover:opacity-70"
              style={{
                background: "var(--bg-badge)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              {copied
                ? <Check className="size-4 text-emerald-400" />
                : <Copy className="size-4" style={{ color: "var(--text-secondary)" }} />
              }
            </button>
          </div>

          {/* GitHub */}
          <a
            href={portfolioData.personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-panel p-5 rounded-2xl flex items-center gap-3 group transition-all hover:-translate-y-0.5"
            style={{ border: "1px solid var(--border-subtle)" }}
          >
            <div
              className="size-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--bg-badge)", border: "1px solid var(--border-mid)" }}
            >
              <Github className="size-4" style={{ color: "var(--text-secondary)" }} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                GitHub
              </span>
              <span className="text-xs sm:text-sm font-mono transition-opacity group-hover:opacity-70" style={{ color: "var(--text-primary)" }}>
                github.com/anantyash
              </span>
            </div>
            <ArrowUpRight className="size-4 ml-auto flex-shrink-0" style={{ color: "var(--text-muted)" }} />
          </a>
        </div>

        {/* Open to roles */}
        <div className="flex flex-col gap-3 items-center text-center">
          <span className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Open to roles in
          </span>
          <div className="flex flex-wrap gap-2 justify-center">
            {portfolioData.personal.roles.map((role, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg text-xs font-mono"
                style={{
                  background: "var(--bg-badge)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-secondary)",
                }}
              >
                {role}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
