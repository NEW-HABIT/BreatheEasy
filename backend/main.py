"""
BreatheEasy — FastAPI Backend
Production-ready urban air quality assistant API with full User Authentication & Profile module.
"""

import uuid
import secrets
from contextlib import asynccontextmanager
from datetime import datetime
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException, Query, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from database import (
    SessionLocal,
    UserModel,
    FamilyMemberModel,
    CommunityPostModel,
    hash_password,
    verify_password,
    init_db,
)
from services.aqi_service import fetch_realtime_aqi
from services.ai_service import ask_ai, generate_routine
from services.impact_service import SWAPS, calculate_impact


# ---------------------------------------------------------------------------
# Lifespan (startup / shutdown)
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


# ---------------------------------------------------------------------------
# App & CORS
# ---------------------------------------------------------------------------

app = FastAPI(
    title="BreatheEasy API",
    version="1.0.0",
    description="Urban Air Quality Assistant backend — real-time AQI, AI health advice, and sustainable swap tracking.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    city: Optional[str] = "New Delhi"
    country: Optional[str] = "India"
    home_type: Optional[str] = "Apartment"
    has_purifier: Optional[bool] = True
    cooking_fuel: Optional[str] = "Induction"
    commute_mode: Optional[str] = "Metro/Train"
    commute_distance_km: Optional[float] = 12.0


class LoginRequest(BaseModel):
    email: str
    password: str


class ChatRequest(BaseModel):
    question: str
    aqi_data: Dict[str, Any] = {}
    family_members: List[Dict[str, Any]] = []
    custom_api_key: Optional[str] = None


class RoutineRequest(BaseModel):
    aqi_data: Dict[str, Any] = {}
    family_members: List[Dict[str, Any]] = []


class ImpactRequest(BaseModel):
    adopted_swap_ids: List[str] = []


class UserUpdateRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    home_type: Optional[str] = None
    has_purifier: Optional[bool] = None
    cooking_fuel: Optional[str] = None
    commute_mode: Optional[str] = None
    commute_distance_km: Optional[float] = None


class FamilyMemberRequest(BaseModel):
    name: str
    role: str = "Other"
    age: int = 30
    health_conditions: str = "None"
    risk_level: str = "Moderate"


class CommunityPostRequest(BaseModel):
    author: str
    neighborhood: str
    title: str
    content: str
    post_type: str = "initiative"


# ---------------------------------------------------------------------------
# Utility
# ---------------------------------------------------------------------------

def db_user_to_dict(user: UserModel) -> dict:
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "city": user.city,
        "country": user.country,
        "lat": user.lat,
        "lng": user.lng,
        "homeType": user.home_type,
        "hasPurifier": user.has_purifier,
        "cookingFuel": user.cooking_fuel,
        "commuteMode": user.commute_mode,
        "commuteDistanceKm": user.commute_distance_km,
        "createdAt": user.created_at.isoformat() if user.created_at else None,
        "familyMembers": [db_member_to_dict(m) for m in user.family_members],
    }


def db_member_to_dict(m: FamilyMemberModel) -> dict:
    conditions = [c.strip() for c in (m.health_conditions or "").split(",") if c.strip()]
    if not conditions:
        conditions = ["None"]
    return {
        "id": m.id,
        "name": m.name,
        "role": m.role,
        "age": m.age,
        "healthConditions": conditions,
        "riskLevel": m.risk_level,
    }


def db_post_to_dict(p: CommunityPostModel) -> dict:
    return {
        "id": p.id,
        "author": p.author,
        "neighborhood": p.neighborhood,
        "title": p.title,
        "content": p.content,
        "postType": p.post_type,
        "participantsCount": p.participants_count,
        "upvotes": p.upvotes,
        "createdAt": p.created_at.isoformat() if p.created_at else None,
    }


def get_user_from_auth_header(authorization: Optional[str], db) -> Optional[UserModel]:
    if not authorization:
        return None
    token = authorization.replace("Bearer ", "").strip()
    if not token:
        return None
    return db.query(UserModel).filter(UserModel.token == token).first()


# ---------------------------------------------------------------------------
# Routes — Health
# ---------------------------------------------------------------------------

@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "service": "BreatheEasy FastAPI Backend", "version": "1.0.0"}


@app.get("/api/health", tags=["Health"])
def health_check():
    return {"status": "ok", "version": "1.0.0"}


# ---------------------------------------------------------------------------
# Routes — User Authentication & Profile Module
# ---------------------------------------------------------------------------

@app.post("/api/auth/register", tags=["Auth"])
def register(body: RegisterRequest):
    """Register a new user account with initial lifestyle parameters."""
    db = SessionLocal()
    try:
        existing = db.query(UserModel).filter(UserModel.email == body.email.lower()).first()
        if existing:
            raise HTTPException(status_code=400, detail="An account with this email already exists.")

        user_token = secrets.token_hex(24)
        new_user = UserModel(
            id=str(uuid.uuid4()),
            name=body.name.strip(),
            email=body.email.lower().strip(),
            password_hash=hash_password(body.password),
            token=user_token,
            city=body.city or "New Delhi",
            country=body.country or "India",
            home_type=body.home_type or "Apartment",
            has_purifier=body.has_purifier if body.has_purifier is not None else True,
            cooking_fuel=body.cooking_fuel or "Induction",
            commute_mode=body.commute_mode or "Metro/Train",
            commute_distance_km=body.commute_distance_km or 12.0
        )
        db.add(new_user)
        db.commit()

        # Add self as first default family member
        self_member = FamilyMemberModel(
            id=str(uuid.uuid4()),
            user_id=new_user.id,
            name=new_user.name,
            role="Self",
            age=30,
            health_conditions="None",
            risk_level="Low"
        )
        db.add(self_member)
        db.commit()
        db.refresh(new_user)

        return {
            "token": user_token,
            "user": db_user_to_dict(new_user)
        }
    finally:
        db.close()


@app.post("/api/auth/login", tags=["Auth"])
def login(body: LoginRequest):
    """Authenticate existing user credentials."""
    db = SessionLocal()
    try:
        user = db.query(UserModel).filter(UserModel.email == body.email.lower()).first()
        if not user or not verify_password(body.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid email or password.")

        # Generate fresh session token
        user.token = secrets.token_hex(24)
        db.commit()
        db.refresh(user)

        return {
            "token": user.token,
            "user": db_user_to_dict(user)
        }
    finally:
        db.close()


@app.get("/api/auth/me", tags=["Auth"])
def get_current_user(authorization: Optional[str] = Header(None)):
    """Fetch profile of currently authenticated user using Bearer token."""
    db = SessionLocal()
    try:
        user = get_user_from_auth_header(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Unauthorized. Please log in.")
        return {"user": db_user_to_dict(user)}
    finally:
        db.close()


@app.post("/api/auth/logout", tags=["Auth"])
def logout(authorization: Optional[str] = Header(None)):
    """Log out user session."""
    db = SessionLocal()
    try:
        user = get_user_from_auth_header(authorization, db)
        if user:
            user.token = None
            db.commit()
        return {"success": True, "message": "Logged out successfully."}
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Routes — AQI
# ---------------------------------------------------------------------------

@app.get("/api/aqi", tags=["AQI"])
def get_aqi(
    city: str = Query(default="New Delhi"),
    lat: Optional[float] = Query(default=None),
    lng: Optional[float] = Query(default=None),
):
    """Fetch real-time AQI for a city or lat/lng coordinates."""
    try:
        data = fetch_realtime_aqi(city=city, lat=lat, lng=lng)
        return data
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AQI service error: {str(e)}")


# ---------------------------------------------------------------------------
# Routes — AI Chat & Routine
# ---------------------------------------------------------------------------

@app.post("/api/chat", tags=["AI"])
def chat(body: ChatRequest):
    """Send a question with current AQI context; receive AI health advice."""
    try:
        result = ask_ai(
            question=body.question,
            aqi_data=body.aqi_data,
            family_members=body.family_members,
            custom_api_key=body.custom_api_key,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")


@app.post("/api/routine", tags=["AI"])
def get_routine(body: RoutineRequest):
    """Generate a personalized daily routine based on AQI and family composition."""
    try:
        routine = generate_routine(
            aqi_data=body.aqi_data,
            family_members=body.family_members,
        )
        return {"routine": routine}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Routine generation error: {str(e)}")


# ---------------------------------------------------------------------------
# Routes — Swaps & Impact
# ---------------------------------------------------------------------------

@app.get("/api/swaps", tags=["Swaps"])
def get_swaps():
    """Return the full list of sustainable lifestyle swaps."""
    return {"swaps": SWAPS}


@app.post("/api/swaps/calculate-impact", tags=["Swaps"])
def calc_impact(body: ImpactRequest):
    """Calculate aggregate environmental impact of adopted swaps."""
    try:
        impact = calculate_impact(body.adopted_swap_ids)
        return impact
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Impact calculation error: {str(e)}")


# ---------------------------------------------------------------------------
# Routes — Users & Family Profiles
# ---------------------------------------------------------------------------

@app.get("/api/users/{user_id}", tags=["Users"])
def get_user(user_id: str):
    db = SessionLocal()
    try:
        user = db.query(UserModel).filter(UserModel.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return db_user_to_dict(user)
    finally:
        db.close()


@app.put("/api/users/{user_id}", tags=["Users"])
def update_user(user_id: str, body: UserUpdateRequest):
    db = SessionLocal()
    try:
        user = db.query(UserModel).filter(UserModel.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        update_data = body.model_dump(exclude_none=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        db.commit()
        db.refresh(user)
        return db_user_to_dict(user)
    finally:
        db.close()


@app.post("/api/users/{user_id}/family", tags=["Users"])
def add_family_member(user_id: str, body: FamilyMemberRequest):
    db = SessionLocal()
    try:
        user = db.query(UserModel).filter(UserModel.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        member = FamilyMemberModel(
            id=str(uuid.uuid4()),
            user_id=user_id,
            name=body.name,
            role=body.role,
            age=body.age,
            health_conditions=body.health_conditions,
            risk_level=body.risk_level,
        )
        db.add(member)
        db.commit()
        db.refresh(member)
        return db_member_to_dict(member)
    finally:
        db.close()


@app.delete("/api/users/{user_id}/family/{member_id}", tags=["Users"])
def delete_family_member(user_id: str, member_id: str):
    db = SessionLocal()
    try:
        member = (
            db.query(FamilyMemberModel)
            .filter(FamilyMemberModel.id == member_id, FamilyMemberModel.user_id == user_id)
            .first()
        )
        if not member:
            raise HTTPException(status_code=404, detail="Family member not found")
        db.delete(member)
        db.commit()
        return {"success": True, "deleted_id": member_id}
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Routes — Community
# ---------------------------------------------------------------------------

@app.get("/api/community", tags=["Community"])
def get_community_posts():
    db = SessionLocal()
    try:
        posts = db.query(CommunityPostModel).order_by(CommunityPostModel.upvotes.desc()).all()
        return {"posts": [db_post_to_dict(p) for p in posts]}
    finally:
        db.close()


@app.post("/api/community", tags=["Community"])
def create_community_post(body: CommunityPostRequest):
    db = SessionLocal()
    try:
        post = CommunityPostModel(
            id=str(uuid.uuid4()),
            author=body.author,
            neighborhood=body.neighborhood,
            title=body.title,
            content=body.content,
            post_type=body.post_type,
            participants_count=1,
            upvotes=1,
            created_at=datetime.utcnow(),
        )
        db.add(post)
        db.commit()
        db.refresh(post)
        return db_post_to_dict(post)
    finally:
        db.close()


@app.post("/api/community/{post_id}/upvote", tags=["Community"])
def upvote_post(post_id: str):
    db = SessionLocal()
    try:
        post = db.query(CommunityPostModel).filter(CommunityPostModel.id == post_id).first()
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        post.upvotes += 1
        db.commit()
        return {"success": True, "upvotes": post.upvotes}
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Dev entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
