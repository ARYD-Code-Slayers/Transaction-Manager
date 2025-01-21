from fastapi import FastAPI
from app import models
from app.routers import auth, user, transaction, check
from app.database import engine

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

app.include_router(user.router)
app.include_router(auth.router)
app.include_router(transaction.router)
app.include_router(check.router)


@app.get("/")
async def root():
    return {"message": "root page"}
