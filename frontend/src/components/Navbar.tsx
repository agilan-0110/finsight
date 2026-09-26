import React from "react";
import { Activity, Bell, Brain, RefreshCw, Send } from "lucide-react";

interface NavbarProps {
  isConnected: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenAlerts: () => void;
  onOpenMemories: () => void;
  onSendDigest: () => void;
  isSendingDigest: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  isConnected,
  onRefresh,
  isRefreshing,
  onOpenAlerts,
  onOpenMemories,
  onSendDigest,
  isSendingDigest,
}) => {
  return (
    <header className="border-b border-border bg-surface/95 backdrop-blur sticky top-0 z-40 px-6 py-3.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-light border border-brand-border flex items-center justify-center text-brand-accent shadow-xs">
            <Activity className="w-5 h-5 text-brand-accent stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-ink">FinSight</span>
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-light text-brand-accent border border-brand-border">
                NSE ANALYST
              </span>
            </div>
            <p className="text-xs text-ink-muted font-medium">Institutional AI Financial Intelligence & Portfolio Analytics</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Status Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-profit animate-pulse" : "bg-loss"
              }`}
            />
            <span className={isConnected ? "text-profit" : "text-loss"}>
              {isConnected ? "ENGINE ONLINE" : "DISCONNECTED"}
            </span>
          </div>

          {/* Quick Weekly Digest to Telegram */}
          <button
            onClick={onSendDigest}
            disabled={isSendingDigest}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-surface hover:bg-surface-subtle text-ink-secondary hover:text-ink border border-border shadow-xs transition disabled:opacity-50"
            title="Dispatch executive portfolio digest to Telegram now"
          >
            <Send className={`w-3.5 h-3.5 text-brand-accent ${isSendingDigest ? "animate-spin" : ""}`} />
            <span className="hidden md:inline">Send Digest</span>
          </button>

          {/* Alerts Modal Trigger */}
          <button
            onClick={onOpenAlerts}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-surface hover:bg-surface-subtle text-ink-secondary hover:text-ink border border-border shadow-xs transition"
            title="Manage Price Target Alerts"
          >
            <Bell className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden md:inline">Alerts</span>
          </button>

          {/* Long-Term Memory Modal Trigger */}
          <button
            onClick={onOpenMemories}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-surface hover:bg-surface-subtle text-ink-secondary hover:text-ink border border-border shadow-xs transition"
            title="View what FinSight remembers about you"
          >
            <Brain className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden md:inline">Memories</span>
          </button>

          {/* Refresh Data */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg bg-surface hover:bg-surface-subtle text-ink-muted hover:text-ink border border-border shadow-xs transition disabled:opacity-50"
            title="Refresh Market & Analytics Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-brand-accent" : ""}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
