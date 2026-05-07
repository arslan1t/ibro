import { useState } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

const styleOptions = ['Modern', 'Scandinavian', 'Industrial', 'Minimalist', 'Contemporary', 'Luxury', 'Cozy', 'Elegant'];
const roomTypes = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Dining Room', 'Home Office', 'Loft', 'Reading Nook'];
const colorPalettes = ['Neutral', 'Warm', 'Cool', 'Dark', 'Light', 'Colorful', 'Monochrome'];
const budgetRanges = ['< $5k', '$5k - $15k', '$15k - $30k', '$30k - $50k', '$50k+'];

export function FiltersPage() {
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Modern', 'Minimalist']);
  const [selectedRooms, setSelectedRooms] = useState<string[]>(['Living Room']);
  const [selectedColors, setSelectedColors] = useState<string[]>(['Neutral']);
  const [selectedBudget, setSelectedBudget] = useState<string>('$5k - $15k');

  const toggleSelection = (
    item: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((i) => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 pb-32 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="mb-3">Filters</h1>
        <p className="text-gray-400">Customize your design feed to match your preferences</p>
      </motion.div>

      {/* Style Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h3 className="mb-4">Style Preferences</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {styleOptions.map((style) => {
            const isSelected = selectedStyles.includes(style);
            return (
              <button
                key={style}
                onClick={() => toggleSelection(style, selectedStyles, setSelectedStyles)}
                className={`px-4 py-3 rounded-[20px] transition-all ${
                  isSelected
                    ? 'bg-[#00D9FF] text-[#0A0F2C]'
                    : 'glass-light hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span>{style}</span>
                  {isSelected && <Check className="w-4 h-4" />}
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Room Type */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h3 className="mb-4">Room Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {roomTypes.map((room) => {
            const isSelected = selectedRooms.includes(room);
            return (
              <button
                key={room}
                onClick={() => toggleSelection(room, selectedRooms, setSelectedRooms)}
                className={`px-4 py-3 rounded-[20px] transition-all ${
                  isSelected
                    ? 'bg-[#00D9FF] text-[#0A0F2C]'
                    : 'glass-light hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span>{room}</span>
                  {isSelected && <Check className="w-4 h-4" />}
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Color Palette */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h3 className="mb-4">Color Palette</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {colorPalettes.map((color) => {
            const isSelected = selectedColors.includes(color);
            return (
              <button
                key={color}
                onClick={() => toggleSelection(color, selectedColors, setSelectedColors)}
                className={`px-4 py-3 rounded-[20px] transition-all ${
                  isSelected
                    ? 'bg-[#00D9FF] text-[#0A0F2C]'
                    : 'glass-light hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span>{color}</span>
                  {isSelected && <Check className="w-4 h-4" />}
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Budget Range */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-12"
      >
        <h3 className="mb-4">Budget Range</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {budgetRanges.map((budget) => {
            const isSelected = selectedBudget === budget;
            return (
              <button
                key={budget}
                onClick={() => setSelectedBudget(budget)}
                className={`px-4 py-3 rounded-[20px] transition-all ${
                  isSelected
                    ? 'bg-[#00D9FF] text-[#0A0F2C]'
                    : 'glass-light hover:bg-white/10'
                }`}
              >
                {budget}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Apply Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center"
      >
        <button className="px-16 py-4 bg-gradient-to-r from-[#00D9FF] to-[#00B8DB] rounded-[24px] text-[#0A0F2C] text-lg shadow-[0_0_30px_rgba(0,217,255,0.3)] hover:shadow-[0_0_50px_rgba(0,217,255,0.5)] transition-all">
          Apply Filters
        </button>
      </motion.div>
    </div>
  );
}
