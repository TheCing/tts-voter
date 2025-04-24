// Firebase configuration
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  onValue,
  set,
  update,
  increment,
  query,
  orderByChild,
  equalTo,
  push,
} from "firebase/database";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Log the Firebase configuration for debugging (excluding sensitive data)
console.log("Firebase config loaded:", {
  databaseURL: firebaseConfig.databaseURL,
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  hasApiKey: !!firebaseConfig.apiKey,
  hasAppId: !!firebaseConfig.appId,
});

// Log if any required environment variables are missing
if (!firebaseConfig.apiKey || !firebaseConfig.databaseURL) {
  console.error(
    "Firebase environment variables are missing. Please check your .env file."
  );
}

// Initialize Firebase
let app;
let database;
try {
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

// Helper functions for leaderboard operations
export const getVotesRef = () => ref(database, "votes");
export const getMessagesRef = () => ref(database, "messages");

// Format date for storage keys (YYYY-MM-DD)
export const formatDateKey = (date) => {
  return date.toISOString().split("T")[0];
};

// Get today's date key
export const getTodayDateKey = () => {
  return formatDateKey(new Date());
};

// Add timestamp and dateKey to message
const addTimestampToMessage = (message) => {
  const now = new Date();
  const dateObj = {
    ...message,
    createdAt: now.getTime(),
    dateKey: formatDateKey(now),
  };
  return dateObj;
};

export const incrementVote = (content) => {
  const contentKey = encodeURIComponent(content).replace(/\./g, "%2E");
  const voteRef = ref(database, `votes/${contentKey}`);
  return update(voteRef, {
    count: increment(1),
    lastUpdated: Date.now(),
    dateKey: formatDateKey(new Date()),
  }).catch((error) => {
    console.error("Error incrementing vote:", error);
    throw error;
  });
};

export const resetVote = (content) => {
  const contentKey = encodeURIComponent(content).replace(/\./g, "%2E");
  const voteRef = ref(database, `votes/${contentKey}`);
  return update(voteRef, {
    count: 0,
    lastUpdated: Date.now(),
  }).catch((error) => {
    console.error("Error resetting vote:", error);
    throw error;
  });
};

export const addMessage = (message) => {
  const messagesRef = ref(database, `messages`);
  // Add dateKey and timestamp to message
  const messageWithTimestamp = addTimestampToMessage(message);
  // Use push to generate a unique ID
  const newMessageRef = push(messagesRef);
  return set(newMessageRef, messageWithTimestamp).catch((error) => {
    console.error("Error adding message:", error);
    throw error;
  });
};

export const setupVotesListener = (callback, dateKey = null) => {
  const votesRef = getVotesRef();

  console.log(
    `Setting up votes listener${dateKey ? ` for date: ${dateKey}` : ""}`
  );

  return onValue(
    votesRef,
    (snapshot) => {
      const data = snapshot.val() || {};
      const votes = {};

      // Transform the firebase data format back to our app's format
      // Filter by dateKey if provided
      Object.entries(data).forEach(([key, value]) => {
        // Skip if we're filtering by date and this vote doesn't match
        if (dateKey && value.dateKey !== dateKey) {
          return;
        }

        const decodedKey = decodeURIComponent(key);
        votes[decodedKey] = value.count || 0;
      });

      console.log(
        `Votes listener received data: ${Object.keys(votes).length} votes found`
      );
      callback(votes);
    },
    (error) => {
      console.error("Error in votes listener:", error);
    }
  );
};

export const setupMessagesListener = (callback, dateKey = null) => {
  const messagesRef = getMessagesRef();

  // If dateKey is provided, query messages for that day
  let messagesQuery = messagesRef;

  if (dateKey) {
    console.log(`Querying messages for date: ${dateKey}`);
    messagesQuery = query(
      messagesRef,
      orderByChild("dateKey"),
      equalTo(dateKey)
    );
  }

  return onValue(
    messagesQuery,
    (snapshot) => {
      const data = snapshot.val() || {};
      // Transform from object to array
      const messages = Object.values(data);

      // If no dateKey filter was applied at query time, filter here
      const filteredMessages = dateKey
        ? messages
        : messages.filter((msg) => !dateKey || msg.dateKey === dateKey);

      console.log(
        `Messages listener received data: ${
          filteredMessages.length
        } messages found for ${dateKey || "all dates"}`
      );
      callback(filteredMessages);
    },
    (error) => {
      console.error("Error in messages listener:", error);
    }
  );
};

export default database;
