from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import logging
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import create_tables
from app.api.v1.api import api_router
from app.core.logging import setup_logging

# Setup logging
setup_logging()

# Lifespan context manager for startup/shutdown events


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger = logging.getLogger(__name__)
    logger.info("Starting Citizen Engagement Backend")

    # Create database tables
    await create_tables()

    yield

    # Shutdown
    logger.info("Shutting down Citizen Engagement Backend")

# Create FastAPI app
app = FastAPI(
    title="Citizen Engagement API",
    description="Professional backend for citizen engagement platform",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add trusted host middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS,
)

# Global exception handler


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger = logging.getLogger(__name__)
    logger.error(f"Global exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

# Health check endpoint


@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=True if settings.ENVIRONMENT == "development" else False,
        log_level="info"
    )
