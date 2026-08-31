import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Database,
  Layers,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Zap,
  ShieldCheck,
  Timer,
  Activity,
  Coins,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { api, AskResult, RagResult, ApiError, SessionLimits } from "../lib/api";
import { cn } from "../lib/utils";
import { MarkdownRenderer } from "./MarkdownRenderer";

export const AILab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"ask" | "rag" | "architecture">(
    "ask",
  );

  // Live Session Limits HUD State
  const [limits, setLimits] = useState<SessionLimits>({
    askQuestionsRemaining: 8,
    ragQuestionsRemaining: 3,
    askTokensRemaining: 3000,
    ragTokensRemaining: 2500,
  });

  // Ask Yash State
  const [askQuery, setAskQuery] = useState("");
  const [askLoading, setAskLoading] = useState(false);
  const [askResult, setAskResult] = useState<AskResult | null>(null);
  const [askError, setAskError] = useState<ApiError | null>(null);

  // RAG Engine State
  const [ragQuery, setRagQuery] = useState("");
  const [ragLoading, setRagLoading] = useState(false);
  const [ragResult, setRagResult] = useState<RagResult | null>(null);
  const [ragError, setRagError] = useState<ApiError | null>(null);
  const [showSources, setShowSources] = useState(false);

  // Cooldown Countdown State (seconds)
  const [cooldown, setCooldown] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Active Arch Node State
  const [selectedNode, setSelectedNode] = useState<string>("gateway");

  // Subscribe to live limits and load session
  useEffect(() => {
    const unsubscribe = api.subscribeLimits((newLimits) => {
      setLimits({ ...newLimits });
    });

    api.getSession();

    return () => {
      unsubscribe();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCooldown = (seconds: number) => {
    setCooldown(seconds);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAskSubmit = async (
    e?: React.FormEvent,
    promptOverride?: string,
  ) => {
    if (e) e.preventDefault();
    const queryToSend = promptOverride || askQuery;
    if (!queryToSend.trim() || askLoading || cooldown > 0) return;

    setAskLoading(true);
    setAskError(null);
    setAskResult(null);

    try {
      const res = await api.askYash(queryToSend);
      setAskResult(res);
    } catch (err: any) {
      setAskError(err);
      if (err.code === "RATE_LIMIT_EXCEEDED") {
        startCooldown(err.retryAfterSeconds || 60);
      }
    } finally {
      setAskLoading(false);
    }
  };

  const handleRagSubmit = async (
    e?: React.FormEvent,
    promptOverride?: string,
  ) => {
    if (e) e.preventDefault();
    const queryToSend = promptOverride || ragQuery;
    if (!queryToSend.trim() || ragLoading || cooldown > 0) return;

    setRagLoading(true);
    setRagError(null);
    setRagResult(null);

    try {
      const res = await api.queryRag(queryToSend);
      setRagResult(res);
    } catch (err: any) {
      setRagError(err);
      if (err.code === "RATE_LIMIT_EXCEEDED") {
        startCooldown(err.retryAfterSeconds || 60);
      }
    } finally {
      setRagLoading(false);
    }
  };

  const suggestedQuestions = [
    "What projects has Yash built using Gemini & OpenAI?",
    "How does his MixChAI multi-model consensus engine work?",
    "What was his engineering impact at DigiCrow?",
    "What is his B.Tech CGPA and CS coursework?",
  ];

  // Token percentage calculations
  const askTokenPct = Math.min(
    100,
    Math.max(0, (limits.askTokensRemaining / 3000) * 100),
  );
  const ragTokenPct = Math.min(
    100,
    Math.max(0, (limits.ragTokensRemaining / 2500) * 100),
  );

  return (
    <section
      id="ai-lab"
      className="py-24 px-4 sm:px-6 lg:px-8 border-t border-[#481E14]/30 relative"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        {/* Section Header */}
        <div className="text-center flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 self-center px-3.5 py-1 rounded-full bg-[#481E14]/30 border border-[#9B3922]/40 text-[#F2613F] text-xs font-mono uppercase tracking-wider">
            <Zap className="size-3.5" />
            Live AI Services & System Telemetry
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white dark:text-white light:text-[#0C0C0C]">
            Interactive{" "}
            <span className="text-gradient-highlight">AI Playground</span>
          </h2>
          <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 max-w-2xl mx-auto text-xs sm:text-sm font-light leading-relaxed">
            Directly test the production AI Gateway, Gemini portfolio assistant,
            and OpenAI + pgvector RAG Engine.
          </p>
        </div>

        {/* Live Quotas & Token Telemetry HUD */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Ask Yash Telemetry Card */}
          <div className="p-4 rounded-2xl glass-panel border border-[#481E14]/50 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#F2613F] flex items-center gap-1.5">
                <Sparkles className="size-3.5" />
                Ask Yash Quota
              </span>
              <span className="px-2 py-0.5 rounded bg-[#481E14]/40 border border-[#9B3922]/40 text-[11px] font-mono text-[#F2613F]">
                {limits.askQuestionsRemaining} / 8 Req Left
              </span>
            </div>
            <div className="flex flex-col gap-1 mt-1">
              <div className="flex justify-between text-[11px] font-mono text-slate-400 dark:text-slate-400 light:text-slate-600">
                <span className="flex items-center gap-1">
                  <Coins className="size-3 text-[#F2613F]" />
                  Tokens:
                </span>
                <span className="text-slate-200 dark:text-slate-200 light:text-slate-800 font-semibold">
                  {limits.askTokensRemaining.toLocaleString()} / 3,000
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#0C0C0C] rounded-full overflow-hidden border border-[#481E14]/40">
                <div
                  className="h-full bg-gradient-to-r from-[#9B3922] to-[#F2613F] rounded-full transition-all duration-500"
                  style={{ width: `${askTokenPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* RAG Engine Telemetry Card */}
          <div className="p-4 rounded-2xl glass-panel border border-[#481E14]/50 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#9B3922] flex items-center gap-1.5">
                <Database className="size-3.5" />
                RAG Engine Quota
              </span>
              <span className="px-2 py-0.5 rounded bg-[#481E14]/40 border border-[#9B3922]/40 text-[11px] font-mono text-[#9B3922]">
                {limits.ragQuestionsRemaining} / 3 Req Left
              </span>
            </div>
            <div className="flex flex-col gap-1 mt-1">
              <div className="flex justify-between text-[11px] font-mono text-slate-400 dark:text-slate-400 light:text-slate-600">
                <span className="flex items-center gap-1">
                  <Coins className="size-3 text-[#9B3922]" />
                  Tokens:
                </span>
                <span className="text-slate-200 dark:text-slate-200 light:text-slate-800 font-semibold">
                  {limits.ragTokensRemaining.toLocaleString()} / 2,500
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#0C0C0C] rounded-full overflow-hidden border border-[#481E14]/40">
                <div
                  className="h-full bg-gradient-to-r from-[#481E14] to-[#9B3922] rounded-full transition-all duration-500"
                  style={{ width: `${ragTokenPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Rate Limit & Concurrency Card */}
          <div className="p-4 rounded-2xl glass-panel border border-[#481E14]/50 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#F2613F] flex items-center gap-1.5">
                <Activity className="size-3.5" />
                Rate & Concurrency Guard
              </span>
              <span className="px-2 py-0.5 rounded bg-[#481E14]/40 border border-[#9B3922]/40 text-[11px] font-mono text-[#F2613F]">
                Active
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-300 dark:text-slate-300 light:text-slate-700 flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-slate-400 light:text-slate-600">Window Limit:</span>
                <span className="text-[#F2613F]">5 req / min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-slate-400 light:text-slate-600">Concurrency:</span>
                <span className="text-slate-200 dark:text-slate-200 light:text-slate-800">1 active req / session</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center">
          <div className="p-1.5 rounded-2xl bg-[#0C0C0C] dark:bg-[#0C0C0C] light:bg-[#FFFFFF] border border-[#481E14]/60 flex flex-wrap gap-1 shadow-2xl">
            <button
              onClick={() => setActiveTab("ask")}
              className={cn(
                "px-5 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-medium transition-all flex items-center gap-2",
                activeTab === "ask"
                  ? "bg-[#481E14]/60 text-[#F2613F] border border-[#9B3922] shadow-lg shadow-[#F2613F]/10 font-bold"
                  : "text-slate-400 hover:text-white",
              )}
            >
              <Sparkles className="size-4 text-[#F2613F]" />
              <span>Ask Yash (Gemini)</span>
            </button>

            <button
              onClick={() => setActiveTab("rag")}
              className={cn(
                "px-5 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-medium transition-all flex items-center gap-2",
                activeTab === "rag"
                  ? "bg-[#481E14]/60 text-[#F2613F] border border-[#9B3922] shadow-lg shadow-[#F2613F]/10 font-bold"
                  : "text-slate-400 hover:text-white",
              )}
            >
              <Database className="size-4 text-[#9B3922]" />
              <span>RAG Engine (OpenAI + pgvector)</span>
            </button>

            <button
              onClick={() => setActiveTab("architecture")}
              className={cn(
                "px-5 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-medium transition-all flex items-center gap-2",
                activeTab === "architecture"
                  ? "bg-[#481E14]/60 text-[#F2613F] border border-[#9B3922] shadow-lg shadow-[#F2613F]/10 font-bold"
                  : "text-slate-400 hover:text-white",
              )}
            >
              <Layers className="size-4 text-[#F2613F]" />
              <span>Architecture Visualizer</span>
            </button>
          </div>
        </div>

        {/* Global Cooldown Alert */}
        {cooldown > 0 && (
          <div className="p-4 rounded-2xl bg-[#481E14]/40 border border-[#F2613F]/40 text-[#F2613F] text-xs font-mono flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <Timer className="size-4 text-[#F2613F] animate-spin" />
              <span>
                Client Rate-Limit Cooldown Active: Protecting server quota
              </span>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#481E14] font-bold">
              {cooldown}s remaining
            </span>
          </div>
        )}

        {/* Tab 1: Ask Yash (Gemini) */}
        {activeTab === "ask" && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#481E14]/50 flex flex-col gap-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#481E14]/40 pb-4">
              <div>
                <h3 className="font-display font-bold text-xl text-white dark:text-white light:text-[#0C0C0C] flex items-center gap-2">
                  <Sparkles className="size-5 text-[#F2613F]" />
                  Ask Yash AI Assistant
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 font-mono mt-0.5">
                  Powered by Google Gemini 1.5 Flash • Grounded in portfolio facts
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-3 py-1 rounded-full bg-[#481E14]/30 border border-[#9B3922]/40 text-[#F2613F] flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[#F2613F] animate-pulse" />
                  <span>{limits.askQuestionsRemaining} questions left</span>
                </span>
              </div>
            </div>

            {/* Suggested Question Chips */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-400 light:text-slate-600 uppercase tracking-wider">
                Suggested Questions:
              </span>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    disabled={
                      askLoading ||
                      cooldown > 0 ||
                      limits.askQuestionsRemaining <= 0
                    }
                    onClick={() => {
                      setAskQuery(q);
                      handleAskSubmit(undefined, q);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#481E14]/20 hover:bg-[#481E14]/50 border border-[#481E14]/60 hover:border-[#F2613F]/50 text-xs font-mono text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-[#F2613F] transition-all text-left disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {q} ↗
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => handleAskSubmit(e)}
              className="flex flex-col gap-3"
            >
              <div className="relative">
                <input
                  type="text"
                  value={askQuery}
                  onChange={(e) => {
                    setAskQuery(e.target.value);
                    if (askError) setAskError(null);
                  }}
                  placeholder={
                    limits.askQuestionsRemaining <= 0
                      ? "Ask Yash session quota reached (8/8 questions used)."
                      : cooldown > 0
                        ? `Cooldown active (${cooldown}s)...`
                        : "Ask anything about Yash's projects, experience, or technical stack..."
                  }
                  disabled={
                    askLoading ||
                    cooldown > 0 ||
                    limits.askQuestionsRemaining <= 0
                  }
                  className="w-full px-5 py-4 rounded-2xl bg-[#0C0C0C]/80 dark:bg-[#0C0C0C]/80 light:bg-[#FFFFFF] border border-[#481E14]/60 text-white dark:text-white light:text-[#0C0C0C] placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-[#F2613F] transition-colors pr-28 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={
                    askLoading ||
                    !askQuery.trim() ||
                    cooldown > 0 ||
                    limits.askQuestionsRemaining <= 0
                  }
                  className="absolute right-2.5 top-2.5 bottom-2.5 px-4 rounded-xl bg-gradient-to-r from-[#9B3922] via-[#9B3922] to-[#F2613F] hover:from-[#F2613F] hover:to-[#FFA07A] text-white font-mono text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 transition-all shadow-md shadow-[#F2613F]/20"
                >
                  {askLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                  <span>{askLoading ? "Thinking..." : "Ask ↗"}</span>
                </button>
              </div>
            </form>

            {/* Error Notification */}
            {askError && (
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-start gap-3">
                <AlertCircle className="size-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="font-bold">[{askError.code}]</span>
                  <span>{askError.message}</span>
                </div>
              </div>
            )}

            {/* Response Output Card */}
            {askResult && (
              <div className="p-6 rounded-2xl bg-[#0C0C0C]/90 dark:bg-[#0C0C0C]/90 light:bg-[#FFFFFF] border border-[#481E14]/60 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-[#481E14]/40 pb-3 text-xs font-mono text-slate-400 dark:text-slate-400 light:text-slate-600">
                  <div className="flex items-center gap-2 text-[#F2613F] font-semibold">
                    <CheckCircle2 className="size-4 text-emerald-400" />
                    <span>Gemini Verified Response</span>
                    {askResult.cacheHit && (
                      <span className="px-2 py-0.5 rounded bg-[#481E14]/40 border border-[#9B3922]/40 text-[#F2613F] text-[10px]">
                        Redis Cache Hit (0 Tokens)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3 text-slate-500" />
                      <span>{askResult.model}</span>
                    </span>
                  </div>
                </div>

                <div className="py-1">
                  <MarkdownRenderer content={askResult.answer} theme="highlight" />
                </div>

                {/* Telemetry Footer */}
                <div className="pt-3 border-t border-[#481E14]/40 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400 dark:text-slate-400 light:text-slate-600">
                  <div className="flex items-center gap-4">
                    <span>
                      Input:{" "}
                      <strong className="text-slate-300 dark:text-slate-300 light:text-slate-700">
                        {askResult.usage.inputTokens}
                      </strong>
                    </span>
                    <span>
                      Output:{" "}
                      <strong className="text-slate-300 dark:text-slate-300 light:text-slate-700">
                        {askResult.usage.outputTokens}
                      </strong>
                    </span>
                    <span>
                      Total:{" "}
                      <strong className="text-[#F2613F]">
                        {askResult.usage.totalTokens} tokens
                      </strong>
                    </span>
                  </div>
                  <div>
                    <span>
                      Questions Remaining:{" "}
                      <strong className="text-emerald-400">
                        {askResult.limits.questionsRemaining}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: RAG Engine (OpenAI + pgvector) */}
        {activeTab === "rag" && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#481E14]/50 flex flex-col gap-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#481E14]/40 pb-4">
              <div>
                <h3 className="font-display font-bold text-xl text-white dark:text-white light:text-[#0C0C0C] flex items-center gap-2">
                  <Database className="size-5 text-[#9B3922]" />
                  RAG Knowledge Engine
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 font-mono mt-0.5">
                  Semantic retrieval over PostgreSQL pgvector (HNSW cosine index) + OpenAI gpt-4o-mini
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-[#481E14]/30 border border-[#9B3922]/40 text-[#9B3922] text-xs font-mono self-start sm:self-auto">
                {limits.ragQuestionsRemaining} queries left
              </span>
            </div>

            {/* Suggested RAG Queries */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-400 light:text-slate-600 uppercase tracking-wider">
                Deep-Dive Queries:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  "Explain the evaluator consensus mechanism in MixChAI",
                  "What payment gateway workflows were implemented at DigiCrow?",
                  "How does the token reservation and reconciliation algorithm work?",
                ].map((q, idx) => (
                  <button
                    key={idx}
                    disabled={
                      ragLoading ||
                      cooldown > 0 ||
                      limits.ragQuestionsRemaining <= 0
                    }
                    onClick={() => {
                      setRagQuery(q);
                      handleRagSubmit(undefined, q);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#481E14]/20 hover:bg-[#481E14]/50 border border-[#481E14]/60 hover:border-[#F2613F]/50 text-xs font-mono text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-[#F2613F] transition-all text-left disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {q} ↗
                  </button>
                ))}
              </div>
            </div>

            {/* RAG Input Form */}
            <form
              onSubmit={(e) => handleRagSubmit(e)}
              className="flex flex-col gap-3"
            >
              <div className="relative">
                <input
                  type="text"
                  value={ragQuery}
                  onChange={(e) => {
                    setRagQuery(e.target.value);
                    if (ragError) setRagError(null);
                  }}
                  placeholder={
                    limits.ragQuestionsRemaining <= 0
                      ? "RAG Engine session quota reached (3/3 queries used)."
                      : cooldown > 0
                        ? `Cooldown active (${cooldown}s)...`
                        : "Enter technical query to trigger vector similarity search & grounded generation..."
                  }
                  disabled={
                    ragLoading ||
                    cooldown > 0 ||
                    limits.ragQuestionsRemaining <= 0
                  }
                  className="w-full px-5 py-4 rounded-2xl bg-[#0C0C0C]/80 dark:bg-[#0C0C0C]/80 light:bg-[#FFFFFF] border border-[#481E14]/60 text-white dark:text-white light:text-[#0C0C0C] placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-[#F2613F] transition-colors pr-28 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={
                    ragLoading ||
                    !ragQuery.trim() ||
                    cooldown > 0 ||
                    limits.ragQuestionsRemaining <= 0
                  }
                  className="absolute right-2.5 top-2.5 bottom-2.5 px-4 rounded-xl bg-gradient-to-r from-[#9B3922] via-[#9B3922] to-[#F2613F] hover:from-[#F2613F] hover:to-[#FFA07A] text-white font-mono text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 transition-all shadow-md shadow-[#F2613F]/20"
                >
                  {ragLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Database className="size-4" />
                  )}
                  <span>{ragLoading ? "Retrieving..." : "Search ↗"}</span>
                </button>
              </div>
            </form>

            {/* Error Notification */}
            {ragError && (
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-start gap-3">
                <AlertCircle className="size-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="font-bold">[{ragError.code}]</span>
                  <span>{ragError.message}</span>
                </div>
              </div>
            )}

            {/* RAG Result & Sources */}
            {ragResult && (
              <div className="flex flex-col gap-5 animate-fadeIn">
                {/* 1. Primary Synthesized Grounded Output */}
                <div className="p-6 sm:p-7 rounded-2xl bg-[#0C0C0C]/90 dark:bg-[#0C0C0C]/90 light:bg-[#FFFFFF] border border-[#481E14]/60 shadow-xl flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-[#481E14]/40 pb-3 text-xs font-mono text-[#F2613F]">
                    <span className="font-semibold flex items-center gap-1.5">
                      <ShieldCheck className="size-4 text-emerald-400" />
                      Grounded Answer (gpt-4o-mini)
                    </span>
                    <span className="text-slate-400 dark:text-slate-400 light:text-slate-600">
                      {ragResult.usage.totalTokens} Tokens
                    </span>
                  </div>

                  <div className="py-1">
                    <MarkdownRenderer
                      content={ragResult.answer}
                      theme="system"
                    />
                  </div>

                  {/* Telemetry Footer */}
                  <div className="pt-3 border-t border-[#481E14]/40 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400 dark:text-slate-400 light:text-slate-600">
                    <div className="flex items-center gap-4">
                      <span>
                        Input:{" "}
                        <strong className="text-slate-300 dark:text-slate-300 light:text-slate-700">
                          {ragResult.usage.inputTokens}
                        </strong>
                      </span>
                      <span>
                        Output:{" "}
                        <strong className="text-slate-300 dark:text-slate-300 light:text-slate-700">
                          {ragResult.usage.outputTokens}
                        </strong>
                      </span>
                      <span>
                        Total:{" "}
                        <strong className="text-[#F2613F]">
                          {ragResult.usage.totalTokens} tokens
                        </strong>
                      </span>
                    </div>
                    <div>
                      <span>
                        Queries Remaining:{" "}
                        <strong className="text-emerald-400">
                          {ragResult.limits.questionsRemaining}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Collapsible Document Citations Strip */}
                {ragResult.sources && ragResult.sources.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => setShowSources(!showSources)}
                      className="px-4 py-2.5 rounded-xl bg-[#481E14]/20 hover:bg-[#481E14]/40 border border-[#481E14]/60 text-xs font-mono text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-[#F2613F] flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="size-3.5 text-[#F2613F]" />
                        <span>
                          Verified Knowledge Base Citations (
                          {ragResult.sources.length} matching vector chunks)
                        </span>
                      </div>
                      {showSources ? (
                        <ChevronUp className="size-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="size-4 text-slate-400" />
                      )}
                    </button>

                    {showSources && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fadeIn">
                        {ragResult.sources.map((src, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-4 rounded-2xl bg-[#0C0C0C] dark:bg-[#0C0C0C] light:bg-[#FFFFFF] border border-[#481E14]/60 flex flex-col gap-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-display font-bold text-xs text-white dark:text-white light:text-[#0C0C0C] flex items-center gap-1.5">
                                <FileText className="size-3.5 text-[#F2613F]" />
                                {src.title}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-[#481E14]/40 border border-[#9B3922]/40 text-[11px] font-mono text-[#F2613F]">
                                {(src.score * 100).toFixed(0)}% Similarity
                              </span>
                            </div>
                            <p className="text-[11px] font-mono text-slate-400 dark:text-slate-400 light:text-slate-600 line-clamp-3 leading-relaxed">
                              {src.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: System Architecture Visualizer */}
        {activeTab === "architecture" && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#481E14]/50 flex flex-col gap-8 animate-fadeIn">
            <div className="flex flex-col gap-1 border-b border-[#481E14]/40 pb-4">
              <h3 className="font-display font-bold text-xl text-white dark:text-white light:text-[#0C0C0C] flex items-center gap-2">
                <Layers className="size-5 text-[#F2613F]" />
                Production AI Gateway & Control Plane Architecture
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 font-mono">
                Click any component node below to inspect its operational role,
                security safeguards, and implementation details.
              </p>
            </div>

            {/* Interactive Architecture Flow Nodes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  id: "gateway",
                  label: "1. AI Gateway",
                  desc: "Express / Helmet / CORS / 10kb Body limit",
                },
                {
                  id: "budget",
                  label: "2. Token Budget",
                  desc: "4-Tier quota: Request, Session, IP, Global",
                },
                {
                  id: "pgvector",
                  label: "3. pgvector Database",
                  desc: "PostgreSQL 16 + HNSW cosine index",
                },
                {
                  id: "redis",
                  label: "4. Redis Control Plane",
                  desc: "Sliding window rate limit & response cache",
                },
              ].map((node) => (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node.id)}
                  className={cn(
                    "p-4 rounded-2xl text-left border transition-all flex flex-col gap-1.5",
                    selectedNode === node.id
                      ? "bg-[#481E14]/60 border-[#F2613F] text-white shadow-lg shadow-[#F2613F]/10 font-bold"
                      : "bg-[#0C0C0C] dark:bg-[#0C0C0C] light:bg-[#FFFFFF] border-[#481E14]/50 text-slate-400 hover:border-[#9B3922]",
                  )}
                >
                  <span className="font-mono text-xs font-bold text-[#F2613F]">
                    {node.label}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-400 light:text-slate-600">
                    {node.desc}
                  </span>
                </button>
              ))}
            </div>

            {/* Deep Node Detail Box */}
            <div className="p-6 rounded-2xl bg-[#0C0C0C] dark:bg-[#0C0C0C] light:bg-[#FFFFFF] border border-[#481E14]/60 font-mono text-xs leading-relaxed text-slate-300 dark:text-slate-300 light:text-slate-700">
              {selectedNode === "gateway" && (
                <div className="flex flex-col gap-3">
                  <div className="text-[#F2613F] font-bold text-sm">
                    [AI Gateway & Defense-in-Depth]
                  </div>
                  <p>
                    • All provider API keys reside strictly server-side in
                    environment variables.
                  </p>
                  <p>
                    • Input requests are validated using Zod schemas with
                    character and token boundaries.
                  </p>
                  <p>
                    • Local InjectionGuard rejects prompt injection and system
                    leak attempts with 0 token spend.
                  </p>
                  <p>
                    • Centralized error handling guarantees zero leaked internal
                    credentials or stack traces.
                  </p>
                </div>
              )}

              {selectedNode === "budget" && (
                <div className="flex flex-col gap-3">
                  <div className="text-[#F2613F] font-bold text-sm">
                    [4-Tier Token Budget & Reservation Architecture]
                  </div>
                  <p>
                    • Pre-flight token estimation calculates character
                    heuristics before provider invocation.
                  </p>
                  <p>
                    • Atomic Redis reservation reserves tokens against global
                    daily quota (30,000 tokens/day).
                  </p>
                  <p>
                    • Post-flight reconciliation releases unneeded tokens and
                    accurately increments session usage.
                  </p>
                  <p>
                    • Session concurrency lock ensures maximum 1 active AI
                    request per visitor session.
                  </p>
                </div>
              )}

              {selectedNode === "pgvector" && (
                <div className="flex flex-col gap-3">
                  <div className="text-[#F2613F] font-bold text-sm">
                    [PostgreSQL 16 + pgvector Storage Layer]
                  </div>
                  <p>
                    • Canonical knowledge markdown parsed, chunked, and embedded
                    into 1536-dim vectors.
                  </p>
                  <p>
                    • HNSW index on vector_cosine_ops provides sub-millisecond
                    similarity retrieval.
                  </p>
                  <p>
                    • Persistent storage of anonymous visitor sessions and
                    detailed request audit logs.
                  </p>
                </div>
              )}

              {selectedNode === "redis" && (
                <div className="flex flex-col gap-3">
                  <div className="text-[#F2613F] font-bold text-sm">
                    [Redis 7 Control Plane & Caching]
                  </div>
                  <p>
                    • Distributed sliding window rate limiting (5 AI
                    requests/min per IP).
                  </p>
                  <p>
                    • Normalized question SHA-256 response caching with
                    automatic TTL expiration.
                  </p>
                  <p>
                    • Circuit breaker state management to automatically trip and
                    cool down during provider outages.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
