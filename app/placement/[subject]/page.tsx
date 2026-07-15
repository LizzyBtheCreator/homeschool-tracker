'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { PLACEMENT_QUESTIONS, SUBJECTS, type Subject, type QuizQuestion } from '@/lib/curriculum'

interface ShuffledQuestion extends QuizQuestion {
  shuffledOptions: string[]
  shuffledAnswer: number // index into shuffledOptions
}

function shuffleQuestion(q: QuizQuestion): ShuffledQuestion {
  const indexed = q.options.map((opt, i) => ({ opt, correct: i === q.answer }))
  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexed[i], indexed[j]] = [indexed[j], indexed[i]]
  }
  return {
    ...q,
    shuffledOptions: indexed.map(x => x.opt),
    shuffledAnswer: indexed.findIndex(x => x.correct),
  }
}

export default function PlacementQuiz() {
  const params = useParams()
  const router = useRouter()
  const subject = params.subject as Subject
  const supabase = createClient()

  const subjectInfo = SUBJECTS.find(s => s.key === subject)
  const rawQuestions = PLACEMENT_QUESTIONS[subject] || []
  const [questions, setQuestions] = useState<ShuffledQuestion[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setQuestions(rawQuestions.map(shuffleQuestion))
    setReady(true)
  }, [subject])

  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [gradeScores, setGradeScores] = useState<Record<number, { right: number; total: number }>>({})
  const [done, setDone] = useState(false)
  const [placedGrade, setPlacedGrade] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  const q = questions[qIndex]

  function answer(idx: number) {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    const isCorrect = idx === q.shuffledAnswer
    if (isCorrect) setCorrect(c => c + 1)
    setGradeScores(prev => {
      const gs = prev[q.grade] || { right: 0, total: 0 }
      return { ...prev, [q.grade]: { right: gs.right + (isCorrect ? 1 : 0), total: gs.total + 1 } }
    })
  }

  function next() {
    if (qIndex + 1 >= questions.length) {
      computePlacement()
    } else {
      setQIndex(i => i + 1)
      setSelected(null)
      setAnswered(false)
    }
  }

  function computePlacement() {
    // Find highest grade where student got >= 67% correct
    let placed = 4
    for (const grade of [4, 5, 6, 7, 8, 9, 10, 11, 12]) {
      const gs = gradeScores[grade]
      if (gs && gs.total > 0 && (gs.right / gs.total) >= 0.67) {
        placed = grade
      }
    }
    setPlacedGrade(placed)
    setDone(true)
  }

  async function saveAndStart() {
    if (!placedGrade) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/'); return }
    // Use the student selected on the picker screen
    const saved = typeof window !== 'undefined' ? sessionStorage.getItem('activeStudent') : null
    let student: { id: string } | null = saved ? JSON.parse(saved) : null
    if (!student) {
      const { data: s } = await supabase.from('hs_students').select('id').eq('user_id', user.id).limit(1).single()
      student = s
    }
    if (!student) { router.push('/student'); return }

    await supabase.from('hs_progress').upsert({
      student_id: student.id,
      subject,
      placed_grade: placedGrade,
      lessons_completed: 0,
      current_lesson: 1,
      last_score: null,
    }, { onConflict: 'student_id,subject' })

    setSaving(false)
    router.push(`/lesson/${subject}/${placedGrade}/1`)
  }

  if (!subjectInfo) return <div style={{ padding: '2rem' }}>Subject not found.</div>
  if (!ready) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading…</div>

  if (done && placedGrade) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="card" style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎉</div>
        <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.4rem', fontWeight: 800 }}>Placement Complete!</h1>
        <p style={{ color: 'var(--text-muted)', margin: '0 0 1.5rem' }}>
          You got <strong>{correct} of {questions.length}</strong> correct.
        </p>
        <div style={{ background: 'var(--primary-light)', border: '2px solid var(--primary)', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Starting level for {subjectInfo.label}</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>Grade {placedGrade}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            {placedGrade <= 5 ? "We'll build up from here — you'll move fast once the foundations are solid." :
             placedGrade <= 6 ? "Good foundation! You're working right at a solid middle-school level." :
             "Strong work! You're placed right where you should be."}
          </div>
        </div>
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={saveAndStart} disabled={saving}>
          {saving ? 'Saving…' : `Start Grade ${placedGrade} ${subjectInfo.label} →`}
        </button>
        <button className="btn btn-secondary" style={{ width: '100%', marginTop: '0.5rem' }} onClick={() => router.push('/student')}>
          Back to Dashboard
        </button>
      </div>
    </div>
  )

  const progress = ((qIndex) / questions.length) * 100

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 580, width: '100%' }}>
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ fontWeight: 700 }}>{subjectInfo.emoji} {subjectInfo.label} Placement</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{qIndex + 1} / {questions.length}</div>
          </div>
          <div style={{ height: 8, background: 'var(--border)', borderRadius: 99 }}>
            <div style={{ height: '100%', background: 'var(--primary)', borderRadius: 99, width: `${progress}%`, transition: 'width 0.3s' }} />
          </div>
        </div>

        <div className="card">
          <div className="badge badge-primary" style={{ marginBottom: '1rem' }}>Grade {q.grade} level</div>
          <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.15rem', lineHeight: 1.5 }}>{q.question}</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {q.shuffledOptions.map((opt, i) => {
              let bg = 'white', border = 'var(--border)', color = 'var(--text)'
              if (answered) {
                if (i === q.shuffledAnswer) { bg = 'var(--success-light)'; border = 'var(--success)'; color = 'var(--success)' }
                else if (i === selected) { bg = 'var(--danger-light)'; border = 'var(--danger)'; color = 'var(--danger)' }
              } else if (selected === i) {
                bg = 'var(--primary-light)'; border = 'var(--primary)'
              }
              return (
                <button key={i} onClick={() => answer(i)}
                  style={{ padding: '0.875rem 1rem', border: `2px solid ${border}`, borderRadius: 10, background: bg, color, textAlign: 'left', cursor: answered ? 'default' : 'pointer', fontSize: '0.95rem', fontWeight: 500, transition: 'all 0.15s' }}>
                  <span style={{ fontWeight: 700, marginRight: '0.5rem' }}>{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </button>
              )
            })}
          </div>

          {answered && (
            <div style={{ marginTop: '1rem', padding: '0.875rem', background: 'var(--bg)', borderRadius: 8 }}>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem', color: selected === q.shuffledAnswer ? 'var(--success)' : 'var(--danger)' }}>
                {selected === q.shuffledAnswer ? '✓ Correct!' : '✗ Not quite'}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{q.explanation}</div>
            </div>
          )}

          {answered && (
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={next}>
              {qIndex + 1 >= questions.length ? 'See Results →' : 'Next Question →'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
