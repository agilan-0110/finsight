import { useState, useEffect, useCallback } from "react";
import {
  api,
  authStorage,
  type PortfolioAnalytics,
  type User,
  type UserProfile,
} from "./api/client";
import { LandingPage } from "./components/LandingPage";
import { Navbar } from "./components/Navbar";
import { HomeView } from "./components/HomeView";
import { ExploreView } from "./components/ExploreView";
import { LearnView } from "./components/LearnView";
import { PortfolioView } from "./components/PortfolioView";
import { PlanView } from "./components/PlanView";
import { AIChatPanel } from "./components/AIChatPanel";
import { AlertsModal } from "./components/AlertsModal";
import { MemoriesModal } from "./components/MemoriesModal";
import { AuthModal } from "./components/AuthModal";
import { BrokerUploadModal } from "./components/BrokerUploadModal";
import { StockMarketAcademyModal } from "./components/StockMarketAcademyModal";
import { OnboardingChoiceModal } from "./components/OnboardingChoiceModal";
import { OnboardingModal } from "./components/OnboardingModal";
import { ExplainModal } from "./components/ExplainModal";
import { CheckCircle, AlertTriangle, X } from "lucide-react";

export function App() {
  const [analytics, setAnalytics] = useState<PortfolioAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSendingDigest, setIsSendingDigest] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // User state & Profile
  const [currentUser, setCurrentUser] = useState<User | null>(authStorage.getUser());
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Navigation State (6 Primary Sections)
  const [activeTab, setActiveTab] = useState<string>("home");

  // Modals state
  const [alertsOpen, setAlertsOpen] = useState<boolean>(false);
  const [memoriesOpen, setMemoriesOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [brokerUploadOpen, setBrokerUploadOpen] = useState<boolean>(false);
  const [academyOpen, setAcademyOpen] = useState<boolean>(false);
  const [onboardingChoiceOpen, setOnboardingChoiceOpen] = useState<boolean>(false);
  const [onboardingModalOpen, setOnboardingModalOpen] = useState<boolean>(false);

  // Universal Explainer Modal
  const [explainOpen, setExplainOpen] = useState<boolean>(false);
  const [explainTermKey, setExplainTermKey] = useState<string>("pe_ratio");

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
        api.getAnalytics().catch(() => null),
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

  const loadProfile = useCallback(async () => {
    try {
      const profile = await api.getProfile();
      setUserProfile(profile);
      return profile;
    } catch {
      setUserProfile(null);
      return null;
    }
  }, []);

  // Fetch logged in profile if token exists
  useEffect(() => {
    const token = authStorage.getToken();
    if (token) {
      api.getMe()
        .then((user) => {
          setCurrentUser(user);
          loadData(false);
          loadProfile();
        })
        .catch(() => {
          authStorage.clear();
          setCurrentUser(null);
        });
    } else {
      setCurrentUser(null);
    }
  }, [loadData, loadProfile]);

  // Periodic refresh when user is logged in
  useEffect(() => {
    if (!currentUser) return;
    loadData(true);
    const interval = setInterval(() => {
      loadData(true);
    }, 30000);
    return () => clearInterval(interval);
  }, [currentUser, loadData]);

  const handleAuthSuccess = async (user: User, isNewUser: boolean) => {
    setCurrentUser(user);
    showToast(`Welcome ${user.full_name}! Account active.`);
    loadData(false);
    const p = await loadProfile();
    if (isNewUser || !p?.onboarding_completed) {
      setOnboardingModalOpen(true);
    }
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setUserProfile(null);
    setAnalytics(null);
    showToast("Signed out successfully.");
  };

  const handleImportSuccess = (count: number) => {
    showToast(`Successfully imported ${count} positions into your portfolio!`);
    loadData(false);
    setActiveTab("portfolio");
  };

  const handleAcademyCompleted = () => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, tutorial_completed: true });
    }
    showToast("Market Academy preview completed! You're ready to research & invest.");
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

  const handleAskAI = (prompt: string) => {
    setAiPrompt(prompt);
    setActiveTab("assistant");
  };

  const handleOpenAlert = (ticker: string) => {
    setPrefillAlertTicker(ticker);
    setAlertsOpen(true);
  };

  const handleOpenExplain = (termKey: string) => {
    setExplainTermKey(termKey);
    setExplainOpen(true);
  };

  const handleSelectStockFromNav = (ticker: string) => {
    setSelectedDeepDiveTicker(ticker);
    setActiveTab("explore");
  };

  // If user is NOT logged in, show the institutional Landing Page!
  if (!currentUser) {
    return (
      <div className="bg-surface font-body text-on-surface antialiased min-h-screen">
        <LandingPage
          onOpenLogin={() => {
            setAuthMode("login");
            setAuthModalOpen(true);
          }}
          onOpenRegister={() => {
            setAuthMode("register");
            setAuthModalOpen(true);
          }}
          onOpenAcademy={() => setAcademyOpen(true)}
        />

        {/* Auth Modal */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
          initialMode={authMode}
        />

        {/* Stock Market Academy Modal */}
        <StockMarketAcademyModal
          isOpen={academyOpen}
          onClose={() => setAcademyOpen(false)}
          onCompleted={() => showToast("Market Academy preview completed! Sign in to start tracking.")}
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
      </div>
    );
  }

  // Once user IS logged in, render the Private User Companion Dashboard!
  return (
    <div className="bg-background font-body text-on-surface antialiased min-h-screen flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* Top Navigation Bar with Stitch brand sprout and clean hub links */}
      <Navbar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
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
          onOpenAcademy={() => setActiveTab("learn")}
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

        {/* Dynamic 6-Hub Content Canvas (Centered Nordic Restraint) */}
        <main className="flex-1 px-4 sm:px-6 py-6 max-w-[1200px] w-full mx-auto">
          {/* HUB 1: HOME */}
          {activeTab === "home" && (
            <HomeView
              currentUser={currentUser}
              userProfile={userProfile}
              analytics={analytics}
              onStartOnboarding={() => setOnboardingModalOpen(true)}
              onNavigateTab={setActiveTab}
              onOpenBrokerUpload={() => setBrokerUploadOpen(true)}
              onAskAI={handleAskAI}
              onOpenExplain={handleOpenExplain}
            />
          )}

          {/* HUB 2: EXPLORE */}
          {activeTab === "explore" && (
            <ExploreView
              onAskAI={handleAskAI}
              onOpenAlert={handleOpenAlert}
              onOpenExplain={handleOpenExplain}
              selectedTicker={selectedDeepDiveTicker}
            />
          )}

          {/* HUB 3: LEARN (ACADEMY) */}
          {activeTab === "learn" && (
            <LearnView
              onAskAI={handleAskAI}
              onOpenExplain={handleOpenExplain}
            />
          )}

          {/* HUB 4: PORTFOLIO */}
          {activeTab === "portfolio" && (
            <PortfolioView
              analytics={analytics}
              loading={loading}
              onAddHolding={handleAddHolding}
              onDeleteHolding={handleDeleteHolding}
              onAskAI={handleAskAI}
              onOpenBrokerUpload={() => setBrokerUploadOpen(true)}
              onOpenExplain={handleOpenExplain}
            />
          )}

          {/* HUB 5: PLAN */}
          {activeTab === "plan" && (
            <PlanView onAskAI={handleAskAI} />
          )}

          {/* HUB 6: AI ASSISTANT */}
          {activeTab === "assistant" && (
            <div className="max-w-[1080px] mx-auto">
              <AIChatPanel
                fullPageMode={true}
                initialPrompt={aiPrompt}
                onClearInitialPrompt={() => setAiPrompt(undefined)}
                onOpenMemories={() => setMemoriesOpen(true)}
              />
            </div>
          )}
        </main>

        {/* Global Footer (Stitch Quiet Prudence) */}
        <footer className="w-full bg-surface border-t border-outline-variant/40 py-6">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-secondary">
            <div className="flex items-center gap-2">
              <span className="font-bold text-on-surface">FinSight</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
              <span>Investment Learning &amp; Portfolio Companion</span>
            </div>
            <p className="text-[11px] text-secondary">
              Understand before you invest • Zero trading advice • Local AI Memory
            </p>
          </div>
        </footer>

        {/* Global Modals */}
      <OnboardingModal
        isOpen={onboardingModalOpen}
        onClose={() => setOnboardingModalOpen(false)}
        onCompleted={(p) => {
          setUserProfile(p);
          showToast("Investment Profile created! Welcome to your learning journey.");
        }}
      />

      <ExplainModal
        isOpen={explainOpen}
        onClose={() => setExplainOpen(false)}
        termKey={explainTermKey}
        onAskAI={handleAskAI}
      />

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
        initialMode={authMode}
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
