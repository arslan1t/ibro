"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useFilters } from "../context/FilterContext";
import BottomNav from "@components/ui/BottomNav";

export default function FiltersPage() {
  const router = useRouter();
  const { setFilters } = useFilters();

  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [selectedPalette, setSelectedPalette] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState<string[]>([]);

  const toggle = (set: any, value: string) => {
    set((prev: string[]) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleApplyFilters = () => {
    setFilters({
      styles: selectedStyles,
      roomTypes: selectedRooms,
      colors: selectedPalette,
      materials: selectedMaterials,
      propertyType: selectedPropertyType,
      budget: selectedBudget[0] || null,
    });
    router.push("/swipe");
  };

  return (
    <div className="min-h-screen bg-[#0A0F2C] text-white px-6 pt-10 pb-24">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-10 text-center"
      >
        Filters
      </motion.h1>

      {/* 🪑 Style Preferences */}
      <section className="mb-8">
        <h2 className="text-lg mb-3 font-semibold">Style Preferences</h2>
        <div className="flex flex-wrap gap-3">
          {[
            "Modern",
            "Scandinavian",
            "Industrial",
            "Minimalist",
            "Luxury",
            "Cozy",
            "Classic",
            "Contemporary",
          ].map((style) => (
            <button
              key={style}
              onClick={() => toggle(setSelectedStyles, style)}
              className={`px-5 py-2 rounded-full border transition-all ${
                selectedStyles.includes(style)
                  ? "bg-[#00D9FF] text-[#0A0F2C]"
                  : "border-white/20 hover:bg-white/10"
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </section>

      {/* 🏠 Property Type */}
      <section className="mb-8">
        <h2 className="text-lg mb-3 font-semibold">Property Type</h2>
        <div className="flex flex-wrap gap-3">
          {["Apartment", "House", "Loft", "Studio", "Villa", "Office"].map(
            (type) => (
              <button
                key={type}
                onClick={() => toggle(setSelectedPropertyType, type)}
                className={`px-5 py-2 rounded-full border transition-all ${
                  selectedPropertyType.includes(type)
                    ? "bg-[#00D9FF] text-[#0A0F2C]"
                    : "border-white/20 hover:bg-white/10"
                }`}
              >
                {type}
              </button>
            )
          )}
        </div>
      </section>

      {/* 🛋 Room Type */}
      <section className="mb-8">
        <h2 className="text-lg mb-3 font-semibold">Room Type</h2>
        <div className="flex flex-wrap gap-3">
          {[
            "Living Room",
            "Bedroom",
            "Kitchen",
            "Bathroom",
            "Dining Room",
            "Office",
            "Hallway",
          ].map((room) => (
            <button
              key={room}
              onClick={() => toggle(setSelectedRooms, room)}
              className={`px-5 py-2 rounded-full border transition-all ${
                selectedRooms.includes(room)
                  ? "bg-[#00D9FF] text-[#0A0F2C]"
                  : "border-white/20 hover:bg-white/10"
              }`}
            >
              {room}
            </button>
          ))}
        </div>
      </section>

      {/* 🎨 Color Palette */}
      <section className="mb-8">
        <h2 className="text-lg mb-3 font-semibold">Color Palette</h2>
        <div className="flex flex-wrap gap-3">
          {[
            "White",
            "Black",
            "Gray",
            "Beige",
            "Blue",
            "Green",
            "Brown",
            "Gold",
            "Colorful",
          ].map((color) => (
            <button
              key={color}
              onClick={() => toggle(setSelectedPalette, color)}
              className={`px-5 py-2 rounded-full border transition-all ${
                selectedPalette.includes(color)
                  ? "bg-[#00D9FF] text-[#0A0F2C]"
                  : "border-white/20 hover:bg-white/10"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </section>

      {/* 🪵 Materials */}
      <section className="mb-8">
        <h2 className="text-lg mb-3 font-semibold">Materials</h2>
        <div className="flex flex-wrap gap-3">
          {["Wood", "Marble", "Concrete", "Glass", "Metal", "Brick"].map(
            (mat) => (
              <button
                key={mat}
                onClick={() => toggle(setSelectedMaterials, mat)}
                className={`px-5 py-2 rounded-full border transition-all ${
                  selectedMaterials.includes(mat)
                    ? "bg-[#00D9FF] text-[#0A0F2C]"
                    : "border-white/20 hover:bg-white/10"
                }`}
              >
                {mat}
              </button>
            )
          )}
        </div>
      </section>

      {/* 💰 Budget Range */}
      <section className="mb-10">
        <h2 className="text-lg mb-3 font-semibold">Budget Range</h2>
        <div className="flex flex-wrap gap-3">
          {["< $5k", "$5k - $15k", "$15k - $30k", "$30k - $50k", "$50k+"].map(
            (budget) => (
              <button
                key={budget}
                onClick={() => toggle(setSelectedBudget, budget)}
                className={`px-5 py-2 rounded-full border transition-all ${
                  selectedBudget.includes(budget)
                    ? "bg-[#00D9FF] text-[#0A0F2C]"
                    : "border-white/20 hover:bg-white/10"
                }`}
              >
                {budget}
              </button>
            )
          )}
        </div>
      </section>

      {/* 🚀 Apply Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleApplyFilters}
        className="w-full py-4 bg-gradient-to-r from-[#00D9FF] to-[#00B8DB] rounded-[20px] text-[#0A0F2C] font-semibold shadow-[0_0_30px_rgba(0,217,255,0.3)]"
      >
        Apply Filters
      </motion.button>

      <BottomNav />
    </div>
  );
}
