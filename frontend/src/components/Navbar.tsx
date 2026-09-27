import React, { useState, useRef, useEffect } from "react";
import {
  TrendingUp,
  Bell,
  Brain,
  RefreshCw,
  Send,
  Search,
  Sparkles,
  Loader2,
  X,
} from "lucide-react";
import { api, type StockSearchResult } from "../api/client";

interface NavbarProps {
  isConnected: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenAlerts: () => void;
  onOpenMemories: () => void;
  onSendDigest: () => void;
  isSendingDigest: boolean;
  onSelectStock?: (ticker: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isConnected,
  onRefresh,
  isRefreshing,
  onOpenAlerts,
  onOpenMemories,
  onSendDigest,
  isSendingDigest,
  onSelectStock,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    if (val.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setShowDropdown(true);

    searchDebounceRef.current = setTimeout(async () => {
      try {
        const results = await api.searchStocks(val.trim());
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 200);
  };

  const handleChooseStock = (stock: StockSearchResult) => {
    setShowDropdown(false);
    setSearchQuery("");
    setSearchResults([]);
    if (onSelectStock) {
      onSelectStock(stock.symbol);
    }
  };

  return (
    <header className="border-b border-border bg-surface sticky top-0 z-40 px-4 sm:px-8 py-3 shadow-card">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
        {/* Brand & Market Identity */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand text-white flex items-center justify-center shadow-xs">
              <TrendingUp className="w-5 h-5 text-emerald-400 stroke-[2.4]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-ink font-headline">
                  FinSight
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-light text-brand-accent border border-brand-border">
                  <Sparkles className="w-3 h-3" />
                  Gemma-27B
                </span>
              </div>
              <p className="text-[11px] text-ink-muted font-medium hidden sm:block">
                Institutional Financial Intelligence & Portfolio Analytics
              </p>
            </div>
          </div>

          {/* Engine Status (Mobile) */}
          <div className="md:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-surface-subtle text-[11px] font-semibold">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-profit animate-pulse" : "bg-loss"
              }`}
            />
            <span className={isConnected ? "text-profit" : "text-loss"}>
              {isConnected ? "Live" : "Offline"}
            </span>
          </div>
        </div>

        {/* Global Stock Search Bar (Stitch specification: searches by Company Name or Ticker) */}
        <div ref={searchContainerRef} className="relative w-full md:max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => {
                if (searchResults.length > 0) setShowDropdown(true);
              }}
              placeholder="Search stocks by company (Tata, Reliance...) or ticker..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-border bg-surface-subtle focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent text-ink placeholder:text-ink-faint transition shadow-2xs font-medium"
            />
            {isSearching ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-ink-muted absolute right-3 top-1/2 -translate-y-1/2" />
            ) : searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                  setShowDropdown(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>

          {/* Autocomplete Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-surface border border-border rounded-xl shadow-elevated z-50 max-h-80 overflow-y-auto divide-y divide-border">
              <div className="px-3 py-1.5 bg-surface-subtle text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                Matching NSE Equities
              </div>
              {searchResults.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => handleChooseStock(stock)}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-surface-subtle transition flex items-center justify-between group"
                >
                  <div className="min-w-0 pr-3">
                    <p className="text-xs font-bold text-ink truncate group-hover:text-brand-accent transition">
                      {stock.name}
                    </p>
                    <p className="text-[11px] font-mono text-ink-muted">
                      {stock.symbol} • {stock.sector || "NSE Equity"}
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-brand-accent bg-brand-light px-2 py-0.5 rounded border border-brand-border shrink-0">
                    Analyze
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Controls & Utilities */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* Status Indicator (Desktop) */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface-subtle text-xs font-semibold">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-profit animate-pulse" : "bg-loss"
              }`}
            />
            <span className={isConnected ? "text-profit" : "text-loss"}>
              {isConnected ? "Engine Active" : "Disconnected"}
            </span>
          </div>

          {/* Telegram Digest */}
          <button
            onClick={onSendDigest}
            disabled={isSendingDigest}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-surface hover:bg-surface-subtle text-ink-secondary hover:text-ink border border-border shadow-xs transition disabled:opacity-50"
            title="Dispatch executive portfolio digest to Telegram"
          >
            <Send className={`w-3.5 h-3.5 text-brand-accent ${isSendingDigest ? "animate-spin" : ""}`} />
            <span className="hidden lg:inline">Digest</span>
          </button>

          {/* Price Alerts */}
          <button
            onClick={onOpenAlerts}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-surface hover:bg-surface-subtle text-ink-secondary hover:text-ink border border-border shadow-xs transition"
            title="Manage Price Target Alerts"
          >
            <Bell className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden lg:inline">Alerts</span>
          </button>

          {/* Memories */}
          <button
            onClick={onOpenMemories}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-surface hover:bg-surface-subtle text-ink-secondary hover:text-ink border border-border shadow-xs transition"
            title="View what FinSight remembers"
          >
            <Brain className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden lg:inline">Memories</span>
          </button>

          {/* Refresh */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg bg-surface hover:bg-surface-subtle text-ink-muted hover:text-ink border border-border shadow-xs transition disabled:opacity-50"
            title="Refresh Market Analytics"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-ink" : ""}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
