import React from "react";

const Settings = ({
  showNamecards,
  setShowNamecards,
  transparency,
  setTransparency,
  showDebug,
  setShowDebug,
  standalone = false,
}) => {
  // Classes for standalone mode
  const containerClasses = standalone
    ? "settings component-module standalone-component settings-standalone"
    : "settings component-module";

  return (
    <div className={containerClasses}>
      <div className="namecard">Settings</div>
      <div className="component-content">
        <div className="toggle-switch-container">
          <span className="toggle-switch-label">Show Namecards</span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={showNamecards}
              onChange={() => setShowNamecards(!showNamecards)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="toggle-switch-container">
          <span className="toggle-switch-label">Transparency</span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={transparency}
              onChange={() => setTransparency(!transparency)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="toggle-switch-container">
          <span className="toggle-switch-label">Show Debug Panel</span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={showDebug}
              onChange={() => setShowDebug(!showDebug)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;
