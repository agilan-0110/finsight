import React, { useState, useEffect, useRef } from "react";
import { api, type ChatMessage } from "../api/client";
import {
  Send,
  Trash2,
  Sparkles,
  Loader2,
  RefreshCw,
  Cpu,
  Zap,
} from "lucide-react";

interface AIChatPanelProps {
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

const QUICK_PROMPTS = [
  "Analyze portfolio risk & concentration",
  "Is Tata Motors a Buy, Hold, or Sell now?",
  "Stress test portfolio against 5% market drop",
  "Recommend tactical profit taking",
];

export const AIChatPanel: React.FC<AIChatPanelProps> = ({
  initialPrompt,
  onClearInitialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingHistory, setFetchingHistory] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchHistory = async () => {
    setFetchingHistory(true);
    try {
      const history = await api.getChatHistory(30);
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
    const message = (textToSend || inputMessage).trim();
    if (!message || loading) return;

    const userMsg: ChatMessage = {
      role: "user",
      message,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setLoading(true);

    try {
      const res = await api.sendMessage(message);
      const assistantMsg: ChatMessage = {
        role: "assistant",
        message: res.response,
        timestamp: new Date().toISOString(),
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
      <div className="space-y-2 text-xs text-ink leading-relaxed font-sans">
        {lines.map((line, idx) => {
          if (line.startsWith("### ")) {
            return (
              <h4 key={idx} className="text-xs font-bold text-ink mt-2 mb-1 uppercase tracking-wide">
                {line.replace("### ", "")}
              </h4>
            );
          }
          if (line.startsWith("## ")) {
            return (
              <h3 key={idx} className="text-sm font-bold text-ink mt-3 mb-1.5 border-b border-border pb-1">
                {line.replace("## ", "")}
              </h3>
            );
          }
          if (line.startsWith("# ")) {
            return (
              <h2 key={idx} className="text-base font-extrabold text-ink mt-3 mb-2">
                {line.replace("# ", "")}
              </h2>
            );
          }
          if (line.startsWith("- ") || line.startsWith("* ")) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-brand-accent font-bold mt-0.5">•</span>
                <span className="flex-1">{line.replace(/^[-*]\s+/, "")}</span>
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

  return (
    <div className="rounded-xl bg-surface border border-border shadow-card flex flex-col h-[640px] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-surface">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-brand-light text-brand-accent border border-brand-border">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-ink font-headline">
                FinSight AI Co-Pilot
              </h3>
              <span className="text-[10px] font-mono font-bold text-profit bg-profit-bg px-2 py-0.5 rounded border border-profit-border">
                Gemma-27b
              </span>
            </div>
            <p className="text-[11px] text-ink-muted font-medium">
              Institutional quantitative analyst & portfolio strategist
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={fetchHistory}
            disabled={fetchingHistory}
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-subtle transition"
            title="Refresh history"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${fetchingHistory ? "animate-spin text-ink" : ""}`} />
          </button>
          <button
            onClick={handleClearHistory}
            className="p-1.5 rounded-lg text-ink-muted hover:text-loss hover:bg-loss-bg transition"
            title="Clear chat history"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-subtle/40">
        {messages.length === 0 && !loading ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-ink-muted">
            <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center text-brand-accent shadow-xs mb-3">
              <Cpu className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-ink mb-1">FinSight AI Intelligence Ready</h4>
            <p className="text-xs text-ink-muted max-w-xs mb-5 font-medium">
              Ask about portfolio risk exposure, stock fundamental valuations, or test automated rebalancing strategies.
            </p>

            <div className="w-full space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block text-left">
                Suggested Financial Prompts:
              </span>
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="w-full text-left p-2.5 rounded-lg bg-surface hover:bg-surface-subtle border border-border hover:border-slate-300 text-xs font-medium text-ink-secondary hover:text-ink transition flex items-center justify-between group shadow-2xs"
                >
                  <span className="truncate">{prompt}</span>
                  <Zap className="w-3.5 h-3.5 text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[88%] rounded-xl p-3.5 shadow-2xs ${
                  msg.role === "user"
                    ? "bg-brand text-white"
                    : "bg-surface text-ink border border-border"
                }`}
              >
                {msg.role === "user" ? (
                  <p className="text-xs leading-relaxed font-sans">{msg.message}</p>
                ) : (
                  renderFormattedMessage(msg.message)
                )}
              </div>
              <span className="text-[10px] text-ink-muted mt-1 px-1 font-mono">
                {msg.role === "user" ? "You" : "FinSight AI"} •{" "}
                {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
              </span>
            </div>
          ))
        )}

        {loading && (
          <div className="flex items-start gap-2.5">
            <div className="p-3.5 rounded-xl bg-surface border border-border shadow-2xs flex items-center gap-2 text-xs text-ink-muted">
              <Loader2 className="w-4 h-4 animate-spin text-brand-accent" />
              <span>Analyzing market data & evaluating portfolio signals...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips (when conversation has messages) */}
      {messages.length > 0 && (
        <div className="px-3 py-2 bg-surface border-t border-border flex items-center gap-1.5 overflow-x-auto">
          {QUICK_PROMPTS.slice(0, 3).map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[11px] font-medium whitespace-nowrap px-2.5 py-1 rounded-md bg-surface-subtle hover:bg-surface border border-border text-ink-secondary hover:text-ink transition shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <div className="p-3 border-t border-border bg-surface">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask FinSight Co-Pilot about your holdings or strategy..."
            className="flex-1 px-3.5 py-2 text-xs rounded-lg border border-border bg-surface-subtle focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-accent text-ink placeholder:text-ink-faint transition font-medium"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="p-2 rounded-lg bg-brand hover:bg-slate-700 text-white transition disabled:opacity-50 shadow-xs"
            title="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
