import React from "react";
import { portfolioData } from "../data/portfolioData";
import {
  X,
  Mail,
  Phone,
  Linkedin,
  Github,
  Award,
  Briefcase,
  GraduationCap,
} from "lucide-react";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0b0f19] border border-cyan-500/30 p-6 sm:p-10 text-slate-100 shadow-2xl">
        {/* Modal Header Controls */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
              Curriculum Vitae • Yash
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`mailto:${portfolioData.personal.email}?subject=Interview%20Opportunity%20with%20Yash`}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-all"
            >
              <Mail className="size-3.5" />
              <span>Contact Directly</span>
            </a>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Clean Printable Resume Content */}
        <div className="space-y-8 text-left">
          {/* Header Identity */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
            <div>
              <h2 className=" font-bold text-3xl sm:text-4xl text-white">
                {portfolioData.personal.name}
              </h2>
              <p className="text-sm font-mono text-cyan-400 mt-1">
                {portfolioData.personal.title}
              </p>
            </div>

            <div className="flex flex-col gap-1 text-xs font-mono text-slate-300">
              <span className="flex items-center gap-2">
                <Mail className="size-3.5 text-cyan-400" />{" "}
                {portfolioData.personal.email}
              </span>
              <span className="flex items-center gap-2">
                <Phone className="size-3.5 text-emerald-400" />{" "}
                {portfolioData.personal.phone}
              </span>
              <span className="flex items-center gap-2 text-slate-400">
                <Linkedin className="size-3.5 text-blue-400" />{" "}
                linkedin.com/in/anantyash
              </span>
              <span className="flex items-center gap-2 text-slate-400">
                <Github className="size-3.5 text-purple-400" />{" "}
                github.com/anantyash
              </span>
            </div>
          </div>

          {/* Core Summary */}
          <div className="space-y-2">
            <h3 className=" font-semibold text-sm uppercase font-mono tracking-wider text-cyan-400">
              Executive Summary
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              Software Engineering graduate (8.71 CGPA) with hands-on experience
              in React.js, Node.js, Express.js and Generative AI, skilled in LLM
              orchestration, prompt engineering, RAG pipelines, and API
              architecture.
            </p>
          </div>

          {/* Experience */}
          <div className="space-y-3">
            <h3 className=" font-semibold text-sm uppercase font-mono tracking-wider text-cyan-400 flex items-center gap-2">
              <Briefcase className="size-4" /> Professional Experience
            </h3>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
              <div className="flex flex-wrap items-center justify-between text-xs font-mono">
                <span className="font-bold text-white text-sm">
                  Web Developer — DigiCrow
                </span>
                <span className="text-cyan-300">June 2025 — Present</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 pl-4 list-disc font-light">
                <li>
                  Developed end-to-end web applications with Tailwind CSS,
                  JavaScript, PHP, and MySQL.
                </li>
                <li>
                  Integrated secure payment gateway workflows with automated
                  verification.
                </li>
                <li>
                  Built dynamic and reusable UI components and handled
                  server-side data processing and database CRUD.
                </li>
              </ul>
            </div>
          </div>

          {/* Key Projects */}
          <div className="space-y-3">
            <h3 className=" font-semibold text-sm uppercase font-mono tracking-wider text-cyan-400 flex items-center gap-2">
              <Award className="size-4" /> Featured AI Systems
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
                <h4 className=" font-bold text-white text-sm">
                  MixChAI: Self-Consistency Engine
                </h4>
                <p className="text-xs text-slate-400">
                  TypeScript • Bun • Gemini API • OpenRouter • Zod
                </p>
                <p className="text-xs text-slate-300 font-light">
                  Parallel inference engine with evaluator consensus layer that
                  synthesizes multi-model outputs.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
                <h4 className=" font-bold text-white text-sm">
                  DevBot: AI Persona Chatbot
                </h4>
                <p className="text-xs text-slate-400">
                  Node.js • Express.js • Gemini API • Prompt Engineering
                </p>
                <p className="text-xs text-slate-300 font-light">
                  Conversational platform simulating distinct personality models
                  with streaming REST backend.
                </p>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="space-y-2">
            <h3 className=" font-semibold text-sm uppercase font-mono tracking-wider text-cyan-400 flex items-center gap-2">
              <GraduationCap className="size-4" /> Education
            </h3>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col sm:flex-row justify-between gap-2 text-xs">
              <div>
                <p className="font-bold text-white">
                  B.Tech in Computer Science & Engineering
                </p>
                <p className="text-slate-400">
                  Guru Gobind Singh Educational Society’s Technical Campus
                  (2020–2024)
                </p>
              </div>
              <span className="font-mono text-emerald-400 font-bold self-start sm:self-auto">
                8.71 / 10 CGPA
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
