"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  LogOut,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  MessageSquare,
  List,
  Calendar as CalendarIcon,
  Settings as SettingsIcon,
} from "lucide-react";
import HostCalendar from "@/components/HostCalendar";
import SettingsForm from "@/components/SettingsForm";

type Booking = {
  id: string;
  guest_name: string;
  guest_phone: string;
  start_date: string;
  end_date: string;
  total_price: number;
  message: string;
  status: "pending" | "confirmed" | "rejected";
  created_at: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "calendar" | "settings">("list");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setBookings(data as Booking[]);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: "confirmed" | "rejected") => {
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id);

    if (!error) {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-stone-900">Host Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-stone-500 hover:text-stone-900"
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-stone-900">Bookings</h2>
          
          <div className="flex items-center bg-stone-200 p-1 rounded-lg">
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                view === "list"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              <List size={16} />
              List
            </button>
            <button
              onClick={() => setView("calendar")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                view === "calendar"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              <CalendarIcon size={16} />
              Calendar
            </button>
            <button
              onClick={() => setView("settings")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                view === "settings"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              <SettingsIcon size={16} />
              Settings
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-stone-400">Loading...</div>
        ) : view === "calendar" ? (
          <HostCalendar bookings={confirmedBookings} />
        ) : view === "settings" ? (
          <SettingsForm />
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 text-stone-400 bg-white rounded-2xl border border-stone-100">
            No booking requests yet.
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className={`bg-white p-6 rounded-2xl border ${
                  booking.status === "pending"
                    ? "border-amber-200 shadow-md"
                    : "border-stone-100"
                } transition-all`}
              >
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-stone-900">
                        {booking.guest_name}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4 text-sm text-stone-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-stone-400" />
                        <span>
                          {new Date(booking.start_date).toLocaleDateString()} -{" "}
                          {new Date(booking.end_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-stone-400" />
                        <a href={`tel:${booking.guest_phone}`} className="hover:underline">
                          {booking.guest_phone}
                        </a>
                      </div>
                      <div className="sm:col-span-2 font-medium text-stone-900 mt-1">
                        Total: ${booking.total_price}
                      </div>
                    </div>

                    {booking.message && (
                      <div className="bg-stone-50 p-3 rounded-lg text-sm text-stone-700 flex gap-2 items-start">
                        <MessageSquare
                          size={16}
                          className="text-stone-400 mt-0.5 flex-shrink-0"
                        />
                        <p>{booking.message}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {booking.status === "pending" && (
                    <div className="flex gap-2 self-start md:self-center">
                      <button
                        onClick={() => updateStatus(booking.id, "confirmed")}
                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <CheckCircle size={16} />
                        Confirm
                      </button>
                      <button
                        onClick={() => updateStatus(booking.id, "rejected")}
                        className="flex items-center gap-1 bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </div>
                  )}
                  {booking.status !== "pending" && (
                     <div className="text-xs text-stone-400 self-start md:self-center">
                        Processed on {new Date(booking.created_at).toLocaleDateString()}
                     </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

