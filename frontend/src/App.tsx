import { useState, useEffect, useCallback } from "react";
import { api, authStorage, type PortfolioAnalytics, type User } from "./api/client";
import { Sidebar } from "./components/Sidebar";
import { Navbar } from "./components/Navbar";
import { PortfolioSummary } from "./components/PortfolioSummary";
import { PortfolioPerformanceCurve } from "./components/PortfolioPerformanceCurve";
import { HoldingsTable } from "./components/HoldingsTable";
import { SectorChart } from "./components/SectorChart";
import { AIRebalancingCard } from "./components/AIRebalancingCard";
import { StockDeepDive } from "./components/StockDeepDive";
import { AIChatPanel } from "./components/AIChatPanel";
import { AlertsModal } from "./components/AlertsModal";
import { MemoriesModal } from "./components/MemoriesModal";
import { AuthModal } from "./components/AuthModal";
import { BrokerUploadModal } from "./components/BrokerUploadModal";
import { StockMarketAcademyModal } from "./components/StockMarketAcademyModal";
import { OnboardingChoiceModal } from "./components/OnboardingChoiceModal";
import { CheckCircle, AlertTriangle, X } from "lucide-react";

export function App() {
  const [analytics, setAnalytics] = useState<PortfolioAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSendingDigest, setIsSendingDigest] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // User state
  const [currentUser, setCurrentUser] = useState<User | null>(authStorage.getUser());

  // Navigation & Modals state
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [alertsOpen, setAlertsOpen] = useState<boolean>(false);
  const [memoriesOpen, setMemoriesOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [brokerUploadOpen, setBrokerUploadOpen] = useState<boolean>(false);
  const [academyOpen, setAcademyOpen] = useState<boolean>(false);
  const [onboardingChoiceOpen, setOnboardingChoiceOpen] = useState<boolean>(false);

  const [prefillAlertTicker, setPrefillAlertTicker] = useState<string | undefined>(undefined);
  const [aiPrompt, setAiPrompt] = useState<string | undefined>(undefined);
  const [selectedDeepDiveTicker, setSelectedDeepDiveTicker] = useState<string | undefined>(undefined);

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

  // Fetch logged in profile if token exists
  useEffect(() => {
    if (authStorage.getToken()) {
      api.getMe()
        .then((user) => {
          setCurrentUser(user);
        })
        .catch(() => {
          authStorage.clear();
          setCurrentUser(null);
        });
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData(true);
    }, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleAuthSuccess = (user: User, isNewUser: boolean) => {
    setCurrentUser(user);
    showToast(`Welcome ${user.full_name}! Account active.`);
    loadData(false);
    if (isNewUser) {
      setOnboardingChoiceOpen(true);
    }
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    showToast("Signed out successfully.");
    loadData(false);
  };

  const handleImportSuccess = (count: number) => {
    showToast(`Successfully imported ${count} positions into your portfolio!`);
    loadData(false);
  };

  const handleAcademyCompleted = () => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, tutorial_completed: true });
    }
    showToast("Market Academy completed! You're ready to research & invest.");
  };

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
        showToast("Executive Portfolio Digest dispatched directly to your Telegram!");
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

  const handleSelectStockFromNav = (ticker: string) => {
    setSelectedDeepDiveTicker(ticker);
    const deepDiveEl = document.getElementById("stock-deep-dive-section");
    if (deepDiveEl) {
      deepDiveEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen flex selection:bg-primary-container selection:text-on-primary-container">
      {/* Stitch Anchored Left Side Navigation Bar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenMemories={() => setMemoriesOpen(true)}
        onOpenAlerts={() => {
          setPrefillAlertTicker(undefined);
          setAlertsOpen(true);
        }}
        onOpenBrokerUpload={() => setBrokerUploadOpen(true)}
        onOpenAcademy={() => setAcademyOpen(true)}
      />

      {/* Main Application Wrapper (Padded left for sidebar) */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Stitch Anchored Top Navigation Bar */}
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
          onSelectStock={handleSelectStockFromNav}
          currentUser={currentUser}
          onOpenAuth={() => setAuthModalOpen(true)}
          onOpenBrokerUpload={() => setBrokerUploadOpen(true)}
          onOpenAcademy={() => setAcademyOpen(true)}
          onLogout={handleLogout}
        />

        {/* Floating Toast Notification */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-stitch-lg text-xs max-w-md animate-in fade-in slide-in-from-bottom-3 duration-200">
            {toast.type === "success" ? (
              <CheckCircle className="w-4 h-4 text-gain flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-error flex-shrink-0" />
            )}
            <span className="text-on-surface font-semibold flex-1">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="text-outline hover:text-on-surface p-0.5 rounded-md"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Stitch Main Content Canvas */}
        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-[1600px] w-full mx-auto">
          {/* Executive Summary Metric Banner */}
          <PortfolioSummary analytics={analytics} loading={loading} />

          {/* Main Layout Grid (Split 65% / 35%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (65% width: 8 cols in 12-col grid) */}
            <div className="lg:col-span-8 space-y-6">
              {/* 1. Interactive Portfolio Performance Chart Card */}
              <PortfolioPerformanceCurve analytics={analytics} />

              {/* 2. Holdings & Assets Table Card */}
              <HoldingsTable
                holdings={analytics?.holdings || []}
                onAddHolding={handleAddHolding}
                onDeleteHolding={handleDeleteHolding}
                onAskAI={handleAskAI}
                onOpenBrokerUpload={() => setBrokerUploadOpen(true)}
              />

              {/* 3. Lower Analytics Row: Sector Allocation & AI Rebalancing Engine */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SectorChart
                  sectors={analytics?.sectors || {}}
                  diversificationScore={analytics?.diversification_score || 0}
                />
                <AIRebalancingCard onAskAI={handleAskAI} />
              </div>
            </div>

            {/* Right Column (35% width: 4 cols in 12-col grid) - FinSight AI Co-Pilot Panel */}
            <div className="lg:col-span-4 lg:sticky lg:top-20">
              <AIChatPanel
                initialPrompt={aiPrompt}
                onClearInitialPrompt={() => setAiPrompt(undefined)}
              />
            </div>
          </div>

          {/* NSE Stock Deep Dive & Valuation Explorer */}
          <div className="pt-2">
            <StockDeepDive
              onAskAI={handleAskAI}
              onOpenAlert={handleOpenAlert}
              externalTicker={selectedDeepDiveTicker}
            />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-outline-variant/30 bg-surface-container-low/40 py-6 px-8 text-center text-xs text-on-surface-variant">
          <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-semibold text-on-surface">
              FinSight Intelligence Enterprise v4.2 • Powered by Stitch Design System
            </p>
            <p className="text-[11px] text-outline font-medium">
              Institutional quantitative analytics &amp; portfolio risk modeling
            </p>
          </div>
        </footer>
      </div>

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

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <BrokerUploadModal
        isOpen={brokerUploadOpen}
        onClose={() => setBrokerUploadOpen(false)}
        onImportSuccess={handleImportSuccess}
      />

      <StockMarketAcademyModal
        isOpen={academyOpen}
        onClose={() => setAcademyOpen(false)}
        onCompleted={handleAcademyCompleted}
      />

      <OnboardingChoiceModal
        isOpen={onboardingChoiceOpen}
        onClose={() => setOnboardingChoiceOpen(false)}
        user={currentUser}
        onChooseUpload={() => setBrokerUploadOpen(true)}
        onChooseTutorial={() => setAcademyOpen(true)}
      />
    </div>
  );
}

export default App;
