from pydantic import BaseModel, validator
from datetime import datetime, date
from fastapi import HTTPException, status
import re
from decimal import Decimal


class RequestPostSchema(BaseModel):
    title: str
    content: str
    published: bool = True


class ResponsePostSchema(BaseModel):
    title: str
    content: str
    published: bool
    created_at: datetime
    id: int

    class Config:
        from_attributes = True


class RequestCreateUserSchema(BaseModel):
    firstname: str
    lastname: str
    national_id: str
    phone_number: str
    birthday_date: date
    password: str

    @validator('firstname', 'lastname')
    def check_name_not_blank(cls, value):
        if not value.strip():
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Name cannot be empty or just spaces"
            )
        return value

    @validator('national_id')
    def check_national_code(cls, value):
        if not re.match(r'^\d{10}$', str(value)):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="National code must be exactly 10 digits"
            )
        return value

    @validator('phone_number')
    def check_phone_number(cls, value):
        phone_str = str(value)
        if not re.match(r'^0(9[0-9]{2})\d{7}$', phone_str):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Phone number must be 11 digits, start with 09, and follow Iranian mobile number format"
            )
        return value

    @validator('password')
    def check_password_strength(cls, value):
        if len(value) < 8:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Password must be at least 8 characters long"
            )
        if not re.search(r'[A-Z]', value):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Password must contain at least one uppercase letter"
            )
        if not re.search(r'[a-z]', value):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Password must contain at least one lowercase letter"
            )
        if not re.search(r'\d', value):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Password must contain at least one digit"
            )
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Password must contain at least one special character"
            )
        return value


class ResponseCreateUserSchema(BaseModel):
    firstname: str
    lastname: str
    national_id: str
    phone_number: str
    birthday_date: date
    created_at: datetime

    class Config:
        orm_mode = True


class UserLogin(BaseModel):
    national_id: str
    password: str


class UserDetailsSchema(BaseModel):
    firstname: str
    lastname: str
    national_id: str
    phone_number: str
    birthday_date: date
    account_number: str
    balance: float


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    national_id: str


class TransactionSchema(BaseModel):
    transaction_id: int
    source_account_number: str
    destination_account_number: str
    transaction_type: str
    amount: float
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True


class AccountOwnerSchema(BaseModel):
    fullname: str

    class Config:
        orm_mode = True


class TransactionDetailSchema(BaseModel):
    transaction_id: int
    source_account_number: str
    destination_account_number: str
    transaction_type: str
    amount: float
    created_at: datetime
    source_account_owner: AccountOwnerSchema
    destination_account_owner: AccountOwnerSchema

    class Config:
        orm_mode = True


class TransferSchema(BaseModel):
    source_account_number: str
    destination_account_number: str
    amount: float

    @validator("source_account_number", "destination_account_number")
    def validate_account_number(cls, value):
        if not value.isdigit() or len(value) != 16:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Account number must be 16 digits."
            )
        return value

    @validator("amount")
    def validate_amount(cls, value):
        if value <= 0:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Amount must be greater than zero."
            )
        return value


class CheckSchema(BaseModel):
    check_id: int
    check_number: str
    account_number: str
    issue_date: date
    due_date: date
    amount: Decimal
    status: str
    cashed_date: date | None = None

    class Config:
        orm_mode = True


class RequestCheckSchema(BaseModel):
    account_number: str
    amount: Decimal
    due_date: date

    @validator("amount")
    def validate_amount(cls, value):
        if value <= 0:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Amount must be greater than zero."
            )
        return value
