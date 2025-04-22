import React, { useState, useEffect } from "react";

const DateHeader = ({ standalone = false }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Update the date every minute to keep it current
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Format date: "Monday, January 1, 2023"
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Classes for standalone mode
  const containerClasses = standalone
    ? "date-header component-module standalone-component header-standalone"
    : "date-header component-module";

  return (
    <header className={containerClasses}>
      <div className="namecard">Today</div>
      <div className="component-content">
        <h1>{formattedDate}</h1>
      </div>
    </header>
  );
};

export default DateHeader;
