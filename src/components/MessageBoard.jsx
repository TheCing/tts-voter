import React, { useEffect, useRef } from "react";
import Message from "./Message";

const MessageBoard = ({ messages, standalone = false, onVote }) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Classes for standalone mode
  const containerClasses = standalone
    ? "messages-container component-module standalone-component messageboard-standalone"
    : "messages-container component-module";

  return (
    <div className={containerClasses}>
      <div className="namecard">Messages</div>
      <div className="messages-content">
        {messages.map((message) => (
          <Message key={message.id} message={message} onVote={onVote} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageBoard;
