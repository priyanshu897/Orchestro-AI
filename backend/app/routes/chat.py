from fastapi import APIRouter
from ..Schemas.chat_schema import ChatRequest, ChatResponse
from ..Services.llm_service import generate_text

# Create a new router for the chat API
router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Handles a chat request, calls the LLM service, and returns a response.
    """
    # Call the core LLM service with the user's message
    response = await generate_text(request.message)
    
    # Return the response wrapped in the Pydantic model
    return ChatResponse(response=response)