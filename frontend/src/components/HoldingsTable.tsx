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
    <div className="rounded-xl bg-slate-850 border border-slate-750 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-750 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
            Portfolio Holdings
          </h2>
          <p className="text-xs text-slate-400">Live positions, market valuation, and individual returns</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-accent hover:bg-accent-light text-slate-950 transition shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Position</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-750 uppercase text-[10px] tracking-wider font-semibold">
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
          <tbody className="divide-y divide-slate-750/70 font-mono">
            {holdings.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400 font-sans">
                  No holdings added yet. Click &quot;Add Position&quot; to begin tracking your portfolio.
                </td>
              </tr>
            ) : (
              holdings.map((h) => {
                const isProfit = h.pnl >= 0;
                return (
                  <tr key={h.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-sans">
                      <div className="font-semibold text-slate-100">{h.ticker}</div>
                      <div className="text-[10px] text-slate-400 font-sans">{h.sector}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-200">{h.quantity}</td>
                    <td className="py-3 px-4 text-slate-200">₹{h.avg_buy_price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-slate-50 font-bold">₹{h.current_price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-slate-200 font-semibold">₹{h.current_value.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <div className={`font-bold ${isProfit ? "text-profit" : "text-loss"}`}>
                        {isProfit ? "+" : ""}₹{h.pnl.toFixed(2)}
                      </div>
                      <div className={`text-[10px] ${isProfit ? "text-profit" : "text-loss"}`}>
                        {isProfit ? "▲ +" : "▼ "}
                        {h.pnl_percentage.toFixed(2)}%
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-300 min-w-[35px]">{h.portfolio_weight}%</span>
                        <div className="w-16 bg-slate-750 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-accent h-full rounded-full"
                            style={{ width: `${Math.min(h.portfolio_weight, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onDeleteHolding(h.id)}
                        className="p-1 rounded text-slate-400 hover:text-loss hover:bg-loss-bg transition"
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-850 border border-slate-700 rounded-xl p-5 w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-750 mb-4">
              <h3 className="font-semibold text-sm text-slate-100 uppercase tracking-wide">
                Add Stock Position
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="mb-3 p-2 rounded bg-loss-bg border border-loss/30 text-loss text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">
                  NSE Symbol (e.g. TCS, RELIANCE, INFY)
                </label>
                <input
                  type="text"
                  placeholder="TCS"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 uppercase focus:outline-none focus:border-accent font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Quantity (Shares)</label>
                <input
                  type="number"
                  step="any"
                  placeholder="10"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">
                  Average Buy Price (₹)
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="3500.00"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent font-mono"
                  required
                />
              </div>

              <div className="pt-2 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-750 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 rounded-lg bg-accent text-slate-950 font-semibold hover:bg-accent-light transition disabled:opacity-50"
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
