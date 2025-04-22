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

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyPlaceholder",
  authDomain: "tts-voter.firebaseapp.com",
  databaseURL: "https://tts-voter-default-rtdb.firebaseio.com",
  projectId: "tts-voter",
  storageBucket: "tts-voter.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnopqrstuv",
  measurementId: "G-ABCDEFGHIJ",
};

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
