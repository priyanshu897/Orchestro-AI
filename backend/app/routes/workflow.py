from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from ..Services.workflow_service import orchestrate_workflow
import json
import uuid

router = APIRouter()

@router.post("/workflow")
async def run_workflow(payload: dict):
    """
    Triggers or resumes an agentic workflow and streams back real-time progress.
    """
    user_prompt = payload.get("prompt")
    thread_id = payload.get("thread_id") # ✅ Get the thread_id from the request body

    if not user_prompt:
        return {"error": "Prompt is required."}

    # If no thread_id is provided, create a new one
    if not thread_id:
        thread_id = str(uuid.uuid4())

    # The event generator from the workflow service now receives both prompt and thread_id
    event_generator = orchestrate_workflow(user_prompt, thread_id)

    # Use StreamingResponse to send data back to the client as a stream
    async def event_streamer():
        async for event in event_generator:
            yield json.dumps(event) + "\n"

    return StreamingResponse(event_streamer(), media_type="application/json")