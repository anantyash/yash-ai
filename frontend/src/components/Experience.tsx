import React from "react";
import { portfolioData } from "../data/portfolioData";
import { Briefcase, GraduationCap, CheckCircle2, Award } from "lucide-react";

export const Experience: React.FC = () => {
  return (
    <section
      id="experience"
      className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-slate-950/40"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-14">
        {/* Section Header */}
        <div className="text-center flex flex-col gap-2.5">
          <div className="inline-flex items-center gap-2 self-center px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider">
            <Briefcase className="size-3.5" />
            Background & Credentials
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white">
            Experience & <span className="text-gradient-cyan">Education</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Work Experience (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Briefcase className="size-4" />
              </div>
              <h3 className="font-display font-bold text-xl text-white">
                Professional Experience
              </h3>
            </div>

            {portfolioData.experience.map((exp, idx) => (
              <div
                key={idx}
                className="glass-panel p-7 rounded-3xl border border-cyan-500/30 flex flex-col gap-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                  <div>
                    <h4 className="font-display font-bold text-xl text-white">
                      {exp.role}
                    </h4>
                    <p className="text-sm font-mono text-cyan-400">
                      {exp.company}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 self-start sm:self-auto">
                    {exp.period}
                  </span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {exp.points.map((point, pIdx) => (
                    <div
                      key={pIdx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 font-light"
                    >
                      <CheckCircle2 className="size-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Academic Foundation (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <GraduationCap className="size-4" />
              </div>
              <h3 className="font-display font-bold text-xl text-white">
                Academic Foundation
              </h3>
            </div>

            <div className="glass-panel p-7 rounded-3xl border border-emerald-500/25 flex flex-col gap-5">
              <div className="flex flex-col gap-1 border-b border-white/10 pb-4">
                <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-xs font-mono text-emerald-300 self-start mb-1">
                  {portfolioData.education.period}
                </span>
                <h4 className="font-display font-bold text-lg text-white">
                  {portfolioData.education.degree}
                </h4>
                <p className="text-xs font-mono text-emerald-400">
                  {portfolioData.education.institution}
                </p>
                <p className="text-xs text-slate-400">
                  {portfolioData.education.location}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300 text-xs font-mono">
                  <Award className="size-4 text-emerald-400" />
                  <span>Graduation Score</span>
                </div>
                <span className="font-display font-bold text-2xl text-emerald-400">
                  {portfolioData.education.cgpa}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  Core Foundations:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {portfolioData.education.coursework.map((course, cIdx) => (
                    <span
                      key={cIdx}
                      className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
