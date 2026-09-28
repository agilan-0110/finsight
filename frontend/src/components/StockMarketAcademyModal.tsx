import React, { useState } from "react";
import {
  X,
  GraduationCap,
  TrendingUp,
  PieChart,
  Scale,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import { api } from "../api/client";

interface StockMarketAcademyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleted?: () => void;
}

interface Lesson {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  keyTakeaway: string;
  analogy: string;
  coreConcepts: { term: string; explanation: string }[];
  marketExample: string;
  finsightTip: string;
}

const LESSONS: Lesson[] = [
  {
    id: 1,
    title: "What is a Share & Equity?",
    subtitle: "Understanding real business ownership vs gambling",
    icon: TrendingUp,
    keyTakeaway:
      "Buying a share means acquiring fractional ownership in a living, revenue-generating enterprise.",
    analogy:
      "Imagine your friend opens a successful artisan bakery that earns ₹10 Lakhs profit annually. If the business is divided into 100 equal slices and you buy 10 slices, you legally own 10% of the company and receive 10% of its future distributed profits.",
    coreConcepts: [
      {
        term: "Equity Share",
        explanation:
          "A certificate of partial ownership in a corporation listed on the National Stock Exchange (NSE).",
      },
      {
        term: "Capital Appreciation",
        explanation:
          "As the company expands revenues, opens factories, and increases earnings, the market valuation of your shares increases.",
      },
      {
        term: "Dividends",
        explanation:
          "Direct cash payouts credited to your bank account when a company distributes surplus profits to shareholders.",
      },
    ],
    marketExample:
      "Holding 50 shares of Tata Motors means you own a real fractional portion of Jaguar Land Rover, EV battery facilities, and commercial truck operations across India.",
    finsightTip:
      "Never treat stock prices like lottery tickets. Always ask: 'Is this business making growing profits that will compound over the next 5 years?'",
  },
  {
    id: 2,
    title: "Stock Valuation: The P/E Ratio & Market Cap",
    subtitle: "Why a ₹100 stock is NOT necessarily cheaper than a ₹2,000 stock",
    icon: Scale,
    keyTakeaway:
      "Stock price alone is meaningless without comparing it to how much profit the company actually earns.",
    analogy:
      "Would you pay ₹500 for a wallet containing ₹10? No. But you would gladly pay ₹2,000 for a wallet containing ₹10,000! Valuation is about what you pay versus what you get in return.",
    coreConcepts: [
      {
        term: "Price-to-Earnings (P/E)",
        explanation:
          "Calculated as Current Share Price ÷ Annual Earnings Per Share (EPS). It indicates how many Rupees investors are willing to pay for ₹1 of annual net profit.",
      },
      {
        term: "Market Capitalization",
        explanation:
          "Total market value of the entire company (Total Shares × Share Price). Large-Cap (>₹20,000 Cr) companies offer stability, while Mid & Small-Caps offer faster growth with higher volatility.",
      },
      {
        term: "Fair Value vs Overhyped",
        explanation:
          "A high P/E (e.g. 90x) demands enormous future profit growth. If that growth stalls, the stock price usually crashes sharply.",
      },
    ],
    marketExample:
      "If HDFC Bank trades at P/E 18 while historical banking average is 22, it may offer institutional margin of safety. If a speculative EV stock trades at P/E 150 with zero profits, you are paying extreme risk premiums.",
    finsightTip:
      "Check FinSight's 'P/E Ratio' on any stock card to see if you are entering at a fair valuation or near an overbought peak.",
  },
  {
    id: 3,
    title: "Diversification & Risk Defense",
    subtitle: "Protecting your capital through smart sector balance",
    icon: PieChart,
    keyTakeaway:
      "A great portfolio combines aggressive growth compounders with defensive, all-weather businesses.",
    analogy:
      "A winning cricket team does not consist of 11 opening batsmen. You need disciplined bowlers to defend low scores during difficult weather conditions. Diversification is your bowling lineup.",
    coreConcepts: [
      {
        term: "Sector Allocation",
        explanation:
          "Spreading investments across uncorrelated industries: Banking (HDFCBANK), Information Technology (INFY, TCS), FMCG (ITC), and Industrials (RELIANCE).",
      },
      {
        term: "The 15% Max Rule",
        explanation:
          "Prudent investors avoid putting more than 15-20% of their total wealth into any single company, no matter how confident they feel.",
      },
      {
        term: "Drawdown Protection",
        explanation:
          "When tech stocks experience a cyclical downturn, consumer staples and energy often stay resilient, stabilizing your overall portfolio value.",
      },
    ],
    marketExample:
      "During the 2022 global tech selloff, pure IT portfolios dropped -25%, while diversified portfolios holding banking, FMCG, and automotive finished the year in positive territory.",
    finsightTip:
      "FinSight calculates a dynamic 'Diversification Score' (0 to 100) and flags risk warnings if any single stock or sector exceeds healthy safety thresholds.",
  },
  {
    id: 4,
    title: "AI-Powered Research with FinSight Co-Pilot",
    subtitle: "Analyzing companies in seconds before buying",
    icon: Sparkles,
    keyTakeaway:
      "Use your local FinSight AI assistant to perform institutional balance sheet checks before placing an order on your broker app.",
    analogy:
      "Before purchasing a used vehicle, you would hire a certified mechanic to inspect the engine, brakes, and chassis. FinSight Co-Pilot acts as your personal financial mechanic.",
    coreConcepts: [
      {
        term: "Return on Equity (ROE)",
        explanation:
          "Measures how efficiently management generates profits from shareholder capital. Strong compounders typically maintain ROE > 15%.",
      },
      {
        term: "Debt-to-Equity (D/E)",
        explanation:
          "High debt can bankrupt a company during economic downturns. Companies with D/E < 0.5 maintain fortress balance sheets.",
      },
      {
        term: "The Workflow",
        explanation:
          "1) Discover an interesting company. 2) Ask FinSight Co-Pilot for institutional analysis. 3) Buy on your broker app (Zerodha, Groww, etc.). 4) Add holding to FinSight to monitor.",
      },
    ],
    marketExample:
      "Ask FinSight Co-Pilot: 'Analyze Tata Motors valuation, debt position, and EV market catalysts' to get a complete institutional executive brief in 5 seconds.",
    finsightTip:
      "Whenever you are considering a new stock, click 'Ask Co-Pilot' from the NSE Stock Deep Dive section to analyze its balance sheet.",
  },
];

export const StockMarketAcademyModal: React.FC<StockMarketAcademyModalProps> = ({
  isOpen,
  onClose,
  onCompleted,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const currentLesson = LESSONS[currentStep];
  const isLastLesson = currentStep === LESSONS.length - 1;

  const handleSkip = async () => {
    try {
      await api.completeTutorial();
    } catch {
      // ignore
    }
    if (onCompleted) onCompleted();
    onClose();
  };

  const handleNext = async () => {
    if (isLastLesson) {
      try {
        await api.completeTutorial();
      } catch {
        // ignore
      }
      if (onCompleted) onCompleted();
      onClose();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const IconComponent = currentLesson.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim/30 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-stitch-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/30 bg-surface-container-low/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container shadow-sm">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline text-base font-bold text-on-surface">
                  FinSight Market Academy
                </h2>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
                  Beginner Guide
                </span>
              </div>
              <p className="text-xs text-on-surface-variant font-medium">
                Master essential stock investing concepts in 4 quick lessons
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Prominent Skip Button */}
            <button
              onClick={handleSkip}
              className="px-3 py-1.5 rounded-lg border border-outline-variant/40 hover:bg-surface-container text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
              title="Skip this tutorial and go directly to the dashboard"
            >
              Skip Tutorial
            </button>
            <button
              onClick={handleSkip}
              className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Step Bar */}
        <div className="px-6 pt-4 pb-2 flex items-center gap-2">
          {LESSONS.map((l, idx) => (
            <button
              key={l.id}
              onClick={() => setCurrentStep(idx)}
              className="flex-1 group flex flex-col gap-1.5 text-left cursor-pointer"
            >
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentStep
                    ? "bg-primary"
                    : idx < currentStep
                    ? "bg-gain"
                    : "bg-surface-container-highest"
                }`}
              />
              <span
                className={`text-[10px] font-semibold truncate ${
                  idx === currentStep
                    ? "text-primary"
                    : idx < currentStep
                    ? "text-on-surface"
                    : "text-outline"
                }`}
              >
                {idx + 1}. {l.title.split(":")[0]}
              </span>
            </button>
          ))}
        </div>

        {/* Lesson Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Lesson Header */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
            <div className="w-12 h-12 rounded-xl bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-center flex-shrink-0 shadow-stitch-sm">
              <IconComponent className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-primary uppercase tracking-wider">
                Lesson {currentStep + 1} of {LESSONS.length}
              </div>
              <h3 className="font-headline text-base font-bold text-on-surface mt-0.5">
                {currentLesson.title}
              </h3>
              <p className="text-xs text-on-surface-variant font-medium mt-1">
                {currentLesson.subtitle}
              </p>
            </div>
          </div>

          {/* Key Takeaway Card */}
          <div className="p-4 rounded-xl bg-primary-container/20 border border-primary/20">
            <div className="flex items-center gap-2 text-xs font-bold text-primary mb-1">
              <Lightbulb className="w-4 h-4" />
              <span>Core Principle</span>
            </div>
            <p className="text-xs text-on-surface font-semibold leading-relaxed">
              "{currentLesson.keyTakeaway}"
            </p>
          </div>

          {/* Real-World Analogy */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-on-surface flex items-center gap-1.5">
              <span>☕ Real-World Analogy</span>
            </h4>
            <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-xs text-on-surface-variant leading-relaxed">
              {currentLesson.analogy}
            </div>
          </div>

          {/* Key Concepts Grid */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-on-surface flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-primary" />
              <span>Key Terms to Know</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {currentLesson.coreConcepts.map((concept) => (
                <div
                  key={concept.term}
                  className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between"
                >
                  <div className="font-bold text-xs text-on-surface mb-1 text-primary">
                    {concept.term}
                  </div>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    {concept.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Market Example & FinSight Tip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <div className="text-[11px] font-bold text-on-surface mb-1 flex items-center gap-1.5">
                <span>🏛️ NSE Market Example</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {currentLesson.marketExample}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-secondary-container/40 border border-secondary/20">
              <div className="text-[11px] font-bold text-on-secondary-container mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>How FinSight Helps You</span>
              </div>
              <p className="text-xs text-on-secondary-container leading-relaxed">
                {currentLesson.finsightTip}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-surface-container-low/40 border-t border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {/* Skip Tutorial Button */}
            <button
              onClick={handleSkip}
              className="px-3 py-2 text-xs font-semibold text-outline hover:text-on-surface hover:underline transition-colors"
            >
              Skip Tutorial
            </button>
          </div>

          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dim text-on-primary text-xs font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-[0.99]"
          >
            <span>{isLastLesson ? "Complete Academy & Go to Dashboard" : "Next Lesson"}</span>
            {isLastLesson ? (
              <CheckCircle className="w-4 h-4 text-on-primary" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
