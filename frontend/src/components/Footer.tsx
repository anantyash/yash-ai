import React from "react";
import { portfolioData } from "../data/portfolioData";
import { ArrowUp } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer
      className="py-10 relative z-10 text-xs font-mono"
      style={{
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border-subtle)",
        color: "var(--text-muted)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div
          className="flex items-center gap-2"
          style={{ color: "var(--text-secondary)" }}
        >
          <span>Engineered by</span>
          <span
            className="font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {portfolioData.personal.name}
          </span>
          <span>• Powered by AI</span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href={portfolioData.personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:opacity-70"
            style={{ color: "var(--text-secondary)" }}
          >
            github.com/anantyash
          </a>
          <a
            href={portfolioData.personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:opacity-70"
            style={{ color: "var(--text-secondary)" }}
          >
            linkedin.com/in/anantyash
          </a>
          <a
            href="#hero"
            className="transition-colors hover:opacity-70 flex items-center gap-1"
            style={{ color: "var(--text-secondary)" }}
          >
            <span>Top</span>
            <ArrowUp className="size-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
};
