import { motion } from 'motion/react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Sparkles } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Design {
  id: number;
  image: string;
  roomType: string;
  style: string[];
}

interface ProfilePageProps {
  likedDesigns: Design[];
}

const styleProfileData = [
  { style: 'Modern', value: 85 },
  { style: 'Minimalist', value: 90 },
  { style: 'Scandinavian', value: 70 },
  { style: 'Industrial', value: 45 },
  { style: 'Luxury', value: 60 },
  { style: 'Cozy', value: 75 },
];

const colorPalette = [
  { color: '#FFFFFF', name: 'White' },
  { color: '#F5F5F5', name: 'Light Gray' },
  { color: '#2C3E50', name: 'Navy' },
  { color: '#D4AF37', name: 'Gold' },
  { color: '#8B7355', name: 'Wood' },
];

export function ProfilePage({ likedDesigns }: ProfilePageProps) {
  return (
    <div className="min-h-screen px-4 py-12 pb-32 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="mb-3">Your Profile</h1>
        <p className="text-gray-400">
          You've liked {likedDesigns.length} designs so far
        </p>
      </motion.div>

      {/* Style Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-light rounded-[24px] p-8 mb-8"
      >
        <h2 className="mb-6">Your Style Profile</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Radar Chart */}
          <div>
            <h4 className="mb-4 text-gray-300">Style Preferences</h4>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={styleProfileData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis
                    dataKey="style"
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  />
                  <Radar
                    dataKey="value"
                    stroke="#00D9FF"
                    fill="#00D9FF"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <h4 className="mb-4 text-gray-300">Your Color Palette</h4>
            <div className="space-y-3">
              {colorPalette.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-[16px] border border-white/20"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-300">{item.name}</span>
                </div>
              ))}
            </div>
            
            <button className="mt-6 w-full px-6 py-3 glass rounded-[20px] hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-[#00D9FF]" />
              <span>Re-train AI Taste</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Liked Designs Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="mb-6">Liked Designs</h2>
        
        {likedDesigns.length === 0 ? (
          <div className="glass-light rounded-[24px] p-12 text-center">
            <p className="text-gray-400">
              You haven't liked any designs yet. Start swiping to build your collection!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {likedDesigns.map((design, index) => (
              <motion.div
                key={design.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="group relative aspect-square rounded-[20px] overflow-hidden glass cursor-pointer hover:scale-105 transition-transform"
              >
                <ImageWithFallback
                  src={design.image}
                  alt={design.roomType}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-sm">{design.roomType}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {design.style.map((tag, i) => (
                        <span key={i} className="text-xs text-gray-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
