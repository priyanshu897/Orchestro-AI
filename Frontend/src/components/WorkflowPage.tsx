import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { startWorkflow } from '../api/apiService';
import { useWorkflow } from './WorkflowProvider';
import { marked } from 'marked';
import { LuCheck, LuLoader, LuFeather, LuLinkedin, LuImage, LuFilm, LuYoutube, LuInstagram, LuArrowLeft } from 'react-icons/lu';

interface WorkflowStatusItem {
  name: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  output: string | null;
}

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
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({ step, name, status, output, icon }) => (
    <div className="flex items-start space-x-4 relative">
        {status !== 'pending' && <div className={`absolute left-4 w-0.5 top-10 bottom-0 ${status === 'complete' ? 'bg-green-500' : 'bg-gray-700'}`} />}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 flex-shrink-0
            ${status === 'complete' ? 'bg-green-500' : status === 'running' ? 'bg-yellow-400' : 'bg-gray-500'}`}
        >
            {status === 'complete' ? <LuCheck className="text-white" /> : status === 'running' ? <LuLoader className="animate-spin text-yellow-800" /> : icon}
        </div>
        <div className="flex-1 pb-8">
            <h3 className="text-lg font-semibold text-gray-200">{name}</h3>
            <p className="text-sm text-gray-400 mb-2">
                {status === 'running' && 'Running...'}
                {status === 'complete' && 'Completed!'}
                {status === 'pending' && 'Waiting...'}
            </p>
            {output && (
                <div
                    className="bg-gray-800 p-3 rounded-lg text-sm text-gray-300 mt-2"
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
  const { threads, updateThread, addThread } = useWorkflow();
  const thread = threads[threadId || ''];

  const getActiveWorkflowSteps = (p: string): WorkflowStepConfig[] => {
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
    if (p.toLowerCase().includes('linkedin') || p.toLowerCase().includes('post') || p.toLowerCase().includes('blog')) {
        return workflows['linkedin_blog'];
    }
    if (p.toLowerCase().includes('video') || p.toLowerCase().includes('clips') || p.toLowerCase().includes('youtube') || p.toLowerCase().includes('instagram')) {
        return workflows['video_clipping'];
    }
    return [];
  };

  const steps = getActiveWorkflowSteps(location.state?.prompt || '');
  
  useEffect(() => {
    if (!threadId || !location.state?.prompt) {
        // If a threadId exists in the URL but not in state (e.g., page refresh),
        // we can navigate to the main workflows page.
        if (threadId && !thread) {
          navigate('/workflows');
        }
        return;
    }
    
    // Only start the workflow if it hasn't been started yet
    if (thread?.status === 'running' || thread?.status === 'complete') {
        return;
    }

    const handleNewMessage = (event: any) => {
        updateThread(threadId, event);
    };

    const handleError = (error: string) => {
        console.error("Workflow Error:", error);
    };

    const handleClose = () => {
        // You can update the thread status to 'complete' here
    };
    
    // Start the workflow
    startWorkflow(location.state.prompt, threadId, handleNewMessage, handleError, handleClose);
    
  }, [threadId, location.state, updateThread, navigate, thread]);

  const workflowHistory = thread?.history || [];
  const isComplete = thread?.status === 'complete';
  
  return (
    <div className="p-8 h-full flex flex-col items-center min-h-screen">
      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-200 text-center">{thread?.name || 'Workflow'}</h1>
        <button
          onClick={() => navigate('/home')}
          className="p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition-colors"
        >
          <LuArrowLeft className="h-6 w-6" />
        </button>
      </div>

      <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-xl shadow-inner border border-gray-700">
        <div className="space-y-8">
            {steps.map((s, index) => {
              const currentStatus = workflowHistory.find(item => item.node === s.node);
              const isRunning = thread?.status === 'running' && !currentStatus && (
                workflowHistory.findIndex(item => {
                    const foundNodeIndex = steps.findIndex(step => step.node === item.node);
                    return foundNodeIndex + 1 === index;
                }) > -1 || index === 0);

              return (
                <WorkflowStep
                  key={s.step}
                  step={s.step}
                  name={s.name}
                  status={currentStatus ? 'complete' : (isRunning ? 'running' : 'pending')}
                  output={currentStatus ? currentStatus.output : null}
                  icon={s.icon}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default WorkflowPage;