'use client'

import { useRef, useState, useCallback } from 'react'
import {
  motion, useMotionValue, useSpring, useTransform,
} from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import CheckoutModal, { type CheckoutProduct } from '@/components/checkout/CheckoutModal'

/* ─── Product data ───────────────────────────────────────────────── */
interface Product {
  id: string
  name: string
  subtitle: string
  price: string
  badge: string
  desc: string
  tags: string[]
  accent: string
  videoSrc: string
  bgGradient: string
}


/* ─── Video visual with hover play + speed-up ───────────────────── */
function ProductVideo({ src, gradient, accent, price }: { src: string; gradient: string; accent: string; price: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  const handleEnter = useCallback(() => {
    setPlaying(true)
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
      videoRef.current.playbackRate = 1.6  /* speed up on hover */
    }
  }, [])
  const handleLeave = useCallback(() => {
    setPlaying(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
      videoRef.current.playbackRate = 1
    }
  }, [])

  return (
    <div
      className="relative w-full"
      style={{ aspectRatio: '1/1', overflow: 'hidden', borderRadius: '12px', background: gradient }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          borderRadius: '12px',
          opacity: playing ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />
      {/* Fallback gradient visible when video not playing */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '12px',
        background: gradient,
        opacity: playing ? 0 : 1,
        transition: 'opacity 0.4s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          fontFamily: "'Bebas Neue', cursive",
          fontSize: '14px', letterSpacing: '0.3em',
          color: `${accent}60`,
        }}>
          HOVER TO PLAY
        </div>
      </div>
      {/* Scanline overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: '12px',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 3px)',
      }} />
      {/* Price/size popup on hover */}
      {playing && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          textAlign: 'center', pointerEvents: 'none', zIndex: 5,
        }}>
          <div style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: '32px', color: accent,
            textShadow: `0 0 20px ${accent}80`,
            letterSpacing: '0.04em',
          }}>{price}</div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '7px', color: `${accent}80`,
            letterSpacing: '0.4em', marginTop: '2px',
          }}>XS / S / M / L / XL</div>
        </div>
      )}
      {/* Accent glow on play */}
      {playing && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: '12px',
          boxShadow: `inset 0 0 30px ${accent}20`,
        }} />
      )}
    </div>
  )
}

const PRODUCTS: Product[] = [
  {
    id: 'hoodie',
    name: 'THE CEILING',
    subtitle: 'PREMIUM HOODIE',
    price: '$149',
    badge: 'LIMITED — 50 UNITS',
    desc: 'Obsidian black heavyweight fleece. Cyber Lime 3D chain-stitch embroidery. Oversized silhouette engineered for athletes who play above the rim. 400GSM warmth for pre-game focus.',
    tags: ['400GSM FLEECE', 'OVERSIZED FIT', '3D EMBROIDERY'],
    accent: '#CCFF00',
    videoSrc: '/footage/hoodie.mov',
    bgGradient: 'linear-gradient(135deg, #06080A 0%, #0A0C0E 100%)',
  },
  {
    id: 'tee',
    name: 'VERTICAL PIONEER',
    subtitle: 'TRAINING TEE',
    price: '$79',
    badge: 'ICE BLUE EDITION',
    desc: 'Ice Blue performance jersey. Moisture-wicking micro-knit. Brutalist 3D typography printed on 100% recycled performance fibers. Built for the grind, styled for the street.',
    tags: ['MOISTURE-WICK', 'RECYCLED FIBERS', 'ATHLETIC CUT'],
    accent: '#F0F7FF',
    videoSrc: '/footage/tee.mov',
    bgGradient: 'linear-gradient(135deg, #040C1E 0%, #061220 100%)',
  },
  {
    id: 'ball',
    name: '110CM SIGNATURE',
    subtitle: 'BASKETBALL',
    price: '$199',
    badge: 'IBROHIM EDITION — 50 UNITS',
    desc: 'Official size 7. Neon lime seam accents. Custom deep-channel grip. Signed series. The exact ball that trained the vertical that redefined the position. Limited to 50 units.',
    tags: ['SIZE 7 OFFICIAL', 'NEON SEAMS', 'SIGNED SERIES'],
    accent: '#CCFF00',
    videoSrc: '/footage/ball.mov',
    bgGradient: 'linear-gradient(135deg, #06080A 0%, #0A0C0E 100%)',
  },
  {
    id: 'jersey',
    name: 'PIONEER JERSEY',
    subtitle: 'GAME JERSEY',
    price: '$89',
    badge: 'COURT EDITION',
    desc: 'Official-weight game jersey. Cyber Lime number print. Breathable mesh construction engineered for peak court performance. Worn by the anomaly.',
    tags: ['MESH FABRIC', 'GAME WEIGHT', 'LIME PRINT'],
    accent: '#CCFF00',
    videoSrc: '/footage/jersey.mov',
    bgGradient: 'linear-gradient(135deg, #04100A 0%, #081808 100%)',
  },
  {
    id: 'shoes',
    name: 'VERTICAL BOOST',
    subtitle: 'TRAINING SHOE',
    price: '$249',
    badge: 'PERFORMANCE LINE',
    desc: 'Lightweight high-top silhouette. Carbon fiber plate for explosive takeoff. Neon lime outsole accent. Engineered to add centimeters to your vertical.',
    tags: ['CARBON PLATE', 'HIGH-TOP', 'LIME OUTSOLE'],
    accent: '#F0F7FF',
    videoSrc: '/footage/shoe.mov',
    bgGradient: 'linear-gradient(135deg, #080A1A 0%, #0C0E22 100%)',
  },
  {
    id: 'shorts',
    name: 'APEX SHORTS',
    subtitle: 'TRAINING SHORTS',
    price: '$65',
    badge: 'CORE COLLECTION',
    desc: 'Four-way stretch performance shorts. Quick-dry micro-fiber. Minimal design, maximum range of motion. The foundation of every training session.',
    tags: ['4-WAY STRETCH', 'QUICK-DRY', 'MINIMAL'],
    accent: '#CCFF00',
    videoSrc: '/footage/shorts.mov',
    bgGradient: 'linear-gradient(135deg, #0A0808 0%, #120C0C 100%)',
  },
]

/* ─── Product Card ───────────────────────────────────────────────── */
function ProductCard({ product, index, onBuy }: { product: Product; index: number; onBuy: (p: Product) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [10, -10]), { stiffness: 250, damping: 20 })
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-10, 10]), { stiffness: 250, damping: 20 })

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    rawX.set(((e.clientX - r.left) / r.width)  - 0.5)
    rawY.set(((e.clientY - r.top)  / r.height) - 0.5)
  }, [rawX, rawY])

  return (
    <motion.div
      ref={ref}
      className="relative flex flex-col overflow-hidden rounded-2xl cursor-default"
      style={{
        transformStyle: 'preserve-3d',
        rotateX,
        rotateY,
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${hovered ? product.accent + '30' : 'rgba(255,255,255,0.07)'}`,
        transition: 'border-color 0.3s',
      }}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={onMove}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => { setHovered(false); rawX.set(0); rawY.set(0) }}
    >
      {/* Product visual area — video plays on hover */}
      <div className="relative w-full p-3">
        <ProductVideo
          src={product.videoSrc}
          gradient={product.bgGradient}
          accent={product.accent}
          price={product.price}
        />
        {/* Badge over video */}
        <div className="absolute top-6 left-6 z-10">
          <span
            className="text-body text-[9px] tracking-[0.5em] uppercase px-3 py-1.5 rounded-sm"
            style={{
              background: 'rgba(0,0,0,0.75)',
              border: `1px solid ${product.accent}40`,
              color: product.accent,
              backdropFilter: 'blur(8px)',
            }}
          >
            {product.badge}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-6 flex-1 flex flex-col gap-4">
        <div>
          <p className="text-body text-white/30 text-[9px] tracking-[0.5em] uppercase mb-1">{product.subtitle}</p>
          <h3
            className="leading-none"
            style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '28px', color: product.accent }}
          >
            {product.name}
          </h3>
        </div>

        <p className="text-body text-white/50 text-sm leading-relaxed flex-1">
          {product.desc}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {product.tags.map((t) => (
            <span key={t}
              className="text-body text-[9px] tracking-[0.3em] uppercase px-2 py-1 rounded-sm"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <span
            style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '32px', color: product.accent,
              textShadow: `0 0 20px ${product.accent}40` }}
          >
            {product.price}
          </span>
          <motion.button
            onClick={() => onBuy(product)}
            className="px-6 py-3 rounded-sm text-body text-xs tracking-[0.3em] uppercase font-semibold"
            style={{
              background: product.accent,
              color: '#080A0C',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
            whileHover={{
              scale: 1.04,
              boxShadow: `0 0 28px ${product.accent}70, 0 0 8px ${product.accent}40`,
            }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.18 }}
          >
            ACQUIRE
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Page ───────────────────────────────────────────────────────── */
export default function ShopPage() {
  const [checkoutProduct, setCheckoutProduct] = useState<CheckoutProduct | null>(null)

  const openCheckout = useCallback((p: Product) => {
    const CLOTHING = ['hoodie', 'tee', 'jersey', 'shorts']
    setCheckoutProduct({
      id:       p.id,
      name:     p.name,
      subtitle: p.subtitle,
      price:    p.price,
      badge:    p.badge,
      hasSize:  CLOTHING.includes(p.id),
      accent:   p.accent,
    })
  }, [])

  return (
    <div
      className="relative min-h-screen"
      style={{ background: '#080A0C', fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <div className="noise-overlay" aria-hidden />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ background: 'rgba(8,10,12,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <Link href="/ibrohim" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={14} />
          <span style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: '0.2em', fontSize: '13px' }}>BACK TO BASE</span>
        </Link>
        <span style={{ fontFamily: "'Bebas Neue', cursive", color: '#CCFF00', letterSpacing: '0.2em', fontSize: '13px' }}>
          THE DROP
        </span>
      </nav>

      {/* ══════════════════════════════════════════════════════════
          HERO — starts with DROP 001 badge, then 2-column grid
      ══════════════════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-16 overflow-hidden"
        style={{ paddingTop: '88px', paddingBottom: '48px',
          background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(204,255,0,0.03) 0%, transparent 70%)' }}
      >
        <div className="max-w-6xl mx-auto">

          {/* ── Top badge row ── */}
          <motion.div
            className="flex items-center gap-4 mb-10"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '9px', letterSpacing: '0.4em', textTransform: 'uppercase',
              padding: '5px 14px',
              background: 'rgba(204,255,0,0.08)',
              border: '1px solid rgba(204,255,0,0.25)',
              color: '#CCFF00',
            }}>
              DROP 001 — LIMITED EDITION
            </span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '8px', letterSpacing: '0.3em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.22)',
            }}>
              3 ITEMS REMAINING
            </span>
          </motion.div>

          {/* ── Two-column: LEFT text | RIGHT model video ── */}
          <motion.div
            style={{
              display: 'grid',
              gridTemplateColumns: 'clamp(280px, 50%, 600px) 1fr',
              gap: '0',
              border: '1px solid rgba(204,255,0,0.08)',
              minHeight: 'clamp(280px, 55vw, 480px)',
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* LEFT — text hierarchy */}
            <div style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: '48px 6% 48px 5%',
              borderRight: '1px solid rgba(204,255,0,0.08)',
            }}>
              {/* Section subheader */}
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '7.5px', letterSpacing: '0.45em', textTransform: 'uppercase',
                color: '#CCFF00', marginBottom: '20px',
              }}>
                SECTION_06 // THE DROP VERTICAL COLLECTION
              </div>

              {/* Main title */}
              <h1 style={{
                fontFamily: "'Bebas Neue', cursive",
                fontSize: 'clamp(48px, 7vw, 88px)',
                lineHeight: 0.88, letterSpacing: '0.03em',
                color: '#F0F7FF', marginBottom: '20px',
              }}>
                THE DROP<br />
                <span style={{ color: '#CCFF00', textShadow: '0 0 28px rgba(204,255,0,0.35)' }}>
                  VERTICAL
                </span><br />
                COLLECTION
              </h1>

              {/* Lime accent rule */}
              <div style={{
                width: '40px', height: '1px',
                background: '#CCFF00', boxShadow: '0 0 8px #CCFF00',
                marginBottom: '22px',
              }} />

              {/* Description */}
              <p style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '14px', lineHeight: 1.65,
                color: 'rgba(255,255,255,0.50)',
                maxWidth: '360px', marginBottom: '16px',
              }}>
                Limited run. No restocks. Engineered for the athlete
                who trained the 110cm jump. Wear the anomaly.
              </p>

              {/* Meta details */}
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '7px', letterSpacing: '0.38em', textTransform: 'uppercase',
                color: 'rgba(204,255,0,0.35)', marginBottom: '28px',
              }}>
                2024 / TASHKENT ORIGIN / GLOBAL DROP
              </div>

              {/* CTA — borderless, Cyber Lime */}
              <a href="#products" style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '9px', letterSpacing: '0.5em', textTransform: 'uppercase',
                color: '#CCFF00', background: 'transparent', border: 'none',
                textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                cursor: 'pointer',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.65')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                SHOP
                <span style={{ display: 'inline-block', width: '20px', height: '1px', background: '#CCFF00', verticalAlign: 'middle' }} />
              </a>
            </div>

            {/* RIGHT — model video in Digital Viewfinder frame */}
            <div style={{ position: 'relative', overflow: 'hidden', minHeight: '480px' }}>
              <video
                src="/footage/model.mov"
                autoPlay muted loop playsInline
                style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  objectFit: 'cover',
                  filter: 'saturate(0.25) contrast(1.3) brightness(0.72)',
                }}
              />
              {/* Scanlines */}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.20) 3px, rgba(0,0,0,0.20) 4px)',
              }} />
              {/* Subtle lime vignette */}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'linear-gradient(135deg, rgba(204,255,0,0.04) 0%, transparent 50%)',
              }} />
              {/* Viewfinder corner brackets */}
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
              {/* HUD label bottom-left */}
              <div style={{
                position: 'absolute', bottom: '22px', left: '22px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '7px', letterSpacing: '0.35em', textTransform: 'uppercase',
                color: 'rgba(204,255,0,0.55)',
                background: 'rgba(4,6,10,0.7)', padding: '3px 8px',
                backdropFilter: 'blur(4px)',
              }}>
                [SPECIMEN / PIONEER_MODEL]
              </div>
              {/* Status dot top-right */}
              <div style={{
                position: 'absolute', top: '22px', right: '22px',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <div style={{
                  width: '5px', height: '5px', borderRadius: '50%',
                  background: '#CCFF00', boxShadow: '0 0 8px #CCFF00',
                  animation: 'pulse-lime 2s ease-out infinite',
                }} />
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '6.5px', letterSpacing: '0.3em',
                  color: 'rgba(204,255,0,0.5)',
                }}>LIVE</span>
              </div>
            </div>
          </motion.div>

          {/* ── Ticker strip ── */}
          <motion.div
            className="flex items-center gap-8 mt-8 overflow-hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {['FREE GLOBAL SHIPPING', 'LIMITED STOCK', 'IBROHIM EDITION', 'AUTHENTIC MERCH'].map((t) => (
              <span key={t} className="flex items-center gap-2 text-body text-white/20 text-[9px] tracking-[0.4em] uppercase whitespace-nowrap">
                <span className="w-1 h-1 rounded-full bg-[#CCFF00]" />
                {t}
              </span>
            ))}
          </motion.div>

        </div>
      </section>

      {/* Products */}
      <section id="products" className="px-6 md:px-16 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRODUCTS.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} onBuy={openCheckout} />
            ))}
          </div>

          {/* Footer note */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-body text-white/20 text-xs tracking-[0.4em] uppercase">
              ALL ITEMS SHIP FROM TASHKENT, UZBEKISTAN · WORLDWIDE DELIVERY
            </p>
          </motion.div>
        </div>
      </section>

      {/* Checkout Modal */}
      <CheckoutModal
        product={checkoutProduct}
        onClose={() => setCheckoutProduct(null)}
      />
    </div>
  )
}
