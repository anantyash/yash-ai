import React from "react";

interface ToastProps {
  message: string | null;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl glass-panel border border-cyan-500/40 bg-slate-900/95 text-white text-xs font-mono shadow-2xl flex items-center gap-3 animate-bounce"
    >
      <span className="size-2.5 rounded-full bg-cyan-400 animate-pulse" />
      <span>{message}</span>
    </div>
  );
};
