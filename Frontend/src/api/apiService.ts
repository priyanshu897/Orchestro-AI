import { marked } from 'marked';

// API service for communicating with the backend

export interface ThreadInfo {
  thread_id: string;
  name: string;
  status: string;
  workflow_type?: string;
  progress: {
    completed_steps: number;
    total_steps: number;
    current_step: string;
  };
  created_at: string;
  updated_at: string;
}

export interface WorkflowEvent {
  type: string;
  node?: string;
  output?: string;
  progress?: {
    completed: number;
    total: number;
    current_step: string;
    percentage: number;
  };
  thread_id?: string;
  timestamp?: number;
  message?: string;
}

const API_BASE_URL = 'http://localhost:8000';

// Helper function to make API calls
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`🌐 API Call: ${options.method || 'GET'} ${url}`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ API Response:`, data);
    return data;
  } catch (error) {
    console.error(`❌ API Error:`, error);
    throw error;
  }
}

// Get all threads
export async function getThreads(): Promise<ThreadInfo[]> {
  const response = await apiCall<{ threads: ThreadInfo[] }>('/api/threads');
  return response.threads;
}

// Get specific thread info
export async function getThreadInfo(threadId: string): Promise<ThreadInfo> {
  return await apiCall<ThreadInfo>(`/api/threads/${threadId}`);
}

// Delete a thread
export async function deleteThread(threadId: string): Promise<{ message: string }> {
  return await apiCall<{ message: string }>(`/api/threads/${threadId}`, {
    method: 'DELETE',
  });
}

// Pause a thread
export async function pauseThread(threadId: string): Promise<{ message: string }> {
  return await apiCall<{ message: string }>(`/api/threads/${threadId}/pause`, {
    method: 'POST',
  });
}

// Resume a thread
export async function resumeThread(threadId: string): Promise<{ message: string }> {
  return await apiCall<{ message: string }>(`/api/threads/${threadId}/resume`, {
    method: 'POST',
  });
}

// Start a new workflow with real-time streaming
export async function startWorkflow(
  prompt: string, 
  threadId: string,
  onMessage: (event: WorkflowEvent) => void,
  onError: (error: string) => void,
  onClose: () => void
): Promise<void> {
  console.log(`🚀 Starting workflow: ${prompt} (Thread: ${threadId})`);
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, thread_id: threadId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('No response body');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log('📡 Workflow stream completed');
          onClose();
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const eventData = line.slice(6); // Remove 'data: ' prefix
              const event: WorkflowEvent = JSON.parse(eventData);
              console.log('🔄 Workflow event received:', event);
              onMessage(event);
            } catch (parseError) {
              console.error('❌ Failed to parse event:', parseError);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

  } catch (error) {
    console.error('❌ Workflow error:', error);
    onError(error instanceof Error ? error.message : 'Unknown error');
  }
}

// Get system status
export async function getStatus(): Promise<{ status: string; message: string }> {
  return await apiCall<{ status: string; message: string }>('/api/status');
}

// Send a single chat message (used by ChatPage)
export async function sendMessage(message: string): Promise<string> {
  const url = `${API_BASE_URL}/api/chat`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    // Support both {response} and {message} payloads
    return (data && (data.response || data.message)) ?? '';
  } catch (err) {
    console.error('sendMessage error:', err);
    throw err;
  }
}