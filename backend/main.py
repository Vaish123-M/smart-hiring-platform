from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.middleware.cors import CORSMiddleware
import os
from auth.router import router as auth_router
from resume.router import router as resume_router
from matching.router import router as ats_router
from analytics.router import router as analytics_router
from insights.router import router as insights_router
from ai_enhancements.router import router as ai_router
from advanced_analytics.router import router as advanced_analytics_router

app = FastAPI(title="Smart Hiring Platform", docs_url=None, redoc_url=None)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "http://localhost:3001", 
        "http://127.0.0.1:3001",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(resume_router)
app.include_router(ats_router)
app.include_router(analytics_router)
app.include_router(insights_router)
app.include_router(ai_router)
app.include_router(advanced_analytics_router)

# Define directories
ai_frontend_dist = os.path.join(os.path.dirname(__file__), "../ai-resume-frontend/dist")
swagger_static_dir = os.path.join(os.path.dirname(__file__), "static")

# Mount static assets for frontend
if os.path.exists(ai_frontend_dist):
    assets_dir = os.path.join(ai_frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

# Mount static assets for swagger/docs
if os.path.exists(swagger_static_dir):
    app.mount("/static", StaticFiles(directory=swagger_static_dir), name="static")

@app.get("/swagger", include_in_schema=False)
async def custom_swagger_ui():
    """Swagger UI (kept for reference)"""
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title="Smart Hiring Platform API Docs",
        swagger_js_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js",
        swagger_css_url="/static/swagger-custom.css",
        swagger_favicon_url="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4bc.svg",
    )


@app.get("/docs", include_in_schema=False)
async def marketing_docs():
    """Serve custom React+Tailwind docs landing page"""
    docs_index = os.path.join(swagger_static_dir, "docs", "index.html")
    if os.path.exists(docs_index):
        return FileResponse(docs_index)
    return {"message": "Docs UI not found"}


@app.get("/")
async def serve_frontend_index():
    """Serve the React frontend index"""
    index_path = os.path.join(ai_frontend_dist, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"status": "AI Resume Analyzer API running"}


@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    """Catch-all route to serve SPA - redirects to index.html for any non-API routes"""
    # Don't catch API routes
    if full_path.startswith(("upload-resume", "skill-count", "swagger", "docs", "openapi.json", "assets", "static")):
        return {"error": "Not found"}
    
    # Serve index.html for all other routes (SPA routing)
    index_path = os.path.join(ai_frontend_dist, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"error": "Not found"}
