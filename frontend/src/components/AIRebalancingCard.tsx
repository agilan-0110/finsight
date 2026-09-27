import React, { useState } from "react";
import { Scale, CheckCircle2, ArrowRight, Zap } from "lucide-react";

interface Props {
  onAskAI?: (ticker: string) => void;
}

export const AIRebalancingCard: React.FC<Props> = ({ onAskAI }) => {
  const [executed, setExecuted] = useState<Record<number, boolean>>({});

  const recommendations = [
    {
      id: 1,
      title: "Trim Nvidia / Tech exposure by 4%",
      detail: "Locks in +44.5% gains and maintains technology allocation below the 40% prudent risk ceiling.",
      ticker: "NVDA",
      actionText: "Execute",
      badge: "Profit Lock",
      badgeColor: "bg-profit-bg text-profit border-profit-border",
    },
    {
      id: 2,
      title: "Accumulate Tata Motors on EV breakout",
      detail: "Resistance test at ₹1,040 with volume surge. Recommended deployment of 3.5% reserve liquidity.",
      ticker: "TATAMOTORS",
      actionText: "Deploy",
      badge: "Alpha Entry",
      badgeColor: "bg-brand-light text-brand-accent border-brand-border",
    },
  ];

  const handleAction = (id: number, ticker: string) => {
    setExecuted((prev) => ({ ...prev, [id]: true }));
    if (onAskAI) {
      onAskAI(ticker);
    }
  };

  return (
    <div className="bg-surface rounded-xl border border-border shadow-card p-5 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-brand-light text-brand-accent border border-brand-border">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-headline text-sm font-bold text-ink">
                AI Rebalancing Engine
              </h4>
              <p className="text-[11px] text-ink-muted">Tactical algorithmic re-weighting signals</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-light text-brand-accent border border-brand-border">
            2 Signals Active
          </span>
        </div>

        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-3 rounded-lg bg-surface-subtle border border-border hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-ink">{rec.title}</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${rec.badgeColor}`}>
                    {rec.badge}
                  </span>
                </div>
                <p className="text-[11px] text-ink-muted leading-relaxed font-normal">
                  {rec.detail}
                </p>
              </div>

              <button
                onClick={() => handleAction(rec.id, rec.ticker)}
                disabled={executed[rec.id]}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow-xs ${
                  executed[rec.id]
                    ? "bg-profit-bg text-profit border border-profit-border"
                    : "bg-brand hover:bg-slate-700 text-white"
                }`}
              >
                {executed[rec.id] ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Analyzed</span>
                  </>
                ) : (
                  <>
                    <span>{rec.actionText}</span>
                    <ArrowRight className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-border flex items-center justify-between text-[11px] text-ink-muted">
        <span className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Scheduled dynamic rebalance check: 4 days</span>
        </span>
        <span className="font-semibold text-brand-accent">Automatic Guardrails Active</span>
      </div>
    </div>
  );
};
