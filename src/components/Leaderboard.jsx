/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import config from "../config.json";
import { hasUserVotedForMessage } from "../firebase";

const Leaderboard = ({
  votes,
  messages,
  standalone = false,
  onVote,
  dateKey,
  currentUserId,
}) => {
  // Use leaderboardSize from config instead of hardcoded value
  const leaderboardSize = config.leaderboardSize || 10;

  // Track which messages the user has voted for
  const [userVotes, setUserVotes] = useState({});

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

  // Get top N messages by vote count
  const topMessages = messages
    .filter((message) => {
      // Only include vote type messages
      if (message.type !== "vote") return false;

      // Filter by date if a dateKey is provided
      if (dateKey && message.dateKey) {
        return message.dateKey === dateKey;
      }
      return true;
    })
    .map((message) => {
      // Get the actual vote count from the votes object
      const voteCount =
        message.content && votes[message.content] ? votes[message.content] : 0;
      return { ...message, voteCount };
    })
    .sort((a, b) => b.voteCount - a.voteCount)
    .slice(0, leaderboardSize);

  // Check which messages the user has voted for
  useEffect(() => {
    if (currentUserId && topMessages.length > 0) {
      // Create a temporary object to store vote status
      const voteStatus = {};

      // Create a promise for each message to check
      const checkPromises = topMessages.map((message) => {
        return hasUserVotedForMessage(message.content, currentUserId)
          .then((hasVoted) => {
            voteStatus[message.id] = hasVoted;
          })
          .catch((error) => {
            console.error(
              `Error checking vote for message ${message.id}:`,
              error
            );
            voteStatus[message.id] = false;
          });
      });

      // When all promises resolve, update the state
      Promise.all(checkPromises).then(() => {
        setUserVotes(voteStatus);
      });
    }
  }, [topMessages, currentUserId]);

  const handleVote = (messageId, content) => {
    if (!userVotes[messageId] && onVote) {
      onVote(messageId, content);
      // Optimistically update the vote status
      setUserVotes((prev) => ({
        ...prev,
        [messageId]: true,
      }));
    }
  };

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
            {topMessages.map((message, index) => {
              const hasVoted = userVotes[message.id] || false;
              const voteButtonClasses = `vote-button ${
                hasVoted ? "voted" : ""
              }`;
              const voteTextContent = hasVoted ? "Voted" : "Vote +1";

              return (
                <div key={message.id} className="leaderboard-item">
                  <div className="leaderboard-item-header">
                    <div className="leaderboard-rank">{index + 1}</div>
                    <div
                      className={`leaderboard-votes ${hasVoted ? "voted" : ""}`}
                    >
                      <button
                        className={voteButtonClasses}
                        onClick={() => handleVote(message.id, message.content)}
                        aria-label="Upvote message"
                        disabled={hasVoted}
                      >
                        ▲
                      </button>
                      <span className="vote-count">{message.voteCount}</span>
                      <span className="vote-text">{voteTextContent}</span>
                    </div>
                  </div>

                  <div className="leaderboard-message">
                    <div
                      className="leaderboard-content"
                      title={message.content}
                    >
                      {message.content}
                    </div>
                    <div className="leaderboard-details">
                      <span className="leaderboard-user">
                        {message.displayName}
                      </span>
                      {message.bits && (
                        <span className="bits-badge">{message.bits} bits</span>
                      )}
                      <span className="leaderboard-timestamp">
                        {message.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="leaderboard-empty">
            <p>
              {dateKey && dateKey !== new Date().toISOString().split("T")[0]
                ? `No votes for this date`
                : "No votes yet! Use the upvote button on messages to see them appear here."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
