from typing import TypedDict, Optional

class WorkflowState(TypedDict):
    """
    Represents the state of our content creation workflow.
    
    Each key holds a piece of information that agents can use.
    """
    topic: str
    script: Optional[str]
    clips_info: Optional[str]
    posting_status: Optional[str]