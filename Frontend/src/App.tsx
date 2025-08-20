import React from "react";
import ChatSection from "./components/ChatSection";
import "./styles/chat.css";

const App: React.FC = () => {
  return (
    <div className="app">
      <h1 className="title">Orchestro AI Chat</h1>
      <ChatSection />
    </div>
  );
};

export default App;
