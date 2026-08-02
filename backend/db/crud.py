"""
FinSight — CRUD functions (SQLAlchemy ORM)

Each function takes a `db: Session` (passed in by FastAPI via Depends(get_db))
so the same session is reused for the whole request rather than opening a new
connection per function call.
"""

from sqlalchemy.orm import Session
from backend.db.models import Portfolio, ChatHistory, Alert


# ---------- Portfolio ----------

def add_holding(db: Session, ticker: str, quantity: float, avg_buy_price: float, currency: str = "INR") -> Portfolio:
    holding = Portfolio(ticker=ticker.upper(), quantity=quantity, avg_buy_price=avg_buy_price, currency=currency)
    db.add(holding)
    db.commit()
    db.refresh(holding)  # loads the auto-generated id back onto the object
    return holding


def get_portfolio(db: Session) -> list[Portfolio]:
    return db.query(Portfolio).all()


def delete_holding(db: Session, holding_id: int) -> bool:
    holding = db.query(Portfolio).filter(Portfolio.id == holding_id).first()
    if holding is None:
        return False
    db.delete(holding)
    db.commit()
    return True


# ---------- Chat History ----------

def add_message(db: Session, role: str, message: str) -> ChatHistory:
    entry = ChatHistory(role=role, message=message)
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


def get_recent_messages(db: Session, limit: int = 20) -> list[ChatHistory]:
    rows = db.query(ChatHistory).order_by(ChatHistory.id.desc()).limit(limit).all()
    return list(reversed(rows))  # oldest first — ready to feed into a prompt


# ---------- Alerts ----------

def add_alert(db: Session, ticker: str, condition: str, threshold: float) -> Alert:
    alert = Alert(ticker=ticker.upper(), condition=condition, threshold=threshold)
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert


def get_active_alerts(db: Session) -> list[Alert]:
    return db.query(Alert).filter(Alert.active == True).all()  # noqa: E712 (SQLAlchemy needs == True, not `is True`)
