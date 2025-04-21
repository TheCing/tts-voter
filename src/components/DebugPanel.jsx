import React, { useEffect, useRef } from "react";

const DebugPanel = ({ debug, standalone = false }) => {
  const debugEndRef = useRef(null);

  // Auto-scroll to the bottom when new debug messages arrive
  useEffect(() => {
    if (debugEndRef.current) {
      debugEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [debug]);

  // Classes for standalone mode
  const containerClasses = standalone
    ? "debug-panel component-module standalone-component debug-standalone"
    : "debug-panel component-module";

  return (
    <div className={containerClasses}>
      <div className="namecard">Debug</div>
      <div className="component-content">
        <div className="debug-header">
          <h3>Debug Info</h3>
          <div>
            <span className="debug-count">{debug.length} messages</span>
          </div>
        </div>
        <div className="debug-content">
          {debug.length === 0 ? (
            <div className="debug-empty">No debug information available</div>
          ) : (
            debug.map((item, index) => (
              <div key={index} className="debug-item">
                <span className="debug-time">
                  {new Date(item.time).toLocaleTimeString()}
                </span>
                <span className="debug-message">{item.message}</span>
              </div>
            ))
          )}
          <div ref={debugEndRef} />
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;
