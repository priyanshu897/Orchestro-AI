from ..Services.llm_service import generate_text
from ..Schemas.workflow_schema import WorkflowState
from typing import Dict, Any

async def ideation_agent(state: WorkflowState) -> Dict[str, Any]:
    topic = state["topic"]
    if not topic:
        return {"script": "Error: No topic provided for ideation."}

    prompt = (
        f"You are a creative ideation agent for a content creator. Your task is to generate a concise video concept "
        f"and a brief script outline for a video about: '{topic}'. "
        f"Format the output with clear headings, such as 'Video Concept' and 'Script Outline'."
        f"Keep the response concise but informative, suitable for social media content."
    )
    
    try:
        response = await generate_text(prompt)
        
        # Format the response for better UI display
        formatted_response = f"## Video Concept & Script Outline\n\n**Topic:** {topic}\n\n{response}"
        
        return {"script": formatted_response}
    except Exception as e:
        error_message = f"## Error in Ideation Agent\n\n**Error:** {str(e)}\n\nPlease try again with a different topic."
        return {"script": error_message}