import "./App.css";

import { useState, useRef, useEffect } from "react";
import Header from "./componens/Header";
import InputBar from "./componens/InputBar";
import MessageBox from "./componens/MessageBox";

const escapeHtml = (text) => {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Create a copy of messages for updating state properly
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages, { text: input, sender: "user" }];
      return newMessages;
    });

    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botMessage = "";

      // Add empty bot response first
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "", sender: "bot" },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        botMessage += decoder.decode(value, { stream: true });

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = {
            text: botMessage,
            sender: "bot",
          };
          return updatedMessages;
        });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />

      <div className="flex-1 overflow-hidden">
        <div className="max-w-3xl h-full mx-auto flex flex-col">

          <MessageBox
            messages={messages}
            loading={loading}
            messagesEndRef={messagesEndRef}
          />

          <InputBar
            input={input}
            setInput={setInput}
            onSend={sendMessage}
            placeholder="Type your message..."
          />

        </div>
      </div>
    </div>
  );
}

export default App;
