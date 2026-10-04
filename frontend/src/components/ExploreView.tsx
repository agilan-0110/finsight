import React, { useState } from "react";
import {
  INVESTMENT_CATEGORIES,
  COMPARISON_TABLE,
  type InvestmentCategory,
} from "../data/investmentData";
import { StockDeepDive } from "./StockDeepDive";
import {
  Search,
  ArrowRight,
  Info,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";

interface ExploreViewProps {
  onAskAI: (query: string) => void;
  onOpenAlert: (ticker: string) => void;
  onOpenExplain?: (termKey: string) => void;
  selectedTicker?: string;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  onAskAI,
  onOpenAlert,
  onOpenExplain: _onOpenExplain,
  selectedTicker,
}) => {
  const [activeTab, setActiveTab] = useState<"catalog" | "compare" | "stock_explorer">("catalog");
  const [selectedCategory, setSelectedCategory] = useState<InvestmentCategory | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>("");

  const filteredCategories = INVESTMENT_CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.categoryTag.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.shortDesc.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="max-w-[1080px] mx-auto space-y-6 py-4 animate-in fade-in duration-200">
      {/* Header and Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl font-bold text-on-surface tracking-tight">
            Investment Explorer
          </h1>
          <p className="text-xs sm:text-sm text-secondary">
            Understand your options, compare asset classes, and research Indian equities without jargon.
          </p>
        </div>

        {/* Minimal View Switcher Tabs */}
        <div className="flex items-center p-1 bg-surface-container-low rounded-lg border border-outline-variant/50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === "catalog"
                ? "bg-surface text-primary shadow-stitch-sm font-bold"
                : "text-secondary hover:text-on-surface"
            }`}
          >
            All 10 Categories
          </button>
          <button
            onClick={() => setActiveTab("compare")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === "compare"
                ? "bg-surface text-primary shadow-stitch-sm font-bold"
                : "text-secondary hover:text-on-surface"
            }`}
          >
            Compare Products
          </button>
          <button
            onClick={() => setActiveTab("stock_explorer")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === "stock_explorer"
                ? "bg-surface text-primary shadow-stitch-sm font-bold"
                : "text-secondary hover:text-on-surface"
            }`}
          >
            NSE Stock Research
          </button>
        </div>
      </div>

      {/* TAB 1: 10 INVESTMENT CATEGORIES */}
      {activeTab === "catalog" && (
        <div className="space-y-6">
          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
            <input
              type="text"
              placeholder="Filter categories (e.g. index fund, gold, bonds)..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-outline-variant/60 bg-surface text-xs text-on-surface placeholder:text-secondary focus:outline-none focus:border-primary transition-colors shadow-stitch-sm"
            />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCategories.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-xl bg-surface border border-outline-variant/60 shadow-stitch-sm hover:border-outline-variant transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top tag & icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="px-2 py-0.5 rounded bg-surface-container-low text-secondary text-[10px] font-semibold uppercase tracking-wider border border-outline-variant/40">
                      {item.categoryTag}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-headline font-bold text-sm text-on-surface">
                      {item.name}
                    </h3>
                    <p className="text-xs text-secondary mt-1 leading-relaxed">
                      {item.shortDesc}
                    </p>
                  </div>

                  {/* Standardized Metrics Pills */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-outline-variant/40 text-[11px]">
                    <div>
                      <span className="text-secondary block">Typical Horizon</span>
                      <span className="font-semibold text-on-surface">{item.typicalHorizon}</span>
                    </div>
                    <div>
                      <span className="text-secondary block">Complexity</span>
                      <span className={`font-semibold ${item.complexity === "Low" ? "text-gain" : item.complexity === "Medium" ? "text-amber-600" : "text-error"}`}>
                        {item.complexity}
                      </span>
                    </div>
                    <div>
                      <span className="text-secondary block">Market Risk</span>
                      <span className="font-semibold text-on-surface">{item.marketRisk}</span>
                    </div>
                    <div>
                      <span className="text-secondary block">Diversification</span>
                      <span className="font-semibold text-on-surface">{item.diversification}</span>
                    </div>
                  </div>

                  {/* Learn Before Investing checklist preview */}
                  <div className="pt-2">
                    <span className="text-[10px] uppercase font-semibold text-secondary tracking-wider block mb-1">
                      Learn before investing:
                    </span>
                    <ul className="space-y-1">
                      {item.keyTakeaways.slice(0, 3).map((takeaway, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 text-xs text-secondary">
                          <CheckCircle className="w-3 h-3 text-gain flex-shrink-0" />
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCategory(item)}
                  className="w-full py-2 rounded-lg bg-surface-container-low hover:bg-primary hover:text-on-primary text-on-surface text-xs font-semibold border border-outline-variant/40 transition-all flex items-center justify-center gap-1.5 group"
                >
                  <span>Understand {item.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT COMPARISON MATRIX */}
      {activeTab === "compare" && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-3">
            <Info className="w-5 h-5 text-primary flex-shrink-0" />
            <p className="font-body text-xs text-on-surface leading-relaxed">
              <strong>Guiding Principle:</strong> We do not declare a single product as "the winner." 
              Different investment instruments serve completely different life purposes. Fixed deposits protect capital, index funds compound wealth, and gold stabilizes shocks.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/40">
                  <th className="py-3.5 px-4 font-headline font-bold text-on-surface uppercase text-[11px] tracking-wider w-1/5">
                    Factor
                  </th>
                  <th className="py-3.5 px-4 font-headline font-bold text-on-surface uppercase text-[11px] tracking-wider w-1/5">
                    🏦 Fixed Deposit (FD)
                  </th>
                  <th className="py-3.5 px-4 font-headline font-bold text-on-surface uppercase text-[11px] tracking-wider w-1/5">
                    🧺 Index Fund (Nifty 50)
                  </th>
                  <th className="py-3.5 px-4 font-headline font-bold text-on-surface uppercase text-[11px] tracking-wider w-1/5">
                    🥇 Sovereign Gold / ETF
                  </th>
                  <th className="py-3.5 px-4 font-headline font-bold text-on-surface uppercase text-[11px] tracking-wider w-1/5">
                    🏛 Government Bond (G-Sec)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-body">
                {COMPARISON_TABLE.map((row, idx) => (
                  <tr key={idx} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-3.5 px-4 font-headline font-semibold text-on-surface">
                      {row.factor}
                    </td>
                    <td className="py-3.5 px-4 text-on-surface-variant">
                      {row.fd}
                    </td>
                    <td className="py-3.5 px-4 text-on-surface-variant font-medium">
                      {row.indexFund}
                    </td>
                    <td className="py-3.5 px-4 text-on-surface-variant">
                      {row.gold}
                    </td>
                    <td className="py-3.5 px-4 text-on-surface-variant">
                      {row.gSec}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LIVE NSE EQUITY RESEARCH */}
      {activeTab === "stock_explorer" && (
        <div className="space-y-4">
          <StockDeepDive
            onAskAI={onAskAI}
            onOpenAlert={onOpenAlert}
            externalTicker={selectedTicker}
          />
        </div>
      )}

      {/* STANDARDIZED DETAIL MODAL */}
      {selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl w-full max-w-3xl shadow-stitch-lg overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-outline-variant/30 bg-surface-container-low/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedCategory.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-headline font-bold text-lg text-on-surface">
                      {selectedCategory.name}
                    </h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-label font-bold bg-primary/10 text-primary uppercase">
                      {selectedCategory.categoryTag}
                    </span>
                  </div>
                  <p className="font-body text-xs text-on-surface-variant">
                    Standardized Beginner Investment Sheet
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCategory(null)}
                className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Section 1: What is it & How it works */}
              <div className="space-y-3">
                <div>
                  <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-primary mb-1">
                    What is it?
                  </h4>
                  <p className="font-body text-on-surface text-sm leading-relaxed">
                    {selectedCategory.whatIsIt}
                  </p>
                </div>

                <div>
                  <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-primary mb-1">
                    How does it work?
                  </h4>
                  <p className="font-body text-on-surface-variant leading-relaxed">
                    {selectedCategory.howItWorks}
                  </p>
                </div>
              </div>

              {/* Section 2: How you make/lose money */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1.5">
                <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-on-surface">
                  How do you make or lose money?
                </h4>
                <p className="font-body text-on-surface-variant leading-relaxed">
                  {selectedCategory.makeOrLoseMoney}
                </p>
              </div>

              {/* Section 3: Time Horizon & Liquidity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1">
                  <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-on-surface">
                    Recommended Horizon
                  </h4>
                  <p className="font-body text-on-surface-variant leading-relaxed">
                    {selectedCategory.timeHorizonDetails}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1">
                  <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-on-surface">
                    Liquidity & Redemptions
                  </h4>
                  <p className="font-body text-on-surface-variant leading-relaxed">
                    {selectedCategory.liquidityDetails}
                  </p>
                </div>
              </div>

              {/* Section 4: Costs & Tax Considerations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1">
                  <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-on-surface">
                    Costs & Fees
                  </h4>
                  <p className="font-body text-on-surface-variant leading-relaxed">
                    {selectedCategory.costsAndFees}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1">
                  <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-on-surface">
                    Tax Considerations
                  </h4>
                  <p className="font-body text-on-surface-variant leading-relaxed">
                    {selectedCategory.taxConsiderations}
                  </p>
                </div>
              </div>

              {/* Section 5: Who Generally Uses It */}
              <div>
                <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-primary mb-1">
                  Who generally uses it?
                </h4>
                <p className="font-body text-on-surface-variant leading-relaxed">
                  {selectedCategory.whoGenerallyUsesIt}
                </p>
              </div>

              {/* Section 6: Common Mistakes */}
              <div className="p-4 rounded-xl bg-error/5 border border-error/20 space-y-2">
                <div className="flex items-center gap-1.5 text-error font-headline text-xs font-bold uppercase tracking-wider">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Common Beginner Mistakes</span>
                </div>
                <ul className="space-y-1 text-on-surface-variant">
                  {selectedCategory.commonMistakes.map((m, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-error font-bold">•</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Section 7: Concrete Real Example */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-1.5">
                <span className="font-headline text-xs font-bold text-primary uppercase tracking-wider">
                  Real-World Example
                </span>
                <p className="font-body text-on-surface leading-relaxed">
                  {selectedCategory.practicalExample}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-outline-variant/30 bg-surface-container-low/40 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  onAskAI(`Explain ${selectedCategory.name} in more detail and tell me if it fits someone investing ₹2,000 to ₹5,000 monthly.`);
                  setSelectedCategory(null);
                }}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary font-label text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5"
              >
                <span>Ask AI Tutor About {selectedCategory.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label text-xs font-medium transition-colors"
              >
                Close Sheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
