"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { UserPlus } from "lucide-react";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Auto login or show success message? 
      // Supabase usually requires email confirmation by default, but for this demo app 
      // it might work immediately or require confirmation.
      // We'll show a generic success message or redirect.
      alert("Account created! You can now log in.");
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-stone-100 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-stone-100 rounded-full text-stone-600">
            <UserPlus size={24} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-stone-900 mb-6">
          Create Account
        </h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-500 text-white font-bold py-3 rounded-xl transition-all"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-stone-500">
          Already have an account?{" "}
          <a href="/login" className="text-amber-600 font-medium hover:underline">
            Log in
          </a>
        </div>
      </div>
    </div>
  );
}
