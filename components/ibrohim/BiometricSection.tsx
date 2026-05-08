'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

/* ─── Count-up ───────────────────────────────────────────────────── */
function useCountUp(target: number, dec = 1, active = false, delay = 0) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    let raf: number
    const t0 = performance.now() + delay
    const tick = (now: number) => {
      const e = now - t0
      if (e < 0) { raf = requestAnimationFrame(tick); return }
      const p  = Math.min(e / 1400, 1)
      const ea = 1 - Math.pow(1 - p, 3)
      setVal(parseFloat((target * ea).toFixed(dec)))
      if (p < 1) raf = requestAnimationFrame(tick)
      else       setVal(target)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target, dec, delay])
  return val
}

/* ─── Scan line ──────────────────────────────────────────────────── */
function ScanLine() {
  const [y, setY] = useState(10)
  useEffect(() => {
    let dir = 1, pos = 10, raf: number
    const tick = () => {
      pos += dir * 0.28
      if (pos > 90) dir = -1
      if (pos < 10) dir =  1
      setY(pos)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, top: `${y}%`,
      height: '60px', pointerEvents: 'none', zIndex: 2, transition: 'none',
      background: 'linear-gradient(to bottom, transparent, rgba(204,255,0,0.04) 45%, rgba(204,255,0,0.08) 50%, rgba(204,255,0,0.04) 55%, transparent)',
    }} />
  )
}

/* ─── Single stat cell ───────────────────────────────────────────── */
interface StatDef {
  value: number
  dec: number
  unit: string
  label: string
  hero?: boolean
  delay?: number
}

function StatCell({ stat, visible, index }: { stat: StatDef; visible: boolean; index: number }) {
  const val = useCountUp(stat.value, stat.dec, visible, (stat.delay ?? index) * 120 + 500)
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.4 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      style={{
        padding: '16px 24px',
        borderBottom: '1px solid rgba(204,255,0,0.06)',
        borderRight: '1px solid rgba(204,255,0,0.06)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'flex-start',
        background: stat.hero ? 'rgba(204,255,0,0.03)' : 'transparent',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Hero accent bar */}
      {stat.hero && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1.5px',
          background: 'rgba(204,255,0,0.55)', boxShadow: '0 0 6px rgba(204,255,0,0.4)',
        }} />
      )}

      {/* Value */}
      <div style={{
        fontFamily: "'Bebas Neue', cursive",
        fontSize: stat.hero ? 'clamp(42px, 4.5vw, 60px)' : 'clamp(28px, 3vw, 42px)',
        color: stat.hero ? '#CCFF00' : '#F0F7FF',
        lineHeight: 1,
        textShadow: stat.hero
          ? '0 0 16px rgba(204,255,0,0.4)'
          : '0 0 10px rgba(240,247,255,0.1)',
        letterSpacing: '-0.01em',
      }}>
        {val.toFixed(stat.dec)}
        <span style={{
          fontSize: stat.hero ? '0.38em' : '0.42em',
          color: stat.hero ? 'rgba(204,255,0,0.55)' : 'rgba(240,247,255,0.4)',
          marginLeft: '3px', fontWeight: 300,
        }}>
          {stat.unit}
        </span>
      </div>

      {/* Label */}
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '7px', letterSpacing: '0.25em',
        color: 'rgba(255,255,255,0.38)',
        marginTop: '5px', textTransform: 'uppercase',
      }}>
        {stat.label}
      </div>
    </motion.div>
  )
}

/* ─── Glitch image — CSS animation shake, guaranteed to work ────── */
function GlitchImage({ visible }: { visible: boolean }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      style={{
        position: 'relative', width: '100%', height: '100%', cursor: 'none',
        /* screen blend: removes black background from image */
        mixBlendMode: 'screen' as const,
      }}
      initial={{ opacity: 0, filter: 'blur(12px)' }}
      animate={visible ? { opacity: 1, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1.0, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* CSS-animation shake wrapper — steps(1) = digital snap, no smoothing */}
      <div style={{
        position: 'absolute', inset: 0,
        animation: hovered ? 'imageShake 0.38s steps(1) infinite' : 'none',
      }}>
        <Image
          src="/images/ibro.png"
          alt="Ibrohim Avazov"
          fill
          className="object-contain"
          sizes="44vw"
          style={{ objectPosition: 'center center' }}
          priority
        />
        {/* CRT scanlines */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 3px)',
        }} />
      </div>
    </motion.div>
  )
}

/* ─── Default stats (fallback while API loads) ───────────────────── */
const DEFAULT_LEFT: StatDef[] = [
  { value: 20.4, dec: 1, unit: 'PPG',   label: 'POINTS_PER_GAME',   delay: 0 },
  { value: 7.2,  dec: 1, unit: 'AST',   label: 'ASSISTS',            delay: 1 },
  { value: 9.1,  dec: 1, unit: 'REB',   label: 'REBOUNDS',           delay: 2 },
  { value: 47,   dec: 0, unit: '% 3PT', label: 'THREE_POINT_PCT',    delay: 3 },
]
const DEFAULT_RIGHT: StatDef[] = [
  { value: 110,  dec: 0, unit: 'CM',    label: 'VERTICAL_JUMP',      hero: true, delay: 0 },
  { value: 198,  dec: 0, unit: 'CM',    label: 'WINGSPAN',            delay: 1 },
  { value: 192,  dec: 0, unit: 'CM',    label: 'HEIGHT',              delay: 2 },
  { value: 3.1,  dec: 1, unit: 'SEC',   label: '0-30M_SPRINT',        delay: 3 },
]

/* ─── Main export ────────────────────────────────────────────────── */
export default function BiometricSection() {
  const ref     = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { once: true, margin: '-80px' })
  const [isMobile, setIsMobile] = useState(false)

  const [statsLeft,  setStatsLeft]  = useState<StatDef[]>(DEFAULT_LEFT)
  const [statsRight, setStatsRight] = useState<StatDef[]>(DEFAULT_RIGHT)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  /* Fetch live stats from admin-editable content.json */
  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then((d) => {
        if (!d?.stats) return
        const s = d.stats
        setStatsLeft([
          { value: s.ppg      ?? 20.4, dec: 1, unit: 'PPG',   label: 'POINTS_PER_GAME',  delay: 0 },
          { value: s.ast      ?? 7.2,  dec: 1, unit: 'AST',   label: 'ASSISTS',           delay: 1 },
          { value: s.reb      ?? 9.1,  dec: 1, unit: 'REB',   label: 'REBOUNDS',          delay: 2 },
          { value: s.threePct ?? 47,   dec: 0, unit: '% 3PT', label: 'THREE_POINT_PCT',   delay: 3 },
        ])
        setStatsRight([
          { value: s.vertical ?? 110, dec: 0, unit: 'CM',  label: 'VERTICAL_JUMP', hero: true, delay: 0 },
          { value: s.wingspan ?? 198, dec: 0, unit: 'CM',  label: 'WINGSPAN',                  delay: 1 },
          { value: s.height   ?? 192, dec: 0, unit: 'CM',  label: 'HEIGHT',                    delay: 2 },
          { value: s.sprint   ?? 3.1, dec: 1, unit: 'SEC', label: '0-30M_SPRINT',              delay: 3 },
        ])
      })
      .catch(() => {})
  }, [])

  /* ── MOBILE layout ── */
  if (isMobile) {
    return (
      <section id="stats" ref={ref} style={{ position: 'relative', background: '#050505', overflow: 'hidden', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        {/* Grid bg */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `linear-gradient(rgba(204,255,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(204,255,0,0.04) 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />

        {/* Section label */}
        <motion.div initial={{ opacity: 0 }} animate={visible ? { opacity: 1 } : {}} transition={{ duration: 0.6 }}
          style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 5 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '7px', letterSpacing: '0.45em', color: 'rgba(204,255,0,0.45)' }}>
            SECTION_02 / STATISTICS
          </span>
          <LiveCoords />
        </motion.div>

        {/* Image — top half, full width with screen blend */}
        <div style={{ position: 'relative', height: '45vw', maxHeight: '220px', flex: '0 0 auto', mixBlendMode: 'screen' }}>
          <Image src="/images/ibro.png" alt="Ibrohim Avazov" fill className="object-contain" style={{ objectPosition: 'center bottom' }} sizes="100vw" priority />
        </div>

        {/* Stats — 2×4 full width */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, position: 'relative', zIndex: 5 }}>
          {Array.from({ length: 4 }, (_, i) => [
            <StatCell key={statsLeft[i]?.label  ?? i}        stat={statsLeft[i]  ?? DEFAULT_LEFT[i]}  visible={visible} index={i}     />,
            <StatCell key={statsRight[i]?.label ?? i + '_r'} stat={statsRight[i] ?? DEFAULT_RIGHT[i]} visible={visible} index={i + 4} />,
          ]).flat()}
        </div>

        {/* Bottom bar */}
        <motion.div initial={{ opacity: 0 }} animate={visible ? { opacity: 1 } : {}} transition={{ delay: 2, duration: 0.4 }}
          style={{ padding: '10px 20px', borderTop: '1px solid rgba(204,255,0,0.06)', display: 'flex', flexWrap: 'wrap', gap: '6px', position: 'relative', zIndex: 6 }}>
          {['AVAZOV_IBROHIM', 'PG / #1', 'TASHKENT_UZB'].map(t => (
            <span key={t} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '6px', letterSpacing: '0.3em', color: 'rgba(204,255,0,0.22)' }}>{t}</span>
          ))}
        </motion.div>
      </section>
    )
  }

  return (
    <section
      id="stats"
      ref={ref}
      style={{
        position: 'relative',
        background: '#050505',
        overflow: 'hidden',
        height: '100vh',      /* fixed height — no overflow */
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(204,255,0,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(204,255,0,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '30px 30px',
        animation: 'grid-scroll 25s linear infinite',
      }} />

      <ScanLine />

      {/* ── Section header ── */}
      <motion.div
        style={{
          position: 'relative', zIndex: 6,
          padding: '24px 28px 0',
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '8px',
        }}
        initial={{ opacity: 0 }} animate={visible ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        <div>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '8px', letterSpacing: '0.45em',
            color: 'rgba(204,255,0,0.45)',
          }}>
            SECTION_02 / STATISTICS
          </span>
        </div>
        {/* Live coords */}
        <LiveCoords />
      </motion.div>

      {/* ── Main layout: image LEFT | stats RIGHT ── */}
      <div style={{
        position: 'relative', zIndex: 5,
        display: 'grid',
        gridTemplateColumns: '42% 58%',
        flex: 1,
        gap: '0',
      }}>

        {/* ── LEFT: ibro.png centered ── */}
        <div style={{
          position: 'relative', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <GlitchImage visible={visible} />

          {/* Vertical separator */}
          <div style={{
            position: 'absolute', top: '5%', bottom: '5%', right: 0,
            width: '1px', background: 'rgba(204,255,0,0.1)',
          }} />
        </div>

        {/* ── RIGHT: stats grid (2×4) ── */}
        {/* 2-column grid: interleaved so LEFT fills col-1, RIGHT fills col-2 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: 'repeat(4, 1fr)',
          alignSelf: 'stretch',
        }}>
          {Array.from({ length: 4 }, (_, i) => [
            <StatCell key={statsLeft[i]?.label  ?? i}        stat={statsLeft[i]  ?? DEFAULT_LEFT[i]}  visible={visible} index={i}     />,
            <StatCell key={statsRight[i]?.label ?? i + '_r'} stat={statsRight[i] ?? DEFAULT_RIGHT[i]} visible={visible} index={i + 4} />,
          ]).flat()}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <motion.div
        style={{
          position: 'relative', zIndex: 6,
          padding: '10px 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderTop: '1px solid rgba(204,255,0,0.06)',
          flexWrap: 'wrap', gap: '8px',
        }}
        initial={{ opacity: 0 }} animate={visible ? { opacity: 1 } : {}}
        transition={{ delay: 2, duration: 0.4 }}
      >
        {['AVAZOV_IBROHIM', 'PG / #1', 'TASHKENT_UZB', 'SCAN: COMPLETE'].map((t, i) => (
          <span key={t} style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '7px', letterSpacing: '0.35em',
            color: 'rgba(204,255,0,0.22)',
          }}>
            {i > 0 && <span style={{ marginRight: '16px', opacity: 0.3 }}>·</span>}
            {t}
          </span>
        ))}
      </motion.div>
    </section>
  )
}

/* ─── Live coords ────────────────────────────────────────────────── */
function LiveCoords() {
  const [c, setC] = useState({ x: '128.4', y: '109.8', z: '108.3' })
  useEffect(() => {
    const id = setInterval(() => setC({
      x: (120 + Math.random() * 18).toFixed(1),
      y: (105 + Math.random() * 10).toFixed(1),
      z: (107 + Math.random() *  5).toFixed(1),
    }), 110)
    return () => clearInterval(id)
  }, [])
  return (
    <div style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: '7px',
      color: 'rgba(204,255,0,0.2)', letterSpacing: '0.05em',
    }}>
      X:{c.x} / Y:{c.y} / Z:{c.z}
    </div>
  )
}
