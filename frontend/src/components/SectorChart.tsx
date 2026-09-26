import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import type { SectorData } from "../api/client";
import { PieChart as PieIcon, ShieldCheck, ShieldAlert } from "lucide-react";

interface SectorChartProps {
  sectors: Record<string, SectorData>;
  diversificationScore: number;
}

const PALETTE = [
  "#38BDF8", // Cyan
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#8B5CF6", // Purple
  "#F59E0B", // Amber
  "#EC4899", // Pink
  "#06B6D4", // Sky
  "#6366F1", // Indigo
  "#14B8A6", // Teal
  "#F97316", // Orange
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
    if (score >= 70) return { label: "High Diversification", color: "text-profit border-profit/30 bg-profit-bg", icon: ShieldCheck };
    if (score >= 40) return { label: "Moderate Diversification", color: "text-warning border-warning/30 bg-warning-bg", icon: ShieldAlert };
    return { label: "Concentrated Exposure", color: "text-loss border-loss/30 bg-loss-bg", icon: ShieldAlert };
  };

  const status = getDiversificationStatus(diversificationScore);
  const StatusIcon = status.icon;

  return (
    <div className="bg-slate-850 border border-slate-750 rounded-xl p-5 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-750/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-accent-bg text-accent">
            <PieIcon size={16} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
              Sector Allocation
            </h3>
            <p className="text-xs text-slate-400">Portfolio exposure distribution</p>
          </div>
        </div>

        {/* Diversification Score Badge */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${status.color}`}>
          <StatusIcon size={13} />
          <span>Score: {diversificationScore}/100</span>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-slate-400 text-sm">
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
                      stroke="#161F30"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs">
                          <p className="font-semibold text-slate-100">{data.name}</p>
                          <p className="text-accent font-mono mt-0.5">{formatRupee(data.value)} ({data.percentage}%)</p>
                          <p className="text-slate-400 text-[10px] mt-1">
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
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sectors</span>
              <p className="text-sm font-bold text-slate-100 font-mono">{chartData.length}</p>
            </div>
          </div>

          {/* Breakdown List */}
          <div className="w-full md:w-1/2 space-y-2 max-h-56 overflow-y-auto pr-1">
            {chartData.map((sector, index) => {
              const color = PALETTE[index % PALETTE.length];
              return (
                <div
                  key={sector.name}
                  className="p-2 rounded-lg bg-slate-900/60 border border-slate-750/50 hover:border-slate-650 transition-colors text-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <div className="truncate">
                      <p className="font-medium text-slate-200 truncate">{sector.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {sector.stocks.join(", ")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="font-mono font-semibold text-slate-100">{sector.percentage}%</p>
                    <p className="font-mono text-[10px] text-slate-400">{formatRupee(sector.value)}</p>
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
