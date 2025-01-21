from fastapi import APIRouter, Depends, status, HTTPException, Response
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app import database, models, utils, oauth2

router = APIRouter(tags=['authentication'])


@router.post('/login')
def login(
        user_credentials: OAuth2PasswordRequestForm = Depends(),
        db: Session = Depends(database.get_db),
        response: Response = None
):
    user = db.query(models.User).filter(models.User.national_id == user_credentials.username).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid Credentials - there is no user with this national code"
        )

    if not utils.verify_password(user_credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid Credentials - the password is incorrect"
        )

    access_token = oauth2.create_access_token(data={"national_id": user.national_id, "is_admin": user.is_admin})

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="lax",
        secure=False
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
