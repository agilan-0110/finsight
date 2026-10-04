import React from "react";
import type { PortfolioAnalytics } from "../api/client";
import { PortfolioSummary } from "./PortfolioSummary";
import { PortfolioPerformanceCurve } from "./PortfolioPerformanceCurve";
import { HoldingsTable } from "./HoldingsTable";
import { SectorChart } from "./SectorChart";
import { AIRebalancingCard } from "./AIRebalancingCard";
import {
  Shield,
  UploadCloud,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

interface PortfolioViewProps {
  analytics: PortfolioAnalytics | null;
  loading: boolean;
  onAddHolding: (holding: { ticker: string; quantity: number; avg_buy_price: number }) => Promise<void>;
  onDeleteHolding: (id: number) => Promise<void>;
  onAskAI: (ticker: string) => void;
  onOpenBrokerUpload: () => void;
  onOpenExplain: (termKey: string) => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  analytics,
  loading,
  onAddHolding,
  onDeleteHolding,
  onAskAI,
  onOpenBrokerUpload,
  onOpenExplain,
}) => {
  const holdings = analytics?.holdings || [];
  const sectors = analytics?.sectors || {};
  const sectorCount = Object.keys(sectors).length;
  const holdingsCount = holdings.length;

  // Compute largest single holding percentage
  let largestHoldingName = "None";
  let largestHoldingWeight = 0;
  if (holdings.length > 0) {
    const sorted = [...holdings].sort((a, b) => b.portfolio_weight - a.portfolio_weight);
    largestHoldingName = sorted[0].ticker.replace(".NS", "");
    largestHoldingWeight = sorted[0].portfolio_weight;
  }

  // Compute largest sector percentage
  let largestSectorName = "None";
  let largestSectorPercent = 0;
  if (sectorCount > 0) {
    const sortedSectors = Object.entries(sectors).sort((a, b) => b[1].percentage - a[1].percentage);
    largestSectorName = sortedSectors[0][0];
    largestSectorPercent = sortedSectors[0][1].percentage;
  }

  return (
    <div className="max-w-[1080px] mx-auto space-y-6 py-4 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl font-bold text-on-surface tracking-tight">
            Portfolio Health
          </h1>
          <p className="text-xs sm:text-sm text-secondary">
            Track real-time market value, diversification health, and risk exposure in plain English.
          </p>
        </div>

        <button
          onClick={onOpenBrokerUpload}
          className="px-3.5 py-2 rounded-lg bg-primary hover:bg-primary-dim text-on-primary text-xs font-semibold shadow-stitch-sm transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Import Statement</span>
        </button>
      </div>

      {/* 1. Executive Summary Metric Banner */}
      <PortfolioSummary analytics={analytics} loading={loading} />

      {/* 2. Plain-English Portfolio Explanation Card */}
      {holdingsCount > 0 && (
        <div className="p-5 rounded-xl bg-surface border border-outline-variant/60 shadow-stitch-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wide">
              <Shield className="w-4 h-4" />
              <span>Diversification Health</span>
            </div>
            <button
              onClick={() => onOpenExplain("diversification")}
              className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>What is Diversification?</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/40 space-y-1">
              <span className="font-semibold text-on-surface block">
                Investments &amp; Sectors
              </span>
              <p className="text-secondary leading-relaxed">
                Your portfolio contains <strong className="text-on-surface">{holdingsCount} investments</strong> across{" "}
                <strong className="text-on-surface">{sectorCount} sectors</strong>.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/40 space-y-1">
              <span className="font-semibold text-on-surface block">
                Sector Concentration
              </span>
              <p className="text-secondary leading-relaxed">
                Largest sector (<strong className="text-on-surface">{largestSectorName}</strong>) is{" "}
                <strong className={largestSectorPercent > 40 ? "text-error" : "text-primary"}>
                  {largestSectorPercent.toFixed(1)}%
                </strong>.
                {largestSectorPercent > 40 ? " ⚠️ High concentration." : " Balanced."}
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/40 space-y-1">
              <span className="font-semibold text-on-surface block">
                Largest Position
              </span>
              <p className="text-secondary leading-relaxed">
                Holding (<strong className="text-on-surface">{largestHoldingName}</strong>) represents{" "}
                <strong className={largestHoldingWeight > 25 ? "text-error" : "text-gain"}>
                  {largestHoldingWeight.toFixed(1)}%
                </strong>{" "}
                of total capital.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-outline-variant/40 text-xs">
            <p className="text-secondary">
              💡 <strong className="text-on-surface">Rule of thumb:</strong> Healthy portfolios keep individual companies under 15% and sectors under 30%.
            </p>
            <button
              onClick={() => onAskAI("Analyze my portfolio diversification and tell me what risks I should be aware of as a beginner.")}
              className="text-primary font-semibold inline-flex items-center gap-1 hover:underline whitespace-nowrap"
            >
              <span>Ask AI Tutor Review</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Performance Curve */}
      <PortfolioPerformanceCurve analytics={analytics} />

      {/* 4. Holdings Table */}
      <HoldingsTable
        holdings={analytics?.holdings || []}
        onAddHolding={onAddHolding}
        onDeleteHolding={onDeleteHolding}
        onAskAI={onAskAI}
        onOpenBrokerUpload={onOpenBrokerUpload}
      />

      {/* 5. Sector Allocation & Rebalancing Engine */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectorChart
          sectors={analytics?.sectors || {}}
          diversificationScore={analytics?.diversification_score || 0}
        />
        <AIRebalancingCard onAskAI={onAskAI} />
      </div>
    </div>
  );
};
