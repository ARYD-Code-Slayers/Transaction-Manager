from datetime import date

from passlib.context import CryptContext

from Backend.app import models

# Dependence setup to hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hashFunction(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def is_check_due(check: models.Check) -> bool:
    today = date.today()
    return today >= check.due_date
