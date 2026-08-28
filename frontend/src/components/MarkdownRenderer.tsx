import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  content: string;
  theme?: "cyan" | "purple";
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  theme = "purple",
}) => {
  const accentColor = theme === "cyan" ? "text-cyan-400" : "text-purple-400";
  const inlineCodeBorder =
    theme === "cyan"
      ? "border-cyan-500/30 text-cyan-300"
      : "border-purple-500/30 text-purple-300";

  return (
    <div className="markdown-content text-sm text-slate-200 leading-relaxed font-light flex flex-col gap-3">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1
              className={`font-display font-bold text-lg text-white mt-3 mb-1.5 first:mt-0 ${accentColor}`}
            >
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-display font-bold text-base text-white mt-3 mb-1.5 first:mt-0 flex items-center gap-1.5">
              <span
                className={`inline-block size-1.5 rounded-full ${theme === "cyan" ? "bg-cyan-400" : "bg-purple-400"}`}
              />
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-display font-semibold text-sm text-slate-100 mt-2 mb-1 first:mt-0">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="leading-relaxed text-slate-300">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-white">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-slate-200">{children}</em>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside ml-5 space-y-1.5 my-1 text-slate-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside ml-5 space-y-1.5 my-1 text-slate-300 font-normal">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed pl-0.5">{children}</li>
          ),
          code: ({ children, className }) => {
            const isCodeBlock = className && className.includes("language-");
            if (isCodeBlock) {
              return (
                <pre className="p-3 my-2 rounded-xl bg-slate-950 border border-white/10 font-mono text-xs text-cyan-300 overflow-x-auto">
                  <code>{children}</code>
                </pre>
              );
            }
            return (
              <code
                className={`px-1.5 py-0.5 rounded bg-slate-900/90 border ${inlineCodeBorder} font-mono text-xs font-medium`}
              >
                {children}
              </code>
            );
          },
          blockquote: ({ children }) => (
            <blockquote
              className={`border-l-2 ${theme === "cyan" ? "border-cyan-500" : "border-purple-500"} pl-3.5 my-2 text-slate-400 italic bg-slate-950/40 py-1 rounded-r-lg`}
            >
              {children}
            </blockquote>
          ),
          hr: () => <hr className="border-white/10 my-3" />,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`underline underline-offset-2 font-medium ${accentColor} hover:opacity-80 transition-opacity`}
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
