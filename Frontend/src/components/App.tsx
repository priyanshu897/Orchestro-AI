import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ChatPage from './ChatPage';
import WorkflowPage from './Workflowpage';
import HomePage from './HomePage';
import Sidebar from './sidebar';
import '../styles/global.css';

// Define the available pages and their URLs
type View = 'home' | 'workflows' | 'social' | 'chat';

// A new component to wrap the router and handle navigation
const AppWithRouter: React.FC = () => {
  const navigate = useNavigate();
  // We'll manage the active view here
  const [currentView, setCurrentView] = useState<View>('home');
  const [workflowPrompt, setWorkflowPrompt] = useState<string>('');
  
  // This function is passed to ChatPage to trigger a workflow
  const handleStartWorkflow = (prompt: string) => {
    setWorkflowPrompt(prompt);
    navigate('/workflows');
  };

  // This function is passed to WorkflowPage to navigate back
  const handleGoBack = () => {
    navigate('/home');
  };

  // This function handles clicks on the sidebar and updates the URL
  const handleNavigation = (view: View) => {
    setCurrentView(view);
    navigate(`/${view}`);
  };

  return (
    <div className="flex min-h-screen bg-[#1a1a1a] text-white">
      {/* The sidebar navigates by calling handleNavigation */}
      <Sidebar currentView={currentView} onNavigate={handleNavigation} />
      <div className="flex-1 p-6">
        <Routes>
          {/* Each route corresponds to a page component */}
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