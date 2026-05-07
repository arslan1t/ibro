'use client';

import { motion } from 'framer-motion';
import { Sparkles, Brain, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ImageWithFallback } from './ImageWithFallback';

interface LandingPageProps {
  onStart?: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  const router = useRouter();

  const features = [
    {
      icon: Brain,
      title: 'AI Recommendations',
      description:
        "Smart algorithms learn your taste and suggest designs you'll love",
    },
    {
      icon: Sparkles,
      title: 'Pinterest-level Quality',
      description:
        'Curated collection of high-end interior designs from top designers',
    },
    {
      icon: Heart,
      title: 'Personalized Style Taste',
      description:
        'Build your unique style profile with every swipe',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pb-32 relative overflow-hidden">
      {/* Background blur image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F2C]/90 via-[#0A0F2C]/80 to-[#0A0F2C] z-10" />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjI4MTc3MDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Modern interior"
          className="w-full h-full object-cover blur-2xl opacity-30"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-4xl mx-auto text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 glass-light rounded-[20px]">
            <Sparkles className="w-6 h-6 text-[#00D9FF]" />
            <span className="text-xl">DesignSwipe AI</span>
          </div>
        </motion.div>

        {/* Hero text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 bg-gradient-to-r from-white via-gray-200 to-[#00D9FF] bg-clip-text text-transparent"
        >
          Discover Your Dream Interior with AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-gray-300 text-xl mb-12 max-w-2xl mx-auto"
        >
          Swipe through stunning interior designs, train our AI to understand your style, and find inspiration for your perfect space
        </motion.p>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/swipe')}
          className="px-12 py-5 bg-gradient-to-r from-[#00D9FF] to-[#00B8DB] rounded-[24px] text-[#0A0F2C] text-lg shadow-[0_0_30px_rgba(0,217,255,0.3)] hover:shadow-[0_0_50px_rgba(0,217,255,0.5)] transition-all mb-20"
        >
          Start Swiping
        </motion.button>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="glass-light p-8 rounded-[24px] hover:bg-white/10 transition-all"
              >
                <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-[#00D9FF]/20 to-[#00D9FF]/5 flex items-center justify-center mb-4 mx-auto">
                  <Icon className="w-7 h-7 text-[#00D9FF]" />
                </div>
                <h3 className="mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
