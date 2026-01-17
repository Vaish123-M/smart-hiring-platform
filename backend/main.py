from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.openapi.docs import get_swagger_ui_html
import os
from auth.router import router as auth_router
from resume.router import router as resume_router
from matching.router import router as ats_router
from analytics.router import router as analytics_router

app = FastAPI(title="Smart Hiring Platform", docs_url=None, redoc_url=None)

app.include_router(auth_router)
app.include_router(resume_router)
app.include_router(ats_router)
app.include_router(analytics_router)

# Mount static files from React build
static_dir = os.path.join(os.path.dirname(__file__), "../frontend/dist")
if os.path.exists(static_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(static_dir, "assets")), name="assets")

# Static assets for custom Swagger styling
swagger_static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(swagger_static_dir):
    app.mount("/static", StaticFiles(directory=swagger_static_dir), name="static")

@app.get("/")
async def serve_frontend():
    """Serve the React frontend"""
    index_path = os.path.join(static_dir, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"status": "Smart Hiring Platform API running"}


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
