from ..Services.llm_service import generate_text
from ..Schemas.workflow_schema import WorkflowState
from typing import Dict, Any

async def ideation_agent(state: WorkflowState) -> Dict[str, Any]:
    topic = state.get("topic")
    if not topic:
        return {"script": "Error: No topic provided for ideation."}

    prompt = (
        f"You are a creative ideation agent for a content creator. Your task is to generate a concise video concept "
        f"and a brief script outline for a video about: '{topic}'. "
        f"Format the output with clear headings, such as 'Video Concept' and 'Script Outline'."
    )
    
    response = await generate_text(prompt)
    
    return {"script": response}