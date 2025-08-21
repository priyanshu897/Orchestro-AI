import asyncio
from typing import TypedDict, Optional, AsyncGenerator, Dict, Any
from langgraph.graph import StateGraph, END, START
from ..agents.ideation_agent import generate_idea_and_script
from ..agents.image_agent import generate_image
from ..agents.linkedin_agent import linkedin_posting_agent
from ..agents.video_clipping_agent import video_clipping_agent
from ..Schemas.workflow_schema import WorkflowState
import re

# =============================================================================
# 1. Define the Two Workflows as Separate Graphs
# =============================================================================

# -- Workflow 1: Blog Post for LinkedIn (Text & Image)
def create_linkedin_workflow():
    graph_builder = StateGraph(WorkflowState)
    graph_builder.add_node("ideation", generate_idea_and_script)
    graph_builder.add_node("image_generation", generate_image)
    graph_builder.add_node("linkedin_posting", linkedin_posting_agent)
    
    graph_builder.add_edge(START, "ideation")
    graph_builder.add_edge("ideation", "image_generation")
    graph_builder.add_edge("image_generation", "linkedin_posting")
    graph_builder.add_edge("linkedin_posting", END)
    
    return graph_builder.compile()

# -- Workflow 2: Video Clipping for YouTube & Instagram
def create_video_clipping_workflow():
    graph_builder = StateGraph(WorkflowState)
    graph_builder.add_node("video_clipping", video_clipping_agent)
    # The posting agent will handle both YouTube Shorts and Instagram Reels
    graph_builder.add_node("video_posting", linkedin_posting_agent) # Reusing this agent for the demo
    
    graph_builder.add_edge(START, "video_clipping")
    graph_builder.add_edge("video_clipping", "video_posting")
    graph_builder.add_edge("video_posting", END)
    
    return graph_builder.compile()

# =============================================================================
# 2. Orchestrator Function to Route and Run Workflows
# =============================================================================
# Cache the compiled graphs
linkedin_app = create_linkedin_workflow()
video_clipping_app = create_video_clipping_workflow()

def get_workflow_app(prompt: str):
    """Dynamically selects a workflow based on the prompt."""
    if re.search(r"blog|linkedin|post|image", prompt, re.IGNORECASE):
        return "linkedin_blog", linkedin_app
    if re.search(r"video|clip|youtube|instagram|shorts", prompt, re.IGNORECASE):
        return "video_clipping", video_clipping_app
    
    return None, None

async def orchestrate_workflow(user_prompt: str) -> AsyncGenerator[Dict[str, Any], None]:
    """
    Selects and runs the appropriate LangGraph workflow based on the user's prompt.
    """
    workflow_name, app_to_run = get_workflow_app(user_prompt)

    if not app_to_run:
        yield {
            "node": "orchestrator",
            "status": "error",
            "output": {"orchestrator": "No matching workflow found for your request."},
        }
        return

    # Initial state with the user's prompt
    initial_state = WorkflowState(topic=user_prompt, script=None, clips_info=None, posting_status=None)

    # Stream the events from the compiled workflow_app
    async for event in app_to_run.astream(initial_state):
        for node_name, node_output in event.items():
            if node_name != "__end__":
                yield {
                    "node": node_name,
                    "status": "complete",
                    "output": {node_name: node_output},
                }