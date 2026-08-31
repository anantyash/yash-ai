import React from "react";
import { portfolioData } from "../data/portfolioData";
import { Sparkles, Layers, Cpu, Code2 } from "lucide-react";

export const WhatIBuild: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Sparkles":
        return <Sparkles className="size-5 text-[#F2613F]" />;
      case "Layers":
        return <Layers className="size-5 text-[#9B3922]" />;
      case "Cpu":
      default:
        return <Cpu className="size-5 text-[#F2613F]" />;
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#481E14]/30 bg-[#0C0C0C]/40 dark:bg-[#0C0C0C]/40 light:bg-[#FAF7F5]/50">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="text-center flex flex-col gap-2.5">
          <div className="inline-flex items-center gap-2 self-center px-3 py-1 rounded-full bg-[#481E14]/30 border border-[#9B3922]/40 text-[#F2613F] text-xs font-mono uppercase tracking-wider">
            <Code2 className="size-3.5" />
            Core Specialization
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white dark:text-white light:text-[#0C0C0C]">
            Engineering <span className="text-gradient-highlight">Pillars</span>
          </h2>
        </div>

        {/* 3 Pillars Bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portfolioData.pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-7 rounded-3xl glass-panel border border-[#481E14]/50 flex flex-col justify-between gap-6 group hover:border-[#F2613F]/50 transition-all"
            >
              <div className="flex flex-col gap-4">
                <div className="size-11 rounded-2xl bg-[#481E14]/30 border border-[#9B3922]/30 flex items-center justify-center">
                  {getIcon(pillar.icon)}
                </div>
                <h3 className="font-display font-bold text-xl text-white dark:text-white light:text-[#0C0C0C] group-hover:text-[#F2613F] transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-300 light:text-slate-700 leading-relaxed font-light">
                  {pillar.summary}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#481E14]/40">
                {pillar.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 py-1 rounded-lg bg-[#481E14]/20 border border-[#481E14]/60 text-[11px] font-mono text-slate-300 dark:text-slate-300 light:text-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
