// Firebase configuration
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  onValue,
  set,
  update,
  increment,
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

// Log if any required environment variables are missing
if (!firebaseConfig.apiKey || !firebaseConfig.databaseURL) {
  console.error(
    "Firebase environment variables are missing. Please check your .env file."
  );
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Helper functions for leaderboard operations
export const getVotesRef = () => ref(database, "votes");
export const getMessagesRef = () => ref(database, "messages");

export const incrementVote = (content) => {
  const contentKey = encodeURIComponent(content).replace(/\./g, "%2E");
  const voteRef = ref(database, `votes/${contentKey}`);
  return update(voteRef, { count: increment(1) });
};

export const addMessage = (message) => {
  const messagesRef = ref(database, `messages/${message.id}`);
  return set(messagesRef, message);
};

export const setupVotesListener = (callback) => {
  const votesRef = getVotesRef();
  return onValue(votesRef, (snapshot) => {
    const data = snapshot.val() || {};
    const votes = {};

    // Transform the firebase data format back to our app's format
    Object.entries(data).forEach(([key, value]) => {
      const decodedKey = decodeURIComponent(key);
      votes[decodedKey] = value.count || 0;
    });

    callback(votes);
  });
};

export const setupMessagesListener = (callback) => {
  const messagesRef = getMessagesRef();
  return onValue(messagesRef, (snapshot) => {
    const data = snapshot.val() || {};
    // Transform from object to array
    const messages = Object.values(data);
    callback(messages);
  });
};

export default database;
