# package initializer for routes
from .campaign_routes import router as campaign_router
from .analytics_routes import router as analytics_router
from .post_routes import router as post_router

__all__ = ["campaign_router", "analytics_router", "post_router"]
