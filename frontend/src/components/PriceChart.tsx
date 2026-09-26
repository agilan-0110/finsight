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
  const strokeColor = isPositive ? "#10B981" : "#EF4444";
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
        <span className="text-xs font-medium text-slate-400">Historical Performance</span>
        <div className="flex items-center bg-slate-900 border border-slate-750 rounded-lg p-0.5">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                period === p.value
                  ? "bg-slate-750 text-slate-100 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
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
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Loader2 className="animate-spin" size={16} />
            <span>Loading historical quotes...</span>
          </div>
        ) : error ? (
          <div className="text-loss text-xs text-center p-4">
            <p>{error}</p>
          </div>
        ) : data.length === 0 ? (
          <div className="text-slate-400 text-xs text-center p-4">
            No historical data found for {ticker}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="Date"
                tickFormatter={formatDate}
                stroke="#475569"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: "#223049" }}
              />
              <YAxis
                domain={[minPrice, maxPrice]}
                stroke="#475569"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: "#223049" }}
                tickFormatter={(val) => `₹${val.toFixed(0)}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const pt = payload[0].payload as PriceHistoryPoint;
                    return (
                      <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs font-mono">
                        <p className="text-slate-400 text-[10px] mb-1">
                          {new Date(pt.Date).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p className="font-bold text-slate-100">Close: ₹{pt.Close.toFixed(2)}</p>
                        <div className="text-[10px] text-slate-400 flex gap-2 mt-1">
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
