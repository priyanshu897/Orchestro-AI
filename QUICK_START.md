# Quick Start Guide - Workflow Thread Management

## 🚀 Getting Started

This guide will help you test the new workflow thread management system that allows multiple concurrent workflows with progress tracking and state persistence.

## 📋 Prerequisites

- Python 3.8+ installed
- Node.js 16+ installed
- Backend and frontend dependencies installed

## 🔧 Backend Setup

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Test Thread Management
```bash
# Run the test script to verify functionality
python test_threads.py

# Run the demo script to create sample threads
python demo_workflow.py
```

### 3. Start Backend Server
```bash
# Start the FastAPI server
uvicorn app.main:app --reload --port 8000
```

The backend will be available at `http://localhost:8000`

## 🎨 Frontend Setup

### 1. Install Dependencies
```bash
cd Frontend
npm install
```

### 2. Start Frontend
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## 🧪 Testing the System

### 1. View Existing Threads
- Navigate to `/workflows` in the frontend
- You should see the demo threads created by the backend script:
  - ✅ **Create LinkedIn post about AI trends** (Completed)
  - ⏸️ **Generate video clips for marketing** (Paused)
  - 🔄 **Create social media campaign** (Running)

### 2. Create New Workflows
- Go to the home page (`/`)
- Use the quick start buttons or type custom prompts
- New threads will be created automatically

### 3. Test Thread Management
- **Pause/Resume**: Click pause/resume buttons on running threads
- **Delete**: Remove completed or unwanted threads
- **Progress Tracking**: Watch real-time progress updates
- **Multiple Threads**: Run several workflows simultaneously

### 4. API Testing
Test the backend API endpoints directly:

```bash
# List all threads
curl http://localhost:8000/api/threads

# Get specific thread details
curl http://localhost:8000/api/threads/demo-linkedin-1

# Pause a running thread
curl -X POST http://localhost:8000/api/threads/demo-social-1/pause

# Resume a paused thread
curl -X POST http://localhost:8000/api/threads/demo-video-1/resume

# Delete a thread
curl -X DELETE http://localhost:8000/api/threads/demo-linkedin-1
```

## 🎯 Key Features to Test

### ✅ Thread Creation
- Multiple workflows can be started simultaneously
- Each thread gets a unique ID
- Workflow type is automatically detected

### ✅ Progress Tracking
- Real-time progress updates
- Step-by-step completion tracking
- Progress bars and status indicators

### ✅ Thread Control
- Pause running workflows
- Resume paused workflows
- Delete completed workflows
- Status management (pending, running, completed, failed, paused)

### ✅ State Persistence
- Thread states are saved automatically
- Progress is maintained across restarts
- JSON-based storage (easily replaceable with database)

### ✅ Concurrent Execution
- Multiple threads run independently
- No interference between workflows
- Each thread maintains its own state

## 🔍 Troubleshooting

### Backend Issues
- Check if `uvicorn` is running on port 8000
- Verify Python dependencies are installed
- Check console for error messages

### Frontend Issues
- Ensure backend is running on port 8000
- Check browser console for API errors
- Verify CORS settings in backend

### Thread Issues
- Check `threads.json` and `workflows.json` files
- Verify file permissions for JSON storage
- Restart backend to reload thread states

## 📊 Expected Behavior

1. **Thread Creation**: New threads appear immediately in the sidebar
2. **Progress Updates**: Progress bars update in real-time
3. **Status Changes**: Thread status updates are reflected immediately
4. **Persistence**: Thread states survive backend restarts
5. **Concurrency**: Multiple workflows can run simultaneously

## 🎉 Success Indicators

- ✅ Multiple threads visible in the sidebar
- ✅ Progress bars updating in real-time
- ✅ Pause/resume functionality working
- ✅ Thread deletion working
- ✅ Status updates reflecting correctly
- ✅ No interference between concurrent workflows

## 🔗 Next Steps

After testing the basic functionality:

1. **Custom Workflows**: Create your own workflow types
2. **Database Integration**: Replace JSON storage with a database
3. **Advanced Features**: Add scheduling, prioritization, and notifications
4. **Monitoring**: Implement performance metrics and analytics

## 📚 Documentation

- **Full Documentation**: See `WORKFLOW_THREADS_README.md`
- **API Reference**: Check the FastAPI docs at `http://localhost:8000/docs`
- **Code Examples**: Review the component files for implementation details

---

**Happy Testing! 🚀**

If you encounter any issues, check the console logs and verify all services are running correctly.
