'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { SUBJECTS } from '@/lib/curriculum'

interface Student {
  id: string
  name: string
  grade: number
  dob: string | null
}

interface AttendanceRecord {
  date: string
  status: string
}

interface Progress {
  subject: string
  placed_grade: number | null
  lessons_completed: number
  last_score: number | null
}

export default function ParentDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [student, setStudent] = useState<Student | null>(null)
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [progress, setProgress] = useState<Progress[]>([])
  const [loading, setLoading] = useState(true)
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0])
  const [attStatus, setAttStatus] = useState('Present')
  const [attReason, setAttReason] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [newStudent, setNewStudent] = useState({ name: '', grade: 7, dob: '' })
  const [showAddStudent, setShowAddStudent] = useState(false)

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/'); return }

    const { data: students } = await supabase
      .from('hs_students')
      .select('*')
      .eq('user_id', user.id)
      .limit(1)
      .single()

    if (!students) { setLoading(false); setShowAddStudent(true); return }
    setStudent(students)

    const { data: att } = await supabase
      .from('hs_attendance')
      .select('date, status')
      .eq('student_id', students.id)
      .order('date', { ascending: false })
      .limit(30)

    setAttendance(att || [])

    const { data: prog } = await supabase
      .from('hs_progress')
      .select('*')
      .eq('student_id', students.id)

    setProgress(prog || [])
    setLoading(false)
  }, [router, supabase])

  useEffect(() => { load() }, [load])

  async function addStudent() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('hs_students').insert({
      user_id: user.id,
      name: newStudent.name,
      grade: newStudent.grade,
      dob: newStudent.dob || null,
    })
    if (!error) { setShowAddStudent(false); load() }
  }

  async function saveAttendance() {
    if (!student) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('hs_attendance').upsert({
      user_id: user.id,
      student_id: student.id,
      date: attDate,
      status: attStatus,
      reason: attReason || null,
    }, { onConflict: 'student_id,date' })
    setSaving(false)
    if (!error) {
      setSaveMsg('Saved!')
      setTimeout(() => setSaveMsg(''), 2000)
      load()
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const presentDays = attendance.filter(a => a.status === 'Present').length
  const schoolYear = getSchoolYear()

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>Loading…</div>

  if (showAddStudent) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="card" style={{ maxWidth: 440, width: '100%' }}>
        <h2 style={{ margin: '0 0 1rem' }}>Add Your Student</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div><label>Student Name</label><input value={newStudent.name} onChange={e => setNewStudent(p => ({ ...p, name: e.target.value }))} placeholder="Mathias" /></div>
          <div><label>Grade Level</label>
            <select value={newStudent.grade} onChange={e => setNewStudent(p => ({ ...p, grade: +e.target.value }))}>
              {[4,5,6,7,8,9,10,11,12].map(g => <option key={g} value={g}>Grade {g}</option>)}
            </select>
          </div>
          <div><label>Date of Birth (optional)</label><input type="date" value={newStudent.dob} onChange={e => setNewStudent(p => ({ ...p, dob: e.target.value }))} /></div>
          <button className="btn btn-primary" onClick={addStudent} disabled={!newStudent.name}>Add Student</button>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>🎓 Parent Dashboard</h1>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {student?.name} · Grade {student?.grade} · {schoolYear}
          </p>
        </div>
        <button className="btn btn-secondary" onClick={signOut}>Sign Out</button>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 1fr' }}>
        {/* Attendance Card */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <h2 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>📅 Mark Attendance</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: 140 }}>
              <label>Date</label>
              <input type="date" value={attDate} onChange={e => setAttDate(e.target.value)} />
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <label>Status</label>
              <select value={attStatus} onChange={e => setAttStatus(e.target.value)}>
                <option>Present</option>
                <option>Absent</option>
                <option>Excused Absence</option>
              </select>
            </div>
            {attStatus !== 'Present' && (
              <div style={{ flex: 2, minWidth: 180 }}>
                <label>Reason (optional)</label>
                <input value={attReason} onChange={e => setAttReason(e.target.value)} placeholder="Sick, field trip…" />
              </div>
            )}
            <button className="btn btn-primary" onClick={saveAttendance} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            {saveMsg && <span style={{ color: 'var(--success)', fontWeight: 600 }}>{saveMsg}</span>}
          </div>

          {/* Summary */}
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{presentDays}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Days Present (last 30)</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>
                {attendance.filter(a => a.status === 'Excused Absence').length}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Excused Absences</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--danger)' }}>
                {attendance.filter(a => a.status === 'Absent').length}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Unexcused Absences</div>
            </div>
          </div>

          {/* Recent attendance */}
          {attendance.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>RECENT</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {attendance.slice(0, 14).map(a => (
                  <span key={a.date} className={`badge ${a.status === 'Present' ? 'badge-success' : a.status === 'Excused Absence' ? 'badge-warning' : ''}`}
                    style={a.status === 'Absent' ? { background: 'var(--danger-light)', color: 'var(--danger)' } : {}}>
                    {formatDate(a.date)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Subject Progress */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem' }}>📊 Subject Progress</h2>
            <a href="/student" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
              → Student View
            </a>
          </div>
          <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
            {SUBJECTS.map(s => {
              const p = progress.find(x => x.subject === s.key)
              return (
                <div key={s.key} style={{ padding: '1rem', background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '1.5rem' }}>{s.emoji}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.25rem' }}>{s.label}</div>
                  {p?.placed_grade ? (
                    <>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Grade {p.placed_grade} level</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.lessons_completed} lessons done</div>
                      {p.last_score != null && (
                        <div style={{ marginTop: '0.4rem' }}>
                          <span className={`badge ${p.last_score >= 80 ? 'badge-success' : 'badge-warning'}`}>
                            Last: {p.last_score}%
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Not yet placed</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function getSchoolYear() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  return month >= 8 ? `${year}–${year + 1}` : `${year - 1}–${year}`
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
