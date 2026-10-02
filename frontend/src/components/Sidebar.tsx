import React from "react";
import {
  Home,
  Search,
  BookOpen,
  PieChart,
  Compass,
  Sparkles,
  Bell,
  Brain,
  UploadCloud,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenMemories: () => void;
  onOpenAlerts: () => void;
  onOpenBrokerUpload: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenMemories,
  onOpenAlerts,
  onOpenBrokerUpload,
}) => {
  const mainNav = [
    { id: "home", label: "Home", icon: <Home className="w-4 h-4" /> },
    { id: "explore", label: "Explore", icon: <Search className="w-4 h-4" /> },
    { id: "learn", label: "Learn", icon: <BookOpen className="w-4 h-4" /> },
    { id: "portfolio", label: "Portfolio", icon: <PieChart className="w-4 h-4" /> },
    { id: "plan", label: "Plan", icon: <Compass className="w-4 h-4" /> },
    { id: "assistant", label: "AI Assistant", icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col justify-between border-r border-outline-variant/40 bg-surface-container-low p-4 z-50 shrink-0">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary font-headline font-bold text-base shadow-sm">
            <span>F</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-base font-bold text-on-surface tracking-tight leading-snug">
              FinSight
            </span>
            <span className="font-label text-[11px] text-on-surface-variant font-medium">
              Investment Companion
            </span>
          </div>
        </div>

        {/* 6 Primary Navigation Hubs */}
        <nav className="space-y-1 font-body text-xs font-medium">
          {mainNav.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-150 ${
                  isActive
                    ? "bg-primary text-on-primary font-bold shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
              >
                <span className={isActive ? "text-on-primary" : "text-primary"}>
                  {item.icon}
                </span>
                <span className="font-headline text-xs">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Secondary Global Actions */}
        <div className="pt-6 mt-6 border-t border-outline-variant/30 space-y-1">
          <span className="px-3 text-[10px] font-label font-bold text-outline uppercase tracking-wider block mb-1">
            Global Utilities
          </span>

          <button
            type="button"
            onClick={onOpenBrokerUpload}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors text-xs text-left"
          >
            <UploadCloud className="w-4 h-4 text-primary" />
            <span>Connect Portfolio</span>
          </button>

          <button
            type="button"
            onClick={onOpenAlerts}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors text-xs text-left"
          >
            <Bell className="w-4 h-4 text-on-surface-variant" />
            <span>Price Triggers &amp; Alerts</span>
          </button>

          <button
            type="button"
            onClick={onOpenMemories}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors text-xs text-left"
          >
            <Brain className="w-4 h-4 text-on-surface-variant" />
            <span>Strategic Memories</span>
          </button>
        </div>
      </div>

      {/* Footer System Status */}
      <div className="space-y-2 pt-4 border-t border-outline-variant/30">
        <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gain animate-pulse"></span>
            <span className="text-[11px] font-medium text-on-surface">AI Tutor Ready</span>
          </div>
          <span className="font-label text-[10px] px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-semibold">
            $0 Cost
          </span>
        </div>
      </div>
    </aside>
  );
};
