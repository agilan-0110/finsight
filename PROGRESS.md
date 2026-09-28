# FinSight — Project Development Progress Log

> **Project:** FinSight — AI Financial Analyst Agent for Indian Equities (NSE / Nifty 500)  
> **Repository:** `agilan-0110/finsight`  
> **Tech Stack:** FastAPI, PostgreSQL, ChromaDB, Groq LPU (`qwen/qwen3.8-27b`), FinBERT, yfinance, Telegram Bot API  
> **Operating Principle:** Strict $0.00 cost, zero paid APIs, zero extra token bloat.

---

## 📅 Session Progress Log: 25-Sep-2026

### 1. Project Audit & Comprehensive Architecture Plan
- **Goal:** Audit existing codebase across Phase 1–4, map out missing components, and plan remaining roadmap.
- **Actions:**
  - Audited all directory structures, database models, CRUD operations, vector store, and chat logic.
  - Authored a comprehensive 9-phase project roadmap artifact detailing completed work and upcoming phases.

---

### 2. Full Bug Audit & Codebase Debugging
- **Goal:** Identify and fix all runtime, syntax, encoding, and logic errors in existing files.
- **Issues Fixed:**
  1. **Groq Model 404:** Hardcoded `llama-3.3-70b-versatile` was unavailable on the user's account. Switched to `qwen/qwen3.8-27b` with automatic fallback to `openai/gpt-oss-120b` and configurable `GROQ_MODEL` env variable.
  2. **Windows cp1252 Unicode Crash:** When outputting the Indian Rupee symbol (`₹`), Windows consoles crashed with `UnicodeEncodeError`. Configured `sys.stdout.reconfigure(encoding='utf-8')` across all modules.
  3. **Yahoo Search Query Sanitization:** `lookup_ticker_dynamic()` previously passed whole sentences into Yahoo Search and returned `[]`. Built `_extract_query_candidates()` to clean conversational filler and extract core entity names.
  4. **Single-Stock Market Context:** When asking about individual stocks outside portfolio/news context, FinSight lacked price data. Added `build_stock_context(ticker)` to supply real-time price snapshot and valuation ratios.
  5. **History Endpoint Error Handling:** Updated `get_price_history()` in `data_fetch.py` to raise `ValueError` on empty results and added 404 error handling in `main.py`.
  6. **FastAPI Modernization & CORS:** Upgraded deprecated `@app.on_event("startup")` to `@asynccontextmanager` `lifespan` and added `CORSMiddleware` for future frontend integration.

---

### 3. Conversational Memory: Short-Term Sliding Window
- **Goal:** Enable multi-turn dialogue memory so FinSight remembers previous turns and resolves pronouns (*"its"*, *"that stock"*) at $0 cost.
- **Actions:**
  - Updated `ask_groq()` in `groq_client.py` to natively support multi-turn message lists (`[{"role": "user", ...}, {"role": "assistant", ...}]`).
  - Added sliding-window retrieval (last 6 messages / 3 turns) from PostgreSQL `chat_history`.
  - Implemented **Contextual Pronoun Inheritance**: if the user asks *"What is its P/E ratio?"*, FinSight checks previous turns, identifies the active ticker (`TATAPOWER.NS`), and fetches its data automatically.
  - Added REST endpoints: `GET /chat/history` and `DELETE /chat/history`.

---

### 4. Memory Architecture Analysis (Mem0 vs Zero-Cost Local Alternatives)
- **Goal:** Evaluate memory frameworks against user constraint of **strict $0 cost**.
- **Analysis:**
  - Evaluated Mem0: open-source is free, but burns an extra Groq LLM call on every single message for extraction, rapidly exhausting free-tier rate limits.
  - Formulated the **Single-Pass Tagging** + **ChromaDB Semantic Retrieval** architecture: zero extra API calls, zero cost, completely local.

---

### 5. Gemini-Style Long-Term Semantic Memory (Strategy 1)
- **Goal:** Enable FinSight to organically learn lasting user facts, goals, and constraints without memory bloat.
- **Actions:**
  - Created `backend/agent/memory_store.py` backed by local ChromaDB and `all-MiniLM-L6-v2` embeddings.
  - **Semantic Retrieval Capping:** Uses ChromaDB RAG to pull **only the top 3 relevant facts** (~40 tokens) matching the current question. Memory footprint never bloats regardless of how many memories accumulate.
  - **Single-Pass Tagging:** Instructed Groq via system prompt to append `[REMEMBER: <fact>]` when the user shares personal details. The backend intercepts the tag, saves to ChromaDB, and strips it from the user's response (**0 extra LLM calls**).
  - Added REST endpoints: `GET /memories`, `POST /memories`, `DELETE /memories/{id}`, `DELETE /memories`.
  - **Verified in live test:** User stated they avoid tobacco companies; when asked about ITC, FinSight automatically retrieved the memory and flagged the conflict.

---

### 6. Phase 7: Portfolio Analytics & Live P&L Engine
- **Goal:** Real-time quantitative computation of portfolio health, profit/loss, and risk exposure.
- **Actions:**
  - Created `backend/agent/analytics.py` calculating:
    - Total Invested Capital vs Current Portfolio Value.
    - Net Unrealized P&L in ₹ and % (total and per-holding).
    - Holding portfolio weights (%).
    - Sector exposure distribution.
    - Concentration risk flags (holdings > 25%, sectors > 40%).
    - Diversification Score (0–100).
  - Added 60-second in-memory TTL cache to `get_live_price()` and `get_fundamentals()` in `data_fetch.py` to prevent redundant network calls.
  - Added `GET /portfolio/analytics` endpoint in `main.py`.
  - Integrated analytics into `build_portfolio_context()` so chat answers reference live quantitative figures.

---

### 7. Phase 5: Price Target Alert Engine & Telegram Push Notifications
- **Goal:** Automated price monitoring and free instant notification delivery to user's phone.
- **Actions:**
  - Created `backend/agent/alert_engine.py` integrating the Telegram Bot API (100% free, unlimited).
  - Configured non-blocking background polling worker in FastAPI `lifespan` running every 60 seconds.
  - Implemented single-shot auto-deactivation (`active = False` in PostgreSQL) upon target breach.
  - Added endpoints: `POST /alerts`, `GET /alerts`, `GET /alerts/history`, `DELETE /alerts/{id}`, `POST /alerts/check-now`.
  - Connected user's bot `@FinSightAlertBot` and verified live delivery to Telegram chat `6175260235`.

---

### 8. Weekly Executive Portfolio Digest
- **Goal:** Automatic weekly briefing of the user's entire portfolio delivered to Telegram.
- **Actions:**
  - Created `generate_portfolio_weekly_digest()` and `send_weekly_digest_now()` in `alert_engine.py`.
  - Integrated 7-day recurring schedule in the background worker.
  - Added `POST /portfolio/send-digest` for on-demand dispatch.
  - Verified live delivery to user's Telegram.

---

### 9. Functional Formatting & Tone Refinement
- **Goal:** Clean, formal institutional financial analyst tone with functional color indicators.
- **Actions:**
  - Removed decorative/spam emojis across the alert engine, digest, and system prompt.
  - Added minimal functional indicators for immediate visual clarity:
    - `🟢` = Profit / Price Crossed Above Target
    - `🔴` = Loss / Price Crossed Below Target
    - `⚠️` = Risk / Overweight Concentration Warning
  - Updated system prompt style rules in `groq_client.py`.

---

---

## 📅 Session Progress Log: 26-Sep-2026

### 10. Phase 8: Institutional Frontend Dashboard Implementation
- **Goal:** Build an institutional-grade, zero-cost React + TypeScript dashboard connected to the FastAPI backend.
- **Design System:** User selected **Option 1 (Institutional Slate Dark Theme)**:
  - Deep Canvas: `#0B0F17`
  - Elevated Card Surfaces: `#161F30`
  - Institutional Structural Borders: `#223049`
  - High-Tech Accents: `#38BDF8` (Cyan) and `#3B82F6` (Cobalt Blue)
  - Semantic Status: `#10B981` (Profit / Emerald), `#EF4444` (Loss / Crimson), `#F59E0B` (Warning / Amber)
  - Typography: Inter + JetBrains Mono for financial numerals.
- **Components Built & Integrated:**
  1. `frontend/src/api/client.ts`: Typed API client mapping all backend endpoints with health checks, market quotes, portfolio CRUD, analytics, AI chat, alert triggers, and memory store.
  2. `frontend/src/components/Navbar.tsx`: Live backend connectivity status indicator, Telegram digest dispatch button, price alert modal trigger, agent memory modal trigger, and instant data refresh.
  3. `frontend/src/components/PortfolioSummary.tsx`: 4 high-level metric cards (Portfolio Value, Unrealized P&L, Invested Capital, Diversification Score) and real-time risk observation alerts.
  4. `frontend/src/components/HoldingsTable.tsx`: Financial positions table with live prices, individual unrealized returns, position weights, and Add Position modal.
  5. `frontend/src/components/SectorChart.tsx`: Interactive Recharts donut visualization and sector exposure breakdown with diversification health badge.
  6. `frontend/src/components/PriceChart.tsx`: Area chart with gradient fill, multi-timeframe tabs (1W, 1M, 3M, 6M, 1Y, 5Y), and currency-formatted tooltips.
  7. `frontend/src/components/StockDeepDive.tsx`: Real-time stock search, quick-pick chips (`RELIANCE`, `TCS`, `INFY`, etc.), key valuation ratios (P/E, ROE, Debt/Equity, Market Cap in ₹ Cr), and Day Range indicator.
  8. `frontend/src/components/AIChatPanel.tsx`: Full AI research terminal with Groq Qwen-2.5 27B, quick prompt suggestions, conversation memory history, and markdown formatting.
  9. `frontend/src/components/AlertsModal.tsx`: Price target alert manager with active list, triggered history, new alert form, and instant "Check Alerts Now" action.
  10. `frontend/src/components/MemoriesModal.tsx`: Agent long-term memory inspector and manager powered by ChromaDB semantic memory.
  11. `frontend/src/App.tsx`: Unified layout assembling all components with toast notifications, live status polling, and responsive design.
- **Verification:**
  - `npm run build` executed successfully with zero TypeScript or JSX compile errors.
  - Verified live communication with the FastAPI backend on `http://127.0.0.1:8000`.

---

### 11. Minimalist Institutional Light Theme & Adult-Focused Typography Redesign
- **Goal:** Redesign the entire frontend interface into a crisp, minimal, and highly professional light theme with high-legibility typography optimized for mature/adult investors and institutional readability.
- **Design Principles:**
  - **Color Palette:**
    - Canvas Background: `#F8FAFC` (Slate 50 — soft, glare-free light background)
    - Card Surfaces: `#FFFFFF` (Pure white with subtle `#E2E8F0` structural borders)
    - Primary Text: `#0F172A` (Deep Slate 900 — high-contrast, easily readable)
    - Secondary Body: `#334155` (Slate 700) and `#64748B` (Slate 500 labels)
    - Financial Indicators: Accessible Emerald `#047857` (`#ECFDF5` pill), Crimson `#B91C1C` (`#FEF2F2` pill), Amber `#B45309` (`#FFFBEB` pill)
    - Brand Accents: Deep Institutional Navy `#1E3A8A` / Royal Blue `#2563EB`
  - **Typography:**
    - Integrated Google Font **Plus Jakarta Sans** for clean, modern, and readable body & headings.
    - Integrated **JetBrains Mono** for financial figures, tickers, and percentages.
- **Components Updated:**
  - `frontend/index.html`: Google Fonts integration & updated page metadata.
  - `frontend/tailwind.config.js`: Light theme token system & font family definitions.
  - `frontend/src/index.css`: Light theme root variables, body defaults, and light scrollbar.
  - `frontend/src/components/Navbar.tsx`: Crisp white navbar with high-contrast actions and live heartbeat indicator.
  - `frontend/src/components/PortfolioSummary.tsx`: Light KPI metric cards and clean observation banner.
  - `frontend/src/components/HoldingsTable.tsx`: Pure white positions table with soft hover states and light add-position modal.
  - `frontend/src/components/SectorChart.tsx`: Recharts donut chart with accessible palette and light tooltip.
  - `frontend/src/components/PriceChart.tsx`: Area chart with light grid and high-contrast tooltip.
  - `frontend/src/components/StockDeepDive.tsx`: Light valuation explorer, ratio cards, and range slider.
  - `frontend/src/components/AIChatPanel.tsx`: High-contrast institutional research chat terminal.
  - `frontend/src/components/AlertsModal.tsx` & `MemoriesModal.tsx`: Pure white modal dialogs with crisp borders.
  - `frontend/src/App.tsx`: Light canvas layout and crisp footer.
- **Verification:**
  - `npm run build` completed with zero errors (`dist/` bundle compiled in ~1.08s).
  - Dev server active at `http://localhost:5173/`.

---

### 12. Intelligent Stock Search by Company Name, Brand & Autocomplete Dropdown
- **Goal:** Enable users to search for Indian equities using regular company names (e.g. "tata", "reliance", "state bank", "infosys", "hdfc", "zomato") instead of requiring exact ticker symbols.
- **Backend Architecture & Indexing:**
  - Created `backend/data/stock_directory.py`: Comprehensive curated index covering premier Nifty 50 / Nifty 500 equities, brand aliases, and product keywords.
  - Implemented multi-tier relevance scoring (exact symbol match > symbol prefix > company name prefix > all-word matching > brand/product keywords).
  - Integrated corporate restructuring & symbol alias mappings (e.g. `TATAMOTORS` automatically resolves to active NSE tickers `TMCV` / `TMPV`, `SBI` -> `SBIN`, `HDFC` -> `HDFCBANK`).
  - Added hybrid search fallback in `backend/data/data_fetch.py`: checks the local directory first, then supplements with live Yahoo Finance search for lesser-known equities with a 5-minute TTL query cache.
  - Added REST endpoint `GET /search/stocks?q={query}` in `backend/main.py`.
- **Frontend Autocomplete & UX:**
  - Added typed `StockSearchResult` interface and `api.searchStocks(query)` in `frontend/src/api/client.ts`.
  - Upgraded `frontend/src/components/StockDeepDive.tsx`:
    - Real-time debounced autocomplete dropdown triggered while typing.
    - Clean display showing Full Company Name, NSE Symbol pill, and Sector tag.
    - Full keyboard accessibility: Arrow Up / Arrow Down navigation, Enter to select, and Escape to dismiss.
    - Automatic selection of top match when submitting via Enter or Search button.
  - Upgraded `frontend/src/components/HoldingsTable.tsx`:
    - Added company name autocomplete to the "Add Position" modal with automatic fetching of live market price for seamless position entry.
- **Verification:**
  - Verified `GET /search/stocks?q=tata` returns relevant Tata Group stocks (`TMCV`, `TMPV`, `TCS`, `TATASTEEL`, `TATAPOWER`, etc.).
  - Verified `GET /price/Tata Motors` automatically resolves to `TMCV.NS` and returns live quotes.
  - `npm run build` compiled cleanly with `0` errors.

---

### 13. Warm Financial Luxury Theme (Financial Times / Bloomberg Style)
- **Goal:** Upgrade the light theme into an executive "Warm Financial Luxury" aesthetic modeled after premier financial publications like the Financial Times and Bloomberg Wealth, eliminating plain sterility while preserving maximum contrast and readability for mature investors.
- **Design Tokens & System:**
  - **Canvas Backdrop:** `#F6F5F2` (Warm alabaster / parchment — glare-free, organic, and elegant).
  - **Card Surfaces:** Pure crisp white (`#FFFFFF`) elevated with warm multi-layer drop shadows (`shadow-card`) and stone borders (`#E5E0D8`).
  - **Primary Ink:** `#1C1917` (Deep warm stone onyx — superior reading comfort over harsh black).
  - **Financial Accents:** Wall Street deep emerald `#065F46` on `#ECFDF5`, British oxblood crimson `#991B1B` on `#FEF2F2`, and warm amber `#92400E` on `#FFFBEB`.
  - **Buttons & Headers:** Institutional Onyx `#1C1917` with subtle amber micro-accents.
- **Components Refined:**
  - `tailwind.config.js` & `index.css`: Added warm luxury canvas, surface, border, and ink tokens with custom warm scrollbars.
  - `Navbar.tsx`: White header with onyx brand emblem, amber heartbeat, and warm stone action buttons.
  - `PortfolioSummary.tsx`: White KPI cards popping with `shadow-card` against the `#F6F5F2` backdrop.
  - `HoldingsTable.tsx`: White positions table with warm stone head `#FAF8F5` and warm row hover.
  - `SectorChart.tsx`: Recharts donut chart with warm stone breakdown pills and warm tooltip cards.
  - `PriceChart.tsx`: Area chart with warm stone grid lines `#E5E0D8` and high-contrast tooltip.
  - `StockDeepDive.tsx`: High-contrast valuation cards with warm stone borders and debounced company autocomplete dropdown.
  - `AIChatPanel.tsx`: White research terminal card with onyx user bubbles and warm stone assistant cards.
  - `AlertsModal.tsx` & `MemoriesModal.tsx`: Pure white dialogs with warm stone borders and inputs.
  - `App.tsx`: Warm parchment backdrop and stone footer.
- **Verification:**
  - `npm run build` compiled cleanly with `0` errors.

---

### 14. Stitch MCP Full Redesign (FinSight Financial Intelligence Hub)
- **Goal:** Execute a complete visual and structural redesign using Stitch MCP (`projects/8157181596353953629`), introducing high-contrast typography, an integrated global stock search bar with autocomplete across names and tickers, a 4-card executive KPI summary banner, streamlined holdings management, and a dedicated AI Co-Pilot research panel.
- **Stitch MCP Generation & Assets:**
  - Created Stitch project: `FinSight Financial Intelligence Hub` (`projects/8157181596353953629`).
  - Created Design System: `FinSight Minimal Luxury Light` (`assets/8463488866089824462`) utilizing `Plus Jakarta Sans` headlines, `Inter` body text, and `ROUND_EIGHT` elevation tokens.
  - Generated Desktop Screen: `FinSight - Portfolio Intelligence Dashboard` (2560x3714).
- **Codebase Redesign Implementation:**
  - **Design System & Theming (`tailwind.config.js` & `index.css`):**
    - Updated canvas to slate-50 (`#F8FAFC`) with pure white card surfaces (`#FFFFFF`), crisp slate borders (`#E2E8F0`), and high-contrast primary slate typography (`#0F172A`).
    - Added font pairings: `Inter` for body copy and `Plus Jakarta Sans` for headers, loaded in `index.html`.
  - **Global Header (`Navbar.tsx`):**
    - Incorporated a prominent, debounced stock search bar with live dropdown autocomplete (enabling search by company name like "Tata Motors" or ticker symbol). Selecting a result automatically navigates to and populates the deep dive analysis.
    - Added an engine status pill (`Gemma-27B Live`), Telegram digest trigger, alert trigger, and long-term memory modal trigger.
  - **Executive KPI Banner (`PortfolioSummary.tsx`):**
    - 4 distinct metric cards: Portfolio Valuation, Unrealized Return (with all-time yield badge), Cost Basis, and AI Health & Diversification Score (with progress meter).
  - **Portfolio Holdings (`HoldingsTable.tsx`):**
    - Clean tabular view with live prices, return pill badges, weight meters, and row-level AI Analysis triggers.
    - Integrated modal with debounced search for seamless position additions.
  - **Sector Allocation (`SectorChart.tsx`):**
    - Crisp donut chart with breakdown list and an automated AI macroeconomic risk rebalancing recommendation banner.
  - **AI Co-Pilot Panel (`AIChatPanel.tsx`):**
    - Redesigned dedicated assistant panel with interactive financial prompts (`Analyze portfolio risk`, `Is Tata Motors a Buy, Hold, or Sell now?`, etc.) and multi-tier formatting.
  - **NSE Stock Deep Dive (`StockDeepDive.tsx`):**
    - Real-time quote cards, historical area charts, and key valuation metrics (P/E, Debt to Equity, Market Cap, ROE, 52W High/Low).
- **Verification:**
  - Ran `npm run build` — compiled cleanly with `0` errors.

---

### 15. User Authentication, Broker Statement Ingestion & Stock Market Academy
- **Goal:** Wipe all legacy demo data, build an isolated multi-tenant user authentication system, implement multi-broker statement ingestion (Zerodha, Groww, AngelOne, Upstox CSV/Excel), and provide an interactive beginner "Stock Market Academy" with a prominent skip option.
- **Key Deliverables:**
  - **Data Cleanup:** Completely purged legacy test records across PostgreSQL and ChromaDB.
  - **Multi-Tenant User System:**
    - Added `User` table to [`backend/db/models.py`](file:///D:/Workspace/Projects/Personal/Ai%20Agent/Finsight/backend/db/models.py) (`email`, `full_name`, `password_hash`, `primary_broker`, `tutorial_completed`).
    - Added `user_id` foreign keys to `Portfolio`, `ChatHistory`, and `Alert` models for strict multi-tenant isolation.
    - Implemented secure `bcrypt` hashing and JWT tokens in [`backend/db/auth.py`](file:///D:/Workspace/Projects/Personal/Ai%20Agent/Finsight/backend/db/auth.py).
    - Added REST endpoints: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, and `POST /auth/tutorial-complete`.
  - **Multi-Broker Statement Parsing Engine:**
    - Built [`backend/data/broker_parser.py`](file:///D:/Workspace/Projects/Personal/Ai%20Agent/Finsight/backend/data/broker_parser.py) supporting Zerodha Kite/Console (`.csv`, `.xlsx`), Groww (`.xlsx`, `.csv`), AngelOne (`.csv`), Upstox (`.csv`), and generic formats.
    - Uses fuzzy column pattern matching, cleans numeric noise (commas, ₹ symbols), and resolves raw scrip names to official `.NS` tickers via local stock directory.
    - Added endpoints: `POST /portfolio/upload` (returns parsed preview) and `POST /portfolio/import-confirm` (commits selected holdings).
  - **Frontend UI & Interactive Onboarding:**
    - **`AuthModal.tsx`:** Sleek Stitch-styled login and registration dialog with demo credentials autofill.
    - **`BrokerUploadModal.tsx`:** Drag-and-drop file upload with live broker detection and an interactive preview table showing original names, resolved NSE tickers, quantities, average prices, and toggleable checkboxes.
    - **`StockMarketAcademyModal.tsx`:** 4-part beginner tutorial covering equity ownership, P/E ratios & valuation, portfolio diversification, and AI-powered research. Equipped with an easily dismissible **"Skip Tutorial"** button on every screen.
    - **`OnboardingChoiceModal.tsx`:** Modal shown to newly registered investors to route them either to broker statement upload or to the beginner academy.
    - **Navbar & Sidebar Integration:** Navbar displays current user profile, broker tier badge, and account dropdown with one-click access to Statement Import, Academy, and Sign Out.
- **Verification:**
  - Ran backend test suite for registration, login, `/auth/me`, `/auth/tutorial-complete`, broker CSV parsing, and batch portfolio creation.
  - Ran `npm run build` — compiled cleanly with `0` errors.

---

## 📊 Current Project Status

| Phase | Description | Status |
| :--- | :--- | :--- |
| **Phase 1** | NSE Market Data Layer (`data_fetch.py` + 60s cache) | ✅ Complete |
| **Phase 2** | PostgreSQL Models & CRUD (`models.py`, `crud.py`) | ✅ Complete |
| **Phase 3** | FastAPI REST Endpoints & Groq LPU Chat (`main.py`, `groq_client.py`) | ✅ Complete |
| **Phase 4** | News RAG & FinBERT Sentiment Analysis (`vector_store.py`, `sentiment.py`) | ✅ Complete |
| **Phase 5** | Background Alert Engine & Telegram Push (`alert_engine.py`) | ✅ Complete |
| **Phase 6** | Conversational Memory (Short-Term + Gemini Long-Term) | ✅ Complete |
| **Phase 7** | Portfolio Analytics & Live P&L (`analytics.py`) | ✅ Complete |
| **Phase 8** | React + Vite Institutional Dashboard (Stitch Redesign Complete) | ✅ Complete |
| **Phase 8.5**| Auth, Broker Statement Upload & Stock Market Academy | ✅ Complete |
| **Phase 9** | Production Hardening & Docker Containerization | 🔜 Next Up |

---

## 🔭 Next Planned Milestone: Phase 9 (Production Hardening & Deployment)
- Create `Dockerfile` and `docker-compose.yml` for unified backend, frontend, PostgreSQL, and ChromaDB deployment.
- Configure environment variables and production reverse proxy / serve settings.
- Write end-to-end integration and smoke test suite.



