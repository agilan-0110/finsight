import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import type { SectorData } from "../api/client";
import { PieChart as PieIcon, ShieldCheck, ShieldAlert } from "lucide-react";

interface SectorChartProps {
  sectors: Record<string, SectorData>;
  diversificationScore: number;
}

const PALETTE = [
  "#2563EB", // Royal Blue
  "#059669", // Emerald
  "#7C3AED", // Violet
  "#D97706", // Amber
  "#0891B2", // Cyan
  "#DB2777", // Pink
  "#4F46E5", // Indigo
  "#0D9488", // Teal
  "#EA580C", // Orange
  "#64748B", // Slate
];

export const SectorChart: React.FC<SectorChartProps> = ({ sectors, diversificationScore }) => {
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

  const getDiversificationStatus = (score: number) => {
    if (score >= 70) return { label: "High Diversification", color: "text-profit border-profit-border bg-profit-bg", icon: ShieldCheck };
    if (score >= 40) return { label: "Moderate Diversification", color: "text-warning border-warning-border bg-warning-bg", icon: ShieldAlert };
    return { label: "Concentrated Exposure", color: "text-loss border-loss-border bg-loss-bg", icon: ShieldAlert };
  };

  const status = getDiversificationStatus(diversificationScore);
  const StatusIcon = status.icon;

  return (
    <div className="bg-surface border border-border rounded-xl p-5 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-brand-light text-brand-accent">
            <PieIcon size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-ink uppercase tracking-wider">
              Sector Allocation
            </h3>
            <p className="text-xs text-ink-muted font-medium">Portfolio exposure distribution</p>
          </div>
        </div>

        {/* Diversification Score Badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${status.color}`}>
          <StatusIcon size={13} />
          <span>Score: {diversificationScore}/100</span>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-ink-muted text-xs font-medium">
          <p>No sector data available.</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center gap-6 pt-4 flex-1">
          {/* Donut Chart */}
          <div className="w-full md:w-1/2 h-52 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PALETTE[index % PALETTE.length]}
                      stroke="#FFFFFF"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-surface border border-border p-3 rounded-lg shadow-md text-xs">
                          <p className="font-bold text-ink">{data.name}</p>
                          <p className="text-brand-accent font-mono font-bold mt-0.5">{formatRupee(data.value)} ({data.percentage}%)</p>
                          <p className="text-ink-muted text-[11px] font-medium mt-1">
                            Stocks: {data.stocks.join(", ")}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center pointer-events-none">
              <span className="text-[10px] uppercase font-bold text-ink-muted tracking-wider">Sectors</span>
              <p className="text-sm font-bold text-ink font-mono">{chartData.length}</p>
            </div>
          </div>

          {/* Breakdown List */}
          <div className="w-full md:w-1/2 space-y-2 max-h-56 overflow-y-auto pr-1">
            {chartData.map((sector, index) => {
              const color = PALETTE[index % PALETTE.length];
              return (
                <div
                  key={sector.name}
                  className="p-2.5 rounded-lg bg-surface-subtle border border-border/80 hover:border-border transition-colors text-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <div className="truncate">
                      <p className="font-semibold text-ink truncate">{sector.name}</p>
                      <p className="text-[11px] text-ink-muted font-medium truncate">
                        {sector.stocks.join(", ")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="font-mono font-bold text-ink">{sector.percentage}%</p>
                    <p className="font-mono text-[11px] text-ink-muted">{formatRupee(sector.value)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
