"use client";

import { Home, SlidersHorizontal, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Filters", icon: SlidersHorizontal, href: "/filters" },
    { label: "Profile", icon: User, href: "/profile" },
  ];

  return (
    <motion.nav
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#0B0F24]/80 backdrop-blur-md 
                 border border-white/10 rounded-[30px] px-6 py-3 flex gap-8 
                 shadow-[0_8px_40px_rgba(0,0,0,0.5)] z-50"
    >
      {navItems.map(({ label, icon: Icon, href }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={label}
            href={href}
            className={`flex flex-col items-center text-sm transition-all ${
              isActive ? "text-[#00D9FF]" : "text-gray-400 hover:text-white"
            }`}
          >
            <Icon
              className={`w-6 h-6 mb-1 transition-all ${
                isActive ? "text-[#00D9FF]" : "text-gray-400"
              }`}
            />
            <span>{label}</span>
          </Link>
        );
      })}
    </motion.nav>
  );
}
