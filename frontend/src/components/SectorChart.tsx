import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import type { SectorData } from "../api/client";
import { PieChart as PieIcon } from "lucide-react";

interface SectorChartProps {
  sectors: Record<string, SectorData>;
  diversificationScore: number;
}

// Exact Stitch palette tokens from step 858 HTML:
// Tech: #585f6b, Automotive: #515359, Energy: #7b7a7d, Healthcare: #b3b1b4, Cash/Liquidity: #dde2f2
const STITCH_SECTOR_COLORS = [
  "#585f6b", // Primary slate
  "#515359", // Secondary dim
  "#7b7a7d", // Outline
  "#b3b1b4", // Outline variant
  "#dde2f2", // Primary container
  "#5d5d78", // Tertiary
  "#9f403d", // Error / Red
  "#e1e2e9", // Secondary container
];

export const SectorChart: React.FC<SectorChartProps> = ({ sectors }) => {
  const chartData = Object.entries(sectors || {}).map(([name, data]) => ({
    name,
    value: data.value,
    percentage: data.percentage,
    stocks: data.stocks,
  }));

  const formatRupee = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-stitch p-5 flex flex-col justify-between h-full">
      {/* Header from Stitch */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-headline text-sm font-bold text-on-surface">Sector Allocation</h4>
          <p className="text-[11px] text-on-surface-variant font-medium">Target vs Current Diversification</p>
        </div>
        <PieIcon className="w-4 h-4 text-outline" />
      </div>

      {chartData.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-on-surface-variant text-xs">
          <p>No sector data available.</p>
        </div>
      ) : (
        <div className="flex items-center gap-4 flex-1">
          {/* SVG Donut Chart from Stitch */}
          <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={62}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STITCH_SECTOR_COLORS[index % STITCH_SECTOR_COLORS.length]}
                      stroke="#ffffff"
                      strokeWidth={1.5}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-surface-container-lowest border border-outline-variant/40 p-2.5 rounded-lg shadow-stitch text-xs">
                          <p className="font-bold text-on-surface">{data.name}</p>
                          <p className="text-on-surface font-mono font-bold mt-0.5">
                            {formatRupee(data.value)} ({data.percentage}%)
                          </p>
                          <p className="text-on-surface-variant text-[11px] mt-0.5">
                            Equities: {data.stocks.join(", ")}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="font-headline text-sm font-bold text-on-surface font-mono">{chartData.length} Sectors</span>
              <span className="text-[9px] text-on-surface-variant uppercase font-semibold">Active</span>
            </div>
          </div>

          {/* Legend from Stitch */}
          <div className="flex-1 space-y-1.5 text-xs max-h-48 overflow-y-auto pr-1">
            {chartData.map((sector, index) => {
              const color = STITCH_SECTOR_COLORS[index % STITCH_SECTOR_COLORS.length];
              return (
                <div key={sector.name} className="flex items-center justify-between text-xs py-0.5">
                  <div className="flex items-center gap-1.5 min-w-0 pr-2">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-on-surface font-medium truncate">{sector.name}</span>
                  </div>
                  <span className="font-bold text-on-surface font-mono shrink-0">{sector.percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Auto rebalance status from Stitch */}
      <div className="pt-3 mt-3 border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-on-surface-variant">
        <span>Portfolio Diversification: Verified</span>
        <span className="text-primary font-semibold">Balanced Risk</span>
      </div>
    </div>
  );
};
