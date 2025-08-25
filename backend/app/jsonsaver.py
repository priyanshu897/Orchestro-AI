import json
import os
from typing import Optional, Dict, Any

# Define the file path for our local state storage
STATE_FILE = "workflows.json"

class JsonSaver:
    """
    A simple class to save and load workflow state to a local JSON file.
    
    This acts as a mock checkpoint saver to demonstrate state persistence
    without an external database.
    """

    def __init__(self):
        """Initializes the saver by loading existing state from the file."""
        self.states = self.load_state()

    def load_state(self) -> Dict[str, Any]:
        """Loads the state from the local JSON file."""
        if os.path.exists(STATE_FILE) and os.path.getsize(STATE_FILE) > 0:
            with open(STATE_FILE, "r") as f:
                try:
                    return json.load(f)
                except json.JSONDecodeError:
                    print(f"Warning: '{STATE_FILE}' is empty or invalid. Starting with a new state.")
                    return {}
        return {}

    def save_state(self) -> None:
        """Saves the current state back to the local JSON file."""
        with open(STATE_FILE, "w") as f:
            json.dump(self.states, f, indent=4)

    def get_by_thread_id(self, thread_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves a specific workflow state by its thread ID."""
        return self.states.get(thread_id)

    def put_by_thread_id(self, thread_id: str, state: Dict[str, Any]) -> None:
        """Saves a new or updated workflow state for a given thread ID."""
        self.states[thread_id] = state
        self.save_state()
        print(f"Workflow state saved for thread ID: {thread_id}")

# Instantiate the saver. This object will be imported by other services.
json_saver = JsonSaver()