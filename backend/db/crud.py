"""
FinSight — CRUD functions (SQLAlchemy ORM) Multi-Tenant
Supports per-user isolation for Portfolio, ChatHistory, and Alerts.
"""

from typing import Optional
from sqlalchemy.orm import Session
from backend.db.models import User, Portfolio, ChatHistory, Alert


def normalize_ticker(ticker: str) -> str:
    """
    Ensures a ticker has the .NS (NSE) suffix.
    """
    ticker = ticker.strip().upper()
    if not ticker.endswith(".NS"):
        ticker = f"{ticker}.NS"
    return ticker


# ---------- Users ----------

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email.strip().lower()).first()


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def create_user(db: Session, email: str, full_name: str, password_hash: str, primary_broker: str = "generic") -> User:
    user = User(
        email=email.strip().lower(),
        full_name=full_name.strip(),
        password_hash=password_hash,
        primary_broker=primary_broker,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def set_user_tutorial_status(db: Session, user_id: int, completed: bool = True) -> bool:
    user = get_user_by_id(db, user_id)
    if not user:
        return False
    user.tutorial_completed = completed
    db.commit()
    return True


# ---------- Portfolio ----------

def add_holding(
    db: Session,
    ticker: str,
    quantity: float,
    avg_buy_price: float,
    currency: str = "INR",
    user_id: Optional[int] = None,
    broker_source: str = "manual"
) -> Portfolio:
    holding = Portfolio(
        user_id=user_id,
        ticker=normalize_ticker(ticker),
        quantity=quantity,
        avg_buy_price=avg_buy_price,
        currency=currency,
        broker_source=broker_source,
    )
    db.add(holding)
    db.commit()
    db.refresh(holding)
    return holding


def batch_add_holdings(
    db: Session,
    holdings: list[dict],
    user_id: Optional[int] = None,
    broker_source: str = "import"
) -> list[Portfolio]:
    created = []
    for h in holdings:
        holding = Portfolio(
            user_id=user_id,
            ticker=normalize_ticker(h["ticker"]),
            quantity=float(h["quantity"]),
            avg_buy_price=float(h["avg_buy_price"]),
            currency=h.get("currency", "INR"),
            broker_source=broker_source,
        )
        db.add(holding)
        created.append(holding)
    db.commit()
    for h in created:
        db.refresh(h)
    return created


def get_portfolio(db: Session, user_id: Optional[int] = None) -> list[Portfolio]:
    query = db.query(Portfolio)
    if user_id is not None:
        query = query.filter(Portfolio.user_id == user_id)
    return query.all()


def delete_holding(db: Session, holding_id: int, user_id: Optional[int] = None) -> bool:
    query = db.query(Portfolio).filter(Portfolio.id == holding_id)
    if user_id is not None:
        query = query.filter(Portfolio.user_id == user_id)
    holding = query.first()
    if holding is None:
        return False
    db.delete(holding)
    db.commit()
    return True


# ---------- Chat History ----------

def add_message(db: Session, role: str, message: str, user_id: Optional[int] = None) -> ChatHistory:
    entry = ChatHistory(role=role, message=message, user_id=user_id)
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


def get_recent_messages(db: Session, limit: int = 20, user_id: Optional[int] = None) -> list[ChatHistory]:
    query = db.query(ChatHistory)
    if user_id is not None:
        query = query.filter(ChatHistory.user_id == user_id)
    rows = query.order_by(ChatHistory.id.desc()).limit(limit).all()
    return list(reversed(rows))


def clear_chat_history(db: Session, user_id: Optional[int] = None) -> int:
    query = db.query(ChatHistory)
    if user_id is not None:
        query = query.filter(ChatHistory.user_id == user_id)
    count = query.delete(synchronize_session=False)
    db.commit()
    return count


# ---------- Alerts ----------

def add_alert(db: Session, ticker: str, condition: str, threshold: float, user_id: Optional[int] = None) -> Alert:
    alert = Alert(
        user_id=user_id,
        ticker=normalize_ticker(ticker),
        condition=condition,
        threshold=threshold
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert


def get_active_alerts(db: Session, user_id: Optional[int] = None) -> list[Alert]:
    query = db.query(Alert).filter(Alert.active == True)
    if user_id is not None:
        query = query.filter(Alert.user_id == user_id)
    return query.all()


def deactivate_alert(db: Session, alert_id: int, user_id: Optional[int] = None) -> bool:
    query = db.query(Alert).filter(Alert.id == alert_id)
    if user_id is not None:
        query = query.filter(Alert.user_id == user_id)
    alert = query.first()
    if alert is None:
        return False
    alert.active = False
    db.commit()
    return True


def delete_alert(db: Session, alert_id: int, user_id: Optional[int] = None) -> bool:
    query = db.query(Alert).filter(Alert.id == alert_id)
    if user_id is not None:
        query = query.filter(Alert.user_id == user_id)
    alert = query.first()
    if alert is None:
        return False
    db.delete(alert)
    db.commit()
    return True


def get_all_alerts(db: Session, limit: int = 50, user_id: Optional[int] = None) -> list[Alert]:
    query = db.query(Alert)
    if user_id is not None:
        query = query.filter(Alert.user_id == user_id)
    return query.order_by(Alert.id.desc()).limit(limit).all()