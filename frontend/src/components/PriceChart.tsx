import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { api, type PriceHistoryPoint } from "../api/client";
import { Loader2 } from "lucide-react";

interface PriceChartProps {
  ticker: string;
}

const PERIODS = [
  { label: "1W", value: "5d" },
  { label: "1M", value: "1mo" },
  { label: "3M", value: "3mo" },
  { label: "6M", value: "6mo" },
  { label: "1Y", value: "1y" },
  { label: "5Y", value: "5y" },
];

export const PriceChart: React.FC<PriceChartProps> = ({ ticker }) => {
  const [period, setPeriod] = useState<string>("3mo");
  const [data, setData] = useState<PriceHistoryPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const history = await api.getHistory(ticker, period);
        if (isMounted) {
          setData(history);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to load price history");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (ticker) {
      fetchHistory();
    }

    return () => {
      isMounted = false;
    };
  }, [ticker, period]);

  const isPositive =
    data.length >= 2 ? data[data.length - 1].Close >= data[0].Close : true;
  const strokeColor = isPositive ? "#059669" : "#DC2626";
  const gradientId = `priceGrad-${ticker}-${period}`;

  const minPrice =
    data.length > 0 ? Math.min(...data.map((d) => d.Low || d.Close)) * 0.98 : 0;
  const maxPrice =
    data.length > 0 ? Math.max(...data.map((d) => d.High || d.Close)) * 1.02 : 100;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Period Selector Tabs */}
      <div className="flex items-center justify-between pb-3">
        <span className="text-xs font-bold text-ink-muted uppercase tracking-wider">Historical Performance</span>
        <div className="flex items-center bg-surface-subtle border border-border rounded-lg p-0.5 shadow-2xs">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                period === p.value
                  ? "bg-surface text-ink shadow-xs"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 w-full min-h-[220px] relative flex items-center justify-center">
        {loading ? (
          <div className="flex items-center gap-2 text-ink-muted text-xs font-medium">
            <Loader2 className="animate-spin text-brand-accent" size={16} />
            <span>Loading historical quotes...</span>
          </div>
        ) : error ? (
          <div className="text-loss text-xs text-center p-4 font-medium">
            <p>{error}</p>
          </div>
        ) : data.length === 0 ? (
          <div className="text-ink-muted text-xs text-center p-4 font-medium">
            No historical data found for {ticker}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="Date"
                tickFormatter={formatDate}
                stroke="#64748B"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: "#E2E8F0" }}
              />
              <YAxis
                domain={[minPrice, maxPrice]}
                stroke="#64748B"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: "#E2E8F0" }}
                tickFormatter={(val) => `₹${val.toFixed(0)}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const pt = payload[0].payload as PriceHistoryPoint;
                    return (
                      <div className="bg-surface border border-border p-3 rounded-lg shadow-md text-xs font-mono">
                        <p className="text-ink-muted text-[11px] mb-1 font-sans font-medium">
                          {new Date(pt.Date).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p className="font-bold text-ink text-sm">Close: ₹{pt.Close.toFixed(2)}</p>
                        <div className="text-[11px] text-ink-muted flex gap-3 mt-1 font-sans">
                          <span>H: ₹{pt.High.toFixed(2)}</span>
                          <span>L: ₹{pt.Low.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="Close"
                stroke={strokeColor}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#${gradientId})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
