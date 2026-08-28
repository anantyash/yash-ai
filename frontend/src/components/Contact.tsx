import React, { useState } from "react";
import { portfolioData } from "../data/portfolioData";
import { Send, Mail, Phone, Linkedin, Github, Copy, Check } from "lucide-react";

interface ContactProps {
  onNotify: (message: string) => void;
}

export const Contact: React.FC<ContactProps> = ({ onNotify }) => {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(portfolioData.personal.email).then(() => {
      setCopied(true);
      onNotify("Email copied to clipboard: " + portfolioData.personal.email);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onNotify(
        `Thank you, ${formData.name || "Friend"}! Your message has been received.`,
      );
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1000);
  };

  return (
    <section
      id="contact"
      className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-[#05070c]"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Info & Roles (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider">
              <Send className="size-3.5" />
              Let's Build the Future with AI
            </div>

            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white leading-tight">
              Ready to create{" "}
              <span className="text-gradient-cyan">intelligent AI systems</span>
              ?
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed font-light">
              I’m looking for opportunities to work on{" "}
              <strong className="text-white font-medium">
                Generative AI, LLM applications, AI agents, RAG systems, and
                scalable software products
              </strong>{" "}
              where I can contribute as an engineer and continue solving
              challenging problems at the intersection of AI and software.
            </p>

            {/* Target Roles */}
            <div className="flex flex-col gap-2 pt-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                Open To Roles:
              </span>
              <div className="flex flex-wrap gap-1.5 text-xs font-mono text-cyan-300">
                {portfolioData.personal.roles.map((role, rIdx) => (
                  <span
                    key={rIdx}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="flex flex-col gap-3 pt-3">
              {/* Direct Email */}
              <div className="p-4 rounded-2xl glass-panel border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                    <Mail className="size-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-mono block">
                      Direct Email
                    </span>
                    <a
                      href={`mailto:${portfolioData.personal.email}`}
                      className="text-xs sm:text-sm font-mono text-white hover:text-cyan-400 transition-colors"
                    >
                      {portfolioData.personal.email}
                    </a>
                  </div>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs"
                  title="Copy Email"
                  aria-label="Copy Email Address"
                >
                  {copied ? (
                    <Check className="size-4 text-emerald-400" />
                  ) : (
                    <Copy className="size-4 text-cyan-400" />
                  )}
                </button>
              </div>

              {/* Phone */}
              <div className="p-4 rounded-2xl glass-panel border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Phone className="size-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-mono block">
                      Mobile Phone
                    </span>
                    <a
                      href={`tel:${portfolioData.personal.phone.replace(/\s+/g, "")}`}
                      className="text-xs sm:text-sm font-mono text-white hover:text-emerald-400 transition-colors"
                    >
                      {portfolioData.personal.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={portfolioData.personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl glass-panel border border-white/10 flex items-center gap-3 group hover:border-cyan-500/40"
                >
                  <div className="size-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <Linkedin className="size-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      LinkedIn
                    </span>
                    <span className="text-xs font-semibold text-white group-hover:text-cyan-400 transition-colors">
                      /in/anantyash
                    </span>
                  </div>
                </a>

                <a
                  href={portfolioData.personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl glass-panel border border-white/10 flex items-center gap-3 group hover:border-purple-500/40"
                >
                  <div className="size-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <Github className="size-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      GitHub
                    </span>
                    <span className="text-xs font-semibold text-white group-hover:text-purple-400 transition-colors">
                      /anantyash
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right: Message Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10">
              <h3 className="font-display font-bold text-2xl text-white mb-2">
                Send a Message
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mb-6 font-mono">
                Let's discuss AI engineering roles or project collaboration.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-slate-300">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="e.g. Alex Rivera"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-slate-300">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="alex@company.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-slate-300">
                    Role / Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }))
                    }
                    placeholder="e.g. Generative AI Engineer Role / Project Collaboration"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-slate-300">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    placeholder="Hi Yash, I reviewed your multi-model LLM projects and would love to discuss..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors resize-none font-mono"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono font-medium text-xs tracking-wider uppercase shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="size-4" />
                  <span>{submitting ? "Sending..." : "Send Message ↗"}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
