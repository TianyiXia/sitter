"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";

type Booking = {
  id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: "pending" | "confirmed" | "rejected";
  created_at: string;
};

export default function MyBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) {
        setBookings(data as Booking[]);
      }
      setLoading(false);
    };

    fetchBookings();
  }, [router]);

  return (
    <div className="min-h-screen bg-stone-50 p-4 font-sans">
      <div className="max-w-2xl mx-auto">
        <header className="flex items-center gap-4 mb-8">
          <a href="/" className="p-2 bg-white rounded-full text-stone-600 hover:text-stone-900 shadow-sm">
            <ArrowLeft size={20} />
          </a>
          <h1 className="text-2xl font-bold text-stone-900">My Bookings</h1>
        </header>

        {loading ? (
          <div className="text-center py-12 text-stone-400">Loading your trips...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-stone-100 shadow-sm">
            <h3 className="text-lg font-bold text-stone-900 mb-2">No bookings yet</h3>
            <p className="text-stone-500 mb-4">Ready to plan your pup's next vacation?</p>
            <a href="/#book" className="text-amber-600 font-medium hover:underline">Book a stay</a>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
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
                      <span className="text-xs text-stone-400">
                        Requested on {new Date(booking.created_at).toLocaleDateString()}
                      </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-lg font-bold text-stone-900 mb-1">
                    <Calendar size={18} className="text-amber-600" />
                    {new Date(booking.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} 
                    {" - "} 
                    {new Date(booking.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  
                  <div className="text-sm text-stone-500">
                    Total: ${booking.total_price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
