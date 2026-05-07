"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, SlidersHorizontal } from "lucide-react";
import { DesignCard } from "./DesignCard";

interface Design {
  id: number;
  image: string;
  roomType: string;
  style: string[];
}

const mockDesigns: Design[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1667584523543-d1d9cc828a15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    roomType: "Living Room",
    style: ["Modern", "Minimalist"],
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1600494448655-ae58f58bb945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    roomType: "Bedroom",
    style: ["Scandinavian", "Cozy"],
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1669046222569-a7672da06e12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    roomType: "Kitchen",
    style: ["Minimalist", "White"],
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1625578324458-a106197ff141?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    roomType: "Bathroom",
    style: ["Luxury", "Contemporary"],
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1593136596203-7212b076f4d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    roomType: "Dining Room",
    style: ["Contemporary", "Elegant"],
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1652716279221-439c33c3b835?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    roomType: "Loft",
    style: ["Industrial", "Open Space"],
  },
];

export default function SwipePage() {
  const [cards, setCards] = useState<Design[]>(mockDesigns);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedDesigns, setLikedDesigns] = useState<Design[]>([]);

  // Прогрузка изображений для предотвращения лагов
  useEffect(() => {
    cards.forEach((card) => {
      const img = new Image();
      img.src = card.image;
    });
  }, [cards]);

  const handleSwipe = (direction: "left" | "right") => {
    const currentCard = cards[currentIndex];
    if (!currentCard) return;

    if (direction === "right") {
      setLikedDesigns((prev) => [...prev, currentCard]);
    }

    // плавное удаление карточки
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 200);
  };

  const handleButtonClick = (liked: boolean) => {
    handleSwipe(liked ? "right" : "left");
  };

  const currentCard = cards[currentIndex];
  const nextCard = cards[currentIndex + 1];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pb-32 pt-8 bg-[#0A0F2C] text-white relative overflow-hidden">
      {/* Header */}
      <div className="w-full max-w-md mb-8 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-semibold"
        >
          DesignSwipe AI
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => alert("Filters are not yet implemented")}
          className="glass-light px-4 py-2 rounded-[20px] flex items-center gap-2 hover:bg-white/10 transition-all"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Filters</span>
        </motion.button>
      </div>

      {/* Card Stack */}
      <div className="relative w-full max-w-md h-[600px] mb-8 perspective">
        <AnimatePresence mode="wait">
          {currentCard ? (
            <>
              {nextCard && (
                <motion.div
                  key={`next-${nextCard.id}`}
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5, scale: 0.95 }}
                  exit={{ opacity: 0 }}
                >
                  <DesignCard
                    design={nextCard}
                    onSwipe={() => {}}
                    style={{ scale: 0.95 }}
                  />
                </motion.div>
              )}

              <motion.div
                key={`current-${currentCard.id}`}
                className="absolute inset-0 flex items-center justify-center"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                whileDrag={{ scale: 1.05, rotateY: 5 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 100) handleSwipe("right");
                  if (info.offset.x < -100) handleSwipe("left");
                }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
              >
                <DesignCard design={currentCard} onSwipe={handleSwipe} />
              </motion.div>
            </>
          ) : (
            <motion.div
              key="end"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
            >
              <h3 className="text-2xl mb-4 font-semibold">
                🎉 No more designs!
              </h3>
              <p className="text-gray-400 mb-6">
                You’ve seen all available designs. Check back later for more!
              </p>
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setLikedDesigns([]);
                }}
                className="px-8 py-3 bg-gradient-to-r from-[#00D9FF] to-[#00B8DB] rounded-[20px] text-[#0A0F2C] hover:shadow-[0_0_30px_rgba(0,217,255,0.3)] transition-all"
              >
                Start Over
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      {currentCard && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-6"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleButtonClick(false)}
            className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/50 transition-all"
          >
            <X className="w-8 h-8 text-red-400" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleButtonClick(true)}
            className="w-20 h-20 rounded-full bg-gradient-to-r from-[#00D9FF] to-[#00B8DB] flex items-center justify-center shadow-[0_0_30px_rgba(0,217,255,0.3)] hover:shadow-[0_0_50px_rgba(0,217,255,0.5)] transition-all"
          >
            <Heart className="w-10 h-10 text-[#0A0F2C] fill-[#0A0F2C]" />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
