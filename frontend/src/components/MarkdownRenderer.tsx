import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  content: string;
  theme?: "cyan" | "purple" | "highlight" | "system";
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  theme = "highlight",
}) => {
  const accentColor =
    theme === "cyan" || theme === "highlight" ? "text-[#F2613F]" : "text-[#9B3922]";
  const inlineCodeBorder =
    theme === "cyan" || theme === "highlight"
      ? "border-[#9B3922]/50 text-[#F2613F] bg-[#481E14]/30"
      : "border-[#481E14]/60 text-slate-200 bg-[#481E14]/20";

  return (
    <div className="markdown-content text-sm text-slate-200 dark:text-slate-200 light:text-slate-800 leading-relaxed font-light flex flex-col gap-3">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1
              className={`font-display font-bold text-lg text-white dark:text-white light:text-[#0C0C0C] mt-3 mb-1.5 first:mt-0 ${accentColor}`}
            >
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-display font-bold text-base text-white dark:text-white light:text-[#0C0C0C] mt-3 mb-1.5 first:mt-0 flex items-center gap-1.5">
              <span className="inline-block size-1.5 rounded-full bg-[#F2613F]" />
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-display font-semibold text-sm text-slate-100 dark:text-slate-100 light:text-slate-900 mt-2 mb-1 first:mt-0">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="leading-relaxed text-slate-300 dark:text-slate-300 light:text-slate-700">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-white dark:text-white light:text-black">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-slate-200 dark:text-slate-200 light:text-slate-800">{children}</em>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside ml-5 space-y-1.5 my-1 text-slate-300 dark:text-slate-300 light:text-slate-700">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside ml-5 space-y-1.5 my-1 text-slate-300 dark:text-slate-300 light:text-slate-700 font-normal">
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
                <pre className="p-3 my-2 rounded-xl bg-[#0C0C0C] border border-[#481E14] font-mono text-xs text-[#F2613F] overflow-x-auto">
                  <code>{children}</code>
                </pre>
              );
            }
            return (
              <code
                className={`px-1.5 py-0.5 rounded border ${inlineCodeBorder} font-mono text-xs font-medium`}
              >
                {children}
              </code>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-[#F2613F] pl-3.5 my-2 text-slate-400 dark:text-slate-400 light:text-slate-600 italic bg-[#481E14]/15 py-1 rounded-r-lg">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="border-[#481E14]/40 my-3" />,
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
