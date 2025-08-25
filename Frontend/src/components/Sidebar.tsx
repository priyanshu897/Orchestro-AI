import React from 'react';
import { Link } from 'react-router-dom';
import { LuWorkflow, LuFeather, LuUsers, LuChrome, LuMessageCircle, LuArrowLeft } from 'react-icons/lu';

type View = 'home' | 'workflows' | 'social' | 'chat';

interface SidebarProps {
  isSidebarOpen: boolean;
  onNavigate: (view: View) => void;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, onNavigate, onClose }) => {
  return (
    <div className={`fixed top-0 left-0 h-screen w-64 p-4 bg-gray-900 flex flex-col text-gray-300 z-30 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <LuFeather className="h-8 w-8 text-blue-500 mr-2" />
          <h1 className="text-xl font-bold text-white">Orchestro AI</h1>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-800 text-gray-400">
          <LuArrowLeft className="h-6 w-6" />
        </button>
      </div>
      
      <nav className="flex-1">
        <ul>
          <li className="mb-2">
            <Link 
              to="/home" 
              onClick={() => { onNavigate('home'); onClose(); }}
              className={`flex items-center p-3 rounded-xl transition-colors hover:bg-gray-800`}
            >
              <LuChrome className="mr-3" />
              <span>Home</span>
            </Link>
          </li>
          <li className="mb-2">
            <Link 
              to="/workflows" 
              onClick={() => { onNavigate('workflows'); onClose(); }}
              className={`flex items-center p-3 rounded-xl transition-colors hover:bg-gray-800`}
            >
              <LuWorkflow className="mr-3" />
              <span>Workflows</span>
            </Link>
          </li>
          <li className="mb-2">
            <Link 
              to="/social" 
              onClick={() => { onNavigate('social'); onClose(); }}
              className={`flex items-center p-3 rounded-xl transition-colors hover:bg-gray-800`}
            >
              <LuUsers className="mr-3" />
              <span>Social Media</span>
            </Link>
          </li>
          <li className="mb-2">
            <Link 
              to="/chat" 
              onClick={() => { onNavigate('chat'); onClose(); }}
              className={`flex items-center p-3 rounded-xl transition-colors hover:bg-gray-800`}
            >
              <LuMessageCircle className="mr-3" />
              <span>Chat</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="mt-auto p-4 border-t border-gray-800 text-center text-sm text-gray-500">
        © 2025 Orchestro AI
      </div>
    </div>
  );
};

export default Sidebar;