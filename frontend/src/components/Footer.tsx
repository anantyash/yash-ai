import React from "react";
import { portfolioData } from "../data/portfolioData";
import { ArrowUp } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="py-10 border-t border-white/5 bg-[#030508] relative z-10 text-xs font-mono text-slate-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-400">
          <span>Engineered by</span>
          <span className="text-white font-semibold">
            {portfolioData.personal.name}
          </span>
          <span>• Generative AI & Systems</span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href={portfolioData.personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition-colors"
          >
            github.com/anantyash
          </a>
          <a
            href={portfolioData.personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition-colors"
          >
            linkedin.com/in/anantyash
          </a>
          <a
            href="#hero"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Top</span>
            <ArrowUp className="size-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
};
