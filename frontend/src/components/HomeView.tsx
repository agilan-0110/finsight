import React from "react";
import type { User, UserProfile, PortfolioAnalytics } from "../api/client";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
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
  onAskAI: _onAskAI,
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
  // STATE A: NEW USER ONBOARDING (Clean, minimal, peaceful)
  // =========================================================================
  if (!isOnboarded) {
    return (
      <div className="max-w-[760px] mx-auto py-8 sm:py-14 animate-in fade-in duration-200">
        <div className="bg-surface rounded-2xl p-8 sm:p-12 border border-outline-variant/60 shadow-stitch text-center space-y-6">
          <div className="w-12 h-12 rounded-xl bg-surface-container-low border border-outline-variant/60 text-primary mx-auto flex items-center justify-center text-xl">
            🌱
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h1 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Welcome to FinSight, {userName}
            </h1>
            <p className="text-sm text-secondary leading-relaxed">
              A calm space to understand your investments before putting hard-earned money at risk.
              No trading noise, no stock tips — just steady clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
            <div className="p-4 rounded-xl bg-surface border border-outline-variant/40 space-y-1">
              <p className="font-semibold text-xs text-on-surface">Zero Jargon</p>
              <p className="text-[11px] text-secondary">Explained in simple, everyday real-life analogies.</p>
            </div>
            <div className="p-4 rounded-xl bg-surface border border-outline-variant/40 space-y-1">
              <p className="font-semibold text-xs text-on-surface">Any Budget</p>
              <p className="text-[11px] text-secondary">Learn to allocate from ₹500 to ₹5,000/month.</p>
            </div>
            <div className="p-4 rounded-xl bg-surface border border-outline-variant/40 space-y-1">
              <p className="font-semibold text-xs text-on-surface">Safety First</p>
              <p className="text-[11px] text-secondary">Understand how market dips work before investing.</p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onStartOnboarding}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-primary hover:bg-primary-dim text-on-primary font-semibold text-xs shadow-stitch-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Build My 2-Minute Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onOpenBrokerUpload}
              className="w-full sm:w-auto px-5 py-3 rounded-lg border border-outline-variant/60 hover:bg-surface-container-low text-on-surface text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <UploadCloud className="w-4 h-4 text-secondary" />
              <span>Connect Existing Portfolio</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // STATE B: RETURNING USER (Stitch "Quiet Prudence" Minimalist Layout)
  // =========================================================================
  return (
    <div className="max-w-[1080px] mx-auto space-y-8 py-4 sm:py-6 animate-in fade-in duration-200">
      {/* 1. Header & Welcome */}
      <section className="space-y-1">
        <h1 className="font-headline text-2xl font-bold text-on-surface tracking-tight">
          Good morning, {userName}
        </h1>
        <p className="text-sm text-secondary">
          You are on track. 3-minute lesson remaining in{" "}
          <span className="text-on-surface font-semibold">Step 2: Understanding Risk</span>.
        </p>
      </section>

      {/* 2. Primary Focus Hero ('The One Next Step') */}
      <section className="bg-surface border border-outline-variant/60 rounded-2xl p-6 sm:p-8 relative overflow-hidden transition-all duration-200 hover:border-outline-variant shadow-stitch-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            {/* Tag / Category */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-surface-container-low border border-outline-variant/40">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              <span className="text-[11px] font-semibold tracking-wider text-primary uppercase">
                Next Lesson
              </span>
            </div>

            {/* Title */}
            <h2 className="font-headline text-xl sm:text-2xl font-bold text-on-surface tracking-tight">
              Why Markets Drop (and why it is normal)
            </h2>

            {/* Meta Row */}
            <p className="text-xs text-secondary flex flex-wrap items-center gap-2">
              <span>Lesson 2 of 5</span>
              <span className="text-outline-variant">•</span>
              <span>3 min read</span>
              <span className="text-outline-variant">•</span>
              <span>Beginner friendly</span>
            </p>
          </div>

          {/* Clean Action CTA */}
          <div className="flex items-center self-start md:self-center">
            <button
              onClick={() => onNavigateTab("learn")}
              className="inline-flex items-center gap-2 bg-on-surface text-surface hover:bg-primary hover:text-on-primary transition-all duration-150 px-5 py-2.5 rounded-lg text-xs font-semibold tracking-tight shadow-stitch-sm"
            >
              <span>Read Lesson</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Educational Accent Bar */}
        <div className="mt-5 pt-3.5 border-t border-outline-variant/40 flex items-start gap-3 bg-surface-container-low/50 p-3 rounded-xl border border-outline-variant/30">
          <div className="w-0.5 h-4 bg-primary shrink-0 mt-0.5"></div>
          <p className="text-xs text-secondary">
            <strong className="text-on-surface font-semibold">Core takeaway:</strong> Market corrections are historical features of wealth compounding, not systematic errors.
          </p>
        </div>
      </section>

      {/* 3. 3 Quiet Metrics (Hairline dividers, borderless minimal row) */}
      <section className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-outline-variant/50 bg-surface border border-outline-variant/60 rounded-2xl overflow-hidden shadow-stitch-sm">
        {/* Metric 1: Monthly Target */}
        <div className="p-6 flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-secondary tracking-wide uppercase">
              Target for {goalTitle}
            </span>
            <div className="font-headline text-xl font-bold text-on-surface tracking-tight">
              ₹{monthlyGoal.toLocaleString("en-IN")}{" "}
              <span className="text-xs text-secondary font-normal">/ month</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Disciplined monthly pacing</span>
          </div>
        </div>

        {/* Metric 2: Risk Comfort */}
        <div className="p-6 flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-secondary tracking-wide uppercase">
              Risk Comfort
            </span>
            <div className="font-headline text-xl font-bold text-on-surface tracking-tight">
              {userProfile?.risk_reaction === "sell"
                ? "Conservative"
                : userProfile?.risk_reaction === "fluctuate_comfortable"
                ? "Growth-Oriented"
                : "Moderate"}
            </div>
          </div>
          <p className="text-xs text-secondary">
            Comfortable with small dips for long-term growth
          </p>
        </div>

        {/* Metric 3: Curriculum Progress */}
        <div className="p-6 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-secondary tracking-wide uppercase">
                Foundation Curriculum
              </span>
              <span className="text-xs font-bold text-on-surface">40%</span>
            </div>
            <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: "40%" }}></div>
            </div>
          </div>
          <div className="text-xs text-secondary flex items-center justify-between">
            <span>2 of 5 lessons completed</span>
            <button
              onClick={() => onNavigateTab("learn")}
              className="text-primary hover:underline text-xs font-semibold"
            >
              View Academy
            </button>
          </div>
        </div>
      </section>

      {/* 4. Modular Quick Navigation (2x2 Clean Grid, Hairline Border, Soft Hover) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-headline text-sm font-bold text-on-surface">
            Explore Core Capabilities
          </h3>
          <span className="text-[11px] text-secondary font-medium">Self-paced &amp; ad-free</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Module 1: Explore Assets */}
          <div
            onClick={() => onNavigateTab("explore")}
            className="group block p-5 bg-surface border border-outline-variant/60 rounded-2xl hover:border-outline-variant transition-all duration-150 cursor-pointer shadow-stitch-sm"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <Search className="w-4 h-4" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-headline text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                    Explore Investment Options
                  </h4>
                  <ArrowUpRight className="w-4 h-4 text-secondary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <p className="text-xs text-secondary leading-relaxed">
                  Understand Index Funds, FDs, Gold, and Bonds without jargon or promotional bias.
                </p>
              </div>
            </div>
          </div>

          {/* Module 2: Plan Savings */}
          <div
            onClick={() => onNavigateTab("plan")}
            className="group block p-5 bg-surface border border-outline-variant/60 rounded-2xl hover:border-outline-variant transition-all duration-150 cursor-pointer shadow-stitch-sm"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-headline text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                    Plan Your Savings
                  </h4>
                  <ArrowUpRight className="w-4 h-4 text-secondary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <p className="text-xs text-secondary leading-relaxed">
                  See how monthly contributions compound over 5–10 years with interactive sliders.
                </p>
              </div>
            </div>
          </div>

          {/* Module 3: Ask AI */}
          <div
            onClick={() => onNavigateTab("assistant")}
            className="group block p-5 bg-surface border border-outline-variant/60 rounded-2xl hover:border-outline-variant transition-all duration-150 cursor-pointer shadow-stitch-sm"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-headline text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                    Ask FinSight AI Tutor
                  </h4>
                  <ArrowUpRight className="w-4 h-4 text-secondary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <p className="text-xs text-secondary leading-relaxed">
                  Ask any financial question in plain everyday English with verified historical citations.
                </p>
              </div>
            </div>
          </div>

          {/* Module 4: My Portfolio */}
          <div
            onClick={() => onNavigateTab("portfolio")}
            className="group block p-5 bg-surface border border-outline-variant/60 rounded-2xl hover:border-outline-variant transition-all duration-150 cursor-pointer shadow-stitch-sm"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <PieChart className="w-4 h-4" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-headline text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                    My Portfolio
                  </h4>
                  <ArrowUpRight className="w-4 h-4 text-secondary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <p className="text-xs text-secondary leading-relaxed">
                  {holdingsCount > 0
                    ? `Tracking ${holdingsCount} positions (₹${totalPortfolioValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}). View asset allocation.`
                    : "Track simulated holdings, asset allocation health, and diversification."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Minimalist Quick Action Strip */}
      <div className="p-4 rounded-xl bg-surface border border-outline-variant/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-stitch-sm">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-primary shrink-0" />
          <p className="text-secondary">
            <strong className="text-on-surface font-semibold">Your Profile:</strong> {goalTitle} • Target ₹{monthlyGoal.toLocaleString("en-IN")}/mo
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onStartOnboarding}
            className="text-secondary hover:text-on-surface font-medium hover:underline text-xs"
          >
            Adjust Profile
          </button>
          <span className="text-outline-variant">•</span>
          <button
            onClick={onOpenBrokerUpload}
            className="text-primary hover:underline font-semibold text-xs flex items-center gap-1"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload Broker Statement</span>
          </button>
        </div>
      </div>
    </div>
  );
};
