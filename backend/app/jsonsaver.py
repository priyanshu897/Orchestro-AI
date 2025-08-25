import json
import os
from typing import Optional, Dict, Any, List
from datetime import datetime
from .Schemas.workflow_schema import ThreadStatus, ThreadProgress, ThreadInfo

# Define the file paths for our local state storage
STATE_FILE = "workflows.json"
THREADS_FILE = "threads.json"

class JsonSaver:
    """
    Enhanced class to save and load workflow state and thread information to local JSON files.
    
    This acts as a mock checkpoint saver to demonstrate state persistence
    without an external database.
    """

    def __init__(self):
        """Initializes the saver by loading existing state from the files."""
        self.states = self.load_state()
        self.threads = self.load_threads()

    def load_state(self) -> Dict[str, Any]:
        """Loads the workflow states from the local JSON file."""
        if os.path.exists(STATE_FILE) and os.path.getsize(STATE_FILE) > 0:
            with open(STATE_FILE, "r") as f:
                try:
                    return json.load(f)
                except json.JSONDecodeError:
                    print(f"Warning: '{STATE_FILE}' is empty or invalid. Starting with a new state.")
                    return {}
        return {}

    def load_threads(self) -> Dict[str, ThreadInfo]:
        """Loads the thread information from the local JSON file."""
        if os.path.exists(THREADS_FILE) and os.path.getsize(THREADS_FILE) > 0:
            with open(THREADS_FILE, "r") as f:
                try:
                    data = json.load(f)
                    # Convert string dates back to datetime objects
                    for thread_id, thread_info in data.items():
                        if isinstance(thread_info.get('created_at'), str):
                            thread_info['created_at'] = datetime.fromisoformat(thread_info['created_at'])
                        if isinstance(thread_info.get('updated_at'), str):
                            thread_info['updated_at'] = datetime.fromisoformat(thread_info['updated_at'])
                        if isinstance(thread_info.get('progress', {}).get('start_time'), str):
                            thread_info['progress']['start_time'] = datetime.fromisoformat(thread_info['progress']['start_time'])
                        if isinstance(thread_info.get('progress', {}).get('last_updated'), str):
                            thread_info['progress']['last_updated'] = datetime.fromisoformat(thread_info['progress']['last_updated'])
                    return data
                except json.JSONDecodeError:
                    print(f"Warning: '{THREADS_FILE}' is empty or invalid. Starting with new threads.")
                    return {}
        return {}

    def save_state(self) -> None:
        """Saves the current workflow states back to the local JSON file."""
        with open(STATE_FILE, "w") as f:
            json.dump(self.states, f, indent=4, default=str)

    def save_threads(self) -> None:
        """Saves the current thread information back to the local JSON file."""
        with open(THREADS_FILE, "w") as f:
            json.dump(self.threads, f, indent=4, default=str)

    def get_by_thread_id(self, thread_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves a specific workflow state by its thread ID."""
        return self.states.get(thread_id)

    def put_by_thread_id(self, thread_id: str, state: Dict[str, Any]) -> None:
        """Saves a new or updated workflow state for a given thread ID."""
        self.states[thread_id] = state
        self.save_state()
        print(f"Workflow state saved for thread ID: {thread_id}")

    def create_thread(self, thread_id: str, name: str, workflow_type: str) -> ThreadInfo:
        """Creates a new thread with initial progress tracking."""
        now = datetime.now()
        thread_info: ThreadInfo = {
            "thread_id": thread_id,
            "name": name,
            "status": ThreadStatus.PENDING,
            "workflow_type": workflow_type,
            "progress": {
                "thread_id": thread_id,
                "status": ThreadStatus.PENDING,
                "current_step": "initializing",
                "total_steps": 0,
                "completed_steps": 0,
                "start_time": now,
                "last_updated": now,
                "error_message": None
            },
            "created_at": now,
            "updated_at": now
        }
        
        self.threads[thread_id] = thread_info
        self.save_threads()
        print(f"New thread created: {thread_id}")
        return thread_info

    def update_thread_status(self, thread_id: str, status: ThreadStatus, current_step: str = None, error_message: str = None) -> None:
        """Updates the status and progress of a thread."""
        if thread_id in self.threads:
            thread = self.threads[thread_id]
            thread["status"] = status
            thread["updated_at"] = datetime.now()
            
            if current_step:
                thread["progress"]["current_step"] = current_step
            
            if error_message:
                thread["progress"]["error_message"] = error_message
            
            thread["progress"]["status"] = status
            thread["progress"]["last_updated"] = datetime.now()
            
            self.save_threads()
            print(f"Thread {thread_id} status updated to: {status}")

    def update_thread_progress(self, thread_id: str, completed_steps: int, total_steps: int, current_step: str) -> None:
        """Updates the progress of a thread."""
        if thread_id in self.threads:
            thread = self.threads[thread_id]
            thread["progress"]["completed_steps"] = completed_steps
            thread["progress"]["total_steps"] = total_steps
            thread["progress"]["current_step"] = current_step
            thread["progress"]["last_updated"] = datetime.now()
            thread["updated_at"] = datetime.now()
            
            self.save_threads()

    def get_all_threads(self) -> List[ThreadInfo]:
        """Retrieves all threads."""
        return list(self.threads.values())

    def get_thread_info(self, thread_id: str) -> Optional[ThreadInfo]:
        """Retrieves thread information by ID."""
        return self.threads.get(thread_id)

    def delete_thread(self, thread_id: str) -> bool:
        """Deletes a thread and its associated state."""
        if thread_id in self.threads:
            del self.threads[thread_id]
            if thread_id in self.states:
                del self.states[thread_id]
            self.save_threads()
            self.save_state()
            print(f"Thread {thread_id} deleted")
            return True
        return False

# Instantiate the saver. This object will be imported by other services.
json_saver = JsonSaver()