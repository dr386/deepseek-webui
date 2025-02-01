import { useState, useRef, useEffect } from "react";

const escapeHtml = (text) => {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

const parseMessageText = (text) => {
  // Replace ``` with <pre> or </pre>
  let formattedText = text.split(/```/).map((part, index) => {
    if (index % 2 === 1) {
      return `<pre>${escapeHtml(part)}</pre>`;
    }
    return escapeHtml(part);
  }).join('');

  // Replace `text` with <code>escaped text</code>
  formattedText = formattedText.replace(/`([^`]+)`/g, (_, code) => `<code>${escapeHtml(code)}</code>`);

  // Replace #### with <h4>
  formattedText = formattedText.replace(/#### (.*?)(\n|$)/g, "<h4>$1</h4>");
  
  // Replace ### with <h3>
  formattedText = formattedText.replace(/### (.*?)(\n|$)/g, "<h3>$1</h3>");
  
  // Replace ## with <h2>
  formattedText = formattedText.replace(/## (.*?)(\n|$)/g, "<h2>$1</h2>");
  
  // Replace **text** with <strong>text</strong>
  formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  return formattedText;
};

import "./App.css";

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
      setMessages((prevMessages) => [...prevMessages, { text: "", sender: "bot" }]);

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
    <div className="deepseek" style={{ maxWidth: "600px", margin: "auto", padding: "0px" }}>
      <h2>DeepSeek WebUI (Ollama + Deepseek R1)</h2>
      <div
        className="message"
        style={{
          height: "auto",
          maxHeight: "70svh",
          minHeight: "50svh",
          overflowY: "auto",
          border: "0",
          padding: "20px",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === "user" ? "left" : "left" }}>
            <div
              className="answer"
              style={{
                backgroundColor: msg.sender === "user" ? "#574964" : "#16404D",
                display: "inline-block",
                padding: "12px 18px",
                borderRadius: "8px",
                color: "white",
              }}
              dangerouslySetInnerHTML={{ __html: parseMessageText(msg.text) }}
            ></div>
          </div>
        ))}
        {loading && <p className="blink">Thinking...</p>}
        <div ref={messagesEndRef} />
      </div>
      <input
        type="text"
        className="deepseek__input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type a message..."
        style={{ width: "80%", padding: "20px", marginTop: "10px" }}
      />
      <button onClick={sendMessage} className="deepseek__button" style={{ padding: "10px", marginLeft: "10px", backgroundColor: "#574964" }}>
        Send
      </button>
    </div>
  );
}

export default App;
