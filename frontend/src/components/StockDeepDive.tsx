import React, { useState, useEffect } from "react";
import { api, type LivePrice, type Fundamentals } from "../api/client";
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
} from "lucide-react";

interface StockDeepDiveProps {
  onAskAI?: (ticker: string) => void;
  onOpenAlert?: (ticker: string) => void;
}

const POPULAR_TICKERS = [
  "RELIANCE",
  "TCS",
  "INFY",
  "HDFCBANK",
  "TATAMOTORS",
  "ITC",
  "ICICIBANK",
  "BHARTIARTL",
];

export const StockDeepDive: React.FC<StockDeepDiveProps> = ({
  onAskAI,
  onOpenAlert,
}) => {
  const [tickerInput, setTickerInput] = useState<string>("RELIANCE");
  const [selectedTicker, setSelectedTicker] = useState<string>("RELIANCE");
  const [priceData, setPriceData] = useState<LivePrice | null>(null);
  const [fundamentals, setFundamentals] = useState<Fundamentals | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStockData = async (ticker: string) => {
    const cleanTicker = ticker.trim().toUpperCase().replace(".NS", "");
    if (!cleanTicker) return;

    setLoading(true);
    setError(null);
    try {
      const [price, fund] = await Promise.all([
        api.getPrice(cleanTicker),
        api.getFundamentals(cleanTicker),
      ]);
      setPriceData(price);
      setFundamentals(fund);
      setSelectedTicker(cleanTicker);
    } catch (err: any) {
      setError(err.message || "Failed to fetch stock information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData("RELIANCE");
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tickerInput.trim()) {
      fetchStockData(tickerInput);
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
            Real-time quotes, technical charts, and fundamental valuation metrics
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 text-ink-muted" size={14} />
            <input
              type="text"
              value={tickerInput}
              onChange={(e) => setTickerInput(e.target.value.toUpperCase())}
              placeholder="Enter ticker (e.g. INFY)..."
              className="w-full bg-surface border border-border text-ink placeholder-ink-faint rounded-lg pl-9 pr-3 py-2 text-xs font-mono font-medium focus:outline-none focus:border-brand-accent transition-colors shadow-2xs"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-ink hover:bg-ink-secondary disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            {loading ? <Loader2 className="animate-spin" size={13} /> : "Search"}
          </button>
        </form>
      </div>

      {/* Quick Select Tickers */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-ink-muted flex-shrink-0 text-[11px] font-bold uppercase tracking-wider">
          Quick Picks:
        </span>
        {POPULAR_TICKERS.map((t) => (
          <button
            key={t}
            onClick={() => {
              setTickerInput(t);
              fetchStockData(t);
            }}
            className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
              selectedTicker === t
                ? "bg-brand-light text-brand-accent border border-brand-border font-bold shadow-2xs"
                : "bg-surface-subtle text-ink-secondary border border-border hover:bg-surface hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Main Stock Card / Details */}
      {error ? (
        <div className="p-4 rounded-xl bg-loss-bg border border-loss-border text-loss text-xs font-medium">
          <p className="font-bold">Query Error</p>
          <p>{error}</p>
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
                <span className="px-2 py-0.5 rounded-md bg-surface-subtle border border-border text-ink-secondary font-mono text-xs font-semibold">
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
                    title={`Ask FinSight AI about ${selectedTicker}`}
                  >
                    <MessageSquare size={16} />
                  </button>
                )}
                {onOpenAlert && (
                  <button
                    onClick={() => onOpenAlert(selectedTicker)}
                    className="p-2.5 rounded-lg bg-surface border border-border hover:border-brand-accent text-ink-secondary hover:text-brand-accent shadow-xs transition-colors"
                    title={`Set Alert for ${selectedTicker}`}
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
