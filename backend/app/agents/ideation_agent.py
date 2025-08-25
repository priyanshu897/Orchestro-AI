from ..Services.llm_service import generate_text
from ..Schemas.workflow_schema import WorkflowState
from typing import Dict, Any
from langchain_core.messages import HumanMessage, SystemMessage

async def ideation_agent(state: WorkflowState) -> Dict[str, Any]:
    """
    The Ideation Agent generates a video concept and script outline using the LLM.

    Args:
        state: The current state of the workflow, containing the topic.

    Returns:
        A dictionary with the new script to update the state.
    """
    topic = state.get("topic")
    if not topic:
        return {"script": "Error: No topic provided for ideation."}

    # Define a detailed prompt for the LLM to act as a creative agent.
    # We use a list of messages to handle persona better with conversational models.
    prompt_messages = [
        SystemMessage(content="You are a creative ideation agent for a content creator. Your task is to generate a concise video concept and a brief script outline. The script outline should include key talking points and a call-to-action. Format the output with clear headings."),
        HumanMessage(content=f"Generate a video idea and script outline for the following topic: '{topic}'.")
    ]

    try:
        # Call the core LLM service to get the real response.
        response = await generate_text(prompt_messages)
        
        # Return the generated script, which LangGraph will use to update the state.
        return {"script": response}
    except Exception as e:
        return {"script": f"Error during ideation: {e}"}