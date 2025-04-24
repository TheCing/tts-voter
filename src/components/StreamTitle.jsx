import React, { useState, useEffect } from "react";

const StreamTitle = ({ channelName, standalone = false }) => {
  const [streamTitle, setStreamTitle] = useState("Loading stream info...");
  const [streamStatus, setStreamStatus] = useState("offline");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStreamInfo = async () => {
      // Check if Twitch credentials are available
      if (
        !import.meta.env.VITE_TWITCH_CLIENT_ID ||
        !import.meta.env.VITE_TWITCH_ACCESS_TOKEN
      ) {
        console.warn(
          "Twitch API credentials not found in environment variables"
        );
        setStreamTitle(`Stream title unavailable - API credentials missing`);
        setError("missing-credentials");
        return;
      }

      try {
        const response = await fetch(
          `https://api.twitch.tv/helix/streams?user_login=${channelName}`,
          {
            headers: {
              "Client-ID": import.meta.env.VITE_TWITCH_CLIENT_ID,
              Authorization: `Bearer ${
                import.meta.env.VITE_TWITCH_ACCESS_TOKEN
              }`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `HTTP error ${response.status}: ${response.statusText}`
          );
        }

        const data = await response.json();

        if (data.data && data.data.length > 0) {
          setStreamTitle(data.data[0].title);
          setStreamStatus("live");
          setError(null);
        } else {
          setStreamTitle(`${channelName} is currently offline`);
          setStreamStatus("offline");
          setError(null);
        }
      } catch (error) {
        console.error("Error fetching stream info:", error);
        setStreamTitle(`Currently watching: ${channelName}`);
        setError("api-error");
      }
    };

    if (channelName) {
      fetchStreamInfo();
      // Refresh stream info every 5 minutes
      const interval = setInterval(fetchStreamInfo, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [channelName]);

  // Classes for standalone mode
  const containerClasses = standalone
    ? "stream-title component-module standalone-component header-standalone"
    : "stream-title component-module";

  return (
    <header className={containerClasses}>
      <div className="namecard">Today's Stream</div>
      <div className="component-content stream-title-content">
        {error === null && (
          <div className={`stream-status ${streamStatus}`}>
            {streamStatus === "live" ? "LIVE" : "OFFLINE"}
          </div>
        )}
        <h2 className="stream-title-text">{streamTitle}</h2>
        {error && (
          <div className="stream-title-note">
            {error === "missing-credentials"
              ? "Add Twitch API credentials to .env to show stream title"
              : "Unable to fetch stream info - check API credentials"}
          </div>
        )}
      </div>
    </header>
  );
};

export default StreamTitle;
