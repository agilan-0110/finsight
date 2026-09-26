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
    // Splits by lines and highlights headers, bullet points, and code blocks cleanly
    const lines = content.split("\n");
    return (
      <div className="space-y-1.5 text-xs text-slate-200 leading-relaxed font-sans">
        {lines.map((line, idx) => {
          if (line.startsWith("### ")) {
            return (
              <h4 key={idx} className="text-sm font-bold text-slate-100 mt-2 mb-1">
                {line.replace("### ", "")}
              </h4>
            );
          }
          if (line.startsWith("## ")) {
            return (
              <h3 key={idx} className="text-base font-bold text-slate-50 mt-3 mb-1.5 border-b border-slate-750 pb-1">
                {line.replace("## ", "")}
              </h3>
            );
          }
          if (line.startsWith("# ")) {
            return (
              <h2 key={idx} className="text-lg font-bold text-white mt-3 mb-2">
                {line.replace("# ", "")}
              </h2>
            );
          }
          if (line.startsWith("- ") || line.startsWith("* ")) {
            return (
              <div key={idx} className="flex items-start gap-1.5 pl-2">
                <span className="text-accent text-[10px] mt-0.5">•</span>
                <span>{line.substring(2)}</span>
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
    <div className="bg-slate-850 border border-slate-750 rounded-xl flex flex-col h-full shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-750/70 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent-bg border border-accent/30 flex items-center justify-center text-accent">
            <Bot size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100">FinSight AI Analyst</h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-profit-bg text-profit border border-profit/30">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Institutional Qwen-2.5 27B / GPT-OSS 120B
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={fetchHistory}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Refresh History"
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={handleClearHistory}
            className="p-1.5 rounded-lg text-slate-400 hover:text-loss hover:bg-slate-800 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[550px] min-h-[380px]">
        {fetchingHistory ? (
          <div className="flex items-center justify-center h-full text-slate-400 text-xs gap-2">
            <Loader2 className="animate-spin" size={16} />
            <span>Loading conversation memory...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-10 text-center px-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-accent mb-3">
              <Sparkles size={22} />
            </div>
            <h4 className="text-sm font-semibold text-slate-200 mb-1">
              Institutional Research Terminal
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mb-5">
              Ask deep questions about your portfolio, Indian equity valuations, risk metrics, or market outlook.
            </p>

            {/* Quick Prompt Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md text-left">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="p-2.5 rounded-lg bg-slate-900 border border-slate-750/70 hover:border-accent/50 text-slate-300 text-xs transition-all hover:bg-slate-800/80 text-left"
                >
                  <p className="font-medium text-slate-200 line-clamp-2">{prompt}</p>
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
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-accent flex-shrink-0 mt-0.5">
                    <Terminal size={14} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-xl p-3.5 ${
                    isUser
                      ? "bg-accent-blue/15 border border-accent-blue/30 text-slate-100"
                      : "bg-slate-900 border border-slate-750 text-slate-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1 text-[10px] text-slate-400 font-mono">
                    <span className="font-semibold">{isUser ? "YOU" : "FINSIGHT AI"}</span>
                    {msg.timestamp && (
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    )}
                  </div>
                  {isUser ? (
                    <p className="text-xs text-slate-100 whitespace-pre-wrap">{msg.message}</p>
                  ) : (
                    renderFormattedMessage(msg.message)
                  )}
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0 mt-0.5">
                    <User size={14} />
                  </div>
                )}
              </div>
            );
          })
        )}

        {loading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-accent flex-shrink-0">
              <Terminal size={14} />
            </div>
            <div className="bg-slate-900 border border-slate-750 rounded-xl px-4 py-3 flex items-center gap-2 text-xs text-slate-400">
              <Loader2 className="animate-spin text-accent" size={14} />
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
        className="p-3 border-t border-slate-750/70 bg-slate-900/60 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask FinSight AI about your portfolio, stocks, risk..."
          disabled={loading}
          className="flex-1 bg-slate-900 border border-slate-750 text-slate-100 placeholder-slate-500 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !inputMessage.trim()}
          className="px-4 py-2 bg-accent hover:bg-sky-400 text-slate-950 font-semibold rounded-lg text-xs transition-colors disabled:opacity-40 flex items-center gap-1.5"
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
