from fastapi import FastAPI
from Backend.app import models
from Backend.app.routers import user, check, auth, transaction
from Backend.app.database import engine
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html


app = FastAPI()

models.Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:8000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(auth.router)
app.include_router(transaction.router)
app.include_router(check.router)


@app.get("/")
async def root():
    return {"message": "root page"}


@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=app.title + " - Swagger UI",
        swagger_favicon_url=None,
        swagger_ui_parameters={"withCredentials": True},  # فعال کردن ارسال کوکی‌ها
    )
