"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ujfqiioedwkpazsssbew.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqZnFpaW9lZHdrcGF6c3NzYmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDgyMDUsImV4cCI6MjA3ODUyNDIwNX0.giuvm9cTdD1jy5Ovd3-BITMaQqxLIbXgigZ1cVDFyK8"
);

export default function AuthButtons() {
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) alert(error.message);
    setLoading(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-3 items-center justify-center">
      <button
        onClick={signInWithGoogle}
        disabled={loading}
        className="px-5 py-3 bg-[#00D9FF] rounded-lg text-[#0A0F2C] font-semibold shadow-[0_0_20px_rgba(0,217,255,0.3)]"
      >
        {loading ? "Loading..." : "Sign in with Google"}
      </button>

      <button
        onClick={signOut}
        className="px-5 py-2 bg-transparent border border-[#00D9FF] text-[#00D9FF] rounded-lg"
      >
        Sign Out
      </button>
    </div>
  );
}
