import React, { useState } from "react";
import { HelpCircle, X, ArrowRight, BookOpen, Sparkles } from "lucide-react";

export interface TermDefinition {
  term: string;
  fullName: string;
  shortDefinition: string;
  simpleAnalogy: string;
  howToInterpret: string;
  beginnerExample: string;
  category: "ratios" | "concepts" | "funds" | "markets";
}

export const FINANCIAL_TERMS: Record<string, TermDefinition> = {
  pe_ratio: {
    term: "P/E Ratio",
    fullName: "Price-to-Earnings Ratio",
    shortDefinition: "Compares a company's share price to the profit it generates for each share.",
    simpleAnalogy: "If a shop costs ₹100 to buy and earns ₹10 in profit every year, its P/E is 10. You are paying 10 years of earnings upfront to own it.",
    howToInterpret: "A lower P/E (e.g. 15) may indicate good value or slow growth. A higher P/E (e.g. 50) means investors expect rapid future earnings growth.",
    beginnerExample: "TCS trades at ₹3,500 with EPS of ₹140 → P/E = 25x. Investors pay ₹25 for every ₹1 of current annual profit.",
    category: "ratios",
  },
  roe: {
    term: "ROE",
    fullName: "Return on Equity",
    shortDefinition: "Measures how efficiently a company turns shareholders' invested money into net profits.",
    simpleAnalogy: "If you give ₹100 to a friend to run a lemonade stand and they return ₹20 in annual profit, their ROE is 20%.",
    howToInterpret: "Higher is generally better. Institutional investors look for consistent ROE above 15% without excessive debt.",
    beginnerExample: "Infosys with 30% ROE generates ₹30 of net profit for every ₹100 of shareholder capital.",
    category: "ratios",
  },
  debt_to_equity: {
    term: "Debt-to-Equity",
    fullName: "Debt-to-Equity Ratio (D/E)",
    shortDefinition: "Compares the amount of borrowed money (loans) a company uses relative to the owners' capital.",
    simpleAnalogy: "If you buy a house with ₹20 lakh of your own savings and ₹80 lakh bank loan, your D/E is 4.0. If you have zero loans, your D/E is 0.0.",
    howToInterpret: "A D/E below 1.0 is considered conservative and safe. High D/E (>2.0) increases bankruptcy risk during market downturns.",
    beginnerExample: "A debt-free IT company has D/E = 0.05 (very safe). A capital-heavy steel manufacturer might operate safely around D/E = 0.8.",
    category: "ratios",
  },
  market_cap: {
    term: "Market Cap",
    fullName: "Market Capitalization",
    shortDefinition: "The total market value of all of a company's outstanding shares combined.",
    simpleAnalogy: "Total price tag to buy 100% of the company right now: (Share Price × Total Shares in existence).",
    howToInterpret: "Large-cap (>₹20,000 Cr) offers stability. Mid-cap (₹5,000–₹20,000 Cr) balances growth and risk. Small-cap (<₹5,000 Cr) has high growth potential but higher volatility.",
    beginnerExample: "Reliance Industries has a market cap of over ₹19 lakh crore, making it India's largest publicly traded company.",
    category: "markets",
  },
  expense_ratio: {
    term: "Expense Ratio",
    fullName: "Total Expense Ratio (TER)",
    shortDefinition: "The annual percentage fee that a mutual fund or ETF charges investors to manage the fund.",
    simpleAnalogy: "If you invest ₹10,000 in a fund with a 0.2% expense ratio, ₹20 is deducted each year to cover management costs.",
    howToInterpret: "Lower is always better for identical categories. A 1% difference in fees can eat up 25% of your total wealth over 20 years!",
    beginnerExample: "Nifty 50 Index funds typically charge ~0.10% to 0.20%, whereas actively managed equity funds may charge 1.5% to 2.0%.",
    category: "funds",
  },
  cagr: {
    term: "CAGR",
    fullName: "Compound Annual Growth Rate",
    shortDefinition: "The smoothed annual rate of return that an investment provides over multiple years.",
    simpleAnalogy: "Even if your investment went +30% year one, -10% year two, and +15% year three, CAGR tells you the steady annual growth rate that gets the same final result.",
    howToInterpret: "CAGR allows you to fairly compare a 5-year fixed deposit against a 5-year mutual fund or gold holding.",
    beginnerExample: "If ₹1,00,000 grows to ₹2,00,000 in 5 years, the CAGR is ~14.87% per year.",
    category: "concepts",
  },
  diversification: {
    term: "Diversification",
    fullName: "Portfolio Diversification",
    shortDefinition: "Spreading your money across different companies, industries, and asset classes to reduce risk.",
    simpleAnalogy: "Don't put all your eggs in one basket. If one basket drops, you don't lose your breakfast.",
    howToInterpret: "A well-diversified portfolio doesn't rely on any single stock (e.g. max 10% in one stock) or any single sector (e.g. max 25% in IT).",
    beginnerExample: "Owning shares in IT, Banking, Pharma, and FMCG protects you if one specific sector faces new regulatory hurdles.",
    category: "concepts",
  },
  inflation: {
    term: "Inflation",
    fullName: "Consumer Price Inflation",
    shortDefinition: "The rate at which the general prices of goods and services rise, reducing purchasing power.",
    simpleAnalogy: "If a movie ticket costs ₹100 today and inflation is 6%, the same ticket will cost ₹106 next year. Cash left under the mattress loses value.",
    howToInterpret: "Your investments must generate returns higher than inflation (e.g., return of 11% minus 6% inflation = 5% real wealth growth).",
    beginnerExample: "At 6% average inflation, ₹5,00,000 today will only buy ₹2,79,000 worth of goods in 10 years.",
    category: "concepts",
  },
  compounding: {
    term: "Compounding",
    fullName: "Compound Interest & Growth",
    shortDefinition: "Earning returns not only on your original principal, but also on the accumulated returns from previous periods.",
    simpleAnalogy: "Snowball rolling down a hill: it starts small, but as it picks up snow, it grows faster and faster with every rotation.",
    howToInterpret: "Time matters more than initial capital. Starting at age 20 with ₹1,000/month often builds more wealth than starting at 35 with ₹5,000/month.",
    beginnerExample: "₹2,000 invested monthly at 12% for 20 years results in ₹4.8 lakh invested turning into ~₹20 lakh.",
    category: "concepts",
  },
};

interface ExplainModalProps {
  isOpen: boolean;
  onClose: () => void;
  termKey?: string;
  onAskAI?: (term: string) => void;
}

export const ExplainModal: React.FC<ExplainModalProps> = ({
  isOpen,
  onClose,
  termKey,
  onAskAI,
}) => {
  const [selectedKey, setSelectedKey] = useState<string>(termKey || "pe_ratio");

  // Keep selectedKey synchronized when termKey prop changes
  React.useEffect(() => {
    if (termKey && FINANCIAL_TERMS[termKey]) {
      setSelectedKey(termKey);
    }
  }, [termKey]);

  if (!isOpen) return null;

  const current = FINANCIAL_TERMS[selectedKey] || FINANCIAL_TERMS["pe_ratio"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl w-full max-w-2xl shadow-stitch-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-base text-on-surface">
                FinSight Concept Explainer
              </h3>
              <p className="font-label text-xs text-on-surface-variant">
                Plain-English financial education for beginners
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Concept Switcher Chips */}
          <div className="flex flex-wrap gap-1.5 pb-2 border-b border-outline-variant/20">
            {Object.entries(FINANCIAL_TERMS).map(([key, def]) => (
              <button
                key={key}
                onClick={() => setSelectedKey(key)}
                className={`px-3 py-1.5 rounded-lg font-label text-xs font-semibold transition-all ${
                  selectedKey === key
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest"
                }`}
              >
                {def.term}
              </button>
            ))}
          </div>

          {/* Active Definition Card */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-headline text-xl font-bold text-on-surface">
                  {current.fullName}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-secondary-container text-on-secondary-container font-label text-[11px] font-semibold">
                  {current.term}
                </span>
              </div>
              <p className="font-body text-sm text-on-surface font-medium leading-relaxed">
                {current.shortDefinition}
              </p>
            </div>

            {/* Everyday Analogy Box */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-1.5">
              <div className="flex items-center gap-1.5 text-primary font-headline text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simple Everyday Analogy</span>
              </div>
              <p className="font-body text-xs text-on-surface leading-relaxed">
                {current.simpleAnalogy}
              </p>
            </div>

            {/* How to Interpret */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1.5">
              <span className="font-headline text-xs font-bold text-on-surface uppercase tracking-wider">
                How to Interpret This
              </span>
              <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                {current.howToInterpret}
              </p>
            </div>

            {/* Real Beginner Example */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1.5">
              <span className="font-headline text-xs font-bold text-on-surface uppercase tracking-wider">
                Practical Indian Market Example
              </span>
              <p className="font-body text-xs text-on-surface-variant leading-relaxed font-mono">
                {current.beginnerExample}
              </p>
            </div>
          </div>
        </div>

        {/* Footer with AI Tutor trigger */}
        <div className="p-4 border-t border-outline-variant/30 bg-surface-container-low/40 flex items-center justify-between">
          <p className="font-label text-xs text-on-surface-variant">
            Still have questions? Ask the FinSight AI Tutor.
          </p>
          <div className="flex items-center gap-2">
            {onAskAI && (
              <button
                onClick={() => {
                  onAskAI(`Explain ${current.fullName} (${current.term}) simply for a beginner investor with real examples.`);
                  onClose();
                }}
                className="px-3.5 py-2 rounded-xl bg-primary text-on-primary font-label text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5"
              >
                <span>Ask AI Tutor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-surface-container-high text-on-surface font-label text-xs font-medium hover:bg-surface-container-highest transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Inline helper button to place next to any metric
export const ExplainButton: React.FC<{ termKey: string; onOpen: (term: string) => void }> = ({
  termKey,
  onOpen,
}) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onOpen(termKey);
      }}
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-label font-medium text-outline hover:text-primary hover:bg-primary/10 transition-colors"
      title="Click to understand this metric"
    >
      <HelpCircle className="w-3 h-3" />
      <span>Explain</span>
    </button>
  );
};
