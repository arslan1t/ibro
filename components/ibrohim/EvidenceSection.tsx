'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

/* ─── Photo layout data ─────────────────────────────────────────── */
interface PhotoDef {
  src: string
  fileId: string
  tag: string
  timestamp: string
  refCode: string
  left: string
  top: number    /* px within container */
  width: string  /* % of container */
  rotation: number
  zIndex: number
  status: string
}

const PHOTOS: PhotoDef[] = [
  {
    src: '/images/ref-1.png',
    fileId: 'FILE_01', tag: '[ORIGIN_DATA]', timestamp: '44.39.11', refCode: 'TKT-22',
    left: '0%', top: 0, width: '34%', rotation: 1.2, zIndex: 3, status: 'AUTH',
  },
  {
    src: '/images/ref-2.png',
    fileId: 'FILE_02', tag: '[KINETIC_LOG]', timestamp: '44.39.47', refCode: 'GYM-24',
    left: '37%', top: 28, width: '27%', rotation: -0.8, zIndex: 5, status: 'VERIFIED',
  },
  {
    src: '/images/ref-3.png',
    fileId: 'FILE_03', tag: '[GAME_DATA]', timestamp: '44.40.02', refCode: 'CRT-24',
    left: '63%', top: 10, width: '32%', rotation: 0.5, zIndex: 2, status: 'ACTIVE',
  },
  {
    src: '/images/ref-4.png',
    fileId: 'FILE_04', tag: '[VERT_TEST]', timestamp: '44.40.18', refCode: 'LAB-01',
    left: '6%', top: 355, width: '29%', rotation: -1.1, zIndex: 4, status: 'VERIFIED',
  },
  {
    src: '/images/ref-5.png',
    fileId: 'FILE_05', tag: '[BIOMETRIC]', timestamp: '44.40.35', refCode: 'TKT-A1',
    left: '44%', top: 345, width: '35%', rotation: 0.9, zIndex: 1, status: 'CLASSIFIED',
  },
]

const PARAMS = [
  { v: 'UZB CHAMP',  u: '', l: 'NATIONAL_GOLD_MEDALIST' },
  { v: 'ASIA GOLD',  u: '', l: 'ASIAN_GAMES_CHAMPION' },
  { v: 'INTL WIN',   u: '', l: 'INTERNATIONAL_TITLE_HOLDER' },
  { v: 'MVP',        u: '', l: 'TOURNAMENT_BEST_PLAYER' },
  { v: '110CM',      u: '', l: 'MAX_VERTICAL_VERIFIED' },
  { v: 'PROSPECT',   u: '', l: 'GLOBAL_SCOUT_WATCHLIST' },
]

/* ─── Viewfinder brackets (pure CSS divs) ────────────────────────── */
function ViewfinderBrackets({ active }: { active: boolean }) {
  const color  = active ? '#CCFF00' : 'rgba(204,255,0,0.55)'
  const shadow = active ? '0 0 6px rgba(204,255,0,0.7)' : 'none'
  const ARM    = '12px'

  const shared: React.CSSProperties = {
    position: 'absolute', width: ARM, height: ARM,
    borderStyle: 'solid', borderColor: color,
    boxShadow: shadow,
    transition: 'border-color 0.25s, box-shadow 0.25s',
    zIndex: 10,
  }

  return (
    <>
      {/* Top-left */}
      <div style={{ ...shared, top: '-5px', left: '-5px',
        borderWidth: '1px 0 0 1px' }} />
      {/* Top-right */}
      <div style={{ ...shared, top: '-5px', right: '-5px',
        borderWidth: '1px 1px 0 0' }} />
      {/* Bottom-left */}
      <div style={{ ...shared, bottom: '-5px', left: '-5px',
        borderWidth: '0 0 1px 1px' }} />
      {/* Bottom-right */}
      <div style={{ ...shared, bottom: '-5px', right: '-5px',
        borderWidth: '0 1px 1px 0' }} />
    </>
  )
}

/* ─── Animated live coords ───────────────────────────────────────── */
function LiveCoords({ style }: { style?: React.CSSProperties }) {
  const [c, setC] = useState({ x: '128.4', y: '109.8', z: '108.3' })
  useEffect(() => {
    const id = setInterval(() => setC({
      x: (120 + Math.random() * 18).toFixed(1),
      y: (105 + Math.random() * 10).toFixed(1),
      z: (107 + Math.random() *  5).toFixed(1),
    }), 100)
    return () => clearInterval(id)
  }, [])
  return (
    <div style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '8px', letterSpacing: '0.05em',
      lineHeight: 1.75, color: 'rgba(204,255,0,0.28)',
      ...style,
    }}>
      X:{c.x} / Y:{c.y} / Z:{c.z}
    </div>
  )
}

/* ─── Single photo card ──────────────────────────────────────────── */
function PhotoCard({
  photo, delay, visible,
}: {
  photo: PhotoDef
  delay: number
  visible: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: photo.left,
        top: photo.top,
        width: photo.width,
        zIndex: hovered ? 30 : photo.zIndex,
        cursor: 'none',
        transformOrigin: 'center center',
      }}
      initial={{ opacity: 0, y: 24, rotate: photo.rotation }}
      animate={visible
        ? { opacity: 1, y: 0, rotate: photo.rotation }
        : { opacity: 0, y: 24, rotate: photo.rotation }}
      whileHover={{
        rotate: 0,
        y: -6,
        transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
      }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Outer wrapper for brackets (brackets extend -5px outside this) */}
      <div style={{ position: 'relative', width: '100%' }}>
        <ViewfinderBrackets active={hovered} />

        {/* Photo container — 4:3 aspect ratio */}
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4/3',
          overflow: 'hidden',
          background: '#0A0C10',
          /* Hover: drop-shadow glow */
          filter: hovered
            ? 'drop-shadow(0 0 15px rgba(204,255,0,0.33))'
            : 'drop-shadow(0 4px 12px rgba(0,0,0,0.7))',
          transition: 'filter 0.3s ease',
        }}>
          {/* Image */}
          <Image
            src={photo.src}
            alt={photo.fileId}
            fill
            className="object-cover"
            style={{
              transition: 'filter 0.35s ease',
              filter: hovered
                ? 'brightness(1.15) saturate(1.05) contrast(1.03)'
                : 'brightness(0.70) saturate(0.55) sepia(0.06)',
              objectPosition: 'center center',
            }}
            sizes="35vw"
          />

          {/* CRT scanlines (pure CSS repeating gradient — no assets) */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.10) 2px, rgba(0,0,0,0.10) 3px)',
            opacity: hovered ? 0.35 : 0.85,
            transition: 'opacity 0.35s',
          }} />

          {/* Vignette (pure CSS radial gradient — no assets) */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)',
            opacity: hovered ? 0.3 : 0.7,
            transition: 'opacity 0.35s',
          }} />

          {/* File ID tag — top-left */}
          <div style={{
            position: 'absolute', top: 7, left: 7, zIndex: 5,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '7.5px', letterSpacing: '0.18em',
            color: '#CCFF00',
            background: 'rgba(0,0,0,0.65)',
            padding: '2px 6px',
            backdropFilter: 'blur(4px)',
          }}>
            [{photo.fileId}]
          </div>

          {/* Timestamp — top-right */}
          <div style={{
            position: 'absolute', top: 7, right: 7, zIndex: 5,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '6.5px', letterSpacing: '0.12em',
            color: 'rgba(204,255,0,0.7)',
            background: 'rgba(0,0,0,0.55)',
            padding: '2px 5px',
          }}>
            {photo.timestamp}
          </div>

          {/* Tag + status — bottom strip */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '4px 7px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, transparent 100%)',
            paddingTop: '14px',
          }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '6.5px', letterSpacing: '0.2em', color: 'rgba(204,255,0,0.75)',
            }}>
              {photo.tag}
            </span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '6px', letterSpacing: '0.25em',
              color: 'rgba(255,255,255,0.38)',
            }}>
              REF:{photo.refCode}
            </span>
          </div>

          {/* Active glow border when hovered */}
          {hovered && (
            <div style={{
              position: 'absolute', inset: 0,
              border: '1px solid rgba(204,255,0,0.35)',
              pointerEvents: 'none', zIndex: 6,
            }} />
          )}
        </div>

        {/* Vertical ref label on left side */}
        <div style={{
          position: 'absolute', left: -20, top: '50%',
          transform: 'translateY(-50%) rotate(-90deg)',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '6.5px', letterSpacing: '0.22em',
          color: 'rgba(204,255,0,0.28)',
          whiteSpace: 'nowrap', pointerEvents: 'none',
        }}>
          AVAZOV_05_{photo.fileId.slice(-2)}
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Parameters bar (bottom) ────────────────────────────────────── */
/* ─── Clean grid photo card — uniform, military, no overlap ─────── */
function GridPhotoCard({ photo, delay, visible }: {
  photo: PhotoDef; delay: number; visible: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      style={{
        position: 'relative', cursor: 'none',
        border: '1px solid #222',
        borderColor: hovered ? 'rgba(204,255,0,0.35)' : '#333',
        transition: 'border-color 0.25s',
        background: '#0A0C0E',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Uniform 4:3 photo */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden' }}>
        <Image
          src={photo.src}
          alt={photo.fileId}
          fill
          className="object-cover"
          style={{
            transition: 'filter 0.4s ease',
            filter: hovered
              ? 'grayscale(0) brightness(1.1) saturate(1.05)'
              : 'grayscale(0.85) brightness(0.65)',
          }}
          sizes="30vw"
        />
        {/* CRT scanlines */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.10) 2px, rgba(0,0,0,0.10) 3px)',
          opacity: hovered ? 0.3 : 0.8, transition: 'opacity 0.4s',
        }} />
        {/* Hover lime overlay top edge */}
        {hovered && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
            background: 'rgba(204,255,0,0.7)', boxShadow: '0 0 8px #CCFF00',
          }} />
        )}
        {/* Timestamp metadata — appears on hover */}
        <motion.div
          style={{ position: 'absolute', top: 8, right: 8, zIndex: 5 }}
          initial={{ opacity: 0 }} animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '6.5px', letterSpacing: '0.15em',
            color: '#CCFF00', background: 'rgba(0,0,0,0.75)',
            padding: '2px 6px',
          }}>{photo.timestamp}</div>
        </motion.div>
      </div>

      {/* Bottom metadata bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 9px',
        background: '#080A0C',
        borderTop: '1px solid #1A1A1A',
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '6.5px', letterSpacing: '0.22em',
          color: hovered ? 'rgba(204,255,0,0.75)' : 'rgba(255,255,255,0.3)',
          transition: 'color 0.25s',
        }}>
          [{photo.fileId}]
        </span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '6px', letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.22)',
        }}>
          {photo.tag}
        </span>
      </div>
    </motion.div>
  )
}

/* ─── Parameters bar ─────────────────────────────────────────────── */
function ParamsBar({ visible }: { visible: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.9, duration: 0.6 }}
      style={{ position: 'relative', overflow: 'hidden',
        border: '1px solid rgba(204,255,0,0.18)',
        boxShadow: '0 0 15px rgba(204,255,0,0.08), inset 0 0 15px rgba(204,255,0,0.02)',
      }}
    >
      {/* Scanning beam (pure CSS animation) */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, width: '5%',
        background: 'linear-gradient(to right, transparent, rgba(204,255,0,0.15) 40%, rgba(204,255,0,0.28) 50%, rgba(204,255,0,0.15) 60%, transparent)',
        animation: 'params-scan 5s ease-in-out infinite',
        zIndex: 5, pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex' }}>
        {PARAMS.map((p, i) => (
          <div key={p.l} style={{
            flex: 1,
            padding: '16px 8px',
            textAlign: 'center',
            /* Clean 1px semi-transparent divider */
            borderRight: i < PARAMS.length - 1
              ? '1px solid rgba(204,255,0,0.10)'
              : 'none',
            background: 'rgba(204,255,0,0.012)',
          }}>
            {/* Header — Cyber Lime, bold, Bebas for display weight */}
            <div style={{
              fontFamily: "'Bebas Neue', cursive",
              fontWeight: 700,
              fontSize: 'clamp(13px, 1.6vw, 20px)',
              color: '#CCFF00',
              lineHeight: 1.1,
              letterSpacing: '0.05em',
              textShadow: '0 0 14px rgba(204,255,0,0.45)',
              marginBottom: '5px',
              whiteSpace: 'nowrap',
            }}>
              {p.v}
            </div>
            {/* Sub-label — Muted Silver #A0A0A0, small monospace */}
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 300,
              fontSize: '5.5px',
              letterSpacing: '0.22em',
              color: '#A0A0A0',
              lineHeight: 1.4,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {p.l}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

/* ─── Main export ────────────────────────────────────────────────── */
export default function EvidenceSection() {
  const ref     = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        background: '#050505',
        overflow: 'hidden',
        padding: '72px 5% 48px',
      }}
    >
      {/* ── Procedural background grid (pure CSS — no images) ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(204,255,0,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(204,255,0,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '30px 30px',
        animation: 'grid-scroll 22s linear infinite',
      }} />

      {/* ── Section header ── */}
      <motion.div
        style={{
          position: 'relative', zIndex: 10,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '24px',
          marginBottom: '40px',
          flexWrap: 'wrap',
        }}
        initial={{ opacity: 0, y: 24 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        {/* Left: title */}
        <div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '8px', letterSpacing: '0.5em',
            color: 'rgba(204,255,0,0.45)', marginBottom: '8px',
          }}>
            SECTION_05 / DOCUMENTED
          </div>
          <h2 style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: 'clamp(36px, 6vw, 72px)',
            color: '#F0F7FF', lineHeight: 1, letterSpacing: '0.04em', margin: 0,
          }}>
            THE ARCHIVE
          </h2>
          {/* Lime accent line */}
          <div style={{
            width: '40px', height: '1px',
            background: '#CCFF00', marginTop: '10px',
            boxShadow: '0 0 8px #CCFF00',
          }} />
        </div>

        {/* Right: System Status HUD (pure code text) */}
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '8.5px',
          lineHeight: 1.9,
          letterSpacing: '0.12em',
          color: 'rgba(204,255,0,0.55)',
          background: 'rgba(204,255,0,0.03)',
          border: '1px solid rgba(204,255,0,0.12)',
          padding: '10px 14px',
          alignSelf: 'flex-start',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>// </span>SYSTEM_STATUS: STABLE<br />
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>// </span>DATA_NODES: 05_IMG_FILES<br />
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>// </span>ACCESS: RESTRICTED
        </div>
      </motion.div>

      {/* ── Clean technical grid (replaces scattered absolute layout) ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '16px',
          position: 'relative', zIndex: 5,
          marginBottom: '48px',
        }}
      >
        {PHOTOS.map((p, i) => (
          <GridPhotoCard
            key={p.fileId}
            photo={p}
            delay={i * 0.08 + 0.2}
            visible={visible}
          />
        ))}
      </div>

      {/* ── Active parameters bar ── */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '7.5px', letterSpacing: '0.4em',
          color: 'rgba(204,255,0,0.3)',
          marginBottom: '8px',
        }}>
          VERIFIED_COMPETITIVE_RECORD / AVAZOV_IBROHIM
        </div>
        <ParamsBar visible={visible} />
      </div>

      {/* ── Bottom live coords ── */}
      <LiveCoords style={{
        position: 'absolute', bottom: '14px', right: '28px',
        textAlign: 'right', zIndex: 6,
      }} />

      {/* ── Top-right coords ── */}
      <LiveCoords style={{
        position: 'absolute', top: '24px', right: '28px',
        textAlign: 'right', zIndex: 6,
      }} />
    </section>
  )
}
