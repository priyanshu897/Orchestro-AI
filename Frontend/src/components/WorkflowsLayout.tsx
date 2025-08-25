import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import WorkflowPage from './WorkflowPage';
import { useWorkflow, WorkflowThread } from './WorkflowProvider';
import { LuFeather, LuImage, LuVideo } from 'react-icons/lu';

// Define the icons for each workflow type
const workflowIcons: { [key: string]: React.ReactElement } = {
  'linkedin_blog': <LuFeather className="h-4 w-4" />,
  'video_clipping': <LuVideo className="h-4 w-4" />,
  'default': <LuFeather className="h-4 w-4" />,
};

const WorkflowsLayout: React.FC = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const navigate = useNavigate();
  const { threads, getThreadById, updateThread, addThread } = useWorkflow();
  const location = useLocation();

  // If we are on the main workflows page without a threadId, select the first one.
  useEffect(() => {
    if (!threadId && Object.keys(threads).length > 0) {
      const firstThreadId = Object.keys(threads)[0];
      navigate(`/workflows/${firstThreadId}`);
    }
  }, [threadId, threads, navigate]);

  return (
    <div className="flex h-screen bg-[#1a1a1a]">
      {/* Sidebar for individual workflow threads */}
      <div className="w-64 border-r border-gray-800 p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-4">Your Workflows</h2>
        <ul className="flex-1 overflow-y-auto">
          {Object.values(threads).map((thread: WorkflowThread) => (
            <li key={thread.id} className="mb-2">
              <button
                onClick={() => navigate(`/workflows/${thread.id}`)}
                className={`w-full text-left flex items-center p-3 rounded-xl transition-colors ${thread.id === threadId ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'}`}
              >
                <div className="mr-3 text-gray-400">
                  {/* We can use the thread name to determine the icon */}
                  {thread.name.includes('LinkedIn') && workflowIcons['linkedin_blog']}
                  {thread.name.includes('Video') && workflowIcons['video_clipping']}
                  {!thread.name.includes('LinkedIn') && !thread.name.includes('Video') && workflowIcons['default']}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{thread.name}</h3>
                  <p className="text-xs text-gray-400">Status: {thread.status}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main workflow content */}
      <div className="flex-1 p-6">
        {threadId ? (
          <WorkflowPage />
        ) : (
          <div className="text-center p-8">
            <h1 className="text-3xl font-bold">No Workflow Selected</h1>
            <p className="text-gray-400 mt-4">Start a new workflow from the home page to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowsLayout;