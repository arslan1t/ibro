"use client";

import { useApp } from "@/app/context/AppContext";
import { LogOut } from "lucide-react";

export default function UserHeader() {
  const { user, signOut } = useApp();

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-xl font-semibold">{user?.email || "User"}</h2>
        <p className="text-gray-400 text-sm">DesignSwipe Member</p>
      </div>

      <button
        onClick={signOut}
        className="flex items-center gap-2 text-red-400 hover:text-red-300 transition"
      >
        <LogOut className="w-5 h-5" /> Logout
      </button>
    </div>
  );
}
