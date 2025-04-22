/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback, useRef } from "react";
import tmi from "tmi.js";
import config from "../config.json";
import { 
  setupVotesListener, 
  setupMessagesListener, 
  incrementVote, 
  addMessage 
} from "../firebase";

const useTwitchChat = () => {
  const [channel, setChannel] = useState(config.channel || "twitchdev");
  const [trackingMode, setTrackingMode] = useState(
    config.trackingMode || "cheer"
  );
  const [username, setUsername] = useState(
    config.defaultUsername || "twitchdev"
  );
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [votes, setVotes] = useState({});
  const [client, setClient] = useState(null);
  const [debug, setDebug] = useState([]); // Debug log array
  const shouldAutoConnect = useRef(config.autoConnect);

  // Add message to debug log
  const addDebugMessage = useCallback((message) => {
    console.log(`[TwitchChat] ${message}`);
    setDebug((prev) => [
      ...prev,
      { time: new Date().toLocaleTimeString(), message },
    ]);
  }, []);

  // Setup Firebase listeners
  useEffect(() => {
    addDebugMessage("Setting up Firebase listeners");
    
    // Set up votes listener
    const unsubscribeVotes = setupVotesListener((updatedVotes) => {
      setVotes(updatedVotes);
      addDebugMessage(`Received ${Object.keys(updatedVotes).length} votes from Firebase`);
    });
    
    // Set up messages listener
    const unsubscribeMessages = setupMessagesListener((updatedMessages) => {
      if (updatedMessages.length > 0 && messages.length === 0) {
        setMessages(updatedMessages);
        addDebugMessage(`Received ${updatedMessages.length} messages from Firebase`);
      }
    });
    
    // Cleanup listeners on unmount
    return () => {
      unsubscribeVotes();
      unsubscribeMessages();
      addDebugMessage("Firebase listeners cleaned up");
    };
  }, []);

  // Check URL parameters for OBS browser source config
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // If channel parameter exists, set it
    const channelParam = params.get("channel");
    if (channelParam) {
      setChannel(channelParam);
      addDebugMessage(`Channel override from URL: ${channelParam}`);
    } else if (!channel) {
      // Fallback to config
      setChannel(config.channel);
      addDebugMessage(`Using config channel: ${config.channel}`);
    }

    // If tracking mode parameter exists, set it
    const trackingParam = params.get("tracking");
    if (trackingParam && ["user", "cheer"].includes(trackingParam)) {
      setTrackingMode(trackingParam);
      addDebugMessage(`Tracking mode override from URL: ${trackingParam}`);
    } else if (!trackingMode || trackingMode === "") {
      // Fallback to config
      setTrackingMode(config.trackingMode);
      addDebugMessage(`Using config tracking mode: ${config.trackingMode}`);
    }

    // If username parameter exists, set it
    const usernameParam = params.get("username");
    if (usernameParam) {
      setUsername(usernameParam);
      addDebugMessage(`Username override from URL: ${usernameParam}`);
    } else if (!username || username === "") {
      // Fallback to config
      setUsername(config.defaultUsername);
    }

    // Set auto-connect flag but don't connect yet
    const autoConnect = params.get("autoconnect");
    if (autoConnect === "true" && channelParam) {
      shouldAutoConnect.current = true;
    } else if (autoConnect === "false") {
      shouldAutoConnect.current = false;
    } else {
      // Fallback to config
      shouldAutoConnect.current = config.autoConnect;
      addDebugMessage(`Using config autoconnect: ${config.autoConnect}`);
    }
  }, [addDebugMessage, channel, trackingMode, username]);

  // Connect to Twitch chat
  const connectToChat = useCallback(() => {
    if (!channel) {
      alert("Please enter a channel name");
      return;
    }

    addDebugMessage(`Connecting to channel: ${channel}`);
    addDebugMessage(`Current tracking mode: ${trackingMode}`);

    // Create a new client with config settings
    const newClient = new tmi.Client({
      connection: {
        secure: true,
        reconnect: true,
      },
      channels: [channel],
    });

    // Connect to Twitch
    newClient
      .connect()
      .then(() => {
        setConnected(true);
        setClient(newClient);
        addDebugMessage("Successfully connected to Twitch chat");
      })
      .catch((err) => {
        console.error("Connection error:", err);
        addDebugMessage(`Connection error: ${err.message}`);
        setConnected(false);
      });
  }, [channel, trackingMode, addDebugMessage]);

  // Handle auto-connect after all functions are defined
  useEffect(() => {
    if (shouldAutoConnect.current && channel) {
      addDebugMessage(`Auto-connecting to channel: ${channel}`);
      // Delay the connection slightly to ensure state has updated
      setTimeout(() => {
        connectToChat();
        shouldAutoConnect.current = false; // Prevent connecting multiple times
      }, 500);
    }
  }, [channel, connectToChat, addDebugMessage]);

  // Disconnect from Twitch chat
  const disconnectFromChat = useCallback(() => {
    if (client) {
      addDebugMessage("Disconnecting from Twitch chat");
      client.disconnect();
      setClient(null);
      setConnected(false);
    }
  }, [client, addDebugMessage]);

  // Clear messages and votes - local only for now, we don't clear Firebase
  const clearBoard = useCallback(() => {
    addDebugMessage("Clearing local message board (Firebase data will remain)");
    setMessages([]);
  }, [addDebugMessage]);

  // Manually upvote a message
  const upvoteMessage = useCallback(
    (messageId, content) => {
      addDebugMessage(`Manual upvote for message id: ${messageId}`);

      // Update Firebase vote
      incrementVote(content)
        .then(() => {
          addDebugMessage(`Vote incremented in Firebase for: ${content}`);
        })
        .catch((error) => {
          console.error("Error incrementing vote:", error);
          addDebugMessage(`Error incrementing vote: ${error.message}`);
        });

      // Local message display is handled by Firebase listener
    },
    [addDebugMessage]
  );

  // Extract message content without cheer commands
  const extractMessageContent = (message, tags) => {
    // Attempt to remove cheer command patterns from the message
    let content = message;

    // Log the raw message for debugging
    addDebugMessage(`Raw message with cheer: "${message}"`);

    // If there's a custom cheer emote in the tags, we can get a cleaner message
    if (tags.emotes) {
      addDebugMessage(`Message has emotes: ${JSON.stringify(tags.emotes)}`);
    }

    // Remove common cheer patterns like "cheer100" from the message
    content = content.replace(/\bcheer\d+\b/gi, "").trim();

    // Remove additional cheer-related patterns
    content = content.replace(/\bcheer\b/gi, "").trim(); // Remove standalone "cheer"
    content = content.replace(/^\s*bits\s*/i, "").trim(); // Remove "bits" at start

    addDebugMessage(`Cleaned cheer message: "${content}"`);

    return content;
  };

  // Process incoming messages based on tracking mode
  useEffect(() => {
    if (!client) return;

    addDebugMessage(`Setting up message handler with mode: ${trackingMode}`);

    // Handle regular messages
    const handleMessage = (channelName, tags, message) => {
      // Log all messages when in cheer mode for debugging
      if (trackingMode === "cheer") {
        addDebugMessage(`Received message: "${message}"`);
        addDebugMessage(`Message tags: ${JSON.stringify(tags, null, 2)}`);
      }

      // Detailed logging of tags for all messages to understand the structure
      if (trackingMode === "cheer" && Object.keys(tags).length > 0) {
        console.log("Message tags:", tags);
      }

      // Check if we should process this message
      if (
        trackingMode === "user" &&
        tags.username.toLowerCase() === username.toLowerCase()
      ) {
        addDebugMessage(`User message matched: ${tags.username}`);
        
        // Create message object
        const newMessage = {
          id: Date.now(),
          username: tags.username,
          displayName: tags["display-name"] || tags.username,
          content: message,
          timestamp: new Date().toLocaleTimeString(),
          type: "message",
        };
        
        // Add to Firebase
        addMessage(newMessage)
          .then(() => {
            addDebugMessage(`Message saved to Firebase`);
          })
          .catch((error) => {
            console.error("Error saving message:", error);
            addDebugMessage(`Error saving message: ${error.message}`);
          });
      }
    };

    // Handle cheer/bits events specifically
    const handleCheer = (channelName, tags, message) => {
      if (trackingMode === "cheer") {
        addDebugMessage(`Cheer detected! Bits: ${tags.bits}`);
        addDebugMessage(`Cheer from: ${tags["display-name"] || tags.username}`);
        addDebugMessage(`Message content: ${message}`);

        // Check if the cheer meets the minimum threshold from config
        const minThreshold = config.votingThreshold || 0;
        if (minThreshold > 0 && tags.bits < minThreshold) {
          addDebugMessage(
            `Cheer below threshold (${tags.bits}/${minThreshold}), ignoring`
          );
          return;
        }

        // Process cheer message
        const voteContent = extractMessageContent(message, tags);

        if (!voteContent) {
          addDebugMessage(`Empty content after extraction, skipping`);
          return; // Skip empty content
        }

        // Increment vote in Firebase
        incrementVote(voteContent)
          .then(() => {
            addDebugMessage(`Vote incremented in Firebase for cheer: ${voteContent}`);
          })
          .catch((error) => {
            console.error("Error incrementing vote:", error);
            addDebugMessage(`Error incrementing vote: ${error.message}`);
          });

        // Create new vote message
        const newVoteMessage = {
          id: Date.now(),
          username: tags.username,
          displayName: tags["display-name"] || tags.username,
          content: voteContent,
          timestamp: new Date().toLocaleTimeString(),
          type: "vote",
          voteCount: 1, // Initial vote count, will be updated by Firebase
          bits: tags.bits,
        };
        
        // Add message to Firebase
        addMessage(newVoteMessage)
          .then(() => {
            addDebugMessage(`Vote message saved to Firebase`);
          })
          .catch((error) => {
            console.error("Error saving vote message:", error);
            addDebugMessage(`Error saving vote message: ${error.message}`);
          });
      }
    };

    // Register message handlers
    client.on("message", handleMessage);
    client.on("cheer", handleCheer); // Add dedicated cheer handler
    addDebugMessage("Message handlers registered");

    // Cleanup
    return () => {
      client.removeListener("message", handleMessage);
      client.removeListener("cheer", handleCheer); // Clean up cheer handler
      addDebugMessage("Message handlers removed");
    };
  }, [client, trackingMode, username, addDebugMessage]);

  return {
    channel,
    setChannel,
    trackingMode,
    setTrackingMode,
    username,
    setUsername,
    connected,
    messages,
    votes,
    debug, // Expose debug log
    connectToChat,
    disconnectFromChat,
    clearBoard,
    upvoteMessage,
    config, // Expose the config object
  };
};

export default useTwitchChat;
