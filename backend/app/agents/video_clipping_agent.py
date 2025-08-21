import asyncio
from typing import Dict, Any
from ..Schemas.workflow_schema import WorkflowState
from ..Services.llm_service import generate_text

async def video_clipping_agent(state: WorkflowState) -> Dict[str, Any]:
    """
    The Video Clipping Agent generates descriptions for clipped video segments.

    This agent simulates the process of clipping a video into multiple segments
    for platforms like YouTube Shorts and Instagram Reels. It uses the LLM to
    generate conceptual descriptions for these clips, which a real video
    processing service would use to create the final output.

    Args:
        state: The current state of the workflow. For this workflow, it's initiated by the user.

    Returns:
        A dictionary with the new `clips_info` to update the state.
    """
    topic = state.get("topic")
    if not topic:
        return {"clips_info": "Error: No topic provided for video clipping."}

    print("Running Video Clipping Agent...")
    await asyncio.sleep(5)  # Simulate a longer task for video processing

    # Use the LLM to generate descriptions for the clips
    clip_prompt = (
        f"You are a video clipping specialist. Based on the topic '{topic}', "
        f"generate a description for two short video clips. One is for YouTube Shorts "
        f"and the other is for Instagram Reels. Each description should be tailored to "
        f"the platform and should be concise and engaging."
    )
    
    clips_descriptions = await generate_text(clip_prompt)

    # Return the generated descriptions, which will be passed to the next agent
    output_message = (
        f"Simulated clipping complete. Two video clips have been prepared based on the topic. "
        f"Here are the generated descriptions:\n\n{clips_descriptions}"
    )

    return {"clips_info": output_message}