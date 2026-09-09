'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

interface StudyBuddyProps {
  studentName: string
}

// ─── SVG CHARACTERS ──────────────────────────────────────────────────────────

function ElizahBuddy({ mood }: { mood: string }) {
  return (
    <svg viewBox="0 0 120 160" width="100" height="130" xmlns="http://www.w3.org/2000/svg">
      {/* Body / shirt */}
      <rect x="28" y="95" width="64" height="55" rx="8" fill="#e67e22"/>
      {/* Arms */}
      <rect x="8" y="98" width="22" height="12" rx="6" fill="#c0392b" transform="rotate(-15 8 98)"/>
      <rect x="90" y="98" width="22" height="12" rx="6" fill="#c0392b" transform="rotate(15 90 98)"/>
      {/* Hands */}
      <circle cx="9" cy="113" r="8" fill="#6b3a1f"/>
      <circle cx="111" cy="113" r="8" fill="#6b3a1f"/>
      {/* Neck */}
      <rect x="48" y="85" width="24" height="14" rx="4" fill="#6b3a1f"/>
      {/* Head */}
      <ellipse cx="60" cy="60" rx="36" ry="38" fill="#6b3a1f"/>
      {/* Hair - short natural */}
      <ellipse cx="60" cy="26" rx="33" ry="14" fill="#1a0a00"/>
      <ellipse cx="30" cy="42" rx="10" ry="20" fill="#1a0a00"/>
      <ellipse cx="90" cy="42" rx="10" ry="20" fill="#1a0a00"/>
      {/* Left eye (with fly!) */}
      <ellipse cx="44" cy="58" rx="9" ry="10" fill="white"/>
      <circle cx="44" cy="60" r="5" fill="#1a1a2e"/>
      <circle cx="46" cy="58" r="2" fill="white"/>
      {/* FLY on left eye */}
      <g transform="translate(37,51)">
        <ellipse cx="0" cy="0" rx="4" ry="3" fill="#111" opacity="0.9"/>
        <ellipse cx="-2" cy="-2" rx="3" ry="2" fill="#444" opacity="0.6" transform="rotate(-30)"/>
        <ellipse cx="2" cy="-2" rx="3" ry="2" fill="#444" opacity="0.6" transform="rotate(30)"/>
        {/* Fly legs */}
        <line x1="-4" y1="1" x2="-8" y2="3" stroke="#111" strokeWidth="0.7"/>
        <line x1="-4" y1="-1" x2="-8" y2="-3" stroke="#111" strokeWidth="0.7"/>
        <line x1="4" y1="1" x2="8" y2="3" stroke="#111" strokeWidth="0.7"/>
        <line x1="4" y1="-1" x2="8" y2="-3" stroke="#111" strokeWidth="0.7"/>
      </g>
      {/* Right eye */}
      <ellipse cx="76" cy="58" rx="9" ry="10" fill="white"/>
      <circle cx="76" cy="60" r="5" fill="#1a1a2e"/>
      <circle cx="78" cy="58" r="2" fill="white"/>
      {/* Nose */}
      <ellipse cx="60" cy="70" rx="6" ry="5" fill="#5a2e0e"/>
      {/* Mouth */}
      {mood === 'happy' || mood === 'talk'
        ? <path d="M 46 82 Q 60 94 74 82" stroke="#5a2e0e" strokeWidth="2.5" fill="#c0392b" strokeLinecap="round"/>
        : <path d="M 46 84 Q 60 80 74 84" stroke="#5a2e0e" strokeWidth="2" fill="none"/>}
      {/* Teeth when talking */}
      {mood === 'talk' && <rect x="52" y="82" width="16" height="6" rx="2" fill="white"/>}
      {/* Eyebrows */}
      <path d="M 37 47 Q 44 44 51 47" stroke="#1a0a00" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M 69 47 Q 76 44 83 47" stroke="#1a0a00" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Legs */}
      <rect x="35" y="145" width="18" height="12" rx="5" fill="#2c3e50"/>
      <rect x="67" y="145" width="18" height="12" rx="5" fill="#2c3e50"/>
      {/* Shoes */}
      <ellipse cx="44" cy="157" rx="12" ry="6" fill="#1a1a1a"/>
      <ellipse cx="76" cy="157" rx="12" ry="6" fill="#1a1a1a"/>
    </svg>
  )
}

function MathiasBuddy({ mood }: { mood: string }) {
  // Black Caillou with a giant afro
  return (
    <svg viewBox="0 0 120 170" width="100" height="140" xmlns="http://www.w3.org/2000/svg">
      {/* Giant AFro */}
      <ellipse cx="60" cy="52" rx="48" ry="46" fill="#1a0a00"/>
      {/* Afro texture picks */}
      {[15,30,45,60,75,90,105].map((x,i) => (
        <circle key={i} cx={x} cy={20 + (i%3)*8} r="3" fill="#2a1a00" opacity="0.5"/>
      ))}
      <circle cx="20" cy="55" r="4" fill="#2a1a00" opacity="0.4"/>
      <circle cx="100" cy="55" r="4" fill="#2a1a00" opacity="0.4"/>
      <circle cx="18" cy="40" r="3" fill="#2a1a00" opacity="0.4"/>
      <circle cx="102" cy="40" r="3" fill="#2a1a00" opacity="0.4"/>
      {/* Head - round like Caillou */}
      <circle cx="60" cy="70" r="32" fill="#8B5E3C"/>
      {/* Ears */}
      <circle cx="28" cy="72" r="8" fill="#8B5E3C"/>
      <circle cx="92" cy="72" r="8" fill="#7a5230"/>
      {/* Eyes - big and expressive like Caillou */}
      <ellipse cx="46" cy="68" rx="9" ry="10" fill="white"/>
      <circle cx="46" cy="70" r="5.5" fill="#2c1810"/>
      <circle cx="48" cy="68" r="2" fill="white"/>
      <ellipse cx="74" cy="68" rx="9" ry="10" fill="white"/>
      <circle cx="74" cy="70" r="5.5" fill="#2c1810"/>
      <circle cx="76" cy="68" r="2" fill="white"/>
      {/* Eyebrows */}
      <path d="M 38 57 Q 46 53 54 57" stroke="#1a0a00" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M 66 57 Q 74 53 82 57" stroke="#1a0a00" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Nose - little button */}
      <circle cx="60" cy="78" r="4" fill="#7a5230"/>
      <circle cx="58" cy="77" r="1.5" fill="#6a4220"/>
      <circle cx="62" cy="77" r="1.5" fill="#6a4220"/>
      {/* Mouth */}
      {mood === 'happy' || mood === 'talk'
        ? <path d="M 48 88 Q 60 98 72 88" stroke="#5a3010" strokeWidth="2.5" fill="#c0392b" strokeLinecap="round"/>
        : <path d="M 50 90 Q 60 86 70 90" stroke="#5a3010" strokeWidth="2" fill="none"/>}
      {mood === 'talk' && <rect x="53" y="88" width="14" height="5" rx="2" fill="white"/>}
      {/* Caillou-style striped shirt */}
      <rect x="25" y="100" width="70" height="58" rx="8" fill="#3498db"/>
      <rect x="25" y="108" width="70" height="8" fill="#e74c3c"/>
      <rect x="25" y="124" width="70" height="8" fill="#e74c3c"/>
      <rect x="25" y="140" width="70" height="8" fill="#e74c3c"/>
      {/* Arms */}
      <rect x="5" y="102" width="22" height="13" rx="6" fill="#3498db"/>
      <rect x="93" y="102" width="22" height="13" rx="6" fill="#3498db"/>
      {/* Hands */}
      <circle cx="7" cy="118" r="9" fill="#8B5E3C"/>
      <circle cx="113" cy="118" r="9" fill="#8B5E3C"/>
      {/* Legs */}
      <rect x="33" y="153" width="20" height="14" rx="5" fill="#2c3e50"/>
      <rect x="67" y="153" width="20" height="14" rx="5" fill="#2c3e50"/>
      {/* Shoes */}
      <ellipse cx="43" cy="166" rx="13" ry="6" fill="#1a1a1a"/>
      <ellipse cx="77" cy="166" rx="13" ry="6" fill="#1a1a1a"/>
    </svg>
  )
}

function IsaiahBuddy({ mood }: { mood: string }) {
  // Little Tyler Perry - demanding, dramatic kid
  const isTantrum = mood === 'tantrum'
  return (
    <svg viewBox="0 0 130 170" width="110" height="145" xmlns="http://www.w3.org/2000/svg"
      style={{ transform: isTantrum ? 'rotate(-5deg)' : 'none' }}>
      {/* Body - button-up shirt, Tyler Perry style */}
      <rect x="22" y="95" width="76" height="62" rx="8" fill="#2c3e50"/>
      {/* Shirt details */}
      <rect x="55" y="95" width="10" height="62" fill="#1a252f" opacity="0.3"/>
      {/* Buttons */}
      <circle cx="60" cy="105" r="2.5" fill="#bdc3c7"/>
      <circle cx="60" cy="118" r="2.5" fill="#bdc3c7"/>
      <circle cx="60" cy="131" r="2.5" fill="#bdc3c7"/>
      {/* Arms */}
      <rect x="0" y="98" width="24" height="14" rx="7" fill="#2c3e50"
        transform={isTantrum ? "rotate(40 0 98)" : "rotate(-10 0 98)"}/>
      <rect x="96" y="98" width="24" height="14" rx="7" fill="#2c3e50"
        transform={isTantrum ? "rotate(-40 96 98)" : "rotate(10 96 98)"}/>
      {/* Hands - fists when tantrum */}
      <circle cx={isTantrum ? "18" : "6"} cy={isTantrum ? "118" : "115"} r="9" fill="#6b3a1f"/>
      <circle cx={isTantrum ? "112" : "124"} cy={isTantrum ? "118" : "115"} r="9" fill="#6b3a1f"/>
      {/* Neck */}
      <rect x="47" y="83" width="26" height="16" rx="5" fill="#6b3a1f"/>
      {/* Head - Tyler Perry shaped, slightly wide */}
      <ellipse cx="60" cy="58" rx="38" ry="40" fill="#6b3a1f"/>
      {/* Short neat hair */}
      <ellipse cx="60" cy="22" rx="35" ry="12" fill="#111"/>
      <rect x="22" y="22" width="76" height="18" fill="#111"/>
      {/* Ears */}
      <circle cx="22" cy="60" r="8" fill="#6b3a1f"/>
      <circle cx="98" cy="60" r="8" fill="#6b3a1f"/>
      {/* Eyes - intense/demanding */}
      <ellipse cx="44" cy="55" rx="9" ry="8" fill="white"/>
      <circle cx="44" cy="57" r="5" fill="#1a0a00"/>
      <circle cx="46" cy="55" r="2" fill="white"/>
      <ellipse cx="76" cy="55" rx="9" ry="8" fill="white"/>
      <circle cx="76" cy="57" r="5" fill="#1a0a00"/>
      <circle cx="78" cy="55" r="2" fill="white"/>
      {/* Demanding eyebrows - furrowed */}
      <path d="M 36 44 Q 44 40 52 43" stroke="#111" strokeWidth="3" fill="none" strokeLinecap="round"
        transform={isTantrum ? "rotate(-8 44 43)" : ""}/>
      <path d="M 68 43 Q 76 40 84 44" stroke="#111" strokeWidth="3" fill="none" strokeLinecap="round"
        transform={isTantrum ? "rotate(8 76 43)" : ""}/>
      {/* Nose - distinguished */}
      <ellipse cx="60" cy="67" rx="7" ry="6" fill="#5a2e0e"/>
      <circle cx="57" cy="66" r="2" fill="#4a2008"/>
      <circle cx="63" cy="66" r="2" fill="#4a2008"/>
      {/* Mouth - open yelling when tantrum, demanding smirk otherwise */}
      {isTantrum
        ? <ellipse cx="60" cy="80" rx="14" ry="10" fill="#c0392b"/>
        : <path d="M 47 78 Q 60 72 73 78" stroke="#5a2e0e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>}
      {isTantrum && <ellipse cx="60" cy="84" rx="9" ry="5" fill="#1a0a00"/>}
      {isTantrum && <rect x="52" y="79" width="16" height="5" rx="2" fill="white"/>}
      {/* Pointing finger when not tantrum */}
      {!isTantrum && (
        <g transform="translate(100, 100) rotate(30)">
          <rect x="0" y="0" width="20" height="8" rx="4" fill="#6b3a1f"/>
          <rect x="16" y="-4" width="8" height="8" rx="4" fill="#6b3a1f"/>
        </g>
      )}
      {/* Legs */}
      <rect x="30" y="152" width="22" height="14" rx="5" fill="#1a252f"/>
      <rect x="68" y="152" width="22" height="14" rx="5" fill="#1a252f"/>
      {/* Shoes */}
      <ellipse cx="41" cy="166" rx="14" ry="6" fill="#111"/>
      <ellipse cx="79" cy="166" rx="14" ry="6" fill="#111"/>
    </svg>
  )
}

// ─── THROWN OBJECTS (Isaiah tantrum) ─────────────────────────────────────────

function ThrownObject({ type, style }: { type: string; style: React.CSSProperties }) {
  if (type === 'book') return (
    <svg viewBox="0 0 40 50" width="40" height="50" style={style}>
      <rect x="2" y="2" width="36" height="46" rx="3" fill="#e74c3c"/>
      <rect x="6" y="8" width="28" height="3" rx="1" fill="#c0392b"/>
      <rect x="6" y="14" width="20" height="3" rx="1" fill="#c0392b"/>
      <rect x="6" y="20" width="24" height="3" rx="1" fill="#c0392b"/>
      <rect x="2" y="2" width="6" height="46" rx="3" fill="#c0392b"/>
    </svg>
  )
  if (type === 'pencil') return (
    <svg viewBox="0 0 12 60" width="12" height="60" style={style}>
      <rect x="2" y="8" width="8" height="44" fill="#f39c12"/>
      <rect x="2" y="50" width="8" height="6" fill="#e8c49a"/>
      <polygon points="2,8 10,8 6,0" fill="#ffd700"/>
      <rect x="2" y="48" width="8" height="4" fill="#e91e63"/>
    </svg>
  )
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" style={style}>
      <circle cx="20" cy="20" r="18" fill="#9b59b6"/>
      <text x="10" y="26" fontSize="16">😤</text>
    </svg>
  )
}

// ─── SPEECH BUBBLE ────────────────────────────────────────────────────────────

function SpeechBubble({ text, side = 'right', isChat }: { text: string; side?: 'left' | 'right'; isChat?: boolean }) {
  return (
    <div style={{
      position: 'absolute',
      [side === 'right' ? 'left' : 'right']: '110%',
      top: '-10px',
      background: 'white',
      border: '3px solid #2c3e50',
      borderRadius: 16,
      padding: '10px 14px',
      maxWidth: 220,
      minWidth: 120,
      fontSize: '0.82rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#1a1a1a',
      boxShadow: '3px 3px 0 #2c3e50',
      zIndex: 9999,
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    }}>
      {text}
      {/* Tail */}
      <div style={{
        position: 'absolute',
        [side === 'right' ? 'left' : 'right']: -14,
        top: 20,
        width: 0, height: 0,
        borderTop: '8px solid transparent',
        borderBottom: '8px solid transparent',
        [side === 'right' ? 'borderRight' : 'borderLeft']: '14px solid #2c3e50',
      }}/>
      <div style={{
        position: 'absolute',
        [side === 'right' ? 'left' : 'right']: -10,
        top: 23,
        width: 0, height: 0,
        borderTop: '6px solid transparent',
        borderBottom: '6px solid transparent',
        [side === 'right' ? 'borderRight' : 'borderLeft']: '11px solid white',
      }}/>
    </div>
  )
}

// ─── CHARACTER CONFIG ─────────────────────────────────────────────────────────

const CHARACTER_CONFIG = {
  Elizah: {
    buddyName: 'Kwame',
    color: '#e67e22',
    greetings: [
      "Hey Elizah! *swats fly* Ready to learn today? 📚",
      "*swats fly* Oh! Hey girl! What subject we doing?",
      "Good to see you! *swat* This fly won't quit... anyway, let's study!",
      "Elizah! You're here! *brushes fly off eye* Focus time! 💪",
    ],
    idle: [
      "*swats fly off eye again*",
      "You got this, Elizah! 🌟",
      "Don't forget to take notes! ✏️",
      "*swat* ...fly back again. Anyway — keep going!",
      "How's the lesson going? 🤔",
    ],
    click: [
      "Ow! ...just kidding 😄",
      "*spins around* Woo!",
      "You clicked me! Hi! 👋",
      "*does a little dance* 🎵",
      "*swats fly triumphantly* GOT HIM! ...he's back.",
    ],
    systemPrompt: `You are Kwame, Elizah's study buddy. You're a cheerful African kid with a fly that keeps landing on your eye (you occasionally swat at it mid-sentence). You're encouraging, wise, and funny. You help Elizah with her schoolwork. Keep responses SHORT (1-3 sentences). Stay in character — mention the fly naturally sometimes. Be warm and supportive.`,
  },
  Mathias: {
    buddyName: 'Mo',
    color: '#3498db',
    greetings: [
      "YO MATHIAS! *fro bounces* Let's GET IT! 🎉",
      "Mathias in the house! *afro wobble* Time to learn! 📖",
      "Heyyy! *bounces afro* What we studying today?",
      "MATHIAS! *fro shake* Ready to be SMART today?! 🧠",
    ],
    idle: [
      "*afro bounces with excitement* You're doing great!",
      "Keep going Mathias! You got this! 💪",
      "*pats afro* My fro says you're doing amazing!",
      "Woooo! Learning is FUN! ...right? RIGHT?! 😄",
      "*afro wobbles* Don't stop now!",
    ],
    click: [
      "*afro BOUNCES* Haha! 😄",
      "Yo you clicked me! *fro shake*",
      "*spins, afro flies* WOOOO!",
      "AGAIN! DO IT AGAIN! *bouncing*",
      "*afro explodes with joy* ✨",
    ],
    systemPrompt: `You are Mo, Mathias's study buddy. You're an enthusiastic, goofy kid with a giant afro that you're very proud of. You reference your afro naturally in conversation. You LOVE learning and get excited about everything. Help Mathias with schoolwork. Keep responses SHORT (1-3 sentences). Be energetic, funny, and encouraging. Sometimes your afro has opinions of its own.`,
  },
  Isaiah: {
    buddyName: "Lil' T",
    color: '#2c3e50',
    greetings: [
      "ISAIAH! I been waitin'! Sit DOWN and open your books RIGHT NOW!",
      "Boy don't make me come over there! STUDY. NOW. 😤",
      "Isaiah McMillan! Did I stutter?! START. YOUR. LESSONS. 📚",
      "I KNOW you see me. Don't act like you don't see me. Study!! 😤",
    ],
    idle: [
      "I'm watching you Isaiah... 👀",
      "You better not be playing games right now...",
      "ISAIAH. Focus. I'm SERIOUS. 😤",
      "*taps foot impatiently* ...",
      "Don't make me throw this book. I WILL throw this book.",
    ],
    click: [
      "FINALLY! You acknowledge me! 😤",
      "Oh so NOW you want to click me?!",
      "Boy— *takes deep breath* ...thank you for the attention.",
      "I KNEW you'd come around! Now STUDY!",
      "*dramatic gasp* You touched me! Now open your books!",
    ],
    tantrumLines: [
      "THAT IS IT! I AM DONE WAITING!!!",
      "YOU IGNORING ME?! OH IT'S ABOUT TO GO DOWN!",
      "I TOLD YOU! I TOLD YOU TO STUDY! LOOK AT THIS MESS I'M MAKING!",
      "AAAAAAAAAAHHHHH!!!! 😤💥",
    ],
    systemPrompt: `You are Lil' T, Isaiah's study buddy. You're a dramatically demanding little kid who sounds like a tiny Tyler Perry. You're EXTREMELY serious about education and get very dramatic when Isaiah isn't studying. You throw mini-tantrums but deep down you care. Help Isaiah with schoolwork. Keep responses SHORT and DRAMATIC (1-3 sentences). Use ALL CAPS for emphasis sometimes. Be funny, demanding, but ultimately supportive.`,
  },
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function StudyBuddy({ studentName }: StudyBuddyProps) {
  const config = CHARACTER_CONFIG[studentName as keyof typeof CHARACTER_CONFIG]
    ?? CHARACTER_CONFIG.Elizah

  const [pos, setPos] = useState({ x: 80, y: 60 }) // % of viewport
  const [mood, setMood] = useState<'idle' | 'happy' | 'talk' | 'tantrum'>('idle')
  const [bubble, setBubble] = useState<string | null>(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [chatLoading, setChatLoading] = useState(false)
  const [thrownObjects, setThrownObjects] = useState<{ id: number; type: string; x: number; y: number; rot: number }[]>([])
  const [tantrumShake, setTantrumShake] = useState(false)
  const lastInteraction = useRef(Date.now())
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const moveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tantrumTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const objId = useRef(0)

  const isIsaiah = studentName === 'Isaiah'

  const showBubble = useCallback((text: string, duration = 4000) => {
    setBubble(text)
    setMood('talk')
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current)
    bubbleTimer.current = setTimeout(() => {
      setBubble(null)
      setMood('idle')
    }, duration)
  }, [])

  // Greeting on mount
  useEffect(() => {
    const g = config.greetings[Math.floor(Math.random() * config.greetings.length)]
    setTimeout(() => showBubble(g, 5000), 1200)
  }, [])

  // Movement
  const moveRandom = useCallback(() => {
    const margin = 15
    const x = margin + Math.random() * (100 - margin * 2 - 10)
    const y = margin + Math.random() * (100 - margin * 2 - 15)
    setPos({ x, y })
    const next = 8000 + Math.random() * 12000
    moveTimer.current = setTimeout(moveRandom, next)
  }, [])

  useEffect(() => {
    moveTimer.current = setTimeout(moveRandom, 10000)
    return () => { if (moveTimer.current) clearTimeout(moveTimer.current) }
  }, [moveRandom])

  // Idle chatter
  const idleChatter = useCallback(() => {
    if (!chatOpen) {
      const line = config.idle[Math.floor(Math.random() * config.idle.length)]
      showBubble(line, 3500)
    }
    const next = 25000 + Math.random() * 20000
    idleTimer.current = setTimeout(idleChatter, next)
  }, [chatOpen, config.idle, showBubble])

  useEffect(() => {
    idleTimer.current = setTimeout(idleChatter, 20000)
    return () => { if (idleTimer.current) clearTimeout(idleTimer.current) }
  }, [idleChatter])

  // Isaiah tantrum timer
  useEffect(() => {
    if (!isIsaiah) return
    const check = () => {
      const idle = Date.now() - lastInteraction.current
      if (idle > 90000) {
        triggerTantrum()
      }
      tantrumTimer.current = setTimeout(check, 15000)
    }
    tantrumTimer.current = setTimeout(check, 90000)
    return () => { if (tantrumTimer.current) clearTimeout(tantrumTimer.current) }
  }, [isIsaiah])

  function triggerTantrum() {
    setMood('tantrum')
    setTantrumShake(true)
    const line = (config as typeof CHARACTER_CONFIG.Isaiah).tantrumLines?.[
      Math.floor(Math.random() * ((config as typeof CHARACTER_CONFIG.Isaiah).tantrumLines?.length ?? 1))
    ] ?? "AAAAHHH!"
    showBubble(line, 6000)

    // Throw objects
    const types = ['book', 'pencil', 'emoji']
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const id = ++objId.current
        setThrownObjects(prev => [...prev, {
          id, type: types[Math.floor(Math.random() * types.length)],
          x: 10 + Math.random() * 80,
          y: 10 + Math.random() * 70,
          rot: Math.random() * 720 - 360,
        }])
        setTimeout(() => setThrownObjects(prev => prev.filter(o => o.id !== id)), 2000)
      }, i * 400)
    }

    setTimeout(() => {
      setMood('idle')
      setTantrumShake(false)
      lastInteraction.current = Date.now()
    }, 7000)
  }

  function handleClick() {
    lastInteraction.current = Date.now()
    setMood('happy')
    const line = config.click[Math.floor(Math.random() * config.click.length)]
    showBubble(line, 3000)
  }

  async function sendChat(e: React.FormEvent) {
    e.preventDefault()
    if (!chatInput.trim() || chatLoading) return
    lastInteraction.current = Date.now()
    const userMsg = chatInput.trim()
    setChatInput('')
    const newHistory = [...chatHistory, { role: 'user' as const, content: userMsg }]
    setChatHistory(newHistory)
    setChatLoading(true)

    try {
      const res = await fetch('/api/buddy-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory,
          systemPrompt: config.systemPrompt,
          studentName,
        }),
      })
      const data = await res.json()
      const reply = data.reply ?? "Hmm, I got confused! Try again?"
      setChatHistory(prev => [...prev, { role: 'assistant', content: reply }])
      showBubble(reply.slice(0, 120) + (reply.length > 120 ? '...' : ''), 5000)
    } catch {
      setChatHistory(prev => [...prev, { role: 'assistant', content: "Oops! Something went wrong. Try again!" }])
    } finally {
      setChatLoading(false)
    }
  }

  const bubbleSide = pos.x > 55 ? 'left' : 'right'

  return (
    <>
      {/* Global styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes wobble {
          0%,100% { transform: rotate(0deg); }
          20% { transform: rotate(-8deg); }
          40% { transform: rotate(8deg); }
          60% { transform: rotate(-5deg); }
          80% { transform: rotate(5deg); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-6px) rotate(-2deg); }
          40% { transform: translateX(6px) rotate(2deg); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes flyAcross {
          0% { transform: translate(0,0) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translate(var(--fly-x), var(--fly-y)) rotate(var(--fly-rot)) scale(0.3); opacity: 0; }
        }
        @keyframes pageShake {
          0%,100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .study-buddy-char {
          animation: float 3s ease-in-out infinite;
          cursor: pointer;
          filter: drop-shadow(0 8px 16px rgba(0,0,0,0.25));
          transition: transform 0.15s;
        }
        .study-buddy-char:hover { transform: scale(1.08) translateY(-4px); }
        .study-buddy-char.tantrum { animation: shake 0.3s ease-in-out infinite; }
        .study-buddy-char.happy { animation: wobble 0.6s ease-in-out; }
        ${tantrumShake ? 'body { animation: pageShake 0.15s ease-in-out infinite; }' : ''}
      `}</style>

      {/* Thrown objects */}
      {thrownObjects.map(obj => (
        <div key={obj.id} style={{
          position: 'fixed',
          left: `${obj.x}vw`,
          top: `${obj.y}vh`,
          zIndex: 9998,
          pointerEvents: 'none',
          // @ts-expect-error css vars
          '--fly-x': `${(Math.random() - 0.5) * 60}vw`,
          '--fly-y': `${(Math.random() - 0.5) * 40}vh`,
          '--fly-rot': `${obj.rot}deg`,
          animation: 'flyAcross 1.8s ease-in forwards',
        }}>
          <ThrownObject type={obj.type} style={{}}/>
        </div>
      ))}

      {/* The buddy */}
      <div style={{
        position: 'fixed',
        left: `${pos.x}vw`,
        top: `${pos.y}vh`,
        zIndex: 9997,
        transition: 'left 2s cubic-bezier(0.4,0,0.2,1), top 2s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        userSelect: 'none',
      }}>
        {/* Speech bubble */}
        <div style={{ position: 'relative' }}>
          {bubble && <SpeechBubble text={bubble} side={bubbleSide}/>}

          {/* Character */}
          <div
            className={`study-buddy-char ${mood === 'tantrum' ? 'tantrum' : mood === 'happy' ? 'happy' : ''}`}
            onClick={handleClick}
            title={`Click ${config.buddyName}!`}
          >
            {studentName === 'Elizah' && <ElizahBuddy mood={mood}/>}
            {studentName === 'Mathias' && <MathiasBuddy mood={mood}/>}
            {studentName === 'Isaiah' && <IsaiahBuddy mood={mood === 'tantrum' ? 'tantrum' : mood}/>}
            {/* Fallback for other students */}
            {!['Elizah','Mathias','Isaiah'].includes(studentName) && <ElizahBuddy mood={mood}/>}
          </div>
        </div>

        {/* Name tag + chat button */}
        <div style={{ display: 'flex', gap: 6, marginTop: 4, alignItems: 'center' }}>
          <div style={{
            background: config.color,
            color: 'white',
            borderRadius: 20,
            padding: '3px 10px',
            fontSize: '0.7rem',
            fontWeight: 800,
            boxShadow: '2px 2px 0 rgba(0,0,0,0.2)',
          }}>
            {config.buddyName}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setChatOpen(v => !v); lastInteraction.current = Date.now() }}
            style={{
              background: chatOpen ? '#e74c3c' : config.color,
              border: 'none', borderRadius: '50%',
              width: 26, height: 26,
              cursor: 'pointer', fontSize: '0.75rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '2px 2px 0 rgba(0,0,0,0.2)',
              color: 'white', fontWeight: 800,
            }}
            title={chatOpen ? "Close chat" : "Chat with me!"}
          >
            {chatOpen ? '✕' : '💬'}
          </button>
        </div>

        {/* Chat window */}
        {chatOpen && (
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'absolute',
              bottom: '110%',
              right: pos.x > 55 ? '0' : 'auto',
              left: pos.x <= 55 ? '0' : 'auto',
              width: 280,
              background: 'white',
              border: `3px solid ${config.color}`,
              borderRadius: 16,
              boxShadow: '4px 4px 0 rgba(0,0,0,0.15)',
              overflow: 'hidden',
              zIndex: 10000,
            }}
          >
            {/* Chat header */}
            <div style={{
              background: config.color,
              color: 'white',
              padding: '8px 12px',
              fontWeight: 800,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              💬 Ask {config.buddyName}!
            </div>
            {/* Messages */}
            <div style={{
              height: 200,
              overflowY: 'auto',
              padding: '10px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}>
              {chatHistory.length === 0 && (
                <div style={{ color: '#888', fontSize: '0.8rem', textAlign: 'center', marginTop: 60 }}>
                  Ask me anything about your lessons! 📚
                </div>
              )}
              {chatHistory.map((msg, i) => (
                <div key={i} style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  background: msg.role === 'user' ? config.color : '#f0f0f0',
                  color: msg.role === 'user' ? 'white' : '#1a1a1a',
                  borderRadius: msg.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                  padding: '7px 10px',
                  maxWidth: '85%',
                  fontSize: '0.82rem',
                  lineHeight: 1.4,
                }}>
                  {msg.content}
                </div>
              ))}
              {chatLoading && (
                <div style={{
                  alignSelf: 'flex-start',
                  background: '#f0f0f0',
                  borderRadius: '12px 12px 12px 4px',
                  padding: '7px 14px',
                  fontSize: '1rem',
                }}>
                  <span style={{ animation: 'float 1s ease-in-out infinite' }}>...</span>
                </div>
              )}
            </div>
            {/* Input */}
            <form onSubmit={sendChat} style={{
              display: 'flex',
              borderTop: `2px solid ${config.color}`,
              padding: 8,
              gap: 6,
            }}>
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Ask something..."
                style={{
                  flex: 1,
                  border: '2px solid #eee',
                  borderRadius: 20,
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  outline: 'none',
                }}
                autoFocus
              />
              <button
                type="submit"
                disabled={chatLoading || !chatInput.trim()}
                style={{
                  background: config.color,
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: 32, height: 32,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  opacity: chatLoading || !chatInput.trim() ? 0.5 : 1,
                }}
              >
                →
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  )
}
