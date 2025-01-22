from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import date
from typing import List
from Backend.app import models, schemas, oauth2
from Backend.app.database import get_db
from Backend.app.utils import is_check_due

router = APIRouter(prefix="/checks", tags=["Checks"])


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_check(
        check_request: schemas.RequestCheckSchema,
        db: Session = Depends(get_db),
        current_user: schemas.TokenData = Depends(oauth2.get_current_user)
):
    account = db.query(models.Account).filter(
        models.Account.account_number == check_request.account_number
    ).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    if account.user_id != current_user.national_id:
        raise HTTPException(status_code=403, detail="You are not the owner of this account")

    check_number = models.Check.generate_check_number()
    new_check = models.Check(
        check_number=check_number,
        account_number=check_request.account_number,
        issue_date=date.today(),
        due_date=check_request.due_date,
        amount=check_request.amount
    )
    db.add(new_check)
    db.commit()
    db.refresh(new_check)

    return {
        "check": new_check
    }


@router.get("/issued", response_model=List[schemas.CheckSchema])
def get_issued_checks(
        db: Session = Depends(get_db),
        current_user: schemas.TokenData = Depends(oauth2.get_current_user)
):
    account = db.query(models.Account).filter(
        models.Account.user_id == current_user.national_id
    ).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found for this user")

    checks = db.query(models.Check).filter(
        models.Check.account_number == account.account_number
    ).all()

    if not checks:
        raise HTTPException(status_code=404, detail="No checks issued for this user")

    return checks


@router.get("/cashed", response_model=List[schemas.CheckSchema])
def get_cashed_checks(
        db: Session = Depends(get_db),
        current_user: schemas.TokenData = Depends(oauth2.get_current_user)
):
    account = db.query(models.Account).filter(
        models.Account.user_id == current_user.national_id
    ).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found for this user")

    cashed_checks = db.query(models.Check).filter(
        models.Check.account_number == account.account_number,
        models.Check.status == "Cashed"
    ).all()

    if not cashed_checks:
        raise HTTPException(status_code=404, detail="No cashed checks for this user")

    return cashed_checks


@router.post("/cash/{check_number}", status_code=status.HTTP_200_OK)
def cash_check(
        check_number: str,
        db: Session = Depends(get_db),
        current_user: schemas.TokenData = Depends(oauth2.get_current_user)
):
    check = db.query(models.Check).filter(models.Check.check_number == check_number).first()
    if not check:
        raise HTTPException(status_code=404, detail="Check not found")

    if not is_check_due(check):
        raise HTTPException(status_code=400, detail="Check is not due yet")

    if check.status == "Cashed":
        raise HTTPException(status_code=400, detail="Check has already been cashed")

    source_account = db.query(models.Account).filter(
        models.Account.account_number == check.account_number
    ).first()
    if not source_account:
        raise HTTPException(status_code=404, detail="Source account not found")

    if source_account.balance < check.amount:
        raise HTTPException(status_code=400, detail="Insufficient funds in source account")

    destination_account = db.query(models.Account).filter(
        models.Account.account_number == check.account_number
    ).first()
    if not destination_account:
        raise HTTPException(status_code=404, detail="Destination account not found")

    source_account.balance -= check.amount
    destination_account.balance += check.amount

    check.status = "Cashed"
    check.cashed_date = date.today()

    db.commit()

    return {
        "message": "Check cashed successfully",
        "check": check
    }
