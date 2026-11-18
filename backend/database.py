import os
import uuid
import hashlib
import secrets
from datetime import datetime
from sqlalchemy import create_engine, Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

if os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
    DB_PATH = "/tmp/breatheasy.db"
else:
    DB_DIR = os.path.dirname(os.path.abspath(__file__))
    DB_PATH = os.path.join(DB_DIR, "breatheasy.db")

DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def hash_password(password: str) -> str:
    """Hash a password using salted SHA-256."""
    salt = "breatheasy_salt_2026"
    return hashlib.sha256((salt + password).encode('utf-8')).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed

class UserModel(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, default="User")
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    token = Column(String, index=True, nullable=True)
    city = Column(String, default="New Delhi")
    country = Column(String, default="India")
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    home_type = Column(String, default="Apartment") # Apartment, Independent House, Villa
    has_purifier = Column(Boolean, default=True)
    cooking_fuel = Column(String, default="Induction") # Induction, LPG, Piped Gas
    commute_mode = Column(String, default="Metro/Train") # Metro/Train, Electric Vehicle, Carpool, Car (Solo)
    commute_distance_km = Column(Float, default=12.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    family_members = relationship("FamilyMemberModel", back_populates="user", cascade="all, delete-orphan")
    habits = relationship("UserHabitModel", back_populates="user", cascade="all, delete-orphan")

class FamilyMemberModel(Base):
    __tablename__ = "family_members"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    name = Column(String, nullable=False)
    role = Column(String, default="Child") # Child, Elderly, Self, Spouse, Pet, Other
    age = Column(Integer, default=6)
    health_conditions = Column(String, default="Asthma") # Comma-separated
    risk_level = Column(String, default="High") # Low, Moderate, High, Severe

    user = relationship("UserModel", back_populates="family_members")

class UserHabitModel(Base):
    __tablename__ = "user_habits"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    swap_id = Column(String, nullable=False)
    adopted = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("UserModel", back_populates="habits")

class CommunityPostModel(Base):
    __tablename__ = "community_posts"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    author = Column(String, nullable=False)
    neighborhood = Column(String, nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    post_type = Column(String, default="initiative") # initiative, tip, alert, event
    participants_count = Column(Integer, default=1)
    upvotes = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)

def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if default demo user exists
    user = db.query(UserModel).filter(UserModel.email == "rajesh.sharma@example.com").first()
    if not user:
        default_token = secrets.token_hex(24)
        user = UserModel(
            id="default-user",
            name="Rajesh Sharma",
            email="rajesh.sharma@example.com",
            password_hash=hash_password("password123"),
            token=default_token,
            city="New Delhi",
            country="India",
            home_type="Apartment",
            has_purifier=True,
            cooking_fuel="Induction",
            commute_mode="Metro/Train",
            commute_distance_km=14.0
        )
        db.add(user)
        db.commit()

        # Seed initial family members for Rajesh
        members = [
            FamilyMemberModel(id="fam-1", user_id="default-user", name="Rajesh", role="Self", age=38, health_conditions="None", risk_level="Moderate"),
            FamilyMemberModel(id="fam-2", user_id="default-user", name="Priya", role="Spouse", age=35, health_conditions="None", risk_level="Moderate"),
            FamilyMemberModel(id="fam-3", user_id="default-user", name="Arya", role="Child", age=6, health_conditions="Asthma, Seasonal Wheezing", risk_level="Severe"),
            FamilyMemberModel(id="fam-4", user_id="default-user", name="Sushila", role="Elderly", age=68, health_conditions="Hypertension, Cardiac Sensitivity", risk_level="Severe"),
        ]
        db.add_all(members)

    # Seed community initiatives if empty
    if db.query(CommunityPostModel).count() == 0:
        posts = [
            CommunityPostModel(
                id="post-1",
                author="Dwarka Sector 9 RWA",
                neighborhood="Dwarka, New Delhi",
                title="🚫 Zero Stubble & Biomass Night Patrol",
                content="Resident volunteer brigade patrolling green corridors at 6:00 AM and 9:30 PM to curb open leaf and trash incineration. Join the local rapid-response WhatsApp alert grid!",
                post_type="initiative",
                participants_count=88,
                upvotes=145
            ),
            CommunityPostModel(
                id="post-2",
                author="Kavita Verma (Eco Lead)",
                neighborhood="South City 2, Gurugram",
                title="🌱 Group Buy: MERV-13 Filters & DIY Box Purifier Workshop",
                content="Bulk discount secured for 20-inch MERV-13 furnace filters at ₹420 each. Free 30-minute Corsi-Rosenthal assembly workshop this Saturday at Community Hall B.",
                post_type="event",
                participants_count=62,
                upvotes=110
            ),
            CommunityPostModel(
                id="post-3",
                author="Dr. Amit Sen (Pulmonologist)",
                neighborhood="Indirapuram, Ghaziabad",
                title="💡 Clinical Pediatric Guideline for AQI > 250",
                content="Never place purifiers blowing direct drafts on a sleeping child's face. Place the unit 6 feet away angled upward at 45 degrees towards the ceiling for optimal room displacement.",
                post_type="tip",
                participants_count=130,
                upvotes=240
            ),
            CommunityPostModel(
                id="post-4",
                author="Rohini Clean Air Coalition",
                neighborhood="Rohini Sector 15, Delhi",
                title="🚲 Car-Free Friday Challenge: 45 Societies Pledged",
                content="Over 40 residential complexes have committed to zero solo car trips this Friday. Take the electric feeder buses or Delhi Metro and record your carbon offsets!",
                post_type="initiative",
                participants_count=245,
                upvotes=320
            ),
        ]
        db.add_all(posts)
        db.commit()
    db.close()
