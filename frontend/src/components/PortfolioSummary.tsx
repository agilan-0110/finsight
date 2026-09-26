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
          <div key={i} className="h-28 rounded-xl bg-slate-850/60 border border-slate-750 animate-pulse" />
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
        <div className="p-4 rounded-xl bg-slate-850 border border-slate-750 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium uppercase tracking-wider">Portfolio Value</span>
            <DollarSign className="w-4 h-4 text-accent" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-50 tracking-tight">
            ₹{analytics.total_current_value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {analytics.holdings_count} active position{analytics.holdings_count === 1 ? "" : "s"}
          </div>
        </div>

        {/* Net Unrealized P&L */}
        <div className="p-4 rounded-xl bg-slate-850 border border-slate-750 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium uppercase tracking-wider">Unrealized P&L</span>
            {isProfit ? (
              <TrendingUp className="w-4 h-4 text-profit" />
            ) : (
              <TrendingDown className="w-4 h-4 text-loss" />
            )}
          </div>
          <div className={`text-2xl font-bold font-mono tracking-tight ${isProfit ? "text-profit" : "text-loss"}`}>
            {isProfit ? "+" : ""}₹{analytics.total_pnl.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span
              className={`text-xs font-mono font-semibold px-1.5 py-0.5 rounded ${
                isProfit ? "bg-profit-bg text-profit" : "bg-loss-bg text-loss"
              }`}
            >
              {isProfit ? "▲ +" : "▼ "}
              {analytics.total_pnl_percentage.toFixed(2)}%
            </span>
            <span className="text-xs text-slate-400">total return</span>
          </div>
        </div>

        {/* Invested Capital */}
        <div className="p-4 rounded-xl bg-slate-850 border border-slate-750 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium uppercase tracking-wider">Invested Capital</span>
            <PieChart className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-50 tracking-tight">
            ₹{analytics.total_invested.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-400 mt-1">Cost basis across all holdings</div>
        </div>

        {/* Diversification Score */}
        <div className="p-4 rounded-xl bg-slate-850 border border-slate-750 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium uppercase tracking-wider">Diversification</span>
            <span className="text-xs font-mono font-semibold text-accent">
              {analytics.diversification_score}/100
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-50 tracking-tight">
            {analytics.diversification_score >= 70
              ? "Strong"
              : analytics.diversification_score >= 40
              ? "Moderate"
              : "Low"}
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-750 h-1.5 rounded-full mt-2.5 overflow-hidden">
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
        <div className="p-3.5 rounded-xl bg-warning-bg border border-warning/30 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-semibold text-warning tracking-wide uppercase text-[11px]">
              Portfolio Health Observations
            </span>
            <ul className="text-slate-200 list-disc list-inside space-y-0.5">
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
