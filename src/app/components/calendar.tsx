"use client";
import { useEffect, useState } from "react";

const Calendar = ({ onDateChange }: { onDateChange: (date: Date | null) => void }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [daysInMonth, setDaysInMonth] = useState<Date[]>([]);
  const [startDay, setStartDay] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = new Date(year, month, 1);
    const days: Date[] = [];

    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    setDaysInMonth(days);
    setStartDay(new Date(year, month, 1).getDay());
  }, [currentDate]);

  const dayNames = ["DOMINGO", "SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO"];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateChange(date);
  };

  return (
    <div className="w-[1000px] mx-auto border border-[#ccc] rounded-lg overflow-hidden pb-2.5 shadow-lg">
      <div className="flex justify-between items-center bg-[#b670f4] text-white p-[15px] text-[20px] font-bold">
        <button
          className="bg-none border-none text-white text-[15px] opacity-70 cursor-pointer"
          onClick={prevMonth}
        >
          &lt;
        </button>
        <span>
          {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
        </span>
        <button
          className="bg-none border-none text-white text-[15px] opacity-70 cursor-pointer"
          onClick={nextMonth}
        >
          &gt;
        </button>
      </div>

      <div className="flex flex-wrap ">
        {dayNames.map((day) => (
          <div
            className="w-[14.28%] font-bold text-black p-2.5 border-2 border-[#f0f0f0] box-border text-center text-xs rounded-sm bg-[#f0f0f0] mb-2"
            key={day}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap bg-white">
        {Array.from({ length: startDay }).map((_, index) => (
          <div
            key={index}
            className="w-[14.28%] p-2.5 border-2 border-[#f0f0f0] box-border text-center text-xs opacity-70 rounded-sm"
          ></div>
        ))}

        {daysInMonth.map((day) => (
          <div
            key={day.toString()}
            className={`text-black border-2 border-[#f0f0f0] cursor-pointer w-[14.28%] p-2.5 box-border text-center text-xs opacity-70 rounded-sm transition-colors duration-300 hover:bg-[#f0f0f0]
            ${
              day.getDate() === new Date().getDate() && day.getMonth() === new Date().getMonth()
                ? "bg-[#b670f4] text-white rounded-sm text-center"
                : ""
            } ${
              selectedDate && day.toDateString() === selectedDate.toDateString()
                ? "bg-[#b670f4] text-white rounded-sm text-center"
                : ""
            }`}
            onClick={() => handleDateClick(day)}
          >
            {day.getDate()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
