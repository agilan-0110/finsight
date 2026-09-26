import React, { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import type { AnalyticsHolding } from "../api/client";

interface Props {
  holdings: AnalyticsHolding[];
  onAddHolding: (holding: { ticker: string; quantity: number; avg_buy_price: number }) => Promise<void>;
  onDeleteHolding: (id: number) => Promise<void>;
}

export const HoldingsTable: React.FC<Props> = ({ holdings, onAddHolding, onDeleteHolding }) => {
  const [showModal, setShowModal] = useState(false);
  const [ticker, setTicker] = useState("");
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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
      setQuantity("");
      setBuyPrice("");
    } catch (err: any) {
      setError(err.message || "Failed to add holding.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl bg-surface border border-border shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-ink uppercase tracking-wider">
            Portfolio Holdings
          </h2>
          <p className="text-xs text-ink-muted font-medium">Live positions, market valuation, and individual returns</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-ink hover:bg-ink-secondary text-white transition shadow-xs"
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
              <th className="py-3 px-4">Asset</th>
              <th className="py-3 px-4">Shares</th>
              <th className="py-3 px-4">Avg Buy</th>
              <th className="py-3 px-4">Live Price</th>
              <th className="py-3 px-4">Market Value</th>
              <th className="py-3 px-4">Unrealized P&L</th>
              <th className="py-3 px-4">Weight</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-mono">
            {holdings.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-ink-muted font-sans font-medium">
                  No holdings added yet. Click &quot;Add Position&quot; to begin tracking your portfolio.
                </td>
              </tr>
            ) : (
              holdings.map((h) => {
                const isProfit = h.pnl >= 0;
                return (
                  <tr key={h.id} className="hover:bg-surface-hover transition">
                    <td className="py-3.5 px-4 font-sans">
                      <div className="font-bold text-ink">{h.ticker}</div>
                      <div className="text-[11px] text-ink-muted font-medium">{h.sector}</div>
                    </td>
                    <td className="py-3.5 px-4 text-ink-secondary font-medium">{h.quantity}</td>
                    <td className="py-3.5 px-4 text-ink-secondary font-medium">₹{h.avg_buy_price.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-ink font-bold">₹{h.current_price.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-ink font-semibold">₹{h.current_value.toFixed(2)}</td>
                    <td className="py-3.5 px-4">
                      <div className={`font-bold ${isProfit ? "text-profit" : "text-loss"}`}>
                        {isProfit ? "+" : ""}₹{h.pnl.toFixed(2)}
                      </div>
                      <div className={`text-[11px] font-bold ${isProfit ? "text-profit" : "text-loss"}`}>
                        {isProfit ? "▲ +" : "▼ "}
                        {h.pnl_percentage.toFixed(2)}%
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-ink-secondary font-medium min-w-[35px]">{h.portfolio_weight}%</span>
                        <div className="w-16 bg-surface-subtle border border-border h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-brand-accent h-full rounded-full"
                            style={{ width: `${Math.min(h.portfolio_weight, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onDeleteHolding(h.id)}
                        className="p-1.5 rounded text-ink-muted hover:text-loss hover:bg-loss-bg transition"
                        title="Delete position"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Position Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <h3 className="font-bold text-sm text-ink uppercase tracking-wide">
                Add Stock Position
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-ink-muted hover:text-ink p-1 rounded-md hover:bg-surface-subtle"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="mb-3 p-2.5 rounded-lg bg-loss-bg border border-loss-border text-loss text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-ink-secondary mb-1.5 font-semibold">
                  NSE Symbol (e.g. TCS, RELIANCE, INFY)
                </label>
                <input
                  type="text"
                  placeholder="TCS"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-ink placeholder-ink-faint uppercase focus:outline-none focus:border-brand-accent font-mono shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="block text-ink-secondary mb-1.5 font-semibold">Quantity (Shares)</label>
                <input
                  type="number"
                  step="any"
                  placeholder="10"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-ink placeholder-ink-faint focus:outline-none focus:border-brand-accent font-mono shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="block text-ink-secondary mb-1.5 font-semibold">
                  Average Buy Price (₹)
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="3500.00"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-ink placeholder-ink-faint focus:outline-none focus:border-brand-accent font-mono shadow-2xs"
                  required
                />
              </div>

              <div className="pt-2 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-2 rounded-lg bg-surface border border-border text-ink-secondary hover:bg-surface-subtle font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-ink text-white font-semibold hover:bg-ink-secondary transition disabled:opacity-50 shadow-xs"
                >
                  {submitting ? "Adding..." : "Add Position"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
