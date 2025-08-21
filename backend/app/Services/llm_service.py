# Updated imports at the top
from langchain_huggingface import HuggingFaceEndpoint,ChatHuggingFace
from ..config import HF_TOKEN  # ✅ Corrected: Import HuggingFace token
from langchain_core.exceptions import OutputParserException
from langchain_core.messages import HumanMessage, SystemMessage
try:
    llm=HuggingFaceEndpoint(
        repo_id="openai/gpt-oss-120b",
        task="conversational",
        huggingfacehub_api_token=HF_TOKEN # ✅ Corrected: Use the HuggingFace token
    )
except Exception as e:
    # Raise a more informative error if initialization fails
    raise ValueError(f"Failed to initialize GoogleGenerativeAI: {e}. Please check your GOOGLE_API_KEY.")
# You can remove the unused variable.
model=ChatHuggingFace(llm=llm) # This line is no longer needed.

async def generate_text(prompt: str) -> str:
    """
    Asynchronously generates text from the LLM based on a given prompt.

    Args:
        prompt: The text prompt for the LLM.

    Returns:
        The generated text response from the LLM.
    """
    try:
        # Using ainvoke for asynchronous calls
        response = await model.ainvoke([HumanMessage(content=prompt)])
        return response.content
    except OutputParserException as e:
        # Handle cases where the LLM's output can't be parsed
        print(f"Output parsing error: {e}")
        return "An error occurred while parsing the LLM's response."
    except Exception as e:
        # Catch any other potential errors during the API call
        print(f"Error during LLM invocation: {e}")
        return "An error occurred while communicating with the LLM."
# import asyncio
# from typing import TypedDict, Optional, AsyncGenerator

# from langgraph.graph import StateGraph, END, START
# from langchain_core.messages import BaseMessage, HumanMessage

# # =============================================================================
# # 1. Define the Graph State
# # This state is a shared object that agents can read from and write to.
# # =============================================================================
# class WorkflowState(TypedDict):
#     """
#     Represents the state of our content creation workflow.
    
#     Each key holds a piece of information that agents can use.
#     """
#     topic: str
#     script: Optional[str]
#     clips_info: Optional[str]
#     posting_status: Optional[str]

# ''# =============================================================================
# # 4. Orchestrator Function
# # This function will be called by your API to run the graph and stream results.
# # =============================================================================
# async def orchestrate_workflow(user_prompt: str) -> AsyncGenerator[dict, None]:
#     """
#     Runs the defined LangGraph workflow and yields updates.
#     """
#     # Initial state with the user's prompt
#     initial_state = {"topic": user_prompt, "script": None, "clips_info": None, "posting_status": None}

#     # Stream the events from the compiled workflow_app
#     async for event in workflow_app.astream(initial_state):
#         # LangGraph provides events for each node and step
#         # You can inspect the event to see what's happening
#         # For our purpose, we'll yield the final state of each node
#         # after it completes.
#         yield event
