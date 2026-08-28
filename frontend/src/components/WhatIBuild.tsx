import React from "react";
import { portfolioData } from "../data/portfolioData";
import { Sparkles, Layers, Cpu, Code2 } from "lucide-react";

export const WhatIBuild: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Sparkles":
        return <Sparkles className="size-5 text-cyan-400" />;
      case "Layers":
        return <Layers className="size-5 text-purple-400" />;
      case "Cpu":
      default:
        return <Cpu className="size-5 text-emerald-400" />;
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-slate-950/40">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="text-center flex flex-col gap-2.5">
          <div className="inline-flex items-center gap-2 self-center px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider">
            <Code2 className="size-3.5" />
            Core Specialization
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
            Engineering <span className="text-gradient-cyan">Pillars</span>
          </h2>
        </div>

        {/* 3 Pillars Bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portfolioData.pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-7 rounded-3xl glass-panel border border-white/10 flex flex-col justify-between gap-6 group hover:border-cyan-500/40 transition-all"
            >
              <div className="flex flex-col gap-4">
                <div className="size-11 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center">
                  {getIcon(pillar.icon)}
                </div>
                <h3 className="font-display font-bold text-xl text-white group-hover:text-cyan-300 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  {pillar.summary}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                {pillar.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300"
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
