from fastapi import APIRouter
from ..Schemas.chat_schema import ChatRequest, ChatResponse
from ..Services.llm_service import get_llm_response

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    response = await get_llm_response(request.message)
    return ChatResponse(response=response)
