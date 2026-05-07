'use client'

import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Suspense } from 'react'

const mono  = "'JetBrains Mono', monospace"
const bebas = "'Bebas Neue', cursive"
const lime  = '#CCFF00'

function SuccessContent() {
  const params    = useSearchParams()
  const sessionId = params.get('session_id')
  const product   = params.get('product')
  const isDemo    = sessionId === 'demo'

  return (
    <div style={{
      minHeight: '100vh', background: '#050505',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px',
    }}>
      {/* Noise */}
      <div className="noise-overlay" aria-hidden />

      {/* Grid bg */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.025,
        backgroundImage: `linear-gradient(rgba(204,255,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(204,255,0,1) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative', zIndex: 10,
          maxWidth: '480px', width: '100%',
          border: `1px solid ${lime}25`,
          background: 'rgba(204,255,0,0.03)',
          padding: '48px 40px',
          textAlign: 'center',
        }}
      >
        {/* Check mark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 200 }}
          style={{
            width: '72px', height: '72px',
            border: `2px solid ${lime}`,
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px',
            boxShadow: `0 0 30px ${lime}40`,
          }}
        >
          <span style={{ fontFamily: bebas, fontSize: '32px', color: lime }}>✓</span>
        </motion.div>

        <div style={{ fontFamily: mono, fontSize: '7px', color: `${lime}70`, letterSpacing: '0.5em', marginBottom: '10px' }}>
          ORDER CONFIRMED
        </div>

        <h1 style={{
          fontFamily: bebas, fontSize: 'clamp(32px, 6vw, 48px)',
          color: '#F0F7FF', letterSpacing: '0.05em',
          lineHeight: 1.05, marginBottom: '16px',
        }}>
          ORDER RECEIVED
        </h1>

        <p style={{
          fontFamily: mono, fontSize: '11px', color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.1em', lineHeight: 1.8, marginBottom: '32px',
        }}>
          {isDemo
            ? 'Stripe не настроен — заказ сохранён. Ибро свяжется с тобой по email для оплаты и отправки.'
            : 'Оплата прошла успешно. Подтверждение отправлено на твой email. Ожидай трекинг в течение 24 часов.'
          }
        </p>

        {/* Order ref */}
        {sessionId && sessionId !== 'demo' && (
          <div style={{
            fontFamily: mono, fontSize: '7px', color: 'rgba(255,255,255,0.2)',
            letterSpacing: '0.3em', marginBottom: '28px',
            padding: '10px', border: '1px solid rgba(255,255,255,0.06)',
          }}>
            REF: {sessionId.slice(-16).toUpperCase()}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/shop" style={{
            fontFamily: bebas, fontSize: '15px', letterSpacing: '0.2em',
            color: '#050505', background: lime,
            padding: '12px 28px', textDecoration: 'none',
            display: 'inline-block',
          }}>
            BACK TO SHOP
          </Link>
          <Link href="/ibrohim" style={{
            fontFamily: bebas, fontSize: '15px', letterSpacing: '0.2em',
            color: lime, background: 'transparent',
            border: `1px solid ${lime}40`,
            padding: '12px 28px', textDecoration: 'none',
            display: 'inline-block',
          }}>
            HOME BASE
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default function ShopSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
