'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import {
  useRef, useState, useEffect, useCallback, useMemo
} from 'react'
import {
  motion, AnimatePresence, useScroll, useTransform,
  useMotionValue, useSpring, MotionValue, useMotionValueEvent, useInView
} from 'framer-motion'
import Image from 'next/image'
import { ArrowDown, ChevronRight, Play, X, Mail, User, Building2, Send, ExternalLink } from 'lucide-react'
import BiometricSection from '@/components/ibrohim/BiometricSection'
import EvidenceSection from '@/components/ibrohim/EvidenceSection'

/* Dynamic import: Three.js / WebGL must be client-only */
const ThreeScene = dynamic(() => import('@/components/ibrohim/ThreeScene'), { ssr: false })

/* ─── Noise grain overlay ───────────────────────────────────────── */
function GrainOverlay() {
  return <div className="noise-overlay" aria-hidden />
}

/* ─── Custom Cursor — pure DOM lerp, always-on, z-9999 ──────────── */
/* ─── Custom Cursor — single dot, instant follow, lime on hover ─── */
function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    const el = cursorRef.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      el.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`
    }

    const onEnter = () => {
      el.style.width  = '36px'
      el.style.height = '36px'
      el.style.marginLeft = '-18px'
      el.style.marginTop  = '-18px'
      el.style.borderColor = '#CCFF00'
      el.style.background  = 'rgba(204,255,0,0.08)'
    }
    const onLeave = () => {
      el.style.width  = '8px'
      el.style.height = '8px'
      el.style.marginLeft = '-4px'
      el.style.marginTop  = '-4px'
      el.style.borderColor = 'rgba(255,255,255,0.7)'
      el.style.background  = 'rgba(255,255,255,0.9)'
    }

    const attach = () => {
      document.querySelectorAll('a, button, [role="button"], input, textarea, label').forEach(node => {
        node.addEventListener('mouseenter', onEnter)
        node.addEventListener('mouseleave', onLeave)
      })
    }
    attach()
    const obs = new MutationObserver(attach)
    obs.observe(document.body, { childList: true, subtree: true })

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      obs.disconnect()
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '8px', height: '8px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.9)',
        border: '1px solid rgba(255,255,255,0.7)',
        marginLeft: '-4px', marginTop: '-4px',
        pointerEvents: 'none', zIndex: 9999,
        willChange: 'transform',
        transform: 'translate3d(-200px,-200px,0)',
        transition: 'width 0.15s ease, height 0.15s ease, margin 0.15s ease, border-color 0.15s ease, background 0.15s ease',
      }}
    />
  )
}

/* ─── Parallax Watermark (between Pioneer → Archive) ────────────── */
function ParallaxWatermark() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [800, 4000], [0, -140])

  return (
    <div className="relative overflow-hidden pointer-events-none select-none"
      style={{ height: '60px', margin: '-20px 0' }}
    >
      <motion.div
        style={{ y }}
        className="absolute inset-0 flex items-center"
      >
        <span
          className="text-display whitespace-nowrap tracking-[0.25em]"
          style={{
            fontSize: 'clamp(28px, 5vw, 56px)',
            color: 'rgba(204,255,0,0.035)',
          }}
        >
          110CM_VERIFIED · 110CM_VERIFIED · 110CM_VERIFIED · 110CM_VERIFIED
        </span>
      </motion.div>
    </div>
  )
}

/* ─── Preloader ─────────────────────────────────────────────────── */
const SHARD_COUNT = 8

function Preloader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0)
  const [exiting,  setExiting]  = useState(false)
  const doneRef = useRef(false)

  useEffect(() => {
    let val = 0
    const step = () => {
      const bump = Math.random() * 14 + 4
      val = Math.min(val + bump, 100)
      setProgress(Math.floor(val))
      if (val < 100) {
        setTimeout(step, 90 + Math.random() * 80)
      } else {
        setTimeout(() => {
          setExiting(true)
          setTimeout(() => { if (!doneRef.current) { doneRef.current = true; onDone() } }, 900)
        }, 350)
      }
    }
    setTimeout(step, 120)
  }, [onDone])

  const shards = useMemo(() =>
    Array.from({ length: SHARD_COUNT }, (_, i) => ({
      delay: i * 0.048,
      y: i % 2 === 0 ? '-105%' : '105%',
    })), [])

  return (
    <motion.div
      className="fixed inset-0 z-[9999] overflow-hidden"
      exit={{ opacity: 1 }}
    >
      {/* Vertical shard columns — they slide away on exit */}
      {shards.map((s, i) => (
        <motion.div
          key={i}
          className="absolute top-0 h-full"
          style={{
            left:  `${(i / SHARD_COUNT) * 100}%`,
            width: `${100 / SHARD_COUNT}%`,
            background: '#080A0C',
          }}
          animate={exiting ? { y: s.y } : { y: '0%' }}
          transition={{ duration: 0.7, delay: s.delay, ease: [0.76, 0, 0.24, 1] }}
        />
      ))}

      {/* Centered content — above shards */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 pointer-events-none">
        <motion.p
          className="text-display text-[#CCFF00] text-sm tracking-[0.35em] uppercase"
          animate={{ opacity: exiting ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          CALIBRATING VERTICAL: {progress}%
        </motion.p>

        {/* Vertical progress bar */}
        <div className="relative w-px h-32 bg-white/10">
          <motion.div
            className="absolute bottom-0 left-0 w-full bg-[#CCFF00]"
            style={{ boxShadow: '0 0 12px #CCFF00, 0 0 30px rgba(204,255,0,0.3)' }}
            animate={{ height: `${progress}%` }}
            transition={{ duration: 0.12, ease: 'linear' }}
          />
        </div>

        <motion.p
          className="text-body text-white/30 text-xs tracking-[0.5em] uppercase"
          animate={{ opacity: exiting ? 0 : [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          TASHKENT → WORLD
        </motion.p>
      </div>
    </motion.div>
  )
}

/* ─── Navigation ────────────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      style={{
        background: scrolled ? 'rgba(8,10,12,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
        transition: 'background 0.4s ease, backdrop-filter 0.4s ease',
      }}
    >
      <a href="/ibrohim" className="flex items-center gap-2 group">
        <Image
          src="/images/logo-new.png"
          alt="Ibrohim"
          width={120}
          height={48}
          className="object-contain"
          style={{
            filter: 'drop-shadow(0 0 10px rgba(204,255,0,0.4))',
            maxHeight: '44px',
            width: 'auto',
            transition: 'filter 0.3s',
          }}
        />
      </a>
      {/* Menu shifted 40px left for breathing room before RECRUIT */}
      <div
        className="hidden md:flex items-center gap-8"
        style={{ transform: 'translateX(-40px)' }}
      >
        {[
          { label: 'STATS',    href: '#stats' },
          { label: 'FILM',     href: '#film' },
          { label: 'STORY',    href: '#story' },
          { label: 'IBRO', href: '/protocol' },
          { label: 'SHOP',     href: '/shop' },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="nav-link text-body text-white/50 text-[11.5px] tracking-[0.3em] uppercase"
          >
            {item.label}
          </a>
        ))}
      </div>
      <motion.a
        href="#contact"
        className="recruit-btn relative text-body uppercase flex items-center gap-2 px-5 py-2.5 border border-[#CCFF00]/60 text-[#CCFF00] rounded-sm"
        style={{ letterSpacing: '2px', fontSize: '11px' }}
        whileHover={{
          backgroundColor: '#CCFF00',
          color: '#080A0C',
          boxShadow: '0 0 18px rgba(204,255,0,0.45), 0 0 36px rgba(204,255,0,0.15)',
        }}
        transition={{ duration: 0.2 }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] flex-shrink-0" />
        RECRUIT
      </motion.a>
    </motion.nav>
  )
}

/* ─── 1. LAUNCHPAD — Hero ───────────────────────────────────────── */
function HeroSection() {
  return (
    <section
      id="hero"
      className="relative w-full"
      style={{
        height: '160vh',
        /* Фон на секции — ниже canvas (z-auto < z-40), мяч летит над ним */
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(10,20,60,0.6) 0%, #080A0C 70%)',
      }}
    >
      {/* Sticky-контейнер без фона, z-[45] — выше canvas z-40.
          Мяч виден сквозь прозрачный контейнер, но текст перед мячом. */}
      <div
        className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ zIndex: 45 }}
      >
        {/* Giant outline name — теперь выше мяча, т.к. контейнер z-45 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <h1
            style={{
              fontFamily: "'Michroma', 'Rajdhani', monospace",
              fontSize: 'clamp(64px, 15vw, 220px)',
              letterSpacing: '4px',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(204,255,0,0.55)',
              textShadow: '0 0 30px rgba(204,255,0,0.15)',
              userSelect: 'none',
              lineHeight: 1,
            }}
          >
            IBROHIM
          </h1>
        </div>

        {/* Overlay content — z-10, above the ball */}
        <div className="relative z-10 flex flex-col items-center gap-8 mt-auto mb-24 px-6 text-center pointer-events-none">

          {/* Verified Metric Badge */}
          <motion.div
            className="glass-card-lime flex items-center gap-3 px-5 py-3"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ animation: 'float-badge 3s ease-in-out infinite' }}
          >
            <span
              className="w-2 h-2 rounded-full bg-[#CCFF00] flex-shrink-0"
              style={{ animation: 'pulse-lime 1.8s ease-out infinite' }}
            />
            <span className="text-display text-[#CCFF00] text-sm tracking-[0.3em] lime-text-glow">
              MAX VERT: 110CM
            </span>
            <span className="text-body text-white/40 text-xs tracking-[0.2em]">VERIFIED</span>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            {[
              { label: 'PG', desc: 'POINT GUARD' },
              { label: '192CM', desc: 'THE FRAME' },
              { label: '75KG', desc: 'OPTIMIZED' },
              { label: 'UZB', desc: 'ORIGIN' },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-4">
                {i > 0 && <span className="w-px h-6 bg-white/15" />}
                <div className="text-center">
                  <div className="text-display text-white text-base tracking-[0.15em]">{stat.label}</div>
                  <div className="text-body text-white/35 text-[10px] tracking-[0.3em]">{stat.desc}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Tagline — top portion */}
        <motion.div
          className="absolute top-24 left-8 z-10 pointer-events-none"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <p className="text-display text-white/20 text-xs tracking-[0.45em] uppercase">
            THE VERTICAL OUTLIER
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <span className="text-body text-white/30 text-[10px] tracking-[0.4em]">SCROLL</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown size={14} className="text-white/30" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

/* ─── 2. STATS LAB — Anatomy of a Prospect ─────────────────────── */

interface StatCardProps {
  index: number
  metric: string
  value: string
  unit: string
  label: string
  desc: string
  highlight?: boolean
  offset?: string
}

function StatCard({ index, metric, value, unit, label, desc, highlight, offset }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 20 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 20 })

  const handleMouse = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set(((e.clientX - rect.left) / rect.width) - 0.5)
    y.set(((e.clientY - rect.top)  / rect.height) - 0.5)
  }, [x, y])

  return (
    <motion.div
      ref={ref}
      className={`relative cursor-default ${highlight ? 'glass-card-lime lime-glow' : 'glass-card'} p-6`}
      style={{
        transformStyle: 'preserve-3d',
        rotateX,
        rotateY,
        marginTop: offset,
        minHeight: '200px',
      }}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0) }}
    >
      {/* Lead-line dot */}
      <span
        className="absolute -top-px -right-px w-3 h-3 rounded-full"
        style={{ background: highlight ? '#CCFF00' : 'rgba(240,247,255,0.3)' }}
      />

      <div className="text-body text-white/35 text-[10px] tracking-[0.4em] uppercase mb-4">
        {metric}
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span
          className="text-display leading-none"
          style={{
            fontSize: 'clamp(56px, 8vw, 96px)',
            color: highlight ? '#CCFF00' : '#F0F7FF',
            textShadow: highlight ? '0 0 30px rgba(204,255,0,0.4)' : '0 0 20px rgba(240,247,255,0.2)',
          }}
        >
          {value}
        </span>
        <span className="text-display text-white/50 text-xl tracking-widest">{unit}</span>
      </div>

      <div className="text-display text-white text-lg tracking-[0.1em] mb-2">{label}</div>
      <div className="text-body text-white/40 text-sm leading-relaxed max-w-[18ch]">{desc}</div>
    </motion.div>
  )
}

function StatsLabSection() {
  const stats: StatCardProps[] = [
    {
      index: 0,
      metric: '01 / FRAME',
      value: '192',
      unit: 'CM',
      label: 'HEIGHT',
      desc: 'Elite guard height. Sees over every defender on the floor.',
      offset: '0px',
    },
    {
      index: 1,
      metric: '02 / WEAPON',
      value: '110',
      unit: 'CM',
      label: 'VERTICAL JUMP',
      desc: 'Maximum standing vertical. Rewrites the PG position archetype entirely.',
      highlight: true,
      offset: '28px',
    },
    {
      index: 2,
      metric: '03 / ENGINE',
      value: '75',
      unit: 'KG',
      label: 'OPTIMIZED MASS',
      desc: 'Zero excess weight. Pure explosive output.',
      offset: '-16px',
    },
    {
      index: 3,
      metric: '04 / VISION',
      value: 'PG',
      unit: '/#1',
      label: 'POSITION',
      desc: '360° court awareness. The general of every lineup.',
      offset: '12px',
    },
    {
      index: 4,
      metric: '05 / REACH',
      value: '198',
      unit: 'CM',
      label: 'WINGSPAN',
      desc: 'Two-meter wingspan on a guard frame. Elite passing lanes and shot contest.',
      offset: '20px',
    },
    {
      index: 5,
      metric: '06 / BURST',
      value: '3.1',
      unit: 'SEC',
      label: '0–30M SPRINT',
      desc: 'Sub-3.2 seconds. The fastest first step at 192cm.',
      offset: '-8px',
    },
    {
      index: 6,
      metric: '07 / SHOT',
      value: '38',
      unit: '%',
      label: '3PT ACCURACY',
      desc: 'Consistent release, elite mechanics. Shoots with volume.',
      offset: '16px',
    },
    {
      index: 7,
      metric: '08 / HORIZON',
      value: '19',
      unit: 'YRS',
      label: 'AGE — CEILING OPEN',
      desc: 'Peak years still ahead. Every metric trending upward. No ceiling in sight.',
      offset: '-4px',
    },
  ]

  return (
    <section id="stats" className="relative py-14 px-6 md:px-16 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #080A0C 0%, #040608 100%)' }}
    >
      {/* SVG lead lines */}
      <svg
        className="absolute top-0 right-0 w-1/3 h-full pointer-events-none opacity-15"
        style={{ zIndex: 0 }}
        viewBox="0 0 400 900"
        preserveAspectRatio="none"
      >
        {[200, 300, 420, 540, 650, 760].map((y, i) => (
          <line key={i} x1="390" y1="10" x2={280 + (i % 2) * 60} y2={y}
            stroke="#CCFF00" strokeWidth="0.5" strokeDasharray="4 6" />
        ))}
        <circle cx="390" cy="10" r="3" fill="#CCFF00" />
      </svg>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-body text-[#CCFF00] text-xs tracking-[0.5em] uppercase mb-3">
            SECTION 02
          </p>
          <h2
            className="text-display text-white leading-none"
            style={{ fontSize: 'clamp(42px, 7vw, 88px)' }}
          >
            THE ANATOMY<br />OF A PROSPECT
          </h2>
          <div className="w-16 h-px bg-[#CCFF00] mt-4" />
        </motion.div>

        {/* 4-column broken grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-start">
          {stats.map((s) => <StatCard key={s.metric} {...s} />)}
        </div>

        {/* Bottom callout */}
        <motion.div
          className="mt-7 flex flex-col md:flex-row items-start md:items-center gap-5 glass-card p-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <div className="flex-1">
            <p className="text-display text-white/30 text-sm tracking-[0.3em] uppercase mb-1">
              COMPOSITE RATING
            </p>
            <p className="text-body text-white/65 text-base leading-relaxed max-w-lg">
              A 192cm point guard with a 110cm vertical, 198cm wingspan and sub-3.1s burst.{' '}
              <span className="text-[#CCFF00]">This profile does not exist in any database.</span>
            </p>
          </div>
          <div className="text-display text-[#CCFF00] lime-text-glow flex-shrink-0"
            style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}
          >
            ∞
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ─── 3. THE 110CM PARADOX ──────────────────────────────────────── */
/* ─── Hover-play video column ────────────────────────────────────── */
function HoverVideo({
  src, label, delay,
}: { src: string; label: string; delay: number }) {
  const vidRef  = useRef<HTMLVideoElement>(null)
  const [on, setOn] = useState(false)

  const enter = useCallback(() => {
    setOn(true)
    vidRef.current?.play().catch(() => {})
  }, [])
  const leave = useCallback(() => {
    setOn(false)
    if (vidRef.current) { vidRef.current.pause(); vidRef.current.currentTime = 0 }
  }, [])

  return (
    <motion.div
      style={{
        position: 'relative', overflow: 'hidden', cursor: 'none',
        borderRight: '1px solid rgba(255,255,255,0.04)',
      }}
      initial={{ opacity: 0, scale: 1.04 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      {/* Video */}
      <video
        ref={vidRef}
        src={src}
        muted loop playsInline preload="metadata"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%', objectFit: 'cover',
          filter: on
            ? 'saturate(0.75) brightness(0.85) contrast(1.1)'
            : 'saturate(0) brightness(0.55) contrast(1.15)',
          transition: 'filter 0.5s ease',
        }}
      />

      {/* Scanlines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.14) 2px, rgba(0,0,0,0.14) 3px)',
        opacity: on ? 0.4 : 1, transition: 'opacity 0.5s',
      }} />

      {/* Top-left viewfinder corner */}
      <div style={{
        position: 'absolute', top: 16, left: 16, width: 14, height: 14,
        borderTop: '1px solid rgba(204,255,0,0.6)',
        borderLeft: '1px solid rgba(204,255,0,0.6)',
        opacity: on ? 1 : 0.4, transition: 'opacity 0.3s',
      }} />
      <div style={{
        position: 'absolute', bottom: 16, right: 16, width: 14, height: 14,
        borderBottom: '1px solid rgba(204,255,0,0.6)',
        borderRight: '1px solid rgba(204,255,0,0.6)',
        opacity: on ? 1 : 0.4, transition: 'opacity 0.3s',
      }} />

      {/* Play indicator */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 48, height: 48, borderRadius: '50%',
        border: '1px solid rgba(204,255,0,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: on ? 0 : 0.7, transition: 'opacity 0.3s',
        pointerEvents: 'none',
      }}>
        <div style={{
          width: 0, height: 0,
          borderTop: '8px solid transparent',
          borderBottom: '8px solid transparent',
          borderLeft: '14px solid rgba(204,255,0,0.8)',
          marginLeft: '3px',
        }} />
      </div>

      {/* Label */}
      <div style={{
        position: 'absolute', bottom: 18, left: 18,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '7px', letterSpacing: '0.35em',
        color: on ? 'rgba(204,255,0,0.75)' : 'rgba(204,255,0,0.35)',
        transition: 'color 0.3s',
      }}>
        {label}
      </div>

      {/* Lime glow on active */}
      {on && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          boxShadow: 'inset 0 0 60px rgba(204,255,0,0.06)',
        }} />
      )}
    </motion.div>
  )
}

function ParadoxSection() {
  return (
    <section
      id="paradox"
      style={{
        position: 'relative',
        height: '100vh',
        background: '#050505',
        overflow: 'hidden',
      }}
    >
      {/* Section label — top left */}
      <div style={{
        position: 'absolute', top: 24, left: 28, zIndex: 10,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '8px', letterSpacing: '0.45em',
        color: 'rgba(204,255,0,0.4)',
      }}>
        SECTION_03 / THE_110CM_PARADOX
      </div>

      {/* Two vertical video columns */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'grid', gridTemplateColumns: '1fr 1fr',
      }}>
        <HoverVideo
          src="/footage/jump-main.mp4"
          label="JUMP / 110CM_VERIFIED"
          delay={0.1}
        />
        <HoverVideo
          src="/footage/recruitment-reel.mp4"
          label="COURT / GAME_FOOTAGE"
          delay={0.2}
        />
      </div>

      {/* "THE CEILING IS MY FLOOR." — transparent outline, bottom center */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        zIndex: 10, textAlign: 'center',
        padding: '0 4% 28px',
        pointerEvents: 'none',
        /* Fade top so it blends with videos */
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 40%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 40%)',
      }}>
        <h2 style={{
          fontFamily: "'Bebas Neue', cursive",
          fontSize: 'clamp(52px, 11vw, 148px)',
          lineHeight: 0.88,
          color: 'transparent',
          WebkitTextStroke: '1px rgba(204,255,0,0.28)',
          letterSpacing: '0.01em',
          userSelect: 'none',
        }}>
          THE CEILING IS MY FLOOR.
        </h2>
      </div>

      {/* Centre divider line */}
      <div style={{
        position: 'absolute', top: '8%', bottom: '8%',
        left: '50%', width: '1px',
        background: 'rgba(204,255,0,0.08)',
        zIndex: 9, pointerEvents: 'none',
      }} />
    </section>
  )
}

/* ─── Site content types ──────────────────────────────────────────── */
interface ApiPioneerSlide {
  id?: string; label: string; title: string; copy: string; accent: string
}
interface ApiScoutReport {
  id: string; classification: string; agency: string; analyst: string
  date: string; rating: string; color: string; quote: string
}
interface SiteContent {
  pioneer?: ApiPioneerSlide[]
  scoutingReports?: ApiScoutReport[]
}

/* Hook: fetch editable content from admin panel (content.json via API) */
function useSiteContent(): SiteContent {
  const [content, setContent] = useState<SiteContent>({})
  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then((d) => setContent({
        pioneer: d.pioneer,
        scoutingReports: d.scoutingReports,
      }))
      .catch(() => {/* silently keep empty = use defaults */})
  }, [])
  return content
}

/* ─── 4. PIONEER NARRATIVE — Horizontal scroll story ────────────── */
const PIONEER_PANELS = [
  {
    label: '01 / ORIGIN',
    title: 'TASHKENT,\nUZBEKISTAN.',
    copy: 'A city of 3 million. One basketball court that mattered. The beginning of a trajectory no algorithm predicted.',
    accent: '#CCFF00',
    image: '/images/location.png',
    imageHint: 'TASHKENT TOPOGRAPHY',
  },
  {
    label: '02 / RESILIENCE',
    title: 'THE GRIND\nIS SILENT.',
    copy: "The grind isn't aesthetic. It's thousands of hours in empty gyms in Tashkent, refining the mechanics that gravity forgot.",
    accent: '#F0F7FF',
    image: '/images/arm.png',
    imageHint: 'ARM BIOMETRICS',
  },
  {
    label: '03 / THE PROTOCOL',
    title: 'LOGIC\nHAS LIMITS.',
    copy: 'Logic dictates limits. I choose to ignore them. By documenting every metric, I turn raw potential into scientific certainty.',
    accent: '#CCFF00',
    image: '/images/leg.png',
    imageHint: 'LEG KINETICS',
  },
  {
    label: '04 / GLOBAL VISION',
    title: 'FROM UZB\nTO THE WORLD.',
    copy: 'From Uzbekistan to the world stage. Re-defining the point guard archetype. The data is verified.',
    accent: '#F0F7FF',
    image: '/images/jump.png',
    imageHint: '110CM VERIFIED',
  },
  {
    label: '05 / THE LEGACY',
    title: 'FIRST.\nNOT LAST.',
    copy: 'From Tashkent to the NCAA. Redefining the reach of Central Asian basketball. One vertical at a time.',
    accent: '#CCFF00',
    image: '/images/univers.png',
    imageHint: 'GLOBAL STAGE',
  },
]

function PioneerSection({ apiPanels }: { apiPanels?: ApiPioneerSlide[] }) {
  const [[current, dir], setSlide] = useState([0, 0])
  const dragX = useRef(0)
  /* Merge: use API text/accent if available, keep hardcoded images */
  const panels = PIONEER_PANELS.map((p, i) => ({
    ...p,
    ...(apiPanels?.[i] ? {
      label: apiPanels[i].label,
      title: apiPanels[i].title,
      copy:  apiPanels[i].copy,
      accent: apiPanels[i].accent,
    } : {}),
  }))
  const TOTAL = panels.length

  const go = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(idx, TOTAL - 1))
    setSlide(([prev]) => [clamped, clamped > prev ? 1 : -1])
  }, [TOTAL])

  const prev = useCallback(() => go(current - 1), [current, go])
  const next = useCallback(() => go(current + 1), [current, go])

  /* Keyboard navigation */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft')  prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  const panel = panels[current]

  const variants = {
    enter:  (d: number) => ({ x: d >= 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: '0%', opacity: 1 },
    exit:   (d: number) => ({ x: d >= 0 ? '-60%' : '60%', opacity: 0 }),
  }

  return (
    <section
      id="story"
      className="relative h-screen overflow-hidden"
      style={{ background: '#04080F' }}
      onPointerDown={(e) => { dragX.current = e.clientX }}
      onPointerUp={(e) => {
        const delta = dragX.current - e.clientX
        if (delta >  60) next()
        if (delta < -60) prev()
      }}
    >
      {/* Section header — same style as all other sections */}
      <div className="absolute top-0 left-0 right-0 z-20 px-8 pt-6 flex items-baseline justify-between pointer-events-none">
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '8px', letterSpacing: '0.45em',
          color: 'rgba(204,255,0,0.45)',
        }}>
          SECTION_04 / THE_PIONEER_NARRATIVE
        </span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '7px', color: 'rgba(204,255,0,0.2)', letterSpacing: '0.05em',
        }}>
          {String(current + 1).padStart(2,'0')} / {String(TOTAL).padStart(2,'0')}
        </span>
      </div>

      {/* Animated slide — full width, image as background */}
      <AnimatePresence initial={false} custom={dir} mode="popLayout">
        <motion.div
          key={current}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
          style={{
            background: current % 2 === 0
              ? 'linear-gradient(135deg, #04080F 0%, #060C18 100%)'
              : 'linear-gradient(135deg, #060C1A 0%, #080A10 100%)',
          }}
        >
          {/* ── BACKGROUND: image fills full slide at low opacity ── */}
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={panel.image}
              alt={panel.imageHint}
              fill
              className="object-contain"
              style={{
                objectPosition: 'center center',
                opacity: 0.20,
                filter: panel.accent === '#CCFF00'
                  ? 'saturate(0.5) sepia(0.3) hue-rotate(40deg) brightness(0.95)'
                  : 'saturate(0.3) brightness(0.7)',
                /* Fade all edges symmetrically — no cropping, full image visible */
                maskImage: 'radial-gradient(ellipse 80% 85% at 60% 50%, black 50%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(ellipse 80% 85% at 60% 50%, black 50%, transparent 100%)',
              }}
              sizes="100vw"
              priority
            />
          </motion.div>

          {/* ── FOREGROUND: text content, left-aligned ── */}
          <div className="relative z-10 h-full flex flex-col justify-center px-12 md:px-20 pt-16">

            {/* Slide label */}
            <motion.p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '8px', letterSpacing: '0.45em',
                color: 'rgba(255,255,255,0.3)',
                marginBottom: '24px', textTransform: 'uppercase',
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              {panel.label}
            </motion.p>

            {/* Title */}
            <motion.h3
              className="text-display leading-[0.9] whitespace-pre-line"
              style={{
                fontSize: 'clamp(48px, 7.5vw, 108px)',
                color: panel.accent,
                WebkitTextStroke: panel.accent === '#CCFF00'
                  ? '0.5px rgba(204,255,0,0.6)'
                  : '0.5px rgba(240,247,255,0.4)',
                textShadow: panel.accent === '#CCFF00'
                  ? '0 0 50px rgba(204,255,0,0.25), 0 2px 0 rgba(0,0,0,0.9)'
                  : '0 0 40px rgba(240,247,255,0.12), 0 2px 0 rgba(0,0,0,0.9)',
                marginBottom: '28px',
              }}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {panel.title}
            </motion.h3>

            {/* Copy */}
            <motion.p
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(14px, 1.3vw, 18px)',
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.55)',
                maxWidth: '420px',
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.5 }}
            >
              {panel.copy}
            </motion.p>
          </div>

          {/* Large background slide number */}
          <span
            className="absolute right-10 bottom-12 text-display outline-stroke pointer-events-none select-none z-0"
            style={{ fontSize: 'clamp(100px, 18vw, 240px)', opacity: 0.06 }}
          >
            {String(current + 1).padStart(2, '0')}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* ── Bottom controls ── */}
      <div className="absolute bottom-8 left-0 right-0 z-30 px-8 flex items-center justify-between">

        {/* Arrows + counter */}
        <div className="flex items-center gap-3">
          <motion.button
            onClick={prev}
            disabled={current === 0}
            className="w-11 h-11 rounded-sm flex items-center justify-center border text-base font-bold transition-colors duration-200"
            style={{
              borderColor: current === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(204,255,0,0.5)',
              color:       current === 0 ? 'rgba(255,255,255,0.2)' : '#CCFF00',
              background:  current === 0 ? 'transparent' : 'rgba(204,255,0,0.06)',
            }}
            whileTap={{ scale: 0.88 }}
          >←</motion.button>

          <motion.button
            onClick={next}
            disabled={current === TOTAL - 1}
            className="w-11 h-11 rounded-sm flex items-center justify-center border text-base font-bold transition-colors duration-200"
            style={{
              borderColor: current === TOTAL - 1 ? 'rgba(255,255,255,0.08)' : 'rgba(204,255,0,0.5)',
              color:       current === TOTAL - 1 ? 'rgba(255,255,255,0.2)' : '#CCFF00',
              background:  current === TOTAL - 1 ? 'transparent' : 'rgba(204,255,0,0.06)',
            }}
            whileTap={{ scale: 0.88 }}
          >→</motion.button>

          <span className="text-body text-white/35 text-xs tracking-[0.45em] font-mono ml-1">
            {String(current + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
          </span>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center gap-2">
          {panels.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className="h-px transition-all duration-300"
              style={{
                width:      i === current ? '28px' : '10px',
                background: i === current ? '#CCFF00' : 'rgba(255,255,255,0.2)',
                boxShadow:  i === current ? '0 0 8px #CCFF00' : 'none',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── 5. THE VAULT — Film Room ──────────────────────────────────── */

interface VaultSocial {
  platform: 'instagram' | 'tiktok'
  url: string
  label: string
}

interface VaultMeta {
  date: string
  location: string
  metric: string
}

interface VaultCardProps {
  index: number
  category: string
  title: string
  duration: string
  gradient: string
  src: string
  social?: VaultSocial
  meta?: VaultMeta
}

function VaultCard({ index, category, title, duration, gradient, src, social, meta }: VaultCardProps) {
  const [hovered, setHovered] = useState(false)
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <motion.div
        className="relative overflow-hidden rounded-2xl cursor-pointer"
        initial={{ opacity: 0, y: 50, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -8, scale: 1.02 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onClick={() => setExpanded(true)}
        style={{ aspectRatio: '16/10' }}
      >
        {/* Gradient base */}
        <div className="absolute inset-0" style={{ background: gradient }} />

        {/* Video — plays on hover */}
        <video
          src={src}
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: hovered ? 0.88 : 0 }}
          ref={(el) => { if (el) hovered ? el.play().catch(() => {}) : el.pause() }}
        />

        {/* Cinematic scanline overlay — always on */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.22) 3px, rgba(0,0,0,0.22) 4px)',
            mixBlendMode: 'multiply',
          }}
        />

        {/* Category badge */}
        <div className="absolute top-4 left-4 z-20">
          <span className="text-body text-[#CCFF00] text-[9px] tracking-[0.5em] uppercase px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-sm border border-[#CCFF00]/30">
            [{category}]
          </span>
        </div>

        {/* Duration */}
        <div className="absolute top-4 right-4 z-20 text-body text-white/40 text-xs tracking-widest">
          {duration}
        </div>

        {/* Metadata overlay — appears on hover */}
        <motion.div
          className="absolute inset-x-0 top-0 z-20 p-4 pt-14"
          style={{
            background: 'linear-gradient(to bottom, rgba(4,6,12,0.85) 0%, transparent 100%)',
            backdropFilter: hovered ? 'blur(0px)' : 'none',
          }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : -8 }}
          transition={{ duration: 0.25 }}
        >
          {meta && (
            <div className="flex items-center gap-4 mt-2">
              {[
                { k: 'DATE',     v: meta.date },
                { k: 'LOCATION', v: meta.location },
                { k: 'METRIC',   v: meta.metric },
              ].map((m) => (
                <div key={m.k} className="flex flex-col">
                  <span className="text-body text-white/30 text-[8px] tracking-[0.4em] uppercase">{m.k}</span>
                  <span className="text-body text-[#CCFF00] text-[10px] tracking-[0.2em] font-semibold">{m.v}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Play + Social row — center on hover */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center gap-5 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-14 h-14 rounded-full border-2 border-[#CCFF00] flex items-center justify-center lime-glow">
            <Play size={18} className="text-[#CCFF00] ml-1" fill="#CCFF00" />
          </div>

          {social && (
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 px-4 py-2 rounded-sm text-body text-[10px] tracking-[0.3em] uppercase transition-colors duration-200"
              style={{
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(204,255,0,0.3)',
                color: '#CCFF00',
              }}
            >
              <ExternalLink size={10} />
              {social.label}
            </a>
          )}
        </motion.div>

        {/* Bottom info bar */}
        <div
          className="absolute bottom-0 left-0 right-0 p-5 z-20"
          style={{ background: 'linear-gradient(to top, rgba(4,6,12,0.96) 0%, transparent 100%)' }}
        >
          <p className="text-display text-white text-lg tracking-[0.06em]">{title}</p>
          <p className="text-body text-white/35 text-[10px] tracking-widest mt-1 uppercase">
            {social ? `${social.platform.toUpperCase()} · CLICK TO EXPAND` : 'CLICK TO EXPAND'}
          </p>
        </div>
      </motion.div>

      {/* Cinema Mode */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center p-6"
            style={{ background: 'rgba(4,6,12,0.96)', backdropFilter: 'blur(32px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpanded(false)}
          >
            <motion.div
              className="relative w-full max-w-4xl glass-card p-6"
              initial={{ scale: 0.88, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Scanline on cinema too */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none z-10 opacity-10"
                style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.5) 3px, rgba(0,0,0,0.5) 4px)' }}
              />

              <div className="w-full rounded-xl mb-4 overflow-hidden relative"
                style={{ aspectRatio: '16/9', background: gradient }}
              >
                <video src={src} controls playsInline autoPlay className="w-full h-full object-cover" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body text-white/40 text-[10px] tracking-[0.5em] uppercase mb-1">{category}</p>
                  <p className="text-display text-white text-xl tracking-wider">{title}</p>
                  {meta && (
                    <div className="flex items-center gap-4 mt-2">
                      {[meta.date, meta.location, meta.metric].map((v, i) => (
                        <span key={i} className="text-body text-[#CCFF00]/60 text-[10px] tracking-widest">{v}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {social && (
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 border border-[#CCFF00]/30 text-[#CCFF00] text-body text-xs tracking-[0.3em] uppercase rounded-sm hover:bg-[#CCFF00]/10 transition-colors"
                    >
                      <ExternalLink size={11} />
                      {social.platform === 'instagram' ? 'INSTAGRAM' : 'TIKTOK'}
                    </a>
                  )}
                  <button
                    onClick={() => setExpanded(false)}
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-[#CCFF00]/50 transition-colors"
                  >
                    <X size={16} className="text-white/60" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ─── ACHIEVEMENTS SECTION — Evidence Board ──────────────────────── */

const ARCHIVE_PHOTOS = [
  {
    src: '/images/ref-1.png',
    id: 'A-001',
    caption: 'TASHKENT · ORIGIN',
    stat: '110',
    unit: 'CM',
    label: 'VERTICAL JUMP',
    rotation: -2.4,
    offsetY: 0,
  },
  {
    src: '/images/ref-2.png',
    id: 'A-002',
    caption: 'TRAINING SESSION',
    stat: '192',
    unit: 'CM',
    label: 'HEIGHT',
    rotation: 1.8,
    offsetY: 28,
  },
  {
    src: '/images/ref-3.png',
    id: 'A-003',
    caption: 'COURT VISION',
    stat: '#1',
    unit: 'PG',
    label: 'POSITION',
    rotation: -1.2,
    offsetY: -16,
  },
  {
    src: '/images/ref-4.png',
    id: 'A-004',
    caption: 'EXPLOSIVE POWER',
    stat: '75',
    unit: 'KG',
    label: 'OPTIMIZED MASS',
    rotation: 2.8,
    offsetY: 20,
  },
  {
    src: '/images/ref-5.png',
    id: 'A-005',
    caption: 'PIONEER · 2024',
    stat: '01',
    unit: 'UZB',
    label: 'FIRST IN CLASS',
    rotation: -3.1,
    offsetY: 8,
  },
]

const KEY_ACHIEVEMENTS = [
  { number: '110',  unit: 'CM',      label: 'STANDING VERTICAL' },
  { number: '192',  unit: 'CM',      label: 'HEIGHT' },
  { number: '2024', unit: 'SEASON',  label: 'ACTIVE' },
  { number: 'PG',   unit: '#1',      label: 'POSITION' },
  { number: 'UZB',  unit: '🌍',     label: 'ORIGIN' },
]

function ArchivePhoto({
  src, id, caption, stat, unit, label, rotation, offsetY, index,
}: typeof ARCHIVE_PHOTOS[0] & { index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      className="relative flex-shrink-0"
      style={{ marginTop: offsetY }}
      initial={{ opacity: 0, y: 50, rotate: rotation }}
      whileInView={{ opacity: 1, y: 0, rotate: rotation }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      animate={{ rotate: hovered ? 0 : rotation, scale: hovered ? 1.06 : 1, zIndex: hovered ? 20 : index }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Achievement callout — floats above on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute -top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
            initial={{ opacity: 0, y: 8, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.18 }}
          >
            <div
              className="px-4 py-2 text-center whitespace-nowrap"
              style={{
                background: '#CCFF00',
                boxShadow: '0 0 20px rgba(204,255,0,0.5)',
              }}
            >
              <div
                className="leading-none"
                style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '22px', color: '#080A0C', letterSpacing: '0.06em' }}
              >
                {stat}<span style={{ fontSize: '14px', marginLeft: '2px' }}>{unit}</span>
              </div>
              <div
                className="text-[#080A0C]/70 uppercase"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '8px', letterSpacing: '0.4em' }}
              >
                {label}
              </div>
            </div>
            {/* Arrow tip */}
            <div className="w-0 h-0 mx-auto"
              style={{
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '7px solid #CCFF00',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Polaroid frame */}
      <div
        className="relative overflow-hidden"
        style={{
          background: '#F2F0EE',
          padding: '8px 8px 36px 8px',
          boxShadow: hovered
            ? '0 12px 50px rgba(0,0,0,0.8), 0 0 0 1px rgba(204,255,0,0.3), 0 0 30px rgba(204,255,0,0.12)'
            : '0 8px 32px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.5)',
          transition: 'box-shadow 0.3s',
        }}
      >
        {/* Photo */}
        <div className="relative overflow-hidden" style={{ width: '180px', height: '200px' }}>
          <Image
            src={src}
            alt={caption}
            fill
            className="object-cover"
            sizes="180px"
          />
          {/* Scanline on photo */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 3px)',
            }}
          />
        </div>

        {/* ID label — top left corner over image */}
        <div className="absolute top-3 left-3 z-10">
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '8px',
              color: 'rgba(204,255,0,0.9)',
              background: 'rgba(0,0,0,0.75)',
              padding: '2px 5px',
              letterSpacing: '0.3em',
              backdropFilter: 'blur(4px)',
            }}
          >
            {id}
          </span>
        </div>

        {/* Caption strip inside Polaroid white border */}
        <div className="absolute bottom-0 left-0 right-0 h-9 flex items-center justify-center">
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '8px',
              color: '#1A1A1A',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              opacity: 0.7,
            }}
          >
            {caption}
          </span>
        </div>
      </div>

      {/* Push-pin */}
      <div
        className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full z-20 flex items-center justify-center"
        style={{
          background: hovered ? '#CCFF00' : 'rgba(204,255,0,0.5)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
          transition: 'background 0.2s',
        }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-black/40" />
      </div>
    </motion.div>
  )
}

function AchievementsSection() {
  return (
    <section
      className="relative py-12 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #04060A 0%, #060810 100%)' }}
    >
      {/* Cork board texture */}
      <div
        className="absolute inset-0 opacity-[0.018] pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(204,255,0,0.8) 1px, transparent 1px),
            radial-gradient(circle at 80% 70%, rgba(204,255,0,0.8) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px, 80px 80px, 40px 40px',
        }}
      />

      {/* Section header */}
      <div className="px-6 md:px-16 mb-7">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-body text-[#CCFF00] text-xs tracking-[0.5em] uppercase mb-3">
              SECTION 04.5 / DOCUMENTED
            </p>
            <h2
              className="text-display text-white leading-none"
              style={{ fontSize: 'clamp(42px, 7vw, 88px)' }}
            >
              THE<br />ARCHIVE
            </h2>
          </motion.div>
          <motion.p
            className="text-body text-white/35 text-sm leading-relaxed max-w-xs"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Every frame verified. Every metric on record.
            Hover to reveal the data behind each shot.
          </motion.p>
        </div>
      </div>

      {/* Photos — scattered Polaroid board */}
      <div className="px-6 md:px-16 mb-7">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 items-start"
            style={{ perspective: '800px' }}
          >
            {ARCHIVE_PHOTOS.map((p, i) => (
              <ArchivePhoto key={p.id} {...p} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Key achievements bar */}
      <div className="px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-5 gap-px overflow-hidden rounded-xl"
            style={{ border: '1px solid rgba(255,255,255,0.06)' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {KEY_ACHIEVEMENTS.map((a, i) => (
              <motion.div
                key={a.label}
                className="flex flex-col items-center justify-center py-6 px-4 text-center relative"
                style={{ background: 'rgba(255,255,255,0.025)' }}
                whileHover={{ background: 'rgba(204,255,0,0.05)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35 + i * 0.07, duration: 0.5 }}
              >
                <div
                  className="leading-none mb-1"
                  style={{
                    fontFamily: "'Bebas Neue', cursive",
                    fontSize: 'clamp(28px, 4vw, 48px)',
                    color: '#CCFF00',
                    textShadow: '0 0 20px rgba(204,255,0,0.3)',
                  }}
                >
                  {a.number}
                  <span style={{ fontSize: '0.4em', marginLeft: '3px', color: 'rgba(204,255,0,0.6)' }}>
                    {a.unit}
                  </span>
                </div>
                <div
                  className="text-white/30 uppercase"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '9px', letterSpacing: '0.4em' }}
                >
                  {a.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

const VAULT_REELS: VaultCardProps[] = [
  {
    index: 0,
    category: '01 / ORIGIN',
    title: 'WHERE IT STARTED',
    duration: '—',
    src: '/footage/recruitment-reel.mp4',
    gradient: 'linear-gradient(135deg, #0C0A02 0%, #1A1408 50%, #080602 100%)',
    social: {
      platform: 'instagram',
      url: 'https://www.instagram.com/ibrohim_basketball/reels/',
      label: 'VIEW ON INSTAGRAM',
    },
    meta: { date: '2022', location: 'TASHKENT, UZB', metric: 'THE BEGINNING' },
  },
  {
    index: 1,
    category: '02 / THE JUMP',
    title: 'MAX VERTICAL — 110CM',
    duration: '—',
    src: '/footage/jump-main.mp4',
    gradient: 'linear-gradient(135deg, #02100C 0%, #041A10 50%, #021208 100%)',
    social: {
      platform: 'tiktok',
      url: 'https://www.tiktok.com/@ibrohim.2real?lang=ru-RU',
      label: 'VIEW ON TIKTOK',
    },
    meta: { date: '2024', location: 'TASHKENT, UZB', metric: 'VERT: 110CM' },
  },
  {
    index: 2,
    category: '03 / GROUND WORK',
    title: 'TRAINING PROTOCOL',
    duration: '—',
    src: '/footage/training-raw.mp4',
    gradient: 'linear-gradient(135deg, #100210 0%, #1A0420 50%, #0E0218 100%)',
    social: {
      platform: 'instagram',
      url: 'https://www.instagram.com/ibrohim_basketball/reels/',
      label: 'MORE ON INSTAGRAM',
    },
    meta: { date: '2024', location: 'TASHKENT, UZB', metric: 'EVAP-110' },
  },
  {
    index: 3,
    category: '04 / RECRUITMENT REEL',
    title: 'FULL SEASON CUT 2024',
    duration: '—',
    src: '/footage/recruitment-reel.mp4',
    gradient: 'linear-gradient(135deg, #0A1628 0%, #0F2040 50%, #061020 100%)',
    social: {
      platform: 'instagram',
      url: 'https://www.instagram.com/ibrohim_basketball/reels/',
      label: 'VIEW ON INSTAGRAM',
    },
    meta: { date: '2024', location: 'TASHKENT, UZB', metric: 'VERT: 110CM' },
  },
  {
    index: 4,
    category: '05 / SIGNATURE MOVES',
    title: 'POINT GUARD MECHANICS',
    duration: '—',
    src: '/footage/jump-main.mp4',
    gradient: 'linear-gradient(135deg, #180808 0%, #280C0C 50%, #140606 100%)',
    social: {
      platform: 'tiktok',
      url: 'https://www.tiktok.com/@ibrohim.2real?lang=ru-RU',
      label: 'VIEW ON TIKTOK',
    },
    meta: { date: '2024', location: 'TASHKENT, UZB', metric: 'PG / #1' },
  },
  {
    index: 5,
    category: '06 / GAME DAY',
    title: 'COMPETITION FOOTAGE',
    duration: '—',
    src: '/footage/training-raw.mp4',
    gradient: 'linear-gradient(135deg, #080A1A 0%, #0C1030 50%, #060818 100%)',
    social: {
      platform: 'instagram',
      url: 'https://www.instagram.com/ibrohim_basketball/reels/',
      label: 'MORE ON INSTAGRAM',
    },
    meta: { date: '2024', location: 'TASHKENT, UZB', metric: 'LIVE GAME' },
  },
]

function VaultSection() {
  const [current, setCurrent]   = useState(0)
  const [perView, setPerView]   = useState(3)
  const [cardW, setCardW]       = useState(0)
  const trackRef                = useRef<HTMLDivElement>(null)
  const pointerStartX           = useRef(0)
  const GAP = 20
  const TOTAL = VAULT_REELS.length
  const maxIdx = Math.max(0, TOTAL - perView)

  useEffect(() => {
    const calc = () => {
      if (!trackRef.current) return
      const pv = window.innerWidth < 768 ? 1 : window.innerWidth < 1200 ? 2 : 3
      setPerView(pv)
      setCardW((trackRef.current.offsetWidth - GAP * (pv - 1)) / pv)
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  useEffect(() => {
    setCurrent((c) => Math.min(c, Math.max(0, TOTAL - perView)))
  }, [perView, TOTAL])

  const prev = useCallback(() => setCurrent((c) => Math.max(c - 1, 0)), [])
  const next = useCallback(() => setCurrent((c) => Math.min(c + 1, maxIdx)), [maxIdx])

  return (
    <section id="film" className="relative py-14 px-6 md:px-16"
      style={{ background: 'linear-gradient(180deg, #040608 0%, #060A10 100%)' }}
    >
      <div>

        {/* Header — same style as all other sections */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Label — JetBrains Mono 8px, same as SECTION_02/03/04/05 */}
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '8px', letterSpacing: '0.45em',
            color: 'rgba(204,255,0,0.45)',
            display: 'block', marginBottom: '14px',
          }}>
            SECTION_06 / IBRO_TRAINING_PROGRAM
          </span>

          {/* Title + description on same row, balanced */}
          <div className="flex items-end justify-between gap-8 flex-wrap">
            <h2 className="text-display text-white leading-none"
              style={{ fontSize: 'clamp(42px, 7vw, 88px)' }}
            >
              THE VAULT
            </h2>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '14px', lineHeight: 1.65,
              color: 'rgba(255,255,255,0.38)',
              maxWidth: '300px', paddingBottom: '6px',
            }}>
              Six chapters. Every angle. Film doesn't lie —
              it just hasn't seen a PG like this.
            </p>
          </div>

          {/* Accent line */}
          <div style={{
            width: '40px', height: '1px',
            background: '#CCFF00', boxShadow: '0 0 6px #CCFF00',
            marginTop: '14px',
          }} />
        </motion.div>

        {/* Carousel track */}
        <div
          ref={trackRef}
          className="overflow-hidden select-none"
          onPointerDown={(e) => { pointerStartX.current = e.clientX }}
          onPointerUp={(e) => {
            const delta = pointerStartX.current - e.clientX
            if (delta > 60) next()
            else if (delta < -60) prev()
          }}
          style={{ cursor: cardW ? 'grab' : 'default', touchAction: 'pan-y' }}
        >
          <motion.div
            className="flex"
            animate={{ x: -(current * (cardW + GAP)) }}
            transition={{ type: 'spring', stiffness: 75, damping: 20, mass: 0.9 }}
            style={{ gap: GAP }}
          >
            {VAULT_REELS.map((reel) => (
              <div key={reel.category} style={{ width: cardW || '33%', flexShrink: 0 }}>
                <VaultCard {...reel} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-8">

          {/* Prev / Next */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={prev}
              disabled={current === 0}
              className="w-10 h-10 rounded-sm flex items-center justify-center border transition-all duration-200"
              style={{
                borderColor: current === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(204,255,0,0.4)',
                color:       current === 0 ? 'rgba(255,255,255,0.2)' : '#CCFF00',
                background:  current === 0 ? 'transparent' : 'rgba(204,255,0,0.05)',
              }}
              whileTap={{ scale: 0.9 }}
            >
              ←
            </motion.button>
            <motion.button
              onClick={next}
              disabled={current === maxIdx}
              className="w-10 h-10 rounded-sm flex items-center justify-center border transition-all duration-200"
              style={{
                borderColor: current === maxIdx ? 'rgba(255,255,255,0.08)' : 'rgba(204,255,0,0.4)',
                color:       current === maxIdx ? 'rgba(255,255,255,0.2)' : '#CCFF00',
                background:  current === maxIdx ? 'transparent' : 'rgba(204,255,0,0.05)',
              }}
              whileTap={{ scale: 0.9 }}
            >
              →
            </motion.button>
          </div>

          {/* Counter */}
          <span className="text-body text-white/30 text-xs tracking-[0.4em] font-mono">
            {String(current + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
          </span>

          {/* Dot indicators */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: TOTAL }).map((_, i) => {
              const active = i >= current && i < current + perView
              return (
                <button
                  key={i}
                  onClick={() => setCurrent(Math.min(i, maxIdx))}
                  className="h-px transition-all duration-300"
                  style={{
                    width:      active ? '24px' : '10px',
                    background: active ? '#CCFF00' : 'rgba(255,255,255,0.18)',
                    boxShadow:  active ? '0 0 6px #CCFF00' : 'none',
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── 6. THE PROTOCOL — Contact ─────────────────────────────────── */

function MagneticButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 12 })
  const springY = useSpring(y, { stiffness: 150, damping: 12 })

  const handleMouse = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width  / 2
    const cy = rect.top  + rect.height / 2
    x.set((e.clientX - cx) * 0.35)
    y.set((e.clientY - cy) * 0.35)
  }, [x, y])

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      className="magnetic-btn w-full py-5 bg-[#CCFF00] text-[#080A0C] text-display text-lg tracking-[0.25em] uppercase rounded-sm hover:shadow-[0_0_40px_rgba(204,255,0,0.4)] transition-shadow duration-300"
      type="submit"
    >
      {children}
    </motion.button>
  )
}

/* ─── SCOUTING REPORTS — Neo-Prospect Transmissions ─────────────── */

const SCOUT_REPORTS = [
  {
    id: 'SR-001',
    agency: 'GLOBAL BASKETBALL INTELLIGENCE',
    analyst: 'SENIOR ANALYST · EURASIA SECTOR',
    classification: 'PRIORITY PROSPECT',
    date: '11.2024',
    rating: '9.4',
    color: '#CCFF00',
    quote: "Ibrohim's vertical displacement defies standard PG archetypes. He is a 1-of-1 athletic anomaly from the Central Asian sector. We have not seen this combination of positional fit and explosive output in 11 years of Eurasian scouting.",
  },
  {
    id: 'SR-002',
    agency: 'NCAA D1 TALENT ACQUISITION',
    analyst: 'HEAD SCOUT · INTERNATIONAL DIVISION',
    classification: 'ELITE TIER',
    date: '10.2024',
    rating: '9.1',
    color: '#F0F7FF',
    quote: "A 192cm guard with a 110cm vertical is a statistical anomaly. He's not just a player — he's a physical paradigm shift. Explosive burst in the 0–3 step range is unlike anything we've logged from the Central Asian pipeline.",
  },
  {
    id: 'SR-003',
    agency: 'EUROLEAGUE PROSPECT REGISTRY',
    analyst: 'DATA ANALYST · VERTICAL METRICS',
    classification: 'VERIFIED ANOMALY',
    date: '09.2024',
    rating: '9.6',
    color: '#CCFF00',
    quote: "The Central Asian basketball pipeline has been quiet for decades. Ibrohim is the signal. His vertical output at 192cm places him in the 99.97th percentile globally for guards. This is not a projection — this is a measurement.",
  },
  {
    id: 'SR-004',
    agency: 'ELITEPROSPECTS ANALYTICS',
    analyst: 'LEAD ANALYST · INTERNATIONAL BOARD',
    classification: 'WATCH LIST: ACTIVE',
    date: '08.2024',
    rating: '8.9',
    color: '#F0F7FF',
    quote: "Positional versatility combined with elite athletic ceiling. Ibrohim plays point guard but occupies space like a wing. The most interesting guard prospect from a non-traditional market in recent memory.",
  },
]

function ScoutingReportsSection({ reports: apiReports }: { reports?: ApiScoutReport[] }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const toggle = useCallback((id: string) => setOpenId(prev => prev === id ? null : id), [])
  const reports = (apiReports && apiReports.length > 0) ? apiReports : SCOUT_REPORTS

  return (
    <section
      className="relative py-14 px-6 md:px-16 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #060A10 0%, #04060A 100%)' }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(204,255,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(204,255,0,1) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
      />

      <div className="relative z-10">
        {/* Header — same style as all sections */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '8px', letterSpacing: '0.45em',
            color: 'rgba(204,255,0,0.45)',
            display: 'block', marginBottom: '14px',
          }}>
            SECTION_07 / INTEL_RECRUIT
          </span>

          <div className="flex items-end justify-between gap-8 flex-wrap">
            <h2 className="text-display text-white leading-none"
              style={{ fontSize: 'clamp(42px, 7vw, 88px)' }}
            >
              SCOUTING<br />REPORTS
            </h2>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '14px', lineHeight: 1.65,
              color: 'rgba(255,255,255,0.38)',
              maxWidth: '300px', paddingBottom: '6px',
            }}>
              Verified transmissions from global intelligence networks.
            </p>
          </div>
          <div style={{ width: '40px', height: '1px', background: '#CCFF00', boxShadow: '0 0 6px #CCFF00', marginTop: '14px' }} />
        </motion.div>

        {/* Accordion rows — click to open */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {reports.map((r, i) => {
            const isOpen = openId === r.id
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
              >
                {/* Trigger row */}
                <button
                  onClick={() => toggle(r.id)}
                  style={{
                    width: '100%', display: 'flex',
                    alignItems: 'center', justifyContent: 'space-between',
                    gap: '16px', padding: '20px 0',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {/* Left: dot + classification */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    <span style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: r.color,
                      boxShadow: isOpen ? `0 0 10px ${r.color}` : 'none',
                      flexShrink: 0, transition: 'box-shadow 0.3s',
                    }} />
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '8px', letterSpacing: '0.4em',
                      color: isOpen ? r.color : 'rgba(255,255,255,0.35)',
                      textTransform: 'uppercase', transition: 'color 0.25s',
                    }}>
                      {r.classification}
                    </span>
                  </div>

                  {/* Center: agency name */}
                  <span style={{
                    fontFamily: "'Bebas Neue', cursive",
                    fontSize: 'clamp(15px, 1.8vw, 22px)',
                    color: isOpen ? '#F0F7FF' : 'rgba(255,255,255,0.5)',
                    letterSpacing: '0.06em', flex: 1,
                    transition: 'color 0.25s',
                  }}>
                    {r.agency}
                  </span>

                  {/* Right: date + toggle icon */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '7px', letterSpacing: '0.2em',
                      color: 'rgba(255,255,255,0.2)',
                    }}>
                      {r.date}
                    </span>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '18px', lineHeight: 1,
                      color: isOpen ? '#CCFF00' : 'rgba(255,255,255,0.3)',
                      transition: 'color 0.25s, transform 0.3s',
                      display: 'block',
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    }}>
                      +
                    </span>
                  </div>
                </button>

                {/* Expandable content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{
                        padding: '0 0 28px 16px',
                        borderLeft: `1px solid ${r.color}30`,
                        marginLeft: '3px', marginBottom: '4px',
                      }}>
                        {/* Analyst */}
                        <p style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '7.5px', letterSpacing: '0.3em',
                          color: 'rgba(255,255,255,0.28)',
                          textTransform: 'uppercase', marginBottom: '16px',
                        }}>
                          {r.analyst}
                        </p>

                        {/* Quote */}
                        <p style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: '15px', lineHeight: 1.65,
                          color: 'rgba(255,255,255,0.65)',
                          maxWidth: '680px', marginBottom: '20px',
                        }}>
                          "{r.quote}"
                        </p>

                        {/* Rating */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '7px', letterSpacing: '0.4em',
                            color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase',
                          }}>
                            PROSPECT RATING
                          </span>
                          <span style={{
                            fontFamily: "'Bebas Neue', cursive",
                            fontSize: '28px', color: r.color,
                            textShadow: `0 0 12px ${r.color}60`,
                            lineHeight: 1,
                          }}>
                            {r.rating}
                          </span>
                          <span style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '7px', color: 'rgba(255,255,255,0.2)',
                          }}>
                            / 10.0
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
          {/* Bottom border */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
        </div>
      </div>
    </section>
  )
}

/* ─── 7. THE PROTOCOL ─────────────────────────────────────────────── */
function ContactSection() {
  const [form, setForm] = useState({ name: '', org: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section id="contact" className="relative py-14 px-6 md:px-16 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #060A10 0%, #080A0C 100%)' }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(204,255,0,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(204,255,0,1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.div
          className="text-center mb-7"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-body text-[#CCFF00] text-xs tracking-[0.5em] uppercase mb-4">
            SECTION 08 / THE PROTOCOL
          </p>
          <h2 className="text-display text-white leading-none mb-6"
            style={{ fontSize: 'clamp(42px, 7vw, 80px)' }}
          >
            INITIATE CONTACT
          </h2>
          <p className="text-body text-white/40 text-sm leading-relaxed">
            Serious inquiries only. If you're reading this, you already know
            what you're looking at. Fill the form. Start the conversation.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="glass-card p-8 md:p-10 space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Contract header */}
              <div className="flex items-center justify-between border-b border-white/8 pb-6 mb-8">
                <span className="text-body text-white/30 text-[10px] tracking-[0.5em] uppercase">
                  RECRUITMENT CONTRACT
                </span>
                <span className="text-body text-[#CCFF00]/50 text-[10px] tracking-widest">
                  REF-IBR-001
                </span>
              </div>

              {[
                {
                  id: 'name',
                  icon: <User size={14} />,
                  label: 'FULL NAME',
                  placeholder: 'Coach / Scout Name',
                  value: form.name,
                  onChange: (v: string) => setForm(f => ({ ...f, name: v })),
                  type: 'text',
                },
                {
                  id: 'org',
                  icon: <Building2 size={14} />,
                  label: 'ORGANIZATION',
                  placeholder: 'University / Program',
                  value: form.org,
                  onChange: (v: string) => setForm(f => ({ ...f, org: v })),
                  type: 'text',
                },
              ].map((field) => (
                <div key={field.id} className="space-y-2">
                  <label className="flex items-center gap-2 text-body text-[#CCFF00]/60 text-[10px] tracking-[0.4em] uppercase">
                    {field.icon}
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    required
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="w-full bg-transparent border-b border-white/15 focus:border-[#CCFF00] text-body text-white text-sm py-3 px-0 placeholder-white/25 outline-none transition-colors duration-200"
                    style={{ caretColor: '#CCFF00' }}
                  />
                </div>
              ))}

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-body text-[#CCFF00]/60 text-[10px] tracking-[0.4em] uppercase">
                  <Mail size={14} />
                  MESSAGE
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="State your program, timeline, and specific interest..."
                  value={form.message}
                  onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                  className="w-full bg-transparent border-b border-white/15 focus:border-[#CCFF00] text-body text-white text-sm py-3 px-0 placeholder-white/25 outline-none resize-none transition-colors duration-200"
                  style={{ caretColor: '#CCFF00' }}
                />
              </div>

              <div className="pt-4">
                <MagneticButton>
                  <span className="flex items-center justify-center gap-3">
                    INITIATE RECRUITMENT
                    <Send size={16} />
                  </span>
                </MagneticButton>
              </div>

              <p className="text-body text-white/20 text-[10px] tracking-widest text-center">
                RESPONSE WITHIN 48H · ALL COMMUNICATIONS ENCRYPTED
              </p>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              className="glass-card-lime p-10 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="w-16 h-16 rounded-full border-2 border-[#CCFF00] flex items-center justify-center mx-auto mb-6 lime-glow"
              >
                <span className="text-display text-[#CCFF00] text-2xl">✓</span>
              </div>
              <p className="text-display text-[#CCFF00] text-2xl tracking-[0.1em] mb-3">
                TRANSMISSION RECEIVED
              </p>
              <p className="text-body text-white/50 text-sm">
                Your inquiry has been logged. Ibrohim's team will respond within 48 hours.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

/* ─── Footer ────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer
      className="relative py-12 px-8 border-t border-white/5"
      style={{ background: '#080A0C' }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-display text-white/20 text-sm tracking-[0.3em]">
            IBROHIM — THE VERTICAL OUTLIER
          </p>
          <p className="text-body text-white/15 text-xs tracking-widest mt-1">
            TASHKENT, UZBEKISTAN · 192CM · 110CM VERTICAL
          </p>
        </div>
        <p className="text-body text-white/15 text-xs tracking-widest">
          © 2024 · ALL METRICS VERIFIED
        </p>
      </div>
    </footer>
  )
}

/* ─── ROOT PAGE ─────────────────────────────────────────────────── */

export default function IbrohimPage() {
  const [loaded, setLoaded] = useState(false)
  const siteContent = useSiteContent()

  /* Global scroll progress for the 3D ball */
  const { scrollYProgress } = useScroll()

  /* Mouse position (normalized -1 to 1) */
  const rawMouseX = useMotionValue(0)
  const rawMouseY = useMotionValue(0)
  const mouseX    = useSpring(rawMouseX, { stiffness: 60, damping: 15 })
  const mouseY    = useSpring(rawMouseY, { stiffness: 60, damping: 15 })

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    rawMouseX.set((e.clientX / window.innerWidth  - 0.5) * 2)
    rawMouseY.set((e.clientY / window.innerHeight - 0.5) * 2)
  }, [rawMouseX, rawMouseY])

  return (
    <div
      className="brand-cursor relative min-h-screen"
      style={{ background: '#080A0C', overflowX: 'hidden' }}
      onMouseMove={handleMouseMove}
    >
      {/* Custom crosshair cursor */}
      <CustomCursor />

      {/* Film-grain noise overlay */}
      <GrainOverlay />

      {/* Three.js basketball — fixed canvas z-1 */}
      <ThreeScene
        scrollProgress={scrollYProgress}
        mouseX={mouseX}
        mouseY={mouseY}
      />

      {/* Preloader */}
      <AnimatePresence>
        {!loaded && <Preloader onDone={() => setLoaded(true)} />}
      </AnimatePresence>

      {/* Nav — выше canvas (z-40), всегда видна */}
      <Nav />

      {/* Site content — без z-index, чтобы canvas (z-40) был виден сквозь секции */}
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <HeroSection />
        <BiometricSection />
        <ParadoxSection />
        <PioneerSection apiPanels={siteContent.pioneer} />
        <ParallaxWatermark />
        <EvidenceSection />
        <VaultSection />
        <ScoutingReportsSection reports={siteContent.scoutingReports} />
        <ContactSection />
        <Footer />
      </motion.div>
    </div>
  )
}
