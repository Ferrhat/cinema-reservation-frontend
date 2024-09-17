import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | ValuePiece[];

const ToggleCalendar = ({ date, setDate }: {
    date: Date;
    setDate: (date: Date) => void;
  }) => {
  const [showCalendar, setShowCalendar] = useState(false);

  const handleChange = (value: Value) => {
    if (value) {
      if (Array.isArray(value)) {
        setDate(value[0] as Date);
      } else {
        setDate(value as Date);
      }
    }
    setShowCalendar(false);
  };

  return (
    <div>
      <div className="mt-4">
        <input
          value={date.toISOString().split("T")[0]}
          onFocus={() => setShowCalendar(true)}
          className="bg-gray-250 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
        />
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" style={{display: "initial"}} onClick={() => setShowCalendar(!showCalendar)}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
        <Calendar
          className={showCalendar ? "" : "hide"}
          value={date}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default ToggleCalendar;
