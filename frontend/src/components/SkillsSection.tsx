import React from "react";
import { portfolioData } from "../data/portfolioData";
import { Layers, Sparkles, Server, Layout, Database } from "lucide-react";

export const SkillsSection: React.FC = () => {
  return (
    <section
      id="skills"
      className="py-24 px-4 sm:px-6 lg:px-8 border-t border-[#481E14]/30"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-14">
        {/* Section Header */}
        <div className="text-center flex flex-col gap-2.5">
          <div className="inline-flex items-center gap-2 self-center px-3 py-1 rounded-full bg-[#481E14]/30 border border-[#9B3922]/40 text-[#F2613F] text-xs font-mono uppercase tracking-wider">
            <Layers className="size-3.5" />
            Engineering Arsenal
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white dark:text-white light:text-[#0C0C0C]">
            Technical <span className="text-gradient-highlight">Skills</span>
          </h2>
        </div>

        {/* 4 Skill Categories Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. Generative AI */}
          <div className="p-6 rounded-3xl glass-panel border border-[#481E14]/50 flex flex-col gap-4 group hover:border-[#F2613F]/50 transition-all">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-[#481E14]/40 border border-[#9B3922]/40 flex items-center justify-center text-[#F2613F]">
                <Sparkles className="size-4" />
              </div>
              <h3 className="font-display font-bold text-base text-white dark:text-white light:text-[#0C0C0C]">
                Generative AI
              </h3>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {portfolioData.skills.ai.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-[#481E14]/20 border border-[#481E14]/60 text-xs font-mono text-[#F2613F]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* 2. Backend & Runtime */}
          <div className="p-6 rounded-3xl glass-panel border border-[#481E14]/50 flex flex-col gap-4 group hover:border-[#F2613F]/50 transition-all">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-[#481E14]/40 border border-[#9B3922]/40 flex items-center justify-center text-[#9B3922]">
                <Server className="size-4" />
              </div>
              <h3 className="font-display font-bold text-base text-white dark:text-white light:text-[#0C0C0C]">
                Backend Systems
              </h3>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {portfolioData.skills.backend.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-[#481E14]/20 border border-[#481E14]/60 text-xs font-mono text-slate-300 dark:text-slate-300 light:text-slate-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* 3. Frontend */}
          <div className="p-6 rounded-3xl glass-panel border border-[#481E14]/50 flex flex-col gap-4 group hover:border-[#F2613F]/50 transition-all">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-[#481E14]/40 border border-[#9B3922]/40 flex items-center justify-center text-[#F2613F]">
                <Layout className="size-4" />
              </div>
              <h3 className="font-display font-bold text-base text-white dark:text-white light:text-[#0C0C0C]">
                Frontend UI
              </h3>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {portfolioData.skills.frontend.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-[#481E14]/20 border border-[#481E14]/60 text-xs font-mono text-slate-300 dark:text-slate-300 light:text-slate-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* 4. Databases & CS Core */}
          <div className="p-6 rounded-3xl glass-panel border border-[#481E14]/50 flex flex-col gap-4 group hover:border-[#F2613F]/50 transition-all">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-[#481E14]/40 border border-[#9B3922]/40 flex items-center justify-center text-[#9B3922]">
                <Database className="size-4" />
              </div>
              <h3 className="font-display font-bold text-base text-white dark:text-white light:text-[#0C0C0C]">
                Core Foundations
              </h3>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {portfolioData.skills.core.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-[#481E14]/20 border border-[#481E14]/60 text-xs font-mono text-slate-300 dark:text-slate-300 light:text-slate-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
