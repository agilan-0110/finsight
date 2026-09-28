"""
FinSight — FastAPI Backend
Supports Multi-User JWT Auth, Broker Statement Upload & Import,
Portfolio Analytics, Interactive AI Co-Pilot, Alerts, and Stock Market Academy.
"""

from contextlib import asynccontextmanager
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from backend.data.data_fetch import get_live_price, get_fundamentals, get_price_history, search_stocks
from backend.db.database import get_db, init_db
from backend.db import crud
from backend.db.models import User
from backend.db.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    get_current_user_optional,
)
from backend.data.broker_parser import parse_broker_file
from backend.agent.direct_chat import get_chat_response
from backend.agent.analytics import calculate_portfolio_analytics
from backend.agent.alert_engine import alert_background_worker, send_weekly_digest_now, check_and_trigger_alerts
from backend.agent import memory_store

import asyncio


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


# ---------- Authentication Endpoints ----------

class RegisterIn(BaseModel):
    email: str
    full_name: str
    password: str
    primary_broker: Optional[str] = "generic"


class LoginIn(BaseModel):
    email: str
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


@app.post("/auth/register", response_model=AuthResponse)
def register(data: RegisterIn, db: Session = Depends(get_db)):
    existing = crud.get_user_by_email(db, data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists. Please log in."
        )
    if len(data.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters long."
        )

    pwd_hash = hash_password(data.password)
    user = crud.create_user(
        db,
        email=data.email,
        full_name=data.full_name,
        password_hash=pwd_hash,
        primary_broker=data.primary_broker or "generic",
    )
    token = create_access_token(user.id, user.email)
    return AuthResponse(access_token=token, user=user.to_dict())


@app.post("/auth/login", response_model=AuthResponse)
def login(data: LoginIn, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, data.email)
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please try again."
        )
    token = create_access_token(user.id, user.email)
    return AuthResponse(access_token=token, user=user.to_dict())


@app.get("/auth/me")
def get_me(user: User = Depends(get_current_user)):
    return user.to_dict()


@app.post("/auth/tutorial-complete")
def complete_tutorial(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    crud.set_user_tutorial_status(db, user.id, completed=True)
    return {"message": "Tutorial status updated", "tutorial_completed": True}


# ---------- Market Data Endpoints (Public) ----------

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


@app.get("/search/stocks")
def search(q: str = ""):
    """Search Indian stocks by company name, brand, ticker or keywords."""
    return search_stocks(q)


# ---------- Portfolio Endpoints (Multi-Tenant) ----------

class HoldingIn(BaseModel):
    ticker: str
    quantity: float
    avg_buy_price: float
    currency: str = "INR"
    broker_source: Optional[str] = "manual"


@app.post("/portfolio")
def add_holding(
    holding: HoldingIn,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional)
):
    user_id = user.id if user else None
    new_holding = crud.add_holding(
        db,
        ticker=holding.ticker,
        quantity=holding.quantity,
        avg_buy_price=holding.avg_buy_price,
        currency=holding.currency,
        user_id=user_id,
        broker_source=holding.broker_source or "manual"
    )
    return new_holding.to_dict()


@app.get("/portfolio")
def get_portfolio(
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional)
):
    user_id = user.id if user else None
    return [h.to_dict() for h in crud.get_portfolio(db, user_id=user_id)]


@app.delete("/portfolio/{holding_id}")
def delete_holding(
    holding_id: int,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional)
):
    user_id = user.id if user else None
    deleted = crud.delete_holding(db, holding_id, user_id=user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Holding not found")
    return {"message": "Holding deleted"}


@app.get("/portfolio/analytics")
def portfolio_analytics(
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional)
):
    user_id = user.id if user else None
    return calculate_portfolio_analytics(db=db, user_id=user_id)


# ---------- Broker Statement Upload & Import Endpoints ----------

@app.post("/portfolio/upload")
async def upload_broker_file(file: UploadFile = File(...)):
    """
    Parses a broker statement file (Zerodha, Groww, AngelOne, Upstox, or standard CSV/Excel).
    Returns a parsed preview list for user confirmation.
    """
    filename = file.filename or "statement.csv"
    contents = await file.read()
    try:
        parsed_result = parse_broker_file(contents, filename)
        return parsed_result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


class ImportItem(BaseModel):
    ticker: str
    quantity: float
    avg_buy_price: float
    currency: Optional[str] = "INR"


class ImportConfirmIn(BaseModel):
    broker: str = "generic"
    holdings: List[ImportItem]


@app.post("/portfolio/import-confirm")
def import_confirm(
    data: ImportConfirmIn,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Commits verified broker holdings into the user's isolated portfolio.
    """
    user_id = user.id if user else None
    holdings_dict_list = [h.dict() for h in data.holdings]
    created = crud.batch_add_holdings(
        db,
        holdings=holdings_dict_list,
        user_id=user_id,
        broker_source=data.broker
    )
    return {
        "message": f"Successfully imported {len(created)} holdings from {data.broker}.",
        "imported_count": len(created),
        "holdings": [h.to_dict() for h in created],
    }


@app.post("/portfolio/send-digest")
def trigger_portfolio_digest(
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional)
):
    return send_weekly_digest_now(db=db)


# ---------- Chat Endpoints (Multi-Tenant) ----------

class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str


@app.post("/chat", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    user: Optional[User] = Depends(get_current_user_optional)
):
    user_id = user.id if user else None
    reply = get_chat_response(request.message, user_id=user_id)
    return ChatResponse(response=reply)


@app.get("/chat/history")
def chat_history(
    limit: int = 20,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional)
):
    user_id = user.id if user else None
    messages = crud.get_recent_messages(db, limit=limit, user_id=user_id)
    return [m.to_dict() for m in messages]


@app.delete("/chat/history")
def clear_history(
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional)
):
    user_id = user.id if user else None
    deleted_count = crud.clear_chat_history(db, user_id=user_id)
    return {"message": f"Cleared {deleted_count} messages from chat history"}


# ---------- Alert Endpoints (Multi-Tenant) ----------

class AlertIn(BaseModel):
    ticker: str
    condition: str  # 'above' or 'below'
    threshold: float


@app.post("/alerts")
def create_alert(
    alert: AlertIn,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional)
):
    user_id = user.id if user else None
    new_alert = crud.add_alert(db, alert.ticker, alert.condition, alert.threshold, user_id=user_id)
    return new_alert.to_dict()


@app.get("/alerts")
def get_alerts(
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional)
):
    user_id = user.id if user else None
    return [a.to_dict() for a in crud.get_active_alerts(db, user_id=user_id)]


@app.get("/alerts/history")
def get_alert_history(
    limit: int = 50,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional)
):
    user_id = user.id if user else None
    return [a.to_dict() for a in crud.get_all_alerts(db, limit=limit, user_id=user_id)]


@app.delete("/alerts/{alert_id}")
def delete_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional)
):
    user_id = user.id if user else None
    deleted = crud.delete_alert(db, alert_id, user_id=user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"message": "Alert deleted successfully"}


@app.post("/alerts/check-now")
def trigger_alert_check_now():
    triggered = check_and_trigger_alerts()
    return {"checked": True, "triggered_count": len(triggered), "triggered": triggered}


# ---------- Long-Term Memory Endpoints ----------

class MemoryIn(BaseModel):
    memory: str
    category: str = "general"


@app.get("/memories")
def list_memories():
    return memory_store.get_all_memories()


@app.post("/memories")
def create_memory(data: MemoryIn):
    mid = memory_store.add_user_memory(data.memory, category=data.category)
    return {"id": mid, "message": "Memory saved successfully"}


@app.delete("/memories/{memory_id}")
def delete_memory(memory_id: str):
    success = memory_store.delete_memory(memory_id)
    if not success:
        raise HTTPException(status_code=404, detail="Memory not found")
    return {"message": "Memory deleted"}


@app.delete("/memories")
def clear_memories():
    count = memory_store.clear_all_memories()
    return {"message": f"Cleared {count} memories"}


@app.get("/")
def root():
    return {"status": "FinSight API is running"}
