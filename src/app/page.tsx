import Image from "next/image";
import { Dog, Calendar, CheckCircle, MapPin, Shield } from "lucide-react";

import BookingWidget from "@/components/BookingWidget";

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans">
      {/* Hero Section */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Dog className="text-amber-600" size={28} />
            <h1 className="text-xl font-bold tracking-tight text-stone-900">
              Tianyi's Sitter Service
            </h1>
          </div>
          <a
            href="#book"
            className="bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-amber-700 transition-colors md:hidden"
          >
            Book Now
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Profile & Info */}
        <div className="md:col-span-2 space-y-8">
          {/* Profile Card */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 rounded-full overflow-hidden border-4 border-amber-100">
                {/* Placeholder for Profile Pic */}
                <div className="w-full h-full bg-stone-200 flex items-center justify-center text-stone-400">
                  <span className="text-xs">Profile Pic</span>
                </div>
                {/* <Image src="/profile.jpg" alt="Tianyi" fill className="object-cover" /> */}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-stone-900 mb-2">
                  Tianyi
                </h2>
                <div className="flex items-center gap-1 text-stone-500 mb-4">
                  <MapPin size={16} />
                  <span className="text-sm">San Francisco Bay Area</span>
                </div>
                <p className="text-stone-600 leading-relaxed">
                  Hi, I'm Tianyi! I offer professional dog sitting services in a
                  safe and loving environment. I have a large backyard and focus
                  on providing personalized care for your furry friend.
                </p>
              </div>
            </div>
          </section>

          {/* About / Details */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 space-y-6">
            <h3 className="text-xl font-semibold text-stone-900">
              About My Service
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex gap-3 items-start">
                <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                  <Shield size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-stone-900">Safe Environment</h4>
                  <p className="text-sm text-stone-500">
                    Secure backyard and dog-proofed home.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                  <Dog size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-stone-900">
                    Experienced Handler
                  </h4>
                  <p className="text-sm text-stone-500">
                    Years of experience with various breeds.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Requirements */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <h3 className="text-xl font-semibold text-stone-900 mb-4">
              Requirements & Rules
            </h3>
            <ul className="space-y-3">
              {[
                "Dogs must be at least 1 year old.",
                "Must be fully vaccinated.",
                "No aggressive behavior history.",
                "House trained preferred.",
              ].map((req, i) => (
                <li key={i} className="flex items-center gap-3 text-stone-700">
                  <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right Column: Booking Widget */}
        <div className="md:col-span-1">
          <div className="sticky top-24">
            <BookingWidget />
            
            {/* Admin Link (Hidden/Subtle) */}
            <div className="mt-8 text-center">
              <a href="/admin" className="text-stone-300 text-xs hover:text-stone-500">
                Host Login
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}