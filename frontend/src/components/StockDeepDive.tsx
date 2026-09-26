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
    // Yahoo marketCap is in INR. 1 Cr = 10,000,000
    const inCrores = cap / 10000000;
    return `₹${inCrores.toLocaleString("en-IN", { maximumFractionDigits: 0 })} Cr`;
  };

  return (
    <div className="bg-slate-850 border border-slate-750 rounded-xl p-5 shadow-sm space-y-5">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Activity className="text-accent" size={18} />
            Institutional Stock Deep Dive
          </h2>
          <p className="text-xs text-slate-400">
            Real-time quotes, technical charts, and fundamental valuation metrics
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
            <input
              type="text"
              value={tickerInput}
              onChange={(e) => setTickerInput(e.target.value.toUpperCase())}
              placeholder="Enter ticker (e.g. INFY)..."
              className="w-full bg-slate-900 border border-slate-750 text-slate-100 placeholder-slate-500 rounded-lg pl-9 pr-3 py-1.5 text-xs font-mono focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-3.5 py-1.5 bg-accent-blue hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            {loading ? <Loader2 className="animate-spin" size={13} /> : "Search"}
          </button>
        </form>
      </div>

      {/* Quick Select Tickers */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 flex-shrink-0 text-[11px] font-semibold uppercase tracking-wider">
          Quick Picks:
        </span>
        {POPULAR_TICKERS.map((t) => (
          <button
            key={t}
            onClick={() => {
              setTickerInput(t);
              fetchStockData(t);
            }}
            className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
              selectedTicker === t
                ? "bg-accent/20 text-accent border border-accent/40 font-semibold"
                : "bg-slate-900 text-slate-400 border border-slate-750 hover:text-slate-200 hover:border-slate-650"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Main Stock Card / Details */}
      {error ? (
        <div className="p-4 rounded-lg bg-loss-bg border border-loss/30 text-loss text-xs">
          <p className="font-semibold">Query Error</p>
          <p>{error}</p>
        </div>
      ) : loading && !priceData ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-2">
          <Loader2 className="animate-spin text-accent" size={24} />
          <span className="text-xs">Fetching market depth for {selectedTicker}...</span>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Header Row: Price & Meta */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-750/70 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-100 tracking-tight">
                  {fundamentals?.name || selectedTicker}
                </h3>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-750 text-slate-400 font-mono text-xs">
                  NSE: {selectedTicker}
                </span>
                {fundamentals?.sector && (
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs">
                    {fundamentals.sector}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">National Stock Exchange of India (INR)</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-left md:text-right">
                <div className="text-2xl font-bold font-mono text-slate-100">
                  {priceData ? formatRupee(priceData.last_price) : "--"}
                </div>
                <div
                  className={`flex items-center md:justify-end gap-1 text-xs font-mono font-medium ${
                    isUp ? "text-profit" : "text-loss"
                  }`}
                >
                  {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  <span>
                    {isUp ? "+" : ""}
                    {dayChange.toFixed(2)} ({isUp ? "+" : ""}
                    {dayChangePercent.toFixed(2)}%)
                  </span>
                  <span className="text-slate-500 font-sans text-[11px] ml-1">Today</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {onAskAI && (
                  <button
                    onClick={() => onAskAI(selectedTicker)}
                    className="p-2 rounded-lg bg-slate-900 border border-slate-750 hover:border-accent text-slate-300 hover:text-accent transition-colors"
                    title={`Ask FinSight AI about ${selectedTicker}`}
                  >
                    <MessageSquare size={16} />
                  </button>
                )}
                {onOpenAlert && (
                  <button
                    onClick={() => onOpenAlert(selectedTicker)}
                    className="p-2 rounded-lg bg-slate-900 border border-slate-750 hover:border-accent text-slate-300 hover:text-accent transition-colors"
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
            <div className="lg:col-span-2 bg-slate-900/60 border border-slate-750/70 rounded-xl p-4">
              <PriceChart ticker={selectedTicker} />
            </div>

            {/* Fundamentals Column (1 col) */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers size={13} className="text-accent" />
                Fundamental Ratios
              </h4>

              <div className="grid grid-cols-2 gap-2.5">
                {/* P/E Ratio */}
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-750">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Percent size={11} />
                    <span>P/E Ratio</span>
                  </div>
                  <div className="text-sm font-bold font-mono text-slate-100 mt-1">
                    {fundamentals?.pe_ratio ? fundamentals.pe_ratio.toFixed(2) : "N/A"}
                  </div>
                </div>

                {/* ROE */}
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-750">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <TrendingUp size={11} />
                    <span>ROE</span>
                  </div>
                  <div className="text-sm font-bold font-mono text-slate-100 mt-1">
                    {fundamentals?.roe ? `${(fundamentals.roe * 100).toFixed(2)}%` : "N/A"}
                  </div>
                </div>

                {/* Debt to Equity */}
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-750">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Activity size={11} />
                    <span>Debt / Equity</span>
                  </div>
                  <div className="text-sm font-bold font-mono text-slate-100 mt-1">
                    {fundamentals?.debt_to_equity ? fundamentals.debt_to_equity.toFixed(2) : "N/A"}
                  </div>
                </div>

                {/* Market Cap */}
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-750">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Building2 size={11} />
                    <span>Market Cap</span>
                  </div>
                  <div className="text-xs font-bold font-mono text-slate-100 mt-1 truncate">
                    {formatMarketCapCr(fundamentals?.market_cap ?? null)}
                  </div>
                </div>

                {/* Day Range */}
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-750 col-span-2">
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Day Range</span>
                    <span className="font-mono text-slate-300">
                      ₹{priceData?.day_low.toFixed(1)} — ₹{priceData?.day_high.toFixed(1)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                    {priceData && (
                      <div
                        className="bg-accent h-full rounded-full"
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
