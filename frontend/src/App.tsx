import { useState, useEffect, useCallback } from "react";
import { api, type PortfolioAnalytics } from "./api/client";
import { Navbar } from "./components/Navbar";
import { PortfolioSummary } from "./components/PortfolioSummary";
import { HoldingsTable } from "./components/HoldingsTable";
import { SectorChart } from "./components/SectorChart";
import { StockDeepDive } from "./components/StockDeepDive";
import { AIChatPanel } from "./components/AIChatPanel";
import { AlertsModal } from "./components/AlertsModal";
import { MemoriesModal } from "./components/MemoriesModal";
import { CheckCircle, AlertTriangle, X } from "lucide-react";

export function App() {
  const [analytics, setAnalytics] = useState<PortfolioAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSendingDigest, setIsSendingDigest] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Modals
  const [alertsOpen, setAlertsOpen] = useState<boolean>(false);
  const [memoriesOpen, setMemoriesOpen] = useState<boolean>(false);
  const [prefillAlertTicker, setPrefillAlertTicker] = useState<string | undefined>(undefined);
  const [aiPrompt, setAiPrompt] = useState<string | undefined>(undefined);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const loadData = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    setIsRefreshing(true);
    try {
      const [health, data] = await Promise.all([
        api.checkHealth().catch(() => ({ status: "error" })),
        api.getAnalytics(),
      ]);
      setIsConnected(
        Boolean(
          health.status &&
          (health.status.toLowerCase().includes("running") ||
           health.status.toLowerCase().includes("ok") ||
           health.status.toLowerCase().includes("healthy"))
        )
      );
      setAnalytics(data);
    } catch {
      setIsConnected(false);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    // Auto-check connection every 30 seconds
    const interval = setInterval(() => {
      loadData(true);
    }, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleAddHolding = async (holding: {
    ticker: string;
    quantity: number;
    avg_buy_price: number;
  }) => {
    await api.addHolding(holding);
    showToast(`Added ${holding.ticker} (${holding.quantity} shares) to portfolio.`);
    await loadData(true);
  };

  const handleDeleteHolding = async (id: number) => {
    if (window.confirm("Are you sure you want to remove this position from your portfolio?")) {
      await api.deleteHolding(id);
      showToast("Position removed from portfolio.");
      await loadData(true);
    }
  };

  const handleSendDigest = async () => {
    setIsSendingDigest(true);
    try {
      const res = await api.sendWeeklyDigest();
      if (res.sent_to_telegram) {
        showToast("Executive Portfolio Digest sent directly to your Telegram!");
      } else {
        showToast("Digest generated (Telegram credentials not verified).", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to dispatch digest.", "error");
    } finally {
      setIsSendingDigest(false);
    }
  };

  const handleAskAI = (ticker: string) => {
    setAiPrompt(`Provide institutional financial analysis for ${ticker} on NSE. Assess fundamentals, valuation ratios, growth catalysts, and key downside risks.`);
    const chatEl = document.getElementById("ai-chat-section");
    if (chatEl) {
      chatEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleOpenAlert = (ticker: string) => {
    setPrefillAlertTicker(ticker);
    setAlertsOpen(true);
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-brand-light selection:text-brand-accent">
      {/* Top Navigation */}
      <Navbar
        isConnected={isConnected}
        onRefresh={() => loadData(false)}
        isRefreshing={isRefreshing}
        onOpenAlerts={() => {
          setPrefillAlertTicker(undefined);
          setAlertsOpen(true);
        }}
        onOpenMemories={() => setMemoriesOpen(true)}
        onSendDigest={handleSendDigest}
        isSendingDigest={isSendingDigest}
      />

      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-surface border border-border shadow-xl text-xs max-w-md animate-in fade-in slide-in-from-bottom-3 duration-200">
          {toast.type === "success" ? (
            <CheckCircle className="w-4 h-4 text-profit flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-loss flex-shrink-0" />
          )}
          <span className="text-ink font-semibold flex-1">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="text-ink-muted hover:text-ink p-0.5 rounded-md hover:bg-surface-subtle"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Row 1: Executive KPI Summary & Health Banner */}
        <PortfolioSummary analytics={analytics} loading={loading} />

        {/* Row 2: Portfolio Holdings & Sector Breakdown (Left) + AI Financial Analyst (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (Holdings & Sector) */}
          <div className="lg:col-span-7 space-y-6">
            <HoldingsTable
              holdings={analytics?.holdings || []}
              onAddHolding={handleAddHolding}
              onDeleteHolding={handleDeleteHolding}
            />

            <SectorChart
              sectors={analytics?.sectors || {}}
              diversificationScore={analytics?.diversification_score || 0}
            />
          </div>

          {/* Right Column (AI Financial Analyst Terminal) */}
          <div id="ai-chat-section" className="lg:col-span-5 lg:sticky lg:top-20">
            <AIChatPanel
              initialPrompt={aiPrompt}
              onClearInitialPrompt={() => setAiPrompt(undefined)}
            />
          </div>
        </div>

        {/* Row 3: NSE Stock Deep Dive & Valuation Explorer */}
        <div>
          <StockDeepDive
            onAskAI={handleAskAI}
            onOpenAlert={handleOpenAlert}
          />
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="border-t border-border bg-surface py-6 px-6 mt-12 text-center text-xs text-ink-muted shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-semibold text-ink-secondary">
            FinSight — AI Financial Intelligence & Portfolio Analytics for Indian Equities
          </p>
          <p className="text-[11px] text-ink-muted font-medium">
            For educational & research analysis only. Not SEBI-registered investment advice.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <AlertsModal
        isOpen={alertsOpen}
        onClose={() => setAlertsOpen(false)}
        prefillTicker={prefillAlertTicker}
      />

      <MemoriesModal
        isOpen={memoriesOpen}
        onClose={() => setMemoriesOpen(false)}
      />
    </div>
  );
}

export default App;
