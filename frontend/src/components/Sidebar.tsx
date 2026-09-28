import React from "react";
import { Sparkles, UploadCloud, GraduationCap, BarChart3, LineChart, Sliders, Bell, Brain } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenMemories: () => void;
  onOpenAlerts: () => void;
  onOpenBrokerUpload: () => void;
  onOpenAcademy: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenMemories,
  onOpenAlerts,
  onOpenBrokerUpload,
  onOpenAcademy,
}) => {
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col justify-between border-r border-outline-variant/40 bg-surface-container-low p-4 z-50 shrink-0">
      <div>
        {/* Brand & Tier Header from Stitch */}
        <div className="flex items-center gap-3 px-3 py-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary font-headline font-bold text-base shadow-sm">
            <span>F</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-base font-bold text-on-surface tracking-tight leading-snug">
              FinSight Intelligence
            </span>
            <span className="font-label text-[11px] text-on-surface-variant font-medium">
              Enterprise Tier v4.2
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="space-y-1 font-body text-xs font-medium">
          <button
            onClick={() => onSelectTab("dashboard")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 ${
              activeTab === "dashboard"
                ? "bg-secondary-container text-on-secondary-container font-semibold"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
            }`}
          >
            <BarChart3 className="w-4 h-4 text-primary" />
            <span>Portfolio Intelligence</span>
          </button>

          <a
            href="#stock-deep-dive-section"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors duration-150"
          >
            <LineChart className="w-4 h-4 text-on-surface-variant" />
            <span>Live NSE Markets</span>
          </a>

          <a
            href="#rebalance-section"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors duration-150"
          >
            <Sliders className="w-4 h-4 text-on-surface-variant" />
            <span>Rebalancing Engine</span>
          </a>

          <button
            onClick={onOpenBrokerUpload}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors duration-150 text-left"
          >
            <UploadCloud className="w-4 h-4 text-primary" />
            <span>Import Statement</span>
          </button>

          <button
            onClick={onOpenAcademy}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors duration-150 text-left"
          >
            <GraduationCap className="w-4 h-4 text-secondary" />
            <span>Market Academy</span>
          </button>

          <button
            onClick={onOpenAlerts}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors duration-150 text-left"
          >
            <Bell className="w-4 h-4 text-on-surface-variant" />
            <span>Price Triggers &amp; Alerts</span>
          </button>

          <button
            onClick={onOpenMemories}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors duration-150 text-left"
          >
            <Brain className="w-4 h-4 text-on-surface-variant" />
            <span>Strategic Memories</span>
          </button>
        </nav>
      </div>

      {/* CTA & Footer Elements from Stitch */}
      <div className="space-y-4 pt-4 border-t border-outline-variant/30">
        <a
          href="#ai-chat-section"
          className="w-full py-2.5 px-3 rounded-lg bg-primary hover:bg-primary-dim text-on-primary text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4 text-primary-container" />
          <span>Ask FinSight Co-Pilot</span>
        </a>

        <div className="space-y-1 font-body text-xs font-medium text-on-surface-variant">
          <div className="flex items-center justify-between px-3 py-1.5 rounded hover:text-on-surface hover:bg-surface-container transition-colors">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gain animate-pulse"></span>
              <span>Gemma-27B Live</span>
            </div>
            <span className="font-label text-[10px] px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-semibold">
              99.98%
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
