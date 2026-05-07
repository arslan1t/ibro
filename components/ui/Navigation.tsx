import { Home, SlidersHorizontal, User } from 'lucide-react';
import { motion } from 'motion/react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'swipe', label: 'Home', icon: Home },
    { id: 'filters', label: 'Filters', icon: SlidersHorizontal },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass px-6 py-4 rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      >
        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative px-6 py-3 rounded-[20px] flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-[#00D9FF] text-[#0A0F2C]'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className={isActive ? '' : 'hidden md:inline'}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </motion.nav>
    </div>
  );
}
