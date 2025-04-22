/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import config from "../config.json";

const Leaderboard = ({ votes, messages, standalone = false, onVote }) => {
  // Use leaderboardSize from config instead of hardcoded value
  const leaderboardSize = config.leaderboardSize || 10;

  // Load saved votes from localStorage on component mount
  useEffect(() => {
    try {
      const savedVotes = localStorage.getItem("ttsVoterLeaderboard");
      if (
        savedVotes &&
        Object.keys(JSON.parse(savedVotes)).length > 0 &&
        Object.keys(votes).length === 0
      ) {
        // Only load saved votes if current votes are empty
        // Note: actual loading is handled in useTwitchChat.js
      }
    } catch (error) {
      console.error("Error loading saved leaderboard data:", error);
    }
  }, []);

  // Save votes to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(votes).length > 0) {
      try {
        localStorage.setItem("ttsVoterLeaderboard", JSON.stringify(votes));
      } catch (error) {
        console.error("Error saving leaderboard data:", error);
      }
    }
  }, [votes]);

  // Sort messages by vote count, descending
  const sortedVotes = Object.entries(votes || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, leaderboardSize);

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
                <div className="leaderboard-item-header">
                  <div className="leaderboard-rank">{index + 1}</div>
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

                <div className="leaderboard-message">
                  <div className="leaderboard-content" title={message.content}>
                    {message.content}
                  </div>
                  <div className="leaderboard-details">
                    <span className="leaderboard-user">
                      {message.displayName}
                    </span>
                    <span className="leaderboard-timestamp">
                      {message.timestamp}
                    </span>
                  </div>
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
