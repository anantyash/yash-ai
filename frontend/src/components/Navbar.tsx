import React, { useState } from "react";
import { portfolioData } from "../data/portfolioData";
import { Terminal, Copy, Check, Menu, X, Sparkles } from "lucide-react";

interface NavbarProps {
  onCopyEmail: (message: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onCopyEmail }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(portfolioData.personal.email).then(() => {
      setCopied(true);
      onCopyEmail("Email copied to clipboard: " + portfolioData.personal.email);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass-nav">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#hero" className="flex items-center gap-2 group">
          <div className="size-8 rounded-lg bg-slate-900 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors">
            <Terminal className="size-4" />
          </div>
          <span className="font-display font-bold text-lg text-white tracking-wider">
            YASH<span className="text-cyan-400">.AI</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-slate-300">
          <a href="#hero" className="hover:text-cyan-400 transition-colors">
            Hero
          </a>
          <a
            href="#ai-lab"
            className="hover:text-cyan-400 transition-colors flex items-center gap-1"
          >
            <Sparkles className="size-3 text-cyan-400" />
            <span>AI Lab</span>
          </a>
          <a href="#projects" className="hover:text-cyan-400 transition-colors">
            Projects
          </a>
          <a
            href="#experience"
            className="hover:text-cyan-400 transition-colors"
          >
            Experience
          </a>
          <a href="#skills" className="hover:text-cyan-400 transition-colors">
            Skills
          </a>
          <a href="#contact" className="hover:text-cyan-400 transition-colors">
            Contact
          </a>
        </nav>

        {/* Action Button: Copy Email */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/10 hover:border-cyan-500/40 text-xs font-mono text-slate-200 hover:text-white transition-all flex items-center gap-2"
            title="Copy Email"
            aria-label="Copy Email to Clipboard"
          >
            {copied ? (
              <Check className="size-3.5 text-emerald-400" />
            ) : (
              <Copy className="size-3.5 text-cyan-400" />
            )}
            <span>{copied ? "Copied" : "anantyash.2710@gmail.com"}</span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Navigation Menu"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-white/10 px-6 py-5 flex flex-col gap-4 font-mono text-sm">
          <a
            href="#hero"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 hover:text-cyan-400"
          >
            Hero
          </a>
          <a
            href="#ai-lab"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 hover:text-cyan-400 flex items-center gap-1.5"
          >
            <Sparkles className="size-3.5 text-cyan-400" />
            <span>AI Lab</span>
          </a>
          <a
            href="#projects"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 hover:text-cyan-400"
          >
            Projects
          </a>
          <a
            href="#experience"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 hover:text-cyan-400"
          >
            Experience
          </a>
          <a
            href="#skills"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 hover:text-cyan-400"
          >
            Skills
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 hover:text-cyan-400"
          >
            Contact
          </a>
        </div>
      )}
    </header>
  );
};
