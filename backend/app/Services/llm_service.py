from langchain_google_genai import ChatGoogleGenerativeAI
from ..config import GOOGLE_API_KEY
from langchain_core.messages import HumanMessage, SystemMessage
from typing import List, Union

# Initialize a stable Google Gemini model
try:
    chat_model = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=GOOGLE_API_KEY)
except Exception as e:
    raise ValueError(f"Failed to initialize ChatGoogleGenerativeAI: {e}. Please check your GOOGLE_API_KEY.")

async def generate_text(prompt: Union[str, List[Union[HumanMessage, SystemMessage]]]) -> str:
    """
    Asynchronously generates text from the Google Gemini model.

    Args:
        prompt: The text prompt or a list of messages for the LLM.

    Returns:
        The generated text response from the LLM.
    """
    try:
        if isinstance(prompt, str):
            messages = [HumanMessage(content=prompt)]
        else:
            messages = prompt
            
        response = await chat_model.ainvoke(messages)
        print(response.content)
        return response.content
        
    except Exception as e:
        print(f"Error during LLM invocation: {e}")
        return "An error occurred while communicating with the LLM."