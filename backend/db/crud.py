"""
FinSight — CRUD functions (SQLAlchemy ORM) Multi-Tenant
Supports per-user isolation for Portfolio, ChatHistory, and Alerts.
"""

from typing import Optional
from sqlalchemy.orm import Session
from backend.db.models import User, Portfolio, ChatHistory, Alert, UserProfile, FinancialGoal, LearningProgress


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


# ---------- User Profile & Onboarding ----------

def get_user_profile(db: Session, user_id: int) -> Optional[UserProfile]:
    return db.query(UserProfile).filter(UserProfile.user_id == user_id).first()


def upsert_user_profile(
    db: Session,
    user_id: int,
    experience_level: str = "completely_new",
    primary_goal: str = "wealth",
    time_horizon: str = "5-10yrs",
    monthly_investment: float = 2000.0,
    risk_reaction: str = "wait_understand",
    onboarding_completed: bool = True
) -> UserProfile:
    profile = get_user_profile(db, user_id)
    if profile:
        profile.experience_level = experience_level
        profile.primary_goal = primary_goal
        profile.time_horizon = time_horizon
        profile.monthly_investment = monthly_investment
        profile.risk_reaction = risk_reaction
        profile.onboarding_completed = onboarding_completed
    else:
        profile = UserProfile(
            user_id=user_id,
            experience_level=experience_level,
            primary_goal=primary_goal,
            time_horizon=time_horizon,
            monthly_investment=monthly_investment,
            risk_reaction=risk_reaction,
            onboarding_completed=onboarding_completed
        )
        db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


# ---------- Financial Goals ----------

def get_user_goals(db: Session, user_id: int) -> list[FinancialGoal]:
    return db.query(FinancialGoal).filter(FinancialGoal.user_id == user_id).order_by(FinancialGoal.id.asc()).all()


def create_user_goal(
    db: Session,
    user_id: int,
    title: str,
    target_amount: float,
    target_years: int = 5,
    monthly_contribution: float = 0.0,
    category: str = "wealth"
) -> FinancialGoal:
    goal = FinancialGoal(
        user_id=user_id,
        title=title,
        target_amount=target_amount,
        target_years=target_years,
        monthly_contribution=monthly_contribution,
        category=category,
        status="active"
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal


def delete_user_goal(db: Session, user_id: int, goal_id: int) -> bool:
    goal = db.query(FinancialGoal).filter(FinancialGoal.id == goal_id, FinancialGoal.user_id == user_id).first()
    if not goal:
        return False
    db.delete(goal)
    db.commit()
    return True


# ---------- Learning Progress ----------

def get_user_learning_progress(db: Session, user_id: int) -> list[LearningProgress]:
    return db.query(LearningProgress).filter(LearningProgress.user_id == user_id).all()


def record_learning_progress(
    db: Session,
    user_id: int,
    lesson_id: str,
    quiz_score: int = 100
) -> LearningProgress:
    record = db.query(LearningProgress).filter(
        LearningProgress.user_id == user_id,
        LearningProgress.lesson_id == lesson_id
    ).first()
    if record:
        record.quiz_score = max(record.quiz_score, quiz_score)
        record.completed = True
    else:
        record = LearningProgress(
            user_id=user_id,
            lesson_id=lesson_id,
            quiz_score=quiz_score,
            completed=True
        )
        db.add(record)
    db.commit()
    db.refresh(record)
    return record