'use client'

import { useRef, useState, useCallback } from 'react'
import {
  motion, AnimatePresence, useScroll, useTransform,
  useMotionValue, useSpring,
} from 'framer-motion'
import { Lock, Unlock, ChevronRight, ArrowLeft, Zap, RotateCcw, Activity } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import CheckoutModal, { type CheckoutProduct } from '@/components/checkout/CheckoutModal'

/* ─── Types ─────────────────────────────────────────────────────── */
interface ExerciseProps {
  phase: string
  index: string
  name: string
  sets: string
  reps: string
  rest: string
  cue: string
  metric: string
  locked?: boolean
}

/* ─── Data ───────────────────────────────────────────────────────── */
const PHASES: { label: string; tag: string; icon: React.ReactNode }[] = [
  { label: 'EXPLOSIVE POWER',    tag: '01', icon: <Zap size={14} /> },
  { label: 'ELASTICITY / PLYO', tag: '02', icon: <Activity size={14} /> },
  { label: 'RECOVERY LOGIC',    tag: '03', icon: <RotateCcw size={14} /> },
]

const EXERCISES: ExerciseProps[] = [
  /* ── FREE ── */
  {
    phase: '01',
    index: '001',
    name: 'DEPTH JUMP PROTOCOL',
    sets: '5',
    reps: '4',
    rest: '3 MIN',
    cue: 'Step off 60cm box. Minimal ground contact. Drive arms explosively. This is elastic energy loading — not a squat.',
    metric: '+4–7cm vertical gain / 8wks',
    locked: false,
  },
  {
    phase: '01',
    index: '002',
    name: 'NORDIC HAMSTRING CURL',
    sets: '4',
    reps: '6',
    rest: '2 MIN',
    cue: 'Lower under full control over 4 seconds. Protect the posterior chain. This is the injury insurance protocol.',
    metric: '40% hamstring tendon resilience',
    locked: false,
  },
  /* ── LOCKED ── */
  {
    phase: '01',
    index: '003',
    name: 'LOADED BROAD JUMP',
    sets: '6',
    reps: '3',
    rest: '90 SEC',
    cue: 'CLASSIFIED.',
    metric: 'ENCRYPTED',
    locked: true,
  },
  {
    phase: '02',
    index: '004',
    name: 'SINGLE-LEG HOP MATRIX',
    sets: '4',
    reps: '10/LEG',
    rest: '90 SEC',
    cue: 'CLASSIFIED.',
    metric: 'ENCRYPTED',
    locked: true,
  },
  {
    phase: '02',
    index: '005',
    name: 'ANKLE STIFFNESS CIRCUIT',
    sets: '3',
    reps: '20',
    rest: '60 SEC',
    cue: 'CLASSIFIED.',
    metric: 'ENCRYPTED',
    locked: true,
  },
  {
    phase: '02',
    index: '006',
    name: 'REACTIVE DROP & CATCH',
    sets: '5',
    reps: '5',
    rest: '2 MIN',
    cue: 'CLASSIFIED.',
    metric: 'ENCRYPTED',
    locked: true,
  },
  {
    phase: '03',
    index: '007',
    name: 'CONTRAST REST PROTOCOL',
    sets: '—',
    reps: '—',
    rest: '48H CYCLE',
    cue: 'CLASSIFIED.',
    metric: 'ENCRYPTED',
    locked: true,
  },
  {
    phase: '03',
    index: '008',
    name: 'TENDON LOADING SEQUENCE',
    sets: '3',
    reps: '15',
    rest: '2 MIN',
    cue: 'CLASSIFIED.',
    metric: 'ENCRYPTED',
    locked: true,
  },
  {
    phase: '03',
    index: '009',
    name: 'CNS RESET DRILL',
    sets: '2',
    reps: '8',
    rest: '3 MIN',
    cue: 'CLASSIFIED.',
    metric: 'ENCRYPTED',
    locked: true,
  },
  {
    phase: '03',
    index: '010',
    name: 'PEAK PERFORMANCE WINDOW',
    sets: '—',
    reps: '—',
    rest: '72H TAPER',
    cue: 'CLASSIFIED.',
    metric: 'ENCRYPTED',
    locked: true,
  },
]

/* ─── Magnetic Button ────────────────────────────────────────────── */
function MagneticBtn({ children, className, style, onClick }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 150, damping: 12 })
  const sy = useSpring(y, { stiffness: 150, damping: 12 })

  const onMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width  / 2) * 0.4)
    y.set((e.clientY - r.top  - r.height / 2) * 0.4)
  }, [x, y])

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy, ...style }}
      onMouseMove={onMove}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  )
}

/* ─── Exercise Card ──────────────────────────────────────────────── */
function ExerciseCard({ exercise }: { exercise: ExerciseProps }) {
  return (
    <motion.div
      className="relative glass-card p-6 md:p-8"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Phase + Index */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-body text-[#CCFF00]/60 text-[9px] tracking-[0.5em] uppercase">
          PHASE {exercise.phase} / EX-{exercise.index}
        </span>
        <span className="text-body text-white/20 text-[9px] tracking-widest uppercase">
          EVAP-110
        </span>
      </div>

      {/* Name */}
      <h3
        className="text-display text-white mb-6 leading-none"
        style={{ fontSize: 'clamp(22px, 3vw, 32px)' }}
      >
        {exercise.name}
      </h3>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'SETS', value: exercise.sets },
          { label: 'REPS', value: exercise.reps },
          { label: 'REST', value: exercise.rest },
        ].map((s) => (
          <div key={s.label} className="text-center p-3 rounded-lg"
            style={{ background: 'rgba(204,255,0,0.04)', border: '1px solid rgba(204,255,0,0.1)' }}
          >
            <div className="text-display text-[#CCFF00] text-xl">{s.value}</div>
            <div className="text-body text-white/30 text-[9px] tracking-[0.4em] uppercase mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Coaching cue */}
      <p className="text-body text-white/55 text-sm leading-relaxed mb-5 border-l-2 border-[#CCFF00]/30 pl-4">
        {exercise.cue}
      </p>

      {/* Metric */}
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]"
          style={{ boxShadow: '0 0 8px #CCFF00' }}
        />
        <span className="text-body text-[#CCFF00] text-xs tracking-[0.3em] uppercase">
          {exercise.metric}
        </span>
      </div>
    </motion.div>
  )
}

const PROTOCOL_PRODUCT: CheckoutProduct = {
  id:       'protocol',
  name:     'IBRO PROTOCOL',
  subtitle: 'FULL 110CM PROGRAM — 8 WEEKS',
  price:    '$49',
  badge:    'ELITE ACCESS · ONE-TIME',
  hasSize:  false,
  accent:   '#CCFF00',
}

/* ─── Page ───────────────────────────────────────────────────────── */
export default function ProtocolPage() {
  const free     = EXERCISES.filter((e) => !e.locked)
  const locked   = EXERCISES.filter((e) =>  e.locked)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  return (
    <div
      className="relative min-h-screen"
      style={{ background: '#080A0C', fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <div className="noise-overlay" aria-hidden />

      {/* jump-upgrade.png — watermark behind hero text */}
      <div style={{
        /* Sunk lower-left — subtle watermark, not foreground */
        position: 'fixed', bottom: '-8%', right: '2%',
        transform: 'translate(-100px, 150px)',
        width: '45vw', maxWidth: '560px',
        opacity: 0.08, pointerEvents: 'none', zIndex: 0,
        filter: 'drop-shadow(0 0 30px rgba(204,255,0,0.2))',
      }}>
        <Image src="/images/jump-upgrade.png" alt="" width={560} height={700}
          className="object-contain w-full" />
      </div>

      {/* Top nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ background: 'rgba(8,10,12,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <Link href="/ibrohim" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm">
          <ArrowLeft size={14} />
          <span style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: '0.2em', fontSize: '13px' }}>BACK TO BASE</span>
        </Link>
        <div className="flex items-center gap-3">
          <span
            className="w-2 h-2 rounded-full bg-[#CCFF00]"
            style={{ animation: 'pulse-lime 1.8s ease-out infinite' }}
          />
          <span style={{ fontFamily: "'Bebas Neue', cursive", color: '#CCFF00', letterSpacing: '0.2em', fontSize: '13px' }}>
            IBRO TRAINING PROGRAM
          </span>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 md:px-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(204,255,0,0.06) 0%, transparent 70%)',
          }}
        />

        {/* Grid background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(204,255,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(204,255,0,1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-body text-[#CCFF00] text-[9px] tracking-[0.6em] uppercase px-3 py-1.5 border border-[#CCFF00]/30 rounded-sm">
                CLASSIFICATION: ELITE
              </span>
              <span className="text-body text-white/25 text-[9px] tracking-widest">
                EVAP-110 / V.2.4
              </span>
            </div>

            <h1
              style={{
                fontFamily: "'Bebas Neue', cursive",
                fontSize: 'clamp(52px, 10vw, 130px)',
                lineHeight: 0.88,
                color: '#F0F7FF',
              }}
            >
              ELITE VERTICAL<br />
              <span style={{ color: '#CCFF00', textShadow: '0 0 40px rgba(204,255,0,0.3)' }}>
                & AGILITY
              </span><br />
              PROTOCOL
            </h1>

            <p className="text-body text-white/50 text-base md:text-lg leading-relaxed mt-8 max-w-xl">
              The exact system behind a 110cm vertical. Engineered for athletes
              who refuse positional ceilings. This is not a workout — it's a physics problem solved.
            </p>
          </motion.div>

          {/* Stat bar */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {[
              { v: '10', u: 'EXERCISES' },
              { v: '3',  u: 'PHASES' },
              { v: '8',  u: 'WEEKS' },
              { v: '110', u: 'CM TARGET' },
            ].map((s) => (
              <div key={s.u} className="glass-card p-4 text-center">
                <div style={{ fontFamily: "'Bebas Neue', cursive", color: '#CCFF00', fontSize: '36px' }}>{s.v}</div>
                <div className="text-body text-white/30 text-[9px] tracking-[0.4em] uppercase mt-1">{s.u}</div>
              </div>
            ))}
          </motion.div>

          {/* Phase legend */}
          <div className="flex flex-wrap gap-3 mt-8">
            {PHASES.map((p) => (
              <div key={p.tag} className="flex items-center gap-2 px-4 py-2 rounded-sm"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <span className="text-[#CCFF00] opacity-70">{p.icon}</span>
                <span className="text-body text-white/50 text-[10px] tracking-[0.3em] uppercase">
                  {p.tag} — {p.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FREE exercises ── */}
      <section className="px-6 md:px-16 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Unlock size={14} className="text-[#CCFF00]" />
            <span className="text-body text-[#CCFF00] text-xs tracking-[0.4em] uppercase">
              OPEN ACCESS — FOUNDATION SEQUENCE
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {free.map((ex) => <ExerciseCard key={ex.index} exercise={ex} />)}
          </div>
        </div>
      </section>

      {/* Checkout Modal */}
      <CheckoutModal
        product={checkoutOpen ? PROTOCOL_PRODUCT : null}
        onClose={() => setCheckoutOpen(false)}
      />

      {/* ── LOCKED section ── */}
      <section className="relative px-6 md:px-16 pb-32">
        <div className="max-w-4xl mx-auto">

          {/* Blurred content underneath */}
          <div className="relative">
            <div
              className="grid md:grid-cols-2 gap-5"
              style={{
                filter: 'blur(7px) grayscale(0.85)',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              {locked.map((ex) => (
                <div key={ex.index} className="glass-card p-6 md:p-8">
                  <div className="text-body text-white/20 text-[9px] tracking-widest mb-4">PHASE {ex.phase} / EX-{ex.index}</div>
                  <div className="h-6 w-3/4 rounded bg-white/10 mb-4" />
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {[ex.sets, ex.reps, ex.rest].map((v, i) => (
                      <div key={i} className="h-16 rounded-lg bg-white/5" />
                    ))}
                  </div>
                  <div className="h-4 w-full rounded bg-white/5 mb-2" />
                  <div className="h-4 w-2/3 rounded bg-white/5" />
                </div>
              ))}
            </div>

            {/* Progressive blur overlay — fades in from top to reinforce the lock */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, transparent 0%, rgba(8,10,12,0.2) 30%, rgba(8,10,12,0.5) 100%)',
              }}
            />

            {/* ── LOCK CARD ── */}
            <div className="absolute inset-0 flex items-center justify-center px-6" style={{ zIndex: 10 }}>
              <motion.div
                className="glass-card-lime p-8 md:p-12 max-w-lg w-full text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{ boxShadow: '0 0 80px rgba(204,255,0,0.08), 0 0 160px rgba(204,255,0,0.04)' }}
              >
                {/* Lock icon */}
                <div className="flex justify-center mb-6">
                  <div
                    className="w-16 h-16 rounded-full border-2 border-[#CCFF00] flex items-center justify-center"
                    style={{ animation: 'pulse-lime 2s ease-out infinite', boxShadow: '0 0 30px rgba(204,255,0,0.3)' }}
                  >
                    <Lock size={22} className="text-[#CCFF00]" />
                  </div>
                </div>

                <div className="text-body text-[#CCFF00]/50 text-[9px] tracking-[0.6em] uppercase mb-4">
                  ACCESS DENIED · CLEARANCE LEVEL: ELITE
                </div>

                <h3
                  style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 'clamp(22px, 4vw, 36px)', color: '#F0F7FF', lineHeight: 1.1, marginBottom: '16px' }}
                >
                  THIS IBRO TRAINING PROGRAM IS RESERVED<br />FOR ELITE ATHLETES ONLY.
                </h3>

                <p className="text-body text-white/45 text-sm leading-relaxed mb-8">
                  {locked.length} exercises locked. 8 weeks of elite vertical programming.
                  Unlock the full 110CM system — the exact protocol that built the anomaly.
                </p>

                <MagneticBtn
                  onClick={() => setCheckoutOpen(true)}
                  className="w-full py-4 bg-[#CCFF00] text-[#080A0C] text-sm tracking-[0.3em] uppercase rounded-sm font-bold hover:shadow-[0_0_40px_rgba(204,255,0,0.5)] transition-shadow duration-300"
                  style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '16px', letterSpacing: '0.25em' } as React.CSSProperties}
                >
                  PURCHASE ACCESS — UNLOCK THE FULL 110CM PROGRAM
                </MagneticBtn>

                <p className="text-body text-white/20 text-[9px] tracking-widest mt-4 uppercase">
                  One-time access · Digital delivery · Elite cohort only
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
