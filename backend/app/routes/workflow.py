from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from ..Services.workflow_service import orchestrate_workflow
import json

router = APIRouter()

@router.post("/workflow")
async def run_workflow(prompt: dict):
    """
    Triggers an agentic workflow and streams back real-time progress.
    """
    user_prompt = prompt.get("prompt")
    if not user_prompt:
        return {"error": "Prompt is required."}

    # The event generator from the workflow service
    event_generator = orchestrate_workflow(user_prompt)

    # Use StreamingResponse to send data back to the client as a stream
    async def event_streamer():
        async for event in event_generator:
            # Format the event as a JSON string and yield it
            yield json.dumps(event) + "\n"

    return StreamingResponse(event_streamer(), media_type="application/json")