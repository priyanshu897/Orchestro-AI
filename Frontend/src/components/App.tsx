import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { LuMenu } from 'react-icons/lu';
import HomePage from './HomePage';
import WorkflowsLayout from './workflowsLayout'; // ✅ New import for the layout component
import ChatPage from './ChatPage';
import Sidebar from './Sidebar';
import { WorkflowProvider } from './WorkflowProvider';
import '../styles/global.css';

type View = 'home' | 'workflows' | 'social' | 'chat';

const AppWithRouter: React.FC = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<View>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const handleNavigation = (view: View) => {
    setCurrentView(view);
    navigate(`/${view}`);
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-[#1a1a1a] text-white">
      <Sidebar isSidebarOpen={isSidebarOpen} onNavigate={handleNavigation} onClose={toggleSidebar} />

      <div className="flex-1 p-6 relative">
        {!isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="p-2 bg-gray-800 rounded-full text-white fixed top-6 left-6 z-20"
          >
            <LuMenu className="h-6 w-6" />
          </button>
        )}
        <div className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <Routes>
            {/* The root path now directs to the home page */}
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            {/* The new workflows route uses the WorkflowsLayout */}
            <Route path="/workflows/*" element={<WorkflowsLayout />} />
            <Route path="/social" element={
              <div className="text-center p-8">
                <h1 className="text-3xl font-bold">Social Media Management</h1>
                <p className="text-gray-400 mt-4">Coming Soon!</p>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <WorkflowProvider>
      <AppWithRouter />
    </WorkflowProvider>
  </Router>
);

export default App;