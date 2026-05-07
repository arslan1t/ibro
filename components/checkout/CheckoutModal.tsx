'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Lock, ArrowRight, Loader2 } from 'lucide-react'

/* ─── Types ─────────────────────────────────────────────────────── */
export interface CheckoutProduct {
  id: string
  name: string
  subtitle: string
  price: string
  badge: string
  hasSize?: boolean   /* true for clothing */
  accent?: string
}

interface Props {
  product: CheckoutProduct | null
  onClose: () => void
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const mono = "'JetBrains Mono', monospace"
const bebas = "'Bebas Neue', cursive"
const lime = '#CCFF00'

/* ─── CheckoutModal ──────────────────────────────────────────────── */
export default function CheckoutModal({ product, onClose }: Props) {
  const [step, setStep]           = useState<'form' | 'processing' | 'success' | 'error'>('form')
  const [name, setName]           = useState('')
  const [email, setEmail]         = useState('')
  const [size, setSize]           = useState('')
  const [quantity, setQuantity]   = useState(1)
  const [errorMsg, setErrorMsg]   = useState('')

  /* Reset on open */
  useEffect(() => {
    if (product) {
      setStep('form')
      setName(''); setEmail(''); setSize(''); setQuantity(1); setErrorMsg('')
    }
  }, [product])

  /* ESC to close */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const accent = product?.accent || lime

  const submit = useCallback(async () => {
    if (!product) return
    if (!name.trim() || !email.trim()) { setErrorMsg('Fill in name and email'); return }
    if (!email.includes('@')) { setErrorMsg('Enter a valid email'); return }
    if (product.hasSize && !size) { setErrorMsg('Select your size'); return }

    setStep('processing')
    setErrorMsg('')

    try {
      const res  = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          size: size || null,
          quantity,
          customerName: name.trim(),
          customerEmail: email.trim(),
        }),
      })
      const data = await res.json()

      if (data.url) {
        /* Stripe configured → redirect to Stripe Checkout */
        window.location.href = data.url
      } else if (data.mode === 'demo') {
        /* Stripe not configured → demo success flow */
        window.location.href = data.successUrl
      } else {
        throw new Error(data.error || 'Unknown error')
      }
    } catch (e) {
      setErrorMsg('Something went wrong. Try again.')
      setStep('form')
    }
  }, [product, name, email, size, quantity])

  return (
    <AnimatePresence>
      {product && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 9000,
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(8px)',
            }}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 9001,
              width: '100%', maxWidth: '480px',
              background: '#060810',
              borderLeft: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute', top: '20px', right: '20px',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
                width: '36px', height: '36px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10,
              }}
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div style={{
              padding: '32px 32px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ fontFamily: mono, fontSize: '7px', color: 'rgba(204,255,0,0.45)', letterSpacing: '0.5em', marginBottom: '6px' }}>
                SECURE CHECKOUT
              </div>
              <div style={{ fontFamily: bebas, fontSize: '28px', color: '#F0F7FF', letterSpacing: '0.05em', lineHeight: 1, marginBottom: '4px' }}>
                {product.name}
              </div>
              <div style={{ fontFamily: mono, fontSize: '8px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.3em' }}>
                {product.subtitle}
              </div>
            </div>

            {/* Product summary */}
            <div style={{
              margin: '20px 32px',
              padding: '16px 20px',
              background: `rgba(${accent === lime ? '204,255,0' : '240,247,255'},0.04)`,
              border: `1px solid ${accent}20`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontFamily: mono, fontSize: '7px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.3em', marginBottom: '4px' }}>
                  {product.badge}
                </div>
                <div style={{ fontFamily: bebas, fontSize: '24px', color: accent, letterSpacing: '0.05em' }}>
                  {product.price}
                </div>
              </div>
              <div style={{
                width: '40px', height: '40px', border: `1px solid ${accent}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ShoppingBag size={18} color={accent} opacity={0.7} />
              </div>
            </div>

            {/* Form */}
            <div style={{ padding: '0 32px', flex: 1 }}>

              {/* Size selector (clothing only) */}
              {product.hasSize && (
                <div style={{ marginBottom: '22px' }}>
                  <div style={{ fontFamily: mono, fontSize: '7px', color: 'rgba(204,255,0,0.45)', letterSpacing: '0.4em', marginBottom: '10px' }}>
                    SIZE
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {SIZES.map(s => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        style={{
                          width: '48px', height: '40px',
                          background: size === s ? lime : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${size === s ? lime : 'rgba(255,255,255,0.12)'}`,
                          color: size === s ? '#050505' : 'rgba(255,255,255,0.5)',
                          cursor: 'pointer',
                          fontFamily: mono, fontSize: '9px', letterSpacing: '0.15em',
                          transition: 'all 0.15s',
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity (shop items only) */}
              {product.id !== 'protocol' && (
                <div style={{ marginBottom: '22px' }}>
                  <div style={{ fontFamily: mono, fontSize: '7px', color: 'rgba(204,255,0,0.45)', letterSpacing: '0.4em', marginBottom: '10px' }}>
                    QUANTITY
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                    {[1, 2, 3].map(q => (
                      <button
                        key={q}
                        onClick={() => setQuantity(q)}
                        style={{
                          width: '48px', height: '40px',
                          background: quantity === q ? lime : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${quantity === q ? lime : 'rgba(255,255,255,0.12)'}`,
                          color: quantity === q ? '#050505' : 'rgba(255,255,255,0.5)',
                          cursor: 'pointer',
                          fontFamily: mono, fontSize: '12px',
                          transition: 'all 0.15s',
                        }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Name */}
              <FieldInput
                label="FULL NAME"
                placeholder="Your name"
                value={name}
                onChange={setName}
                type="text"
              />

              {/* Email */}
              <FieldInput
                label="EMAIL"
                placeholder="your@email.com"
                value={email}
                onChange={setEmail}
                type="email"
              />

              {/* Error */}
              {errorMsg && (
                <div style={{
                  fontFamily: mono, fontSize: '7.5px', color: 'rgba(255,80,80,0.9)',
                  letterSpacing: '0.2em', marginBottom: '16px',
                  padding: '10px 14px', border: '1px solid rgba(255,80,80,0.2)',
                  background: 'rgba(255,80,80,0.05)',
                }}>
                  {errorMsg}
                </div>
              )}

              {/* Security note */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                marginBottom: '22px',
                padding: '10px 14px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <Lock size={12} color="rgba(255,255,255,0.25)" />
                <span style={{ fontFamily: mono, fontSize: '7px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.2em' }}>
                  SECURED BY STRIPE · 256-BIT SSL ENCRYPTION
                </span>
              </div>
            </div>

            {/* CTA */}
            <div style={{ padding: '20px 32px 32px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {/* Total */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                marginBottom: '16px',
              }}>
                <span style={{ fontFamily: mono, fontSize: '7px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.35em' }}>
                  TOTAL
                </span>
                <span style={{ fontFamily: bebas, fontSize: '28px', color: accent }}>
                  {computeTotal(product.price, quantity)}
                </span>
              </div>

              <button
                onClick={submit}
                disabled={step === 'processing'}
                style={{
                  width: '100%', padding: '16px 24px',
                  background: step === 'processing' ? 'rgba(204,255,0,0.7)' : lime,
                  color: '#050505', border: 'none', cursor: step === 'processing' ? 'not-allowed' : 'pointer',
                  fontFamily: bebas, fontSize: '18px', letterSpacing: '0.2em',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => step !== 'processing' && (e.currentTarget.style.boxShadow = '0 0 28px rgba(204,255,0,0.5)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
              >
                {step === 'processing' ? (
                  <>
                    <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    PROCESSING...
                  </>
                ) : (
                  <>
                    PROCEED TO PAYMENT
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <p style={{
                fontFamily: mono, fontSize: '6.5px', color: 'rgba(255,255,255,0.2)',
                letterSpacing: '0.2em', textAlign: 'center', marginTop: '12px',
              }}>
                ONE-TIME PAYMENT · NO SUBSCRIPTION · INSTANT ACCESS
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ─── Field helper ───────────────────────────────────────────────── */
function FieldInput({ label, placeholder, value, onChange, type }: {
  label: string; placeholder: string; value: string
  onChange: (v: string) => void; type: string
}) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <div style={{ fontFamily: mono, fontSize: '7px', color: 'rgba(204,255,0,0.45)', letterSpacing: '0.4em', marginBottom: '8px' }}>
        {label}
      </div>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#fff', padding: '11px 14px',
          fontFamily: mono, fontSize: '13px',
          outline: 'none', boxSizing: 'border-box',
          caretColor: '#CCFF00',
        }}
        onFocus={e => (e.currentTarget.style.borderColor = 'rgba(204,255,0,0.5)')}
        onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
      />
    </div>
  )
}

/* ─── Compute total with quantity ────────────────────────────────── */
function computeTotal(price: string, qty: number): string {
  const num = parseFloat(price.replace(/[^0-9.]/g, ''))
  if (isNaN(num) || qty <= 1) return price
  const sym = price.startsWith('$') ? '$' : ''
  return `${sym}${(num * qty).toFixed(0)}`
}
