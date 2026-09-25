from datetime import timedelta
from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db, get_current_user
from app.core.config import settings
from app.core.exceptions import BadRequestException, CredentialsException
from app.core.security import get_password_hash, verify_password, create_access_token
from app.models.user import User
from app.schemas.auth import UserCreate, UserLogin, UserResponse, Token

router = APIRouter()


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_in.email.lower()))
    if result.scalar_one_or_none():
        raise BadRequestException("User with this email already exists")

    user = User(
        email=user_in.email.lower(),
        password_hash=get_password_hash(user_in.password),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    access_token = create_access_token(subject=user.id)
    return Token(access_token=access_token, token_type="bearer", user=UserResponse.model_validate(user))


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).where(User.email == form_data.username.lower()))
    user = result.scalar_one_or_none()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise CredentialsException("Incorrect email or password")

    access_token = create_access_token(subject=user.id)
    return Token(access_token=access_token, token_type="bearer", user=UserResponse.model_validate(user))


@router.post("/login/json", response_model=Token)
async def login_json(
    credentials: UserLogin,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).where(User.email == credentials.email.lower()))
    user = result.scalar_one_or_none()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise CredentialsException("Incorrect email or password")

    access_token = create_access_token(subject=user.id)
    return Token(access_token=access_token, token_type="bearer", user=UserResponse.model_validate(user))


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user
