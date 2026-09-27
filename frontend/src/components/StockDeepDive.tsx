import React, { useState, useEffect, useRef } from "react";
import { api, type LivePrice, type Fundamentals, type StockSearchResult } from "../api/client";
import { PriceChart } from "./PriceChart";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Bell,
  Sparkles,
  Loader2,
  X,
  ChevronRight,
} from "lucide-react";

interface StockDeepDiveProps {
  onAskAI?: (ticker: string) => void;
  onOpenAlert?: (ticker: string) => void;
  externalTicker?: string;
}

const POPULAR_TICKERS = [
  { label: "Tata Motors", symbol: "TATAMOTORS" },
  { label: "Reliance", symbol: "RELIANCE" },
  { label: "TCS", symbol: "TCS" },
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
  externalTicker,
}) => {
  const [searchInput, setSearchInput] = useState<string>("Tata Motors Limited");
  const [selectedTicker, setSelectedTicker] = useState<string>("TATAMOTORS");
  const [priceData, setPriceData] = useState<LivePrice | null>(null);
  const [fundamentals, setFundamentals] = useState<Fundamentals | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Search autocomplete state
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

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
    fetchStockData("TATAMOTORS");
  }, []);

  useEffect(() => {
    if (externalTicker) {
      fetchStockData(externalTicker);
    }
  }, [externalTicker]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchInput(query);

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

  const change = priceData
    ? priceData.last_price - priceData.previous_close
    : 0;
  const changePercent =
    priceData && priceData.previous_close > 0
      ? (change / priceData.previous_close) * 100
      : 0;
  const isPositive = change >= 0;

  return (
    <div className="rounded-xl bg-surface border border-border shadow-card overflow-hidden">
      {/* Header & Search Bar */}
      <div className="p-5 border-b border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-ink uppercase tracking-wider font-headline">
            NSE Stock Deep Dive & Valuation
          </h2>
          <p className="text-xs text-ink-muted font-medium mt-0.5">
            Real-time equity quotes, technical indicators, and fundamental metrics
          </p>
        </div>

        {/* Search Input with Autocomplete */}
        <div ref={searchContainerRef} className="relative w-full md:w-80">
          <div className="relative">
            <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={handleInputChange}
              onFocus={() => {
                if (searchResults.length > 0) setShowDropdown(true);
              }}
              placeholder="Search company (Tata Motors) or ticker..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-border bg-surface-subtle focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-accent text-ink placeholder:text-ink-faint transition font-medium"
            />
            {isSearching ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-ink-muted absolute right-2.5 top-1/2 -translate-y-1/2" />
            ) : searchInput ? (
              <button
                onClick={() => {
                  setSearchInput("");
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
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-surface border border-border rounded-xl shadow-elevated z-50 max-h-60 overflow-y-auto divide-y divide-border">
              {searchResults.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => handleSelectStock(stock)}
                  className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-surface-subtle transition flex items-center justify-between group"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-ink truncate group-hover:text-brand-accent">{stock.name}</p>
                    <p className="text-[11px] font-mono text-ink-muted">{stock.symbol}</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-ink-muted group-hover:text-ink shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Popular Quick-Select Chips */}
      <div className="px-5 py-2.5 bg-surface-subtle/50 border-b border-border flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted shrink-0">
          Popular:
        </span>
        {POPULAR_TICKERS.map((t) => (
          <button
            key={t.symbol}
            onClick={() => {
              setSearchInput(t.label);
              fetchStockData(t.symbol);
            }}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition border ${
              selectedTicker === t.symbol
                ? "bg-brand text-white border-brand shadow-xs"
                : "bg-surface text-ink-secondary hover:text-ink border-border hover:border-slate-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Stock Content Grid */}
      {error ? (
        <div className="p-8 text-center text-loss text-xs font-medium">
          {error}
        </div>
      ) : loading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 text-ink-muted text-xs">
          <Loader2 className="w-6 h-6 animate-spin text-brand-accent" />
          <span>Fetching comprehensive NSE stock metrics...</span>
        </div>
      ) : (
        <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Price Summary + Interactive Chart (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Stock Title & Live Price */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-ink font-headline">
                    {fundamentals?.name || selectedTicker}
                  </h3>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-surface-subtle border border-border text-ink-secondary">
                    {selectedTicker}.NS
                  </span>
                </div>
                <p className="text-xs text-ink-muted font-medium mt-0.5">
                  {fundamentals?.sector || "NSE Listed Equity"}
                </p>
              </div>

              {/* Price & Change */}
              <div className="text-right">
                <div className="text-2xl font-extrabold font-mono text-ink tracking-tight">
                  ₹{(priceData?.last_price || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                      isPositive
                        ? "bg-profit-bg text-profit border-profit-border"
                        : "bg-loss-bg text-loss border-loss-border"
                    }`}
                  >
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {isPositive ? "+" : ""}
                    {change.toFixed(2)} ({changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Price Chart */}
            <div className="bg-surface-subtle/40 rounded-xl p-4 border border-border">
              <PriceChart ticker={selectedTicker} />
            </div>

            {/* Quick Actions (Ask AI & Alert) */}
            <div className="flex items-center gap-2.5 pt-1">
              {onAskAI && (
                <button
                  onClick={() => onAskAI(selectedTicker)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg bg-brand-light hover:bg-indigo-100 text-brand-accent border border-brand-border transition shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze {selectedTicker} with FinSight AI</span>
                </button>
              )}
              {onOpenAlert && (
                <button
                  onClick={() => onOpenAlert(selectedTicker)}
                  className="flex items-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg bg-surface hover:bg-surface-subtle text-ink-secondary hover:text-ink border border-border transition shadow-2xs"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-600" />
                  <span>Set Alert</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Key Fundamentals & Valuation Grid (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider font-headline">
              Key Valuation & Financials
            </h4>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-surface-subtle border border-border">
                <span className="text-[10px] font-sans font-bold text-ink-muted uppercase">P/E Ratio</span>
                <p className="text-sm font-bold text-ink mt-0.5">
                  {fundamentals?.pe_ratio ? fundamentals.pe_ratio.toFixed(2) : "N/A"}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-surface-subtle border border-border">
                <span className="text-[10px] font-sans font-bold text-ink-muted uppercase">Debt to Equity</span>
                <p className="text-sm font-bold text-ink mt-0.5">
                  {fundamentals?.debt_to_equity ? fundamentals.debt_to_equity.toFixed(2) : "N/A"}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-surface-subtle border border-border">
                <span className="text-[10px] font-sans font-bold text-ink-muted uppercase">Market Cap</span>
                <p className="text-sm font-bold text-ink mt-0.5">
                  {fundamentals?.market_cap
                    ? `₹${(fundamentals.market_cap / 10000000).toLocaleString("en-IN", { maximumFractionDigits: 0 })} Cr`
                    : "N/A"}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-surface-subtle border border-border">
                <span className="text-[10px] font-sans font-bold text-ink-muted uppercase">ROE</span>
                <p className="text-sm font-bold text-ink mt-0.5">
                  {fundamentals?.roe ? `${(fundamentals.roe * 100).toFixed(2)}%` : "N/A"}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-surface-subtle border border-border">
                <span className="text-[10px] font-sans font-bold text-ink-muted uppercase">Day High</span>
                <p className="text-sm font-bold text-profit mt-0.5">
                  ₹{priceData?.day_high ? priceData.day_high.toFixed(2) : "N/A"}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-surface-subtle border border-border">
                <span className="text-[10px] font-sans font-bold text-ink-muted uppercase">Day Low</span>
                <p className="text-sm font-bold text-loss mt-0.5">
                  ₹{priceData?.day_low ? priceData.day_low.toFixed(2) : "N/A"}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-surface-subtle border border-border col-span-2">
                <span className="text-[10px] font-sans font-bold text-ink-muted uppercase">Prev Close</span>
                <p className="text-sm font-bold text-ink mt-0.5">
                  ₹{priceData?.previous_close ? priceData.previous_close.toFixed(2) : "N/A"}
                </p>
              </div>
            </div>

            {/* Quantitative Tip */}
            <div className="p-3.5 rounded-lg bg-brand-light/60 border border-brand-border">
              <div className="flex items-center gap-1.5 text-brand-accent font-bold text-[11px] uppercase tracking-wide mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>FinSight Quantitative Signal</span>
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed font-sans">
                {selectedTicker} is active on the National Stock Exchange. Ask the FinSight AI Co-Pilot above to assess fair value targets, earnings momentum, and volatility boundaries.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
