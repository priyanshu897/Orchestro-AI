import React, { useState, useEffect, useCallback } from 'react';
import { startWorkflow } from '../api/apiService';
import { marked } from 'marked';
import { LuCheck, LuLoader, LuFeather, LuLinkedin, LuImage, LuFilm, LuYoutube, LuInstagram, LuTriangle } from 'react-icons/lu';

interface WorkflowStatusItem {
  name: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  output: string | null;
  timestamp?: number;
}

interface WorkflowStepConfig {
  name: string;
  step: number;
  node: string;
  icon: React.ReactElement;
}

interface WorkflowPageProps {
  prompt: string;
  onGoBack: () => void;
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
        {status !== 'pending' && <div className={`absolute left-4 w-0.5 top-10 bottom-0 ${status === 'complete' ? 'bg-green-500' : status === 'error' ? 'bg-red-500' : 'bg-yellow-400'}`} />}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 flex-shrink-0
            ${status === 'complete' ? 'bg-green-500' : status === 'running' ? 'bg-yellow-400' : status === 'error' ? 'bg-red-500' : 'bg-gray-500'}`}
        >
            {status === 'complete' ? <LuCheck className="text-white" /> : 
             status === 'running' ? <LuLoader className="animate-spin text-yellow-800" /> : 
             status === 'error' ? <LuTriangle className="text-white" /> : icon}
        </div>
        <div className="flex-1 pb-8">
            <h3 className="text-lg font-semibold text-gray-200">{name}</h3>
            <p className="text-sm text-gray-400 mb-2">
                {status === 'running' && 'Running...'}
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

const WorkflowPage: React.FC<WorkflowPageProps> = ({ prompt, onGoBack }) => {
    const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatusItem[]>([]);
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const [isStarted, setIsStarted] = useState<boolean>(false);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [workflowType, setWorkflowType] = useState<string>('');
    const [activeWorkflowSteps, setActiveWorkflowSteps] = useState<WorkflowStepConfig[]>([]);

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

    // Determine workflow type and steps when prompt changes - only run once
    useEffect(() => {
        if (!prompt) return;
        
        let detectedWorkflowType = '';
        let steps: WorkflowStepConfig[] = [];
        
        if (prompt.toLowerCase().includes('linkedin') || prompt.toLowerCase().includes('post') || prompt.toLowerCase().includes('blog')) {
            detectedWorkflowType = 'linkedin_blog';
            steps = workflows['linkedin_blog'];
        } else if (prompt.toLowerCase().includes('video') || prompt.toLowerCase().includes('clips') || prompt.toLowerCase().includes('youtube') || prompt.toLowerCase().includes('instagram')) {
            detectedWorkflowType = 'video_clipping';
            steps = workflows['video_clipping'];
        }
        
        setWorkflowType(detectedWorkflowType);
        setActiveWorkflowSteps(steps);
        
        // Initialize workflow status
        const initialStatus: WorkflowStatusItem[] = steps.map(s => ({
            name: s.name,
            status: 'pending',
            output: null,
        }));
        if (initialStatus.length > 0) {
            initialStatus[0].status = 'running';
        }
        setWorkflowStatus(initialStatus);
        
    }, [prompt]); // Only depend on prompt

    // Handle workflow execution - only run when workflow is ready and not started
    useEffect(() => {
        if (!prompt || isStarted || activeWorkflowSteps.length === 0) return;
        
        setIsStarted(true);
        
        const handleNewMessage = (event: any) => {
            console.log('Received workflow event:', event);
            
            if (event.type === 'workflow_complete') {
                setIsComplete(true);
                return;
            }
            
            if (event.type === 'error') {
                console.error('Workflow error:', event.output);
                setIsComplete(true);
                return;
            }
            
            if (event.type === 'agent_output') {
                setWorkflowStatus(prevStatus => {
                    const nodeName = event.node;
                    const stepIndex = activeWorkflowSteps.findIndex(s => s.node === nodeName);

                    if (stepIndex > -1) {
                        const newStatus = [...prevStatus];
                        const outputContent = event.output;

                        // Mark current step as complete
                        newStatus[stepIndex] = {
                            name: activeWorkflowSteps[stepIndex].name,
                            status: 'complete',
                            output: outputContent,
                            timestamp: event.timestamp
                        };

                        // Mark next step as running if available
                        if (stepIndex + 1 < newStatus.length) {
                            newStatus[stepIndex + 1] = { 
                                ...newStatus[stepIndex + 1], 
                                status: 'running' 
                            };
                        }
                        
                        setCurrentStep(stepIndex + 1);
                        return newStatus;
                    }
                    return prevStatus;
                });
            }
        };

        const handleClose = () => {
            setIsComplete(true);
        };

        const handleError = (error: string) => {
            console.error("Workflow Error:", error);
            setIsComplete(true);
        };

        // Start the workflow
        startWorkflow(prompt, handleNewMessage, handleError, handleClose);
        
    }, [prompt, activeWorkflowSteps.length]); // Only depend on prompt and steps length, not isStarted

    return (
        <div className="p-8 h-full flex flex-col items-center min-h-screen">
            <h1 className="text-3xl font-bold text-gray-200 mb-6 text-center">Agentic Workflow</h1>
            <p className="text-gray-400 max-w-xl text-center mb-6">
                Watch as the AI agents collaborate to automate your content creation journey.
            </p>
            
            {workflowType && (
                <div className="mb-6 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full">
                    <span className="text-blue-300 text-sm font-medium">
                        {workflowType === 'linkedin_blog' ? 'LinkedIn Blog Workflow' : 'Video Clipping Workflow'}
                    </span>
                </div>
            )}

            <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-xl shadow-inner border border-gray-700">
                <div className="space-y-8">
                    {activeWorkflowSteps.map((s, index) => (
                        <WorkflowStep
                            key={s.step}
                            step={s.step}
                            name={s.name}
                            status={workflowStatus[index]?.status || 'pending'}
                            output={workflowStatus[index]?.output}
                            icon={s.icon}
                        />
                    ))}
                </div>
            </div>

            {isComplete && (
                <div className="mt-8 text-center">
                    <div className="mb-4 p-4 bg-green-600/20 border border-green-500/30 rounded-lg">
                        <p className="text-green-300 font-medium">Workflow completed successfully! 🎉</p>
                    </div>
                    <button
                        onClick={onGoBack}
                        className="py-3 px-6 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
                    >
                        Back to Chat
                    </button>
                </div>
            )}
        </div>
    );
};

export default WorkflowPage;