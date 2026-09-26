import React, { useState, useEffect } from "react";
import { api, type AlertItem } from "../api/client";
import {
  X,
  Bell,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  RefreshCw,
  Loader2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface AlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillTicker?: string;
}

export const AlertsModal: React.FC<AlertsModalProps> = ({
  isOpen,
  onClose,
  prefillTicker,
}) => {
  const [activeAlerts, setActiveAlerts] = useState<AlertItem[]>([]);
  const [historyAlerts, setHistoryAlerts] = useState<AlertItem[]>([]);
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [loading, setLoading] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(false);
  const [checkResult, setCheckResult] = useState<string | null>(null);

  // Form State
  const [ticker, setTicker] = useState<string>("");
  const [condition, setCondition] = useState<"above" | "below">("above");
  const [threshold, setThreshold] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const [active, history] = await Promise.all([
        api.getActiveAlerts(),
        api.getAlertHistory(),
      ]);
      setActiveAlerts(active);
      setHistoryAlerts(history);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAlerts();
      if (prefillTicker) {
        setTicker(prefillTicker.toUpperCase());
      }
    }
  }, [isOpen, prefillTicker]);

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker.trim() || !threshold) {
      setFormError("Please provide a valid ticker and target price.");
      return;
    }

    const priceNum = parseFloat(threshold);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError("Target price must be a positive number.");
      return;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      await api.createAlert({
        ticker: ticker.trim().toUpperCase(),
        condition,
        threshold: priceNum,
      });
      setTicker("");
      setThreshold("");
      await fetchAlerts();
    } catch (err: any) {
      setFormError(err.message || "Failed to create price alert.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteAlert(id);
      await fetchAlerts();
    } catch (err: any) {
      alert("Failed to delete alert: " + err.message);
    }
  };

  const handleCheckNow = async () => {
    setChecking(true);
    setCheckResult(null);
    try {
      const res = await api.checkAlertsNow();
      setCheckResult(
        `Checked live prices. ${res.triggered_count} alert(s) triggered and sent to Telegram.`
      );
      await fetchAlerts();
    } catch (err: any) {
      setCheckResult(`Check failed: ${err.message}`);
    } finally {
      setChecking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-850 border border-slate-750 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-750 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-accent-bg text-accent">
              <Bell size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Automated Price Target Alerts
              </h2>
              <p className="text-xs text-slate-400">
                Dispatches real-time Telegram notifications when triggers fire
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* Create Alert Form */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-750 space-y-3">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Plus size={14} className="text-accent" />
              Set New Alert
            </h3>

            {formError && (
              <p className="text-xs text-loss bg-loss-bg p-2 rounded border border-loss/20">
                {formError}
              </p>
            )}

            <form onSubmit={handleCreateAlert} className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <div className="sm:col-span-1">
                <input
                  type="text"
                  placeholder="Ticker (e.g. INFY)"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  className="w-full bg-slate-850 border border-slate-750 text-slate-100 text-xs font-mono rounded-lg px-3 py-2 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="sm:col-span-1">
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as "above" | "below")}
                  className="w-full bg-slate-850 border border-slate-750 text-slate-100 text-xs rounded-lg px-2 py-2 focus:outline-none focus:border-accent"
                >
                  <option value="above">rises above (≥)</option>
                  <option value="below">drops below (≤)</option>
                </select>
              </div>

              <div className="sm:col-span-1">
                <input
                  type="number"
                  step="any"
                  placeholder="Target Price (₹)"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-750 text-slate-100 text-xs font-mono rounded-lg px-3 py-2 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="sm:col-span-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-full min-h-[34px] bg-accent hover:bg-sky-400 text-slate-950 font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="animate-spin" size={14} /> : "Create Alert"}
                </button>
              </div>
            </form>
          </div>

          {/* Manual Run Engine Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-750/70 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Clock size={15} className="text-accent flex-shrink-0" />
              <span>Background engine polls automatically every 60 seconds.</span>
            </div>
            <button
              onClick={handleCheckNow}
              disabled={checking}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50 flex-shrink-0"
            >
              {checking ? (
                <Loader2 className="animate-spin" size={13} />
              ) : (
                <RefreshCw size={13} />
              )}
              <span>Check Alerts Now</span>
            </button>
          </div>

          {checkResult && (
            <div className="p-2.5 rounded-lg bg-accent-bg border border-accent/30 text-accent text-xs">
              {checkResult}
            </div>
          )}

          {/* Tabs: Active vs History */}
          <div className="space-y-3">
            <div className="flex items-center gap-4 border-b border-slate-750 pb-2">
              <button
                onClick={() => setActiveTab("active")}
                className={`text-xs font-semibold pb-1 relative transition-colors ${
                  activeTab === "active"
                    ? "text-accent border-b-2 border-accent"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Active Monitoring ({activeAlerts.length})
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`text-xs font-semibold pb-1 relative transition-colors ${
                  activeTab === "history"
                    ? "text-accent border-b-2 border-accent"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Triggered History ({historyAlerts.length})
              </button>
            </div>

            {loading ? (
              <div className="py-8 flex justify-center text-slate-400 text-xs">
                <Loader2 className="animate-spin text-accent" size={18} />
              </div>
            ) : activeTab === "active" ? (
              activeAlerts.length === 0 ? (
                <p className="text-center py-6 text-slate-500 text-xs">
                  No active price target alerts. Add one above.
                </p>
              ) : (
                <div className="space-y-2">
                  {activeAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3 rounded-lg bg-slate-900 border border-slate-750 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-1.5 rounded ${
                            alert.condition === "above"
                              ? "bg-profit-bg text-profit"
                              : "bg-loss-bg text-loss"
                          }`}
                        >
                          {alert.condition === "above" ? (
                            <TrendingUp size={14} />
                          ) : (
                            <TrendingDown size={14} />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold font-mono text-slate-100">
                              {alert.ticker}
                            </span>
                            <span className="text-slate-400">
                              target {alert.condition}
                            </span>
                            <span className="font-mono font-semibold text-slate-100">
                              ₹{alert.threshold.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500">
                            Created {new Date(alert.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(alert.id)}
                        className="p-1.5 rounded text-slate-400 hover:text-loss hover:bg-slate-800 transition-colors"
                        title="Delete Alert"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )
            ) : historyAlerts.length === 0 ? (
              <p className="text-center py-6 text-slate-500 text-xs">
                No past triggered alerts recorded.
              </p>
            ) : (
              <div className="space-y-2">
                {historyAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 rounded-lg bg-slate-900/50 border border-slate-750/70 flex items-center justify-between text-xs opacity-75"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded bg-slate-800 text-slate-400">
                        <CheckCircle2 size={14} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-mono text-slate-300">
                            {alert.ticker}
                          </span>
                          <span className="text-slate-400">
                            was {alert.condition} ₹{alert.threshold.toLocaleString("en-IN")}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400">
                            TRIGGERED
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {new Date(alert.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(alert.id)}
                      className="p-1.5 rounded text-slate-500 hover:text-loss transition-colors"
                      title="Delete History Item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
