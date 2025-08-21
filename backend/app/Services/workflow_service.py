import asyncio
from typing import AsyncGenerator, Dict, Any
from langgraph.graph import StateGraph, END, START
from ..agents.ideation_agent import ideation_agent
from ..agents.image_agent import image_generation_agent
from ..agents.linkedin_agent import linkedin_posting_agent
from ..agents.video_clipping_agent import video_clipping_agent
from ..Schemas.workflow_schema import WorkflowState
import re

# =============================================================================
# 1. Workflow definitions (create fresh graphs per request)
# =============================================================================

def build_linkedin_workflow():
    graph_builder = StateGraph(WorkflowState)
    graph_builder.add_node("ideation", ideation_agent)
    graph_builder.add_node("image_generation", image_generation_agent)
    graph_builder.add_node("linkedin_posting", linkedin_posting_agent)
    
    graph_builder.add_edge(START, "ideation")
    graph_builder.add_edge("ideation", "image_generation")
    graph_builder.add_edge("image_generation", "linkedin_posting")
    graph_builder.add_edge("linkedin_posting", END)
    
    return graph_builder

def build_video_clipping_workflow():
    graph_builder = StateGraph(WorkflowState)
    graph_builder.add_node("video_clipping", video_clipping_agent)
    graph_builder.add_node("video_posting", linkedin_posting_agent)  # Reusing for demo
    
    graph_builder.add_edge(START, "video_clipping")
    graph_builder.add_edge("video_clipping", "video_posting")
    graph_builder.add_edge("video_posting", END)
    
    return graph_builder

# =============================================================================
# 2. Workflow selector
# =============================================================================

def get_workflow_builder(prompt: str):
    """Select workflow builder based on user prompt."""
    if re.search(r"blog|linkedin|post|image", prompt, re.IGNORECASE):
        return build_linkedin_workflow
    if re.search(r"video|clip|youtube|instagram|shorts", prompt, re.IGNORECASE):
        return build_video_clipping_workflow
    return None

# =============================================================================
# 3. Orchestrator function
# =============================================================================

async def orchestrate_workflow(user_prompt: str) -> AsyncGenerator[Dict[str, Any], None]:
    """
    Orchestrates and streams workflow execution based on the user's prompt.
    Each run uses a fresh compiled workflow to avoid checkpoint issues.
    """
    workflow_builder = get_workflow_builder(user_prompt)
    
    if not workflow_builder:
        yield {
            "node": "orchestrator",
            "status": "error",
            "output": {"orchestrator": "No matching workflow found for your request."},
        }
        return
    
    # Compile a fresh workflow for this request
    app_to_run = workflow_builder().compile()
    
    # Initialize state
    initial_state = WorkflowState(
        topic=user_prompt,
        script=None,
        clips_info=None,
        posting_status=None
    )
    
    # Stream events
    async for event in app_to_run.astream(initial_state):
        for node_name, node_output in event.items():
            if node_name == "__start__":
                continue  # skip the start node event
            yield {
                "node": node_name,
                "status": "complete",
                "output": node_output,
            }
