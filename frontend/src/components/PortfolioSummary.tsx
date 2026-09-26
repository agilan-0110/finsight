import React from "react";
import { TrendingUp, TrendingDown, DollarSign, PieChart, ShieldAlert } from "lucide-react";
import type { PortfolioAnalytics } from "../api/client";

interface Props {
  analytics: PortfolioAnalytics | null;
  loading: boolean;
}

export const PortfolioSummary: React.FC<Props> = ({ analytics, loading }) => {
  if (loading || !analytics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-xl bg-surface border border-border animate-pulse shadow-xs" />
        ))}
      </div>
    );
  }

  const isProfit = analytics.total_pnl >= 0;

  return (
    <div className="mb-6 space-y-4">
      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Value */}
        <div className="p-5 rounded-xl bg-surface border border-border shadow-xs relative">
          <div className="flex items-center justify-between text-ink-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Portfolio Value</span>
            <div className="p-1.5 rounded-md bg-brand-light text-brand-accent">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-ink tracking-tight">
            ₹{analytics.total_current_value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-ink-muted font-medium mt-1">
            {analytics.holdings_count} active position{analytics.holdings_count === 1 ? "" : "s"}
          </div>
        </div>

        {/* Net Unrealized P&L */}
        <div className="p-5 rounded-xl bg-surface border border-border shadow-xs relative">
          <div className="flex items-center justify-between text-ink-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Unrealized P&L</span>
            <div className={`p-1.5 rounded-md ${isProfit ? "bg-profit-bg text-profit" : "bg-loss-bg text-loss"}`}>
              {isProfit ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            </div>
          </div>
          <div className={`text-2xl font-bold font-mono tracking-tight ${isProfit ? "text-profit" : "text-loss"}`}>
            {isProfit ? "+" : ""}₹{analytics.total_pnl.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md border ${
                isProfit
                  ? "bg-profit-bg text-profit border-profit-border"
                  : "bg-loss-bg text-loss border-loss-border"
              }`}
            >
              {isProfit ? "▲ +" : "▼ "}
              {analytics.total_pnl_percentage.toFixed(2)}%
            </span>
            <span className="text-xs text-ink-muted font-medium">total return</span>
          </div>
        </div>

        {/* Invested Capital */}
        <div className="p-5 rounded-xl bg-surface border border-border shadow-xs relative">
          <div className="flex items-center justify-between text-ink-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Invested Capital</span>
            <div className="p-1.5 rounded-md bg-surface-subtle text-ink-muted">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-ink tracking-tight">
            ₹{analytics.total_invested.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-ink-muted font-medium mt-1">Cost basis across all holdings</div>
        </div>

        {/* Diversification Score */}
        <div className="p-5 rounded-xl bg-surface border border-border shadow-xs relative">
          <div className="flex items-center justify-between text-ink-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Diversification</span>
            <span className="text-xs font-mono font-bold text-brand-accent">
              {analytics.diversification_score}/100
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-ink tracking-tight">
            {analytics.diversification_score >= 70
              ? "Strong"
              : analytics.diversification_score >= 40
              ? "Moderate"
              : "Concentrated"}
          </div>
          {/* Progress bar */}
          <div className="w-full bg-surface-subtle border border-border h-2 rounded-full mt-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                analytics.diversification_score >= 70
                  ? "bg-profit"
                  : analytics.diversification_score >= 40
                  ? "bg-warning"
                  : "bg-loss"
              }`}
              style={{ width: `${Math.min(analytics.diversification_score, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Health / Risk Observations Banner */}
      {analytics.risk_flags && analytics.risk_flags.length > 0 && (
        <div className="p-4 rounded-xl bg-warning-bg border border-warning-border flex items-start gap-3 shadow-xs">
          <ShieldAlert className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold text-warning tracking-wide uppercase text-[11px]">
              Portfolio Health Observations
            </span>
            <ul className="text-ink-secondary font-medium list-disc list-inside space-y-0.5">
              {analytics.risk_flags.map((flag, idx) => (
                <li key={idx} className="leading-relaxed">
                  {flag}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
