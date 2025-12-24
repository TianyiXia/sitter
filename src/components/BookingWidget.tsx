"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { 
  differenceInCalendarDays, 
  format, 
  isSameDay, 
  startOfToday,
  addDays,
  parseISO
} from "date-fns";
import { DayPicker, DateRange } from "react-day-picker";

type Settings = {
  base_rate: number;
  holiday_rate: number;
  holidays: string[];
};

type BlockedRange = {
  from: Date;
  to: Date;
};

export default function BookingWidget() {
  const [range, setRange] = useState<DateRange | undefined>();
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [message, setMessage] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const [settings, setSettings] = useState<Settings>({
    base_rate: 50,
    holiday_rate: 75,
    holidays: [],
  });

  const [blockedRanges, setBlockedRanges] = useState<BlockedRange[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: settingsData } = await supabase
        .from("settings")
        .select("base_rate, holiday_rate, holidays")
        .single();
      
      if (settingsData) {
        setSettings({
          base_rate: Number(settingsData.base_rate),
          holiday_rate: Number(settingsData.holiday_rate),
          holidays: settingsData.holidays || [],
        });
      }

      const { data: bookingsData } = await supabase
        .from("bookings")
        .select("start_date, end_date")
        .eq("status", "confirmed");

      if (bookingsData) {
        const ranges = bookingsData.map((b) => ({
          from: parseISO(b.start_date),
          to: parseISO(b.end_date),
        }));
        setBlockedRanges(ranges);
      }
    };
    fetchData();
  }, []);

  const calculateTotal = () => {
    if (!range?.from || !range?.to) return 0;
    
    let total = 0;
    let current = new Date(range.from);
    const end = new Date(range.to);
    
    // We count nights, so we iterate from start to end-1 day
    const nights = differenceInCalendarDays(end, current);
    
    for (let i = 0; i < nights; i++) {
        const dateStr = format(current, "yyyy-MM-dd");
        const isHoliday = settings.holidays.includes(dateStr);
        total += isHoliday ? settings.holiday_rate : settings.base_rate;
        current = addDays(current, 1);
    }
    
    return total;
  };

  const total = calculateTotal();

  const isBlocked = (date: Date) => {
    return blockedRanges.some(
      (range) => date >= range.from && date <= range.to
    );
  };

  const hasOverlap = (newRange: DateRange | undefined) => {
    if (!newRange?.from || !newRange?.to) return false;
    
    let current = new Date(newRange.from);
    while (current <= newRange.to) {
      if (isBlocked(current)) return true;
      current = addDays(current, 1);
    }
    return false;
  };

  const handleSelect = (newRange: DateRange | undefined) => {
    if (hasOverlap(newRange)) {
        setError("Selected range includes unavailable dates.");
        return;
    }
    setError("");
    setRange(newRange);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!range?.from || !range?.to) {
        setError("Please select a date range.");
        return;
    }

    setLoading(true);
    setError("");

    try {
      const { error: dbError } = await supabase.from("bookings").insert({
        guest_name: guestName,
        guest_phone: guestPhone,
        start_date: format(range.from, "yyyy-MM-dd"),
        end_date: format(range.to, "yyyy-MM-dd"),
        total_price: total,
        message: message,
        status: "pending",
      });

      if (dbError) throw dbError;

      await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName,
          guestPhone,
          startDate: format(range.from, "PP"),
          endDate: format(range.to, "PP"),
          total: total.toFixed(2),
        }),
      });

      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 p-6 rounded-2xl shadow-lg border border-green-100 text-center">
        <h3 className="text-xl font-bold text-green-800 mb-2">Request Sent!</h3>
        <p className="text-green-700 mb-4">
          Thanks, {guestName}. I'll contact you at {guestPhone} shortly to confirm.
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            setRange(undefined);
            setMessage("");
          }}
          className="text-sm font-medium text-green-600 hover:underline"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <div
      id="book"
      className="bg-white p-4 rounded-2xl shadow-lg border border-stone-100"
    >
      <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
        <CalendarIcon className="text-amber-600" size={20} />
        Request to Book
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date Picker */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-stone-700">
            Select Dates
          </label>
          <div className="flex justify-center border border-stone-100 rounded-xl p-2 bg-stone-50/50">
            <DayPicker
              mode="range"
              selected={range}
              onSelect={handleSelect}
              disabled={[
                { before: startOfToday() },
                ...blockedRanges.map(r => ({ from: r.from, to: r.to }))
              ]}
              modifiers={{
                holiday: (date) => settings.holidays.includes(format(date, "yyyy-MM-dd"))
              }}
              modifiersClassNames={{
                selected: "bg-amber-600 text-white",
                range_middle: "bg-amber-100 text-amber-900",
                range_start: "rounded-l-full",
                range_end: "rounded-r-full",
                holiday: "text-red-500 font-bold"
              }}
              styles={{
                caption: { color: "#444" },
                head_cell: { color: "#888", fontWeight: "600", fontSize: "0.75rem" },
                day: { transition: "all 0.2s" }
              }}
            />
          </div>
          {range?.from && range?.to && (
            <div className="text-xs text-stone-500 text-center mt-2">
                {format(range.from, "MMM d")} — {format(range.to, "MMM d")} ({differenceInCalendarDays(range.to, range.from)} nights)
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
            <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Your Name</label>
                <input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full border border-stone-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Phone Number</label>
                <input
                    type="tel"
                    required
                    placeholder="(555) 123-4567"
                    className="w-full border border-stone-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                />
            </div>
             <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Message (Optional)</label>
                <textarea
                    rows={2}
                    placeholder="Tell me a bit about your dog..."
                    className="w-full border border-stone-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </div>
        </div>

        {/* Price Estimate */}
        <div className="bg-stone-50 p-3 rounded-lg flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-stone-600 text-xs">Est. Total</span>
            <span className="text-stone-400 text-[10px]">
                Base: ${settings.base_rate} / Holiday: ${settings.holiday_rate}
            </span>
          </div>
          <span className="text-lg font-bold text-stone-900">
            ${total.toFixed(2)}
          </span>
        </div>

        {error && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded flex items-center gap-2">
                <AlertCircle size={14} />
                {error}
            </div>
        )}

        {/* CTA */}
        <button
            type="submit"
            disabled={loading || !range?.from || !range?.to}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all active:scale-[0.98] flex justify-center items-center"
        >
            {loading ? <Loader2 className="animate-spin" /> : "Submit Request"}
        </button>
      </form>
    </div>
  );
}