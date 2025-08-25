from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from typing import AsyncGenerator, Dict, Any
import json
import asyncio
from app.Services.workflow_service import WorkflowService
from app.jsonsaver import json_saver
from app.Schemas.workflow_schema import ThreadStatus, ThreadProgress
import uuid

router = APIRouter()
workflow_service = WorkflowService()

@router.post("/run")
async def run_workflow(prompt: str, thread_id: str = None):
    """Run a workflow with real-time streaming updates"""
    if not thread_id:
        thread_id = str(uuid.uuid4())
    
    # Create or get thread
    thread = json_saver.create_thread(thread_id, prompt)
    
    async def generate_events() -> AsyncGenerator[str, None]:
        try:
            # Start workflow execution
            async for event in workflow_service.orchestrate_workflow(prompt, thread_id):
                # Update thread progress in real-time
                if event.get('type') == 'progress' and event.get('progress'):
                    progress = event['progress']
                    json_saver.update_thread_progress(
                        thread_id, 
                        progress.get('completed', 0), 
                        progress.get('total', 0), 
                        progress.get('current_step', 'running')
                    )
                
                # Update thread status
                if event.get('node') == '__end__':
                    json_saver.update_thread_status(thread_id, ThreadStatus.COMPLETED, 'completed')
                elif event.get('type') == 'error':
                    json_saver.update_thread_status(thread_id, ThreadStatus.FAILED, 'error')
                
                # Yield the event as JSON
                yield f"data: {json.dumps(event)}\n\n"
                
        except Exception as e:
            error_event = {
                "type": "error",
                "message": str(e),
                "thread_id": thread_id
            }
            json_saver.update_thread_status(thread_id, ThreadStatus.FAILED, 'error')
            yield f"data: {json.dumps(error_event)}\n\n"
    
    return StreamingResponse(
        generate_events(),
        media_type="text/plain",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"}
    )

@router.get("/threads")
async def get_threads():
    """Get all workflow threads"""
    try:
        threads = json_saver.get_all_threads()
        return {"threads": threads}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/threads/{thread_id}")
async def get_thread(thread_id: str):
    """Get specific thread information"""
    try:
        thread = json_saver.get_thread_info(thread_id)
        if not thread:
            raise HTTPException(status_code=404, detail="Thread not found")
        return thread
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/threads/{thread_id}")
async def delete_thread(thread_id: str):
    """Delete a workflow thread"""
    try:
        success = json_saver.delete_thread(thread_id)
        if not success:
            raise HTTPException(status_code=404, detail="Thread not found")
        return {"message": "Thread deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/threads/{thread_id}/pause")
async def pause_thread(thread_id: str):
    """Pause a running workflow thread"""
    try:
        success = json_saver.update_thread_status(thread_id, ThreadStatus.PAUSED, 'paused')
        if not success:
            raise HTTPException(status_code=404, detail="Thread not found")
        return {"message": "Thread paused successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/threads/{thread_id}/resume")
async def resume_thread(thread_id: str):
    """Resume a paused workflow thread"""
    try:
        success = json_saver.update_thread_status(thread_id, ThreadStatus.RUNNING, 'running')
        if not success:
            raise HTTPException(status_code=404, detail="Thread not found")
        return {"message": "Thread resumed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status")
async def get_status():
    """Get system status"""
    return {"status": "running", "message": "Workflow service is running"}