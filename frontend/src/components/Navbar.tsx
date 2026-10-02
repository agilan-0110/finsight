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
  Sprout,
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
    { id: "home", label: "Home", icon: "🏠" },
    { id: "explore", label: "Explore Investments", icon: "🔎" },
    { id: "learn", label: "Academy", icon: "📚" },
    { id: "portfolio", label: "My Portfolio", icon: "📊" },
    { id: "plan", label: "Plan Goals", icon: "🧭" },
    { id: "assistant", label: "AI Tutor", icon: "🤖" },
  ];

  return (
    <header className="w-full sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-outline-variant/60 shadow-stitch-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-18">
        {/* Left: Stitch Sprout Logo & Brand */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onSelectTab && onSelectTab("home")}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform shadow-xs">
              <Sprout className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline text-lg font-extrabold tracking-tight text-on-surface leading-none">
                FinSight
              </span>
              <span className="text-[10px] font-semibold text-secondary tracking-wide mt-0.5 font-label">
                Learn &amp; Grow
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          {onSelectTab && (
            <nav className="hidden lg:flex items-center gap-1 ml-2 font-headline text-xs font-bold">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3.5 py-2 rounded-xl transition-all duration-150 flex items-center gap-1.5 ${
                    activeTab === item.id
                      ? "bg-primary text-on-primary shadow-xs font-extrabold"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          )}
        </div>

        {/* Right Cluster: Search, Status Pill, Memory Bank, Alerts, Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Stock Search */}
          <div ref={searchContainerRef} className="relative hidden xl:block w-48 focus-within:w-64 transition-all duration-200">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 text-outline w-3.5 h-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => {
                  if (searchResults.length > 0) setShowDropdown(true);
                }}
                placeholder="Search stocks / funds..."
                className="w-full pl-8 pr-7 py-1.5 text-xs font-medium rounded-xl bg-surface-container-low border border-outline-variant/60 text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:bg-surface transition-all shadow-xs"
              />
              {isSearching ? (
                <Loader2 className="w-3 h-3 animate-spin text-outline absolute right-2.5" />
              ) : searchQuery ? (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                    setShowDropdown(false);
                  }}
                  className="absolute right-2 text-outline hover:text-on-surface p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              ) : null}
            </div>

            {/* Autocomplete Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-1.5 bg-surface border border-outline-variant/60 rounded-xl shadow-stitch-lg p-2 z-50 max-h-72 overflow-y-auto">
                <div className="px-2 py-1 text-[10px] font-bold text-outline uppercase tracking-wider">
                  Quick Results
                </div>
                {searchResults.map((stock) => (
                  <div
                    key={stock.symbol}
                    onClick={() => handleChooseStock(stock)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-bold text-xs text-on-surface">
                        {stock.symbol}
                      </div>
                      <div className="text-[11px] text-on-surface-variant truncate max-w-[160px]">{stock.name}</div>
                    </div>
                    <span className="text-[10px] font-bold text-primary px-2 py-0.5 rounded bg-primary/10">
                      Explore
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Monthly Status Badge */}
          <div className="hidden sm:flex items-center gap-1.5 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full text-xs font-bold text-primary shadow-2xs">
            <Sprout size={13} className="text-secondary" />
            <span>Beginner • ₹2,000/mo</span>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1">
            {/* Memory Bank Button */}
            <button
              onClick={onOpenMemories}
              className="p-2 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
              title="FinSight Memory Bank (ChatGPT/Gemini Style)"
            >
              <Brain className="w-4 h-4" />
            </button>

            {/* Price Alerts Bell */}
            <button
              onClick={onOpenAlerts}
              className="p-2 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors relative"
              title="Price &amp; Risk Alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-tertiary ring-2 ring-surface"></span>
            </button>

            {/* Refresh */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
              title="Refresh Market Data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
            </button>
          </div>

          <div className="h-6 w-px bg-outline-variant/60 mx-0.5 hidden sm:block"></div>

          {/* User Account / Profile */}
          {currentUser ? (
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-surface-container transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary shadow-xs">
                  {getUserInitials(currentUser.full_name)}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-outline hidden sm:block" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-surface border border-outline-variant/60 shadow-stitch-lg py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-outline-variant/40">
                    <p className="font-bold text-on-surface truncate">{currentUser.full_name}</p>
                    <p className="text-[11px] text-on-surface-variant truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full capitalize">
                      {currentUser.primary_broker} Investor
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenBrokerUpload();
                    }}
                    className="w-full text-left px-4 py-2.5 text-on-surface hover:bg-surface-container flex items-center gap-2 font-medium"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-primary" />
                    <span>Import Broker Statement</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenMemories();
                    }}
                    className="w-full text-left px-4 py-2.5 text-on-surface hover:bg-surface-container flex items-center gap-2 font-medium"
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
                    className="w-full text-left px-4 py-2.5 text-error hover:bg-error-container/20 flex items-center gap-2 font-semibold"
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
              className="px-3.5 py-1.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary-dim transition-all shadow-xs flex items-center gap-1.5"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl lg:hidden text-on-surface hover:bg-surface-container"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && onSelectTab && (
        <div className="lg:hidden border-t border-outline-variant/40 bg-surface px-4 py-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
                activeTab === item.id
                  ? "bg-primary text-on-primary"
                  : "text-on-surface hover:bg-surface-container"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
