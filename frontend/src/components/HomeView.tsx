import React from "react";
import type { User, UserProfile, PortfolioAnalytics } from "../api/client";
import {
  ArrowRight,
  BookOpen,
  Compass,
  PieChart,
  Search,
  MessageSquare,
  TrendingUp,
  UploadCloud,
} from "lucide-react";

interface HomeViewProps {
  currentUser: User | null;
  userProfile: UserProfile | null;
  analytics: PortfolioAnalytics | null;
  onStartOnboarding: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenBrokerUpload: () => void;
  onAskAI: (prompt: string) => void;
  onOpenExplain?: (termKey: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentUser,
  userProfile,
  analytics,
  onStartOnboarding,
  onNavigateTab,
  onOpenBrokerUpload,
  onAskAI,
}) => {
  const userName = currentUser?.full_name?.split(" ")[0] || "Friend";
  const isOnboarded = userProfile?.onboarding_completed ?? false;

  const monthlyGoal = userProfile?.monthly_investment || 2000;
  const goalLabels: Record<string, string> = {
    wealth: "Long-term Wealth",
    retirement: "Retirement Freedom",
    education: "Higher Education",
    purchase: "Major Life Purchase",
    income: "Regular Income",
    safety: "Emergency Shield",
    unsure: "Exploring Options",
  };
  const goalTitle = goalLabels[userProfile?.primary_goal || "wealth"] || "Long-term Wealth";

  const totalPortfolioValue = analytics?.total_current_value || 0;
  const holdingsCount = analytics?.holdings_count || 0;

  // =========================================================================
  // STATE A: NEW USER ONBOARDING WELCOME (Clean, zero clutter)
  // =========================================================================
  if (!isOnboarded) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 py-6 sm:py-10 animate-in fade-in duration-200">
        <div className="bg-surface rounded-3xl p-8 sm:p-10 border border-outline-variant/60 shadow-stitch text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary mx-auto flex items-center justify-center text-2xl shadow-xs">
            🌱
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
              Welcome to FinSight, {userName}!
            </h1>
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
              We help you understand investment options before putting money at risk.
              No trading jargon, no stock tips — just steady confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto text-left pt-2">
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-1">
              <span className="text-base">🎓</span>
              <p className="font-bold text-xs text-on-surface">Zero Finance Background</p>
              <p className="text-[11px] text-on-surface-variant">Explained in simple everyday analogies.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-1">
              <span className="text-base">💰</span>
              <p className="font-bold text-xs text-on-surface">Any Budget Friendly</p>
              <p className="text-[11px] text-on-surface-variant">Start learning with ₹500 to ₹5,000/month.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-1">
              <span className="text-base">🛡️</span>
              <p className="font-bold text-xs text-on-surface">Understand Risk First</p>
              <p className="text-[11px] text-on-surface-variant">Know how to protect your hard-earned savings.</p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onStartOnboarding}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-primary hover:bg-primary-dim text-on-primary font-headline font-bold text-sm shadow-stitch transition-all flex items-center justify-center gap-2"
            >
              <span>Build My 2-Minute Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onOpenBrokerUpload}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-outline-variant/60 hover:bg-surface-container-low text-on-surface text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <UploadCloud className="w-4 h-4 text-primary" />
              <span>Connect Existing Portfolio</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // STATE B: RETURNING USER (Clean, spacious, 4 clear focal areas)
  // =========================================================================
  return (
    <div className="max-w-5xl mx-auto space-y-6 py-2 sm:py-4 animate-in fade-in duration-200 font-body">
      {/* 1. TOP HEADER & GREETING */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Welcome back, {userName} 👋
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Here is your financial snapshot and your next step today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onStartOnboarding}
            className="px-3.5 py-1.5 rounded-xl border border-outline-variant/60 hover:bg-surface-container-low text-on-surface text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="Edit your financial profile and goals"
          >
            <Compass className="w-3.5 h-3.5 text-primary" />
            <span>Edit Profile</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab("learn")}
            className="px-4 py-1.5 rounded-xl bg-primary hover:bg-primary-dim text-on-primary text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Continue Lesson</span>
          </button>
        </div>
      </div>

      {/* 2. THE THREE CORE CARDS (Profile, Learning Progress, Portfolio Snapshot) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card A: Financial DNA */}
        <div className="p-5 rounded-2xl bg-surface border border-outline-variant/60 shadow-stitch flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5 font-headline">
              <Compass className="w-3.5 h-3.5" />
              Your Investment Profile
            </span>
            <div className="font-headline font-bold text-base text-on-surface">
              {goalTitle}
            </div>
            <p className="text-xs text-on-surface-variant">
              Investing target: <strong className="text-on-surface">₹{monthlyGoal.toLocaleString("en-IN")}/mo</strong>
            </p>
          </div>

          <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between text-[11px]">
            <span className="text-on-surface-variant">Risk Understanding:</span>
            <span className="font-bold text-primary capitalize">
              {userProfile?.risk_reaction === "sell"
                ? "Conservative"
                : userProfile?.risk_reaction === "fluctuate_comfortable"
                ? "Growth-Oriented"
                : "Moderate"}
            </span>
          </div>
        </div>

        {/* Card B: Next Action / Active Lesson */}
        <div className="p-5 rounded-2xl bg-surface border-2 border-primary/40 shadow-stitch flex flex-col justify-between space-y-3 relative">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5 font-headline">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Next Step
              </span>
              <span className="text-[11px] font-bold text-primary">Lesson 2</span>
            </div>
            <div className="font-headline font-bold text-base text-on-surface">
              Understanding Risk &amp; Dips
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Why market declines are normal seasonal discounts, not disasters.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab("learn")}
            className="w-full py-2 px-3 rounded-xl bg-primary hover:bg-primary-dim text-on-primary font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <span>Resume 3-Min Lesson</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card C: Portfolio Overview */}
        <div className="p-5 rounded-2xl bg-surface border border-outline-variant/60 shadow-stitch flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5 font-headline">
              <PieChart className="w-3.5 h-3.5 text-primary" />
              Portfolio Health
            </span>
            <div className="font-headline font-bold text-base text-on-surface">
              {holdingsCount > 0 ? (
                <span>₹{totalPortfolioValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
              ) : (
                <span className="text-on-surface-variant text-sm font-normal">Ready to Start</span>
              )}
            </div>
            <p className="text-xs text-on-surface-variant">
              {holdingsCount > 0
                ? `${holdingsCount} active positions tracked`
                : "No holdings imported yet. Learn before investing."}
            </p>
          </div>

          <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between">
            <span className="text-[11px] text-on-surface-variant">
              {holdingsCount > 0 ? "Diversification:" : "Status:"}
            </span>
            <button
              onClick={() => onNavigateTab("portfolio")}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5"
            >
              <span>{holdingsCount > 0 ? "View Details" : "Track Portfolio"}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. QUICK JUMP GATEWAYS (3 clean, non-intrusive cards) */}
      <div className="space-y-3 pt-2">
        <h2 className="font-headline text-sm font-bold text-on-surface uppercase tracking-wider">
          Explore FinSight
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Hub 1: Explore Assets */}
          <div
            onClick={() => onNavigateTab("explore")}
            className="p-5 rounded-2xl bg-surface border border-outline-variant/50 hover:border-primary/50 shadow-stitch-sm hover:shadow-stitch cursor-pointer transition-all space-y-2 group"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Search className="w-4 h-4" />
            </div>
            <h3 className="font-headline font-bold text-sm text-on-surface group-hover:text-primary transition-colors flex items-center justify-between">
              <span>Investment Options</span>
              <ArrowRight className="w-3.5 h-3.5 text-outline group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Understand Fixed Deposits, Nifty Index Funds, Sovereign Gold, and Bonds with plain analogies.
            </p>
          </div>

          {/* Hub 2: Goal Simulator */}
          <div
            onClick={() => onNavigateTab("plan")}
            className="p-5 rounded-2xl bg-surface border border-outline-variant/50 hover:border-primary/50 shadow-stitch-sm hover:shadow-stitch cursor-pointer transition-all space-y-2 group"
          >
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="font-headline font-bold text-sm text-on-surface group-hover:text-primary transition-colors flex items-center justify-between">
              <span>Plan &amp; Simulate Goals</span>
              <ArrowRight className="w-3.5 h-3.5 text-outline group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              See how regular ₹{monthlyGoal.toLocaleString("en-IN")}/month compounding grows into ₹10+ Lakh.
            </p>
          </div>

          {/* Hub 3: AI Financial Tutor */}
          <div
            onClick={() => onNavigateTab("assistant")}
            className="p-5 rounded-2xl bg-surface border border-outline-variant/50 hover:border-primary/50 shadow-stitch-sm hover:shadow-stitch cursor-pointer transition-all space-y-2 group"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-primary flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h3 className="font-headline font-bold text-sm text-on-surface group-hover:text-primary transition-colors flex items-center justify-between">
              <span>Ask AI Tutor</span>
              <ArrowRight className="w-3.5 h-3.5 text-outline group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Have a doubt? Ask about inflation, mutual funds, or how profits work in plain English.
            </p>
          </div>
        </div>
      </div>

      {/* 4. COMPACT MINDFUL FINANCE TIP */}
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 flex items-center justify-between gap-3 text-xs text-on-surface">
        <div className="flex items-center gap-2.5">
          <span className="text-base">💡</span>
          <p className="text-on-surface-variant">
            <strong className="text-on-surface">Beginner Rule:</strong> Building wealth is not about timing the market; it is about steady patience and time in the market.
          </p>
        </div>
        <button
          onClick={() => onAskAI("What does 'Time in the market beats timing the market' mean?")}
          className="text-primary hover:underline font-bold text-[11px] whitespace-nowrap hidden sm:inline"
        >
          Ask AI Tutor Why →
        </button>
      </div>
    </div>
  );
};
