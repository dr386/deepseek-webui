import React from "react";
import { Send } from "lucide-react";

const InputBar = ({
  input,
  setInput,
  onSend,
  placeholder = "Type a message...",
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSend();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <div className="border-t border-gray-200 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-center">
          <input
            type="text"
            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
          />
          <button
            onClick={onSend}
            className="absolute right-2 p-2 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputBar;
