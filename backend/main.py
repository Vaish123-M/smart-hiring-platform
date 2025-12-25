from fastapi import FastAPI

app = FastAPI(
    title="Smart Hiring Platform",
    description="AI-driven ATS & Talent Intelligence System",
    version="1.0.0"
)

@app.get("/")
def root():
    return {"status": "Smart Hiring Platform API running"}
