import React, { useState, useEffect } from 'react';
import { startWorkflow } from '../api/apiService';
import { LuCheck, LuLoader, LuFilm, LuShare2, LuLinkedin, LuYoutube, LuInstagram, LuImage,LuFeather } from 'react-icons/lu';
import { marked } from 'marked';

// Define the shape of a workflow status object
interface WorkflowStatusItem {
  name: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  output: string | null;
}

// Define the shape of the workflow step configuration
interface WorkflowStepConfig {
  name: string;
  step: number;
  node: string;
  icon: React.ReactElement;
}

// Define the props for the WorkflowPage component
interface WorkflowPageProps {
  prompt: string;
  onGoBack: () => void;
}

// A reusable component to display each step of the workflow
interface WorkflowStepProps {
  step: number;
  currentStep: number;
  name: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  output: string | null;
  icon: React.ReactElement;
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({ step, currentStep, name, status, output, icon }) => (
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

const WorkflowPage: React.FC<WorkflowPageProps> = ({ prompt, onGoBack }) => {
    const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatusItem[]>([]);
    const [isComplete, setIsComplete] = useState<boolean>(false);
    
    // Define the two possible workflows
    const workflows: { [key: string]: WorkflowStepConfig[] } = {
        'linkedin_post': [
            { name: 'Ideation Agent', step: 1, node: 'ideation', icon: <LuFeather className="text-white" /> },
            { name: 'Image Generation Agent', step: 2, node: 'image_generation', icon: <LuImage className="text-white" /> },
            { name: 'LinkedIn Posting Agent', step: 3, node: 'linkedin_posting', icon: <LuLinkedin className="text-white" /> },
        ],
        'video_clipping': [
            { name: 'Video Clipping Agent', step: 1, node: 'video_clipping', icon: <LuFilm className="text-white" /> },
            { name: 'Video Posting Agent', step: 2, node: 'video_posting', icon: <div className="flex items-center justify-center space-x-1"><LuYoutube className="text-white"/><LuInstagram className="text-white"/></div> },
        ],
    };
    
    // Determine the active workflow based on the prompt
    const getActiveWorkflowSteps = (p: string): WorkflowStepConfig[] => {
        if (p.toLowerCase().includes('linkedin') || p.toLowerCase().includes('post') || p.toLowerCase().includes('blog')) {
            return workflows['linkedin_post'];
        }
        if (p.toLowerCase().includes('video') || p.toLowerCase().includes('clips') || p.toLowerCase().includes('youtube') || p.toLowerCase().includes('instagram')) {
            return workflows['video_clipping'];
        }
        return []; // Return empty array if no workflow matches
    };
    
    const activeWorkflowSteps = getActiveWorkflowSteps(prompt);

        useEffect(() => {
                const handleNewMessage = (event: any) => {
            setWorkflowStatus(prevStatus => {
                const stepIndex = activeWorkflowSteps.findIndex(s => s.node === event.node);
                if (stepIndex > -1) {
                    const newStatus = [...prevStatus];
                    
                    // Correctly read the output dynamically from the event object
                    let outputContent = "No output from agent.";
                    if (event.output && Object.keys(event.output).length > 0) {
                        // Get the value of the first key in the output dictionary
                        const firstKey = Object.keys(event.output)[0];
                        outputContent = event.output[firstKey];
                    }
                    
                    newStatus[stepIndex] = {
                        name: activeWorkflowSteps[stepIndex].name,
                        status: 'complete',
                        output: outputContent,
                    };
                    return newStatus;
                }
                return prevStatus;
            });
        }
        
        const handleClose = () => {
            setIsComplete(true);
        };

        const handleError = (error: string) => {
            console.error("Workflow Error:", error);
        };

        const initialStatus: WorkflowStatusItem[] = activeWorkflowSteps.map(s => ({
            name: s.name,
            status: 'pending',
            output: null,
        }));
        setWorkflowStatus(initialStatus);

        startWorkflow(prompt, handleNewMessage, handleError, handleClose);

    }, [prompt]);

    return (
        <div className="p-8 h-full flex flex-col items-center min-h-screen">
            <h1 className="text-3xl font-bold text-gray-200 mb-6 text-center">Agentic Workflow</h1>
            <p className="text-gray-400 max-w-xl text-center mb-10">
                Watch as the AI agents collaborate to automate your video posting journey.
            </p>
            
            <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-xl shadow-inner border border-gray-700">
                <div className="space-y-8">
                    {activeWorkflowSteps.map((s, index) => (
                        <WorkflowStep
                            key={s.step}
                            step={s.step}
                            currentStep={workflowStatus.findIndex(item => item.name === s.name && item.status === 'complete') + 1}
                            name={workflowStatus[index]?.name || s.name}
                            status={workflowStatus[index]?.status || 'pending'}
                            output={workflowStatus[index]?.output}
                            icon={s.icon}
                        />
                    ))}
                </div>
            </div>

            {isComplete && (
                <button
                    onClick={onGoBack}
                    className="mt-8 py-3 px-6 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
                >
                    Back to Chat
                </button>
            )}
        </div>
    );
};

export default WorkflowPage;