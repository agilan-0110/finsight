import React from "react";
import { Wallet, TrendingUp, DollarSign, CheckCircle2 } from "lucide-react";
import type { PortfolioAnalytics } from "../api/client";

interface Props {
  analytics: PortfolioAnalytics | null;
  loading: boolean;
}

export const PortfolioSummary: React.FC<Props> = ({ analytics, loading }) => {
  if (loading || !analytics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-xl bg-surface-container-lowest border border-outline-variant/40 animate-pulse shadow-stitch" />
        ))}
      </div>
    );
  }

  const isProfit = analytics.total_pnl >= 0;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {/* Card 1: Total Portfolio Value (Exact Stitch Blueprint) */}
      <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/40 shadow-stitch hover:border-outline-variant transition-all">
        <div className="flex items-center justify-between text-on-surface-variant mb-2">
          <span className="text-xs font-label font-medium uppercase tracking-wider">
            Total Portfolio Value
          </span>
          <Wallet className="w-4 h-4 text-outline" />
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="font-headline text-2xl font-bold text-on-surface tracking-tight leading-none font-mono">
            ₹{analytics.total_current_value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-secondary-container text-on-secondary-container">
            <span>▲ +2.4% today</span>
          </span>
          <span className="text-xs font-medium text-on-surface-variant font-mono">
            {analytics.holdings_count} active assets
          </span>
        </div>
      </div>

      {/* Card 2: Overall Profit / Loss (Exact Stitch Blueprint) */}
      <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/40 shadow-stitch hover:border-outline-variant transition-all">
        <div className="flex items-center justify-between text-on-surface-variant mb-2">
          <span className="text-xs font-label font-medium uppercase tracking-wider">
            Overall Profit / Loss
          </span>
          <TrendingUp className="w-4 h-4 text-outline" />
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className={`font-headline text-2xl font-bold tracking-tight leading-none font-mono ${isProfit ? "text-on-surface" : "text-error"}`}>
            {isProfit ? "+" : ""}₹{analytics.total_pnl.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${isProfit ? "bg-secondary-container text-on-secondary-container" : "bg-error/10 text-error"}`}>
            <span>{isProfit ? "+" : ""}{analytics.total_pnl_percentage.toFixed(2)}% all-time</span>
          </span>
          <span className="text-xs font-medium text-on-surface-variant">Net Yield</span>
        </div>
      </div>

      {/* Card 3: Cash / Invested Basis (Exact Stitch Blueprint) */}
      <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/40 shadow-stitch hover:border-outline-variant transition-all">
        <div className="flex items-center justify-between text-on-surface-variant mb-2">
          <span className="text-xs font-label font-medium uppercase tracking-wider">
            Invested Basis &amp; Liquidity
          </span>
          <DollarSign className="w-4 h-4 text-outline" />
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="font-headline text-2xl font-bold text-on-surface tracking-tight leading-none font-mono">
            ₹{analytics.total_invested.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-on-surface-variant font-medium">8.7% liquidity reserve</span>
          <span className="text-[11px] text-primary font-medium hover:underline cursor-pointer">
            Auto-Invest Active
          </span>
        </div>
      </div>

      {/* Card 4: AI Portfolio Health Score with Circular Radial Meter (Exact Stitch Blueprint) */}
      <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/40 shadow-stitch hover:border-outline-variant transition-all">
        <div className="flex items-center justify-between text-on-surface-variant mb-2">
          <span className="text-xs font-label font-medium uppercase tracking-wider">
            AI Portfolio Health Score
          </span>
          <CheckCircle2 className="w-4 h-4 text-outline" />
        </div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-baseline gap-1">
            <span className="font-headline text-2xl font-bold text-on-surface tracking-tight leading-none font-mono">
              {analytics.diversification_score}
            </span>
            <span className="text-sm font-semibold text-outline">/100</span>
          </div>

          {/* Stitch Circular Progress Radial Meter */}
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e1e2e9"
                strokeWidth="3.5"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#585f6b"
                strokeDasharray={`${Math.min(analytics.diversification_score, 100)}, 100`}
                strokeLinecap="round"
                strokeWidth="3.5"
              />
            </svg>
          </div>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-tertiary-container text-on-tertiary-container">
            {analytics.diversification_score >= 70
              ? "Strong Buy • Balanced Risk"
              : analytics.diversification_score >= 40
              ? "Moderate • Prudent"
              : "Concentrated Exposure"}
          </span>
          <span className="text-[11px] text-on-surface-variant font-medium">Sharpe 2.14</span>
        </div>
      </div>
    </section>
  );
};
