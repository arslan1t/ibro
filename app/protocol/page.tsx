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
        style={{ fontSize: 'clamp(20px, 5vw, 32px)' }}
      >
        {exercise.name}
      </h3>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6">
        {[
          { label: 'SETS', value: exercise.sets },
          { label: 'REPS', value: exercise.reps },
          { label: 'REST', value: exercise.rest },
        ].map((s) => (
          <div key={s.label} className="text-center p-2 md:p-3 rounded-lg"
            style={{ background: 'rgba(204,255,0,0.04)', border: '1px solid rgba(204,255,0,0.1)' }}
          >
            <div className="text-display text-[#CCFF00] text-base md:text-xl leading-tight">{s.value}</div>
            <div className="text-body text-white/30 text-[8px] md:text-[9px] tracking-[0.3em] uppercase mt-1">{s.label}</div>
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

      {/* Hero — same structure as Shop page */}
      <section className="relative px-6 md:px-16 overflow-hidden"
        style={{ paddingTop: '88px', paddingBottom: '48px',
          background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(204,255,0,0.03) 0%, transparent 70%)' }}
      >
        {/* Grid bg */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(204,255,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(204,255,0,1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="max-w-6xl mx-auto">

          {/* Badge row */}
          <motion.div className="flex items-center gap-4 mb-10"
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          >
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '9px', letterSpacing: '0.4em', textTransform: 'uppercase',
              padding: '5px 14px',
              background: 'rgba(204,255,0,0.08)', border: '1px solid rgba(204,255,0,0.25)', color: '#CCFF00',
            }}>
              CLASSIFICATION: ELITE · EVAP-110
            </span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '8px', letterSpacing: '0.3em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.22)',
            }}>
              V.2.4 / 8 WEEKS
            </span>
          </motion.div>

          {/* Two-column grid */}
          <motion.div
            className="flex flex-col md:grid"
            style={{
              gridTemplateColumns: '1fr 1fr',
              gap: '0',
              border: '1px solid rgba(204,255,0,0.08)',
              alignItems: 'stretch',
            }}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* LEFT — text */}
            <div style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: 'clamp(24px, 5vw, 48px) clamp(16px, 6%, 40px)',
              borderBottom: '1px solid rgba(204,255,0,0.08)',
            }}
              className="md:border-b-0 md:border-r md:border-[rgba(204,255,0,0.08)]"
            >
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '7.5px', letterSpacing: '0.45em', textTransform: 'uppercase',
                color: '#CCFF00', marginBottom: '16px',
              }}>
                SECTION_07 // THE 110CM PROTOCOL
              </div>

              <h1 style={{
                fontFamily: "'Bebas Neue', cursive",
                fontSize: 'clamp(42px, 7vw, 88px)',
                lineHeight: 0.88, letterSpacing: '0.03em',
                color: '#F0F7FF', marginBottom: '16px',
              }}>
                ELITE<br />
                <span style={{ color: '#CCFF00', textShadow: '0 0 28px rgba(204,255,0,0.35)' }}>
                  VERTICAL
                </span><br />
                PROTOCOL
              </h1>

              <div style={{ width: '40px', height: '1px', background: '#CCFF00', boxShadow: '0 0 8px #CCFF00', marginBottom: '16px' }} />

              <p style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(13px, 2vw, 15px)', lineHeight: 1.65,
                color: 'rgba(255,255,255,0.50)', marginBottom: '16px',
              }}>
                The exact system behind a 110cm vertical. 10 exercises,
                3 phases, 8 weeks. This is not a workout — it's a physics problem solved.
              </p>

              <div style={{ display: 'flex', gap: '20px', marginBottom: '16px', flexWrap: 'wrap' }}>
                {[{ v: '10', u: 'EXERCISES' }, { v: '3', u: 'PHASES' }, { v: '8W', u: 'PROGRAM' }, { v: '110', u: 'CM TARGET' }].map(s => (
                  <div key={s.u}>
                    <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '26px', color: '#CCFF00', lineHeight: 1 }}>{s.v}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '7px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.3em' }}>{s.u}</div>
                  </div>
                ))}
              </div>

              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '7px', letterSpacing: '0.38em', textTransform: 'uppercase',
                color: 'rgba(204,255,0,0.35)', marginBottom: '20px',
              }}>
                TASHKENT ORIGIN / VERIFIED PROTOCOL / GLOBAL ATHLETES
              </div>

              <a href="#program" style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '9px', letterSpacing: '0.5em', textTransform: 'uppercase',
                color: '#CCFF00', textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                transition: 'opacity 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.65')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                VIEW PROGRAM
                <span style={{ display: 'inline-block', width: '20px', height: '1px', background: '#CCFF00', verticalAlign: 'middle' }} />
              </a>
            </div>

            {/* RIGHT — protocol video viewfinder */}
            <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '1 / 1' }}>
              <video
                src="/footage/protocol.mp4"
                autoPlay muted loop playsInline
                style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  objectFit: 'cover',
                  filter: 'saturate(0.25) contrast(1.3) brightness(0.72)',
                }}
              />
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.20) 3px, rgba(0,0,0,0.20) 4px)',
              }} />
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'linear-gradient(135deg, rgba(204,255,0,0.04) 0%, transparent 50%)',
              }} />
              {(['TL','TR','BL','BR'] as const).map(c => {
                const t = c.startsWith('T'), l = c.endsWith('L')
                return (
                  <div key={c} style={{
                    position: 'absolute',
                    ...(t ? { top: '18px' } : { bottom: '18px' }),
                    ...(l ? { left: '18px' } : { right: '18px' }),
                    width: '16px', height: '16px',
                    borderColor: 'rgba(204,255,0,0.7)', borderStyle: 'solid', borderWidth: 0,
                    ...(t ? { borderTopWidth: '1.5px' } : { borderBottomWidth: '1.5px' }),
                    ...(l ? { borderLeftWidth: '1.5px' } : { borderRightWidth: '1.5px' }),
                  }} />
                )
              })}
              <div style={{
                position: 'absolute', bottom: '22px', left: '22px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '7px', letterSpacing: '0.35em', textTransform: 'uppercase',
                color: 'rgba(204,255,0,0.55)',
                background: 'rgba(4,6,10,0.7)', padding: '3px 8px',
                backdropFilter: 'blur(4px)',
              }}>
                [TRAINING / EVAP-110_PROTOCOL]
              </div>
              <div style={{ position: 'absolute', top: '22px', right: '22px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '5px', height: '5px', borderRadius: '50%',
                  background: '#CCFF00', boxShadow: '0 0 8px #CCFF00',
                  animation: 'pulse-lime 2s ease-out infinite',
                }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '6.5px', letterSpacing: '0.3em', color: 'rgba(204,255,0,0.5)' }}>LIVE</span>
              </div>
            </div>
          </motion.div>

          {/* Ticker */}
          <motion.div
            className="flex items-center gap-8 mt-8 overflow-hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          >
            {['10 EXERCISES', '3 PHASES', '8 WEEKS', 'VERIFIED PROTOCOL', '110CM TARGET'].map(t => (
              <span key={t} className="flex items-center gap-2 text-body text-white/20 text-[9px] tracking-[0.4em] uppercase whitespace-nowrap">
                <span className="w-1 h-1 rounded-full bg-[#CCFF00]" />
                {t}
              </span>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ── FREE exercises ── */}
      <section id="program" className="px-6 md:px-16 pb-12">
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
                className="glass-card-lime p-5 md:p-12 max-w-lg w-full text-center"
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
                  UNLOCK THE FULL 110CM PROGRAM
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
