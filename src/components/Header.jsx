import React from "react";

const Header = ({ standalone = false }) => {
  // Classes to apply for standalone mode in OBS
  const containerClasses = standalone
    ? "component-module standalone-component header-standalone"
    : "component-module";

  return (
    <header className={containerClasses}>
      <div className="namecard">Header</div>
      <div className="component-content">
        <h1>Twitch Chat Voting Board</h1>
      </div>
    </header>
  );
};

export default Header;
