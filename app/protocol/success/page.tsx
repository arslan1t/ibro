'use client'

import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Suspense } from 'react'

const mono  = "'JetBrains Mono', monospace"
const bebas = "'Bebas Neue', cursive"
const lime  = '#CCFF00'

const UNLOCKED_EXERCISES = [
  { index: '003', name: 'LOADED BROAD JUMP',        phase: '01' },
  { index: '004', name: 'SINGLE-LEG HOP MATRIX',    phase: '02' },
  { index: '005', name: 'ANKLE STIFFNESS CIRCUIT',  phase: '02' },
  { index: '006', name: 'REACTIVE DROP & CATCH',    phase: '02' },
  { index: '007', name: 'CONTRAST REST PROTOCOL',   phase: '03' },
  { index: '008', name: 'TENDON LOADING SEQUENCE',  phase: '03' },
  { index: '009', name: 'CNS RESET DRILL',          phase: '03' },
  { index: '010', name: 'PEAK PERFORMANCE WINDOW',  phase: '03' },
]

function SuccessContent() {
  const params    = useSearchParams()
  const sessionId = params.get('session_id')
  const isDemo    = sessionId === 'demo'

  return (
    <div style={{
      minHeight: '100vh', background: '#050505',
      fontFamily: "'Space Grotesk', sans-serif",
    }}>
      <div className="noise-overlay" aria-hidden />

      {/* Grid bg */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.025,
        backgroundImage: `linear-gradient(rgba(204,255,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(204,255,0,1) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />

      {/* Glow */}
      <div style={{
        position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '300px', pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(204,255,0,0.12) 0%, transparent 70%)',
      }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '700px', margin: '0 auto', padding: '80px 24px 60px' }}>

        {/* Hero check */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: '56px' }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, duration: 0.6, type: 'spring', stiffness: 180 }}
            style={{
              width: '80px', height: '80px',
              border: `2px solid ${lime}`,
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: `0 0 40px ${lime}50, 0 0 80px ${lime}20`,
            }}
          >
            <span style={{ fontFamily: bebas, fontSize: '36px', color: lime }}>✓</span>
          </motion.div>

          <div style={{ fontFamily: mono, fontSize: '7px', color: `${lime}60`, letterSpacing: '0.55em', marginBottom: '12px' }}>
            ACCESS GRANTED · CLEARANCE: ELITE
          </div>

          <h1 style={{
            fontFamily: bebas, fontSize: 'clamp(40px, 8vw, 72px)',
            lineHeight: 0.9, letterSpacing: '0.03em',
            marginBottom: '20px',
          }}>
            <span style={{ color: '#F0F7FF' }}>PROGRAM</span><br />
            <span style={{ color: lime, textShadow: `0 0 40px ${lime}40` }}>UNLOCKED.</span>
          </h1>

          <p style={{
            fontFamily: mono, fontSize: '11px', color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.1em', lineHeight: 1.8, maxWidth: '420px', margin: '0 auto',
          }}>
            {isDemo
              ? 'Stripe не настроен — доступ будет отправлен на email после подтверждения оплаты.'
              : 'Оплата прошла. Полная программа разблокирована. Все 10 упражнений теперь доступны.'
            }
          </p>
        </motion.div>

        {/* Unlocked exercises list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div style={{
            fontFamily: mono, fontSize: '7px', color: 'rgba(255,255,255,0.25)',
            letterSpacing: '0.45em', marginBottom: '16px',
          }}>
            UNLOCKED EXERCISES
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '40px' }}>
            {UNLOCKED_EXERCISES.map((ex, i) => (
              <motion.div
                key={ex.index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.06, duration: 0.4 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  padding: '14px 20px',
                  border: `1px solid ${lime}20`,
                  background: `rgba(204,255,0,0.025)`,
                }}
              >
                <span style={{ fontFamily: mono, fontSize: '8px', color: `${lime}50`, letterSpacing: '0.25em', minWidth: '28px' }}>
                  {ex.index}
                </span>
                <span style={{ fontFamily: bebas, fontSize: '16px', color: '#F0F7FF', letterSpacing: '0.05em', flex: 1 }}>
                  {ex.name}
                </span>
                <span style={{ fontFamily: mono, fontSize: '7px', color: `${lime}40`, letterSpacing: '0.2em' }}>
                  PH.{ex.phase}
                </span>
                <span style={{
                  width: '8px', height: '8px', borderRadius: '50%', background: lime,
                  boxShadow: `0 0 8px ${lime}`,
                }} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <Link href="/protocol" style={{
            fontFamily: bebas, fontSize: '16px', letterSpacing: '0.2em',
            color: '#050505', background: lime,
            padding: '14px 32px', textDecoration: 'none',
            display: 'inline-block',
            boxShadow: `0 0 20px ${lime}40`,
          }}>
            VIEW FULL PROGRAM
          </Link>
          <Link href="/ibrohim" style={{
            fontFamily: bebas, fontSize: '16px', letterSpacing: '0.2em',
            color: lime, background: 'transparent',
            border: `1px solid ${lime}40`,
            padding: '14px 32px', textDecoration: 'none',
            display: 'inline-block',
          }}>
            HOME BASE
          </Link>
        </motion.div>

      </div>
    </div>
  )
}

export default function ProtocolSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
