import json
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field

app = FastAPI(title="Adity Portfolio API", version="2.0.0")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_PATH = Path(__file__).resolve().parent / "data" / "portfolio.json"


def load_portfolio_data() -> dict[str, Any]:
    with DATA_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


class ContactMessage(BaseModel):
    name: str = Field(..., min_length=2, max_length=80)
    email: EmailStr
    message: str = Field(..., min_length=5, max_length=2000)


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "Adity Portfolio API is running. Visit /docs for API documentation."}


@app.get("/api/portfolio")
def get_portfolio() -> dict[str, Any]:
    return load_portfolio_data()


@app.get("/api/projects")
def get_projects() -> list[dict[str, Any]]:
    return load_portfolio_data()["projects"]


@app.get("/api/projects/{slug}")
def get_project(slug: str) -> dict[str, Any]:
    projects = load_portfolio_data()["projects"]
    for project in projects:
        if project["slug"] == slug:
            return project
    raise HTTPException(status_code=404, detail="Project not found")


@app.get("/api/skills")
def get_skills() -> list[dict[str, Any]]:
    return load_portfolio_data()["skills"]


@app.post("/api/contact")
def receive_contact_message(message: ContactMessage) -> dict[str, str]:
    # Demo endpoint only. Add Gmail/SMTP/SendGrid later for real email delivery.
    return {
        "status": "received",
        "message": f"Thank you, {message.name}. Your message was received by the demo API.",
    }
