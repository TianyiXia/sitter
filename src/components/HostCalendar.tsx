"use client";

import { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  eachDayOfInterval,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Booking = {
  guest_name: string;
  start_date: string;
  end_date: string;
};

export default function HostCalendar({ bookings }: { bookings: Booking[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-stone-900">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-1 hover:bg-stone-100 rounded-full text-stone-600"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-1 hover:bg-stone-100 rounded-full text-stone-600"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-stone-400 uppercase tracking-widest"
          >
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    const rows: React.ReactNode[] = [];
    let days: React.ReactNode[] = [];

    calendarDays.forEach((day, i) => {
      const isCurrentMonth = isSameMonth(day, monthStart);
      const isToday = isSameDay(day, new Date());

      // Check if this day is within any booking interval
      const activeBookings = bookings.filter((booking) => {
        const start = startOfDay(new Date(booking.start_date));
        const end = startOfDay(new Date(booking.end_date));
        const checkDay = startOfDay(day);
        return checkDay >= start && checkDay <= end;
      });

      days.push(
        <div
          key={day.toString()}
          className={`h-20 border-t border-l border-stone-100 p-1 relative overflow-hidden ${
            !isCurrentMonth ? "bg-stone-50/50" : "bg-white"
          } ${i % 7 === 6 ? "border-r" : ""} ${
            i >= calendarDays.length - 7 ? "border-b" : ""
          }`}
        >
          <span
            className={`text-xs font-medium ${
              isToday
                ? "bg-amber-600 text-white w-5 h-5 flex items-center justify-center rounded-full"
                : isCurrentMonth
                ? "text-stone-700"
                : "text-stone-300"
            }`}
          >
            {format(day, "d")}
          </span>

          <div className="mt-1 space-y-1">
            {activeBookings.map((b, idx) => (
              <div
                key={idx}
                className="text-[10px] leading-tight px-1 py-0.5 bg-amber-100 text-amber-800 rounded truncate border border-amber-200"
                title={`${b.guest_name}: ${b.start_date} - ${b.end_date}`}
              >
                {b.guest_name}
              </div>
            ))}
          </div>
        </div>
      );

      if ((i + 1) % 7 === 0) {
        rows.push(
          <div key={day.toString()} className="grid grid-cols-7">
            {days}
          </div>
        );
        days = [];
      }
    });

    return <div>{rows}</div>;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
      {renderHeader()}
      {renderDays()}
      <div className="border-r border-b border-stone-100 rounded-lg overflow-hidden">
        {renderCells()}
      </div>
      <div className="mt-4 flex items-center gap-4 text-xs text-stone-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-amber-100 border border-amber-200 rounded"></div>
          <span>Confirmed Booking</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-white border border-stone-200 rounded"></div>
          <span>Available</span>
        </div>
      </div>
    </div>
  );
}

function startOfDay(date: Date) {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}
