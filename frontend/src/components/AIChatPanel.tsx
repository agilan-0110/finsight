import React, { useState, useEffect, useRef } from "react";
import { api, type ChatMessage } from "../api/client";
import {
  Send,
  Bot,
  User,
  Trash2,
  Sparkles,
  Loader2,
  Terminal,
  RefreshCw,
} from "lucide-react";

interface AIChatPanelProps {
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

const QUICK_PROMPTS = [
  "Analyze portfolio risk and concentration exposure",
  "Which holdings have the strongest fundamentals?",
  "What is the outlook for Reliance Industries?",
  "Recommend tactical rebalancing for the portfolio",
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
      <div className="space-y-2 text-xs text-ink-secondary leading-relaxed font-sans">
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
                <span className="text-brand-accent font-bold text-[11px] mt-0.5">•</span>
                <span className="font-medium">{line.substring(2)}</span>
              </div>
            );
          }
          if (line.trim() === "") {
            return <div key={idx} className="h-1" />;
          }
          return <p key={idx} className="font-medium">{line}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="bg-surface border border-border rounded-xl flex flex-col h-full shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-light border border-brand-border flex items-center justify-center text-brand-accent shadow-2xs">
            <Bot size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-ink">FinSight AI Analyst</h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-profit-bg text-profit border border-profit-border">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-ink-muted font-medium">
              Institutional Qwen-2.5 27B / GPT-OSS 120B
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={fetchHistory}
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-subtle transition-colors"
            title="Refresh History"
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={handleClearHistory}
            className="p-1.5 rounded-lg text-ink-muted hover:text-loss hover:bg-loss-bg transition-colors"
            title="Clear Chat History"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[550px] min-h-[380px] bg-canvas/30">
        {fetchingHistory ? (
          <div className="flex items-center justify-center h-full text-ink-muted text-xs gap-2 font-medium">
            <Loader2 className="animate-spin text-brand-accent" size={16} />
            <span>Loading conversation memory...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-10 text-center px-4">
            <div className="w-12 h-12 rounded-xl bg-brand-light border border-brand-border flex items-center justify-center text-brand-accent mb-3 shadow-xs">
              <Sparkles size={22} />
            </div>
            <h4 className="text-sm font-bold text-ink mb-1">
              Institutional Research Terminal
            </h4>
            <p className="text-xs text-ink-muted font-medium max-w-sm mb-5">
              Ask deep questions about your portfolio, Indian equity valuations, risk metrics, or market outlook.
            </p>

            {/* Quick Prompt Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md text-left">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="p-3 rounded-lg bg-surface border border-border hover:border-brand-accent/50 text-ink text-xs font-semibold transition-all hover:bg-surface-hover text-left shadow-2xs"
                >
                  <p className="line-clamp-2">{prompt}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={index}
                className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-surface border border-border flex items-center justify-center text-brand-accent flex-shrink-0 mt-0.5 shadow-2xs">
                    <Terminal size={14} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-xl p-3.5 ${
                    isUser
                      ? "bg-brand-light border border-brand-border text-ink font-medium"
                      : "bg-surface border border-border text-ink-secondary shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1 text-[10px] text-ink-muted font-mono font-semibold">
                    <span>{isUser ? "YOU" : "FINSIGHT AI"}</span>
                    {msg.timestamp && (
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    )}
                  </div>
                  {isUser ? (
                    <p className="text-xs text-ink whitespace-pre-wrap">{msg.message}</p>
                  ) : (
                    renderFormattedMessage(msg.message)
                  )}
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-surface border border-border flex items-center justify-center text-ink flex-shrink-0 mt-0.5 shadow-2xs">
                    <User size={14} />
                  </div>
                )}
              </div>
            );
          })
        )}

        {loading && (
          <div className="flex gap-2.5 justify-start items-center">
            <div className="w-7 h-7 rounded-lg bg-surface border border-border flex items-center justify-center text-brand-accent flex-shrink-0 shadow-2xs">
              <Terminal size={14} />
            </div>
            <div className="bg-surface border border-border rounded-xl px-4 py-3 flex items-center gap-2 text-xs text-ink-muted font-medium shadow-xs">
              <Loader2 className="animate-spin text-brand-accent" size={14} />
              <span>Analyzing portfolio data and financial fundamentals...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-border bg-surface flex items-center gap-2"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask FinSight AI about your portfolio, stocks, risk..."
          disabled={loading}
          className="flex-1 bg-surface-subtle border border-border text-ink placeholder-ink-faint rounded-lg px-3.5 py-2 text-xs font-medium focus:outline-none focus:border-brand-accent transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !inputMessage.trim()}
          className="px-4 py-2 bg-ink hover:bg-ink-secondary text-white font-semibold rounded-lg text-xs transition-colors disabled:opacity-40 flex items-center gap-1.5 shadow-xs"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={14} />
          ) : (
            <>
              <span>Send</span>
              <Send size={13} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
