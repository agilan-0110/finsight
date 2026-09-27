import React from "react";
import { TrendingUp, TrendingDown, DollarSign, PieChart, ShieldAlert, Award } from "lucide-react";
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
          <div key={i} className="h-28 rounded-xl bg-surface border border-border animate-pulse shadow-card" />
        ))}
      </div>
    );
  }

  const isProfit = analytics.total_pnl >= 0;

  return (
    <div className="space-y-4">
      {/* 4 Executive KPI Metric Cards (Stitch FinSight Light Theme) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Portfolio Value */}
        <div className="p-5 rounded-xl bg-surface border border-border shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between text-ink-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              Portfolio Valuation
            </span>
            <div className="p-1.5 rounded-md bg-surface-subtle text-ink border border-border">
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-ink tracking-tight">
            ₹{analytics.total_current_value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-ink-muted font-medium mt-1.5 flex items-center justify-between">
            <span>{analytics.holdings_count} active position{analytics.holdings_count === 1 ? "" : "s"}</span>
            <span className="text-[11px] font-semibold text-profit bg-profit-bg px-2 py-0.5 rounded border border-profit-border">
              NSE Live
            </span>
          </div>
        </div>

        {/* Overall Profit / Loss */}
        <div className="p-5 rounded-xl bg-surface border border-border shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between text-ink-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              Unrealized Return
            </span>
            <div className={`p-1.5 rounded-md border ${isProfit ? "bg-profit-bg text-profit border-profit-border" : "bg-loss-bg text-loss border-loss-border"}`}>
              {isProfit ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            </div>
          </div>
          <div className={`text-2xl font-extrabold font-mono tracking-tight ${isProfit ? "text-profit" : "text-loss"}`}>
            {isProfit ? "+" : ""}₹{analytics.total_pnl.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                isProfit
                  ? "bg-profit-bg text-profit border-profit-border"
                  : "bg-loss-bg text-loss border-loss-border"
              }`}
            >
              {isProfit ? "▲ +" : "▼ "}
              {analytics.total_pnl_percentage.toFixed(2)}%
            </span>
            <span className="text-xs text-ink-muted font-medium">all-time yield</span>
          </div>
        </div>

        {/* Invested Capital */}
        <div className="p-5 rounded-xl bg-surface border border-border shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between text-ink-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              Cost Basis
            </span>
            <div className="p-1.5 rounded-md bg-surface-subtle text-ink-muted border border-border">
              <PieChart className="w-4 h-4 text-slate-600" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-ink tracking-tight">
            ₹{analytics.total_invested.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-ink-muted font-medium mt-1.5">
            Committed capital basis
          </div>
        </div>

        {/* AI Health & Diversification Score */}
        <div className="p-5 rounded-xl bg-surface border border-border shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between text-ink-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              AI Health Score
            </span>
            <div className="p-1.5 rounded-md bg-brand-light text-brand-accent border border-brand-border">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-mono text-ink tracking-tight">
              {analytics.diversification_score}
            </span>
            <span className="text-xs font-semibold text-ink-muted">/100</span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ml-auto ${
              analytics.diversification_score >= 70
                ? "bg-profit-bg text-profit border-profit-border"
                : analytics.diversification_score >= 40
                ? "bg-warning-bg text-warning border-warning-border"
                : "bg-loss-bg text-loss border-loss-border"
            }`}>
              {analytics.diversification_score >= 70
                ? "Strong"
                : analytics.diversification_score >= 40
                ? "Balanced"
                : "Concentrated"}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-surface-subtle border border-border h-2 rounded-full mt-3 overflow-hidden">
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
        <div className="p-4 rounded-xl bg-warning-bg border border-warning-border flex items-start gap-3 shadow-card">
          <ShieldAlert className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold text-warning tracking-wide uppercase text-[11px]">
              AI Portfolio Health Observations
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
