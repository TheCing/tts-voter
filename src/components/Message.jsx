import React, { useEffect, useState } from "react";
import { hasUserVotedForMessage } from "../firebase";

const Message = ({
  message,
  votes = {},
  standalone = false,
  onVote,
  currentUserId,
}) => {
  const { displayName, content, timestamp, type, id, bits } = message;
  const [hasVoted, setHasVoted] = useState(false);

  // Only use the votes object for the count, not the message's voteCount
  const currentVoteCount =
    type === "vote" && content && votes[content] ? votes[content] : 0;

  // Check if the current user has already voted for this message
  useEffect(() => {
    if (type === "vote" && content && currentUserId) {
      hasUserVotedForMessage(content, currentUserId)
        .then((voted) => {
          setHasVoted(voted);
        })
        .catch((error) => {
          console.error("Error checking vote status:", error);
        });
    }
  }, [content, currentUserId, type, votes]);

  // Debug log for vote count issues
  useEffect(() => {
    if (type === "vote" && content) {
      console.log(`Message "${content.substring(0, 30)}...":`, {
        votesFromFirebase: votes[content] || 0,
        messageVoteCount: message.voteCount || 0,
        displayedCount: currentVoteCount,
        userHasVoted: hasVoted,
      });
    }
  }, [content, votes, type, message.voteCount, currentVoteCount, hasVoted]);

  // Classes for standalone mode
  const containerClasses = standalone
    ? "message component-module standalone-component"
    : "message component-module";

  const handleVote = () => {
    if (onVote && type === "vote" && !hasVoted) {
      onVote(id, content);
      // Optimistically update the local state
      setHasVoted(true);
    }
  };

  // Determine vote button classes based on whether user has voted
  const voteButtonClasses = `vote-button ${hasVoted ? "voted" : ""}`;
  const voteTextContent = hasVoted ? "Voted" : "Vote +1";

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
          <div className={`vote-container ${hasVoted ? "voted" : ""}`}>
            <button
              className={voteButtonClasses}
              onClick={handleVote}
              aria-label="Upvote message"
              disabled={hasVoted}
            >
              ▲
            </button>
            <span className="vote-count">{currentVoteCount}</span>
            <span className="vote-text">{voteTextContent}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
