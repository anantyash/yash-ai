import React, { useState, useEffect } from "react";
import { portfolioData } from "../data/portfolioData";
import { Terminal, Copy, Check, Menu, X, Sparkles, Sun, Moon } from "lucide-react";

interface NavbarProps {
  onCopyEmail: (message: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onCopyEmail }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  /* Apply saved theme on mount */
  useEffect(() => {
    const saved = (localStorage.getItem("yash_ai_theme") as "dark" | "light") || "dark";
    applyTheme(saved);
    setTheme(saved);
  }, []);

  const applyTheme = (t: "dark" | "light") => {
    const html = document.documentElement;
    html.classList.remove("dark", "light");
    html.classList.add(t);
    localStorage.setItem("yash_ai_theme", t);
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(portfolioData.personal.email).then(() => {
      setCopied(true);
      onCopyEmail("Email copied — " + portfolioData.personal.email);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const navLinks = [
    { label: "Hero",       href: "#hero" },
    { label: "AI Lab",     href: "#ai-lab", icon: <Sparkles className="size-3 text-[#F2613F]" /> },
    { label: "Projects",   href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Skills",     href: "#skills" },
    { label: "Contact",    href: "#contact" },
  ];

  /* Shared link style — neutral by default, accent only on hover */
  const linkCls =
    "text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors duration-150";

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass-nav">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* ── Brand ── */}
        <a href="#hero" className="flex items-center gap-2 group flex-shrink-0">
          <div
            className="size-8 rounded-lg flex items-center justify-center transition-colors duration-150"
            style={{ background: "var(--bg-badge)", border: "1px solid var(--border-accent)" }}
          >
            <Terminal className="size-4" style={{ color: "var(--text-secondary)" }} />
          </div>
          <span
            className="font-display font-bold text-[17px] tracking-wider"
            style={{ color: "var(--text-primary)" }}
          >
            YASH<span style={{ color: "var(--accent)" }}>.AI</span>
          </span>
        </a>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-6 text-[11px] font-mono">
          {navLinks.map(({ label, href, icon }) => (
            <a key={href} href={href} className={`${linkCls} flex items-center gap-1`}>
              {icon}
              {label}
            </a>
          ))}
        </nav>

        {/* ── Desktop Actions ── */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Theme Toggle — pill-style slider */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono transition-all duration-200 hover:opacity-90"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-mid)",
              color: "var(--text-secondary)",
            }}
          >
            {/* Track */}
            <span
              className="relative inline-flex items-center w-8 h-4 rounded-full transition-colors duration-200 flex-shrink-0"
              style={{
                background: theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(155,57,34,0.15)",
                border: "1px solid var(--border-mid)",
              }}
            >
              {/* Thumb */}
              <span
                className="absolute size-3 rounded-full transition-all duration-200 shadow-sm"
                style={{
                  left: theme === "dark" ? "1px" : "calc(100% - 13px)",
                  background: "var(--text-primary)",
                }}
              />
            </span>
            {theme === "dark" ? (
              <>
                <Moon className="size-3" />
                <span className="hidden lg:inline">Dark</span>
              </>
            ) : (
              <>
                <Sun className="size-3" />
                <span className="hidden lg:inline">Light</span>
              </>
            )}
          </button>

          {/* Copy Email */}
          <button
            onClick={handleCopy}
            title="Copy email"
            aria-label="Copy email"
            className="px-3 py-1.5 rounded-full text-[11px] font-mono flex items-center gap-1.5 transition-all duration-150 hover:opacity-90"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-mid)",
              color: "var(--text-secondary)",
            }}
          >
            {copied
              ? <Check className="size-3 text-emerald-400" />
              : <Copy className="size-3" />
            }
            <span className="hidden lg:inline">
              {copied ? "Copied!" : portfolioData.personal.email}
            </span>
            <span className="lg:hidden">
              {copied ? "Copied!" : "Email"}
            </span>
          </button>
        </div>

        {/* ── Mobile Controls ── */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg transition-all duration-150"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-secondary)",
            }}
          >
            {theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen((p) => !p)}
            aria-label="Toggle menu"
            className="p-2 rounded-lg transition-all duration-150"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-secondary)",
            }}
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Dropdown ── */}
      {mobileMenuOpen && (
        <div
          className="md:hidden px-6 py-5 flex flex-col gap-4 font-mono text-sm border-t transition-all"
          style={{
            background: "var(--nav-bg)",
            borderColor: "var(--nav-border)",
          }}
        >
          {navLinks.map(({ label, href, icon }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              className={`${linkCls} flex items-center gap-2`}
            >
              {icon}
              {label}
            </a>
          ))}
          <button
            onClick={handleCopy}
            className="text-left flex items-center gap-2 transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
            {copied ? "Copied!" : portfolioData.personal.email}
          </button>
        </div>
      )}
    </header>
  );
};
