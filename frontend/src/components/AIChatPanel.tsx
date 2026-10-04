import React, { useState, useEffect, useRef } from "react";
import { api, type ChatMessage } from "../api/client";
import {
  Send,
  Trash2,
  Sparkles,
  Loader2,
  RefreshCw,
  Lightbulb,
  GraduationCap,
  Search,
  PieChart,
  Compass,
  Brain,
} from "lucide-react";

interface AIChatPanelProps {
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
  fullPageMode?: boolean;
  onOpenMemories?: () => void;
}

type AssistantMode = "learn" | "research" | "portfolio" | "plan";

const MODE_CONFIG: Record<AssistantMode, {
  label: string;
  badge: string;
  icon: React.ReactNode;
  subtitle: string;
  prompts: string[];
}> = {
  learn: {
    label: "🎓 Learn / Tutor",
    badge: "Tutor Mode",
    icon: <GraduationCap className="w-4 h-4" />,
    subtitle: "Jargon-free concepts, analogies & beginner lessons",
    prompts: [
      "Explain P/E ratio with a real example",
      "Why does inflation destroy idle cash?",
      "Index Fund vs Active Mutual Fund",
      "Explain Compounding like I'm 15",
    ],
  },
  research: {
    label: "🔎 Research",
    badge: "Equity Analyst",
    icon: <Search className="w-4 h-4" />,
    subtitle: "Company fundamentals, valuation & financial metrics",
    prompts: [
      "Analyze Tata Motors fundamentals",
      "Is HDFC Bank valuation historically fair?",
      "Compare TCS vs Infosys profitability",
      "Explain Reliance Industries debt level",
    ],
  },
  portfolio: {
    label: "📊 Portfolio",
    badge: "Health Advisor",
    icon: <PieChart className="w-4 h-4" />,
    subtitle: "Diversification health, sector risks & rebalancing",
    prompts: [
      "Analyze my portfolio diversification",
      "Why is my portfolio concentrated?",
      "Explain my current P&L and risk exposure",
      "How can I balance my sector allocation?",
    ],
  },
  plan: {
    label: "🧭 Plan",
    badge: "Goal Navigator",
    icon: <Compass className="w-4 h-4" />,
    subtitle: "Horizon mapping, SIP amounts & life goals",
    prompts: [
      "I have ₹2,000/month. What should I explore first?",
      "How do I balance an emergency fund with investing?",
      "Illustrate an 8-year plan for ₹5 Lakh",
      "Should I invest in Gold or Index funds for 10 years?",
    ],
  },
};

export const AIChatPanel: React.FC<AIChatPanelProps> = ({
  initialPrompt,
  onClearInitialPrompt,
  fullPageMode = false,
  onOpenMemories,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [activeMode, setActiveMode] = useState<AssistantMode>("learn");
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingHistory, setFetchingHistory] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchHistory = async () => {
    setFetchingHistory(true);
    try {
      const history = await api.getChatHistory(40);
      setMessages(history);
    } catch {
      // ignore
    } finally {
      setFetchingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (initialPrompt) {
      setInputMessage(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt, onClearInitialPrompt]);

  const handleSend = async (textToSend?: string) => {
    const rawMessage = (textToSend || inputMessage).trim();
    if (!rawMessage || loading) return;

    // Prefix prompt with contextual mode tag so backend AI calibrates tone
    let messageWithMode = rawMessage;
    if (activeMode === "learn") {
      messageWithMode = `[MODE: TUTOR - Explain simply with analogies, zero stock-tip signals] ${rawMessage}`;
    } else if (activeMode === "research") {
      messageWithMode = `[MODE: RESEARCH - Fundamental financial analysis, valuation ratios, no buy/sell calls] ${rawMessage}`;
    } else if (activeMode === "portfolio") {
      messageWithMode = `[MODE: PORTFOLIO - Educational diversification assessment, explain health & risks] ${rawMessage}`;
    } else if (activeMode === "plan") {
      messageWithMode = `[MODE: PLAN - Long-term financial planning & category exploration] ${rawMessage}`;
    }

    const userMsg: ChatMessage = {
      role: "user",
      message: rawMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setLoading(true);

    try {
      const res = await api.sendMessage(messageWithMode);
      const assistantMsg: ChatMessage = {
        role: "assistant",
        message: res.response,
        timestamp: new Date().toISOString(),
        remembered: res.remembered && res.remembered.length > 0 ? res.remembered : undefined,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        role: "assistant",
        message: `An error occurred while generating analysis: ${err.message || "Failed to connect to AI engine."}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm("Are you sure you want to clear chat session history?")) {
      try {
        await api.clearChatHistory();
        setMessages([]);
      } catch (err: any) {
        alert("Failed to clear chat history: " + err.message);
      }
    }
  };

  const renderFormattedMessage = (content: string) => {
    const lines = content.split("\n");
    return (
      <div className="space-y-2 text-xs text-on-surface leading-relaxed font-body">
        {lines.map((line, idx) => {
          if (line.startsWith("### ")) {
            return (
              <h4 key={idx} className="text-xs font-bold text-on-surface mt-2 mb-1 uppercase tracking-wide">
                {line.replace("### ", "")}
              </h4>
            );
          }
          if (line.startsWith("## ")) {
            return (
              <h3 key={idx} className="text-sm font-bold text-on-surface mt-3 mb-1.5 border-b border-outline-variant/30 pb-1">
                {line.replace("## ", "")}
              </h3>
            );
          }
          if (line.startsWith("# ")) {
            return (
              <h2 key={idx} className="text-base font-extrabold text-on-surface mt-3 mb-2">
                {line.replace("# ", "")}
              </h2>
            );
          }
          if (line.startsWith("- ") || line.startsWith("* ")) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span className="flex-1 text-on-surface">{line.replace(/^[-*]\s+/, "")}</span>
              </div>
            );
          }
          if (line.trim() === "") {
            return <div key={idx} className="h-1" />;
          }
          return <p key={idx}>{line}</p>;
        })}
      </div>
    );
  };

  const currentConfig = MODE_CONFIG[activeMode];

  return (
    <div
      id="ai-chat-section"
      className={`bg-surface rounded-xl border border-outline-variant/60 shadow-stitch-sm flex flex-col overflow-hidden ${
        fullPageMode ? "h-[calc(100vh-140px)] min-h-[600px]" : "h-[720px]"
      }`}
    >
      {/* Panel Header */}
      <div className="p-4 border-b border-outline-variant/40 flex items-center justify-between bg-surface">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-headline text-sm font-bold text-on-surface flex items-center gap-1.5">
              <span>FinSight AI Tutor</span>
              <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded font-semibold">
                {currentConfig.badge}
              </span>
            </div>
            <div className="text-[11px] text-secondary">
              {currentConfig.subtitle}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {onOpenMemories && (
            <button
              onClick={onOpenMemories}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-outline-variant/60 hover:bg-surface-container-low text-xs font-semibold text-on-surface transition-colors mr-1"
              title="Inspect and manage what FinSight knows about you"
            >
              <Brain className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">Memory Bank</span>
            </button>
          )}
          <button
            onClick={fetchHistory}
            disabled={fetchingHistory}
            className="p-1.5 rounded-lg hover:bg-surface-container-low text-secondary hover:text-on-surface transition-colors"
            title="Refresh History"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${fetchingHistory ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleClearHistory}
            className="p-1.5 rounded-lg hover:bg-surface-container-low text-secondary hover:text-error transition-colors"
            title="Clear Chat Session"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Assistant Modes Switcher */}
      <div className="px-4 py-2 bg-surface-container-low/40 border-b border-outline-variant/40 flex items-center gap-1.5 overflow-x-auto">
        {(Object.keys(MODE_CONFIG) as AssistantMode[]).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setActiveMode(mode)}
            className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeMode === mode
                ? "bg-primary text-on-primary shadow-stitch-sm"
                : "bg-surface text-secondary hover:text-on-surface hover:bg-surface-container-low border border-outline-variant/40"
            }`}
          >
            {MODE_CONFIG[mode].icon}
            <span>{MODE_CONFIG[mode].label}</span>
          </button>
        ))}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-3 bg-surface border-b border-outline-variant/40 flex flex-wrap gap-1.5 items-center">
        <Lightbulb className="w-3 h-3 text-tertiary mr-1" />
        <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider mr-1">
          Try:
        </span>
        {currentConfig.prompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(p)}
            className="px-2.5 py-1 rounded-md bg-surface-container-low border border-outline-variant/40 text-on-surface text-[11px] hover:border-primary hover:text-primary transition-all shadow-stitch-sm"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.length === 0 && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-on-surface-variant">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="font-headline font-bold text-sm text-on-surface">
                FinSight Tutor Ready
              </p>
              <p className="text-xs text-on-surface-variant max-w-sm mt-1">
                Ask about financial terms, how mutual funds work, valuation ratios, or how to allocate your monthly savings.
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl ${
                msg.role === "user"
                  ? "bg-primary text-on-primary rounded-tr-xs"
                  : "bg-surface-container-low text-on-surface border border-outline-variant/30 rounded-tl-xs"
              }`}
            >
              {msg.role === "assistant" ? (
                renderFormattedMessage(msg.message)
              ) : (
                <p className="text-xs font-body leading-relaxed">{msg.message}</p>
              )}
            </div>

            {/* ChatGPT / Gemini Memory Updated Notification Badge */}
            {msg.role === "assistant" && msg.remembered && msg.remembered.length > 0 && (
              <div className="mt-1.5 max-w-[85%] p-2.5 rounded-xl bg-primary-container/20 border border-primary/20 flex items-start gap-2 text-xs animate-in fade-in duration-200">
                <Brain className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-primary text-[11px] font-headline">
                      Memory updated
                    </span>
                    {onOpenMemories && (
                      <button
                        onClick={onOpenMemories}
                        className="text-[10px] text-primary hover:underline font-bold px-1.5 py-0.5 rounded hover:bg-primary/10 transition-colors"
                      >
                        Manage
                      </button>
                    )}
                  </div>
                  <ul className="text-on-surface-variant text-[11px] list-disc list-inside space-y-0.5">
                    {msg.remembered.map((fact, fIdx) => (
                      <li key={fIdx} className="leading-tight">{fact}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <span className="text-[10px] text-outline mt-1 px-1">
              {msg.role === "user" ? "You" : "FinSight"}
            </span>
          </div>
        ))}

        {loading && (
          <div className="flex flex-col items-start space-y-1">
            <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 rounded-tl-xs flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
              <span className="text-xs font-body text-on-surface-variant">
                Synthesizing financial explanation...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer */}
      <div className="p-3 border-t border-outline-variant/30 bg-surface-container-low/40">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={
              activeMode === "learn"
                ? "Ask a concept question (e.g. 'What is ROE and why does it matter?')..."
                : activeMode === "research"
                ? "Ask about a company (e.g. 'Analyze Infosys fundamentals')..."
                : activeMode === "portfolio"
                ? "Ask about your portfolio health and diversification..."
                : "Ask about goals and asset allocation..."
            }
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-lowest text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="p-2.5 rounded-xl bg-primary text-on-primary hover:opacity-90 transition-opacity disabled:opacity-40 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-outline text-center mt-2 italic">
          *Educational analysis only. FinSight does not offer buy/sell stock tips or financial advisory.
        </p>
      </div>
    </div>
  );
};
