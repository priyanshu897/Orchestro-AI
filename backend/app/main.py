from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import chat

app = FastAPI(title="Orchestro AI Backend")

# ✅ CORS setup
origins = [
    "http://localhost:3000",   # React dev server
    "http://127.0.0.1:3000",
    # You can add your production frontend URL here later, e.g.
    # "https://your-frontend-domain.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # allowed origins
    allow_credentials=True,
    allow_methods=["*"],            # allow all HTTP methods
    allow_headers=["*"],            # allow all headers
)

# Include Routes
app.include_router(chat.router, prefix="/api", tags=["Chat"])

@app.get("/")
def root():
    return {"message": "Orchestro AI Backend is running 🚀"}

