import React, { useState } from 'react';
import { LuSearch, LuSendHorizontal, LuFeather, LuImage, LuLinkedin, LuFilm, LuYoutube, LuInstagram } from 'react-icons/lu';

// Define the props for the HomePage component
interface HomePageProps {
  onStartWorkflow: (prompt: string) => void;
}

// Define a type for our quick-start workflows
interface QuickStartWorkflow {
  id: string;
  title: string;
  prompt: string;
}

const HomePage: React.FC<HomePageProps> = ({ onStartWorkflow }) => {
  const [input, setInput] = useState('');

  // Define the quick-start workflows with prompts that match the backend's routing logic
  const quickStartWorkflows: QuickStartWorkflow[] = [
    {
      id: 'linkedin_post',
      title: 'LinkedIn Post',
      prompt: 'Create a LinkedIn blog post about the latest trends in AI.',
    },
    {
      id: 'video_clips',
      title: 'Video Clips',
      prompt: 'Generate short video clips and descriptions for a video on marketing strategies for YouTube and Instagram.',
    },
  ];

  const handleStartWorkflow = (prompt: string) => {
    if (prompt.trim()) {
      onStartWorkflow(prompt);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <h1 className="text-5xl font-bold text-white mb-8">How can I help?</h1>
      
      {/* Main search bar */}
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
      
      {/* Quick-start workflow cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 w-full max-w-2xl">
        {quickStartWorkflows.map((wf) => (
          <button
            key={wf.id}
            onClick={() => handleStartWorkflow(wf.prompt)}
            className="flex-1 p-4 bg-gray-800 rounded-xl shadow-md border border-gray-700 text-left hover:bg-gray-700 transition-colors cursor-pointer min-w-[200px]"
          >
            <h3 className="font-semibold text-white">{wf.title}</h3>
            <p className="text-sm text-gray-400 mt-1">{wf.prompt}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomePage;