"use client";
import React, { memo } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ImageWithFallback } from "./ImageWithFallback";

interface Design {
  id: string | number;
  image: string;
  roomType: string;
  style: string[];
}


interface DesignCardProps {
  design: Design;
  onSwipe: (direction: "left" | "right") => void;
  style?: React.CSSProperties;
}

const DesignCardComponent = ({ design, onSwipe, style }: DesignCardProps) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (_: any, info: any) => {
    if (Math.abs(info.offset.x) > 120) {
      onSwipe(info.offset.x > 0 ? "right" : "left");
    }
  };

  return (
    <motion.div
      drag="x"
      dragElastic={0.2}
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x, rotate, opacity, ...style }}
      onDragEnd={handleDragEnd}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="absolute w-full max-w-md select-none cursor-grab active:cursor-grabbing"
    >
      <div className="rounded-[24px] overflow-hidden shadow-[0_8px_36px_rgba(0,0,0,0.45)] bg-[#0B0F24] border border-white/5">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <ImageWithFallback
            src={design.image}
            alt={`${design.roomType} - ${design.style.join(", ")}`}
            className="object-cover"
            width={600}
            height={800}
            priority={false}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Info bar */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="mb-2 text-lg font-semibold">{design.roomType}</h3>
            <div className="flex flex-wrap gap-2">
              {design.style.map((tag, i) => (
                <span
                  key={`${design.id}-${i}`} // уникальный ключ
                  className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Swipe indicators */}
      <motion.div
        style={{
          opacity: useTransform(x, [60, 150], [0, 1]),
        }}
        className="absolute top-10 right-8 px-6 py-3 bg-green-500/90 backdrop-blur-sm rounded-[20px] rotate-12 pointer-events-none"
      >
        <span className="text-xl font-bold">LIKE</span>
      </motion.div>

      <motion.div
        style={{
          opacity: useTransform(x, [-150, -60], [1, 0]),
        }}
        className="absolute top-10 left-8 px-6 py-3 bg-red-500/90 backdrop-blur-sm rounded-[20px] -rotate-12 pointer-events-none"
      >
        <span className="text-xl font-bold">NOPE</span>
      </motion.div>
    </motion.div>
  );
};

export const DesignCard = memo(DesignCardComponent);
