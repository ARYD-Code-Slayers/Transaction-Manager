from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, aliased
from sqlalchemy import exc
from typing import List
from decimal import Decimal
from app import models, schemas, oauth2
from app.models import Transaction, Account, User
from app.database import get_db

router = APIRouter(tags=["Transactions"])


@router.get("/transactions", response_model=List[schemas.TransactionDetailSchema])
def get_all_transactions(
        db: Session = Depends(get_db),
        current_user: schemas.TokenData = Depends(oauth2.get_current_user)
):
    source_account_alias = aliased(Account)
    destination_account_alias = aliased(Account)
    source_user_alias = aliased(User)
    destination_user_alias = aliased(User)

    transactions = db.query(Transaction).join(
        source_account_alias, Transaction.source_account_number == source_account_alias.account_number
    ).join(
        source_user_alias, source_account_alias.user_id == source_user_alias.national_id
    ).join(
        destination_account_alias, Transaction.destination_account_number == destination_account_alias.account_number
    ).join(
        destination_user_alias, destination_account_alias.user_id == destination_user_alias.national_id
    ).filter(
        Transaction.amount != 0
    ).all()

    result = []
    for transaction in transactions:
        result.append(schemas.TransactionDetailSchema(
            transaction_id=transaction.transaction_id,
            source_account_number=transaction.source_account_number,
            destination_account_number=transaction.destination_account_number,
            transaction_type=transaction.transaction_type,
            amount=transaction.amount,
            created_at=transaction.created_at,
            source_account_owner=schemas.AccountOwnerSchema(
                fullname=f"{transaction.source_account.user.firstname} {transaction.source_account.user.lastname}"
            ),
            destination_account_owner=schemas.AccountOwnerSchema(
                fullname=f"{transaction.destination_account.user.firstname} {transaction.destination_account.user.lastname}"
            ),
        ))

    return result


@router.get("/deposits", response_model=List[schemas.TransactionSchema])
def get_deposits_by_current_user(
        db: Session = Depends(get_db),
        current_user: schemas.TokenData = Depends(oauth2.get_current_user)
):
    accounts = db.query(models.Account).filter(
        models.Account.user_id == current_user.national_id
    ).all()

    if not accounts:
        raise HTTPException(status_code=404, detail="No accounts found for this user")

    account_numbers = [account.account_number for account in accounts]

    deposits = db.query(models.Transaction).filter(
        models.Transaction.destination_account_number.in_(account_numbers)
    ).order_by(models.Transaction.created_at.desc()).all()

    if not deposits:
        raise HTTPException(status_code=404, detail="No deposits found for this user")

    return deposits


@router.get("/withdrawals", response_model=List[schemas.TransactionSchema])
def get_withdrawals_by_current_user(
        db: Session = Depends(get_db),
        current_user: schemas.TokenData = Depends(oauth2.get_current_user)
):
    accounts = db.query(models.Account).filter(
        models.Account.user_id == current_user.national_id
    ).all()

    if not accounts:
        raise HTTPException(status_code=404, detail="No accounts found for this user")

    account_numbers = [account.account_number for account in accounts]

    withdrawals = db.query(models.Transaction).filter(
        models.Transaction.destination_account_number.in_(account_numbers)
    ).order_by(models.Transaction.created_at.desc()).all()

    if not withdrawals:
        raise HTTPException(status_code=404, detail="No withdrawals found for this user")

    return withdrawals


@router.post("/transfer", status_code=status.HTTP_201_CREATED)
def transfer_funds(
        transfer_request: schemas.TransferSchema,
        db: Session = Depends(get_db),
        current_user: schemas.TokenData = Depends(oauth2.get_current_user)
):
    source_account = db.query(models.Account).filter(
        models.Account.account_number == transfer_request.source_account_number,
        models.Account.user_id == current_user.national_id
    ).first()
    if not source_account:
        raise HTTPException(status_code=404, detail="Source account not found or not owned by you")

    destination_account = db.query(models.Account).filter(
        models.Account.account_number == transfer_request.destination_account_number
    ).first()
    if not destination_account:
        raise HTTPException(status_code=404, detail="Destination account not found")

    transfer_amount = Decimal(str(transfer_request.amount))

    if source_account.balance < transfer_amount:
        raise HTTPException(status_code=400, detail="Insufficient funds")

    try:
        source_account.balance -= transfer_amount
        destination_account.balance += transfer_amount

        withdrawal_transaction = models.Transaction(
            source_account_number=transfer_request.source_account_number,
            destination_account_number=transfer_request.destination_account_number,
            transaction_type="withdrawal",
            amount=transfer_amount
        )
        db.add(withdrawal_transaction)

        deposit_transaction = models.Transaction(
            source_account_number=transfer_request.source_account_number,
            destination_account_number=transfer_request.destination_account_number,
            transaction_type="deposit",
            amount=transfer_amount
        )
        db.add(deposit_transaction)

        db.commit()

        return {
            "message": "Transfer successful",
            "withdrawal_transaction_id": withdrawal_transaction.transaction_id,
            "deposit_transaction_id": deposit_transaction.transaction_id
        }

    except exc.SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database error while processing the transaction")
