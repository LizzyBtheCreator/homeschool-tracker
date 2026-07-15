'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { SUBJECTS, getLessonsForSubjectAndGrade, type Subject } from '@/lib/curriculum'

interface Progress {
  subject: Subject
  placed_grade: number | null
  lessons_completed: number
  current_lesson: number
  last_score: number | null
}

export default function StudentDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [studentId, setStudentId] = useState<string | null>(null)
  const [studentName, setStudentName] = useState('Mathias')
  const [progress, setProgress] = useState<Progress[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [loginErr, setLoginErr] = useState('')

  const load = useCallback(async (sid: string) => {
    const { data: prog } = await supabase
      .from('hs_progress')
      .select('*')
      .eq('student_id', sid)
    setProgress(prog || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        fetchStudent()
      } else {
        setLoading(false)
      }
    })
  }, [])

  async function fetchStudent() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }
    setAuthed(true)
    let { data: s } = await supabase.from('hs_students').select('id,name').eq('user_id', user.id).single()
    if (!s) {
      const { data: anyS } = await supabase.from('hs_students').select('id,name').limit(1).single()
      s = anyS
    }
    if (s) { setStudentId(s.id); setStudentName(s.name); load(s.id) }
    else setLoading(false)
  }

  // Default grades per subject — used if no DB record exists
  const DEFAULT_GRADES: Record<Subject, number> = {
    math: 4, ela: 4, science: 8, history: 7, writing: 5
  }

  async function startSubject(subject: Subject) {
    if (!studentId) return
    const grade = getSubjectProgress(subject)?.placed_grade ?? DEFAULT_GRADES[subject]
    await supabase.from('hs_progress').upsert({
      student_id: studentId,
      subject,
      placed_grade: grade,
      current_lesson: 1,
      lessons_completed: 0,
      last_score: null,
    }, { onConflict: 'student_id,subject' })
    window.location.href = `/lesson/${subject}/${grade}/1`
  }

  async function login(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setLoginErr('Wrong email or password')
    else fetchStudent()
  }

  function getSubjectProgress(subject: Subject): Progress | undefined {
    return progress.find(p => p.subject === subject)
  }

  function subjectStatus(subject: Subject) {
    const p = getSubjectProgress(subject)
    if (!p?.placed_grade) return 'placement'
    const lessons = getLessonsForSubjectAndGrade(subject, p.placed_grade)
    if (lessons.length === 0) return 'lesson'
    if (p.current_lesson > lessons.length) return 'done'
    return 'lesson'
  }

  if (!authed && !loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="card" style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem' }}>🚀</div>
        <h1 style={{ margin: '0.5rem 0', fontSize: '1.5rem', fontWeight: 800 }}>Student Login</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Ready to learn today?</p>
        <form onSubmit={login} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
          <div><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
          <div><label>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
          {loginErr && <div style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{loginErr}</div>}
          <button className="btn btn-primary" type="submit">Let&apos;s Go! →</button>
        </form>
        <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <a href="/" style={{ color: 'var(--primary)' }}>← Parent login</a>
        </p>
      </div>
    </div>
  )

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ fontSize: '2rem' }}>⏳</div>
      <div>Loading your dashboard…</div>
    </div>
  )

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const allPlaced = SUBJECTS.every(s => getSubjectProgress(s.key)?.placed_grade)

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '1.5rem 1rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800 }}>Hey, {studentName}! 👋</h1>
        <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)' }}>{today}</p>
      </div>

      {!allPlaced && (
        <div className="card" style={{ marginBottom: '1.5rem', borderColor: 'var(--primary)', background: 'var(--primary-light)' }}>
          <h2 style={{ margin: '0 0 0.5rem', color: 'var(--primary)', fontSize: '1.1rem' }}>🎯 Let&apos;s find your level first!</h2>
          <p style={{ margin: '0 0 1rem', color: 'var(--primary)', fontSize: '0.9rem' }}>
            Before you start lessons, take a quick quiz in each subject. It&apos;s not a test — it just helps us put you in the right spot so things aren&apos;t too easy or too hard.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {SUBJECTS.filter(s => !getSubjectProgress(s.key)?.placed_grade).map(s => (
              <a key={s.key} href={`/placement/${s.key}`} className="btn btn-primary" style={{ textDecoration: 'none' }}>
                {s.emoji} Start {s.label} Quiz
              </a>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {SUBJECTS.map(s => {
          const p = getSubjectProgress(s.key)
          const status = subjectStatus(s.key)
          const lessons = p?.placed_grade ? getLessonsForSubjectAndGrade(s.key, p.placed_grade) : []
          const currentLesson = lessons[p ? p.current_lesson - 1 : 0]

          return (
            <div key={s.key} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '2.5rem', flexShrink: 0 }}>{s.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{s.label}</div>
                {status === 'placement' && (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Take placement quiz to get started</div>
                )}
                {status === 'lesson' && currentLesson && (
                  <>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Grade {p?.placed_grade ?? DEFAULT_GRADES[s.key]} · Lesson {p?.current_lesson ?? 1} of {lessons.length}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{currentLesson.title}</div>
                    <div style={{ marginTop: '0.5rem', height: 6, background: 'var(--border)', borderRadius: 99 }}>
                      <div style={{ height: '100%', background: 'var(--primary)', borderRadius: 99, width: `${(((p?.current_lesson ?? 1) - 1) / lessons.length) * 100}%` }} />
                    </div>
                  </>
                )}
                {(status === 'lesson' || status === 'placement') && !currentLesson && (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Grade {DEFAULT_GRADES[s.key]} · Ready to start</div>
                )}
                {status === 'done' && (
                  <div style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600 }}>✓ All lessons complete!</div>
                )}
              </div>
              <div style={{ flexShrink: 0 }}>
                {status === 'placement' && currentLesson && (
                  <a href={`/placement/${s.key}`} className="btn btn-primary" style={{ textDecoration: 'none', fontSize: '0.85rem' }}>
                    Take Quiz
                  </a>
                )}
                {status === 'lesson' && currentLesson && (
                  <a href={`/lesson/${s.key}/${p?.placed_grade ?? DEFAULT_GRADES[s.key]}/${p?.current_lesson ?? 1}`} className="btn btn-primary" style={{ textDecoration: 'none', fontSize: '0.85rem' }}>
                    Start →
                  </a>
                )}
                {(status === 'lesson' || status === 'placement') && !currentLesson && (
                  <button className="btn btn-primary" style={{ fontSize: '0.85rem' }} onClick={() => startSubject(s.key)}>
                    Start →
                  </button>
                )}
                {status === 'done' && (
                  <span className="badge badge-success">Done!</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <button onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}>
          Sign out
        </button>
      </div>
    </div>
  )
}
