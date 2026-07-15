'use client'
import { useState, useMemo, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { getLessonsForSubjectAndGrade, SUBJECTS, type Subject, type PracticeQuestion, type MultipleChoiceQuestion, type FillBlankQuestion, type StepQuestion } from '@/lib/curriculum'

// ─── Content renderer ────────────────────────────────────────────────────────

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
    if (part.startsWith('`') && part.endsWith('`')) return <code key={i} style={{ background: '#f1f5f9', padding: '0.1rem 0.35rem', borderRadius: 4, fontSize: '0.88em' }}>{part.slice(1, -1)}</code>
    return part
  })
}

function ContentBlock({ text }: { text: string }) {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) { i++; continue }
    if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      elements.push(<p key={i} style={{ margin: '0.6rem 0', fontWeight: 700, fontSize: '1rem' }}>{line.slice(2, -2)}</p>)
    } else if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
      const items: string[] = []
      while (i < lines.length && (lines[i].startsWith('• ') || lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(lines[i].slice(2))
        i++
      }
      elements.push(<ul key={i} style={{ margin: '0.5rem 0', paddingLeft: '1.25rem' }}>{items.map((it, j) => <li key={j} style={{ marginBottom: '0.3rem', lineHeight: 1.6 }}>{renderInline(it)}</li>)}</ul>)
      continue
    } else if (/^\d+\./.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\./.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s*/, ''))
        i++
      }
      elements.push(<ol key={i} style={{ margin: '0.5rem 0', paddingLeft: '1.25rem' }}>{items.map((it, j) => <li key={j} style={{ marginBottom: '0.3rem', lineHeight: 1.6 }}>{renderInline(it)}</li>)}</ol>)
      continue
    } else if (line.startsWith('|')) {
      const rows: string[][] = []
      while (i < lines.length && lines[i].startsWith('|')) {
        if (!lines[i].match(/^\|[\s:-|]+\|$/)) {
          rows.push(lines[i].split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1).map(c => c.trim()))
        }
        i++
      }
      if (rows.length > 0) elements.push(
        <div key={i} style={{ overflowX: 'auto', margin: '0.75rem 0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead><tr>{rows[0].map((h, j) => <th key={j} style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.4rem 0.75rem', textAlign: 'left', fontWeight: 700 }}>{renderInline(h)}</th>)}</tr></thead>
            <tbody>{rows.slice(1).map((r, j) => <tr key={j}>{r.map((c, k) => <td key={k} style={{ padding: '0.4rem 0.75rem', borderBottom: '1px solid var(--border)' }}>{renderInline(c)}</td>)}</tr>)}</tbody>
          </table>
        </div>
      )
      continue
    } else {
      elements.push(<p key={i} style={{ margin: '0.5rem 0', lineHeight: 1.75 }}>{renderInline(line)}</p>)
    }
    i++
  }
  return <>{elements}</>
}

// ─── Step type styling ────────────────────────────────────────────────────────

function stepStyle(type: string): React.CSSProperties {
  switch (type) {
    case 'example': return { background: '#f0fdf4', borderLeft: '4px solid var(--success)', borderRadius: 10, padding: '1.25rem 1.5rem', marginBottom: '1.25rem' }
    case 'tip':     return { background: '#fffbeb', borderLeft: '4px solid var(--warning)', borderRadius: 10, padding: '1.25rem 1.5rem', marginBottom: '1.25rem' }
    case 'warning': return { background: 'var(--danger-light)', borderLeft: '4px solid var(--danger)', borderRadius: 10, padding: '1.25rem 1.5rem', marginBottom: '1.25rem' }
    default:        return { background: 'var(--bg)', borderRadius: 10, padding: '1.25rem 1.5rem', marginBottom: '1.25rem', border: '1px solid var(--border)' }
  }
}

// ─── Practice question renderers ──────────────────────────────────────────────

function MCQuestion({ q, onCorrect, onWrong }: { q: MultipleChoiceQuestion; onCorrect: () => void; onWrong: () => void }) {
  const [shuffled, setShuffled] = useState(() => q.options.map((opt, i) => ({ opt, correct: i === q.answer })))
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)

  useEffect(() => {
    const indexed = q.options.map((opt, i) => ({ opt, correct: i === q.answer }))
    for (let i = indexed.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indexed[i], indexed[j]] = [indexed[j], indexed[i]]
    }
    setShuffled(indexed)
    setSelected(null)
    setAnswered(false)
  }, [q.id])

  function pick(i: number) {
    if (answered) return
    setSelected(i)
    setAnswered(true)
    if (shuffled[i].correct) onCorrect(); else onWrong()
  }

  return (
    <div>
      <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '1rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{q.question}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {shuffled.map((opt, i) => {
          let bg = 'white', border = 'var(--border)', color = 'var(--text)'
          if (answered) {
            if (opt.correct) { bg = 'var(--success-light)'; border = 'var(--success)'; color = 'var(--success)' }
            else if (i === selected) { bg = 'var(--danger-light)'; border = 'var(--danger)'; color = 'var(--danger)' }
          } else if (selected === i) { bg = 'var(--primary-light)'; border = 'var(--primary)' }
          return (
            <button key={i} onClick={() => pick(i)}
              style={{ padding: '0.75rem 1rem', border: `2px solid ${border}`, borderRadius: 8, background: bg, color, textAlign: 'left', cursor: answered ? 'default' : 'pointer', fontSize: '0.95rem', transition: 'all 0.15s' }}>
              <span style={{ fontWeight: 700, marginRight: '0.5rem' }}>{String.fromCharCode(65 + i)}.</span>{opt.opt}
            </button>
          )
        })}
      </div>
      {answered && (
        <div style={{ marginTop: '0.875rem', padding: '0.875rem', background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--border)' }}>
          <div style={{ fontWeight: 700, color: shuffled[selected!]?.correct ? 'var(--success)' : 'var(--danger)', marginBottom: '0.25rem' }}>
            {shuffled[selected!]?.correct ? '✓ That\'s right!' : '✗ Not quite — but here\'s why:'}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{q.explanation}</div>
        </div>
      )}
    </div>
  )
}

function FillBlank({ q, onCorrect, onWrong }: { q: FillBlankQuestion; onCorrect: () => void; onWrong: () => void }) {
  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [showHint, setShowHint] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (submitted) return
    const isCorrect = value.trim().toLowerCase().replace(/,/g, '') === q.answer.toLowerCase().replace(/,/g, '')
    setCorrect(isCorrect)
    setSubmitted(true)
    if (isCorrect) onCorrect(); else onWrong()
  }

  return (
    <div>
      <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '1rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{q.question}</p>
      <form onSubmit={submit} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          disabled={submitted}
          placeholder="Type your answer…"
          style={{ flex: 1, minWidth: 160, maxWidth: 280, border: submitted ? `2px solid ${correct ? 'var(--success)' : 'var(--danger)'}` : '2px solid var(--border)', borderRadius: 8, padding: '0.625rem 0.875rem', fontSize: '1rem', background: submitted ? (correct ? 'var(--success-light)' : 'var(--danger-light)') : 'white' }}
          autoComplete="off"
        />
        {!submitted && <button className="btn btn-primary" type="submit" disabled={!value.trim()}>Check</button>}
        {!submitted && q.hint && !showHint && (
          <button type="button" className="btn btn-secondary" onClick={() => setShowHint(true)} style={{ fontSize: '0.8rem' }}>Hint</button>
        )}
      </form>
      {showHint && !submitted && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--warning)', fontStyle: 'italic' }}>💡 {q.hint}</div>
      )}
      {submitted && (
        <div style={{ marginTop: '0.875rem', padding: '0.875rem', background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--border)' }}>
          <div style={{ fontWeight: 700, color: correct ? 'var(--success)' : 'var(--danger)', marginBottom: '0.25rem' }}>
            {correct ? '✓ Correct!' : `✗ The answer was: ${q.answer}`}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{q.explanation}</div>
        </div>
      )}
    </div>
  )
}

function StepByStep({ q, onCorrect, onWrong }: { q: StepQuestion; onCorrect: () => void; onWrong: () => void }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [value, setValue] = useState('')
  const [stepResult, setStepResult] = useState<'correct' | 'wrong' | null>(null)
  const [done, setDone] = useState(false)
  const [allCorrect, setAllCorrect] = useState(true)

  const step = q.steps[stepIndex]

  function checkStep(e: React.FormEvent) {
    e.preventDefault()
    const isCorrect = value.trim().toLowerCase().replace(/,/g, '') === step.answer.toLowerCase().replace(/,/g, '')
    setStepResult(isCorrect ? 'correct' : 'wrong')
    if (!isCorrect) setAllCorrect(false)
  }

  function nextStep() {
    if (stepIndex + 1 >= q.steps.length) {
      setDone(true)
      if (allCorrect) onCorrect(); else onWrong()
    } else {
      setStepIndex(i => i + 1)
      setValue('')
      setStepResult(null)
    }
  }

  if (done) return (
    <div style={{ padding: '1rem', background: allCorrect ? 'var(--success-light)' : 'var(--warning-light)', borderRadius: 10, border: `2px solid ${allCorrect ? 'var(--success)' : 'var(--warning)'}` }}>
      <div style={{ fontWeight: 700, color: allCorrect ? 'var(--success)' : 'var(--warning)', marginBottom: '0.25rem' }}>
        {allCorrect ? '✓ You worked through every step correctly!' : '✗ Some steps were off — review and try again!'}
      </div>
      <div style={{ fontSize: '0.875rem' }}>Final answer: <strong>{q.finalAnswer}</strong></div>
    </div>
  )

  return (
    <div>
      <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '1rem', lineHeight: 1.6 }}>{q.problem}</p>
      <div style={{ marginBottom: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Step {stepIndex + 1} of {q.steps.length}</div>
      <div style={{ background: 'var(--primary-light)', borderRadius: 8, padding: '0.875rem 1rem', marginBottom: '1rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
        {renderInline(step.instruction)}
      </div>
      <form onSubmit={checkStep} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)', marginRight: '0.25rem' }}>{step.prompt}</div>
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          disabled={stepResult !== null}
          placeholder="Your answer…"
          style={{ flex: 1, minWidth: 120, maxWidth: 220, border: `2px solid ${stepResult === 'correct' ? 'var(--success)' : stepResult === 'wrong' ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 8, padding: '0.5rem 0.75rem', fontSize: '1rem', background: stepResult === 'correct' ? 'var(--success-light)' : stepResult === 'wrong' ? 'var(--danger-light)' : 'white' }}
          autoComplete="off"
          autoFocus
        />
        {!stepResult && <button className="btn btn-primary" type="submit" disabled={!value.trim()}>Check</button>}
      </form>
      {stepResult && (
        <div style={{ padding: '0.75rem', background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--border)', marginBottom: '0.75rem' }}>
          <div style={{ fontWeight: 700, color: stepResult === 'correct' ? 'var(--success)' : 'var(--danger)', marginBottom: '0.2rem' }}>
            {stepResult === 'correct' ? '✓ Right!' : `✗ The answer is: ${step.answer}`}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{step.explanation}</div>
        </div>
      )}
      {stepResult && (
        <button className="btn btn-primary" onClick={nextStep}>
          {stepIndex + 1 >= q.steps.length ? 'Finish →' : 'Next Step →'}
        </button>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const subject = params.subject as Subject
  const grade = Number(params.grade)
  const lessonNum = Number(params.lesson)
  const supabase = createClient()

  const lessons = getLessonsForSubjectAndGrade(subject, grade)
  const lesson = lessons[lessonNum - 1]
  const subjectInfo = SUBJECTS.find(s => s.key === subject)

  const [phase, setPhase] = useState<'learn' | 'practice' | 'result'>('learn')
  const [stepIndex, setStepIndex] = useState(0)   // for paging through lesson steps

  // practice state
  const [qIndex, setQIndex] = useState(0)
  const [streak, setStreak] = useState(0)
  const [totalAnswered, setTotalAnswered] = useState(0)
  const [totalCorrect, setTotalCorrect] = useState(0)
  const [passed, setPassed] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showNext, setShowNext] = useState(false)

  // Infinite practice pool — cycle and shuffle
  const practicePool = useMemo(() => {
    if (!lesson) return []
    const shuffled = [...lesson.practice].sort(() => Math.random() - 0.5)
    return shuffled
  }, [lesson?.id])

  const currentQ = practicePool[qIndex % practicePool.length]
  const streakNeeded = lesson?.streakNeeded ?? 3

  if (!lesson || !subjectInfo) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p>Lesson not found.</p>
      <a href="/student" className="btn btn-primary" style={{ textDecoration: 'none' }}>← Back</a>
    </div>
  )

  function handleCorrect() {
    const newStreak = streak + 1
    setStreak(newStreak)
    setTotalCorrect(c => c + 1)
    setTotalAnswered(a => a + 1)
    setShowNext(true)
    if (newStreak >= streakNeeded) {
      setPassed(true)
    }
  }

  function handleWrong() {
    setStreak(0)
    setTotalAnswered(a => a + 1)
    setShowNext(true)
  }

  function nextQuestion() {
    if (passed) {
      finishLesson()
    } else {
      setQIndex(i => i + 1)
      setShowNext(false)
    }
  }

  async function finishLesson() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const saved = typeof window !== 'undefined' ? sessionStorage.getItem('activeStudent') : null
      let student: { id: string } | null = saved ? JSON.parse(saved) : null
      if (!student) {
        const { data: s } = await supabase.from('hs_students').select('id').eq('user_id', user.id).limit(1).single()
        student = s
      }
      if (student) {
        const pct = Math.round((totalCorrect / totalAnswered) * 100)
        await supabase.from('hs_progress').upsert({
          student_id: student.id, subject,
          placed_grade: grade,
          lessons_completed: lessonNum,
          current_lesson: lessonNum + 1,
          last_score: pct,
        }, { onConflict: 'student_id,subject' })
        await supabase.from('hs_subjects').insert({
          user_id: user.id, student_id: student.id,
          date: new Date().toISOString().split('T')[0],
          subject: subjectInfo?.label ?? subject,
          ep_lesson: `${lesson.title} (Lesson ${lessonNum})`,
          hours: 0.5,
          notes: `Streak achieved. ${totalCorrect}/${totalAnswered} correct.`,
        })
      }
    }
    setSaving(false)
    setPhase('result')
  }

  // ── RESULT SCREEN ──────────────────────────────────────────────────────────
  if (phase === 'result') {
    const hasNext = lessonNum < lessons.length
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div className="card" style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🌟</div>
          <h1 style={{ margin: '0 0 0.25rem', fontSize: '1.4rem', fontWeight: 800 }}>Lesson Complete!</h1>
          <p style={{ color: 'var(--text-muted)', margin: '0 0 1.5rem' }}>
            You got <strong>{streak}</strong> in a row — {totalCorrect} correct out of {totalAnswered} total tries.
          </p>
          <div style={{ background: 'var(--success-light)', borderRadius: 12, padding: '1rem', marginBottom: '1.5rem', color: 'var(--success)', fontWeight: 600 }}>
            {hasNext ? `Great work! Next up: Lesson ${lessonNum + 1}` : 'You finished all lessons at this level! Amazing job.'}
          </div>
          {hasNext && (
            <a href={`/lesson/${subject}/${grade}/${lessonNum + 1}`} className="btn btn-primary" style={{ width: '100%', display: 'block', textDecoration: 'none', marginBottom: '0.5rem' }}>
              Next Lesson →
            </a>
          )}
          <a href="/student" className="btn btn-secondary" style={{ width: '100%', display: 'block', textDecoration: 'none' }}>
            Back to Dashboard
          </a>
        </div>
      </div>
    )
  }

  // ── PAPER-BASED LESSON SCREEN ─────────────────────────────────────────────
  if (phase === 'practice' && lesson.paperBased) {
    return (
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '1.5rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <a href="/student" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>← Dashboard</a>
          <span style={{ color: 'var(--border)' }}>·</span>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{subjectInfo.emoji} {lesson.title}</span>
        </div>
        <div className="card" style={{ borderColor: 'var(--primary)', background: 'var(--primary-light)', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✏️</div>
          <h2 style={{ margin: '0 0 0.5rem', color: 'var(--primary)', fontSize: '1.15rem' }}>Time to write on paper!</h2>
          <p style={{ margin: 0, color: 'var(--primary)', fontSize: '0.9rem' }}>Complete the assignment below, then click the button when you're done so your parent can review your work.</p>
        </div>
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <ContentBlock text={lesson.paperAssignment || ''} />
        </div>
        <button className="btn btn-primary" style={{ width: '100%', fontSize: '1.05rem', padding: '0.875rem' }}
          onClick={finishLesson} disabled={saving}>
          {saving ? 'Saving…' : "I finished my writing! ✓ (Parent will check)"}
        </button>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button onClick={() => { setPhase('learn'); setStepIndex(0) }}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}>
            Review the lesson again
          </button>
        </div>
      </div>
    )
  }

  // ── PRACTICE SCREEN ────────────────────────────────────────────────────────
  if (phase === 'practice') {
    const streakPct = Math.min((streak / streakNeeded) * 100, 100)
    return (
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '1.5rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <a href="/student" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>← Dashboard</a>
          <span style={{ color: 'var(--border)' }}>·</span>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{subjectInfo.emoji} {lesson.title}</span>
        </div>

        {/* Streak bar */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>🔥 Streak</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{streak} / {streakNeeded} in a row to pass</span>
          </div>
          <div style={{ height: 10, background: 'var(--border)', borderRadius: 99 }}>
            <div style={{ height: '100%', background: streak > 0 ? 'var(--success)' : 'var(--border)', borderRadius: 99, width: `${streakPct}%`, transition: 'width 0.4s' }} />
          </div>
          {streak > 0 && !passed && (
            <div style={{ marginTop: '0.4rem', fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600 }}>
              {streak === streakNeeded - 1 ? 'One more! 🎯' : `Keep going! ${streakNeeded - streak} more to go`}
            </div>
          )}
          {passed && (
            <div style={{ marginTop: '0.4rem', fontSize: '0.9rem', color: 'var(--success)', fontWeight: 700 }}>
              ✓ You did it! Click "Continue" to finish the lesson.
            </div>
          )}
        </div>

        <div className="card">
          {/* Question type badge */}
          <div style={{ marginBottom: '1rem' }}>
            <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
              {currentQ.type === 'multiple-choice' ? 'Multiple Choice' :
               currentQ.type === 'fill-blank' ? 'Fill in the Blank' : 'Step by Step'}
            </span>
          </div>

          {/* Render by type */}
          {!showNext && currentQ.type === 'multiple-choice' && (
            <MCQuestion key={qIndex} q={currentQ as MultipleChoiceQuestion} onCorrect={handleCorrect} onWrong={handleWrong} />
          )}
          {!showNext && currentQ.type === 'fill-blank' && (
            <FillBlank key={qIndex} q={currentQ as FillBlankQuestion} onCorrect={handleCorrect} onWrong={handleWrong} />
          )}
          {!showNext && currentQ.type === 'step-by-step' && (
            <StepByStep key={qIndex} q={currentQ as StepQuestion} onCorrect={handleCorrect} onWrong={handleWrong} />
          )}

          {/* Next button — shows after MC and fill-blank are answered */}
          {showNext && currentQ.type !== 'step-by-step' && (
            <div style={{ marginTop: '1rem' }}>
              <button className="btn btn-primary" onClick={nextQuestion} disabled={saving} style={{ width: '100%' }}>
                {saving ? 'Saving…' : passed ? 'Finish Lesson ✓' : streak === 0 ? 'Try Another One →' : 'Next Question →'}
              </button>
            </div>
          )}
          {showNext && currentQ.type === 'step-by-step' && (
            <div style={{ marginTop: '1rem' }}>
              <button className="btn btn-primary" onClick={nextQuestion} disabled={saving} style={{ width: '100%' }}>
                {saving ? 'Saving…' : passed ? 'Finish Lesson ✓' : 'Next Question →'}
              </button>
            </div>
          )}
        </div>

        {/* Option to review lesson */}
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button onClick={() => { setPhase('learn'); setStepIndex(0) }}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}>
            Review the lesson again
          </button>
        </div>
      </div>
    )
  }

  // ── LEARN SCREEN ───────────────────────────────────────────────────────────
  const currentStep = lesson.steps[stepIndex]
  const isLastStep = stepIndex === lesson.steps.length - 1

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '1.5rem 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <a href="/student" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>← Dashboard</a>
        <span style={{ color: 'var(--border)' }}>·</span>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{subjectInfo.emoji} {subjectInfo.label} · Grade {grade} · Lesson {lessonNum}</span>
      </div>

      {/* Title + intro (only on first step) */}
      {stepIndex === 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ margin: '0 0 0.75rem', fontSize: '1.5rem', fontWeight: 800 }}>{lesson.title}</h1>
          <div style={{ background: 'var(--primary-light)', borderRadius: 10, padding: '1rem 1.25rem', color: 'var(--primary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            {lesson.intro}
          </div>
        </div>
      )}

      {/* Step progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        {lesson.steps.map((_, i) => (
          <div key={i} style={{ height: 6, flex: 1, borderRadius: 99, background: i <= stepIndex ? 'var(--primary)' : 'var(--border)', cursor: i < stepIndex ? 'pointer' : 'default', transition: 'background 0.2s' }}
            onClick={() => i < stepIndex && setStepIndex(i)} />
        ))}
      </div>

      {/* Current step */}
      <div style={stepStyle(currentStep.type)}>
        {currentStep.heading && (
          <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.1rem', fontWeight: 800, color: currentStep.type === 'tip' ? 'var(--warning)' : currentStep.type === 'example' ? 'var(--success)' : 'var(--text)' }}>
            {currentStep.heading}
          </h2>
        )}
        <ContentBlock text={currentStep.content} />
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'space-between', marginTop: '1rem' }}>
        {stepIndex > 0 ? (
          <button className="btn btn-secondary" onClick={() => setStepIndex(i => i - 1)}>← Back</button>
        ) : <div />}
        {!isLastStep ? (
          <button className="btn btn-primary" onClick={() => setStepIndex(i => Math.min(i + 1, lesson.steps.length - 1))}>Next →</button>
        ) : (
          <button className="btn btn-primary" onClick={() => setPhase('practice')}>
            I'm ready — start practice! →
          </button>
        )}
      </div>
    </div>
  )
}
