from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from api.upload import router as upload_router
from api.analytics import router as analytics_router # Import added

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router, prefix="/api/v1", tags=["Upload"])
app.include_router(analytics_router, prefix="/api/v1", tags=["Analytics"])

@app.get("/")
def read_root():
    return {"status": "Invoice AI Backend is Running"}

# import uvicorn
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from core.config import settings
# from api.upload import router as upload_router # Import the new router

# app = FastAPI(title=settings.PROJECT_NAME)

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Register the upload routes 
# app.include_router(upload_router, prefix="/api/v1", tags=["Upload"])

# @app.get("/")
# def read_root():
#     return {"status": "Invoice AI Backend is Running"}

# @app.get("/health")
# def health_check():
#     return {"status": "healthy"}

# if __name__ == "__main__":
#     uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)