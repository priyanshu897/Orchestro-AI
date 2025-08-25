import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { getThreads, ThreadInfo as ApiThreadInfo } from '../api/apiService';

// Define the shape of a single workflow thread
export interface WorkflowThread {
  id: string;
  name: string;
  history: any[]; // Store the full history of streamed events
  status: 'pending' | 'running' | 'complete' | 'error' | 'paused';
  lastUpdated: Date;
  workflowType?: string;
  progress?: {
    completed: number;
    total: number;
    currentStep: string;
  };
  createdAt?: Date;
  conversationMemory?: any[]; // Store conversation history
  currentAgent?: string; // Track which agent is currently working
}

// Define the shape of the context's value
interface WorkflowContextType {
  threads: { [key: string]: WorkflowThread };
  addThread: (threadId: string, name: string, workflowType?: string) => void;
  updateThread: (threadId: string, newEvent: any) => void;
  getThreadById: (threadId: string) => WorkflowThread | undefined;
  deleteThread: (threadId: string) => void;
  refreshThreads: () => Promise<void>;
  syncWithBackend: () => Promise<void>;
  addConversationMessage: (threadId: string, message: any) => void;
  getConversationHistory: (threadId: string) => any[];
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

interface WorkflowProviderProps {
  children: ReactNode;
}

export const WorkflowProvider: React.FC<WorkflowProviderProps> = ({ children }) => {
  const [threads, setThreads] = useState<{ [key: string]: WorkflowThread }>({});

  // Convert API thread info to local thread format
  const convertApiThreadToLocal = (apiThread: ApiThreadInfo): WorkflowThread => {
    return {
      id: apiThread.thread_id,
      name: apiThread.name,
      history: [], // We'll populate this from workflow events
      status: apiThread.status as any,
      lastUpdated: new Date(apiThread.updated_at),
      workflowType: apiThread.workflow_type,
      progress: {
        completed: apiThread.progress.completed_steps,
        total: apiThread.progress.total_steps,
        currentStep: apiThread.progress.current_step
      },
      createdAt: new Date(apiThread.created_at),
      conversationMemory: [],
      currentAgent: apiThread.progress.current_step
    };
  };

  // Sync threads with backend
  const syncWithBackend = useCallback(async () => {
    try {
      console.log('🔄 Syncing threads with backend...');
      const apiThreads = await getThreads();
      console.log('📡 Received threads from backend:', apiThreads);
      
      const localThreads: { [key: string]: WorkflowThread } = {};
      
      apiThreads.forEach(apiThread => {
        localThreads[apiThread.thread_id] = convertApiThreadToLocal(apiThread);
      });
      
      console.log('🔄 Converting to local format:', localThreads);
      setThreads(localThreads);
      console.log('✅ Threads synced successfully');
    } catch (error) {
      console.error('❌ Failed to sync threads with backend:', error);
    }
  }, []);

  // Refresh threads from backend
  const refreshThreads = useCallback(async () => {
    await syncWithBackend();
  }, [syncWithBackend]);

  // Initial sync on mount
  useEffect(() => {
    syncWithBackend();
  }, [syncWithBackend]);

  const addThread = useCallback((threadId: string, name: string, workflowType?: string) => {
    setThreads(prev => ({
      ...prev,
      [threadId]: {
        id: threadId,
        name,
        history: [],
        status: 'running',
        lastUpdated: new Date(),
        workflowType,
        progress: {
          completed: 0,
          total: 0,
          currentStep: 'initializing'
        },
        createdAt: new Date(),
        conversationMemory: [
          {
            type: 'system',
            content: `Starting workflow: ${name}`,
            timestamp: new Date(),
            agent: 'System'
          }
        ],
        currentAgent: 'initializing'
      }
    }));
  }, []);

  const updateThread = useCallback((threadId: string, newEvent: any) => {
    setThreads(prev => {
      const thread = prev[threadId];
      if (!thread) return prev;
      
      const updatedHistory = [...thread.history, newEvent];
      let newStatus = thread.status;
      
      // Update status based on event type
      if (newEvent.node === '__end__') {
        newStatus = 'complete';
      } else if (newEvent.type === 'error') {
        newStatus = 'error';
      } else if (newEvent.type === 'progress') {
        newStatus = 'running';
      }
      
      // Update progress if available
      let updatedProgress = thread.progress;
      if (newEvent.progress) {
        updatedProgress = {
          completed: newEvent.progress.completed || 0,
          total: newEvent.progress.total || 0,
          currentStep: newEvent.progress.current_step || 'running'
        };
      }
      
      // Update current agent if available
      let currentAgent = thread.currentAgent;
      if (newEvent.node && newEvent.node !== '__end__') {
        currentAgent = newEvent.node;
      }
      
      return {
        ...prev,
        [threadId]: {
          ...thread,
          history: updatedHistory,
          status: newStatus,
          lastUpdated: new Date(),
          progress: updatedProgress,
          currentAgent
        }
      };
    });
  }, []);

  const addConversationMessage = useCallback((threadId: string, message: any) => {
    setThreads(prev => {
      const thread = prev[threadId];
      if (!thread) return prev;
      
      const updatedMemory = [...(thread.conversationMemory || []), message];
      
      return {
        ...prev,
        [threadId]: {
          ...thread,
          conversationMemory: updatedMemory,
          lastUpdated: new Date()
        }
      };
    });
  }, []);

  const getConversationHistory = useCallback((threadId: string) => {
    const thread = threads[threadId];
    return thread?.conversationMemory || [];
  }, [threads]);

  const getThreadById = useCallback((threadId: string) => {
    return threads[threadId];
  }, [threads]);

  const deleteThread = useCallback((threadId: string) => {
    setThreads(prev => {
      const newThreads = { ...prev };
      delete newThreads[threadId];
      return newThreads;
    });
  }, []);

  return (
    <WorkflowContext.Provider value={{ 
      threads, 
      addThread, 
      updateThread, 
      getThreadById, 
      deleteThread,
      refreshThreads,
      syncWithBackend,
      addConversationMessage,
      getConversationHistory
    }}>
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