import React, { useState } from "react";
import type { User, UserProfile, PortfolioAnalytics } from "../api/client";
import {
  Sparkles,
  ArrowRight,
  Shield,
  TrendingUp,
  Anchor,
  Landmark,
  CheckCircle2,
  Lock,
  ChevronRight,
  Lightbulb,
  Send,
  HelpCircle,
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
  onStartOnboarding,
  onNavigateTab,
  onOpenBrokerUpload: _onOpenBrokerUpload,
  onAskAI,
  onOpenExplain,
}) => {
  const userName = currentUser?.full_name?.split(" ")[0] || "Friend";
  const monthlyGoal = userProfile?.monthly_investment || 2000;
  const primaryGoal = userProfile?.primary_goal === "retirement" 
    ? "Retirement Freedom"
    : userProfile?.primary_goal === "education"
    ? "Higher Education"
    : userProfile?.primary_goal === "safety"
    ? "Emergency Shield"
    : "Long-term Wealth";

  // Savings Growth Simulator State
  const [monthlySavings, setMonthlySavings] = useState<number>(monthlyGoal);
  const [years, setYears] = useState<number>(7);
  const [aiQuestion, setAiQuestion] = useState<string>("");

  // Compounding calculation (standard 12% equity index benchmark)
  const annualRate = 0.12;
  const monthlyRate = annualRate / 12;
  const months = years * 12;
  const totalInvested = monthlySavings * months;
  const futureValue =
    monthlySavings *
    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
    (1 + monthlyRate);
  const wealthGained = Math.max(0, futureValue - totalInvested);

  const handleAskQuickAI = (promptText: string) => {
    onAskAI(promptText);
  };

  const handleSendCustomQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;
    onAskAI(aiQuestion.trim());
    setAiQuestion("");
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-200 font-body pb-12">
      {/* ========================================================================= */}
      {/* 1. WARM WELCOME HERO & REASSURANCE BANNER                                */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-outline-variant/60 shadow-stitch relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-label text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-secondary" />
                <span>FinSight Companion • Understand Before You Invest</span>
              </div>
              <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
                Good morning, {userName}! 👋
              </h1>
              <p className="font-body text-sm sm:text-base text-on-surface-variant leading-relaxed">
                Ready to grow your money step by step? No rush, no Wall Street jargon — just calm, steady progress.
              </p>
            </div>

            {/* Live Progress Chips */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 bg-tertiary-container/50 border border-tertiary/30 px-3.5 py-1.5 rounded-full text-tertiary-dim text-xs font-bold shadow-xs">
                <span>3 Days 🔥</span>
                <span className="text-on-surface-variant font-normal">Streak</span>
              </div>

              <div className="flex items-center gap-1.5 bg-surface-container-low border border-outline-variant/60 px-3.5 py-1.5 rounded-full text-primary text-xs font-bold shadow-xs">
                <span>{primaryGoal} 🎯</span>
              </div>

              <div className="flex items-center gap-1.5 bg-secondary-container/30 border border-secondary/30 px-3.5 py-1.5 rounded-full text-secondary-dim text-xs font-bold shadow-xs">
                <span>₹{monthlyGoal.toLocaleString("en-IN")} / mo</span>
              </div>

              <button
                type="button"
                onClick={onStartOnboarding}
                className="flex items-center gap-1 bg-surface-container-low hover:bg-surface-container border border-outline-variant/60 px-3 py-1.5 rounded-full text-on-surface-variant hover:text-primary text-xs font-semibold shadow-2xs transition-colors"
                title="Edit your financial goals and risk profile"
              >
                <span>Edit Profile ⚙️</span>
              </button>
            </div>
          </div>

          {/* Calm Reassurance Educational Banner */}
          <div className="mt-6 pt-5 border-t border-outline-variant/40 flex items-start gap-3 bg-surface-container-low/70 rounded-xl p-4">
            <Lightbulb className="w-5 h-5 text-tertiary flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-on-surface">Did you know?</span>
              <p className="text-on-surface-variant leading-relaxed">
                Starting with just <strong>₹500/month in your 20s</strong> can build more wealth than saving <strong>₹5,000/month in your 30s</strong>. In investing, <em>time</em> is your greatest superpower, not how rich you start.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. 'YOUR LEARNING JOURNEY' VISUAL ROADMAP (5 STEPS)                       */}
      {/* ========================================================================= */}
      <section className="bg-surface rounded-2xl p-6 sm:p-7 border border-outline-variant/60 shadow-stitch space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-headline text-lg font-bold text-on-surface flex items-center gap-2">
              <span>Your Investment Journey</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-secondary/10 text-primary">
                Step 2 of 5 Active
              </span>
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Follow this guided roadmap to master investing peacefully without confusion.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab("learn")}
            className="text-xs font-bold text-primary hover:text-primary-dim inline-flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>View FinSight Academy</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 5-Step Milestone Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {/* Step 1: Completed */}
          <div className="p-4 rounded-xl bg-gain-bg/40 border border-gain/20 flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-gain flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Step 1 • Completed
                </span>
              </div>
              <h3 className="font-headline font-bold text-xs text-on-surface">Money Basics</h3>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Emergency funds, inflation &amp; why cash loses value in bank accounts.
              </p>
            </div>
            <span className="text-[10px] font-semibold text-gain bg-gain/10 py-1 px-2 rounded-md self-start">
              100% Mastered ✅
            </span>
          </div>

          {/* Step 2: In Progress (Active) */}
          <div className="p-4 rounded-xl bg-primary/5 border-2 border-primary/40 flex flex-col justify-between space-y-3 relative shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-primary flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  Step 2 • Active
                </span>
                <span className="text-[10px] font-bold text-primary">65%</span>
              </div>
              <h3 className="font-headline font-bold text-xs text-on-surface">Understanding Risk</h3>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Why market dips are normal seasonal discounts, not disasters.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab("learn")}
              className="w-full py-1.5 px-2 bg-primary hover:bg-primary-dim text-on-primary text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1 shadow-2xs"
            >
              <span>Continue 3-min lesson</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Step 3: Next */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 flex flex-col justify-between space-y-3 opacity-90">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-outline flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Step 3 • Next
              </span>
              <h3 className="font-headline font-bold text-xs text-on-surface">Explore Asset Classes</h3>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Stocks vs Index Funds vs Gold vs FDs with everyday real-life analogies.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab("explore")}
              className="text-[11px] text-primary hover:underline font-semibold text-left"
            >
              Preview asset options →
            </button>
          </div>

          {/* Step 4: Upcoming */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between space-y-3 opacity-70">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-outline flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Step 4
              </span>
              <h3 className="font-headline font-bold text-xs text-on-surface">Build Your Plan</h3>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Allocating your ₹{monthlyGoal.toLocaleString("en-IN")}/month between safety and growth.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab("plan")}
              className="text-[11px] text-outline hover:underline font-medium text-left"
            >
              Explore SIP planner →
            </button>
          </div>

          {/* Step 5: Final Goal */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between space-y-3 opacity-60">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-outline flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Step 5
              </span>
              <h3 className="font-headline font-bold text-xs text-on-surface">First Peaceful SIP</h3>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Automating your investment and letting compounding do the heavy lifting.
              </p>
            </div>
            <span className="text-[10px] text-outline font-medium">Unlocked after Step 4</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. 'INVESTMENT OPTIONS FOR BEGINNERS' (EVERYDAY ANALOGIES GRID)           */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="font-headline text-lg font-bold text-on-surface">
              Beginner Investment Options
            </h2>
            <p className="text-xs text-on-surface-variant">
              Understand the core building blocks with everyday analogies before choosing where to place money.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab("explore")}
            className="text-xs font-bold text-primary hover:text-primary-dim inline-flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>Compare all 10 Asset Classes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Fixed Deposit */}
          <div className="p-5 rounded-2xl bg-surface border border-outline-variant/60 shadow-stitch flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gain-bg text-gain border border-gain/20">
                  Zero Market Risk
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
                  The Safe Vault 🛡️
                </span>
                <h3 className="font-headline font-bold text-sm text-on-surface mt-0.5">
                  Fixed Deposit (FD)
                </h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  Guaranteed ~7% returns with DICGC insurance up to ₹5 Lakh. Perfect for emergency reserves.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-container-low text-[11px] space-y-1">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Minimum to start:</span>
                  <span className="font-bold text-on-surface">₹1,000</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Best for:</span>
                  <span className="font-bold text-on-surface">&lt; 2 Years</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab("explore")}
              className="w-full py-2 px-3 rounded-lg border border-outline-variant/60 hover:bg-surface-container-low text-xs font-bold text-on-surface transition-colors flex items-center justify-center gap-1"
            >
              <span>Understand this option</span>
              <ArrowRight className="w-3 h-3 text-outline" />
            </button>
          </div>

          {/* Card 2: Nifty 50 Index Fund */}
          <div className="p-5 rounded-2xl bg-surface border-2 border-primary/30 shadow-stitch flex flex-col justify-between space-y-4 hover:border-primary transition-all relative">
            <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-primary text-on-primary text-[10px] font-bold shadow-xs">
              ⭐ Top Beginner Pick
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  Moderate • Long-term
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
                  The Growth Engine 🚀
                </span>
                <h3 className="font-headline font-bold text-sm text-on-surface mt-0.5">
                  Nifty 50 Index Fund
                </h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  Own a slice of India's top 50 companies (Tata, Reliance, Infosys) all at once with minimal expense.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-container-low text-[11px] space-y-1">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Minimum SIP:</span>
                  <span className="font-bold text-on-surface">₹500 / month</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Historical return:</span>
                  <span className="font-bold text-gain font-mono">~12% – 14%</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab("explore")}
              className="w-full py-2 px-3 rounded-lg bg-primary hover:bg-primary-dim text-on-primary text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-xs"
            >
              <span>Explore Index Funds</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Card 3: Sovereign Gold Bonds (SGB) */}
          <div className="p-5 rounded-2xl bg-surface border border-outline-variant/60 shadow-stitch flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <Anchor className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Safety Anchor
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
                  The Inflation Shield ⚓
                </span>
                <h3 className="font-headline font-bold text-sm text-on-surface mt-0.5">
                  Sovereign Gold (SGB)
                </h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  Digital gold backed by RBI with zero making charges, plus an extra 2.5% yearly bonus interest.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-container-low text-[11px] space-y-1">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Tax benefit:</span>
                  <span className="font-bold text-on-surface">Tax-free at maturity</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Bonus interest:</span>
                  <span className="font-bold text-amber-800 font-mono">2.5% / year</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab("explore")}
              className="w-full py-2 px-3 rounded-lg border border-outline-variant/60 hover:bg-surface-container-low text-xs font-bold text-on-surface transition-colors flex items-center justify-center gap-1"
            >
              <span>Understand Gold Bonds</span>
              <ArrowRight className="w-3 h-3 text-outline" />
            </button>
          </div>

          {/* Card 4: Government Securities (T-Bills) */}
          <div className="p-5 rounded-2xl bg-surface border border-outline-variant/60 shadow-stitch flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                  <Landmark className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                  100% Sovereign
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block">
                  Sovereign Guarantee 🏛️
                </span>
                <h3 className="font-headline font-bold text-sm text-on-surface mt-0.5">
                  Govt Securities (G-Sec)
                </h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  Lend directly to the Government of India. Highest credit safety in the nation with zero default risk.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-container-low text-[11px] space-y-1">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Default risk:</span>
                  <span className="font-bold text-gain">0.00%</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Annual Yield:</span>
                  <span className="font-bold text-on-surface font-mono">~7.0%</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab("explore")}
              className="w-full py-2 px-3 rounded-lg border border-outline-variant/60 hover:bg-surface-container-low text-xs font-bold text-on-surface transition-colors flex items-center justify-center gap-1"
            >
              <span>Understand G-Secs</span>
              <ArrowRight className="w-3 h-3 text-outline" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE 'MY SAVINGS GROWTH SIMULATOR'                              */}
      {/* ========================================================================= */}
      <section className="bg-surface rounded-2xl p-6 sm:p-8 border border-outline-variant/60 shadow-stitch space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/30 pb-4">
          <div>
            <h2 className="font-headline text-lg font-bold text-on-surface flex items-center gap-2">
              <span>My Savings Growth Simulator</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-secondary/15 text-primary">
                12% Long-Term Benchmark
              </span>
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Move the sliders to witness how small regular savings snowball through compounding.
            </p>
          </div>

          {onOpenExplain && (
            <button
              onClick={() => onOpenExplain("cagr")}
              className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
            >
              <HelpCircle size={14} />
              <span>What is Compounding?</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Controls: Sliders */}
          <div className="lg:col-span-6 space-y-6">
            {/* Monthly SIP Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-on-surface">Monthly Investment Amount</span>
                <span className="font-bold text-primary font-mono text-sm">
                  ₹{monthlySavings.toLocaleString("en-IN")} / month
                </span>
              </div>
              <input
                type="range"
                min={500}
                max={15000}
                step={500}
                value={monthlySavings}
                onChange={(e) => setMonthlySavings(Number(e.target.value))}
                className="w-full custom-range-slider"
              />
              <div className="flex justify-between text-[11px] text-outline pt-1">
                <button
                  type="button"
                  onClick={() => setMonthlySavings(1000)}
                  className={`px-2 py-0.5 rounded-md ${monthlySavings === 1000 ? "bg-primary text-on-primary font-bold" : "hover:bg-surface-container"}`}
                >
                  ₹1,000
                </button>
                <button
                  type="button"
                  onClick={() => setMonthlySavings(2500)}
                  className={`px-2 py-0.5 rounded-md ${monthlySavings === 2500 ? "bg-primary text-on-primary font-bold" : "hover:bg-surface-container"}`}
                >
                  ₹2,500
                </button>
                <button
                  type="button"
                  onClick={() => setMonthlySavings(5000)}
                  className={`px-2 py-0.5 rounded-md ${monthlySavings === 5000 ? "bg-primary text-on-primary font-bold" : "hover:bg-surface-container"}`}
                >
                  ₹5,000
                </button>
                <button
                  type="button"
                  onClick={() => setMonthlySavings(10000)}
                  className={`px-2 py-0.5 rounded-md ${monthlySavings === 10000 ? "bg-primary text-on-primary font-bold" : "hover:bg-surface-container"}`}
                >
                  ₹10,000
                </button>
              </div>
            </div>

            {/* Time Horizon Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-on-surface">Time Horizon</span>
                <span className="font-bold text-primary font-mono text-sm">
                  {years} Years
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full custom-range-slider"
              />
              <div className="flex justify-between text-[11px] text-outline pt-1">
                <button
                  type="button"
                  onClick={() => setYears(3)}
                  className={`px-2 py-0.5 rounded-md ${years === 3 ? "bg-primary text-on-primary font-bold" : "hover:bg-surface-container"}`}
                >
                  3 Years
                </button>
                <button
                  type="button"
                  onClick={() => setYears(5)}
                  className={`px-2 py-0.5 rounded-md ${years === 5 ? "bg-primary text-on-primary font-bold" : "hover:bg-surface-container"}`}
                >
                  5 Years
                </button>
                <button
                  type="button"
                  onClick={() => setYears(10)}
                  className={`px-2 py-0.5 rounded-md ${years === 10 ? "bg-primary text-on-primary font-bold" : "hover:bg-surface-container"}`}
                >
                  10 Years
                </button>
                <button
                  type="button"
                  onClick={() => setYears(15)}
                  className={`px-2 py-0.5 rounded-md ${years === 15 ? "bg-primary text-on-primary font-bold" : "hover:bg-surface-container"}`}
                >
                  15 Years
                </button>
              </div>
            </div>
          </div>

          {/* Right Visual Result: Big Bars & Celebration */}
          <div className="lg:col-span-6 bg-surface-container-low/60 rounded-2xl p-5 sm:p-6 border border-outline-variant/40 space-y-4">
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
                Projected Wealth in {years} Years
              </span>
              <div className="font-headline text-3xl font-extrabold text-primary font-mono">
                ₹{Math.round(futureValue).toLocaleString("en-IN")}
              </div>
            </div>

            {/* Visual Bar Comparison */}
            <div className="space-y-2 pt-2">
              <div>
                <div className="flex justify-between text-[11px] text-on-surface-variant pb-1">
                  <span>What you put in (Principal):</span>
                  <span className="font-semibold text-on-surface font-mono">
                    ₹{totalInvested.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-400 rounded-full"
                    style={{ width: `${Math.min(100, (totalInvested / futureValue) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-primary pb-1 font-bold">
                  <span>What Compounding Generates (Profit):</span>
                  <span className="font-mono text-gain">
                    +₹{Math.round(wealthGained).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-secondary to-primary rounded-full w-full"></div>
                </div>
              </div>
            </div>

            {/* Plain English Highlight */}
            <div className="p-3.5 rounded-xl bg-surface border border-secondary/20 text-xs text-on-surface flex items-start gap-2 shadow-2xs">
              <Sparkles className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                🎉 The extra <strong>₹{Math.round(wealthGained).toLocaleString("en-IN")}</strong> is compound interest working while you sleep. Your money earns profits, which then earn even more profits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. WARM AI INVESTMENT TUTOR CARD                                         */}
      {/* ========================================================================= */}
      <section className="p-6 sm:p-7 rounded-2xl bg-surface border border-outline-variant/60 shadow-stitch space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold">
            🌱
          </div>
          <div>
            <h2 className="font-headline text-base font-bold text-on-surface flex items-center gap-2">
              <span>FinSight AI Companion</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-primary/10 text-primary uppercase">
                Tutor Mode
              </span>
            </h2>
            <p className="text-xs text-on-surface-variant">
              I am your friendly financial guide. No question is silly — ask me anything in plain English!
            </p>
          </div>
        </div>

        {/* Quick click suggestion chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            "Explain Index Funds like I am 15",
            "Will I lose money if the stock market drops?",
            "Why is keeping money in bank savings accounts risky?",
            "How does a ₹500 monthly SIP actually work?",
          ].map((promptText, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAskQuickAI(promptText)}
              className="px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/40 hover:border-primary hover:text-primary text-xs font-medium text-on-surface transition-all shadow-2xs text-left"
            >
              💬 {promptText}
            </button>
          ))}
        </div>

        {/* Direct Ask Form */}
        <form onSubmit={handleSendCustomQuestion} className="flex gap-2 pt-2">
          <input
            type="text"
            placeholder="Ask your tutor anything (e.g. What is inflation in simple terms?)..."
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            className="flex-1 bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-2.5 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary shadow-xs"
          />
          <button
            type="submit"
            disabled={!aiQuestion.trim()}
            className="px-5 py-2.5 bg-primary hover:bg-primary-dim text-on-primary font-bold text-xs rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
          >
            <span>Ask</span>
            <Send size={13} />
          </button>
        </form>
      </section>
    </div>
  );
};
