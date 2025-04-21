import React from "react";

const ConnectionStatus = ({ connected, channelName, standalone = false }) => {
  // Base status class
  const baseStatusClass = connected
    ? "status connected"
    : "status disconnected";

  // Add modular class for standalone mode
  const containerClasses = standalone
    ? `${baseStatusClass} component-module standalone-component status-standalone`
    : `${baseStatusClass} component-module`;

  const statusText = connected ? `Connected to ${channelName}` : "Disconnected";

  return (
    <div className={containerClasses}>
      <div className="namecard">Status</div>
      <div className="component-content">
        <div>
          <span className="status-indicator"></span>
          {statusText}
        </div>
      </div>
    </div>
  );
};

export default ConnectionStatus;
