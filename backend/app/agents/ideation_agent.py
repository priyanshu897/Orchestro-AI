# from langchain.prompts import PromptTemplate
# from langchain_core.output_parsers import StrOutputParser
# from langchain_core.runnables import LambdaRunnable # ✅ New import for LambdaRunnable
# from ..Services.llm_service import generate_text # ✅ Importing the generate_text function

# async def generate_idea_and_script(topic: str) -> str:
#     """
#     Generates a video concept and script outline using the LLM.

#     Args:
#         topic: The central topic for the video content.

#     Returns:
#         A string containing the generated video concept and script outline.
#     """
#     # Define a detailed prompt for the LLM to act as a creative agent
#     prompt_template = PromptTemplate(
#         template="You are a creative ideation agent for a content creator. Your task is to generate a concise "
#                  "video concept and a brief script outline for a video about the following topic: '{topic}'. "
#                  "The script outline should include key talking points and a call-to-action. "
#                  "Format the output with clear headings, such as 'Video Concept' and 'Script Outline'.",
#         input_variables=["topic"]
#     )
    
#     # Create a LambdaRunnable to wrap the generate_text function
#     # This allows it to be part of the LCEL chain.
#     runnable_llm = LambdaRunnable(generate_text) # ✅ Wrapping the function in a runnable

#     # Create an LCEL chain to invoke the LLM and parse the output
#     # The chain connects the template, the runnable LLM function, and the output parser.
#     chain = prompt_template | runnable_llm | StrOutputParser()

#     # Invoke the chain with the topic to get the final, parsed string response
#     response = await chain.ainvoke({"topic": topic})
    
#     return response

from ..Services.llm_service import generate_text
from ..Schemas.workflow_schema import WorkflowState # ✅ Corrected import path
from typing import Dict, Any

async def ideation_agent(state: WorkflowState) -> Dict[str, Any]:
    """
    The Ideation Agent generates a video concept and script outline.

    Args:
        state: The current state of the workflow, containing the topic.

    Returns:
        A dictionary with the new script to update the state.
    """
    topic = state.get("topic")
    if not topic:
        # If no topic is present, return an error message
        return {"script": "Error: No topic provided for ideation."}

    # Define a detailed prompt for the LLM to act as a creative agent
    prompt = (
        f"You are a creative ideation agent for a content creator. "
        f"Your task is to generate a concise video concept and a brief script "
        f"outline for a video about the following topic: '{topic}'. "
        f"The script outline should include key talking points and a call-to-action. "
        f"Format the output with clear headings, such as 'Video Concept' and 'Script Outline'."
    )
    
    # Call the core LLM service to get the response
    response = await generate_text(prompt)
    
    # Return the generated script, which LangGraph will use to update the state
    return {"script": response}