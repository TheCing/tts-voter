import React from "react";

const Leaderboard = ({ votes, messages, standalone = false, onVote }) => {
  // Sort messages by vote count, descending
  const sortedVotes = Object.entries(votes || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10); // Limit to top 10

  // Find message details for each vote
  const topMessages = sortedVotes
    .map(([content, count]) => {
      const message = messages.find(
        (msg) => msg.type === "vote" && msg.content === content
      );
      return message ? { ...message, voteCount: count } : null;
    })
    .filter(Boolean);

  // Classes for standalone mode
  const containerClasses = standalone
    ? "leaderboard component-module standalone-component"
    : "leaderboard component-module";

  return (
    <div className={containerClasses}>
      <div className="namecard">Leaderboard</div>
      <div className="leaderboard-content">
        {topMessages.length > 0 ? (
          <div className="leaderboard-items">
            {topMessages.map((message, index) => (
              <div key={message.id} className="leaderboard-item">
                <div className="leaderboard-rank">{index + 1}</div>
                <div className="leaderboard-message">
                  <div className="leaderboard-content">{message.content}</div>
                  <div className="leaderboard-details">
                    <span className="leaderboard-user">
                      {message.displayName}
                    </span>
                  </div>
                </div>
                <div className="leaderboard-votes">
                  <button
                    className="vote-button"
                    onClick={() =>
                      onVote && onVote(message.id, message.content)
                    }
                    aria-label="Upvote message"
                  >
                    ▲
                  </button>
                  <span className="vote-count">{message.voteCount}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="leaderboard-empty">
            <p>
              No votes yet! Use the upvote button on messages to see them appear
              here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
