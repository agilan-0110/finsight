"""
FinSight — FastAPI Backend

Run with: uvicorn backend.main:app --reload
Then open: http://127.0.0.1:8000/docs  (interactive API docs, auto-generated)
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.data.data_fetch import get_live_price, get_fundamentals, get_price_history
from backend.db.database import get_db, init_db
from backend.db import crud
from backend.agent.direct_chat import get_chat_response


import asyncio
from backend.agent.alert_engine import alert_background_worker


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Ensures the database exists and starts the background alert monitor."""
    init_db()
    alert_task = asyncio.create_task(alert_background_worker(interval_seconds=60))
    yield
    alert_task.cancel()


app = FastAPI(title="FinSight API", lifespan=lifespan)

# Allow frontend applications (React, Vite, etc.) to communicate with the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Market Data Endpoints ----------

@app.get("/price/{ticker}")
def price(ticker: str):
    try:
        return get_live_price(ticker)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.get("/fundamentals/{ticker}")
def fundamentals(ticker: str):
    try:
        return get_fundamentals(ticker)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.get("/history/{ticker}")
def history(ticker: str, period: str = "3mo"):
    try:
        df = get_price_history(ticker, period=period)
        return df.to_dict(orient="records")
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ---------- Portfolio Endpoints ----------

class HoldingIn(BaseModel):
    ticker: str
    quantity: float
    avg_buy_price: float
    currency: str = "INR"


@app.post("/portfolio")
def add_holding(holding: HoldingIn, db: Session = Depends(get_db)):
    new_holding = crud.add_holding(db, holding.ticker, holding.quantity, holding.avg_buy_price, holding.currency)
    return new_holding.to_dict()


@app.get("/portfolio")
def get_portfolio(db: Session = Depends(get_db)):
    return [h.to_dict() for h in crud.get_portfolio(db)]


@app.delete("/portfolio/{holding_id}")
def delete_holding(holding_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_holding(db, holding_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Holding not found")
    return {"message": "Holding deleted"}


from backend.agent.analytics import calculate_portfolio_analytics


@app.get("/portfolio/analytics")
def portfolio_analytics(db: Session = Depends(get_db)):
    """
    Returns real-time quantitative portfolio analytics:
    - Total invested vs current value
    - Net P&L in ₹ and % (overall and per holding)
    - Sector allocation & weights
    - Concentration risk flags
    - Diversification score (0-100)
    """
    return calculate_portfolio_analytics(db=db)


from backend.agent.alert_engine import send_weekly_digest_now


@app.post("/portfolio/send-digest")
def trigger_portfolio_digest(db: Session = Depends(get_db)):
    """
    Generates the executive weekly portfolio digest and dispatches
    it directly to your Telegram chat.
    """
    return send_weekly_digest_now(db=db)


# ---------- Chat Endpoints (With Sliding-Window Memory) ----------

class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    """
    Main chat endpoint. Takes a user message, injects recent conversation history,
    retrieves portfolio/market/news context, and returns FinSight's response.
    """
    reply = get_chat_response(request.message)
    return ChatResponse(response=reply)


@app.get("/chat/history")
def chat_history(limit: int = 20, db: Session = Depends(get_db)):
    """Returns the most recent messages stored in chat_history."""
    messages = crud.get_recent_messages(db, limit=limit)
    return [m.to_dict() for m in messages]


@app.delete("/chat/history")
def clear_history(db: Session = Depends(get_db)):
    """Clears all conversation memory from the database."""
    deleted_count = crud.clear_chat_history(db)
    return {"message": f"Cleared {deleted_count} messages from chat history"}


# ---------- Alert Endpoints ----------

class AlertIn(BaseModel):
    ticker: str
    condition: str  # 'above' or 'below'
    threshold: float


@app.post("/alerts")
def create_alert(alert: AlertIn, db: Session = Depends(get_db)):
    new_alert = crud.add_alert(db, alert.ticker, alert.condition, alert.threshold)
    return new_alert.to_dict()


@app.get("/alerts")
def get_alerts(db: Session = Depends(get_db)):
    """List all currently active price alerts."""
    return [a.to_dict() for a in crud.get_active_alerts(db)]


@app.get("/alerts/history")
def get_alert_history(limit: int = 50, db: Session = Depends(get_db)):
    """List all alerts (both active and previously triggered)."""
    return [a.to_dict() for a in crud.get_all_alerts(db, limit=limit)]


@app.delete("/alerts/{alert_id}")
def delete_alert(alert_id: int, db: Session = Depends(get_db)):
    """Delete an alert by ID."""
    deleted = crud.delete_alert(db, alert_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"message": "Alert deleted successfully"}


from backend.agent.alert_engine import check_and_trigger_alerts


@app.post("/alerts/check-now")
def trigger_alert_check_now():
    """Manually triggers a price check cycle across all active alerts."""
    triggered = check_and_trigger_alerts()
    return {"checked": True, "triggered_count": len(triggered), "triggered": triggered}


# ---------- Long-Term Memory Endpoints (Gemini-Style) ----------

from backend.agent import memory_store


class MemoryIn(BaseModel):
    memory: str
    category: str = "general"


@app.get("/memories")
def list_memories():
    """Returns all long-term personal facts and preferences remembered about the user."""
    return memory_store.get_all_memories()


@app.post("/memories")
def create_memory(data: MemoryIn):
    """Manually add a persistent user context or preference."""
    mid = memory_store.add_user_memory(data.memory, category=data.category)
    return {"id": mid, "message": "Memory saved successfully"}


@app.delete("/memories/{memory_id}")
def delete_memory(memory_id: str):
    """Delete a specific remembered fact by ID."""
    success = memory_store.delete_memory(memory_id)
    if not success:
        raise HTTPException(status_code=404, detail="Memory not found")
    return {"message": "Memory deleted"}


@app.delete("/memories")
def clear_memories():
    """Clear all long-term memories."""
    count = memory_store.clear_all_memories()
    return {"message": f"Cleared {count} memories"}


@app.get("/")
def root():
    return {"status": "FinSight API is running"}

