from langchain_huggingface import ChatHuggingFace,HuggingFaceEndpoint
from ..config import OPENAI_API_KEY

llm=HuggingFaceEndpoint(
    repo_id="openai/gpt-oss-20b",
    task="text-generation"
)
# Initialize LLM (OpenAI, can swap with Anthropic, Llama, etc.)

model=ChatHuggingFace(llm=llm)

async def get_llm_response(user_message: str) -> str:
    response = await llm.ainvoke(user_message)
    return response.content
