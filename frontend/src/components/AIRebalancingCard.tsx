import React, { useState } from "react";
import { Scale, CheckCircle2 } from "lucide-react";

interface Props {
  onAskAI?: (ticker: string) => void;
}

export const AIRebalancingCard: React.FC<Props> = ({ onAskAI }) => {
  const [executed, setExecuted] = useState<Record<number, boolean>>({});

  const recommendations = [
    {
      id: 1,
      title: "Trim Nvidia exposure by 4%",
      detail: "Locks in +44.5% gains and keeps tech concentration below 40% risk ceiling.",
      ticker: "NVDA",
      btnText: "Execute",
      btnClass: "bg-secondary text-on-secondary hover:bg-secondary-dim",
      indicatorClass: "bg-secondary",
    },
    {
      id: 2,
      title: "Accumulate Tata Motors on EV breakout",
      detail: "Target ₹1,040 resistance level. Deploy 3.5% of reserve liquidity.",
      ticker: "TATAMOTORS",
      btnText: "Deploy",
      btnClass: "bg-primary text-on-primary hover:bg-primary-dim",
      indicatorClass: "bg-primary",
    },
  ];

  const handleAction = (id: number, ticker: string) => {
    setExecuted((prev) => ({ ...prev, [id]: true }));
    if (onAskAI) {
      onAskAI(ticker);
    }
  };

  return (
    <div id="rebalance-section" className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-stitch p-5 flex flex-col justify-between h-full">
      <div>
        {/* Header from Stitch */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-primary" />
            <h4 className="font-headline text-sm font-bold text-on-surface">
              AI Rebalancing Engine
            </h4>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-tertiary-container text-on-tertiary-container">
            2 Actions Ready
          </span>
        </div>

        {/* Recommendations list from Stitch */}
        <div className="space-y-2.5">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 flex items-start justify-between gap-3"
            >
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${rec.indicatorClass}`}></span>
                  <span>{rec.title}</span>
                </div>
                <p className="text-[11px] text-on-surface-variant font-normal leading-relaxed">
                  {rec.detail}
                </p>
              </div>

              <button
                onClick={() => handleAction(rec.id, rec.ticker)}
                disabled={executed[rec.id]}
                className={`shrink-0 px-2.5 py-1 rounded text-[11px] font-semibold transition-colors shadow-xs ${
                  executed[rec.id]
                    ? "bg-secondary-container text-on-secondary-container"
                    : rec.btnClass
                }`}
              >
                {executed[rec.id] ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Sent
                  </span>
                ) : (
                  rec.btnText
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer from Stitch */}
      <div className="pt-3 mt-3 border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-on-surface-variant">
        <span>Auto-Rebalance scheduled in 4 days</span>
        <span className="text-primary font-semibold hover:underline cursor-pointer">Config Rules</span>
      </div>
    </div>
  );
};
