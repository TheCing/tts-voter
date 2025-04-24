/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";

// Add dev mode check flag
const isDev = import.meta.env.DEV;

const MessageBoard = ({
  messages,
  votes,
  onVote,
  onResetVote,
  standalone = false,
  dateKey,
}) => {
  const messagesEndRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showTestControls, setShowTestControls] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, autoScroll]);

  // Handle scroll events
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // If user scrolls up more than 100px, disable auto-scroll
    if (scrollHeight - scrollTop - clientHeight > 100) {
      setAutoScroll(false);
    } else {
      setAutoScroll(true);
    }
  };

  // Filter messages by date if dateKey is provided
  const filteredMessages = dateKey
    ? messages.filter((message) => {
        // Check if we have a timestamp that can be parsed
        if (!message.timestamp) return false;

        try {
          // First try to use dateKey from message (added by firebase)
          if (message.dateKey) {
            return message.dateKey === dateKey;
          }

          // Try to parse timestamp (could be a date string or locale time string)
          const messageDate = new Date(message.timestamp);

          // Check if valid date before using toISOString
          if (isNaN(messageDate.getTime())) {
            return false;
          }

          const messageDateKey = messageDate.toISOString().split("T")[0];
          return messageDateKey === dateKey;
        } catch {
          console.log("Error parsing message timestamp:", message);
          return false;
        }
      })
    : messages;

  const containerClasses = standalone
    ? "messageboard component-module standalone-component messageboard-standalone"
    : "messageboard component-module messages-container";

  // Generate a sample test message for each type (for testing purposes)
  const createTestMessages = () => {
    // Create sample objects that match the structure in useTwitchChat.js
    // This is just for testing the UI and filter functionality
    console.log("Creating test messages for UI development");

    // These won't be saved to Firebase - they're temporary for the current session
    const sampleMessages = [
      {
        id: Date.now() + 1,
        displayName: "TestUser1",
        content: "This is a regular chat message",
        timestamp: new Date().toLocaleTimeString(),
        type: "message",
        username: "testuser1",
      },
      {
        id: Date.now() + 2,
        displayName: "TestUser2",
        content: "This is a votable message from a cheer",
        timestamp: new Date().toLocaleTimeString(),
        type: "vote",
        voteCount: 5,
        bits: 100,
        username: "testuser2",
      },
    ];

    // Add to messages array (this would typically happen via Firebase in production)
    // For testing, we're just console logging what would happen
    console.log("Sample test messages created:", sampleMessages);
    alert(
      "Sample test messages would be created here. In production, this would interact with Firebase."
    );
  };

  return (
    <div className={containerClasses}>
      <div className="namecard">Messages</div>
      <div
        className="messages-content messageboard-content"
        onScroll={handleScroll}
      >
        {filteredMessages.length > 0 ? (
          <>
            {filteredMessages.map((message) => (
              <Message
                key={message.id}
                message={message}
                votes={votes}
                onVote={onVote}
                onResetVote={onResetVote}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="messageboard-empty">
            <p>
              {dateKey && dateKey !== new Date().toISOString().split("T")[0]
                ? `No messages for this date`
                : "No messages yet! Connect to a Twitch channel to see messages appear here."}
            </p>
          </div>
        )}
      </div>
      <div className="messageboard-controls">
        <button
          className={`scroll-button ${autoScroll ? "active" : ""}`}
          onClick={() => setAutoScroll(!autoScroll)}
        >
          {autoScroll ? "Auto-scroll ON" : "Auto-scroll OFF"}
        </button>

        {isDev && !standalone && (
          <button
            className="test-button"
            onClick={() => setShowTestControls(!showTestControls)}
            title="Toggle test controls for development"
          >
            {showTestControls ? "Hide Test Controls" : "Show Test Controls"}
          </button>
        )}

        {isDev && showTestControls && !standalone && (
          <button
            className="generate-test-button"
            onClick={createTestMessages}
            title="Generate test messages (for development only)"
          >
            Generate Test Messages
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageBoard;
