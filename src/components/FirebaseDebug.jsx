import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";

const FirebaseDebug = () => {
  const [connectionStatus, setConnectionStatus] = useState("checking");
  const [envVars, setEnvVars] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check environment variables
    const vars = {
      databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "Not Set",
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "Not Set",
      hasApiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
      hasAppId: !!import.meta.env.VITE_FIREBASE_APP_ID,
    };
    setEnvVars(vars);

    // Check Firebase connection
    try {
      const db = getDatabase();
      const connectedRef = ref(db, ".info/connected");

      const unsubscribe = onValue(
        connectedRef,
        (snap) => {
          if (snap.val() === true) {
            setConnectionStatus("connected");
            setError(null);
          } else {
            setConnectionStatus("disconnected");
          }
        },
        (err) => {
          console.error("Firebase connection error:", err);
          setConnectionStatus("error");
          setError(err.message);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error("Firebase initialization error:", err);
      setConnectionStatus("initialization-failed");
      setError(err.message);
      return () => {};
    }
  }, []);

  return (
    <div className="firebase-debug-panel">
      <h3>Firebase Connection Debug</h3>

      <div className="debug-section">
        <h4>Connection Status</h4>
        <div className={`status-indicator ${connectionStatus}`}>
          {connectionStatus === "checking" && "Checking connection..."}
          {connectionStatus === "connected" && "Connected to Firebase 🟢"}
          {connectionStatus === "disconnected" &&
            "Disconnected from Firebase 🟠"}
          {connectionStatus === "error" && "Connection Error 🔴"}
          {connectionStatus === "initialization-failed" &&
            "Failed to initialize Firebase 🔴"}
        </div>
        {error && <div className="error-message">Error: {error}</div>}
      </div>

      <div className="debug-section">
        <h4>Environment Variables</h4>
        <table className="env-vars-table">
          <tbody>
            <tr>
              <td>Database URL:</td>
              <td>{envVars.databaseURL}</td>
            </tr>
            <tr>
              <td>Project ID:</td>
              <td>{envVars.projectId}</td>
            </tr>
            <tr>
              <td>API Key:</td>
              <td>{envVars.hasApiKey ? "✓ Set" : "✗ Missing"}</td>
            </tr>
            <tr>
              <td>App ID:</td>
              <td>{envVars.hasAppId ? "✓ Set" : "✗ Missing"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="debug-section">
        <h4>Troubleshooting</h4>
        <ul className="troubleshooting-tips">
          <li>
            Make sure .env or .env.local file exists with Firebase credentials
          </li>
          <li>Restart the development server after changing env files</li>
          <li>
            Check Firebase console for database rules (they might be blocking
            access)
          </li>
          <li>
            Try clearing your browser cache or trying a private/incognito window
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FirebaseDebug;
