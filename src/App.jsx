import { useState, useEffect } from "react";
import DateHeader from "./components/DateHeader";
import MessageBoard from "./components/MessageBoard";
import Leaderboard from "./components/Leaderboard";
import useTwitchChat from "./hooks/useTwitchChat";
import "./styles/App.css";

function App() {
  const { messages, votes, upvoteMessage } = useTwitchChat();

  // Settings state - simplified for viewer mode
  const [showNamecards, setShowNamecards] = useState(true);
  const [transparency, setTransparency] = useState(false);

  // Check if the component should be rendered in standalone mode for OBS
  const [componentToShow, setComponentToShow] = useState("all");

  useEffect(() => {
    // Check URL parameters for standalone mode
    const params = new URLSearchParams(window.location.search);
    const component = params.get("component");

    if (component && ["date", "messages", "leaderboard"].includes(component)) {
      setComponentToShow(component);
      // Set transparent background for standalone mode
      document.body.style.background = "transparent";
      document.documentElement.style.height = "100%";
      document.body.style.height = "100%";
      document.getElementById("root").style.height = "100%";
      document.getElementById("root").style.padding = "0";
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
  if (componentToShow === "date") {
    return <DateHeader standalone={true} />;
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

  if (componentToShow === "leaderboard") {
    return (
      <Leaderboard
        votes={votes}
        messages={messages}
        standalone={true}
        onVote={upvoteMessage}
      />
    );
  }

  // Render the new viewer layout
  return (
    <div className="container viewer-layout">
      <div className="left-column">
        <DateHeader />
        <Leaderboard votes={votes} messages={messages} onVote={upvoteMessage} />
      </div>

      <div className="right-column">
        <MessageBoard messages={messages} onVote={upvoteMessage} />
      </div>
    </div>
  );
}

export default App;
