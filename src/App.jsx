import { useState, useEffect } from "react";
import DateHeader from "./components/DateHeader";
import MessageBoard from "./components/MessageBoard";
import Leaderboard from "./components/Leaderboard";
import StreamTitle from "./components/StreamTitle";
import FirebaseDebug from "./components/FirebaseDebug";
import Footer from "./components/Footer";
import useTwitchChat from "./hooks/useTwitchChat";
import { formatDateKey } from "./firebase";
import "./styles/App.css";

// Is development mode flag
const isDev = import.meta.env.DEV;

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const selectedDateKey = formatDateKey(selectedDate);
  const [showDebug, setShowDebug] = useState(false);

  const {
    messages,
    votes,
    upvoteMessage,
    resetVoteMessage,
    filterByDate,
    channel,
  } = useTwitchChat();

  // Handle date change from DateHeader
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    const newDateKey = formatDateKey(newDate);
    filterByDate(newDateKey);
  };

  // Settings state - simplified for viewer mode
  const [showNamecards, _setShowNamecards] = useState(true);
  const [transparency, _setTransparency] = useState(false);

  // Check if the component should be rendered in standalone mode for OBS
  const [componentToShow, setComponentToShow] = useState("all");

  useEffect(() => {
    // Check URL parameters for standalone mode
    const params = new URLSearchParams(window.location.search);
    const component = params.get("component");

    if (
      component &&
      ["date", "messages", "leaderboard", "stream-title"].includes(component)
    ) {
      setComponentToShow(component);
      // Set transparent background for standalone mode
      document.body.style.background = "transparent";
      document.documentElement.style.height = "100%";
      document.body.style.height = "100%";
      document.getElementById("root").style.height = "100%";
      document.getElementById("root").style.padding = "0";
    }

    // Check for date parameter
    const dateParam = params.get("date");
    if (dateParam) {
      try {
        const parsedDate = new Date(dateParam);
        if (!isNaN(parsedDate.getTime())) {
          setSelectedDate(parsedDate);
          filterByDate(formatDateKey(parsedDate));
        }
      } catch (error) {
        console.error("Invalid date parameter:", error);
      }
    }

    // Only enable debug mode in development
    if (isDev) {
      // Check for debug mode
      const debugParam = params.get("debug");
      if (debugParam === "true") {
        setShowDebug(true);
      }

      // Add keyboard shortcut for debug mode (Ctrl+Shift+D)
      const handleKeyDown = (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === "D") {
          setShowDebug((prev) => !prev);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [filterByDate]);

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
  if (componentToShow === "date") {
    return (
      <>
        <DateHeader standalone={true} onDateChange={handleDateChange} />
        <Footer />
      </>
    );
  }

  if (componentToShow === "stream-title") {
    return (
      <>
        <StreamTitle channelName={channel} standalone={true} />
        <Footer />
      </>
    );
  }

  if (componentToShow === "messages") {
    return (
      <>
        <MessageBoard
          messages={messages}
          votes={votes}
          standalone={true}
          onVote={upvoteMessage}
          onResetVote={resetVoteMessage}
          dateKey={selectedDateKey}
        />
        <Footer />
      </>
    );
  }

  if (componentToShow === "leaderboard") {
    return (
      <>
        <Leaderboard
          votes={votes}
          messages={messages}
          standalone={true}
          onVote={upvoteMessage}
          dateKey={selectedDateKey}
        />
        <Footer />
      </>
    );
  }

  // Render the new viewer layout
  return (
    <div className="container viewer-layout">
      <div className="left-column">
        <DateHeader onDateChange={handleDateChange} />
        <Leaderboard
          votes={votes}
          messages={messages}
          onVote={upvoteMessage}
          dateKey={selectedDateKey}
        />
        {isDev && showDebug && <FirebaseDebug />}
      </div>

      <div className="right-column">
        <StreamTitle channelName={channel} />
        <MessageBoard
          messages={messages}
          votes={votes}
          onVote={upvoteMessage}
          onResetVote={resetVoteMessage}
          dateKey={selectedDateKey}
        />
        {isDev && showDebug && (
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <button
              className="debug-toggle-button"
              onClick={() => setShowDebug(false)}
            >
              Hide Debug Panel
            </button>
          </div>
        )}
        {isDev && !showDebug && (
          <div style={{ textAlign: "center", marginTop: "10px", opacity: 0.5 }}>
            <button
              className="debug-toggle-button"
              onClick={() => setShowDebug(true)}
            >
              Show Debug Panel (Ctrl+Shift+D)
            </button>
          </div>
        )}
        <Footer />
      </div>
    </div>
  );
}

export default App;
