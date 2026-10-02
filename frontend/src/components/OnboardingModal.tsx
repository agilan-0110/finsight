import React, { useState } from "react";
import { api, type UserProfile } from "../api/client";
import { CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Compass, Calendar, DollarSign, Activity } from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleted: (profile: UserProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onCompleted,
}) => {
  const [step, setStep] = useState<number>(1);
  const [saving, setSaving] = useState<boolean>(false);

  // Form states
  const [experience, setExperience] = useState<"completely_new" | "know_basics" | "already_invest">("completely_new");
  const [goal, setGoal] = useState<"wealth" | "retirement" | "education" | "purchase" | "income" | "safety" | "unsure">("wealth");
  const [horizon, setHorizon] = useState<"<1yr" | "1-3yrs" | "3-5yrs" | "5-10yrs" | "10+yrs">("5-10yrs");
  const [monthlyAmount, setMonthlyAmount] = useState<number>(2000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [riskReaction, setRiskReaction] = useState<"sell" | "wait_understand" | "fluctuate_comfortable">("wait_understand");

  if (!isOpen) return null;

  const handleFinish = async () => {
    setSaving(true);
    try {
      const finalMonthly = customAmount ? parseFloat(customAmount) || monthlyAmount : monthlyAmount;
      const saved = await api.saveProfile({
        experience_level: experience,
        primary_goal: goal,
        time_horizon: horizon,
        monthly_investment: finalMonthly,
        risk_reaction: riskReaction,
        onboarding_completed: true,
      });
      onCompleted(saved);
      onClose();
    } catch (err) {
      console.error("Failed to save profile:", err);
      // Fallback local completion
      onCompleted({
        experience_level: experience,
        primary_goal: goal,
        time_horizon: horizon,
        monthly_investment: monthlyAmount,
        risk_reaction: riskReaction,
        onboarding_completed: true,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl w-full max-w-xl shadow-stitch-lg overflow-hidden flex flex-col">
        {/* Progress header */}
        <div className="p-6 border-b border-outline-variant/30 bg-surface-container-low/40">
          <div className="flex items-center justify-between mb-3">
            <span className="font-label text-xs font-semibold text-primary uppercase tracking-wider">
              FinSight Investor Onboarding • Step {step} of 5
            </span>
            <span className="font-label text-xs text-on-surface-variant">
              {Math.round((step / 5) * 100)}% Completed
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
          {/* STEP 1: Experience */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-primary">
                <Compass className="w-5 h-5" />
                <h3 className="font-headline font-bold text-lg text-on-surface">
                  How familiar are you with investing?
                </h3>
              </div>
              <p className="font-body text-xs text-on-surface-variant">
                We adjust all definitions, tutorials, and AI explanations to meet your comfort level.
              </p>

              <div className="space-y-2.5 pt-2">
                {[
                  {
                    id: "completely_new",
                    title: "I'm completely new",
                    desc: "I want to start from absolute basics: saving, inflation, and how investments work.",
                    badge: "Best for beginners",
                  },
                  {
                    id: "know_basics",
                    title: "I know the basics",
                    desc: "I know what stocks and mutual funds are, but want to understand valuation and risk.",
                    badge: "Intermediate",
                  },
                  {
                    id: "already_invest",
                    title: "I already invest",
                    desc: "I own stocks, mutual funds or ETFs, and want deep portfolio health and analytics.",
                    badge: "Experienced",
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setExperience(opt.id as any)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      experience === opt.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                        : "border-outline-variant/40 bg-surface-container-lowest hover:border-outline hover:bg-surface-container-low"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-headline font-bold text-sm text-on-surface">
                        {opt.title}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-label font-semibold bg-surface-container text-on-surface-variant">
                        {opt.badge}
                      </span>
                    </div>
                    <p className="font-body text-xs text-on-surface-variant">
                      {opt.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Goal */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-headline font-bold text-lg text-on-surface">
                  What are you investing for?
                </h3>
              </div>
              <p className="font-body text-xs text-on-surface-variant">
                Your purpose helps determine the right balance between capital protection and growth.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {[
                  { id: "wealth", title: "Long-term wealth", desc: "Build significant assets over 5–10+ years" },
                  { id: "retirement", title: "Retirement", desc: "Financial independence and life freedom" },
                  { id: "education", title: "Higher Education", desc: "Funding college, courses or certifications" },
                  { id: "purchase", title: "Major Purchase", desc: "Buying a vehicle, home down-payment, etc." },
                  { id: "income", title: "Regular Income", desc: "Dividends and interest payments" },
                  { id: "safety", title: "Protecting Savings", desc: "Beat inflation without taking wild risks" },
                  { id: "unsure", title: "I'm not sure yet", desc: "I want to explore what's possible first" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setGoal(opt.id as any)}
                    className={`text-left p-3.5 rounded-xl border transition-all ${
                      goal === opt.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                        : "border-outline-variant/40 bg-surface-container-lowest hover:border-outline hover:bg-surface-container-low"
                    }`}
                  >
                    <span className="block font-headline font-bold text-xs text-on-surface mb-0.5">
                      {opt.title}
                    </span>
                    <span className="block font-body text-[11px] text-on-surface-variant">
                      {opt.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Time Horizon */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-primary">
                <Calendar className="w-5 h-5" />
                <h3 className="font-headline font-bold text-lg text-on-surface">
                  When might you need this money?
                </h3>
              </div>
              <p className="font-body text-xs text-on-surface-variant">
                Equities need time to ride out short-term market storms. Time horizon dictates safety.
              </p>

              <div className="space-y-2 pt-2">
                {[
                  { id: "<1yr", label: "Less than 1 year", desc: "Need liquidity soon. Low-volatility products (FD, Liquid Funds, T-Bills) are best." },
                  { id: "1-3yrs", label: "1 to 3 years", desc: "Short-to-medium term. Debt funds, conservative hybrids, or short-term deposits." },
                  { id: "3-5yrs", label: "3 to 5 years", desc: "Medium term. Balanced allocation across equities and fixed income." },
                  { id: "5-10yrs", label: "5 to 10 years", desc: "Long term. Well suited for diversified equities, index funds, and compounding." },
                  { id: "10+yrs", label: "10+ years", desc: "Very long term. Maximum compounding power; short-term market dips matter much less." },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setHorizon(opt.id as any)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      horizon === opt.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                        : "border-outline-variant/40 bg-surface-container-lowest hover:border-outline hover:bg-surface-container-low"
                    }`}
                  >
                    <span className="block font-headline font-bold text-xs text-on-surface mb-0.5">
                      {opt.label}
                    </span>
                    <span className="block font-body text-[11px] text-on-surface-variant">
                      {opt.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Monthly Amount */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-primary">
                <DollarSign className="w-5 h-5" />
                <h3 className="font-headline font-bold text-lg text-on-surface">
                  How much can you potentially invest monthly?
                </h3>
              </div>
              <p className="font-body text-xs text-on-surface-variant">
                Consistent small contributions beat sporadic large lump sums. Even ₹500/month starts compounding!
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                {[500, 1000, 2500, 5000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setMonthlyAmount(amt);
                      setCustomAmount("");
                    }}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      monthlyAmount === amt && !customAmount
                        ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                        : "border-outline-variant/40 bg-surface-container-lowest hover:border-outline hover:bg-surface-container-low"
                    }`}
                  >
                    <span className="block font-headline text-lg font-bold text-on-surface">
                      ₹{amt.toLocaleString("en-IN")}
                    </span>
                    <span className="block font-label text-[11px] text-on-surface-variant">
                      per month
                    </span>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="block font-label text-xs font-semibold text-on-surface mb-1">
                  Or enter a custom amount (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 15000"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface text-sm focus:outline-none focus:border-primary font-mono"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Risk Understanding (Behavioral Test) */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-primary">
                <Activity className="w-5 h-5" />
                <h3 className="font-headline font-bold text-lg text-on-surface">
                  Imagine your investment temporarily falls 15%. What would you do?
                </h3>
              </div>
              <p className="font-body text-xs text-on-surface-variant">
                Markets naturally fluctuate in cycles. Understanding your reaction is the most important factor in investing peace of mind.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  {
                    id: "sell",
                    emoji: "😰",
                    title: "I would probably sell",
                    desc: "Seeing losses makes me anxious. I prioritize capital preservation over high potential returns.",
                    style: "Cautious Investor",
                  },
                  {
                    id: "wait_understand",
                    emoji: "😐",
                    title: "I would wait and understand why",
                    desc: "I will not panic-sell, but I want clear explanations of why the market dropped before deciding.",
                    style: "Moderate Investor",
                  },
                  {
                    id: "fluctuate_comfortable",
                    emoji: "💪",
                    title: "I understand markets fluctuate",
                    desc: "I know volatility is the price of high long-term returns. Temporary dips might even be buying opportunities.",
                    style: "Long-Term Growth Investor",
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setRiskReaction(opt.id as any)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      riskReaction === opt.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                        : "border-outline-variant/40 bg-surface-container-lowest hover:border-outline hover:bg-surface-container-low"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{opt.emoji}</span>
                        <span className="font-headline font-bold text-sm text-on-surface">
                          {opt.title}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-label font-semibold bg-surface-container text-on-surface-variant">
                        {opt.style}
                      </span>
                    </div>
                    <p className="font-body text-xs text-on-surface-variant pl-7">
                      {opt.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-5 border-t border-outline-variant/30 bg-surface-container-low/40 flex items-center justify-between">
          <div>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl text-on-surface font-label text-xs font-semibold hover:bg-surface-container transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-outline hover:text-on-surface font-label text-xs"
              >
                Skip for now
              </button>
            )}
          </div>

          <div>
            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm disabled:opacity-60"
              >
                {saving ? (
                  <span>Saving Profile...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete Onboarding</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
