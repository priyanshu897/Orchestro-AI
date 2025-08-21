import asyncio
from typing import Dict, Any
from ..Services.llm_service import generate_text
from ..Schemas.workflow_schema import WorkflowState # ✅ Corrected import path

async def posting_agent(state: WorkflowState) -> Dict[str, Any]:
    """
    The Cross-Platform Posting Agent generates platform-specific content and simulates posting.

    In a real-world scenario, this agent would:
    - Take the clip metadata from the previous agent.
    - Use the LLM to generate platform-specific captions and hashtags.
    - Interact with social media scheduling APIs (e.g., Hootsuite, Buffer) or
      direct platform APIs to schedule and post the content.

    For this prototype, we'll simulate these steps and return a success message.

    Args:
        state: The current state of the workflow, containing the topic and clip info.

    Returns:
        A dictionary with the new `posting_status` to update the state.
    """
    # Check if the previous agent successfully completed its task
    clips_info = state.get("clips_info")
    topic = state.get("topic")

    if not clips_info or not topic:
        # If prerequisites aren't met, return an error and halt the workflow
        return {"posting_status": "Error: Missing video clips or topic. Cannot proceed with posting."}

    # Simulate the work of generating captions and scheduling posts
    print("Running Cross-Platform Posting Agent...")
    await asyncio.sleep(4)  # Simulate a posting/scheduling task

    # Use the LLM to generate platform-specific content
    posting_prompt = (
        f"You are a cross-platform posting agent. Take the following video topic '{topic}' "
        f"and create three optimized social media captions and relevant hashtags for "
        f"1. Instagram Reels, 2. YouTube Shorts, and 3. a Blog Post. "
        f"Ensure each caption is unique and tailored to the platform's style."
    )
    posting_output = await generate_text(posting_prompt)
    
    # Return a success message with the generated content
    return {
        "posting_status": (
            f"Content successfully posted to all platforms. "
            f"Here are the generated captions and hashtags:\n\n{posting_output}"
        )
    }