import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

// Define the shape of a single workflow thread
export interface WorkflowThread {
  id: string;
  name: string;
  history: any[]; // Store the full history of streamed events
  status: 'running' | 'complete' | 'error';
  lastUpdated: Date;
}

// Define the shape of the context's value
interface WorkflowContextType {
  threads: { [key: string]: WorkflowThread };
  addThread: (threadId: string, name: string) => void;
  updateThread: (threadId: string, newEvent: any) => void;
  getThreadById: (threadId: string) => WorkflowThread | undefined;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

interface WorkflowProviderProps {
  children: ReactNode;
}

export const WorkflowProvider: React.FC<WorkflowProviderProps> = ({ children }) => {
  const [threads, setThreads] = useState<{ [key: string]: WorkflowThread }>({});

  const addThread = useCallback((threadId: string, name: string) => {
    setThreads(prev => ({
      ...prev,
      [threadId]: {
        id: threadId,
        name,
        history: [],
        status: 'running',
        lastUpdated: new Date(),
      }
    }));
  }, []);

  const updateThread = useCallback((threadId: string, newEvent: any) => {
    setThreads(prev => {
      const thread = prev[threadId];
      if (!thread) return prev;
      
      const updatedHistory = [...thread.history, newEvent];
      const newStatus = newEvent.node === '__end__' ? 'complete' : thread.status;
      
      return {
        ...prev,
        [threadId]: {
          ...thread,
          history: updatedHistory,
          status: newStatus,
          lastUpdated: new Date(),
        }
      };
    });
  }, []);

  const getThreadById = useCallback((threadId: string) => {
    return threads[threadId];
  }, [threads]);

  return (
    <WorkflowContext.Provider value={{ threads, addThread, updateThread, getThreadById }}>
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};