import React, { useState } from "react";
import { sendMessage as sendMessageAPI } from "../api/chat.js";
; // ✅ import your API call

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatSection: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const newMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      // ✅ Call backend API
      const res = await sendMessageAPI(input);

      // Append assistant reply (adjust "reply" to match backend key)
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: res.reply || "⚠️ No reply from LLM" }
      ]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "⚠️ Error fetching response." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      {/* Chat Messages */}
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <div className="bubble">{msg.content}</div>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="bubble">...</div>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button onClick={handleSendMessage} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatSection;
