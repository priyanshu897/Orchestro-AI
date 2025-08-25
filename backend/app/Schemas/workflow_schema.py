from typing import TypedDict, Optional, List, Dict, Any
from enum import Enum
from datetime import datetime

class ThreadStatus(str, Enum):
    """Thread status enumeration"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    PAUSED = "paused"

class ThreadProgress(TypedDict):
    """Represents the progress of a workflow thread"""
    thread_id: str
    status: ThreadStatus
    current_step: str
    total_steps: int
    completed_steps: int
    start_time: datetime
    last_updated: datetime
    error_message: Optional[str]

class WorkflowState(TypedDict):
    """
    Represents the state of our content creation workflow.
    
    Each key holds a piece of information that agents can use.
    """
    topic: str
    script: Optional[str]
    clips_info: Optional[str]
    posting_status: Optional[str]
    image_data: Optional[str]
    thread_id: str
    status: ThreadStatus
    progress: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

class ThreadInfo(TypedDict):
    """Information about a workflow thread"""
    thread_id: str
    name: str
    status: ThreadStatus
    workflow_type: str
    progress: ThreadProgress
    created_at: datetime
    updated_at: datetime