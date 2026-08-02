"""
FinSight — FastAPI Backend

Run with: uvicorn backend.main:app --reload
Then open: http://127.0.0.1:8000/docs  (interactive API docs, auto-generated)
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi import Depends
from sqlalchemy.orm import Session

from backend.data.data_fetch import get_live_price, get_fundamentals, get_price_history
from backend.db.database import get_db, init_db
from backend.db import crud

app = FastAPI(title="FinSight API")


@app.on_event("startup")
def startup():
    """Ensures the database and tables exist before the app starts serving requests."""
    init_db()


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
    df = get_price_history(ticker, period=period)
    return df.to_dict(orient="records")


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


@app.get("/")
def root():
    return {"status": "FinSight API is running"}
