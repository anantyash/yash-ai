import React from "react";
import { portfolioData } from "../data/portfolioData";
import { Briefcase, GraduationCap, CheckCircle2, Award } from "lucide-react";

export const Experience: React.FC = () => {
  return (
    <section
      id="experience"
      className="py-24 px-4 sm:px-6 lg:px-8 border-t border-[#481E14]/30 bg-[#0C0C0C]/40 dark:bg-[#0C0C0C]/40 light:bg-[#FAF7F5]/50"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-14">
        {/* Section Header */}
        <div className="text-center flex flex-col gap-2.5">
          <div className="inline-flex items-center gap-2 self-center px-3 py-1 rounded-full bg-[#481E14]/30 border border-[#9B3922]/40 text-[#F2613F] text-xs font-mono uppercase tracking-wider">
            <Briefcase className="size-3.5" />
            Background & Credentials
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white dark:text-white light:text-[#0C0C0C]">
            Experience & <span className="text-gradient-highlight">Education</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Work Experience (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-[#481E14]/40 text-[#F2613F] flex items-center justify-center">
                <Briefcase className="size-4" />
              </div>
              <h3 className="font-display font-bold text-xl text-white dark:text-white light:text-[#0C0C0C]">
                Professional Experience
              </h3>
            </div>

            {portfolioData.experience.map((exp, idx) => (
              <div
                key={idx}
                className="glass-panel p-7 rounded-3xl border border-[#481E14]/50 flex flex-col gap-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#481E14]/40 pb-4">
                  <div>
                    <h4 className="font-display font-bold text-xl text-white dark:text-white light:text-[#0C0C0C]">
                      {exp.role}
                    </h4>
                    <p className="text-sm font-mono text-[#F2613F]">
                      {exp.company}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#481E14]/30 border border-[#9B3922]/40 text-xs font-mono text-[#F2613F] self-start sm:self-auto">
                    {exp.period}
                  </span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {exp.points.map((point, pIdx) => (
                    <div
                      key={pIdx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 dark:text-slate-300 light:text-slate-700 font-light"
                    >
                      <CheckCircle2 className="size-4 text-[#F2613F] shrink-0 mt-0.5" />
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
              <div className="size-8 rounded-lg bg-[#481E14]/40 text-[#9B3922] flex items-center justify-center">
                <GraduationCap className="size-4" />
              </div>
              <h3 className="font-display font-bold text-xl text-white dark:text-white light:text-[#0C0C0C]">
                Academic Foundation
              </h3>
            </div>

            <div className="glass-panel p-7 rounded-3xl border border-[#481E14]/50 flex flex-col gap-5">
              <div className="flex flex-col gap-1 border-b border-[#481E14]/40 pb-4">
                <span className="px-3 py-1 rounded-full bg-[#481E14]/30 border border-[#9B3922]/40 text-xs font-mono text-[#F2613F] self-start mb-1">
                  {portfolioData.education.period}
                </span>
                <h4 className="font-display font-bold text-lg text-white dark:text-white light:text-[#0C0C0C]">
                  {portfolioData.education.degree}
                </h4>
                <p className="text-xs font-mono text-[#9B3922]">
                  {portfolioData.education.institution}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
                  {portfolioData.education.location}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#481E14]/20 border border-[#481E14]/50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300 dark:text-slate-300 light:text-slate-700 text-xs font-mono">
                  <Award className="size-4 text-[#F2613F]" />
                  <span>Graduation Score</span>
                </div>
                <span className="font-display font-bold text-2xl text-[#F2613F]">
                  {portfolioData.education.cgpa}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-mono text-slate-400 dark:text-slate-400 light:text-slate-600 uppercase tracking-wider block">
                  Core Foundations:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {portfolioData.education.coursework.map((course, cIdx) => (
                    <span
                      key={cIdx}
                      className="px-2.5 py-1 rounded-md bg-[#481E14]/20 border border-[#481E14]/60 text-xs font-mono text-slate-300 dark:text-slate-300 light:text-slate-700"
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
