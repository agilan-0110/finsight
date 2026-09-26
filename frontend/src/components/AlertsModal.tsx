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
        `Checked live prices. ${res.triggered_count} alert(s) triggered and dispatched to Telegram.`
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
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-light text-brand-accent">
              <Bell size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-ink">
                Automated Price Target Alerts
              </h2>
              <p className="text-xs text-ink-muted font-medium">
                Dispatches real-time Telegram notifications when triggers fire
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Create Alert Form */}
          <div className="p-4 rounded-xl bg-surface-subtle border border-border space-y-3">
            <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
              <Plus size={14} className="text-brand-accent" />
              Set New Alert
            </h3>

            {formError && (
              <p className="text-xs text-loss bg-loss-bg p-2.5 rounded-lg border border-loss-border font-medium">
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
                  className="w-full bg-surface border border-border text-ink text-xs font-mono font-medium rounded-lg px-3 py-2 focus:outline-none focus:border-brand-accent shadow-2xs"
                />
              </div>

              <div className="sm:col-span-1">
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as "above" | "below")}
                  className="w-full bg-surface border border-border text-ink text-xs font-medium rounded-lg px-2.5 py-2 focus:outline-none focus:border-brand-accent shadow-2xs"
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
                  className="w-full bg-surface border border-border text-ink text-xs font-mono font-medium rounded-lg px-3 py-2 focus:outline-none focus:border-brand-accent shadow-2xs"
                />
              </div>

              <div className="sm:col-span-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-full min-h-[36px] bg-ink hover:bg-ink-secondary text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1 disabled:opacity-50 shadow-xs"
                >
                  {submitting ? <Loader2 className="animate-spin" size={14} /> : "Create Alert"}
                </button>
              </div>
            </form>
          </div>

          {/* Manual Run Engine Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-surface-subtle border border-border text-xs">
            <div className="flex items-center gap-2 text-ink-secondary font-medium">
              <Clock size={15} className="text-brand-accent flex-shrink-0" />
              <span>Background engine polls automatically every 60 seconds.</span>
            </div>
            <button
              onClick={handleCheckNow}
              disabled={checking}
              className="px-3.5 py-1.5 rounded-lg bg-surface hover:bg-surface-subtle border border-border text-ink text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 flex-shrink-0 shadow-2xs"
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
            <div className="p-3 rounded-lg bg-brand-light border border-brand-border text-brand-accent text-xs font-semibold">
              {checkResult}
            </div>
          )}

          {/* Tabs: Active vs History */}
          <div className="space-y-3">
            <div className="flex items-center gap-4 border-b border-border pb-2">
              <button
                onClick={() => setActiveTab("active")}
                className={`text-xs font-bold pb-1.5 relative transition-colors ${
                  activeTab === "active"
                    ? "text-ink border-b-2 border-ink"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                Active Monitoring ({activeAlerts.length})
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`text-xs font-bold pb-1.5 relative transition-colors ${
                  activeTab === "history"
                    ? "text-ink border-b-2 border-ink"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                Triggered History ({historyAlerts.length})
              </button>
            </div>

            {loading ? (
              <div className="py-8 flex justify-center text-ink-muted text-xs">
                <Loader2 className="animate-spin text-brand-accent" size={18} />
              </div>
            ) : activeTab === "active" ? (
              activeAlerts.length === 0 ? (
                <p className="text-center py-6 text-ink-muted text-xs font-medium">
                  No active price target alerts. Add one above.
                </p>
              ) : (
                <div className="space-y-2">
                  {activeAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3 rounded-lg bg-surface border border-border flex items-center justify-between text-xs shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-1.5 rounded-md border ${
                            alert.condition === "above"
                              ? "bg-profit-bg text-profit border-profit-border"
                              : "bg-loss-bg text-loss border-loss-border"
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
                            <span className="font-bold font-mono text-ink">
                              {alert.ticker}
                            </span>
                            <span className="text-ink-muted font-medium">
                              target {alert.condition}
                            </span>
                            <span className="font-mono font-bold text-ink">
                              ₹{alert.threshold.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <span className="text-[11px] text-ink-muted font-medium">
                            Created {new Date(alert.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(alert.id)}
                        className="p-1.5 rounded-md text-ink-muted hover:text-loss hover:bg-loss-bg transition-colors"
                        title="Delete Alert"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )
            ) : historyAlerts.length === 0 ? (
              <p className="text-center py-6 text-ink-muted text-xs font-medium">
                No past triggered alerts recorded.
              </p>
            ) : (
              <div className="space-y-2">
                {historyAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 rounded-lg bg-surface-subtle border border-border/80 flex items-center justify-between text-xs opacity-80"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-md bg-surface border border-border text-ink-muted">
                        <CheckCircle2 size={14} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-mono text-ink-secondary">
                            {alert.ticker}
                          </span>
                          <span className="text-ink-muted font-medium">
                            was {alert.condition} ₹{alert.threshold.toLocaleString("en-IN")}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-surface border border-border text-ink-muted">
                            TRIGGERED
                          </span>
                        </div>
                        <span className="text-[11px] text-ink-muted font-medium">
                          {new Date(alert.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(alert.id)}
                      className="p-1.5 rounded-md text-ink-muted hover:text-loss hover:bg-loss-bg transition-colors"
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
