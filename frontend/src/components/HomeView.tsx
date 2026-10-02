import React from "react";
import type { User, UserProfile, PortfolioAnalytics } from "../api/client";
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Compass,
  TrendingUp,
  Shield,
  UploadCloud,
  ChevronRight,
  GraduationCap,
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
  onOpenExplain: _onOpenExplain,
}) => {
  const isOnboarded = userProfile?.onboarding_completed || false;

  // New User Adaptive Landing View
  if (!isOnboarded) {
    return (
      <div className="space-y-8 animate-in fade-in duration-200">
        {/* Hero Welcome Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-primary/10 via-surface-container-low to-surface-container-lowest border border-primary/20 shadow-stitch relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 text-primary font-label text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FinSight Beginner Companion</span>
            </div>
            <h1 className="font-headline text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight leading-tight">
              Welcome to FinSight, {currentUser?.full_name?.split(" ")[0] || "Friend"} 👋
            </h1>
            <p className="font-body text-sm sm:text-base text-on-surface-variant leading-relaxed">
              We help beginners and young investors understand their options <em>before</em> they invest.
              No complex trading jargon, no high-risk stock tips—just clear, step-by-step financial clarity.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                type="button"
                onClick={onStartOnboarding}
                className="px-6 py-3.5 rounded-xl bg-primary text-on-primary font-headline text-sm font-bold shadow-stitch hover:opacity-95 transition-all flex items-center gap-2"
              >
                <span>Start My Investment Journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenBrokerUpload}
                className="px-5 py-3.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label text-xs font-semibold transition-all border border-outline-variant/40 flex items-center gap-2"
              >
                <UploadCloud className="w-4 h-4 text-primary" />
                <span>Already have investments? Connect Portfolio</span>
              </button>
            </div>
          </div>
        </div>

        {/* The 6-Step Investment Journey Roadmap */}
        <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline text-base font-bold text-on-surface">
                Your Investment Journey
              </h2>
              <p className="font-body text-xs text-on-surface-variant">
                Master the fundamental steps from money basics to tracking your first portfolio.
              </p>
            </div>
            <span className="font-label text-xs text-primary font-semibold">
              Step 1 of 6
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-2">
            {[
              { num: "①", title: "Understand Money", desc: "Saving vs. Investing & Inflation", tab: "learn" },
              { num: "②", title: "Learn Investments", desc: "Index funds, Stocks, FDs & Gold", tab: "explore" },
              { num: "③", title: "Understand Risk", desc: "Volatility & Behavioral reactions", tab: "learn" },
              { num: "④", title: "Explore Options", desc: "Compare products side-by-side", tab: "explore" },
              { num: "⑤", title: "Build a Plan", desc: "SIP & Goal calculators", tab: "plan" },
              { num: "⑥", title: "Track Portfolio", desc: "Monitor diversification & health", tab: "portfolio" },
            ].map((step, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onNavigateTab(step.tab)}
                className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container-low/50 hover:bg-surface-container hover:border-primary/40 text-left transition-all group flex flex-col justify-between"
              >
                <div>
                  <span className="font-headline text-lg font-bold text-primary block mb-1">
                    {step.num}
                  </span>
                  <span className="font-headline font-bold text-xs text-on-surface block group-hover:text-primary transition-colors">
                    {step.title}
                  </span>
                  <span className="font-body text-[11px] text-on-surface-variant block mt-1">
                    {step.desc}
                  </span>
                </div>
                <div className="mt-3 flex items-center text-[10px] font-label font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                  <span>Explore</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Question / Concept Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="font-headline font-bold text-sm text-on-surface">
              What is an Index Fund?
            </h3>
            <p className="font-body text-xs text-on-surface-variant">
              The simplest way to own India's top 50 companies for as little as ₹100/month.
            </p>
            <button
              onClick={() => onNavigateTab("explore")}
              className="font-label text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline pt-2"
            >
              <span>Learn about Index Funds</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="font-headline font-bold text-sm text-on-surface">
              The Power of Compounding
            </h3>
            <p className="font-body text-xs text-on-surface-variant">
              See how ₹2,000/month can grow into ₹20 lakh over 20 years at historical returns.
            </p>
            <button
              onClick={() => onNavigateTab("plan")}
              className="font-label text-xs font-semibold text-secondary inline-flex items-center gap-1 hover:underline pt-2"
            >
              <span>Try Compound Calculator</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-headline font-bold text-sm text-on-surface">
              Ask AI Financial Tutor
            </h3>
            <p className="font-body text-xs text-on-surface-variant">
              Have a financial question? Get gentle, jargon-free explanations anytime.
            </p>
            <button
              onClick={() => onAskAI("I'm completely new to investing. What should I understand first before putting money anywhere?")}
              className="font-label text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline pt-2"
            >
              <span>Ask AI Tutor</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Returning / Onboarded User Dashboard
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Personalized Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-headline text-2xl font-bold text-on-surface">
              Welcome back, {currentUser?.full_name?.split(" ")[0]} 👋
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label text-xs font-semibold">
              On Track
            </span>
          </div>
          <p className="font-body text-xs text-on-surface-variant">
            Here is your daily snapshot of learning progress, portfolio health, and investment options.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onStartOnboarding}
            className="px-3.5 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low hover:bg-surface-container text-on-surface font-label text-xs font-semibold transition-colors"
          >
            Update Profile
          </button>
          <button
            onClick={() => onNavigateTab("learn")}
            className="px-4 py-2 rounded-xl bg-primary text-on-primary font-label text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Continue Learning</span>
          </button>
        </div>
      </div>

      {/* Top 3-Card Summary: Profile Snapshot, Portfolio Health, Next Lesson */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Investor Profile Card */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-label text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Your FinSight Profile</span>
            </span>
            <button
              onClick={onStartOnboarding}
              className="text-[11px] font-label text-outline hover:text-primary"
            >
              Edit
            </button>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">Experience</span>
              <span className="font-semibold text-on-surface capitalize">
                {userProfile?.experience_level?.replace("_", " ") || "Beginner"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">Primary Goal</span>
              <span className="font-semibold text-on-surface capitalize">
                {userProfile?.primary_goal?.replace("_", " ") || "Long-term Wealth"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">Time Horizon</span>
              <span className="font-semibold text-on-surface">
                {userProfile?.time_horizon || "5-10 yrs"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">Monthly Target</span>
              <span className="font-semibold text-on-surface font-mono">
                ₹{userProfile?.monthly_investment?.toLocaleString("en-IN") || "2,000"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">Risk Attitude</span>
              <span className="font-semibold text-on-surface capitalize">
                {userProfile?.risk_reaction === "sell"
                  ? "Conservative"
                  : userProfile?.risk_reaction === "fluctuate_comfortable"
                  ? "Growth-oriented"
                  : "Moderate"}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Portfolio Health Snapshot */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-label text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Portfolio Health</span>
            </span>
            <button
              onClick={() => onNavigateTab("portfolio")}
              className="text-[11px] font-label text-outline hover:text-secondary flex items-center gap-0.5"
            >
              <span>View</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {analytics && analytics.holdings_count > 0 ? (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">Current Value</span>
                <span className="font-headline font-bold text-on-surface font-mono">
                  ₹{analytics.total_current_value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">Net Return</span>
                <span className={`font-mono font-bold ${analytics.total_pnl >= 0 ? "text-gain" : "text-error"}`}>
                  {analytics.total_pnl >= 0 ? "+" : ""}₹{analytics.total_pnl.toLocaleString("en-IN", { maximumFractionDigits: 0 })} ({analytics.total_pnl_percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">Diversification</span>
                <span className="font-label font-bold text-primary">
                  {analytics.diversification_score}/100
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">Positions Owned</span>
                <span className="font-semibold text-on-surface">
                  {analytics.holdings_count} Assets
                </span>
              </div>
            </div>
          ) : (
            <div className="py-2 text-center space-y-2">
              <p className="font-body text-xs text-on-surface-variant">
                No active portfolio connected yet.
              </p>
              <button
                onClick={onOpenBrokerUpload}
                className="w-full py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label text-xs font-semibold transition-colors"
              >
                Import Broker Statement
              </button>
            </div>
          )}
        </div>

        {/* 3. Learn Next Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-surface-container-lowest border border-primary/20 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-1.5">
            <span className="font-label text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Recommended Next Lesson</span>
            </span>
            <h4 className="font-headline font-bold text-sm text-on-surface">
              Demystifying NIFTY 50 & SENSEX Benchmarks
            </h4>
            <p className="font-body text-xs text-on-surface-variant leading-relaxed">
              Understand what news anchors mean when they say the market is up 200 points.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab("learn")}
            className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-label text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
          >
            <span>Start 4-Min Lesson</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Explore Section */}
      <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-headline font-bold text-base text-on-surface">
              Explore Investment Categories
            </h3>
            <p className="font-body text-xs text-on-surface-variant">
              Understand how different investment products work before putting your capital to work.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab("explore")}
            className="font-label text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>View All 10 Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { name: "Index Funds", icon: "🧺", tag: "Low cost" },
            { name: "Stocks", icon: "📈", tag: "Ownership" },
            { name: "Mutual Funds", icon: "📊", tag: "Managed" },
            { name: "Fixed Deposits", icon: "🏦", tag: "Guaranteed" },
            { name: "Gold", icon: "🥇", tag: "Hedge" },
            { name: "Govt Bonds", icon: "🏛", tag: "Sovereign" },
          ].map((cat, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onNavigateTab("explore")}
              className="p-3.5 rounded-xl border border-outline-variant/30 bg-surface-container-low hover:border-primary/50 text-left transition-all group"
            >
              <span className="text-xl block mb-1">{cat.icon}</span>
              <span className="font-headline font-bold text-xs text-on-surface block group-hover:text-primary transition-colors">
                {cat.name}
              </span>
              <span className="font-label text-[10px] text-on-surface-variant block mt-0.5">
                {cat.tag}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Instant AI Questions Bar */}
      <div className="p-5 rounded-2xl bg-surface-container-low/60 border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="font-headline font-bold text-xs text-on-surface">
            Ask FinSight AI Assistant:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            "Explain P/E ratio simply",
            "Why is diversification important?",
            "Index Fund vs FD for 5 years",
          ].map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onAskAI(q)}
              className="px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/40 hover:border-primary text-on-surface font-body text-xs transition-colors"
            >
              "{q}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
