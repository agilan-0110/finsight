import React, { useState, useEffect, useRef } from "react";
import { api, type LivePrice, type Fundamentals, type StockSearchResult } from "../api/client";
import { PriceChart } from "./PriceChart";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Building2,
  Percent,
  Activity,
  Layers,
  Bell,
  MessageSquare,
  Loader2,
  X,
  ChevronRight,
} from "lucide-react";

interface StockDeepDiveProps {
  onAskAI?: (ticker: string) => void;
  onOpenAlert?: (ticker: string) => void;
}

const POPULAR_TICKERS = [
  { label: "Reliance", symbol: "RELIANCE" },
  { label: "TCS", symbol: "TCS" },
  { label: "Tata Motors", symbol: "TMCV" },
  { label: "Infosys", symbol: "INFY" },
  { label: "HDFC Bank", symbol: "HDFCBANK" },
  { label: "State Bank", symbol: "SBIN" },
  { label: "ITC", symbol: "ITC" },
  { label: "ICICI Bank", symbol: "ICICIBANK" },
  { label: "Airtel", symbol: "BHARTIARTL" },
];

export const StockDeepDive: React.FC<StockDeepDiveProps> = ({
  onAskAI,
  onOpenAlert,
}) => {
  const [searchInput, setSearchInput] = useState<string>("Reliance Industries Limited");
  const [selectedTicker, setSelectedTicker] = useState<string>("RELIANCE");
  const [priceData, setPriceData] = useState<LivePrice | null>(null);
  const [fundamentals, setFundamentals] = useState<Fundamentals | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Search autocomplete state
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchStockData = async (tickerOrName: string) => {
    if (!tickerOrName.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const [price, fund] = await Promise.all([
        api.getPrice(tickerOrName),
        api.getFundamentals(tickerOrName),
      ]);
      setPriceData(price);
      setFundamentals(fund);
      const cleanSym = price.ticker.replace(".NS", "");
      setSelectedTicker(cleanSym);
      setSearchInput(fund.name || cleanSym);
    } catch (err: any) {
      setError(err.message || `Failed to fetch stock information for '${tickerOrName}'`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData("RELIANCE");
  }, []);

  // Handle clicking outside of dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounced search when typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchInput(query);
    setHighlightedIndex(-1);

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    if (!query.trim() || query.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setShowDropdown(true);

    searchDebounceRef.current = setTimeout(async () => {
      try {
        const results = await api.searchStocks(query.trim());
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 200);
  };

  const handleSelectStock = (stock: StockSearchResult) => {
    setShowDropdown(false);
    setSearchResults([]);
    setSearchInput(stock.name);
    fetchStockData(stock.symbol);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || searchResults.length === 0) {
      if (e.key === "Enter") {
        e.preventDefault();
        fetchStockData(searchInput);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < searchResults.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : searchResults.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < searchResults.length) {
        handleSelectStock(searchResults[highlightedIndex]);
      } else if (searchResults.length > 0) {
        handleSelectStock(searchResults[0]);
      } else {
        fetchStockData(searchInput);
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0 && showDropdown) {
      const target = highlightedIndex >= 0 ? searchResults[highlightedIndex] : searchResults[0];
      handleSelectStock(target);
    } else if (searchInput.trim()) {
      fetchStockData(searchInput.trim());
      setShowDropdown(false);
    }
  };

  const dayChange =
    priceData && priceData.previous_close
      ? priceData.last_price - priceData.previous_close
      : 0;
  const dayChangePercent =
    priceData && priceData.previous_close
      ? (dayChange / priceData.previous_close) * 100
      : 0;
  const isUp = dayChange >= 0;

  const formatRupee = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(val);
  };

  const formatMarketCapCr = (cap: number | null) => {
    if (!cap) return "N/A";
    const inCrores = cap / 10000000;
    return `₹${inCrores.toLocaleString("en-IN", { maximumFractionDigits: 0 })} Cr`;
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-5 sm:p-6 shadow-xs space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-ink flex items-center gap-2">
            <Activity className="text-brand-accent" size={18} />
            Institutional Stock Deep Dive
          </h2>
          <p className="text-xs text-ink-muted font-medium">
            Search by company name or ticker for live quotes, technical charts, and valuation ratios
          </p>
        </div>

        {/* Search Bar with Autocomplete Dropdown */}
        <div ref={searchContainerRef} className="relative flex-1 sm:w-80 md:w-96">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-ink-muted" size={15} />
              <input
                type="text"
                value={searchInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (searchResults.length > 0) setShowDropdown(true);
                }}
                placeholder="Search company (e.g. Tata, HDFC, Infosys)..."
                className="w-full bg-surface border border-border text-ink placeholder-ink-faint rounded-lg pl-9 pr-8 py-2 text-xs font-semibold focus:outline-none focus:border-brand-accent transition-colors shadow-2xs"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    setSearchResults([]);
                    setShowDropdown(false);
                  }}
                  className="absolute right-2.5 top-2.5 text-ink-muted hover:text-ink"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-ink hover:bg-ink-secondary disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs flex-shrink-0"
            >
              {loading ? <Loader2 className="animate-spin" size={13} /> : "Search"}
            </button>
          </form>

          {/* Autocomplete Dropdown Results */}
          {showDropdown && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-surface border border-border rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-border animate-in fade-in zoom-in-95 duration-150">
              <div className="p-2 bg-surface-subtle border-b border-border flex items-center justify-between text-[11px] font-bold text-ink-muted">
                <span>RELEVANT MATCHES</span>
                {isSearching && (
                  <span className="flex items-center gap-1 text-brand-accent font-medium">
                    <Loader2 className="animate-spin" size={11} />
                    Searching...
                  </span>
                )}
              </div>

              {searchResults.length === 0 && !isSearching ? (
                <div className="p-4 text-center text-xs text-ink-muted font-medium">
                  No matching stocks found for &quot;{searchInput}&quot;. Try another name or ticker.
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto divide-y divide-border/60">
                  {searchResults.map((stock, index) => {
                    const isHighlighted = highlightedIndex === index;
                    return (
                      <div
                        key={stock.symbol}
                        onClick={() => handleSelectStock(stock)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        className={`p-3 cursor-pointer transition-colors flex items-center justify-between gap-3 text-xs ${
                          isHighlighted
                            ? "bg-brand-light/80 text-brand-accent"
                            : "hover:bg-surface-hover text-ink"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-bold truncate text-ink">
                            {stock.name}
                          </div>
                          <div className="text-[11px] text-ink-muted flex items-center gap-2 mt-0.5">
                            <span className="font-mono font-bold text-brand-accent bg-brand-light px-1.5 py-0.5 rounded border border-brand-border/60">
                              {stock.symbol}
                            </span>
                            <span className="truncate">{stock.sector}</span>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-ink-muted flex-shrink-0" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Select Tickers */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-ink-muted flex-shrink-0 text-[11px] font-bold uppercase tracking-wider">
          Quick Picks:
        </span>
        {POPULAR_TICKERS.map((t) => (
          <button
            key={t.symbol}
            onClick={() => {
              setSearchInput(t.label);
              fetchStockData(t.symbol);
            }}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              selectedTicker === t.symbol
                ? "bg-brand-light text-brand-accent border border-brand-border font-bold shadow-2xs"
                : "bg-surface-subtle text-ink-secondary border border-border hover:bg-surface hover:text-ink"
            }`}
          >
            <span>{t.label}</span>
            <span className="font-mono text-[10px] text-ink-muted font-normal">({t.symbol})</span>
          </button>
        ))}
      </div>

      {/* Main Stock Card / Details */}
      {error ? (
        <div className="p-4 rounded-xl bg-loss-bg border border-loss-border text-loss text-xs font-medium">
          <p className="font-bold">Stock Not Found</p>
          <p className="mt-0.5">{error}</p>
        </div>
      ) : loading && !priceData ? (
        <div className="py-20 flex flex-col items-center justify-center text-ink-muted gap-2 font-medium">
          <Loader2 className="animate-spin text-brand-accent" size={24} />
          <span className="text-xs">Fetching market depth for {selectedTicker}...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Row: Price & Meta */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-border gap-4">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-xl font-bold text-ink tracking-tight">
                  {fundamentals?.name || selectedTicker}
                </h3>
                <span className="px-2.5 py-0.5 rounded-md bg-surface-subtle border border-border text-ink-secondary font-mono text-xs font-bold">
                  NSE: {selectedTicker}
                </span>
                {fundamentals?.sector && (
                  <span className="px-2.5 py-0.5 rounded-md bg-brand-light text-brand-accent border border-brand-border text-xs font-semibold">
                    {fundamentals.sector}
                  </span>
                )}
              </div>
              <p className="text-xs text-ink-muted font-medium mt-1">National Stock Exchange of India (INR)</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-left md:text-right">
                <div className="text-2xl font-bold font-mono text-ink">
                  {priceData ? formatRupee(priceData.last_price) : "--"}
                </div>
                <div
                  className={`flex items-center md:justify-end gap-1 text-xs font-mono font-bold ${
                    isUp ? "text-profit" : "text-loss"
                  }`}
                >
                  {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  <span>
                    {isUp ? "+" : ""}
                    {dayChange.toFixed(2)} ({isUp ? "+" : ""}
                    {dayChangePercent.toFixed(2)}%)
                  </span>
                  <span className="text-ink-muted font-sans text-[11px] ml-1 font-medium">Today</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {onAskAI && (
                  <button
                    onClick={() => onAskAI(selectedTicker)}
                    className="p-2.5 rounded-lg bg-surface border border-border hover:border-brand-accent text-ink-secondary hover:text-brand-accent shadow-xs transition-colors"
                    title={`Ask FinSight AI about ${fundamentals?.name || selectedTicker}`}
                  >
                    <MessageSquare size={16} />
                  </button>
                )}
                {onOpenAlert && (
                  <button
                    onClick={() => onOpenAlert(selectedTicker)}
                    className="p-2.5 rounded-lg bg-surface border border-border hover:border-brand-accent text-ink-secondary hover:text-brand-accent shadow-xs transition-colors"
                    title={`Set Alert for ${fundamentals?.name || selectedTicker}`}
                  >
                    <Bell size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Middle: Chart + Fundamentals Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Column (2 cols) */}
            <div className="lg:col-span-2 bg-surface-subtle/50 border border-border rounded-xl p-4 shadow-2xs">
              <PriceChart ticker={selectedTicker} />
            </div>

            {/* Fundamentals Column (1 col) */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
                <Layers size={13} className="text-brand-accent" />
                Fundamental Ratios
              </h4>

              <div className="grid grid-cols-2 gap-2.5">
                {/* P/E Ratio */}
                <div className="p-3.5 rounded-xl bg-surface-subtle border border-border/80">
                  <div className="text-xs text-ink-muted flex items-center gap-1 font-semibold">
                    <Percent size={12} />
                    <span>P/E Ratio</span>
                  </div>
                  <div className="text-base font-bold font-mono text-ink mt-1">
                    {fundamentals?.pe_ratio ? fundamentals.pe_ratio.toFixed(2) : "N/A"}
                  </div>
                </div>

                {/* ROE */}
                <div className="p-3.5 rounded-xl bg-surface-subtle border border-border/80">
                  <div className="text-xs text-ink-muted flex items-center gap-1 font-semibold">
                    <TrendingUp size={12} />
                    <span>ROE</span>
                  </div>
                  <div className="text-base font-bold font-mono text-ink mt-1">
                    {fundamentals?.roe ? `${(fundamentals.roe * 100).toFixed(2)}%` : "N/A"}
                  </div>
                </div>

                {/* Debt to Equity */}
                <div className="p-3.5 rounded-xl bg-surface-subtle border border-border/80">
                  <div className="text-xs text-ink-muted flex items-center gap-1 font-semibold">
                    <Activity size={12} />
                    <span>Debt / Equity</span>
                  </div>
                  <div className="text-base font-bold font-mono text-ink mt-1">
                    {fundamentals?.debt_to_equity ? fundamentals.debt_to_equity.toFixed(2) : "N/A"}
                  </div>
                </div>

                {/* Market Cap */}
                <div className="p-3.5 rounded-xl bg-surface-subtle border border-border/80">
                  <div className="text-xs text-ink-muted flex items-center gap-1 font-semibold">
                    <Building2 size={12} />
                    <span>Market Cap</span>
                  </div>
                  <div className="text-xs font-bold font-mono text-ink mt-1.5 truncate">
                    {formatMarketCapCr(fundamentals?.market_cap ?? null)}
                  </div>
                </div>

                {/* Day Range */}
                <div className="p-3.5 rounded-xl bg-surface-subtle border border-border/80 col-span-2">
                  <div className="text-xs text-ink-muted flex items-center justify-between font-semibold">
                    <span>Day Range</span>
                    <span className="font-mono text-ink font-bold">
                      ₹{priceData?.day_low.toFixed(1)} — ₹{priceData?.day_high.toFixed(1)}
                    </span>
                  </div>
                  <div className="w-full bg-surface border border-border rounded-full h-2 mt-2.5 overflow-hidden">
                    {priceData && (
                      <div
                        className="bg-brand-accent h-full rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(
                              0,
                              ((priceData.last_price - priceData.day_low) /
                                (priceData.day_high - priceData.day_low || 1)) *
                                100
                            )
                          )}%`,
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
