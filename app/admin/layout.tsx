'use client'
import { useState, useEffect, type ReactNode } from 'react'

const ADMIN_PASS = 'ibro2024'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [authed,   setAuthed]   = useState(false)
  const [pass,     setPass]     = useState('')
  const [error,    setError]    = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    setAuthed(sessionStorage.getItem('admin_auth') === 'true')
    setChecking(false)
  }, [])

  const login = () => {
    if (pass === ADMIN_PASS) {
      sessionStorage.setItem('admin_auth', 'true')
      setAuthed(true)
      setError(false)
    } else {
      setError(true)
      setPass('')
    }
  }

  if (checking) return null

  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh', background: '#050505',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(204,255,0,0.15)',
          padding: '48px 40px', width: '360px',
        }}>
          <div style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: '28px', color: '#CCFF00', letterSpacing: '0.1em',
            marginBottom: '6px',
          }}>
            IBRO ADMIN
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '7px', color: 'rgba(204,255,0,0.35)', letterSpacing: '0.4em',
            marginBottom: '32px',
          }}>
            RESTRICTED ACCESS · ENTER CREDENTIALS
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '7px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.35em',
              marginBottom: '8px',
            }}>
              PASSWORD
            </div>
            <input
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
              placeholder="········"
              style={{
                width: '100%', background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${error ? 'rgba(255,80,80,0.5)' : 'rgba(204,255,0,0.2)'}`,
                color: '#fff', padding: '10px 14px',
                fontFamily: "'JetBrains Mono', monospace", fontSize: '13px',
                outline: 'none', boxSizing: 'border-box',
                caretColor: '#CCFF00',
              }}
            />
            {error && (
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '7px', color: 'rgba(255,80,80,0.8)',
                letterSpacing: '0.25em', marginTop: '6px',
              }}>
                ACCESS DENIED
              </div>
            )}
          </div>

          <button
            onClick={login}
            style={{
              width: '100%', padding: '12px',
              background: '#CCFF00', color: '#050505',
              fontFamily: "'Bebas Neue', cursive",
              fontSize: '15px', letterSpacing: '0.25em',
              border: 'none', cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            AUTHENTICATE
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
