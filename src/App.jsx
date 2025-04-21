import { useState, useEffect } from "react";
import Header from "./components/Header";
import ConfigPanel from "./components/ConfigPanel";
import ConnectionStatus from "./components/ConnectionStatus";
import MessageBoard from "./components/MessageBoard";
import Settings from "./components/Settings";
import DebugPanel from "./components/DebugPanel";
import useTwitchChat from "./hooks/useTwitchChat";
import "./styles/App.css";

function App() {
  const {
    channel,
    setChannel,
    trackingMode,
    setTrackingMode,
    username,
    setUsername,
    connected,
    messages,
    debug,
    connectToChat,
    disconnectFromChat,
    clearBoard,
    upvoteMessage,
  } = useTwitchChat();

  // Settings state
  const [showNamecards, setShowNamecards] = useState(true);
  const [transparency, setTransparency] = useState(false);
  const [showDebug, setShowDebug] = useState(import.meta.env.DEV);

  // Check if the component should be rendered in standalone mode for OBS
  const [componentToShow, setComponentToShow] = useState("all");

  useEffect(() => {
    // Check URL parameters for standalone mode
    const params = new URLSearchParams(window.location.search);
    const component = params.get("component");

    if (
      component &&
      [
        "header",
        "config",
        "status",
        "messages",
        "left",
        "settings",
        "debug",
      ].includes(component)
    ) {
      setComponentToShow(component);
      // Set transparent background for standalone mode
      document.body.style.background = "transparent";
      document.documentElement.style.height = "100%";
      document.body.style.height = "100%";
      document.getElementById("root").style.height = "100%";
      document.getElementById("root").style.padding = "0";
    }

    // Check debug parameter
    const debugParam = params.get("debug");
    if (import.meta.env.DEV) {
      if (debugParam === "true") {
        setShowDebug(true);
      } else if (debugParam === "false") {
        setShowDebug(false);
      }
    } else {
      // Force debug off in production
      setShowDebug(false);
    }
  }, []);

  // Apply settings
  useEffect(() => {
    // Handle namecard visibility
    const namecards = document.querySelectorAll(".namecard");
    namecards.forEach((card) => {
      card.style.display = showNamecards ? "block" : "none";
    });

    // Handle transparency
    if (transparency) {
      document.body.style.background = "transparent";
      const components = document.querySelectorAll(".component-module");
      components.forEach((component) => {
        component.style.backgroundColor = "rgba(14, 14, 16, 0.7)";
      });
    } else {
      if (componentToShow === "all") {
        document.body.style.background = "var(--dark)";
      }
      const components = document.querySelectorAll(".component-module");
      components.forEach((component) => {
        component.style.backgroundColor = "rgba(14, 14, 16, 0.9)";
      });
    }
  }, [showNamecards, transparency, componentToShow]);

  // Render specific component for OBS browser source
  if (componentToShow === "header") {
    return <Header standalone={true} />;
  }

  if (componentToShow === "config") {
    return (
      <ConfigPanel
        channel={channel}
        setChannel={setChannel}
        trackingMode={trackingMode}
        setTrackingMode={setTrackingMode}
        username={username}
        setUsername={setUsername}
        connected={connected}
        onConnect={connectToChat}
        onDisconnect={disconnectFromChat}
        onClear={clearBoard}
        standalone={true}
      />
    );
  }

  if (componentToShow === "settings") {
    return (
      <Settings
        showNamecards={showNamecards}
        setShowNamecards={setShowNamecards}
        transparency={transparency}
        setTransparency={setTransparency}
        showDebug={showDebug}
        setShowDebug={setShowDebug}
        standalone={true}
      />
    );
  }

  if (componentToShow === "status") {
    return (
      <ConnectionStatus
        connected={connected}
        channelName={channel}
        standalone={true}
      />
    );
  }

  if (componentToShow === "messages") {
    return (
      <MessageBoard
        messages={messages}
        standalone={true}
        onVote={upvoteMessage}
      />
    );
  }

  if (componentToShow === "debug") {
    // Only show debug panel in development mode
    return import.meta.env.DEV ? (
      <DebugPanel debug={debug} standalone={true} />
    ) : (
      <div className="component-module">Debug not available in production</div>
    );
  }

  // Left column combined for OBS
  if (componentToShow === "left") {
    return (
      <div
        className="left-column"
        style={{
          height: "100%",
          maxHeight: "100vh",
          overflowY: "auto",
          padding: "10px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <Header standalone={true} />
        <ConfigPanel
          channel={channel}
          setChannel={setChannel}
          trackingMode={trackingMode}
          setTrackingMode={setTrackingMode}
          username={username}
          setUsername={setUsername}
          connected={connected}
          onConnect={connectToChat}
          onDisconnect={disconnectFromChat}
          onClear={clearBoard}
          standalone={true}
        />
        <Settings
          showNamecards={showNamecards}
          setShowNamecards={setShowNamecards}
          transparency={transparency}
          setTransparency={setTransparency}
          showDebug={showDebug}
          setShowDebug={setShowDebug}
          standalone={true}
        />
        <ConnectionStatus
          connected={connected}
          channelName={channel}
          standalone={true}
        />
        {showDebug && import.meta.env.DEV && (
          <DebugPanel debug={debug} standalone={true} />
        )}
        <div style={{ height: "20px" }}></div> {/* Spacer at bottom */}
      </div>
    );
  }

  // Render the 50-50 split layout for normal use
  return (
    <div className="container">
      <div className="left-column">
        <Header />
        <ConfigPanel
          channel={channel}
          setChannel={setChannel}
          trackingMode={trackingMode}
          setTrackingMode={setTrackingMode}
          username={username}
          setUsername={setUsername}
          connected={connected}
          onConnect={connectToChat}
          onDisconnect={disconnectFromChat}
          onClear={clearBoard}
        />
        <Settings
          showNamecards={showNamecards}
          setShowNamecards={setShowNamecards}
          transparency={transparency}
          setTransparency={setTransparency}
          showDebug={showDebug}
          setShowDebug={setShowDebug}
        />
        <ConnectionStatus connected={connected} channelName={channel} />
        {showDebug && import.meta.env.DEV && <DebugPanel debug={debug} />}
      </div>

      <div className="right-column">
        <MessageBoard messages={messages} onVote={upvoteMessage} />
      </div>
    </div>
  );
}

export default App;
