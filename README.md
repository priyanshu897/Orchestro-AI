# Orchestro AI - Multi-Agent Content Creation Platform

Orchestro AI is a sophisticated content creation platform that uses multiple AI agents to automate the process of creating and posting content across various social media platforms.

## 🚀 Features

- **Multi-Agent Workflows**: Intelligent agents that collaborate to create content
- **LinkedIn Blog Workflow**: Ideation → Image Generation → LinkedIn Posting
- **Video Clipping Workflow**: Video Processing → Multi-Platform Posting
- **Real-time Streaming**: Live updates as agents work through the workflow
- **Modern UI**: Beautiful React-based interface with real-time progress tracking
- **Error Handling**: Robust error handling and user feedback

## 🏗️ Architecture

### Backend (FastAPI + LangGraph)
- **FastAPI**: High-performance web framework
- **LangGraph**: Workflow orchestration and agent management
- **Google Gemini**: AI model for content generation
- **Streaming API**: Real-time workflow progress updates

### Frontend (React + TypeScript)
- **React 19**: Latest React with modern hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Modern, responsive styling
- **Real-time Updates**: Live workflow progress visualization

## 🛠️ Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 18+
- Google Gemini API key

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   GOOGLE_API_KEY=your_google_gemini_api_key_here
   ```

5. **Start the backend server:**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🧪 Testing

### Test the Backend Workflow

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Run the test script:**
   ```bash
   python test_workflow.py
   ```

This will test both workflow types:
- LinkedIn blog workflow
- Video clipping workflow

### Test the Full System

1. **Start both backend and frontend servers**
2. **Open the frontend in your browser**
3. **Try these prompts:**
   - "Create a LinkedIn post about artificial intelligence"
   - "Make video clips about machine learning for social media"

## 🔄 Workflow Types

### LinkedIn Blog Workflow
1. **Ideation Agent**: Generates video concept and script outline
2. **Image Generation Agent**: Creates AI-generated image prompts
3. **LinkedIn Posting Agent**: Generates and "publishes" LinkedIn posts

### Video Clipping Workflow
1. **Video Clipping Agent**: Processes video content and generates descriptions
2. **Video Posting Agent**: Prepares content for multiple platforms

## 📱 UI Features

- **Real-time Progress**: Live updates as agents work
- **Step-by-step Visualization**: Clear workflow progress indicators
- **Agent Output Display**: Formatted markdown output from each agent
- **Error Handling**: Clear error messages and recovery options
- **Responsive Design**: Works on desktop and mobile devices

## 🐛 Troubleshooting

### Common Issues

1. **Backend won't start:**
   - Check if port 8000 is available
   - Verify your Google API key is set correctly
   - Ensure all dependencies are installed

2. **Frontend won't connect to backend:**
   - Verify backend is running on port 8000
   - Check CORS configuration
   - Ensure network connectivity

3. **Workflow errors:**
   - Check console logs for detailed error messages
   - Verify API key has sufficient quota
   - Check network connectivity to Google services

### Debug Mode

Enable debug logging by setting environment variables:
```bash
export LOG_LEVEL=DEBUG
```

## 🔧 Development

### Adding New Agents

1. Create a new agent file in `backend/app/agents/`
2. Implement the agent function following the existing pattern
3. Add the agent to the appropriate workflow in `workflow_service.py`
4. Update the frontend workflow configuration

### Modifying Workflows

1. Edit the workflow definitions in `workflow_service.py`
2. Update the frontend workflow steps in `WorkflowPage.tsx`
3. Test thoroughly with the test script

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review console logs for error details
3. Create an issue in the repository

---

**Note**: This is a prototype system. In production, you would need to:
- Implement actual API integrations (LinkedIn, YouTube, Instagram)
- Add proper authentication and user management
- Implement actual video processing capabilities
- Add proper error handling and retry mechanisms
- Implement rate limiting and quota management 