import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  Brain,
  RefreshCw,
  Search,
  Loader2,
  X,
  UploadCloud,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Menu,
} from "lucide-react";
import { api, type StockSearchResult, type User } from "../api/client";

interface NavbarProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
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
  activeTab = "home",
  onSelectTab,
  onRefresh,
  isRefreshing,
  onOpenAlerts,
  onOpenMemories,
  onSelectStock,
  currentUser,
  onOpenAuth,
  onOpenBrokerUpload,
  onLogout,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      setIsSearching(false);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    searchDebounceRef.current = setTimeout(async () => {
      try {
        const results = await api.searchStocks(val.trim());
        setSearchResults(results.slice(0, 5));
        setShowDropdown(true);
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

  const NAV_ITEMS = [
    { id: "home", label: "Home" },
    { id: "explore", label: "Explore" },
    { id: "learn", label: "Academy" },
    { id: "portfolio", label: "Portfolio" },
    { id: "plan", label: "Plan" },
    { id: "assistant", label: "AI Tutor" },
  ];

  return (
    <header className="w-full sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b border-outline-variant/50 transition-colors">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Quiet Prudence Brand Wordmark & Tabs */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => onSelectTab && onSelectTab("home")}
            className="flex items-center gap-1.5 focus:outline-none text-left group"
          >
            <span className="font-headline text-lg font-bold tracking-tight text-on-surface">
              FinSight
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block transition-transform group-hover:scale-125"></span>
          </button>

          {/* Desktop Minimal Navigation Tabs */}
          {onSelectTab && (
            <nav className="hidden md:flex items-center gap-6 pt-0.5">
              {NAV_ITEMS.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectTab(item.id)}
                    className={`text-xs font-semibold tracking-normal transition-all duration-150 pb-5 -mb-5 ${
                      isActive
                        ? "border-b-2 border-primary text-primary"
                        : "text-secondary hover:text-on-surface"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          )}
        </div>

        {/* Right: Quick Search, Memory Bank, Alerts, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Minimal Search with ⌘K */}
          <div ref={searchContainerRef} className="relative hidden sm:block w-44 lg:w-56 transition-all duration-150">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 text-secondary w-3.5 h-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => {
                  if (searchResults.length > 0) setShowDropdown(true);
                }}
                placeholder="Search assets, stocks..."
                className="w-full pl-8 pr-8 py-1.5 text-xs rounded-lg bg-surface-container-low border border-outline-variant/60 text-on-surface placeholder:text-secondary focus:outline-none focus:border-primary focus:bg-surface transition-all"
              />
              {isSearching ? (
                <Loader2 className="w-3 h-3 animate-spin text-secondary absolute right-2.5" />
              ) : searchQuery ? (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                    setShowDropdown(false);
                  }}
                  className="absolute right-2 text-secondary hover:text-on-surface p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              ) : (
                <kbd className="hidden lg:inline absolute right-2 px-1 py-0.2 text-[9px] font-medium text-secondary bg-surface rounded border border-outline-variant/60">
                  ⌘K
                </kbd>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-1.5 bg-surface border border-outline-variant/60 rounded-xl shadow-stitch-lg p-2 z-50 max-h-72 overflow-y-auto">
                <div className="px-2 py-1 text-[10px] font-bold text-secondary uppercase tracking-wider">
                  Quick Results
                </div>
                {searchResults.map((stock) => (
                  <div
                    key={stock.symbol}
                    onClick={() => handleChooseStock(stock)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-container-low cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-bold text-xs text-on-surface">
                        {stock.symbol}
                      </div>
                      <div className="text-[11px] text-secondary truncate max-w-[150px]">{stock.name}</div>
                    </div>
                    <span className="text-[10px] font-medium text-primary px-2 py-0.5 rounded bg-primary/10">
                      Explore
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Icons: Memory Bank, Alerts, Refresh */}
          <div className="flex items-center gap-0.5">
            {/* Memory Bank Button */}
            <button
              onClick={onOpenMemories}
              className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-surface-container-low transition-colors"
              title="FinSight Memory Bank (ChatGPT/Gemini Style Memory)"
            >
              <Brain className="w-4 h-4" />
            </button>

            {/* Price Alerts Bell */}
            <button
              onClick={onOpenAlerts}
              className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-surface-container-low transition-colors relative"
              title="Price & Risk Alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary ring-2 ring-surface"></span>
            </button>

            {/* Refresh */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-surface-container-low transition-colors"
              title="Refresh Market Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
            </button>
          </div>

          <div className="h-4 w-px bg-outline-variant/60 mx-1 hidden sm:block"></div>

          {/* User Account / Profile */}
          {currentUser ? (
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-surface-container-low transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[11px] font-bold text-primary">
                  {getUserInitials(currentUser.full_name)}
                </div>
                <span className="hidden xl:inline text-xs font-semibold text-on-surface truncate max-w-[100px]">
                  {currentUser.full_name.split(" ")[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-secondary hidden sm:block" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-surface border border-outline-variant/60 shadow-stitch-lg py-1.5 z-50 text-xs">
                  <div className="px-3.5 py-2 border-b border-outline-variant/40">
                    <p className="font-semibold text-on-surface truncate">{currentUser.full_name}</p>
                    <p className="text-[11px] text-secondary truncate">{currentUser.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenBrokerUpload();
                    }}
                    className="w-full text-left px-3.5 py-2 text-on-surface hover:bg-surface-container-low flex items-center gap-2 text-xs"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-primary" />
                    <span>Import Broker Statement</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenMemories();
                    }}
                    className="w-full text-left px-3.5 py-2 text-on-surface hover:bg-surface-container-low flex items-center gap-2 text-xs"
                  >
                    <Brain className="w-3.5 h-3.5 text-primary" />
                    <span>Agent Memory Bank</span>
                  </button>

                  <div className="border-t border-outline-variant/40 my-1"></div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3.5 py-2 text-error hover:bg-error-container/20 flex items-center gap-2 text-xs font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-semibold text-xs hover:bg-primary-dim transition-all flex items-center gap-1.5"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg md:hidden text-secondary hover:text-on-surface hover:bg-surface-container-low"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && onSelectTab && (
        <div className="md:hidden border-t border-outline-variant/40 bg-surface px-4 py-2 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between ${
                activeTab === item.id
                  ? "bg-primary/10 text-primary font-bold"
                  : "text-secondary hover:text-on-surface"
              }`}
            >
              <span>{item.label}</span>
              {activeTab === item.id && <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
