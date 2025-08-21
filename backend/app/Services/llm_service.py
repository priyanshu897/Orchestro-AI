from langchain_huggingface import HuggingFaceEndpoint,ChatHuggingFace
from ..config import HF_TOKEN
from langchain_core.messages import HumanMessage
from langchain_core.exceptions import OutputParserException
from typing import List, Union

# Initialize a free, conversational Hugging Face model
# A stable, free option for text generation is often a fine-tuned LLama or Mistral model.
# Note: You will need to make sure this model is accessible through the free tier of the Hugging Face Inference API.
try:
    llm_endpoint = HuggingFaceEndpoint(
        repo_id="openai/gpt-oss-120b",
        task="text-generation",        # use text-generation task
        provider="auto",               # or explicitly "hf-inference"
        huggingfacehub_api_token=HF_TOKEN,
        max_new_tokens=512,
    )
    chat_model = ChatHuggingFace(llm=llm_endpoint)
except Exception as e:
    raise ValueError(f"Failed to initialize HuggingFaceEndpoint: {e}. Please check your HF_TOKEN.")

async def generate_text(prompt: Union[str, List[HumanMessage]]) -> str:
    """
    Asynchronously generates text from the Hugging Face model.

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
        # The response from Hugging Face models often needs trimming
        return response.content.strip()
        
    except OutputParserException as e:
        print(f"Output parsing error: {e}")
        return "An error occurred while parsing the LLM's response."
    except Exception as e:
        print(f"Error during LLM invocation: {e}")
        return "An error occurred while communicating with the LLM."