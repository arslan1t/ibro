'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

/* ─── Types ─────────────────────────────────────────────────────── */
interface SiteContent {
  hero: { badge: string; tagline: string; position: string; height: string; weight: string; origin: string }
  stats: { ppg: number; ast: number; reb: number; threePct: number; vertical: number; height: number; wingspan: number; sprint: number; percentile: number }
  pioneer: Array<{ id: string; label: string; title: string; copy: string; accent: string }>
  scoutingReports: Array<{ id: string; classification: string; agency: string; analyst: string; date: string; rating: string; color: string; quote: string }>
  vault: Array<{ id: string; category: string; title: string; social: string }>
  shop: Array<{ id: string; name: string; subtitle: string; price: string; badge: string; desc: string }>
  contact: { email: string; instagram: string; tiktok: string; agent: string }
  meta: { lastUpdated: string; version: string }
}

type Section = 'overview' | 'hero' | 'stats' | 'pioneer' | 'scouting' | 'vault' | 'shop' | 'contact' | 'images' | 'videos' | 'orders'

interface Order {
  id: string; productId: string; productName: string; amount: number
  size: string | null; quantity: number; customerEmail: string; customerName: string
  status: string; createdAt: string; stripeSessionId?: string; note?: string
}

/* ─── Image slot definitions ─────────────────────────────────────── */
const IMAGE_SLOTS = [
  /* Site identity */
  { slot: 'logo-new', label: 'LOGO',               desc: 'Логотип навигации',                                    preview: '/images/logo-new.png' },
  /* Section 02 */
  { slot: 'ibro',     label: 'S02 — MAIN PHOTO',   desc: 'Section 02 — статистика (PNG с прозрачным фоном)',     preview: '/images/ibro.png' },
  /* Section 03 */
  { slot: 'jump',     label: 'S03 — JUMP PHOTO',   desc: 'Section 03 — фото прыжка (фон)',                       preview: '/images/jump.png' },
  /* Section 04 Pioneer */
  { slot: 'location', label: 'S04 — PIONEER 1',    desc: 'Pioneer — Slide 1: TASHKENT / ORIGIN',                 preview: '/images/location.png' },
  { slot: 'arm',      label: 'S04 — PIONEER 2',    desc: 'Pioneer — Slide 2: RESILIENCE',                        preview: '/images/arm.png' },
  { slot: 'leg',      label: 'S04 — PIONEER 3',    desc: 'Pioneer — Slide 3: THE PROTOCOL',                      preview: '/images/leg.png' },
  { slot: 'univers',  label: 'S04 — PIONEER 5',    desc: 'Pioneer — Slide 5: GLOBAL VISION',                     preview: '/images/univers.png' },
  /* Section 05 Archive */
  { slot: 'ref-1',    label: 'S05 — ARCHIVE 1',    desc: 'Archive — фото 1 (Tashkent Origin)',                   preview: '/images/ref-1.png' },
  { slot: 'ref-2',    label: 'S05 — ARCHIVE 2',    desc: 'Archive — фото 2 (Training Session)',                  preview: '/images/ref-2.png' },
  { slot: 'ref-3',    label: 'S05 — ARCHIVE 3',    desc: 'Archive — фото 3 (Court Vision)',                      preview: '/images/ref-3.png' },
  { slot: 'ref-4',    label: 'S05 — ARCHIVE 4',    desc: 'Archive — фото 4',                                     preview: '/images/ref-4.png' },
  { slot: 'ref-5',    label: 'S05 — ARCHIVE 5',    desc: 'Archive — фото 5',                                     preview: '/images/ref-5.png' },
]

/* ─── Video slot definitions ─────────────────────────────────────── */
const VIDEO_SLOTS = [
  /* Section 03 */
  { slot: 'jump-main',        label: 'S03 — JUMP VIDEO',         desc: 'Section 03 — левое видео (прыжок)',              ext: 'mp4', group: 'SECTION 03' },
  { slot: 'recruitment-reel', label: 'S03 — RECRUITMENT REEL',   desc: 'Section 03 — правое видео (игра)',               ext: 'mp4', group: 'SECTION 03' },
  { slot: 'training-raw',     label: 'S03 — TRAINING VIDEO',     desc: 'Section 03 — тренировки',                        ext: 'mp4', group: 'SECTION 03' },
  /* Vault / Section 06 */
  { slot: 'vault-01',         label: 'VAULT 01 — ORIGIN',        desc: 'Vault — WHERE IT STARTED',                       ext: 'mp4', group: 'THE VAULT' },
  { slot: 'vault-02',         label: 'VAULT 02 — THE JUMP',      desc: 'Vault — MAX VERTICAL 110CM',                     ext: 'mp4', group: 'THE VAULT' },
  { slot: 'vault-03',         label: 'VAULT 03 — GROUND WORK',   desc: 'Vault — TRAINING PROTOCOL',                      ext: 'mp4', group: 'THE VAULT' },
  { slot: 'vault-04',         label: 'VAULT 04 — REEL',          desc: 'Vault — FULL SEASON CUT 2024',                   ext: 'mp4', group: 'THE VAULT' },
  { slot: 'vault-05',         label: 'VAULT 05 — SIGNATURE',     desc: 'Vault — POINT GUARD MECHANICS',                  ext: 'mp4', group: 'THE VAULT' },
  { slot: 'vault-06',         label: 'VAULT 06 — GAME DAY',      desc: 'Vault — COMPETITION FOOTAGE',                    ext: 'mp4', group: 'THE VAULT' },
  /* Shop */
  { slot: 'model',            label: 'SHOP — HERO MODEL',        desc: 'Shop — главное видео героя',                     ext: 'mov', group: 'SHOP' },
  { slot: 'hoodie',           label: 'SHOP — HOODIE',            desc: 'Shop — THE CEILING hoodie',                      ext: 'mov', group: 'SHOP' },
  { slot: 'tee',              label: 'SHOP — TEE',               desc: 'Shop — VERTICAL PIONEER tee',                    ext: 'mov', group: 'SHOP' },
  { slot: 'ball',             label: 'SHOP — BASKETBALL',        desc: 'Shop — 110CM SIGNATURE ball',                    ext: 'mov', group: 'SHOP' },
  { slot: 'jersey',           label: 'SHOP — JERSEY',            desc: 'Shop — PIONEER JERSEY',                          ext: 'mov', group: 'SHOP' },
  { slot: 'shoe',             label: 'SHOP — SHOES',             desc: 'Shop — VERTICAL BOOST shoes',                    ext: 'mov', group: 'SHOP' },
  { slot: 'shorts',           label: 'SHOP — SHORTS',            desc: 'Shop — APEX SHORTS',                             ext: 'mov', group: 'SHOP' },
]

/* ─── Helpers ────────────────────────────────────────────────────── */
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" }
const bebas: React.CSSProperties = { fontFamily: "'Bebas Neue', cursive" }
const lime = '#CCFF00'

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ ...mono, fontSize: '7px', letterSpacing: '0.4em', color: 'rgba(204,255,0,0.45)', marginBottom: '6px', textTransform: 'uppercase' }}>
      {children}
    </div>
  )
}

function Input({ value, onChange, type = 'text', multiline = false }: {
  value: string | number; onChange: (v: string) => void; type?: string; multiline?: boolean
}) {
  const base: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff', padding: '9px 12px',
    ...mono, fontSize: '13px', outline: 'none',
    boxSizing: 'border-box', caretColor: lime,
    resize: multiline ? 'vertical' : 'none',
    transition: 'border-color 0.2s',
  }
  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = 'rgba(204,255,0,0.5)')
  const blur  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')

  return multiline
    ? <textarea value={String(value)} rows={3} onChange={e => onChange(e.target.value)} style={base} onFocus={focus} onBlur={blur} />
    : <input type={type} value={String(value)} onChange={e => onChange(e.target.value)} style={base} onFocus={focus} onBlur={blur} />
}

function Field({ label, value, onChange, multiline = false, type = 'text' }: {
  label: string; value: string | number; onChange: (v: string) => void; multiline?: boolean; type?: string
}) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <Label>{label}</Label>
      <Input value={value} onChange={onChange} multiline={multiline} type={type} />
    </div>
  )
}

function SaveBtn({ saving, saved, onClick }: { saving: boolean; saved: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={saving} style={{
      padding: '12px 28px', background: saved ? 'rgba(204,255,0,0.85)' : lime,
      color: '#050505', border: 'none', cursor: 'pointer',
      ...bebas, fontSize: '15px', letterSpacing: '0.2em',
      opacity: saving ? 0.7 : 1, transition: 'all 0.2s',
    }}>
      {saving ? 'SAVING...' : saved ? '✓ SAVED' : 'SAVE CHANGES'}
    </button>
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '24px', border: '1px solid rgba(255,255,255,0.06)', padding: '24px' }}>
      <div style={{ ...bebas, fontSize: '18px', color: '#F0F7FF', letterSpacing: '0.08em', marginBottom: '20px', borderBottom: '1px solid rgba(204,255,0,0.12)', paddingBottom: '12px' }}>
        {title}
      </div>
      {children}
    </div>
  )
}

/* ─── Main admin page ────────────────────────────────────────────── */
export default function AdminPage() {
  const [content,  setContent]  = useState<SiteContent | null>(null)
  const [section,  setSection]  = useState<Section>('overview')
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [loading,  setLoading]  = useState(true)

  /* Load content */
  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then(d => { setContent(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  /* Save content */
  const save = useCallback(async () => {
    if (!content) return
    setSaving(true)
    try {
      await fetch('/api/content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(content) })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally { setSaving(false) }
  }, [content])

  const set = useCallback((path: string, value: unknown) => {
    setContent(prev => {
      if (!prev) return prev
      const next = structuredClone(prev)
      const keys = path.split('.')
      let obj: Record<string, unknown> = next as unknown as Record<string, unknown>
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]] as Record<string, unknown>
      obj[keys[keys.length - 1]] = value
      return next
    })
  }, [])

  const logout = () => { sessionStorage.removeItem('admin_auth'); window.location.reload() }

  const [orders, setOrders] = useState<Order[]>([])

  /* Load orders */
  useEffect(() => {
    fetch('/api/orders').then(r => r.json()).then(setOrders).catch(() => {})
  }, [])

  const [imgUploading, setImgUploading] = useState<Record<string, boolean>>({})
  const [imgDone,      setImgDone]      = useState<Record<string, boolean>>({})
  const [imgPreviews,  setImgPreviews]  = useState<Record<string, string>>({})

  const [vidUploading, setVidUploading] = useState<Record<string, boolean>>({})
  const [vidDone,      setVidDone]      = useState<Record<string, boolean>>({})
  const [vidNames,     setVidNames]     = useState<Record<string, string>>({})

  const uploadImage = async (slot: string, file: File) => {
    setImgUploading(p => ({ ...p, [slot]: true }))
    const fd = new FormData()
    fd.append('file', file)
    fd.append('slot', slot)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.success) {
        setImgPreviews(p => ({ ...p, [slot]: `${data.path}?t=${Date.now()}` }))
        setImgDone(p => ({ ...p, [slot]: true }))
        setTimeout(() => setImgDone(p => ({ ...p, [slot]: false })), 2500)
      }
    } finally {
      setImgUploading(p => ({ ...p, [slot]: false }))
    }
  }

  const uploadVideo = async (slot: string, file: File) => {
    setVidUploading(p => ({ ...p, [slot]: true }))
    const fd = new FormData()
    fd.append('file', file)
    fd.append('slot', slot)
    fd.append('type', 'video')
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.success) {
        setVidNames(p => ({ ...p, [slot]: file.name }))
        setVidDone(p => ({ ...p, [slot]: true }))
        setTimeout(() => setVidDone(p => ({ ...p, [slot]: false })), 3000)
      }
    } finally {
      setVidUploading(p => ({ ...p, [slot]: false }))
    }
  }

  const NAV: { id: Section; label: string; icon: string }[] = [
    { id: 'overview', label: 'OVERVIEW',  icon: '◈' },
    { id: 'hero',     label: 'HERO',      icon: '①' },
    { id: 'stats',    label: 'STATS',     icon: '②' },
    { id: 'pioneer',  label: 'PIONEER',   icon: '④' },
    { id: 'scouting', label: 'SCOUTING',  icon: '⑦' },
    { id: 'vault',    label: 'VAULT',     icon: '⑥' },
    { id: 'shop',     label: 'SHOP',      icon: '🛒' },
    { id: 'contact',  label: 'CONTACT',   icon: '✉' },
    { id: 'images',   label: 'IMAGES',    icon: '🖼' },
    { id: 'videos',   label: 'VIDEOS',    icon: '🎬' },
    { id: 'orders',   label: `ORDERS${orders.length ? ` (${orders.length})` : ''}`,   icon: '💳' },
  ]

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ ...mono, fontSize: '8px', color: 'rgba(204,255,0,0.4)', letterSpacing: '0.5em' }}>LOADING_CONTENT...</span>
    </div>
  )

  if (!content) return (
    <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ ...mono, fontSize: '8px', color: 'rgba(255,80,80,0.7)', letterSpacing: '0.4em' }}>ERROR LOADING CONTENT</span>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', color: '#fff' }}>

      {/* ── Sidebar ── */}
      <div style={{
        width: '220px', flexShrink: 0,
        background: 'rgba(255,255,255,0.02)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(204,255,0,0.1)' }}>
          <div style={{ ...bebas, fontSize: '22px', color: lime, letterSpacing: '0.1em' }}>IBRO ADMIN</div>
          <div style={{ ...mono, fontSize: '6.5px', color: 'rgba(204,255,0,0.3)', letterSpacing: '0.4em', marginTop: '3px' }}>
            CONTROL CENTER
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '12px 0', flex: 1 }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setSection(n.id)} style={{
              width: '100%', textAlign: 'left',
              padding: '11px 20px',
              background: section === n.id ? 'rgba(204,255,0,0.08)' : 'transparent',
              border: 'none',
              borderLeft: section === n.id ? `2px solid ${lime}` : '2px solid transparent',
              color: section === n.id ? lime : 'rgba(255,255,255,0.45)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
              transition: 'all 0.15s',
              ...mono, fontSize: '8px', letterSpacing: '0.25em',
            }}>
              <span style={{ fontSize: '12px', opacity: 0.8 }}>{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/ibrohim" target="_blank" style={{
            display: 'block', textAlign: 'center', padding: '8px',
            border: '1px solid rgba(204,255,0,0.25)', color: lime,
            ...mono, fontSize: '7px', letterSpacing: '0.3em',
            textDecoration: 'none', marginBottom: '8px',
            transition: 'background 0.2s',
          }}>
            VIEW SITE ↗
          </Link>
          <button onClick={logout} style={{
            width: '100%', padding: '8px', background: 'transparent',
            border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.35)',
            cursor: 'pointer', ...mono, fontSize: '7px', letterSpacing: '0.3em',
          }}>
            LOG OUT
          </button>
          {content.meta.lastUpdated && (
            <div style={{ ...mono, fontSize: '6px', color: 'rgba(255,255,255,0.15)', letterSpacing: '0.1em', marginTop: '10px', textAlign: 'center' }}>
              SAVED {new Date(content.meta.lastUpdated).toLocaleString('ru')}
            </div>
          )}
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>

        {/* ══ OVERVIEW ══ */}
        {section === 'overview' && (
          <div>
            <div style={{ ...mono, fontSize: '8px', color: 'rgba(204,255,0,0.4)', letterSpacing: '0.5em', marginBottom: '12px' }}>OVERVIEW</div>
            <h1 style={{ ...bebas, fontSize: '42px', color: '#F0F7FF', letterSpacing: '0.05em', marginBottom: '32px' }}>DASHBOARD</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
              {[
                { label: 'VERTICAL JUMP', value: `${content.stats.vertical}CM`, color: lime },
                { label: 'POINTS/GAME', value: `${content.stats.ppg}`, color: '#F0F7FF' },
                { label: 'HEIGHT', value: `${content.stats.height}CM`, color: '#F0F7FF' },
                { label: 'SCOUTING REPORTS', value: content.scoutingReports.length, color: lime },
                { label: 'VAULT VIDEOS', value: content.vault.length, color: '#F0F7FF' },
                { label: 'SHOP PRODUCTS', value: content.shop.length, color: '#F0F7FF' },
              ].map(s => (
                <div key={s.label} style={{ padding: '20px', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ ...mono, fontSize: '6.5px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.35em', marginBottom: '8px' }}>{s.label}</div>
                  <div style={{ ...bebas, fontSize: '32px', color: s.color, letterSpacing: '0.05em' }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div style={{ padding: '20px', border: '1px solid rgba(204,255,0,0.1)', background: 'rgba(204,255,0,0.02)' }}>
              <div style={{ ...mono, fontSize: '7px', color: 'rgba(204,255,0,0.5)', letterSpacing: '0.4em', marginBottom: '10px' }}>QUICK ACTIONS</div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {NAV.filter(n => n.id !== 'overview').map(n => (
                  <button key={n.id} onClick={() => setSection(n.id)} style={{
                    padding: '8px 16px', background: 'transparent',
                    border: '1px solid rgba(204,255,0,0.2)', color: lime,
                    cursor: 'pointer', ...mono, fontSize: '7.5px', letterSpacing: '0.25em',
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(204,255,0,0.08)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {n.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ HERO ══ */}
        {section === 'hero' && (
          <div>
            <div style={{ ...mono, fontSize: '8px', color: 'rgba(204,255,0,0.4)', letterSpacing: '0.5em', marginBottom: '12px' }}>SECTION_01</div>
            <h1 style={{ ...bebas, fontSize: '42px', color: '#F0F7FF', letterSpacing: '0.05em', marginBottom: '28px' }}>HERO</h1>
            <SectionCard title="BADGE & TAGLINE">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Field label="BADGE TEXT" value={content.hero.badge} onChange={v => set('hero.badge', v)} />
                <Field label="TAGLINE" value={content.hero.tagline} onChange={v => set('hero.tagline', v)} />
              </div>
            </SectionCard>
            <SectionCard title="METRICS (HERO BADGES)">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <Field label="POSITION" value={content.hero.position} onChange={v => set('hero.position', v)} />
                <Field label="HEIGHT" value={content.hero.height} onChange={v => set('hero.height', v)} />
                <Field label="WEIGHT" value={content.hero.weight} onChange={v => set('hero.weight', v)} />
                <Field label="ORIGIN" value={content.hero.origin} onChange={v => set('hero.origin', v)} />
              </div>
            </SectionCard>
            <SaveBtn saving={saving} saved={saved} onClick={save} />
          </div>
        )}

        {/* ══ STATS ══ */}
        {section === 'stats' && (
          <div>
            <div style={{ ...mono, fontSize: '8px', color: 'rgba(204,255,0,0.4)', letterSpacing: '0.5em', marginBottom: '12px' }}>SECTION_02</div>
            <h1 style={{ ...bebas, fontSize: '42px', color: '#F0F7FF', letterSpacing: '0.05em', marginBottom: '28px' }}>STATISTICS</h1>
            <SectionCard title="GAME METRICS">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <Field label="PPG" value={content.stats.ppg} type="number" onChange={v => set('stats.ppg', parseFloat(v))} />
                <Field label="AST" value={content.stats.ast} type="number" onChange={v => set('stats.ast', parseFloat(v))} />
                <Field label="REB" value={content.stats.reb} type="number" onChange={v => set('stats.reb', parseFloat(v))} />
                <Field label="3PT %" value={content.stats.threePct} type="number" onChange={v => set('stats.threePct', parseFloat(v))} />
              </div>
            </SectionCard>
            <SectionCard title="PHYSICAL METRICS">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <Field label="VERTICAL (CM)" value={content.stats.vertical} type="number" onChange={v => set('stats.vertical', parseInt(v))} />
                <Field label="HEIGHT (CM)" value={content.stats.height} type="number" onChange={v => set('stats.height', parseInt(v))} />
                <Field label="WINGSPAN (CM)" value={content.stats.wingspan} type="number" onChange={v => set('stats.wingspan', parseInt(v))} />
                <Field label="0-30M SPRINT (S)" value={content.stats.sprint} type="number" onChange={v => set('stats.sprint', parseFloat(v))} />
              </div>
              <Field label="GLOBAL PERCENTILE (%)" value={content.stats.percentile} type="number" onChange={v => set('stats.percentile', parseFloat(v))} />
            </SectionCard>
            <SaveBtn saving={saving} saved={saved} onClick={save} />
          </div>
        )}

        {/* ══ PIONEER ══ */}
        {section === 'pioneer' && (
          <div>
            <div style={{ ...mono, fontSize: '8px', color: 'rgba(204,255,0,0.4)', letterSpacing: '0.5em', marginBottom: '12px' }}>SECTION_04</div>
            <h1 style={{ ...bebas, fontSize: '42px', color: '#F0F7FF', letterSpacing: '0.05em', marginBottom: '28px' }}>PIONEER NARRATIVE</h1>
            {content.pioneer.map((slide, i) => (
              <SectionCard key={slide.id} title={`SLIDE ${i + 1} — ${slide.label}`}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <Field label="LABEL" value={slide.label} onChange={v => set(`pioneer.${i}.label`, v)} />
                  <div>
                    <Label>ACCENT COLOR</Label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input type="color" value={slide.accent} onChange={e => set(`pioneer.${i}.accent`, e.target.value)}
                        style={{ width: '44px', height: '36px', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', background: 'none' }} />
                      <input type="text" value={slide.accent} onChange={e => set(`pioneer.${i}.accent`, e.target.value)}
                        style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 12px', ...mono, fontSize: '12px', outline: 'none' }} />
                    </div>
                  </div>
                </div>
                <Field label="TITLE (use \\n for line break)" value={slide.title} onChange={v => set(`pioneer.${i}.title`, v)} />
                <Field label="COPY TEXT" value={slide.copy} onChange={v => set(`pioneer.${i}.copy`, v)} multiline />
              </SectionCard>
            ))}
            <SaveBtn saving={saving} saved={saved} onClick={save} />
          </div>
        )}

        {/* ══ SCOUTING ══ */}
        {section === 'scouting' && (
          <div>
            <div style={{ ...mono, fontSize: '8px', color: 'rgba(204,255,0,0.4)', letterSpacing: '0.5em', marginBottom: '12px' }}>SECTION_07</div>
            <h1 style={{ ...bebas, fontSize: '42px', color: '#F0F7FF', letterSpacing: '0.05em', marginBottom: '28px' }}>SCOUTING REPORTS</h1>

            {/* Add button */}
            <button onClick={() => {
              const newReport = { id: `SR-00${content.scoutingReports.length + 1}`, classification: 'NEW PROSPECT', agency: 'AGENCY NAME', analyst: 'ANALYST · DIVISION', date: new Date().toLocaleDateString('en-GB', { month: '2-digit', year: 'numeric' }).replace('/', '.'), rating: '9.0', color: '#CCFF00', quote: 'Enter the scout quote here...' }
              set('scoutingReports', [...content.scoutingReports, newReport])
            }} style={{ marginBottom: '20px', padding: '10px 20px', background: 'rgba(204,255,0,0.08)', border: '1px solid rgba(204,255,0,0.3)', color: lime, cursor: 'pointer', ...mono, fontSize: '8px', letterSpacing: '0.3em' }}>
              + ADD REPORT
            </button>

            {content.scoutingReports.map((r, i) => (
              <SectionCard key={r.id} title={`${r.id} — ${r.agency}`}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '0' }}>
                  <Field label="CLASSIFICATION" value={r.classification} onChange={v => set(`scoutingReports.${i}.classification`, v)} />
                  <Field label="DATE" value={r.date} onChange={v => set(`scoutingReports.${i}.date`, v)} />
                  <Field label="RATING (/ 10.0)" value={r.rating} onChange={v => set(`scoutingReports.${i}.rating`, v)} />
                </div>
                <Field label="AGENCY NAME" value={r.agency} onChange={v => set(`scoutingReports.${i}.agency`, v)} />
                <Field label="ANALYST TITLE" value={r.analyst} onChange={v => set(`scoutingReports.${i}.analyst`, v)} />
                <div style={{ marginBottom: '16px' }}>
                  <Label>ACCENT COLOR</Label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input type="color" value={r.color} onChange={e => set(`scoutingReports.${i}.color`, e.target.value)}
                      style={{ width: '44px', height: '36px', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', background: 'none' }} />
                    <input type="text" value={r.color} onChange={e => set(`scoutingReports.${i}.color`, e.target.value)}
                      style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 12px', ...mono, fontSize: '12px', outline: 'none' }} />
                  </div>
                </div>
                <Field label="QUOTE" value={r.quote} onChange={v => set(`scoutingReports.${i}.quote`, v)} multiline />
                <button onClick={() => set('scoutingReports', content.scoutingReports.filter((_, j) => j !== i))}
                  style={{ padding: '6px 14px', background: 'rgba(255,60,60,0.08)', border: '1px solid rgba(255,60,60,0.25)', color: 'rgba(255,100,100,0.7)', cursor: 'pointer', ...mono, fontSize: '7px', letterSpacing: '0.25em' }}>
                  DELETE REPORT
                </button>
              </SectionCard>
            ))}
            <SaveBtn saving={saving} saved={saved} onClick={save} />
          </div>
        )}

        {/* ══ VAULT ══ */}
        {section === 'vault' && (
          <div>
            <div style={{ ...mono, fontSize: '8px', color: 'rgba(204,255,0,0.4)', letterSpacing: '0.5em', marginBottom: '12px' }}>SECTION_06</div>
            <h1 style={{ ...bebas, fontSize: '42px', color: '#F0F7FF', letterSpacing: '0.05em', marginBottom: '28px' }}>THE VAULT</h1>
            {content.vault.map((v, i) => (
              <SectionCard key={v.id} title={`${v.category}`}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Field label="CATEGORY LABEL" value={v.category} onChange={val => set(`vault.${i}.category`, val)} />
                  <Field label="VIDEO TITLE" value={v.title} onChange={val => set(`vault.${i}.title`, val)} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <Label>SOCIAL PLATFORM</Label>
                  <select value={v.social} onChange={e => set(`vault.${i}.social`, e.target.value)}
                    style={{ width: '200px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '9px 12px', ...mono, fontSize: '12px', outline: 'none', cursor: 'pointer' }}>
                    <option value="instagram">INSTAGRAM</option>
                    <option value="tiktok">TIKTOK</option>
                    <option value="youtube">YOUTUBE</option>
                  </select>
                </div>
              </SectionCard>
            ))}
            <SaveBtn saving={saving} saved={saved} onClick={save} />
          </div>
        )}

        {/* ══ SHOP ══ */}
        {section === 'shop' && (
          <div>
            <div style={{ ...mono, fontSize: '8px', color: 'rgba(204,255,0,0.4)', letterSpacing: '0.5em', marginBottom: '12px' }}>SHOP</div>
            <h1 style={{ ...bebas, fontSize: '42px', color: '#F0F7FF', letterSpacing: '0.05em', marginBottom: '28px' }}>THE DROP</h1>
            {content.shop.map((p, i) => (
              <SectionCard key={p.id} title={`${p.name} — ${p.subtitle}`}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <Field label="PRODUCT NAME" value={p.name} onChange={v => set(`shop.${i}.name`, v)} />
                  <Field label="SUBTITLE" value={p.subtitle} onChange={v => set(`shop.${i}.subtitle`, v)} />
                  <Field label="PRICE" value={p.price} onChange={v => set(`shop.${i}.price`, v)} />
                </div>
                <Field label="BADGE TEXT" value={p.badge} onChange={v => set(`shop.${i}.badge`, v)} />
                <Field label="DESCRIPTION" value={p.desc} onChange={v => set(`shop.${i}.desc`, v)} multiline />
              </SectionCard>
            ))}
            <SaveBtn saving={saving} saved={saved} onClick={save} />
          </div>
        )}

        {/* ══ CONTACT ══ */}
        {section === 'contact' && (
          <div>
            <div style={{ ...mono, fontSize: '8px', color: 'rgba(204,255,0,0.4)', letterSpacing: '0.5em', marginBottom: '12px' }}>CONTACT</div>
            <h1 style={{ ...bebas, fontSize: '42px', color: '#F0F7FF', letterSpacing: '0.05em', marginBottom: '28px' }}>CONTACT INFO</h1>
            <SectionCard title="SOCIAL & CONTACT">
              <Field label="EMAIL" value={content.contact.email} onChange={v => set('contact.email', v)} />
              <Field label="INSTAGRAM URL" value={content.contact.instagram} onChange={v => set('contact.instagram', v)} />
              <Field label="TIKTOK URL" value={content.contact.tiktok} onChange={v => set('contact.tiktok', v)} />
              <Field label="AGENT / MANAGER" value={content.contact.agent} onChange={v => set('contact.agent', v)} />
            </SectionCard>
            <SaveBtn saving={saving} saved={saved} onClick={save} />
          </div>
        )}

        {/* ══ IMAGES ══ */}
        {section === 'images' && (
          <div>
            <div style={{ ...mono, fontSize: '8px', color: 'rgba(204,255,0,0.4)', letterSpacing: '0.5em', marginBottom: '12px' }}>MEDIA</div>
            <h1 style={{ ...bebas, fontSize: '42px', color: '#F0F7FF', letterSpacing: '0.05em', marginBottom: '8px' }}>IMAGE MANAGER</h1>
            <p style={{ ...mono, fontSize: '8px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.2em', marginBottom: '32px' }}>
              ЗАГРУЗИ PNG / JPG — ЗАМЕНЯЕТ ТЕКУЩЕЕ ИЗОБРАЖЕНИЕ НА САЙТЕ СРАЗУ
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {IMAGE_SLOTS.map(({ slot, label, desc, preview }) => {
                const currentSrc = imgPreviews[slot] || preview
                const uploading  = imgUploading[slot]
                const done       = imgDone[slot]

                return (
                  <div key={slot} style={{
                    border: done
                      ? '1px solid rgba(204,255,0,0.55)'
                      : '1px solid rgba(255,255,255,0.07)',
                    background: 'rgba(255,255,255,0.02)',
                    padding: '20px',
                    transition: 'border-color 0.3s',
                  }}>
                    {/* Preview */}
                    <div style={{
                      position: 'relative', width: '100%', paddingTop: '75%',
                      background: '#0A0A0A', marginBottom: '14px', overflow: 'hidden',
                    }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={currentSrc}
                        alt={label}
                        style={{
                          position: 'absolute', inset: 0,
                          width: '100%', height: '100%',
                          objectFit: 'contain',
                          opacity: uploading ? 0.3 : 1,
                          transition: 'opacity 0.2s',
                          mixBlendMode: slot === 'ibro' ? 'screen' : 'normal',
                        }}
                      />
                      {uploading && (
                        <div style={{
                          position: 'absolute', inset: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <span style={{ ...mono, fontSize: '8px', color: lime, letterSpacing: '0.4em' }}>UPLOADING...</span>
                        </div>
                      )}
                      {done && (
                        <div style={{
                          position: 'absolute', top: '8px', right: '8px',
                          background: lime, color: '#050505',
                          padding: '3px 8px', ...mono, fontSize: '7px', letterSpacing: '0.25em',
                        }}>
                          ✓ UPDATED
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ ...bebas, fontSize: '16px', color: '#F0F7FF', letterSpacing: '0.05em', marginBottom: '4px' }}>
                      {label}
                    </div>
                    <div style={{ ...mono, fontSize: '7px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', marginBottom: '14px', lineHeight: 1.5 }}>
                      {desc}
                    </div>

                    {/* Upload button */}
                    <label style={{
                      display: 'block', width: '100%', padding: '10px',
                      background: uploading ? 'rgba(204,255,0,0.12)' : 'rgba(204,255,0,0.08)',
                      border: `1px solid ${uploading ? 'rgba(204,255,0,0.6)' : 'rgba(204,255,0,0.3)'}`,
                      color: lime, cursor: uploading ? 'not-allowed' : 'pointer',
                      ...mono, fontSize: '8px', letterSpacing: '0.3em',
                      textAlign: 'center', transition: 'all 0.2s', boxSizing: 'border-box',
                    }}
                      onMouseEnter={e => !uploading && (e.currentTarget.style.background = 'rgba(204,255,0,0.15)')}
                      onMouseLeave={e => !uploading && (e.currentTarget.style.background = 'rgba(204,255,0,0.08)')}
                    >
                      {uploading ? 'UPLOADING...' : '↑ REPLACE IMAGE'}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploading}
                        style={{ display: 'none' }}
                        onChange={e => {
                          const file = e.target.files?.[0]
                          if (file) uploadImage(slot, file)
                          e.target.value = ''
                        }}
                      />
                    </label>
                  </div>
                )
              })}
            </div>

            {/* Tip */}
            <div style={{
              marginTop: '28px', padding: '16px 20px',
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.01)',
            }}>
              <div style={{ ...mono, fontSize: '7px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.25em', lineHeight: 1.8 }}>
                ◈ PNG рекомендуется для фото с прозрачным фоном (ibro.png, jump.png)<br/>
                ◈ Файл перезаписывается сразу — обнови страницу сайта чтобы увидеть изменения<br/>
                ◈ Оптимальные размеры: минимум 800×800px, формат 1:1 или 4:3
              </div>
            </div>
          </div>
        )}

        {/* ══ VIDEOS ══ */}
        {section === 'videos' && (
          <div>
            <div style={{ ...mono, fontSize: '8px', color: 'rgba(204,255,0,0.4)', letterSpacing: '0.5em', marginBottom: '12px' }}>MEDIA</div>
            <h1 style={{ ...bebas, fontSize: '42px', color: '#F0F7FF', letterSpacing: '0.05em', marginBottom: '8px' }}>VIDEO MANAGER</h1>
            <p style={{ ...mono, fontSize: '8px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.2em', marginBottom: '32px' }}>
              MP4 / MOV — ЗАМЕНЯЕТ ТЕКУЩЕЕ ВИДЕО СРАЗУ
            </p>

            {(['SECTION 03', 'THE VAULT', 'SHOP'] as const).map(group => (
              <div key={group} style={{ marginBottom: '32px' }}>
                <div style={{ ...mono, fontSize: '7px', color: 'rgba(204,255,0,0.4)', letterSpacing: '0.5em', marginBottom: '16px', borderBottom: '1px solid rgba(204,255,0,0.1)', paddingBottom: '8px' }}>
                  {group}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                  {VIDEO_SLOTS.filter(s => s.group === group).map(({ slot, label, desc, ext }) => {
                const uploading = vidUploading[slot]
                const done      = vidDone[slot]
                const uploaded  = vidNames[slot]

                return (
                  <div key={slot} style={{
                    border: done
                      ? '1px solid rgba(204,255,0,0.55)'
                      : '1px solid rgba(255,255,255,0.07)',
                    background: 'rgba(255,255,255,0.02)',
                    padding: '20px',
                    transition: 'border-color 0.3s',
                  }}>
                    {/* Video preview placeholder */}
                    <div style={{
                      width: '100%', paddingTop: '56.25%',
                      background: '#0A0A0A', marginBottom: '14px',
                      position: 'relative', overflow: 'hidden',
                    }}>
                      <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: '8px',
                      }}>
                        <span style={{ fontSize: '28px', opacity: 0.3 }}>🎬</span>
                        <span style={{ ...mono, fontSize: '7px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.3em' }}>
                          {uploaded ? uploaded : `${slot}.${ext}`}
                        </span>
                        {done && (
                          <div style={{
                            position: 'absolute', top: '8px', right: '8px',
                            background: lime, color: '#050505',
                            padding: '3px 8px', ...mono, fontSize: '7px', letterSpacing: '0.2em',
                          }}>
                            ✓ UPDATED
                          </div>
                        )}
                        {uploading && (
                          <div style={{
                            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <span style={{ ...mono, fontSize: '8px', color: lime, letterSpacing: '0.4em' }}>
                              UPLOADING...
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div style={{ ...bebas, fontSize: '16px', color: '#F0F7FF', letterSpacing: '0.05em', marginBottom: '4px' }}>
                      {label}
                    </div>
                    <div style={{ ...mono, fontSize: '7px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', marginBottom: '14px', lineHeight: 1.5 }}>
                      {desc}
                    </div>

                    {/* Upload */}
                    <label style={{
                      display: 'block', width: '100%', padding: '10px',
                      background: uploading ? 'rgba(204,255,0,0.12)' : 'rgba(204,255,0,0.06)',
                      border: `1px solid ${uploading ? 'rgba(204,255,0,0.6)' : 'rgba(204,255,0,0.25)'}`,
                      color: lime, cursor: uploading ? 'not-allowed' : 'pointer',
                      ...mono, fontSize: '8px', letterSpacing: '0.3em',
                      textAlign: 'center', transition: 'all 0.2s', boxSizing: 'border-box',
                    }}
                      onMouseEnter={e => !uploading && (e.currentTarget.style.background = 'rgba(204,255,0,0.12)')}
                      onMouseLeave={e => !uploading && (e.currentTarget.style.background = 'rgba(204,255,0,0.06)')}
                    >
                      {uploading ? 'UPLOADING...' : '↑ REPLACE VIDEO'}
                      <input
                        type="file"
                        accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
                        disabled={uploading}
                        style={{ display: 'none' }}
                        onChange={e => {
                          const file = e.target.files?.[0]
                          if (file) uploadVideo(slot, file)
                          e.target.value = ''
                        }}
                      />
                    </label>
                  </div>
                )
              })}
                </div>
              </div>
            ))}

            <div style={{
              marginTop: '16px', padding: '16px 20px',
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.01)',
            }}>
              <div style={{ ...mono, fontSize: '7px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.25em', lineHeight: 1.8 }}>
                ◈ MP4 — Section 03, Vault карточки<br/>
                ◈ MOV — видео товаров в магазине<br/>
                ◈ Рекомендуемый размер: до 80MB, разрешение 1080p<br/>
                ◈ Файл перезаписывается сразу — обнови страницу сайта чтобы увидеть изменения
              </div>
            </div>
          </div>
        )}

        {/* ══ ORDERS ══ */}
        {section === 'orders' && (
          <div>
            <div style={{ ...mono, fontSize: '8px', color: 'rgba(204,255,0,0.4)', letterSpacing: '0.5em', marginBottom: '12px' }}>COMMERCE</div>
            <h1 style={{ ...bebas, fontSize: '42px', color: '#F0F7FF', letterSpacing: '0.05em', marginBottom: '8px' }}>ORDERS</h1>
            <p style={{ ...mono, fontSize: '8px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.2em', marginBottom: '28px' }}>
              {orders.length} ORDER{orders.length !== 1 ? 'S' : ''} RECEIVED
            </p>

            {/* Stripe setup notice */}
            <div style={{
              padding: '16px 20px', marginBottom: '24px',
              border: '1px solid rgba(204,255,0,0.2)',
              background: 'rgba(204,255,0,0.03)',
            }}>
              <div style={{ ...bebas, fontSize: '14px', color: lime, letterSpacing: '0.1em', marginBottom: '8px' }}>
                ⚡ STRIPE SETUP
              </div>
              <div style={{ ...mono, fontSize: '7px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em', lineHeight: 1.9 }}>
                Добавь ключи в файл <span style={{ color: lime }}>.env.local</span> → перезапусти сервер → оплата через Stripe заработает:<br />
                <span style={{ color: 'rgba(204,255,0,0.6)' }}>STRIPE_SECRET_KEY=sk_live_...</span><br />
                <span style={{ color: 'rgba(204,255,0,0.6)' }}>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...</span><br />
                <span style={{ color: 'rgba(204,255,0,0.6)' }}>NEXT_PUBLIC_SITE_URL=https://твой-домен.com</span><br />
                Ключи: <span style={{ color: lime }}>dashboard.stripe.com/apikeys</span>
              </div>
            </div>

            {orders.length === 0 ? (
              <div style={{
                padding: '48px', textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.01)',
              }}>
                <div style={{ ...bebas, fontSize: '24px', color: 'rgba(255,255,255,0.15)', letterSpacing: '0.1em', marginBottom: '8px' }}>
                  NO ORDERS YET
                </div>
                <div style={{ ...mono, fontSize: '7px', color: 'rgba(255,255,255,0.15)', letterSpacing: '0.3em' }}>
                  ORDERS WILL APPEAR HERE AFTER FIRST PURCHASE
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {orders.map((order) => (
                  <div key={order.id} style={{
                    padding: '20px 24px',
                    border: `1px solid ${order.status === 'pending_payment' ? 'rgba(255,200,0,0.2)' : 'rgba(204,255,0,0.15)'}`,
                    background: 'rgba(255,255,255,0.02)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr auto',
                    gap: '16px',
                    alignItems: 'center',
                  }}>
                    {/* Product + customer */}
                    <div>
                      <div style={{ ...bebas, fontSize: '16px', color: '#F0F7FF', letterSpacing: '0.05em', marginBottom: '4px' }}>
                        {order.productName}
                      </div>
                      <div style={{ ...mono, fontSize: '7px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em' }}>
                        {order.customerName || '—'} · {order.customerEmail || '—'}
                      </div>
                    </div>

                    {/* Size + qty */}
                    <div>
                      {order.size && (
                        <div style={{ ...mono, fontSize: '8px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.25em', marginBottom: '2px' }}>
                          SIZE: {order.size}
                        </div>
                      )}
                      <div style={{ ...mono, fontSize: '7px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em' }}>
                        QTY: {order.quantity || 1}
                      </div>
                    </div>

                    {/* Amount + date */}
                    <div>
                      <div style={{ ...bebas, fontSize: '20px', color: lime, letterSpacing: '0.05em', marginBottom: '4px' }}>
                        ${((order.amount || 0) / 100).toFixed(2)}
                      </div>
                      <div style={{ ...mono, fontSize: '7px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>
                        {new Date(order.createdAt).toLocaleString('ru')}
                      </div>
                    </div>

                    {/* Status badge */}
                    <div style={{
                      padding: '5px 12px',
                      border: `1px solid ${order.status === 'pending_payment' ? 'rgba(255,200,0,0.4)' : 'rgba(204,255,0,0.3)'}`,
                      color: order.status === 'pending_payment' ? 'rgba(255,200,0,0.8)' : lime,
                      ...mono, fontSize: '6.5px', letterSpacing: '0.25em',
                      whiteSpace: 'nowrap',
                    }}>
                      {order.status === 'pending_payment' ? 'MANUAL PAY' : order.status.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
