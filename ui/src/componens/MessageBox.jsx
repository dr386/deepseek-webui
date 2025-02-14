import React from "react";
import MessageItem from "./MessageItem";

const LoadingIndicator = () => (
  <div className="flex items-center space-x-2 text-gray-500">
    <div
      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
      style={{ animationDelay: "0ms" }}
    />
    <div
      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
      style={{ animationDelay: "150ms" }}
    />
    <div
      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
      style={{ animationDelay: "300ms" }}
    />
  </div>
);

const MessageBox = ({ messages, loading, messagesEndRef }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {messages.map((message, index) => (
        <MessageItem key={index} message={message} />
      ))}

      {loading && <LoadingIndicator />}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageBox;
