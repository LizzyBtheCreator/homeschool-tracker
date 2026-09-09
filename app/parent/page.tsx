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
  id: string
  date: string
  status: string
  reason: string | null
}

interface SubjectLog {
  id: string
  date: string
  subject: string
  ep_lesson: string | null
  hours: number | null
  notes: string | null
}

interface Progress {
  subject: string
  placed_grade: number | null
  lessons_completed: number
  last_score: number | null
}

type Tab = 'overview' | 'attendance' | 'subjects' | 'report'

const REQUIRED_DAYS = 180

function getSchoolYearStart() {
  const now = new Date()
  const year = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1
  return `${year}-08-01`
}

function getSchoolYear() {
  const start = new Date(getSchoolYearStart())
  return `${start.getFullYear()}–${start.getFullYear() + 1}`
}

function fmtDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function fmtShort(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function today() {
  return new Date().toISOString().split('T')[0]
}

export default function ParentDashboard() {
  const router = useRouter()
  const supabase = createClient()

  const [students, setStudents] = useState<Student[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [subjectLogs, setSubjectLogs] = useState<SubjectLog[]>([])
  const [progress, setProgress] = useState<Progress[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('overview')

  // Add student form
  const [showAddStudent, setShowAddStudent] = useState(false)
  const [newStudent, setNewStudent] = useState({ name: '', grade: 9, dob: '' })

  // Attendance form
  const [attDate, setAttDate] = useState(today())
  const [attStatus, setAttStatus] = useState('Present')
  const [attReason, setAttReason] = useState('')
  const [attSaving, setAttSaving] = useState(false)
  const [attMsg, setAttMsg] = useState('')

  // Subject log form
  const [subDate, setSubDate] = useState(today())
  const [subSubject, setSubSubject] = useState('')
  const [subLesson, setSubLesson] = useState('')
  const [subHours, setSubHours] = useState('')
  const [subNotes, setSubNotes] = useState('')
  const [subSaving, setSubSaving] = useState(false)
  const [subMsg, setSubMsg] = useState('')

  // Report filters
  const [reportStart, setReportStart] = useState(getSchoolYearStart())
  const [reportEnd, setReportEnd] = useState(today())

  const selectedStudent = students.find(s => s.id === selectedId) ?? null

  const loadStudentData = useCallback(async (studentId: string) => {
    const yearStart = getSchoolYearStart()
    const [{ data: att }, { data: subs }, { data: prog }] = await Promise.all([
      supabase.from('hs_attendance').select('*').eq('student_id', studentId).gte('date', yearStart).order('date', { ascending: false }),
      supabase.from('hs_subjects').select('*').eq('student_id', studentId).gte('date', yearStart).order('date', { ascending: false }),
      supabase.from('hs_progress').select('*').eq('student_id', studentId),
    ])
    setAttendance(att || [])
    setSubjectLogs(subs || [])
    setProgress(prog || [])
  }, [supabase])

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/'); return }
    const { data } = await supabase.from('hs_students').select('*').eq('user_id', user.id).order('name')
    const list = data || []
    setStudents(list)
    if (list.length === 0) { setShowAddStudent(true); setLoading(false); return }
    const first = list[0].id
    setSelectedId(first)
    await loadStudentData(first)
    setLoading(false)
  }, [router, supabase, loadStudentData])

  useEffect(() => { load() }, [load])

  async function switchStudent(id: string) {
    setSelectedId(id)
    await loadStudentData(id)
  }

  async function addStudent() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data, error } = await supabase.from('hs_students').insert({
      user_id: user.id, name: newStudent.name, grade: newStudent.grade, dob: newStudent.dob || null,
    }).select().single()
    if (!error && data) {
      setShowAddStudent(false)
      setNewStudent({ name: '', grade: 9, dob: '' })
      await load()
      switchStudent(data.id)
    }
  }

  async function saveAttendance() {
    if (!selectedStudent) return
    setAttSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('hs_attendance').upsert({
      user_id: user.id, student_id: selectedStudent.id,
      date: attDate, status: attStatus, reason: attReason || null,
    }, { onConflict: 'student_id,date' })
    setAttSaving(false)
    if (!error) {
      setAttMsg('Saved!')
      setTimeout(() => setAttMsg(''), 2500)
      loadStudentData(selectedStudent.id)
      setAttReason('')
    }
  }

  async function saveSubjectLog() {
    if (!selectedStudent || !subSubject) return
    setSubSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('hs_subjects').insert({
      user_id: user.id, student_id: selectedStudent.id,
      date: subDate, subject: subSubject,
      ep_lesson: subLesson || null,
      hours: subHours ? parseFloat(subHours) : null,
      notes: subNotes || null,
    })
    setSubSaving(false)
    if (!error) {
      setSubMsg('Subject logged!')
      setTimeout(() => setSubMsg(''), 2500)
      setSubSubject(''); setSubLesson(''); setSubHours(''); setSubNotes('')
      loadStudentData(selectedStudent.id)
    }
  }

  // Compute stats
  const presentDays = attendance.filter(a => a.status === 'Present').length
  const excusedDays = attendance.filter(a => a.status === 'Excused Absence').length
  const absentDays = attendance.filter(a => a.status === 'Absent').length
  const complianceDays = presentDays + excusedDays  // NC counts excused absences
  const remaining = Math.max(0, REQUIRED_DAYS - complianceDays)
  const pct = Math.min(100, Math.round((complianceDays / REQUIRED_DAYS) * 100))
  const onTrack = complianceDays > 0

  // Report filtered attendance
  const reportAtt = attendance.filter(a => a.date >= reportStart && a.date <= reportEnd)
  const reportSubs = subjectLogs.filter(s => s.date >= reportStart && s.date <= reportEnd)
  const reportPresent = reportAtt.filter(a => a.status === 'Present').length
  const reportExcused = reportAtt.filter(a => a.status === 'Excused Absence').length
  const reportCompliance = reportPresent + reportExcused

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontSize: '1.1rem', color: 'var(--text-muted)' }}>
      Loading…
    </div>
  )

  if (showAddStudent) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="card" style={{ maxWidth: 440, width: '100%' }}>
        <h2 style={{ margin: '0 0 0.25rem' }}>Add a Student</h2>
        <p style={{ margin: '0 0 1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {students.length > 0 ? 'Adding another student to your account.' : "Let's get your first student set up."}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div><label>Student Name</label><input value={newStudent.name} onChange={e => setNewStudent(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Mathias" /></div>
          <div>
            <label>Grade Level</label>
            <select value={newStudent.grade} onChange={e => setNewStudent(p => ({ ...p, grade: +e.target.value }))}>
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(g => <option key={g} value={g}>Grade {g}</option>)}
            </select>
          </div>
          <div><label>Date of Birth (optional)</label><input type="date" value={newStudent.dob} onChange={e => setNewStudent(p => ({ ...p, dob: e.target.value }))} /></div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-primary" onClick={addStudent} disabled={!newStudent.name} style={{ flex: 1 }}>Add Student</button>
            {students.length > 0 && (
              <button className="btn btn-secondary" onClick={() => setShowAddStudent(false)} style={{ flex: 1 }}>Cancel</button>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '1.25rem 1rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>🎓 Parent Dashboard</h1>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>NC Homeschool Compliance · {getSchoolYear()}</div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={() => setShowAddStudent(true)} style={{ fontSize: '0.8rem' }}>+ Add Student</button>
          <a href="/student" className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>Student View →</a>
          <button className="btn btn-secondary" onClick={async () => { await supabase.auth.signOut(); router.push('/') }} style={{ fontSize: '0.8rem' }}>Sign Out</button>
        </div>
      </div>

      {/* Student tabs */}
      {students.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          {students.map(s => (
            <button key={s.id} onClick={() => switchStudent(s.id)} style={{
              padding: '0.45rem 1.1rem', borderRadius: 99, border: '2px solid',
              borderColor: selectedId === s.id ? 'var(--primary)' : 'var(--border)',
              background: selectedId === s.id ? 'var(--primary)' : 'transparent',
              color: selectedId === s.id ? 'white' : 'var(--text)',
              fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
            }}>{s.name} · Gr {s.grade}</button>
          ))}
        </div>
      )}

      {/* Nav tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--border)', paddingBottom: '0' }}>
        {(['overview', 'attendance', 'subjects', 'report'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '0.6rem 1.1rem', border: 'none', borderBottom: tab === t ? '3px solid var(--primary)' : '3px solid transparent',
            background: 'transparent', color: tab === t ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: tab === t ? 700 : 500, cursor: 'pointer', fontSize: '0.9rem', textTransform: 'capitalize',
            marginBottom: '-2px',
          }}>{t === 'report' ? '📄 Report' : t === 'attendance' ? '📅 Attendance' : t === 'subjects' ? '📚 Subjects' : '🏠 Overview'}</button>
        ))}
      </div>

      {/* ═══ OVERVIEW TAB ═══ */}
      {tab === 'overview' && selectedStudent && (
        <div style={{ display: 'grid', gap: '1.25rem' }}>

          {/* 180-day compliance card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem' }}>📊 NC 180-Day Compliance — {selectedStudent.name}</h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>School year {getSchoolYear()} · Requirement: 180 days</div>
              </div>
              <div style={{
                padding: '0.4rem 0.9rem', borderRadius: 99, fontWeight: 700, fontSize: '0.85rem',
                background: remaining === 0 ? 'var(--success-light)' : complianceDays > 90 ? '#fef3c7' : 'var(--danger-light)',
                color: remaining === 0 ? 'var(--success)' : complianceDays > 90 ? '#92400e' : 'var(--danger)',
              }}>
                {remaining === 0 ? '✓ Requirement Met!' : `${remaining} days remaining`}
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ margin: '1.25rem 0 0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 700 }}>{complianceDays} days logged</span>
                <span style={{ color: 'var(--text-muted)' }}>{pct}% of 180</span>
              </div>
              <div style={{ height: 20, background: 'var(--bg)', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
                <div style={{
                  height: '100%', borderRadius: 10, transition: 'width 0.5s',
                  width: `${pct}%`,
                  background: remaining === 0 ? 'var(--success)' : pct > 50 ? 'var(--primary)' : 'var(--warning)',
                }} />
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Days Present', value: presentDays, color: 'var(--success)' },
                { label: 'Excused Absences', value: excusedDays, color: 'var(--warning)' },
                { label: 'Unexcused Absences', value: absentDays, color: 'var(--danger)' },
                { label: 'Subjects Logged', value: subjectLogs.length, color: 'var(--primary)' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color }}>{value}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{label}</div>
                </div>
              ))}
            </div>

            {!onTrack && attendance.length === 0 && (
              <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'var(--bg)', borderRadius: 8, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                No attendance recorded yet for this school year. Use the <strong>Attendance</strong> tab to start logging.
              </div>
            )}
          </div>

          {/* Quick-log today */}
          <div className="card">
            <h2 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>⚡ Quick Log — Today</h2>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: 1, minWidth: 120 }}>
                <label>Student</label>
                <select value={selectedId || ''} onChange={e => switchStudent(e.target.value)}>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <label>Status</label>
                <select value={attStatus} onChange={e => setAttStatus(e.target.value)}>
                  <option>Present</option>
                  <option>Absent</option>
                  <option>Excused Absence</option>
                </select>
              </div>
              {attStatus !== 'Present' && (
                <div style={{ flex: 2, minWidth: 160 }}>
                  <label>Reason</label>
                  <input value={attReason} onChange={e => setAttReason(e.target.value)} placeholder="Sick, field trip…" />
                </div>
              )}
              <button className="btn btn-primary" onClick={() => { setAttDate(today()); saveAttendance() }} disabled={attSaving}>
                {attSaving ? 'Saving…' : 'Mark Today'}
              </button>
              {attMsg && <span style={{ color: 'var(--success)', fontWeight: 600 }}>{attMsg}</span>}
            </div>
          </div>

          {/* Curriculum progress */}
          <div className="card">
            <h2 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>📖 Curriculum Progress — {selectedStudent.name}</h2>
            <div style={{ display: 'grid', gap: '0.65rem', gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))' }}>
              {SUBJECTS.map(s => {
                const p = progress.find(x => x.subject === s.key)
                return (
                  <div key={s.key} style={{ padding: '0.9rem', background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '1.4rem' }}>{s.emoji}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: '0.2rem' }}>{s.label}</div>
                    {p?.placed_grade ? (
                      <>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Grade {p.placed_grade}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.lessons_completed} lessons done</div>
                        {p.last_score != null && (
                          <span className={`badge ${p.last_score >= 80 ? 'badge-success' : 'badge-warning'}`} style={{ marginTop: '0.35rem', display: 'inline-block', fontSize: '0.72rem' }}>
                            Last: {p.last_score}%
                          </span>
                        )}
                      </>
                    ) : (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Not started</div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══ ATTENDANCE TAB ═══ */}
      {tab === 'attendance' && selectedStudent && (
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          <div className="card">
            <h2 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>📅 Log Attendance — {selectedStudent.name}</h2>
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
                  <input value={attReason} onChange={e => setAttReason(e.target.value)} placeholder="Sick, field trip, family event…" />
                </div>
              )}
              <button className="btn btn-primary" onClick={saveAttendance} disabled={attSaving}>
                {attSaving ? 'Saving…' : 'Save'}
              </button>
              {attMsg && <span style={{ color: 'var(--success)', fontWeight: 600 }}>{attMsg}</span>}
            </div>
            <p style={{ margin: '0.75rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              You can log past dates — just change the date above. Each date can only have one status; saving again on the same date will update it.
            </p>
          </div>

          {/* Attendance history */}
          <div className="card">
            <h2 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>Attendance History — School Year {getSchoolYear()}</h2>
            {attendance.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No attendance logged yet for this school year.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                      <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 700 }}>Date</th>
                      <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 700 }}>Status</th>
                      <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 700 }}>Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map(a => (
                      <tr key={a.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.5rem 0.75rem' }}>{fmtDate(a.date)}</td>
                        <td style={{ padding: '0.5rem 0.75rem' }}>
                          <span style={{
                            display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: 99, fontSize: '0.8rem', fontWeight: 600,
                            background: a.status === 'Present' ? 'var(--success-light)' : a.status === 'Excused Absence' ? '#fef3c7' : 'var(--danger-light)',
                            color: a.status === 'Present' ? 'var(--success)' : a.status === 'Excused Absence' ? '#92400e' : 'var(--danger)',
                          }}>{a.status}</span>
                        </td>
                        <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{a.reason || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ SUBJECTS TAB ═══ */}
      {tab === 'subjects' && selectedStudent && (
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          <div className="card">
            <h2 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>📚 Log Subject — {selectedStudent.name}</h2>
            <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
              <div>
                <label>Date</label>
                <input type="date" value={subDate} onChange={e => setSubDate(e.target.value)} />
              </div>
              <div>
                <label>Subject / Course</label>
                <input value={subSubject} onChange={e => setSubSubject(e.target.value)} placeholder="e.g. Math, EP Level 4 Day 120" />
              </div>
              <div>
                <label>Lesson / Day # (optional)</label>
                <input value={subLesson} onChange={e => setSubLesson(e.target.value)} placeholder="e.g. Day 45" />
              </div>
              <div>
                <label>Hours of Instruction</label>
                <input type="number" step="0.25" min="0" max="12" value={subHours} onChange={e => setSubHours(e.target.value)} placeholder="e.g. 1.5" />
              </div>
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <label>Notes (optional)</label>
              <input value={subNotes} onChange={e => setSubNotes(e.target.value)} placeholder="What did they work on? Any observations?" />
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button className="btn btn-primary" onClick={saveSubjectLog} disabled={subSaving || !subSubject}>
                {subSaving ? 'Saving…' : 'Save Subject Log'}
              </button>
              {subMsg && <span style={{ color: 'var(--success)', fontWeight: 600 }}>{subMsg}</span>}
            </div>
          </div>

          {/* Subject log history */}
          <div className="card">
            <h2 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>Subject Log History</h2>
            {subjectLogs.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No subjects logged yet for this school year.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                      <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 700 }}>Date</th>
                      <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 700 }}>Subject</th>
                      <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 700 }}>Lesson</th>
                      <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 700 }}>Hours</th>
                      <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 700 }}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjectLogs.map(s => (
                      <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.5rem 0.75rem' }}>{fmtShort(s.date)}</td>
                        <td style={{ padding: '0.5rem 0.75rem', fontWeight: 600 }}>{s.subject}</td>
                        <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{s.ep_lesson || '—'}</td>
                        <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{s.hours ?? '—'}</td>
                        <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{s.notes || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ REPORT TAB ═══ */}
      {tab === 'report' && selectedStudent && (
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {/* Date filter */}
          <div className="card no-print">
            <h2 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>📄 Compliance Report — {selectedStudent.name}</h2>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div>
                <label>From</label>
                <input type="date" value={reportStart} onChange={e => setReportStart(e.target.value)} />
              </div>
              <div>
                <label>To</label>
                <input type="date" value={reportEnd} onChange={e => setReportEnd(e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={() => window.print()}>🖨️ Print / Save PDF</button>
            </div>
          </div>

          {/* Printable report */}
          <div className="card" id="printable-report">
            <div style={{ textAlign: 'center', borderBottom: '2px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.3rem' }}>NC Homeschool Compliance Report</h2>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>School Year {getSchoolYear()}</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '0.4rem' }}>{selectedStudent.name} · Grade {selectedStudent.grade}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Report Period: {fmtDate(reportStart)} — {fmtDate(reportEnd)}
              </div>
            </div>

            {/* Compliance summary */}
            <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem' }}>Attendance Summary</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              <tbody>
                {[
                  ['Days Present', reportPresent],
                  ['Excused Absences', reportExcused],
                  ['Unexcused Absences', reportAtt.filter(a => a.status === 'Absent').length],
                  ['Total Compliance Days (Present + Excused)', reportCompliance],
                  ['NC 180-Day Requirement', REQUIRED_DAYS],
                  ['Requirement Met?', reportCompliance >= REQUIRED_DAYS ? 'YES ✓' : `Not yet (${REQUIRED_DAYS - reportCompliance} days remaining)`],
                ].map(([label, value]) => (
                  <tr key={String(label)} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.5rem 0.75rem', fontWeight: label === 'Requirement Met?' ? 700 : 400 }}>{label}</td>
                    <td style={{ padding: '0.5rem 0.75rem', fontWeight: 700, color: label === 'Requirement Met?' ? (reportCompliance >= REQUIRED_DAYS ? 'var(--success)' : 'var(--danger)') : 'inherit', textAlign: 'right' }}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Daily attendance log */}
            <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem' }}>Daily Attendance Log</h3>
            {reportAtt.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No attendance recorded in this date range.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg)' }}>
                    <th style={{ textAlign: 'left', padding: '0.4rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Date</th>
                    <th style={{ textAlign: 'left', padding: '0.4rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Status</th>
                    <th style={{ textAlign: 'left', padding: '0.4rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {[...reportAtt].sort((a, b) => a.date.localeCompare(b.date)).map(a => (
                    <tr key={a.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.4rem 0.75rem' }}>{fmtDate(a.date)}</td>
                      <td style={{ padding: '0.4rem 0.75rem' }}>{a.status}</td>
                      <td style={{ padding: '0.4rem 0.75rem', color: 'var(--text-muted)' }}>{a.reason || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Subject log */}
            {reportSubs.length > 0 && (
              <>
                <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem' }}>Subjects Covered</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg)' }}>
                      <th style={{ textAlign: 'left', padding: '0.4rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Date</th>
                      <th style={{ textAlign: 'left', padding: '0.4rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Subject</th>
                      <th style={{ textAlign: 'left', padding: '0.4rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Lesson</th>
                      <th style={{ textAlign: 'left', padding: '0.4rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Hours</th>
                      <th style={{ textAlign: 'left', padding: '0.4rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...reportSubs].sort((a, b) => a.date.localeCompare(b.date)).map(s => (
                      <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.4rem 0.75rem' }}>{fmtShort(s.date)}</td>
                        <td style={{ padding: '0.4rem 0.75rem', fontWeight: 600 }}>{s.subject}</td>
                        <td style={{ padding: '0.4rem 0.75rem', color: 'var(--text-muted)' }}>{s.ep_lesson || '—'}</td>
                        <td style={{ padding: '0.4rem 0.75rem', color: 'var(--text-muted)' }}>{s.hours ?? '—'}</td>
                        <td style={{ padding: '0.4rem 0.75rem', color: 'var(--text-muted)' }}>{s.notes || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            <div style={{ borderTop: '2px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Generated {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · NC Homeschool Compliance Tracker
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .card { box-shadow: none !important; border: 1px solid #ddd !important; }
        }
      `}</style>
    </div>
  )
}
