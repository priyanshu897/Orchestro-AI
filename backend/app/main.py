from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import chat, workflow

# Create the main FastAPI application instance
app = FastAPI(title="Orchestro AI Backend")

# --- CORS Configuration ---
# The frontend runs on a different port (3000) than the backend (8000),
# so we need to enable CORS to allow communication between them.
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# --- Include Routers ---
# This is how we attach our API routes to the main application.
app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(workflow.router, prefix="/api", tags=["Workflow"])

# --- Root Endpoint ---
# A simple endpoint to check if the backend is running
@app.get("/")
def root():
    return {"message": "Orchestro AI Backend is running 🚀"}