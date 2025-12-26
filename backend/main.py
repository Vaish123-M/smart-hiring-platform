from fastapi import FastAPI
from auth.router import router as auth_router
from resume.router import router as resume_router
app = FastAPI(title="Smart Hiring Platform")

app.include_router(auth_router)
app.include_router(resume_router)

@app.get("/")
def home():
    return {"status": "Smart Hiring Platform API running"}
