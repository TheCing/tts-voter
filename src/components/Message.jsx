import React, { useEffect } from "react";

const Message = ({ message, votes = {}, standalone = false, onVote }) => {
  const { displayName, content, timestamp, type, id, bits } = message;

  // Only use the votes object for the count, not the message's voteCount
  const currentVoteCount =
    type === "vote" && content && votes[content] ? votes[content] : 0;

  // Debug log for vote count issues
  useEffect(() => {
    if (type === "vote" && content) {
      console.log(`Message "${content.substring(0, 30)}...":`, {
        votesFromFirebase: votes[content] || 0,
        messageVoteCount: message.voteCount || 0,
        displayedCount: currentVoteCount,
      });
    }
  }, [content, votes, type, message.voteCount, currentVoteCount]);

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
          <div className="message-header-left">
            <span className="username">{displayName}:</span>
            {bits && <span className="bits-badge">{bits} bits</span>}
          </div>
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
            <span className="vote-count">{currentVoteCount}</span>
            <span className="vote-text">Vote +1</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
