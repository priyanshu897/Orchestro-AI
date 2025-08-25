import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { useWorkflow } from './WorkflowProvider';
import WorkflowPage from './WorkflowPage';
import { LuLinkedin, LuImage, LuFilm, LuYoutube, LuInstagram, LuTrash2, LuPause, LuPlay, LuRefreshCw, LuPlus } from 'react-icons/lu';
import { deleteThread, pauseThread, resumeThread } from '../api/apiService';

const WorkflowsLayout: React.FC = () => {
    const { threads, refreshThreads, syncWithBackend } = useWorkflow();
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
    const navigate = useNavigate();

    // Auto-refresh threads every 5 seconds and on mount
    useEffect(() => {
        const refreshInterval = setInterval(() => {
            refreshThreads();
        }, 5000);

        // Initial refresh
        refreshThreads();

        return () => clearInterval(refreshInterval);
    }, [refreshThreads]);

    const handleThreadClick = (threadId: string) => {
        setSelectedThreadId(threadId);
        navigate(`/workflows/${threadId}`);
    };

    const handleDeleteThread = async (threadId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await deleteThread(threadId);
            await refreshThreads();
        } catch (error) {
            console.error('Failed to delete thread:', error);
        }
    };

    const handlePauseThread = async (threadId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await pauseThread(threadId);
            await refreshThreads();
        } catch (error) {
            console.error('Failed to pause thread:', error);
        }
    };

    const handleResumeThread = async (threadId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await resumeThread(threadId);
            await refreshThreads();
        } catch (error) {
            console.error('Failed to resume thread:', error);
        }
    };

    const getWorkflowIcon = (workflowType?: string, prompt?: string) => {
        if (workflowType === 'linkedin_blog' || prompt?.toLowerCase().includes('linkedin')) {
            return <LuLinkedin className="h-5 w-5 text-blue-500" />;
        } else if (workflowType === 'video_clipping' || prompt?.toLowerCase().includes('video')) {
            return <LuFilm className="h-5 w-5 text-purple-500" />;
        } else if (workflowType === 'social_media' || prompt?.toLowerCase().includes('social')) {
            return <LuImage className="h-5 w-5 text-green-500" />;
        }
        return <LuLinkedin className="h-5 w-5 text-gray-500" />;
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'running': return 'text-green-400';
            case 'completed': return 'text-blue-400';
            case 'failed': return 'text-red-400';
            case 'paused': return 'text-orange-400';
            case 'pending': return 'text-yellow-400';
            default: return 'text-gray-400';
        }
    };

    const formatDate = (date: string | Date) => {
        try {
            if (typeof date === 'string') {
                return new Date(date).toLocaleString();
            } else if (date instanceof Date) {
                return date.toLocaleString();
            }
            return 'Unknown';
        } catch {
            return 'Unknown';
        }
    };

    const getProgressPercentage = (progress: any) => {
        if (!progress || progress.total === 0) return 0;
        return Math.round((progress.completed / progress.total) * 100);
    };

    const threadArray = Object.values(threads);

    return (
        <div className="flex h-screen bg-[#1a1a1a]">
            {/* Left Sidebar */}
            <div className="w-96 border-r border-gray-800 bg-gray-900 overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-white">Your Workflows</h1>
                        <button
                            onClick={refreshThreads}
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        >
                            <LuRefreshCw className="h-4 w-4" />
                            <span>Refresh</span>
                        </button>
                    </div>

                    {threadArray.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-gray-400 mb-4">No workflows yet</div>
                            <button
                                onClick={() => navigate('/')}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Start Your First Workflow
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {threadArray.map((thread) => (
                                <div
                                    key={thread.id}
                                    onClick={() => handleThreadClick(thread.id)}
                                    className={`bg-gray-800 p-4 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-700 border-l-4 ${
                                        selectedThreadId === thread.id ? 'border-blue-500 bg-gray-700' : 'border-transparent'
                                    }`}
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 mt-1">
                                            {getWorkflowIcon(thread.workflowType, thread.name)}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-sm font-medium text-white truncate">
                                                    {thread.name}
                                                </h3>
                                                <div className="flex items-center space-x-1">
                                                    <button
                                                        onClick={(e) => thread.status === 'running' ? handlePauseThread(thread.id, e) : handleResumeThread(thread.id, e)}
                                                        className="p-1 text-gray-400 hover:text-white transition-colors"
                                                        title={thread.status === 'running' ? 'Pause' : 'Resume'}
                                                    >
                                                        {thread.status === 'running' ? <LuPause className="h-4 w-4" /> : <LuPlay className="h-4 w-4" />}
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDeleteThread(thread.id, e)}
                                                        className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <LuTrash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className={`text-xs font-medium ${getStatusColor(thread.status)}`}>
                                                    {thread.status.charAt(0).toUpperCase() + thread.status.slice(1)}
                                                </span>
                                                {thread.workflowType && (
                                                    <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                                                        {thread.workflowType.replace('_', ' ')}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {thread.progress && thread.progress.total > 0 && (
                                                <div className="mb-2">
                                                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                                                        <span>Step {thread.progress.currentStep}</span>
                                                        <span>{thread.progress.completed}/{thread.progress.total}</span>
                                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                                        <div 
                                                            className={`bg-blue-500 h-2 rounded-full transition-all duration-500 progress-bar-width-${getProgressPercentage(thread.progress)}`}
                                                        />
                                                    </div>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <div className="text-xs text-gray-400">
                                                <div>Created: {formatDate(thread.createdAt || '')}</div>
                                                <div>Updated: {thread.lastUpdated.toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Content Area */}
            <div className="flex-1">
                <Routes>
                    <Route path="/" element={
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-white mb-4">No Workflow Selected</h2>
                                <p className="text-gray-400 mb-6">Start a new workflow from the home page to begin.</p>
                                <button
                                    onClick={refreshThreads}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Refresh Threads
                                </button>
                            </div>
                        </div>
                    } />
                    <Route path="/:threadId" element={<WorkflowPage />} />
                </Routes>
            </div>
        </div>
    );
};

export default WorkflowsLayout;