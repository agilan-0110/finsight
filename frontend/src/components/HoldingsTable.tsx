import React, { useState, useRef, useEffect } from "react";
import { Plus, Trash2, X, Loader2, Sparkles, UploadCloud } from "lucide-react";
import { api, type AnalyticsHolding, type StockSearchResult } from "../api/client";

interface Props {
  holdings: AnalyticsHolding[];
  onAddHolding: (holding: { ticker: string; quantity: number; avg_buy_price: number }) => Promise<void>;
  onDeleteHolding: (id: number) => Promise<void>;
  onAskAI?: (ticker: string) => void;
  onOpenBrokerUpload?: () => void;
}

export const HoldingsTable: React.FC<Props> = ({
  holdings,
  onAddHolding,
  onDeleteHolding,
  onAskAI,
  onOpenBrokerUpload,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [stockQuery, setStockQuery] = useState("");
  const [ticker, setTicker] = useState("");
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [filterText, setFilterText] = useState("");

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

  const filteredHoldings = holdings.filter(
    (h) =>
      h.ticker.toLowerCase().includes(filterText.toLowerCase()) ||
      (h.sector && h.sector.toLowerCase().includes(filterText.toLowerCase()))
  );

  return (
    <div id="holdings" className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-stitch overflow-hidden">
      {/* Header from Stitch */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/20">
        <div>
          <h3 className="font-headline text-base font-bold text-on-surface">Holdings &amp; Assets</h3>
          <p className="text-xs text-on-surface-variant font-medium">
            {holdings.length} Active Positions across NSE Equities
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Filter */}
          <div className="relative">
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Filter assets..."
              className="pl-3 pr-3 py-1.5 text-xs rounded-lg bg-surface-container-low border border-outline-variant/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary w-36 sm:w-44"
            />
          </div>

          {onOpenBrokerUpload && (
            <button
              onClick={onOpenBrokerUpload}
              className="px-3 py-1.5 rounded-lg border border-outline-variant/50 hover:bg-surface-container text-on-surface text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Upload Zerodha, Groww, AngelOne, Upstox statement"
            >
              <UploadCloud className="w-3.5 h-3.5 text-primary" />
              <span>Import Statement</span>
            </button>
          )}

          <button
            onClick={() => {
              setShowModal(true);
              setStockQuery("");
              setTicker("");
              setError("");
            }}
            className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-dim text-on-primary text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Position</span>
          </button>
        </div>
      </div>

      {/* Table from Stitch */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-surface-container-low/60 text-on-surface-variant uppercase font-label font-semibold text-[10px] tracking-wider border-b border-outline-variant/20">
              <th className="py-3 px-4">Asset / Ticker</th>
              <th className="py-3 px-4">Shares / Alloc</th>
              <th className="py-3 px-4 text-right">Avg Price</th>
              <th className="py-3 px-4 text-right">Market Price</th>
              <th className="py-3 px-4 text-right">Day Chg</th>
              <th className="py-3 px-4 text-right">Market Value</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20 font-medium">
            {filteredHoldings.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-on-surface-variant">
                  <div className="max-w-md mx-auto flex flex-col items-center justify-center space-y-3">
                    <p className="font-semibold text-on-surface text-sm">No Active Holdings Recorded</p>
                    <p className="text-xs text-on-surface-variant">
                      Track your investments by uploading your broker statement or adding positions manually.
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      {onOpenBrokerUpload && (
                        <button
                          onClick={onOpenBrokerUpload}
                          className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-dim text-on-primary text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <UploadCloud className="w-4 h-4" />
                          <span>Import Broker Statement</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setShowModal(true);
                          setStockQuery("");
                          setTicker("");
                          setError("");
                        }}
                        className="px-3.5 py-2 rounded-xl border border-outline-variant/50 hover:bg-surface-container text-on-surface text-xs font-semibold flex items-center gap-1.5 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Manually</span>
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              filteredHoldings.map((h) => {
                const isProfit = h.pnl >= 0;
                return (
                  <tr key={h.id} className="hover:bg-surface-container-low/50 transition-colors">
                    {/* Asset / Ticker with Stitch Monogram Box */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container font-headline font-bold flex items-center justify-center text-xs uppercase">
                          {h.ticker.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-on-surface">{h.ticker}</div>
                          <div className="text-[11px] text-on-surface-variant">
                            {h.sector || "Equities"} • NSE
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Shares / Alloc */}
                    <td className="py-3.5 px-4 text-on-surface font-mono">
                      <div>{h.quantity} shares</div>
                      <div className="text-[10px] text-on-surface-variant font-normal">
                        {h.portfolio_weight ? `${h.portfolio_weight.toFixed(1)}% weight` : "Active"}
                      </div>
                    </td>

                    {/* Avg Price */}
                    <td className="py-3.5 px-4 text-right text-on-surface font-mono">
                      ₹{h.avg_buy_price.toFixed(2)}
                    </td>

                    {/* Market Price */}
                    <td className="py-3.5 px-4 text-right font-semibold text-on-surface font-mono">
                      ₹{h.current_price.toFixed(2)}
                    </td>

                    {/* Day / Overall Return Pill from Stitch */}
                    <td className="py-3.5 px-4 text-right font-mono">
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                          isProfit
                            ? "bg-secondary-container text-on-secondary-container"
                            : "bg-surface-container-highest text-error"
                        }`}
                      >
                        {isProfit ? "+" : ""}
                        {h.pnl_percentage.toFixed(2)}%
                      </span>
                    </td>

                    {/* Market Value */}
                    <td className="py-3.5 px-4 text-right font-bold text-on-surface font-mono">
                      ₹{h.current_value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    {/* Action from Stitch */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {onAskAI && (
                          <button
                            onClick={() => onAskAI(h.ticker)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded border border-outline-variant/50 text-[11px] font-semibold hover:bg-surface-container transition-colors text-on-surface"
                            title="Generate AI Insights"
                          >
                            <Sparkles className="w-3 h-3 text-primary" />
                            <span>Insights</span>
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteHolding(h.id)}
                          className="p-1 rounded text-outline hover:text-error transition"
                          title="Remove Holding"
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

      {/* Footer info bar from Stitch */}
      <div className="p-3 bg-surface-container-low flex justify-between items-center text-xs text-on-surface-variant border-t border-outline-variant/20">
        <span>Showing {filteredHoldings.length} of {holdings.length} active assets</span>
        <span className="text-[11px] font-semibold text-primary">NSE Real-Time Valuations</span>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-xs">
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl shadow-stitch-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-outline hover:text-on-surface p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold text-on-surface mb-1 font-headline">Add Portfolio Asset</h3>
            <p className="text-xs text-on-surface-variant mb-4 font-medium">
              Search by company name (e.g. Tata Motors, Reliance) or ticker.
            </p>

            {error && (
              <div className="p-3 mb-4 rounded-lg bg-error/10 border border-error/20 text-error text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div ref={dropdownRef} className="relative">
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Company / Ticker
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Type name (e.g. Tata Motors) or symbol"
                    value={stockQuery}
                    onChange={handleStockInputChange}
                    className="w-full pl-3 pr-8 py-2 text-xs rounded-lg border border-outline-variant/40 bg-surface-container-low text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest"
                  />
                  {isSearching ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-outline absolute right-2.5 top-1/2 -translate-y-1/2" />
                  ) : null}
                </div>

                {showDropdown && searchResults.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-surface-container-lowest border border-outline-variant/40 rounded-lg shadow-stitch-lg z-50 max-h-48 overflow-y-auto divide-y divide-outline-variant/20">
                    {searchResults.map((stock: StockSearchResult) => (
                      <button
                        type="button"
                        key={stock.symbol}
                        onClick={() => handleSelectStock(stock)}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-surface-container transition flex items-center justify-between"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-bold text-on-surface truncate">{stock.name}</p>
                          <p className="text-[11px] font-mono text-on-surface-variant">{stock.symbol}</p>
                        </div>
                        <span className="text-[10px] font-semibold text-primary bg-primary-container px-1.5 py-0.5 rounded">
                          Select
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Shares / Quantity
                </label>
                <input
                  type="number"
                  step="any"
                  min="0.0001"
                  required
                  placeholder="e.g. 50"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant/40 bg-surface-container-low text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
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
                  className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant/40 bg-surface-container-low text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-primary hover:bg-primary-dim text-on-primary transition disabled:opacity-50"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
