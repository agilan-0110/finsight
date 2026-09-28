import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  Brain,
  RefreshCw,
  Send,
  Search,
  Loader2,
  X,
  Sliders,
  UploadCloud,
  GraduationCap,
  LogOut,
  User as UserIcon,
  ChevronDown,
} from "lucide-react";
import { api, type StockSearchResult, type User } from "../api/client";

interface NavbarProps {
  isConnected: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenAlerts: () => void;
  onOpenMemories: () => void;
  onSendDigest: () => void;
  isSendingDigest: boolean;
  onSelectStock?: (ticker: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenBrokerUpload: () => void;
  onOpenAcademy: () => void;
  onLogout: () => void;
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
  currentUser,
  onOpenAuth,
  onOpenBrokerUpload,
  onOpenAcademy,
  onLogout,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
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

  const getUserInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="w-full px-6 flex justify-between items-center h-16 sticky top-0 z-40 bg-surface-container-lowest/95 backdrop-blur-sm border-b border-outline-variant/40">
      {/* Left: Mobile Brand & Global Search Bar from Stitch */}
      <div className="flex items-center gap-6 flex-1 max-w-2xl">
        <div className="flex items-center gap-2 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-headline font-bold text-sm">
            <span>F</span>
          </div>
          <span className="font-headline text-lg font-bold tracking-tight text-on-surface">FinSight</span>
        </div>

        {/* Global Search Input with Stitch Autocomplete */}
        <div ref={searchContainerRef} className="relative w-full max-w-lg hidden sm:block">
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-outline w-4 h-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => {
                if (searchResults.length > 0) setShowDropdown(true);
              }}
              placeholder="Search stocks by company (Tata Motors, Reliance...) or ticker"
              className="w-full pl-9 pr-8 py-2 text-xs font-medium rounded-lg bg-surface-container-low border border-outline-variant/50 text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all"
            />
            {isSearching ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-outline absolute right-2.5" />
            ) : searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                  setShowDropdown(false);
                }}
                className="absolute right-2.5 text-outline hover:text-on-surface p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>

          {/* Autocomplete Dropdown from Stitch */}
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 mt-1.5 bg-surface-container-lowest border border-outline-variant/40 rounded-xl shadow-stitch-lg p-2 z-50 max-h-72 overflow-y-auto">
              <div className="px-2 py-1 text-[11px] font-semibold text-outline uppercase tracking-wider">
                Quick Results
              </div>
              {searchResults.map((stock) => (
                <div
                  key={stock.symbol}
                  onClick={() => handleChooseStock(stock)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-secondary-container flex items-center justify-center font-bold text-[10px] text-on-secondary-container uppercase">
                      {stock.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-on-surface flex items-center gap-1.5">
                        {stock.symbol} <span className="text-[10px] font-normal text-on-surface-variant">NSE</span>
                      </div>
                      <div className="text-[11px] text-on-surface-variant truncate max-w-xs">{stock.name}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-primary px-2 py-0.5 rounded bg-primary-container/60">
                    Analyze
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Middle Navigation Tabs (Desktop) */}
      <nav className="hidden xl:flex items-center font-headline text-sm font-semibold tracking-tight gap-1">
        <a className="border-b-2 border-primary text-on-surface font-semibold pb-4 pt-4 px-3" href="#dashboard">
          Dashboard
        </a>
        <a className="text-on-surface-variant hover:text-on-surface pb-4 pt-4 px-3 transition-colors" href="#holdings">
          Holdings
        </a>
        <a className="text-on-surface-variant hover:text-on-surface pb-4 pt-4 px-3 transition-colors" href="#performance">
          Performance
        </a>
        <a className="text-on-surface-variant hover:text-on-surface pb-4 pt-4 px-3 transition-colors" href="#analytics">
          Analytics
        </a>
      </nav>

      {/* Right Actions Cluster */}
      <div className="flex items-center gap-3">
        {/* AI Agent Status Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container border border-outline-variant/30 text-xs font-medium text-on-surface">
          <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-primary animate-pulse" : "bg-error"}`}></span>
          <span>{isConnected ? "Active • Gemma-27b" : "Disconnected"}</span>
        </div>

        {/* Statement Import Button */}
        <button
          onClick={onOpenBrokerUpload}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant/50 text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
          title="Upload statement from Zerodha, Groww, AngelOne, Upstox"
        >
          <UploadCloud className="w-3.5 h-3.5 text-primary" />
          <span>Import Statement</span>
        </button>

        {/* Stock Market Academy Button */}
        <button
          onClick={onOpenAcademy}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant/50 text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
          title="Stock Market Basics & Educational Tutorial"
        >
          <GraduationCap className="w-3.5 h-3.5 text-secondary" />
          <span>Academy</span>
        </button>

        {/* Telegram Digest Button */}
        <button
          onClick={onSendDigest}
          disabled={isSendingDigest}
          className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant/50 text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50"
          title="Send Executive Digest to Telegram"
        >
          <Send className={`w-3.5 h-3.5 text-primary ${isSendingDigest ? "animate-spin" : ""}`} />
          <span>Digest</span>
        </button>

        {/* Quick Action Rebalance Trigger */}
        <a
          href="#rebalance-section"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-dim text-on-primary text-xs font-semibold shadow-sm transition-all active:scale-[0.99]"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Rebalance</span>
        </a>

        {/* Notification Bell, Memories & Refresh */}
        <div className="flex items-center gap-1">
          <button
            onClick={onOpenAlerts}
            className="relative p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            title="Price Alerts"
          >
            <Bell className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenMemories}
            className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors hidden sm:block"
            title="Active Memories"
          >
            <Brain className="w-4 h-4" />
          </button>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
          </button>
        </div>

        <div className="h-6 w-px bg-outline-variant/40 mx-1 hidden sm:block"></div>

        {/* User Account or Sign In */}
        {currentUser ? (
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 pl-1 p-1 rounded-xl hover:bg-surface-container transition-colors"
            >
              <div className="w-8 h-8 rounded-full ring-2 ring-primary/30 overflow-hidden bg-primary-container flex items-center justify-center text-xs font-bold text-on-primary-container shadow-stitch-sm">
                {getUserInitials(currentUser.full_name)}
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-semibold text-on-surface leading-tight max-w-[120px] truncate">
                  {currentUser.full_name}
                </span>
                <span className="text-[10px] text-on-surface-variant leading-none capitalize">
                  {currentUser.primary_broker} Investor
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-outline hidden xl:block" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-stitch-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-outline-variant/30">
                  <p className="text-xs font-bold text-on-surface truncate">{currentUser.full_name}</p>
                  <p className="text-[11px] text-on-surface-variant truncate">{currentUser.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-primary-container text-on-primary-container capitalize">
                    {currentUser.primary_broker} Account
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenBrokerUpload();
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-on-surface hover:bg-surface-container flex items-center gap-2.5 transition-colors"
                  >
                    <UploadCloud className="w-4 h-4 text-primary" />
                    <span>Upload Broker Statement</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenAcademy();
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-on-surface hover:bg-surface-container flex items-center gap-2.5 transition-colors"
                  >
                    <GraduationCap className="w-4 h-4 text-secondary" />
                    <span>Stock Market Academy</span>
                  </button>
                </div>

                <div className="border-t border-outline-variant/30 pt-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-error hover:bg-error-container/40 flex items-center gap-2.5 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-dim text-on-primary font-semibold text-xs shadow-sm transition-all active:scale-[0.99]"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
