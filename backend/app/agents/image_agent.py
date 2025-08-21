import base64
from typing import Dict, Any
from google.generativeai import GenerativeModel
from ..Schemas.workflow_schema import WorkflowState
from ..config import GOOGLE_API_KEY
from PIL import Image
import io

# Initialize the Gemini Vision model for image generation
try:
    gemini_vision_model = GenerativeModel("imagen-3.0-generate-002", api_key=GOOGLE_API_KEY)
except Exception as e:
    raise ValueError(f"Failed to initialize Gemini Vision Model: {e}. Please check your GOOGLE_API_KEY.")

async def generate_image(state: WorkflowState) -> Dict[str, Any]:
    """
    The Image Generation Agent generates a base64-encoded image based on a prompt.

    Args:
        state: The current state of the workflow, containing a prompt.

    Returns:
        A dictionary with the new `image_data` to update the state.
    """
    prompt = state.get("topic")
    if not prompt:
        return {"image_data": "Error: No prompt provided for image generation."}

    try:
        print("Running Image Generation Agent...")
        # Generate the image from the prompt
        response = gemini_vision_model.generate_content(prompt)
        
        # Access the raw image data from the response
        pil_image = response.images[0]

        # Convert the PIL image to a base64 string
        buffered = io.BytesIO()
        pil_image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        
        # Return the base64-encoded image data
        return {"image_data": f"data:image/png;base64,{img_str}"}

    except Exception as e:
        print(f"Error during image generation: {e}")
        return {"image_data": "Error: Failed to generate image."}