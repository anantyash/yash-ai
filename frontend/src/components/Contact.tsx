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
        `Thank you, ${formData.name || "Friend"}! Your message has been received.`
      );
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1000);
  };

  return (
    <section
      id="contact"
      className="py-24 px-4 sm:px-6 lg:px-8 border-t border-[#481E14]/30 bg-[#0C0C0C] dark:bg-[#0C0C0C] light:bg-[#FAF7F5]"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Info & Roles (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-[#481E14]/30 border border-[#9B3922]/40 text-[#F2613F] text-xs font-mono uppercase tracking-wider">
              <Send className="size-3.5" />
              Let's Build the Future with AI
            </div>

            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white dark:text-white light:text-[#0C0C0C] leading-tight">
              Ready to create{" "}
              <span className="text-gradient-highlight">intelligent AI systems</span>
              ?
            </h2>

            <p className="text-slate-300 dark:text-slate-300 light:text-slate-700 text-sm leading-relaxed font-light">
              I’m looking for opportunities to work on{" "}
              <strong className="text-white dark:text-white light:text-black font-medium">
                Generative AI, LLM applications, AI agents, RAG systems, and
                scalable software products
              </strong>{" "}
              where I can contribute as an engineer and continue solving
              challenging problems at the intersection of AI and software.
            </p>

            {/* Target Roles */}
            <div className="flex flex-col gap-2 pt-2">
              <span className="text-xs font-mono text-slate-400 dark:text-slate-400 light:text-slate-600 uppercase tracking-wider block">
                Open To Roles:
              </span>
              <div className="flex flex-wrap gap-1.5 text-xs font-mono text-[#F2613F]">
                {portfolioData.personal.roles.map((role, rIdx) => (
                  <span
                    key={rIdx}
                    className="px-2.5 py-1 rounded-lg bg-[#481E14]/20 border border-[#481E14]/60 text-slate-200 dark:text-slate-200 light:text-slate-800"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="flex flex-col gap-3 pt-3">
              {/* Direct Email */}
              <div className="p-4 rounded-2xl glass-panel border border-[#481E14]/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-[#481E14]/40 text-[#F2613F] flex items-center justify-center">
                    <Mail className="size-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600 font-mono block">
                      Direct Email
                    </span>
                    <a
                      href={`mailto:${portfolioData.personal.email}`}
                      className="text-xs sm:text-sm font-mono text-white dark:text-white light:text-[#0C0C0C] hover:text-[#F2613F] transition-colors"
                    >
                      {portfolioData.personal.email}
                    </a>
                  </div>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="p-2 rounded-lg bg-[#481E14]/40 hover:bg-[#481E14]/80 text-slate-300 hover:text-white transition-all text-xs"
                  title="Copy Email"
                  aria-label="Copy Email Address"
                >
                  {copied ? (
                    <Check className="size-4 text-emerald-400" />
                  ) : (
                    <Copy className="size-4 text-[#F2613F]" />
                  )}
                </button>
              </div>

              {/* Phone */}
              <div className="p-4 rounded-2xl glass-panel border border-[#481E14]/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-[#481E14]/40 text-[#9B3922] flex items-center justify-center">
                    <Phone className="size-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600 font-mono block">
                      Mobile Phone
                    </span>
                    <a
                      href={`tel:${portfolioData.personal.phone.replace(/\s+/g, "")}`}
                      className="text-xs sm:text-sm font-mono text-white dark:text-white light:text-[#0C0C0C] hover:text-[#F2613F] transition-colors"
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
                  className="p-4 rounded-2xl glass-panel border border-[#481E14]/50 flex items-center gap-3 group hover:border-[#F2613F]/50"
                >
                  <div className="size-8 rounded-lg bg-[#481E14]/40 text-[#F2613F] flex items-center justify-center">
                    <Linkedin className="size-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-600 font-mono block">
                      LinkedIn
                    </span>
                    <span className="text-xs font-semibold text-white dark:text-white light:text-[#0C0C0C] group-hover:text-[#F2613F] transition-colors">
                      /in/anantyash
                    </span>
                  </div>
                </a>

                <a
                  href={portfolioData.personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl glass-panel border border-[#481E14]/50 flex items-center gap-3 group hover:border-[#F2613F]/50"
                >
                  <div className="size-8 rounded-lg bg-[#481E14]/40 text-[#9B3922] flex items-center justify-center">
                    <Github className="size-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-600 font-mono block">
                      GitHub
                    </span>
                    <span className="text-xs font-semibold text-white dark:text-white light:text-[#0C0C0C] group-hover:text-[#F2613F] transition-colors">
                      /anantyash
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right: Message Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-[#481E14]/50">
              <h3 className="font-display font-bold text-2xl text-white dark:text-white light:text-[#0C0C0C] mb-2">
                Send a Message
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 mb-6 font-mono">
                Let's discuss AI engineering roles or project collaboration.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-slate-300 dark:text-slate-300 light:text-slate-700">
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
                      className="w-full px-4 py-3 rounded-xl bg-[#0C0C0C]/80 dark:bg-[#0C0C0C]/80 light:bg-[#FFFFFF] border border-[#481E14]/60 text-white dark:text-white light:text-[#0C0C0C] placeholder-slate-500 text-sm focus:outline-none focus:border-[#F2613F] transition-colors font-mono"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-slate-300 dark:text-slate-300 light:text-slate-700">
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
                      className="w-full px-4 py-3 rounded-xl bg-[#0C0C0C]/80 dark:bg-[#0C0C0C]/80 light:bg-[#FFFFFF] border border-[#481E14]/60 text-white dark:text-white light:text-[#0C0C0C] placeholder-slate-500 text-sm focus:outline-none focus:border-[#F2613F] transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-slate-300 dark:text-slate-300 light:text-slate-700">
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
                    className="w-full px-4 py-3 rounded-xl bg-[#0C0C0C]/80 dark:bg-[#0C0C0C]/80 light:bg-[#FFFFFF] border border-[#481E14]/60 text-white dark:text-white light:text-[#0C0C0C] placeholder-slate-500 text-sm focus:outline-none focus:border-[#F2613F] transition-colors font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-slate-300 dark:text-slate-300 light:text-slate-700">
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
                    className="w-full px-4 py-3 rounded-xl bg-[#0C0C0C]/80 dark:bg-[#0C0C0C]/80 light:bg-[#FFFFFF] border border-[#481E14]/60 text-white dark:text-white light:text-[#0C0C0C] placeholder-slate-500 text-sm focus:outline-none focus:border-[#F2613F] transition-colors resize-none font-mono"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#9B3922] via-[#9B3922] to-[#F2613F] hover:from-[#F2613F] hover:to-[#FFA07A] text-white font-mono font-medium text-xs tracking-wider uppercase shadow-xl shadow-[#F2613F]/20 hover:shadow-[#F2613F]/35 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
