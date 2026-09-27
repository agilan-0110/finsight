import React, { useState, useEffect, useRef } from "react";
import { api, type ChatMessage } from "../api/client";
import {
  Send,
  Trash2,
  Sparkles,
  Loader2,
  RefreshCw,
  Lightbulb,
  ShieldAlert,
} from "lucide-react";

interface AIChatPanelProps {
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

const SUGGESTED_QUERIES = [
  "Analyze Tata Motors",
  "Run Risk Stress Test",
  "Why is Tech dropping?",
  "Tax Loss Harvesting",
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

  return (
    <div id="ai-chat-section" className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-stitch flex flex-col h-[700px] overflow-hidden">
      {/* Stitch Panel Header */}
      <div className="p-4 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low/40 rounded-t-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary text-on-primary flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-headline text-sm font-bold text-on-surface flex items-center gap-1.5">
              <span>FinSight Co-Pilot</span>
              <span className="text-[10px] text-primary bg-primary-container px-1.5 py-0.2 rounded font-semibold">
                AI
              </span>
            </div>
            <div className="text-[10px] text-on-surface-variant flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              <span>Gemma-27b • Institutional Quant</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={fetchHistory}
            disabled={fetchingHistory}
            className="p-1.5 rounded-md hover:bg-surface-container text-on-surface-variant transition-colors"
            title="Refresh History"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${fetchingHistory ? "animate-spin text-primary" : ""}`} />
          </button>
          <button
            onClick={handleClearHistory}
            className="p-1.5 rounded-md hover:bg-surface-container text-on-surface-variant hover:text-error transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Stitch Scrollable Conversation & Insights Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
        {/* Stitch Proactive Intelligence Card */}
        <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-on-surface flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-primary" />
              <span>Daily Market Intelligence</span>
            </span>
            <span className="text-[10px] text-on-surface-variant font-mono">08:45 AM</span>
          </div>
          <p className="text-on-surface-variant text-[11px] leading-relaxed">
            Portfolio beta stands at <strong className="text-on-surface">0.84</strong>, reflecting a defensive yet high-alpha stance. Overnight earnings in Tech index caused a +1.4% sentiment tailwind. Your inflation hedge via energy is offsetting rising crude price volatility.
          </p>
        </div>

        {/* Stitch AI Assistant Bubble (Tata Motors preview) */}
        <div className="flex gap-2.5 items-start">
          <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 text-[11px] font-bold mt-0.5">
            AI
          </div>
          <div className="p-3.5 rounded-xl rounded-tl-sm bg-surface-container text-on-surface space-y-2 max-w-[92%] leading-relaxed border border-outline-variant/20">
            <p className="font-semibold text-[11px] text-on-surface">Tata Motors (NSE: TATAMOTORS) Assessment:</p>
            <p className="text-[11px] text-on-surface-variant">
              Tata Motors is outperforming domestic auto peers by <strong className="text-on-surface">+3.2%</strong> following Q4 commercial EV delivery beats and Jaguar Land Rover margin expansion to 8.8%.
            </p>
            <div className="p-2 rounded bg-surface-container-lowest border border-outline-variant/30 text-[10px] space-y-1">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Recommended Action:</span>
                <span className="font-semibold text-on-surface">Hold &amp; Accumulate</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Target Upside:</span>
                <span className="font-semibold text-primary">+12.6% (₹1,105)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Stop Loss Trigger:</span>
                <span className="font-semibold text-outline">₹910.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stitch Risk Stress Test Card */}
        <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 space-y-2.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-on-surface text-xs">
              <ShieldAlert className="w-4 h-4 text-outline" />
              <span>Monte Carlo Stress Simulation</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container">
              Low Risk
            </span>
          </div>
          <p className="text-[11px] text-on-surface-variant leading-relaxed">
            In a simulated 15% broader market selloff scenario, FinSight models project portfolio drawdown at <strong className="text-on-surface">-3.2%</strong> vs benchmark <strong className="text-error">-7.8%</strong>.
          </p>
          <div className="space-y-1 text-[10px]">
            <div className="flex justify-between text-on-surface-variant">
              <span>FinSight Active Hedge</span>
              <span className="font-bold text-on-surface font-mono">-3.2% max drawdown</span>
            </div>
            <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
              <div className="w-[32%] h-full bg-primary rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Dynamic Chat Messages */}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[88%] rounded-xl p-3.5 shadow-2xs ${
                msg.role === "user"
                  ? "bg-primary text-on-primary rounded-br-sm"
                  : "bg-surface-container text-on-surface border border-outline-variant/20 rounded-tl-sm"
              }`}
            >
              {msg.role === "user" ? (
                <p className="text-xs leading-relaxed font-body">{msg.message}</p>
              ) : (
                renderFormattedMessage(msg.message)
              )}
            </div>
            <span className="text-[10px] text-on-surface-variant mt-1 px-1 font-mono">
              {msg.role === "user" ? "You" : "FinSight AI"} •{" "}
              {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
            </span>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-2.5">
            <div className="p-3.5 rounded-xl bg-surface-container text-on-surface border border-outline-variant/20 flex items-center gap-2 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span>Analyzing portfolio data & generating response...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Stitch Suggested Queries Chips */}
      <div className="p-3 border-t border-outline-variant/20 bg-surface-container-low/30 space-y-1.5">
        <span className="text-[10px] font-semibold text-outline uppercase tracking-wider block">
          Suggested Queries
        </span>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_QUERIES.map((query, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(query)}
              className="px-2.5 py-1 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface text-[11px] font-medium border border-outline-variant/30 transition-colors"
            >
              {query}
            </button>
          ))}
        </div>
      </div>

      {/* Stitch AI Input Prompt Box at Bottom */}
      <div className="p-3 border-t border-outline-variant/20 bg-surface-container-lowest rounded-b-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask FinSight Co-Pilot anything about your holdings..."
            className="w-full pl-3 pr-14 py-2.5 text-xs rounded-lg bg-surface-container-low border border-outline-variant/40 text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all font-medium"
          />
          <div className="absolute right-1.5 flex items-center gap-1">
            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="w-7 h-7 rounded-md bg-primary hover:bg-primary-dim text-on-primary flex items-center justify-center transition-colors shadow-xs disabled:opacity-50"
              title="Send Query"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
        <div className="flex items-center justify-between text-[10px] text-outline mt-1.5 px-1">
          <span>Enterprise compliance verified</span>
          <span>Context: Full Portfolio</span>
        </div>
      </div>
    </div>
  );
};
