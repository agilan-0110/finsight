/**
 * Typed API Client for FinSight Backend
 * Base URL defaults to http://127.0.0.1:8000
 */

const API_BASE = "http://127.0.0.1:8000";

export interface LivePrice {
  ticker: string;
  last_price: number;
  previous_close: number;
  day_high: number;
  day_low: number;
  currency: string;
}

export interface Fundamentals {
  ticker: string;
  name: string;
  sector: string;
  pe_ratio: number | null;
  roe: number | null;
  debt_to_equity: number | null;
  market_cap: number | null;
}

export interface PriceHistoryPoint {
  Date: string;
  Open: number;
  High: number;
  Low: number;
  Close: number;
  Volume: number;
}

export interface Holding {
  id: number;
  ticker: string;
  quantity: number;
  avg_buy_price: number;
  currency: string;
  added_at: string | null;
}

export interface AnalyticsHolding {
  id: number;
  ticker: string;
  quantity: number;
  avg_buy_price: number;
  current_price: number;
  invested_value: number;
  current_value: number;
  pnl: number;
  pnl_percentage: number;
  portfolio_weight: number;
  sector: string;
  pe_ratio: number | null;
  roe: number | null;
}

export interface SectorData {
  value: number;
  percentage: number;
  stocks: string[];
}

export interface PortfolioAnalytics {
  total_invested: number;
  total_current_value: number;
  total_pnl: number;
  total_pnl_percentage: number;
  holdings_count: number;
  holdings: AnalyticsHolding[];
  sectors: Record<string, SectorData>;
  risk_flags: string[];
  diversification_score: number;
}

export interface ChatMessage {
  id?: number;
  role: "user" | "assistant";
  message: string;
  timestamp?: string;
}

export interface AlertItem {
  id: number;
  ticker: string;
  condition: "above" | "below";
  threshold: number;
  active: boolean;
  created_at: string;
}

export interface MemoryItem {
  id: string;
  memory: string;
  category: string;
  created_at: string | null;
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    let errDetail = `HTTP ${res.status}`;
    try {
      const errJson = await res.json();
      errDetail = errJson.detail || errJson.message || JSON.stringify(errJson);
    } catch {
      // ignore
    }
    throw new Error(errDetail);
  }

  return res.json();
}

export const api = {
  // Health
  checkHealth: () => request<{ status: string }>("/"),

  // Market Data
  getPrice: (ticker: string) => request<LivePrice>(`/price/${ticker}`),
  getFundamentals: (ticker: string) => request<Fundamentals>(`/fundamentals/${ticker}`),
  getHistory: (ticker: string, period: string = "3mo") =>
    request<PriceHistoryPoint[]>(`/history/${ticker}?period=${period}`),

  // Portfolio
  getPortfolio: () => request<Holding[]>("/portfolio"),
  addHolding: (holding: { ticker: string; quantity: number; avg_buy_price: number; currency?: string }) =>
    request<Holding>("/portfolio", { method: "POST", body: JSON.stringify(holding) }),
  deleteHolding: (id: number) => request<{ message: string }>(`/portfolio/${id}`, { method: "DELETE" }),
  getAnalytics: () => request<PortfolioAnalytics>("/portfolio/analytics"),
  sendWeeklyDigest: () => request<{ sent_to_telegram: boolean; digest: string }>("/portfolio/send-digest", { method: "POST" }),

  // Chat
  sendMessage: (message: string) =>
    request<{ response: string }>("/chat", { method: "POST", body: JSON.stringify({ message }) }),
  getChatHistory: (limit: number = 30) => request<ChatMessage[]>(`/chat/history?limit=${limit}`),
  clearChatHistory: () => request<{ message: string }>("/chat/history", { method: "DELETE" }),

  // Alerts
  getActiveAlerts: () => request<AlertItem[]>("/alerts"),
  getAlertHistory: () => request<AlertItem[]>("/alerts/history"),
  createAlert: (alert: { ticker: string; condition: string; threshold: number }) =>
    request<AlertItem>("/alerts", { method: "POST", body: JSON.stringify(alert) }),
  deleteAlert: (id: number) => request<{ message: string }>(`/alerts/${id}`, { method: "DELETE" }),
  checkAlertsNow: () => request<{ checked: boolean; triggered_count: number; triggered: any[] }>("/alerts/check-now", { method: "POST" }),

  // Memories
  getMemories: () => request<MemoryItem[]>("/memories"),
  createMemory: (memory: { memory: string; category?: string }) =>
    request<{ id: string; message: string }>("/memories", { method: "POST", body: JSON.stringify(memory) }),
  deleteMemory: (id: string) => request<{ message: string }>(`/memories/${id}`, { method: "DELETE" }),
  clearMemories: () => request<{ message: string }>("/memories", { method: "DELETE" }),
};
