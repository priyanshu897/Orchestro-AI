import base64
import aiohttp
import json
from typing import Dict, Any
import google.generativeai as genai
from ..Schemas.workflow_schema import WorkflowState
from ..config import GOOGLE_API_KEY
import asyncio
from PIL import Image
import io

# Configure the API key globally, which is the correct method for this library
genai.configure(api_key=GOOGLE_API_KEY)

# Initialize the Gemini model that supports image generation
# We will use gemini-1.5-flash which has multimodal capabilities
try:
    gemini_model = genai.GenerativeModel("gemini-1.5-flash")
except Exception as e:
    raise ValueError(f"Failed to initialize Gemini Model: {e}. Please check your GOOGLE_API_KEY.")

async def image_generation_agent(state: WorkflowState) -> Dict[str, Any]:
    """
    The Image Generation Agent generates an image using a multimodal model
    and returns a mock image URL.

    Args:
        state: The current state of the workflow, containing a prompt.

    Returns:
        A dictionary with the new `image_data` to update the state.
    """
    script = state.get("script")
    if not script:
        return {"image_data": "Error: No script provided for image generation."}

    # Use a text-based model to create a descriptive prompt for an image API
    try:
        print("Running Image Generation Agent...")

        # For this prototype, we'll use a placeholder image service.
        mock_image_url = f"https://placehold.co/600x400/2d2d2d/ffffff?text=Image+Generated"
        
        return {"image_data": mock_image_url}

    except Exception as e:
        print(f"Error during image generation: {e}")
        return {"image_data": "Error: Failed to generate image."}