from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey, Numeric, Float
from sqlalchemy.sql.expression import text
from .database import Base
from sqlalchemy.sql.sqltypes import TIMESTAMP
import random
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    firstname = Column(String, nullable=False)
    lastname = Column(String, nullable=False)
    national_id = Column(String, nullable=False, unique=True, primary_key=True)
    phone_number = Column(String, nullable=False, unique=True)
    birthday_date = Column(Date, nullable=False)
    password = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))
    is_admin = Column(Boolean, default=False)

    accounts = relationship("Account", back_populates="user")


class Account(Base):
    __tablename__ = "accounts"

    account_number = Column(String(16), primary_key=True, unique=True, nullable=False)
    user_id = Column(String, ForeignKey("users.national_id"), nullable=False)
    balance = Column(Numeric(scale=2), nullable=False, server_default="0.00")
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))

    user = relationship("User", back_populates="accounts")
    checks = relationship("Check", back_populates="account")

    @staticmethod
    def generate_account_number():
        return ''.join(random.choices("0123456789", k=16))


class Transaction(Base):
    __tablename__ = "transactions"

    transaction_id = Column(Integer, primary_key=True, autoincrement=True)
    source_account_number = Column(String, ForeignKey("accounts.account_number"))
    destination_account_number = Column(String, ForeignKey("accounts.account_number"))
    transaction_type = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))

    source_account = relationship("Account", foreign_keys=[source_account_number])
    destination_account = relationship("Account", foreign_keys=[destination_account_number])


class Check(Base):
    __tablename__ = "checks"

    check_id = Column(Integer, primary_key=True, autoincrement=True)
    check_number = Column(String(20), unique=True, nullable=False)
    account_number = Column(String(16), ForeignKey("accounts.account_number"), nullable=False)
    issue_date = Column(Date, nullable=False)
    due_date = Column(Date, nullable=False)
    amount = Column(Numeric(scale=2), nullable=False)
    status = Column(String, default="Issued")  # Issued, Cashed
    cashed_date = Column(Date, nullable=True)
    created_at = Column(Date, nullable=False, server_default=text("now()"))

    account = relationship("Account", back_populates="checks")

    @staticmethod
    def generate_check_number():
        return ''.join(random.choices("0123456789", k=20))
