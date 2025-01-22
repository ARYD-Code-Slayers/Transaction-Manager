from jose import JWTError, jwt
from datetime import datetime, timedelta
from Backend.app import schemas
from fastapi import Depends, status, HTTPException, Request

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


def verify_access_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        national_id: str = payload.get("national_id")
        is_admin: bool = payload.get("is_admin", False)

        if national_id is None:
            raise credentials_exception

        token_data = schemas.TokenData(national_id=national_id, is_admin=is_admin)
    except JWTError as e:
        raise credentials_exception
    return token_data


def get_token_from_cookie(request: Request) -> str:
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated (no access_token cookie found)",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return token


def get_current_user(token: str = Depends(get_token_from_cookie)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )
    return verify_access_token(token, credentials_exception)


def require_admin(current_user: schemas.TokenData = Depends(get_current_user)):

    if not getattr(current_user, "is_admin", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have enough privileges (admin only)."
        )
    return current_user
