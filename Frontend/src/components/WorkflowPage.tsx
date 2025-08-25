import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { startWorkflow } from '../api/apiService';
import { useWorkflow, WorkflowThread } from './WorkflowProvider';
import { marked } from 'marked';
import { LuCheck, LuLoader, LuFeather, LuLinkedin, LuImage, LuFilm, LuYoutube, LuInstagram, LuArrowLeft, LuPause, LuPlay, LuRefreshCw, LuMessageSquare, LuSend } from 'react-icons/lu';

interface WorkflowStepConfig {
  name: string;
  step: number;
  node: string;
  icon: React.ReactElement;
}

interface WorkflowStepProps {
  step: number;
  name: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  output: string | null;
  icon: React.ReactElement;
  isActive: boolean;
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({ step, name, status, output, icon, isActive }) => (
    <div className={`flex items-start space-x-4 relative transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
        {status !== 'pending' && <div className={`absolute left-4 w-0.5 top-10 bottom-0 ${status === 'complete' ? 'bg-green-500' : status === 'running' ? 'bg-yellow-400' : 'bg-gray-700'}`} />}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 flex-shrink-0
            ${status === 'complete' ? 'bg-green-500' : status === 'running' ? 'bg-yellow-400' : 'bg-gray-500'}`}
        >
            {status === 'complete' ? <LuCheck className="text-white" /> : status === 'running' ? <LuLoader className="animate-spin text-yellow-800" /> : icon}
        </div>
        <div className="flex-1 pb-8">
            <h3 className={`text-lg font-semibold ${status === 'running' ? 'text-yellow-400' : 'text-gray-200'}`}>
                {name}
                {status === 'running' && <span className="ml-2 text-sm text-yellow-400">🔄 Working...</span>}
            </h3>
            <p className="text-sm text-gray-400 mb-2">
                {status === 'running' && 'Processing...'}
                {status === 'complete' && 'Completed!'}
                {status === 'pending' && 'Waiting...'}
                {status === 'error' && 'Error occurred'}
            </p>
            {output && (
                <div 
                    className="bg-gray-800 p-4 rounded-lg text-sm text-gray-300 mt-2 border border-gray-700"
                    dangerouslySetInnerHTML={{ __html: marked.parse(output) }}
                />
            )}
        </div>
    </div>
);

const WorkflowPage: React.FC = () => {
    const { threadId } = useParams<{ threadId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const { threads, updateThread, getThreadById, refreshThreads, addConversationMessage, getConversationHistory } = useWorkflow();
    const thread = getThreadById(threadId as string);
    const [isWorkflowRunning, setIsWorkflowRunning] = useState(false);
    const [workflowMessages, setWorkflowMessages] = useState<any[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [userInput, setUserInput] = useState('');

    // Get active steps based on the thread's workflow type
    const getActiveWorkflowSteps = (workflowType?: string): WorkflowStepConfig[] => {
        const workflows: { [key: string]: WorkflowStepConfig[] } = {
            'linkedin_blog': [
                { name: 'Ideation Agent', step: 1, node: 'ideation_agent', icon: <LuFeather className="text-white" /> },
                { name: 'Image Generation Agent', step: 2, node: 'image_agent', icon: <LuImage className="text-white" /> },
                { name: 'LinkedIn Posting Agent', step: 3, node: 'linkedin_agent', icon: <LuLinkedin className="text-white" /> },
            ],
            'video_clipping': [
                { name: 'Video Clipping Agent', step: 1, node: 'video_clipping_agent', icon: <LuFilm className="text-white" /> },
                { name: 'Video Posting Agent', step: 2, node: 'video_posting_agent', icon: <div className="flex items-center justify-center space-x-1"><LuYoutube className="text-white"/><LuInstagram className="text-white"/></div> },
            ],
        };
        
        if (workflowType === 'linkedin_blog') {
            return workflows['linkedin_blog'];
        }
        if (workflowType === 'video_clipping') {
            return workflows['video_clipping'];
        }
        
        // Fallback to prompt-based detection
        const prompt = thread?.name || location.state?.prompt || '';
        if (prompt.toLowerCase().includes('linkedin') || prompt.toLowerCase().includes('post') || prompt.toLowerCase().includes('blog')) {
            return workflows['linkedin_blog'];
        }
        if (prompt.toLowerCase().includes('video') || prompt.toLowerCase().includes('clips') || prompt.toLowerCase().includes('youtube') || prompt.toLowerCase().includes('instagram')) {
            return workflows['video_clipping'];
        }
        return [];
    };

    const steps = getActiveWorkflowSteps(thread?.workflowType);

    // Auto-scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [workflowMessages]);

    // Load conversation history on mount
    useEffect(() => {
        if (threadId && thread) {
            const history = getConversationHistory(threadId);
            if (history.length > 0) {
                setWorkflowMessages(history);
            }
        }
    }, [threadId, thread, getConversationHistory]);

    // Automatic workflow execution disabled - users manually start workflows
    
    // Fallback for when the thread data is not yet available
    if (!thread) {
        return (
            <div className="text-center p-8">
                <h1 className="text-3xl font-bold">Loading...</h1>
            </div>
        );
    }
    
    // Map the workflow history from the thread to the UI state
    const workflowStatus = steps.map(s => {
      const historyItem = thread?.history.find(item => item.node === s.node);
      const output = historyItem ? historyItem.output : null;
      const isComplete = !!historyItem;
      const isRunning = thread?.status === 'running' && !isComplete && (
          steps.findIndex(step => step.node === historyItem?.node) + 1 === s.step || s.step === 1
      );
      
      return {
        name: s.name,
        status: isComplete ? 'complete' : (isRunning ? 'running' : 'pending'),
        output: output,
        icon: s.icon,
        isActive: isComplete || isRunning
      };
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'running': return 'text-green-400';
            case 'complete': return 'text-blue-400';
            case 'error': return 'text-red-400';
            case 'paused': return 'text-orange-400';
            default: return 'text-gray-400';
        }
    };

    const getProgressPercentage = () => {
        if (!thread.progress || thread.progress.total === 0) return 0;
        return Math.round((thread.progress.completed / thread.progress.total) * 100);
    };

    const handleSendMessage = () => {
        if (!userInput.trim()) return;
        
        const userMessage = {
            type: 'user',
            content: userInput,
            timestamp: new Date(),
            agent: 'User'
        };
        
        setWorkflowMessages(prev => [...prev, userMessage]);
        addConversationMessage(threadId as string, userMessage);
        setUserInput('');
        
        // Here you could add logic to send user input to the workflow
        // For now, just add it to the conversation memory
        // In the future, this could trigger additional workflow steps or agent responses
    };

    return (
        <div className="flex h-screen bg-[#1a1a1a]">
            {/* Left Sidebar - Workflow Progress */}
            <div className="w-96 border-r border-gray-800 p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-200">{thread.name}</h1>
                    <button
                        onClick={() => navigate('/workflows')}
                        className="p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition-colors"
                    >
                        <LuArrowLeft className="h-5 w-5" />
                    </button>
                </div>

                {/* Thread Status and Progress */}
                <div className="bg-gray-800 p-4 rounded-xl shadow-inner border border-gray-700 mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                            <span className={`text-sm font-medium ${getStatusColor(thread.status)}`}>
                                Status: {thread.status.charAt(0).toUpperCase() + thread.status.slice(1)}
                            </span>
                            {thread.workflowType && (
                                <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                                    {thread.workflowType.replace('_', ' ')}
                                </span>
                            )}
                        </div>
                        {thread.progress && thread.progress.total > 0 && (
                            <span className="text-sm text-gray-400">
                                {thread.progress.completed}/{thread.progress.total} steps
                            </span>
                        )}
                    </div>
                    
                    {/* Manual Start Button for Paused/Pending Workflows */}
                    {(thread.status === 'paused' || thread.status === 'pending' || thread.status === 'error') && (
                        <div className="mb-3">
                            <button
                                onClick={() => {
                                    const prompt = thread.name;
                                    if (prompt && threadId) {
                                        setIsWorkflowRunning(true);
                                        startWorkflow(prompt, threadId, 
                                            (event) => {
                                                console.log('🔄 Workflow event:', event);
                                                updateThread(threadId, event);
                                            },
                                            (error) => console.error('Workflow error:', error),
                                            () => setIsWorkflowRunning(false)
                                        );
                                    }
                                }}
                                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                🚀 Start/Resume Workflow
                            </button>
                        </div>
                    )}
                    
                    {thread.progress && thread.progress.total > 0 && (
                        <div className="mb-2">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Current: {thread.progress.currentStep}</span>
                                <span>{getProgressPercentage()}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-3">
                                <div 
                                    className={`bg-blue-500 h-3 rounded-full transition-all duration-500 w-p-${Math.min(100, Math.max(0, Math.round(getProgressPercentage() / 5) * 5))}`}
                                />
                            </div>
                        </div>
                    )}
                    
                    <div className="text-xs text-gray-400">
                        <div>Created: {thread.createdAt ? new Date(thread.createdAt).toLocaleString() : 'Unknown'}</div>
                        <div>Updated: {thread.lastUpdated.toLocaleString()}</div>
                    </div>
                </div>

                {/* Workflow Steps */}
                <div className="space-y-6">
                    {steps.map((s, index) => (
                        <WorkflowStep
                            key={s.step}
                            step={s.step}
                            name={s.name}
                            status={(workflowStatus[index]?.status as 'pending' | 'running' | 'complete' | 'error') || 'pending'}
                            output={workflowStatus[index]?.output}
                            icon={s.icon}
                            isActive={workflowStatus[index]?.isActive || false}
                        />
                    ))}
                </div>
            </div>

            {/* Right Side - Live Chat Interface */}
            <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="bg-gray-800 border-b border-gray-700 p-4">
                    <div className="flex items-center space-x-3">
                        <LuMessageSquare className="h-6 w-6 text-blue-400" />
                        <div>
                            <h2 className="text-lg font-semibold text-white">Workflow Chat</h2>
                            <p className="text-sm text-gray-400">
                                {isWorkflowRunning ? '🔄 Live workflow execution' : 'Workflow completed'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {workflowMessages.map((message, index) => (
                        <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-3xl rounded-lg p-3 ${
                                message.type === 'user' 
                                    ? 'bg-blue-600 text-white' 
                                    : message.type === 'agent'
                                    ? 'bg-gray-700 text-white border border-gray-600'
                                    : message.type === 'error'
                                    ? 'bg-red-800 text-white'
                                    : 'bg-gray-600 text-gray-200'
                            }`}>
                                <div className="flex items-center space-x-2 mb-2">
                                    <span className="text-xs font-medium opacity-75">
                                        {message.agent}
                                    </span>
                                    <span className="text-xs opacity-50">
                                        {message.timestamp.toLocaleTimeString()}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    {message.content}
                                </div>
                                {message.progress && (
                                    <div className="mt-2 text-xs opacity-75">
                                        Step {message.progress.completed}/{message.progress.total}: {message.progress.current_step}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <div className="bg-gray-800 border-t border-gray-700 p-4">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Type a message or question..."
                            className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleSendMessage}
                            className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors"
                        >
                            <LuSend className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkflowPage;