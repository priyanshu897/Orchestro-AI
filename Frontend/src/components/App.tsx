import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ChatPage from './ChatPage';
import WorkflowPage from './WorkflowPage';
import HomePage from './HomePage';
import Sidebar from './Sidebar';
import '../styles/global.css';

// Define the available pages and their URLs
type View = 'home' | 'workflows' | 'social' | 'chat';

// A new component to wrap the router and handle navigation
const AppWithRouter: React.FC = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<View>('home');
  const [workflowPrompt, setWorkflowPrompt] = useState<string>('');
  
  const handleStartWorkflow = (prompt: string) => {
    setWorkflowPrompt(prompt);
    navigate('/workflows');
  };

  const handleGoBack = () => {
    navigate('/home');
  };

  const handleNavigation = (view: View) => {
    setCurrentView(view);
    navigate(`/${view}`);
  };

  return (
    <div className="flex min-h-screen bg-[#1a1a1a] text-white">
      <Sidebar currentView={currentView} onNavigate={handleNavigation} />
      <div className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<HomePage onStartWorkflow={handleStartWorkflow} />} />
          <Route path="/home" element={<HomePage onStartWorkflow={handleStartWorkflow} />} />
          <Route path="/chat" element={<ChatPage onStartWorkflow={handleStartWorkflow} />} />
          <Route path="/workflows" element={<WorkflowPage prompt={workflowPrompt} onGoBack={handleGoBack} />} />
          <Route path="/social" element={
            <div className="text-center p-8">
              <h1 className="text-3xl font-bold">Social Media Management</h1>
              <p className="text-gray-400 mt-4">Coming Soon!</p>
            </div>
          } />
        </Routes>
      </div>
    </div>
  );
};

// The main App component that wraps the entire application with a router
const App: React.FC = () => (
  <Router>
    <AppWithRouter />
  </Router>
);

export default App;