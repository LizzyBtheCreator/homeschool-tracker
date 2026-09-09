'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'login' | 'signup' | 'magic'>('login')
  const [magicSent, setMagicSent] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push('/parent')
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    if (mode === 'magic') {
      const { error } = await supabase.auth.signInWithOtp({ email })
      if (error) setError(error.message)
      else setMagicSent(true)
    } else if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        if (error.message.toLowerCase().includes('email')) {
          setError('Email not confirmed — check your inbox, or use "Send magic link" below to sign in without a password.')
        } else {
          setError(error.message)
        }
      } else router.push('/parent')
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setError('Account created! Check your email for a confirmation link, then come back to sign in.')
    }
    setLoading(false)
  }

  if (magicSent) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'var(--bg)' }}>
      <div className="card" style={{ maxWidth: 420, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📬</div>
        <h2 style={{ margin: '0 0 0.75rem' }}>Check your email</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          We sent a sign-in link to <strong>{email}</strong>.<br />
          Click it to open the dashboard — no password needed.
        </p>
        <button className="btn btn-secondary" onClick={() => { setMagicSent(false); setMode('login') }} style={{ marginTop: '1.5rem' }}>
          Back to sign in
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎓</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>Homeschool Academy</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>NC Compliance Tracker &amp; Learning Hub</p>
        </div>

        <div className="card">
          <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem' }}>
            {mode === 'login' ? 'Parent Sign In' : mode === 'signup' ? 'Create Account' : 'Sign In with Magic Link'}
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com" />
            </div>
            {mode !== 'magic' && (
              <div>
                <label>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
              </div>
            )}
            {error && (
              <div style={{ padding: '0.75rem', background: error.includes('created') ? 'var(--success-light)' : 'var(--danger-light)', borderRadius: 8, fontSize: '0.85rem', color: error.includes('created') ? 'var(--success)' : 'var(--danger)', lineHeight: 1.5 }}>
                {error}
              </div>
            )}
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: '0.5rem' }}>
              {loading ? 'Loading…' : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Magic Link'}
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.25rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {mode === 'login' && (
              <>
                <button onClick={() => { setMode('magic'); setError('') }} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, padding: 0 }}>
                  Trouble signing in? Send a magic link →
                </button>
                <button onClick={() => { setMode('signup'); setError('') }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                  Don&apos;t have an account? Sign up
                </button>
              </>
            )}
            {mode !== 'login' && (
              <button onClick={() => { setMode('login'); setError('') }} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, padding: 0 }}>
                ← Back to sign in
              </button>
            )}
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Student?{' '}
          <a href="/student" style={{ color: 'var(--primary)', fontWeight: 600 }}>Go to student view →</a>
        </p>
      </div>
    </div>
  )
}
