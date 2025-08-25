import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from './WorkflowProvider';
import { v4 as uuidv4 } from 'uuid';
import { LuSearch, LuSendHorizontal, LuLinkedin, LuYoutube, LuInstagram, LuFeather } from 'react-icons/lu';

interface QuickStartWorkflow {
  id: string;
  title: string;
  prompt: string;
  icon: React.ReactElement;
  workflowType: string;
}

const HomePage: React.FC = () => {
  const [input, setInput] = useState('');
  const navigate = useNavigate();
  const { addThread } = useWorkflow();

  const quickStartWorkflows: QuickStartWorkflow[] = [
    {
      id: 'linkedin_post',
      title: 'Create a LinkedIn Post',
      prompt: 'Create a LinkedIn blog post about the latest trends in AI.',
      icon: <LuLinkedin className="h-6 w-6 text-white" />,
      workflowType: 'linkedin_blog'
    },
    {
      id: 'video_clips',
      title: 'Generate Video Clips',
      prompt: 'Generate short video clips and descriptions for a video on marketing strategies for YouTube and Instagram.',
      icon: <div className="flex items-center justify-center space-x-1"><LuYoutube className="text-white"/><LuInstagram className="text-white"/></div>,
      workflowType: 'video_clipping'
    },
    {
      id: 'social_media_post',
      title: 'Social Media Post',
      prompt: 'Generate a social media post for our new product launch.',
      icon: <LuFeather className="h-6 w-6 text-white" />,
      workflowType: 'linkedin_blog'
    },
  ];

  const detectWorkflowType = (prompt: string): string => {
    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes('linkedin') || lowerPrompt.includes('blog') || lowerPrompt.includes('post') || lowerPrompt.includes('image')) {
      return 'linkedin_blog';
    }
    if (lowerPrompt.includes('video') || lowerPrompt.includes('clip') || lowerPrompt.includes('youtube') || lowerPrompt.includes('instagram') || lowerPrompt.includes('shorts')) {
      return 'video_clipping';
    }
    return 'linkedin_blog'; // default
  };

  const handleStartWorkflow = (prompt: string, workflowType?: string) => {
    if (prompt.trim()) {
      const threadId = uuidv4();
      const detectedType = workflowType || detectWorkflowType(prompt);
      addThread(threadId, `Workflow - ${prompt.substring(0, 30)}...`, detectedType);
      navigate(`/workflows/${threadId}`, { state: { prompt } });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <h1 className="text-5xl font-bold text-white mb-8">How can I help?</h1>
      
      <div className="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-lg p-3 flex items-center mb-8">
        <input
          type="text"
          placeholder="Build an agent or perform a task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleStartWorkflow(input)}
          className="flex-1 bg-transparent text-gray-300 placeholder-gray-500 text-lg focus:outline-none px-4"
        />
        <button
          onClick={() => handleStartWorkflow(input)}
          className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          <LuSendHorizontal className="h-6 w-6" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-2xl">
        {quickStartWorkflows.map((wf) => (
          <button
            key={wf.id}
            onClick={() => handleStartWorkflow(wf.prompt, wf.workflowType)}
            className="flex flex-col items-start p-4 bg-gray-800 rounded-xl shadow-md border border-gray-700 text-left hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <div className="mb-2">{wf.icon}</div>
            <h3 className="font-semibold text-white">{wf.title}</h3>
            <p className="text-sm text-gray-400 mt-1">{wf.prompt}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomePage;