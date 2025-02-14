import React, { useMemo } from "react";
import Markdown from "markdown-to-jsx";

const ThinkContent = ({ children, isUser }) => (
  <span
    className={`
    inline-block
    text-sm
    px-1
    my-4
    rounded-md
    border-l-4
    font-normal
    bg-gray-100 border-gray-300 text-gray-600
    transition-colors
    duration-200
  `}
  >
    <div className="flex items-start gap-2">
      <span className="text-xs italic mt-1">{isUser ? "🤔" : "💭"}</span>
      <Markdown>{children}</Markdown>
    </div>
  </span>
);

const MessageItem = ({ message }) => {
  const isUser = message.sender === "user";

  const formattedContent = useMemo(() => {
    const text = message.text;
    const segments = [];
    let currentSegment = "";
    let isInThinkTag = false;
    let i = 0;

    while (i < text.length) {
      if (text.slice(i, i + 7) === "<think>") {
        if (currentSegment) {
          segments.push({ type: "normal", content: currentSegment });
          currentSegment = "";
        }
        isInThinkTag = true;
        i += 7;
        continue;
      }

      if (text.slice(i, i + 8) === "</think>") {
        if (currentSegment) {
          segments.push({ type: "think", content: currentSegment });
          currentSegment = "";
        }
        isInThinkTag = false;
        i += 8;
        continue;
      }

      currentSegment += text[i];
      i++;
    }

    if (currentSegment) {
      segments.push({
        type: isInThinkTag ? "think" : "normal",
        content: currentSegment,
      });
    }

    return segments;
  }, [message.text]);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-lg px-4 py-3 ${
          isUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
        }`}
      >
        <div className="prose">
          {formattedContent.map((segment, index) => (
            <span key={index}>
              {segment.type === "think" ? (
                <ThinkContent isUser={isUser}>{segment.content}</ThinkContent>
              ) : (
                <Markdown>
                  {segment.content}
                </Markdown>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
