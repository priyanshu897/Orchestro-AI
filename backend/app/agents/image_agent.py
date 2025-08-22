import base64
import re
from typing import Dict, Any
from ..Schemas.workflow_schema import WorkflowState
from ..Services.llm_service import generate_text

async def image_generation_agent(state: WorkflowState) -> Dict[str, Any]:
    """
    The Image Generation Agent generates a prompt and a mock image URL.

    Args:
        state: The current state of the workflow, containing a script.

    Returns:
        A dictionary with the new `image_data` to update the state.
    """
    script = state["script"]
    if not script:
        return {"image_data": "## Error in Image Generation Agent\n\n**Error:** No script provided for image generation."}

    try:
        print("Running Image Generation Agent...")

        # 1. Use the LLM to generate a descriptive image prompt
        image_prompt_text = await generate_text(f"Create a short, descriptive prompt for an AI image generator based on this script: {script}")

        # 2. Use the generated prompt to create a mock image URL
        # We clean the prompt and use it in the URL to make the image dynamic.
        clean_prompt = re.sub(r'[^a-zA-Z0-9\s]', '', image_prompt_text)
        mock_image_url = f"https://placehold.co/600x400/2d2d2d/ffffff?text=Image+for+'{clean_prompt[:20]}...'"
        
        # Format the output for better UI display
        formatted_output = f"## Image Generation Complete\n\n**Generated Image Prompt:**\n{image_prompt_text}\n\n**Mock Image URL:**\n{mock_image_url}\n\n*Note: This is a placeholder image. In production, this would generate an actual AI image.*"
        
        print({"image_data": formatted_output})
        return {"image_data": formatted_output}

    except Exception as e:
        print(f"Error during image generation: {e}")
        error_message = f"## Error in Image Generation Agent\n\n**Error:** {str(e)}\n\nPlease try again or check the previous step."
        return {"image_data": error_message}