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
    <header className="border-b border-slate-750 bg-slate-850/90 backdrop-blur sticky top-0 z-40 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent-blue/15 border border-accent-blue/30 flex items-center justify-center text-accent">
            <Activity className="w-5 h-5 text-accent" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg tracking-tight text-slate-50">FinSight</span>
              <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-750 text-accent border border-slate-700">
                NSE ANALYST
              </span>
            </div>
            <p className="text-xs text-slate-400">Institutional Financial AI & Portfolio Intelligence</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Status Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900 border border-slate-750 text-xs font-mono">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-profit animate-pulse" : "bg-loss"
              }`}
            />
            <span className={isConnected ? "text-slate-200" : "text-loss"}>
              {isConnected ? "ENGINE ONLINE" : "DISCONNECTED"}
            </span>
          </div>

          {/* Quick Weekly Digest to Telegram */}
          <button
            onClick={onSendDigest}
            disabled={isSendingDigest}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition"
            title="Dispatch executive portfolio digest to Telegram now"
          >
            <Send className={`w-3.5 h-3.5 text-accent ${isSendingDigest ? "animate-spin" : ""}`} />
            <span className="hidden md:inline">Send Digest</span>
          </button>

          {/* Alerts Modal Trigger */}
          <button
            onClick={onOpenAlerts}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition"
            title="Manage Price Target Alerts"
          >
            <Bell className="w-3.5 h-3.5 text-warning" />
            <span className="hidden md:inline">Alerts</span>
          </button>

          {/* Long-Term Memory Modal Trigger */}
          <button
            onClick={onOpenMemories}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition"
            title="View what FinSight remembers about you"
          >
            <Brain className="w-3.5 h-3.5 text-accent-light" />
            <span className="hidden md:inline">Memories</span>
          </button>

          {/* Refresh Data */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition disabled:opacity-50"
            title="Refresh Market & Analytics Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-accent" : ""}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
