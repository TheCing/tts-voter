import React, { useState, useEffect } from "react";

const DateHeader = ({ standalone = false, onDateChange }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Update the date every minute to keep it current
  useEffect(() => {
    const timer = setInterval(() => {
      // Only update the time part if we're on today's date
      const now = new Date();
      if (
        currentDate.getDate() === now.getDate() &&
        currentDate.getMonth() === now.getMonth() &&
        currentDate.getFullYear() === now.getFullYear()
      ) {
        setCurrentDate(new Date());
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [currentDate]);

  // Format date: "Monday, January 1, 2023"
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Navigate to previous day
  const goToPreviousDay = () => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    setCurrentDate(prevDate);
    if (onDateChange) onDateChange(prevDate);
  };

  // Navigate to next day
  const goToNextDay = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);

    // Prevent navigating to future dates
    const today = new Date();
    if (nextDate > today) {
      return;
    }

    setCurrentDate(nextDate);
    if (onDateChange) onDateChange(nextDate);
  };

  // Check if current date is today
  const isToday = () => {
    const today = new Date();
    return (
      currentDate.getDate() === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  // Classes for standalone mode
  const containerClasses = standalone
    ? "date-header component-module standalone-component header-standalone"
    : "date-header component-module";

  return (
    <header className={containerClasses}>
      <div className="namecard">{isToday() ? "Today" : "History"}</div>
      <div className="component-content date-navigator">
        <button
          className="date-nav-button prev"
          onClick={goToPreviousDay}
          aria-label="Previous day"
        >
          ◀
        </button>
        <h1>{formattedDate}</h1>
        <button
          className="date-nav-button next"
          onClick={goToNextDay}
          aria-label="Next day"
          disabled={isToday()}
        >
          ▶
        </button>
      </div>
    </header>
  );
};

export default DateHeader;
