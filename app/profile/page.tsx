"use client";

import { motion } from "framer-motion";
import { Heart, RefreshCw, SlidersHorizontal, Trash2, LogOut } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import Image from "next/image";
import { useApp } from "@/app/context/AppContext";
import BottomNav from "@/components/ui/BottomNav";
import LoginPage from "@/components/auth/LoginPage";

export default function ProfilePage() {
  const { user, favorites, filters, resetFilters, removeFavorite, clearFavorites, signOut } = useApp();

  // 🔐 Если пользователь не авторизован — показать LoginPage
  if (!user) {
    return <LoginPage />;
  }

  // 📊 Данные диаграммы
  const radarData = [
    { style: "Modern", value: 90 },
    { style: "Minimalist", value: 80 },
    { style: "Scandinavian", value: 65 },
    { style: "Luxury", value: 50 },
    { style: "Cozy", value: 40 },
    { style: "Industrial", value: 25 },
  ];

  // 🔧 Активные фильтры
  const filterItems = [
    { title: "Style", value: filters.styles.join(", ") || "Not selected" },
    { title: "Room Type", value: filters.roomTypes.join(", ") || "Not selected" },
    { title: "Color Palette", value: filters.colors.join(", ") || "Not selected" },
    { title: "Materials", value: filters.materials.join(", ") || "Not selected" },
    { title: "Property Type", value: filters.propertyType.join(", ") || "Not selected" },
    { title: "Budget", value: filters.budget || "Not selected" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0F2C] text-white px-6 pt-10 pb-28">
      {/* Заголовок */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center mb-6"
      >
        My Profile
      </motion.h1>

      {/* Блок профиля */}
      <div className="glass-light p-6 rounded-[20px] mb-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#00D9FF]/20 flex items-center justify-center text-xl font-bold">
            {user.email ? user.email[0].toUpperCase() : "U"}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.email || "User"}</h2>
            <p className="text-gray-400 text-sm">DesignSwipe User</p>
          </div>
        </div>

        <button
          onClick={signOut}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 transition"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>

      {/* Диаграмма стилей */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-light p-6 rounded-[24px] mb-10"
      >
        <h2 className="text-lg font-semibold mb-4 text-center">Your Style Profile</h2>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-10">
          <div className="w-full lg:w-1/2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1E2A4A" />
                <PolarAngleAxis dataKey="style" stroke="#8EA2C9" />
                <Radar
                  name="Style"
                  dataKey="value"
                  stroke="#00D9FF"
                  fill="#00D9FF"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Палитра Цветов */}
          <div className="w-full lg:w-1/2">
            <h3 className="text-md mb-3 font-semibold">Your Color Palette</h3>
            <div className="flex flex-col gap-2">
              {[
                { color: "#FFFFFF", label: "White" },
                { color: "#D9D9D9", label: "Light Gray" },
                { color: "#132B4D", label: "Navy" },
                { color: "#D4AF37", label: "Gold" },
                { color: "#A17852", label: "Wood" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full border border-white/30"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-gray-300">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Активные фильтры */}
      <section className="mb-10">
        <h2 className="text-lg mb-4 font-semibold flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-[#00D9FF]" />
          Active Filters
        </h2>
        <div className="space-y-3">
          {filterItems.map((item) => (
            <motion.div
              key={item.title}
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex justify-between"
            >
              <span className="text-gray-400">{item.title}</span>
              <span className="text-white text-right ml-4">{item.value}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Избранное */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-[#FF4D67]" />
          Liked Designs ({favorites.length})
        </h2>

        {favorites.length === 0 ? (
          <p className="text-gray-400 text-sm">
            You haven't liked any designs yet. Swipe right on ones you like!
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {favorites.map((design) => (
                <motion.div
                  key={design.id}
                  whileHover={{ scale: 1.05 }}
                  className="relative overflow-hidden rounded-[20px]"
                >
                  <Image
                    src={design.image}
                    alt={design.roomType}
                    width={500}
                    height={500}
                    className="object-cover w-full h-40"
                  />
                  <button
                    onClick={() => removeFavorite(design.id)}
                    className="absolute top-2 right-2 bg-black/50 text-xs px-2 py-1 rounded-full hover:bg-red-500/70 transition-all"
                  >
                    Remove
                  </button>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearFavorites}
              className="w-full py-3 bg-red-500/20 border border-red-400/40 rounded-[15px] text-sm font-medium text-red-300 flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All Favorites
            </motion.button>
          </>
        )}
      </section>

      {/* Сброс фильтров */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={resetFilters}
        className="w-full py-4 bg-gradient-to-r from-[#FF4D67] to-[#FF7E89] rounded-[20px] font-semibold shadow-[0_0_25px_rgba(255,77,103,0.3)] flex items-center justify-center gap-2"
      >
        <RefreshCw className="w-5 h-5" />
        Reset Filters
      </motion.button>

      <BottomNav />
    </div>
  );
}
