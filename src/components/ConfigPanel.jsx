import React, { useEffect } from "react";

const ConfigPanel = ({
  channel,
  setChannel,
  trackingMode,
  setTrackingMode,
  username,
  setUsername,
  connected,
  onConnect,
  onDisconnect,
  onClear,
  standalone = false,
}) => {
  // Show/hide username input based on tracking mode
  useEffect(() => {
    const userInputGroup = document.getElementById("user-input-group");
    if (userInputGroup) {
      userInputGroup.style.display = trackingMode === "user" ? "block" : "none";
    }
  }, [trackingMode]);

  const handleConnect = () => {
    if (connected) {
      onDisconnect();
    } else {
      onConnect();
    }
  };

  // Classes for standalone mode
  const containerClasses = standalone
    ? "config-panel component-module standalone-component config-standalone"
    : "config-panel component-module";

  return (
    <div className={containerClasses}>
      <div className="namecard">Configuration</div>
      <div className="component-content">
        <div className="form-group">
          <label htmlFor="channel">Channel Name:</label>
          <input
            type="text"
            id="channel"
            placeholder="Enter Twitch channel name (without @)"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            disabled={connected}
          />
        </div>

        <div className="form-group">
          <label htmlFor="tracking-mode">Tracking Mode:</label>
          <select
            id="tracking-mode"
            value={trackingMode}
            onChange={(e) => setTrackingMode(e.target.value)}
            disabled={connected}
          >
            <option value="user">Track Specific User</option>
            <option value="cheer">Track Cheers (300+ Bits)</option>
          </select>
        </div>

        <div className="form-group" id="user-input-group">
          <label htmlFor="username">Username to Track:</label>
          <input
            type="text"
            id="username"
            placeholder="Enter username to track"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={connected}
          />
        </div>

        <div className="button-group">
          <button id="connect-btn" onClick={handleConnect}>
            {connected ? "Disconnect" : "Connect to Chat"}
          </button>
          <button id="clear-btn" onClick={onClear}>
            Clear Board
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigPanel;
