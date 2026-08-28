import React from "react";
import { portfolioData } from "../data/portfolioData";
import { Layers, Sparkles, Server, Layout, Database } from "lucide-react";

export const SkillsSection: React.FC = () => {
  return (
    <section
      id="skills"
      className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-14">
        {/* Section Header */}
        <div className="text-center flex flex-col gap-2.5">
          <div className="inline-flex items-center gap-2 self-center px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-400 text-xs font-mono uppercase tracking-wider">
            <Layers className="size-3.5" />
            Engineering Arsenal
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white">
            Technical <span className="text-gradient-cyan">Skills</span>
          </h2>
        </div>

        {/* 4 Skill Categories Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. Generative AI */}
          <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 flex flex-col gap-4 group hover:border-cyan-500/60 transition-all">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Sparkles className="size-4" />
              </div>
              <h3 className="font-display font-bold text-base text-white">
                Generative AI
              </h3>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {portfolioData.skills.ai.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-xs font-mono text-cyan-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* 2. Backend & Runtime */}
          <div className="p-6 rounded-3xl glass-panel border border-indigo-500/30 flex flex-col gap-4 group hover:border-indigo-500/60 transition-all">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Server className="size-4" />
              </div>
              <h3 className="font-display font-bold text-base text-white">
                Backend Systems
              </h3>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {portfolioData.skills.backend.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-xs font-mono text-indigo-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* 3. Frontend */}
          <div className="p-6 rounded-3xl glass-panel border border-purple-500/30 flex flex-col gap-4 group hover:border-purple-500/60 transition-all">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Layout className="size-4" />
              </div>
              <h3 className="font-display font-bold text-base text-white">
                Frontend UI
              </h3>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {portfolioData.skills.frontend.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-purple-950/40 border border-purple-500/20 text-xs font-mono text-purple-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* 4. Databases & CS Core */}
          <div className="p-6 rounded-3xl glass-panel border border-emerald-500/30 flex flex-col gap-4 group hover:border-emerald-500/60 transition-all">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Database className="size-4" />
              </div>
              <h3 className="font-display font-bold text-base text-white">
                Core Foundations
              </h3>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {portfolioData.skills.core.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-xs font-mono text-emerald-300"
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
