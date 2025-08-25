# Workflow Thread Management System

## Overview

The Orchestro AI system now includes a comprehensive workflow thread management system that allows users to:

- **Create multiple workflow threads** that can run concurrently
- **Track progress** of each workflow in real-time
- **Pause, resume, and delete** threads as needed
- **View detailed status** and progress information for each thread
- **Persist thread states** across application restarts

## Features

### 🧵 Thread Management
- **Concurrent Execution**: Multiple workflow threads can run simultaneously without interference
- **Thread Persistence**: All thread states are automatically saved and restored
- **Unique Identification**: Each thread has a unique ID for tracking and management

### 📊 Progress Tracking
- **Real-time Updates**: Progress is updated in real-time as workflows execute
- **Step-by-step Progress**: Shows completed steps vs. total steps
- **Current Step Display**: Indicates which step is currently executing
- **Progress Bars**: Visual representation of workflow completion

### 🎛️ Thread Control
- **Pause/Resume**: Pause running threads and resume them later
- **Delete Threads**: Remove completed or unwanted threads
- **Status Management**: Automatic status updates (pending, running, completed, failed, paused)

### 🔄 State Persistence
- **Automatic Saving**: Thread states are automatically saved after each step
- **JSON Storage**: Uses local JSON files for persistence (can be easily replaced with database)
- **Restore Capability**: Threads can be restored to their exact state after restarts

## Architecture

### Backend Components

#### 1. Enhanced Schemas (`workflow_schema.py`)
```python
class ThreadStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    PAUSED = "paused"

class ThreadProgress(TypedDict):
    thread_id: str
    status: ThreadStatus
    current_step: str
    total_steps: int
    completed_steps: int
    start_time: datetime
    last_updated: datetime
    error_message: Optional[str]
```

#### 2. Enhanced JSON Saver (`jsonsaver.py`)
- Thread creation and management
- Progress tracking and updates
- State persistence and restoration
- Thread listing and information retrieval

#### 3. Enhanced Workflow Service (`workflow_service.py`)
- Automatic thread creation
- Progress tracking during execution
- Error handling and status updates
- Step-by-step progress reporting

#### 4. New API Endpoints (`workflow.py`)
```python
GET /api/threads              # List all threads
GET /api/threads/{thread_id}  # Get thread details
DELETE /api/threads/{thread_id} # Delete thread
POST /api/threads/{thread_id}/pause  # Pause thread
POST /api/threads/{thread_id}/resume # Resume thread
```

### Frontend Components

#### 1. Enhanced WorkflowProvider (`WorkflowProvider.tsx`)
- Thread state management
- Backend synchronization
- Progress tracking
- Thread operations (add, update, delete)

#### 2. Enhanced WorkflowsLayout (`WorkflowsLayout.tsx`)
- Thread sidebar with detailed information
- Progress bars and status indicators
- Thread control buttons (pause, resume, delete)
- Real-time updates

#### 3. Enhanced WorkflowPage (`WorkflowPage.tsx`)
- Detailed thread status display
- Progress visualization
- Step-by-step workflow display
- Thread information panel

## Usage Examples

### Starting a New Workflow

```typescript
// From HomePage.tsx
const handleStartWorkflow = (prompt: string, workflowType?: string) => {
  if (prompt.trim()) {
    const threadId = uuidv4();
    const detectedType = workflowType || detectWorkflowType(prompt);
    addThread(threadId, `Workflow - ${prompt.substring(0, 30)}...`, detectedType);
    navigate(`/workflows/${threadId}`, { state: { prompt } });
  }
};
```

### Managing Threads

```typescript
// Pause a running thread
const handlePauseThread = async (threadId: string) => {
  try {
    await pauseThread(threadId);
    await refreshThreads();
  } catch (error) {
    console.error('Failed to pause thread:', error);
  }
};

// Delete a thread
const handleDeleteThread = async (threadId: string) => {
  if (confirm('Are you sure you want to delete this workflow thread?')) {
    try {
      await deleteThread(threadId);
      removeThread(threadId);
    } catch (error) {
      console.error('Failed to delete thread:', error);
    }
  }
};
```

### Progress Tracking

```typescript
// Update thread progress
const updateThread = useCallback((threadId: string, newEvent: any) => {
  setThreads(prev => {
    const thread = prev[threadId];
    if (!thread) return prev;
    
    let updatedProgress = thread.progress;
    if (newEvent.progress) {
      updatedProgress = {
        completed: newEvent.progress.completed || 0,
        total: newEvent.progress.total || 0,
        currentStep: newEvent.progress.current_step || 'running'
      };
    }
    
    return {
      ...prev,
      [threadId]: {
        ...thread,
        progress: updatedProgress
      }
    };
  });
}, []);
```

## Data Flow

### 1. Thread Creation
```
User Input → HomePage → WorkflowProvider.addThread() → Backend API → JSON Storage
```

### 2. Workflow Execution
```
Workflow Start → WorkflowService → Agent Execution → Progress Updates → JSON Storage → Frontend Update
```

### 3. State Persistence
```
Each Step → Update Thread State → Save to JSON → Restore on Restart
```

## File Structure

```
backend/
├── app/
│   ├── Schemas/
│   │   └── workflow_schema.py          # Enhanced schemas
│   ├── Services/
│   │   └── workflow_service.py         # Enhanced workflow service
│   ├── jsonsaver.py                    # Enhanced thread management
│   └── routes/
│       └── workflow.py                 # New API endpoints
└── test_threads.py                     # Test script

Frontend/
├── src/
│   ├── components/
│   │   ├── WorkflowProvider.tsx        # Enhanced thread management
│   │   ├── WorkflowsLayout.tsx         # Enhanced thread UI
│   │   ├── WorkflowPage.tsx            # Enhanced workflow display
│   │   └── HomePage.tsx                # Enhanced workflow creation
│   └── api/
│       └── apiService.ts               # New thread APIs
```

## Testing

Run the test script to verify thread management functionality:

```bash
cd backend
python test_threads.py
```

## Benefits

1. **Scalability**: Multiple workflows can run simultaneously
2. **User Experience**: Clear progress tracking and status information
3. **Reliability**: State persistence ensures no work is lost
4. **Flexibility**: Users can pause, resume, and manage workflows
5. **Monitoring**: Real-time visibility into workflow execution

## Future Enhancements

- Database integration for production use
- Thread scheduling and prioritization
- Advanced error handling and retry mechanisms
- Thread templates and workflow reuse
- Performance metrics and analytics
- Webhook notifications for thread events

## Troubleshooting

### Common Issues

1. **Threads not persisting**: Check file permissions for JSON storage
2. **Progress not updating**: Verify backend API connectivity
3. **Threads not syncing**: Check network requests in browser dev tools

### Debug Information

- Thread states are stored in `workflows.json` and `threads.json`
- Backend logs show thread creation and updates
- Frontend console shows API calls and state changes

## Conclusion

The workflow thread management system provides a robust foundation for managing multiple concurrent workflows while maintaining state persistence and user control. The system is designed to be scalable, reliable, and user-friendly, making it easy to manage complex workflow operations.
