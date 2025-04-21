import React from "react";

const Message = ({ message, standalone = false, onVote }) => {
  const { displayName, content, timestamp, type, voteCount, id } = message;

  // Classes for standalone mode
  const containerClasses = standalone
    ? "message component-module standalone-component"
    : "message component-module";

  const handleVote = () => {
    if (onVote && type === "vote") {
      onVote(id, content);
    }
  };

  return (
    <div className={containerClasses}>
      <div className="message-content-container">
        <div className="message-header">
          <span className="username">{displayName}:</span>
          <span className="timestamp">{timestamp}</span>
        </div>
        <div className="message-body">
          <span className="content">{content}</span>
        </div>
        {type === "vote" && (
          <div className="vote-container">
            <button
              className="vote-button"
              onClick={handleVote}
              aria-label="Upvote message"
            >
              ▲
            </button>
            <span className="vote-count">{voteCount}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
