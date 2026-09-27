import React, { useState, useRef, useEffect } from "react";
import { Plus, Trash2, X, Loader2, Sparkles } from "lucide-react";
import { api, type AnalyticsHolding, type StockSearchResult } from "../api/client";

interface Props {
  holdings: AnalyticsHolding[];
  onAddHolding: (holding: { ticker: string; quantity: number; avg_buy_price: number }) => Promise<void>;
  onDeleteHolding: (id: number) => Promise<void>;
  onAskAI?: (ticker: string) => void;
}

export const HoldingsTable: React.FC<Props> = ({ holdings, onAddHolding, onDeleteHolding, onAskAI }) => {
  const [showModal, setShowModal] = useState(false);
  const [stockQuery, setStockQuery] = useState("");
  const [ticker, setTicker] = useState("");
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Autocomplete state
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStockInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setStockQuery(val);
    setTicker(val.toUpperCase());

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (val.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setShowDropdown(true);

    debounceRef.current = setTimeout(async () => {
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

  const handleSelectStock = async (stock: StockSearchResult) => {
    setTicker(stock.symbol);
    setStockQuery(`${stock.name} (${stock.symbol})`);
    setShowDropdown(false);
    setSearchResults([]);

    try {
      const quote = await api.getPrice(stock.symbol);
      if (quote?.last_price && !buyPrice) {
        setBuyPrice(quote.last_price.toFixed(2));
      }
    } catch {
      // ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker || !quantity || !buyPrice) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await onAddHolding({
        ticker: ticker.trim().toUpperCase(),
        quantity: parseFloat(quantity),
        avg_buy_price: parseFloat(buyPrice),
      });
      setShowModal(false);
      setTicker("");
      setStockQuery("");
      setQuantity("");
      setBuyPrice("");
    } catch (err: any) {
      setError(err.message || "Failed to add holding.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl bg-surface border border-border shadow-card overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-ink uppercase tracking-wider font-headline">
              Portfolio Holdings
            </h2>
            <span className="text-[10px] font-mono font-bold bg-surface-subtle text-ink-secondary px-2 py-0.5 rounded border border-border">
              {holdings.length} {holdings.length === 1 ? "Asset" : "Assets"}
            </span>
          </div>
          <p className="text-xs text-ink-muted font-medium mt-0.5">
            Real-time equity valuation, weight distributions, and AI analysis
          </p>
        </div>
        <button
          onClick={() => {
            setShowModal(true);
            setStockQuery("");
            setTicker("");
            setError("");
          }}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-brand hover:bg-slate-700 text-white transition shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Position</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-subtle text-ink-muted border-b border-border uppercase text-[10px] tracking-wider font-bold">
            <tr>
              <th className="py-3 px-4">Asset / Ticker</th>
              <th className="py-3 px-4">Shares</th>
              <th className="py-3 px-4">Avg Buy</th>
              <th className="py-3 px-4">Live Price</th>
              <th className="py-3 px-4">Market Value</th>
              <th className="py-3 px-4">Return (P&L)</th>
              <th className="py-3 px-4">Weight</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-mono">
            {holdings.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-ink-muted font-sans font-medium">
                  No holdings recorded yet. Click &quot;Add Position&quot; to begin tracking your portfolio.
                </td>
              </tr>
            ) : (
              holdings.map((h) => {
                const isProfit = h.pnl >= 0;
                return (
                  <tr key={h.id} className="hover:bg-surface-subtle/80 transition group">
                    <td className="py-3.5 px-4 font-sans">
                      <div className="font-bold text-ink flex items-center gap-2">
                        <span>{h.ticker}</span>
                        <span className="text-[10px] font-mono font-medium text-ink-muted px-1.5 py-0.2 rounded bg-surface-subtle border border-border">
                          {h.sector || "NSE"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-ink-secondary">{h.quantity}</td>
                    <td className="py-3.5 px-4 text-ink-secondary">₹{h.avg_buy_price.toFixed(2)}</td>
                    <td className="py-3.5 px-4 font-semibold text-ink">₹{h.current_price.toFixed(2)}</td>
                    <td className="py-3.5 px-4 font-bold text-ink">
                      ₹{h.current_value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className={`font-bold ${isProfit ? "text-profit" : "text-loss"}`}>
                          {isProfit ? "+" : ""}₹{h.pnl.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className={`text-[10px] font-bold ${isProfit ? "text-profit" : "text-loss"}`}>
                          {isProfit ? "▲ +" : "▼ "}
                          {h.pnl_percentage.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-surface-subtle border border-border h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-brand-accent h-full rounded-full"
                            style={{ width: `${Math.min(h.portfolio_weight || 0, 100)}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-ink-secondary">
                          {h.portfolio_weight ? `${h.portfolio_weight.toFixed(1)}%` : "-"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onAskAI && (
                          <button
                            onClick={() => onAskAI(h.ticker)}
                            className="p-1.5 text-brand-accent hover:bg-brand-light rounded-md border border-transparent hover:border-brand-border transition"
                            title={`Ask AI to analyze ${h.ticker}`}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteHolding(h.id)}
                          className="p-1.5 text-ink-muted hover:text-loss hover:bg-loss-bg rounded-md border border-transparent hover:border-loss-border transition"
                          title="Remove holding"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Holding Modal with Autocomplete */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-surface border border-border rounded-xl shadow-elevated w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-ink-muted hover:text-ink p-1 rounded-md hover:bg-surface-subtle"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold text-ink mb-1 font-headline">Add Portfolio Position</h3>
            <p className="text-xs text-ink-muted mb-4 font-medium">
              Search by company name (e.g. Tata Motors, Infosys) or ticker symbol.
            </p>

            {error && (
              <div className="p-3 mb-4 rounded-lg bg-loss-bg border border-loss-border text-loss text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Autocomplete Input */}
              <div ref={dropdownRef} className="relative">
                <label className="block text-xs font-bold text-ink-secondary mb-1">
                  Stock / Company
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Type name (e.g. Tata Motors) or symbol"
                    value={stockQuery}
                    onChange={handleStockInputChange}
                    className="w-full pl-3 pr-8 py-2 text-xs rounded-lg border border-border bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent"
                  />
                  {isSearching ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-ink-muted absolute right-2.5 top-1/2 -translate-y-1/2" />
                  ) : null}
                </div>

                {/* Dropdown items */}
                {showDropdown && searchResults.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-surface border border-border rounded-lg shadow-elevated z-50 max-h-48 overflow-y-auto divide-y divide-border">
                    {searchResults.map((stock: StockSearchResult) => (
                      <button
                        type="button"
                        key={stock.symbol}
                        onClick={() => handleSelectStock(stock)}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-surface-subtle transition flex items-center justify-between"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-bold text-ink truncate">{stock.name}</p>
                          <p className="text-[11px] font-mono text-ink-muted">{stock.symbol}</p>
                        </div>
                        <span className="text-[10px] font-semibold text-brand-accent bg-brand-light px-1.5 py-0.5 rounded border border-brand-border shrink-0">
                          Select
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-bold text-ink-secondary mb-1">
                  Quantity (Shares)
                </label>
                <input
                  type="number"
                  step="any"
                  min="0.0001"
                  required
                  placeholder="e.g. 50"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent"
                />
              </div>

              {/* Average Buy Price */}
              <div>
                <label className="block text-xs font-bold text-ink-secondary mb-1">
                  Average Buy Price (₹)
                </label>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  required
                  placeholder="e.g. 982.50"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-border text-ink-secondary hover:bg-surface-subtle transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-brand hover:bg-slate-700 text-white transition disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Holding</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
