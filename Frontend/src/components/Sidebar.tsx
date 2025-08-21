import React from 'react';
import { Link } from 'react-router-dom';
// Corrected icon imports. We are now using FaHome from the 'fa' set.
import { LuWorkflow, LuFeather, LuUsers, LuMessageCircle } from 'react-icons/lu';
import { FaHome } from 'react-icons/fa';

// Define the same View type as in App.tsx to ensure consistency
type View = 'home' | 'workflows' | 'social' | 'chat';

// Define the shape of the props for the Sidebar component
interface SidebarProps {
  currentView: View; 
  onNavigate: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  return (
    <div className="w-64 h-screen p-4 bg-gray-900 flex flex-col text-gray-300 border-r border-gray-800">
      <div className="flex items-center mb-8">
        <LuFeather className="h-8 w-8 text-blue-500 mr-2" />
        <h1 className="text-xl font-bold text-white">Orchestro AI</h1>
      </div>
      
      <nav className="flex-1">
        <ul>
          <li className="mb-2">
            <Link 
              to="/home" 
              onClick={() => onNavigate('home')}
              className={`flex items-center p-3 rounded-xl transition-colors ${currentView === 'home' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'}`}
            >
              <FaHome className="mr-3" /> {/* Replaced LuHome with FaHome */}
              <span>Home</span>
            </Link>
          </li>
          <li className="mb-2">
            <Link 
              to="/workflows" 
              onClick={() => onNavigate('workflows')}
              className={`flex items-center p-3 rounded-xl transition-colors ${currentView === 'workflows' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'}`}
            >
              <LuWorkflow className="mr-3" />
              <span>Workflows</span>
            </Link>
          </li>
          <li className="mb-2">
            <Link 
              to="/social" 
              onClick={() => onNavigate('social')}
              className={`flex items-center p-3 rounded-xl transition-colors ${currentView === 'social' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'}`}
            >
              <LuUsers className="mr-3" />
              <span>Social Media</span>
            </Link>
          </li>
          <li className="mb-2">
            <Link 
              to="/chat" 
              onClick={() => onNavigate('chat')}
              className={`flex items-center p-3 rounded-xl transition-colors ${currentView === 'chat' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'}`}
            >
              <LuMessageCircle className="mr-3" />
              <span>Chat</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="mt-auto p-4 border-t border-gray-800 text-center text-sm text-gray-500">
        © 2024 Orchestro AI
      </div>
    </div>
  );
};

export default Sidebar;