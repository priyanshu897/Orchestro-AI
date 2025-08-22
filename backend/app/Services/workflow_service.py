import asyncio
from typing import TypedDict, Optional, AsyncGenerator, Dict, Any
from langgraph.graph import StateGraph, END
import re

# Import the modular agent functions
from ..agents.ideation_agent import ideation_agent
from ..agents.image_agent import image_generation_agent
from ..agents.linkedin_agent import linkedin_posting_agent
from ..agents.video_clipping_agent import video_clipping_agent
from ..Schemas.workflow_schema import WorkflowState

# =============================================================================
# 1. Define the Two Workflows as Separate Graphs
# =============================================================================

# -- Workflow 1: Blog Post for LinkedIn (Text & Image)
def create_linkedin_workflow():
    graph_builder = StateGraph(WorkflowState)
    graph_builder.add_node("ideation_agent", ideation_agent)
    graph_builder.add_node("image_agent", image_generation_agent)
    graph_builder.add_node("linkedin_agent", linkedin_posting_agent)
    
    graph_builder.set_entry_point("ideation_agent")
    graph_builder.add_edge("ideation_agent", "image_agent")
    graph_builder.add_edge("image_agent", "linkedin_agent")
    graph_builder.add_edge("linkedin_agent", END)
    
    return graph_builder.compile()

# -- Workflow 2: Video Clipping for YouTube & Instagram
def create_video_clipping_workflow():
    graph_builder = StateGraph(WorkflowState)
    graph_builder.add_node("video_clipping_agent", video_clipping_agent)
    # The posting agent will handle both YouTube Shorts and Instagram Reels
    graph_builder.add_node("video_posting_agent", linkedin_posting_agent) # Reusing this agent for the demo
    
    graph_builder.set_entry_point("video_clipping_agent")
    graph_builder.add_edge("video_clipping_agent", "video_posting_agent")
    graph_builder.add_edge("video_posting_agent", END)
    
    return graph_builder.compile()

# =============================================================================
# 2. Orchestrator Function to Route and Run Workflows
# =============================================================================
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
            "type": "error",
            "node": "orchestrator",
            "output": "No matching workflow found for your request.",
        }
        return

    # Initial state with the user's prompt
    initial_state = WorkflowState(topic=user_prompt, script=None, clips_info=None, posting_status=None, image_data=None)
    print(f"🚀 Starting workflow: {workflow_name}")
    print(f"📝 Initial state: {initial_state}")

    # Stream the events from the compiled workflow_app
    async for event in app_to_run.astream(initial_state):
        node_name = next(iter(event.keys()))
        if node_name not in ["__start__", "__end__"]:
            node_output = event.get(node_name)
            
            # Extract the actual output content from the node
            output_content = None
            if isinstance(node_output, dict) and node_output:
                # Get the first value from the output dictionary
                output_content = next(iter(node_output.values()))
            elif isinstance(node_output, str):
                output_content = node_output
            
            print(f"🤖 Agent {node_name} completed with output: {output_content[:100]}...")
            
            # Yield detailed information about the agent execution
            yield {
                "type": "agent_output",
                "node": node_name,
                "output": output_content,
                "timestamp": asyncio.get_event_loop().time(),
                "workflow": workflow_name
            }
    
    print(f"✅ Workflow {workflow_name} completed successfully!")
    
    # Send completion signal
    yield {
        "type": "workflow_complete",
        "node": "orchestrator",
        "output": f"Workflow '{workflow_name}' completed successfully!",
        "timestamp": asyncio.get_event_loop().time(),
        "workflow": workflow_name
    }