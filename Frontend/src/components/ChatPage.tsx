import React, { useState, useEffect } from 'react';
import { sendMessage } from '../api/apiService';
import { marked } from 'marked';
import { LuSendHorizontal, LuLoader } from 'react-icons/lu';

// Define the shape of a chat message
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// The onStartWorkflow prop is no longer optional as the router will always provide it
interface ChatPageProps {
  onStartWorkflow: (prompt: string) => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ onStartWorkflow }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setMessages([{ role: 'assistant', content: "Hello! I am Orchestro AI. How can I help you today? To start the agentic workflow, please type 'I want to make my video posting journey automated'." }]);
  }, []);

  const streamMessage = (fullContent: string) => {
    let currentContent = "";
    const words = fullContent.split(' ');
    let wordIndex = 0;

    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    const typingInterval = setInterval(async () => {
      if (wordIndex < words.length) {
        currentContent += (wordIndex > 0 ? ' ' : '') + words[wordIndex];
        const htmlContent = await marked.parse(currentContent);
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: htmlContent,
          };
          return newMessages;
        });
        wordIndex++;
      } else {
        clearInterval(typingInterval);
        setLoading(false);
      }
    }, 50);
  };

  const handleSendMessage = async () => {
    const userMessage = input.trim();
    if (!userMessage || loading) return;

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setLoading(true);

    const triggerPhrase = "I want to make my video posting journey automated";
    if (userMessage.toLowerCase().includes(triggerPhrase.toLowerCase())) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        onStartWorkflow(userMessage);
        return;
    }

    try {
      const response = await sendMessage(userMessage);
      streamMessage(response);
    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '⚠️ Error fetching response. Please check your backend connection.' }
      ]);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a] rounded-xl shadow-lg border border-gray-700 p-4">
      <div className="flex-grow overflow-y-auto space-y-4 p-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`p-4 rounded-xl max-w-[85%] break-words ${
                msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-[#333] text-gray-200 rounded-bl-none'
              }`}
              dangerouslySetInnerHTML={{ __html: msg.content }}
            />
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="p-4 rounded-xl bg-[#333] text-gray-200 rounded-bl-none">
              <LuLoader className="h-6 w-6 animate-spin" />
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Message Orchestro AI..."
          className="flex-grow py-2 px-4 bg-[#333] rounded-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          disabled={loading}
        >
          <LuSendHorizontal className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;