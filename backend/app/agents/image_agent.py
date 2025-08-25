import base64
import aiohttp
import json
from typing import Dict, Any
import google.generativeai as genai
from tenacity import retry, stop_after_attempt, wait_exponential
from ..Schemas.workflow_schema import WorkflowState
from ..config import GOOGLE_API_KEY
import asyncio

# Configure the API key globally
genai.configure(api_key=GOOGLE_API_KEY)

# Initialize model with custom configuration
try:
    generation_config = {
        "temperature": 0.7,
        "top_p": 0.95,
    }
    gemini_text_model = genai.GenerativeModel(
        "gemini-1.5-flash",
        generation_config=generation_config
    )
except Exception as e:
    raise ValueError(f"Failed to initialize Gemini Text Model: {e}")

IMAGE_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key={GOOGLE_API_KEY}"
HEADERS = {'Content-Type': 'application/json'}

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
async def generate_image_prompt(script: str) -> str:
    """Generate an image prompt with enhanced instructions."""
    prompt_template = """
    Create a detailed, visually-rich prompt for an AI image generator based on this script:
    {script}
    
    Requirements:
    - Maximum 25 words
    - Include visual details (colors, lighting, composition)
    - Specify artistic style if relevant
    - Safe for work content only
    - Focus on key visual elements
    
    Prompt:
    """
    
    response = await gemini_text_model.generate_content_async(
        prompt_template.format(script=script)
    )
    return response.text.strip()

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
async def call_image_api(payload: dict) -> Dict[str, Any]:
    """Call image generation API with retry logic."""
    timeout = aiohttp.ClientTimeout(total=120)
    
    # Increase the delay to give the API more time to process requests
    await asyncio.sleep(5) 
    
    async with aiohttp.ClientSession(timeout=timeout) as session:
        async with session.post(
            IMAGE_API_URL,
            headers=HEADERS,
            data=json.dumps(payload)
        ) as response:
            response.raise_for_status()
            return await response.json()

async def image_generation_agent(state: WorkflowState) -> Dict[str, Any]:
    """
    Enhanced image generation agent with better prompt engineering and error handling.
    """
    script = state.get("script")
    
    if not script or not script.strip():
        return {"image_data": "Error: No valid script provided for image generation."}

    try:
        print("Running Enhanced Image Generation Agent...")

        # Generate enhanced prompt
        image_prompt = await generate_image_prompt(script)
        print(f"Generated prompt: {image_prompt}")

        # Prepare payload with enhanced configuration
        image_payload = {
            "contents": [{"parts": [{"text": image_prompt}]}],
            "generationConfig": {
                "responseModalities": ["IMAGE"],
                "responseMimeType": "image/png",
                "aspectRatio": "16:9"
            }
        }

        # Call API
        result = await call_image_api(image_payload)

        # Process response
        if "error" in result:
            error_message = result["error"]["message"]
            print(f"API returned error: {error_message}")
            return {"image_data": f"Error: {error_message}"}
        
        base64_data = result['candidates'][0]['content']['parts'][0]['inlineData']['data']
        image_data_url = f"data:image/png;base64,{base64_data}"
        
        return {"image_data": image_data_url}

    except aiohttp.ClientError as e:
        print(f"Network error: {e}")
        return {"image_data": f"Error: Network failure - {e}"}
    except asyncio.TimeoutError:
        print("Image generation timeout")
        return {"image_data": "Error: Operation timed out"}
    except KeyError as e:
        print(f"Response parsing error: {e}")
        return {"image_data": "Error: Invalid response format from API"}
    except Exception as e:
        print(f"Unexpected error: {e}")
        return {"image_data": f"Error: {e}"}