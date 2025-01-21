from fastapi import HTTPException, status, Depends, APIRouter, Response
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app import schemas, models, utils, oauth2
from app.database import get_db

router = APIRouter(prefix="/user", tags=["Users"])


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_user(
        user: schemas.RequestCreateUserSchema,
        db: Session = Depends(get_db),
        response: Response = None
):
    try:
        hashed_password = utils.hashFunction(user.password)
        user.password = hashed_password

        new_user = models.User(**user.dict())
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        account_number = models.Account.generate_account_number()
        new_account = models.Account(
            account_number=account_number,
            user_id=new_user.national_id,
            balance=0.00
        )
        db.add(new_account)
        db.commit()
        db.refresh(new_account)

        access_token = oauth2.create_access_token(
            data={"national_id": new_user.national_id, "is_admin": new_user.is_admin}
        )

        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            samesite="lax",
            secure=False
        )

        return {
            "user": new_user,
            "account": new_account,
            "access_token": access_token
        }

    except IntegrityError as e:
        db.rollback()
        if "unique constraint" in str(e.orig):
            raise HTTPException(status_code=400, detail="Username or email already exists")
        else:
            raise HTTPException(status_code=500, detail="Database error")


@router.get("/details", response_model=schemas.UserDetailsSchema)
def get_user_details(
        db: Session = Depends(get_db),
        current_user: schemas.TokenData = Depends(oauth2.get_current_user)
):
    user = db.query(models.User).filter(models.User.national_id == current_user.national_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    account = db.query(models.Account).filter(models.Account.user_id == user.national_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found for user")

    return {
        "firstname": user.firstname,
        "lastname": user.lastname,
        "national_id": user.national_id,
        "phone_number": user.phone_number,
        "birthday_date": user.birthday_date,
        "account_number": account.account_number,
        "balance": account.balance
    }
