/**
 * Typed API Client for FinSight Backend
 * Base URL defaults to http://127.0.0.1:8000
 */

const API_BASE = "http://127.0.0.1:8000";

export interface User {
  id: number;
  email: string;
  full_name: string;
  primary_broker: string;
  tutorial_completed: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LivePrice {
  ticker: string;
  last_price: number;
  previous_close: number;
  day_high: number;
  day_low: number;
  currency: string;
}

export interface StockSearchResult {
  symbol: string;
  name: string;
  sector: string;
  exchange: string;
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

export interface ParsedBrokerHolding {
  original_name: string;
  ticker: string;
  company_name: string;
  quantity: number;
  avg_buy_price: number;
}

export interface BrokerUploadResponse {
  broker: string;
  holdings: ParsedBrokerHolding[];
  total_detected: number;
  ignored_rows: number;
}

export const authStorage = {
  getToken: (): string | null => localStorage.getItem("finsight_token"),
  setToken: (token: string | null) => {
    if (token) {
      localStorage.setItem("finsight_token", token);
    } else {
      localStorage.removeItem("finsight_token");
    }
  },
  getUser: (): User | null => {
    const raw = localStorage.getItem("finsight_user");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setUser: (user: User | null) => {
    if (user) {
      localStorage.setItem("finsight_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("finsight_user");
    }
  },
  clear: () => {
    localStorage.removeItem("finsight_token");
    localStorage.removeItem("finsight_user");
  },
};

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const token = authStorage.getToken();

  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string> || {}),
  };

  if (!(options?.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
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
  // Auth
  register: async (data: { email: string; password: string; full_name: string; primary_broker?: string }) => {
    const res = await request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    authStorage.setToken(res.access_token);
    authStorage.setUser(res.user);
    return res;
  },

  login: async (data: { email: string; password: string }) => {
    const res = await request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    authStorage.setToken(res.access_token);
    authStorage.setUser(res.user);
    return res;
  },

  getMe: async () => {
    const user = await request<User>("/auth/me");
    authStorage.setUser(user);
    return user;
  },

  completeTutorial: async () => {
    const res = await request<{ message: string; tutorial_completed: boolean }>("/auth/tutorial-complete", {
      method: "POST",
    });
    const current = authStorage.getUser();
    if (current) {
      current.tutorial_completed = true;
      authStorage.setUser(current);
    }
    return res;
  },

  logout: () => {
    authStorage.clear();
  },

  // Health
  checkHealth: () => request<{ status: string }>("/"),

  // Market Data
  getPrice: (ticker: string) => request<LivePrice>(`/price/${encodeURIComponent(ticker)}`),
  getFundamentals: (ticker: string) => request<Fundamentals>(`/fundamentals/${encodeURIComponent(ticker)}`),
  getHistory: (ticker: string, period: string = "3mo") =>
    request<PriceHistoryPoint[]>(`/history/${encodeURIComponent(ticker)}?period=${period}`),
  searchStocks: (query: string) =>
    request<StockSearchResult[]>(`/search/stocks?q=${encodeURIComponent(query)}`),

  // Portfolio
  getPortfolio: () => request<Holding[]>("/portfolio"),
  addHolding: (holding: { ticker: string; quantity: number; avg_buy_price: number; currency?: string }) =>
    request<Holding>("/portfolio", { method: "POST", body: JSON.stringify(holding) }),
  deleteHolding: (id: number) => request<{ message: string }>(`/portfolio/${id}`, { method: "DELETE" }),
  getAnalytics: () => request<PortfolioAnalytics>("/portfolio/analytics"),
  sendWeeklyDigest: () => request<{ sent_to_telegram: boolean; digest: string }>("/portfolio/send-digest", { method: "POST" }),

  // Broker File Upload & Statement Ingestion
  uploadBrokerStatement: async (file: File): Promise<BrokerUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    return request<BrokerUploadResponse>("/portfolio/upload", {
      method: "POST",
      body: formData,
    });
  },

  confirmBrokerImport: async (broker: string, holdings: ParsedBrokerHolding[]) => {
    return request<{ message: string; imported_count: number; holdings: Holding[] }>("/portfolio/import-confirm", {
      method: "POST",
      body: JSON.stringify({ broker, holdings }),
    });
  },

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
