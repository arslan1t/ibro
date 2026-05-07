"use client";

import { useApp } from "@/app/context/AppContext";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { signInWithGoogle } = useApp();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0A0F2C] text-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-light p-10 rounded-2xl text-center w-full max-w-sm"
      >
        <h1 className="text-3xl font-bold mb-6">Welcome 👋</h1>
        <p className="text-gray-300 mb-6">Log in to continue using DesignSwipe</p>

        <button
          onClick={signInWithGoogle}
          className="w-full py-3 bg-[#00D9FF] text-black rounded-xl font-semibold shadow-[0_0_20px_rgba(0,217,255,0.4)]"
        >
          Continue with Google
        </button>
      </motion.div>
    </div>
  );
}
