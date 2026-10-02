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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm">
        <div>
          <h1 className="font-headline text-2xl font-bold text-on-surface">
            Portfolio Health &amp; Holdings 📊
          </h1>
          <p className="font-body text-xs text-on-surface-variant">
            Track real-time market value, plain-English diversification health, and risk exposure.
          </p>
        </div>

        <button
          onClick={onOpenBrokerUpload}
          className="px-4 py-2.5 rounded-xl bg-primary text-on-primary font-label text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Import Broker Statement</span>
        </button>
      </div>

      {/* 1. Executive Summary Metric Banner */}
      <PortfolioSummary analytics={analytics} loading={loading} />

      {/* 2. Plain-English Portfolio Explanation Card */}
      {holdingsCount > 0 && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-surface-container-lowest to-surface-container-low border border-primary/20 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary font-headline font-bold text-sm">
              <Shield className="w-4 h-4" />
              <span>Plain-English Portfolio Health Analysis</span>
            </div>
            <button
              onClick={() => onOpenExplain("diversification")}
              className="text-xs font-label text-primary font-semibold hover:underline flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>What is Diversification?</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-body">
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-1">
              <span className="font-headline font-bold text-on-surface block">
                Investments &amp; Sectors
              </span>
              <p className="text-on-surface-variant leading-relaxed">
                Your portfolio contains <strong className="text-on-surface">{holdingsCount} investments</strong> spread across{" "}
                <strong className="text-on-surface">{sectorCount} independent sectors</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-1">
              <span className="font-headline font-bold text-on-surface block">
                Largest Sector Concentration
              </span>
              <p className="text-on-surface-variant leading-relaxed">
                Your largest sector (<strong className="text-on-surface">{largestSectorName}</strong>) represents{" "}
                <strong className={largestSectorPercent > 40 ? "text-error" : "text-primary"}>
                  {largestSectorPercent.toFixed(1)}%
                </strong>{" "}
                of your equity holdings.
                {largestSectorPercent > 40 ? " ⚠️ High concentration risk." : " Balanced exposure."}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-1">
              <span className="font-headline font-bold text-on-surface block">
                Largest Single Position
              </span>
              <p className="text-on-surface-variant leading-relaxed">
                Your largest individual holding (<strong className="text-on-surface">{largestHoldingName}</strong>) represents{" "}
                <strong className={largestHoldingWeight > 25 ? "text-error" : "text-gain"}>
                  {largestHoldingWeight.toFixed(1)}%
                </strong>{" "}
                of your total portfolio capital.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-outline-variant/20 text-xs">
            <p className="font-body text-on-surface-variant">
              💡 <strong>Recommendation:</strong> A resilient portfolio limits any single company to &lt;15% and any single sector to &lt;30%.
            </p>
            <button
              onClick={() => onAskAI("Analyze my portfolio diversification and tell me what risks I should be aware of as a beginner.")}
              className="text-primary font-label font-semibold inline-flex items-center gap-1 hover:underline whitespace-nowrap"
            >
              <span>Ask AI Tutor to Review Health</span>
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
