import React, { useState, useEffect } from 'react';
import { getThreads } from '../api/apiService';

const DebugPanel: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const addLog = (message: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testBackendConnection = async () => {
    try {
      addLog('🧪 Testing backend connection...');
      const threads = await getThreads();
      addLog(`✅ Backend connected! Found ${threads.length} threads`);
      addLog(`📊 Threads: ${JSON.stringify(threads.map(t => ({ id: t.thread_id, name: t.name, status: t.status })), null, 2)}`);
    } catch (error) {
      addLog(`❌ Backend connection failed: ${error}`);
    }
  };

  const clearLogs = () => {
    setDebugInfo([]);
  };

  useEffect(() => {
    // Auto-test on mount
    testBackendConnection();
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-red-600 text-white p-2 rounded-full shadow-lg z-50"
        title="Show Debug Panel"
      >
        🐛
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-64 bg-gray-900 text-white p-4 rounded-lg shadow-lg z-50 overflow-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Debug Panel</h3>
        <div className="space-x-2">
          <button
            onClick={testBackendConnection}
            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
          >
            Test
          </button>
          <button
            onClick={clearLogs}
            className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
          >
            Clear
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
          >
            ×
          </button>
        </div>
      </div>
      
      <div className="text-xs space-y-1 max-h-48 overflow-y-auto">
        {debugInfo.map((log, index) => (
          <div key={index} className="bg-gray-800 p-1 rounded">
            {log}
          </div>
        ))}
      </div>
      
      <div className="mt-2 text-xs text-gray-400">
        <div>Backend URL: http://localhost:8000</div>
        <div>Frontend URL: http://localhost:3000</div>
      </div>
    </div>
  );
};

export default DebugPanel;
