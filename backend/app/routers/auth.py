from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import os

router = APIRouter()

SECRET_KEY  = os.getenv("JWT_SECRET_KEY", "nirf-platform-secret-change-in-production")
ALGORITHM   = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 480  # 8 hours

pwd_ctx    = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2     = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

# In production, replace with database queries
DEMO_USERS = {
    "vc@university.edu":       {"hashed_password": pwd_ctx.hash("demo123"), "role": "super_admin",       "name": "Vice Chancellor",   "institution": "Shoolini University"},
    "iqac@university.edu":     {"hashed_password": pwd_ctx.hash("demo123"), "role": "university_admin",  "name": "IQAC Head",         "institution": "Shoolini University"},
    "research@university.edu": {"hashed_password": pwd_ctx.hash("demo123"), "role": "university_admin",  "name": "Dean Research",     "institution": "Shoolini University"},
    "dept@university.edu":     {"hashed_password": pwd_ctx.hash("demo123"), "role": "department_admin",  "name": "Department Admin",  "institution": "Shoolini University"},
}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    name: str
    institution: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    name: str
    institution: str
    role: str


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode["exp"] = expire
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str = Depends(oauth2)) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")


@router.post("/token", response_model=TokenResponse)
async def login(form: OAuth2PasswordRequestForm = Depends()):
    user = DEMO_USERS.get(form.username)
    if not user or not pwd_ctx.verify(form.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    token = create_access_token({"sub": form.username, "role": user["role"]})
    return TokenResponse(
        access_token=token,
        role=user["role"],
        name=user["name"],
        institution=user["institution"],
    )


@router.post("/register", status_code=201)
async def register(req: RegisterRequest):
    if req.email in DEMO_USERS:
        raise HTTPException(status_code=400, detail="Email already registered")
    # In production: save to database
    hashed = pwd_ctx.hash(req.password)
    token = create_access_token({"sub": req.email, "role": req.role})
    return {"message": "Account created successfully", "access_token": token, "token_type": "bearer"}


@router.get("/me")
async def get_current_user(payload: dict = Depends(verify_token)):
    email = payload.get("sub")
    user  = DEMO_USERS.get(email, {})
    return {"email": email, "role": payload.get("role"), **{k: v for k, v in user.items() if k != "hashed_password"}}
