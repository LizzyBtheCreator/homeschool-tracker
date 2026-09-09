'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

interface StudyBuddyProps {
  studentName: string
}

// ─── SPEECH ───────────────────────────────────────────────────────────────────

function speak(text: string, pitch: number, rate: number, volume = 1) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  // Strip emojis for cleaner speech
  const clean = text.replace(/[\u{1F300}-\u{1FAFF}]/gu, '').replace(/\*/g, '').trim()
  const utterance = new SpeechSynthesisUtterance(clean)
  utterance.pitch = pitch
  utterance.rate = rate
  utterance.volume = volume
  // Try to get a good voice
  const voices = window.speechSynthesis.getVoices()
  const preferred = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google'))
    ?? voices.find(v => v.lang.startsWith('en'))
  if (preferred) utterance.voice = preferred
  window.speechSynthesis.speak(utterance)
}

const VOICE = {
  Elizah:  { pitch: 1.1,  rate: 0.95 }, // calm, warm
  Mathias: { pitch: 1.4,  rate: 1.2  }, // high, excited
  Isaiah:  { pitch: 0.75, rate: 1.05 }, // low, dramatic Tyler Perry
}

// ─── SVG CHARACTERS ──────────────────────────────────────────────────────────

function ElizahBuddy({ mood, swatting }: { mood: string; swatting: boolean }) {
  return (
    <svg viewBox="0 0 120 180" width="100" height="150" xmlns="http://www.w3.org/2000/svg">
      {/* Body / shirt */}
      <rect x="28" y="105" width="64" height="55" rx="8" fill="#e67e22"/>
      {/* Left arm — swats upward when swatting */}
      <g style={{ transformOrigin: '28px 108px', transform: swatting ? 'rotate(-120deg)' : 'rotate(-15deg)', transition: 'transform 0.25s ease-out' }}>
        <rect x="6" y="105" width="24" height="12" rx="6" fill="#c0392b"/>
        <circle cx="6" cy="111" r="9" fill="#6b3a1f"/>
      </g>
      {/* Right arm */}
      <rect x="90" y="108" width="22" height="12" rx="6" fill="#c0392b" transform="rotate(15 90 108)"/>
      <circle cx="111" cy="122" r="8" fill="#6b3a1f"/>
      {/* Neck */}
      <rect x="48" y="95" width="24" height="14" rx="4" fill="#6b3a1f"/>
      {/* Head */}
      <ellipse cx="60" cy="68" rx="36" ry="38" fill="#6b3a1f"/>
      {/* Hair */}
      <ellipse cx="60" cy="34" rx="33" ry="14" fill="#1a0a00"/>
      <ellipse cx="30" cy="50" rx="10" ry="20" fill="#1a0a00"/>
      <ellipse cx="90" cy="50" rx="10" ry="20" fill="#1a0a00"/>
      {/* Left eye */}
      <ellipse cx="44" cy="66" rx="9" ry="10" fill="white"/>
      <circle cx="44" cy="68" r="5" fill="#1a1a2e"/>
      <circle cx="46" cy="66" r="2" fill="white"/>
      {/* FLY on left eye — disappears when swatting */}
      {!swatting && (
        <g transform="translate(37,59)">
          <ellipse cx="0" cy="0" rx="4" ry="3" fill="#111" opacity="0.9"/>
          <ellipse cx="-2" cy="-2" rx="3" ry="2" fill="#444" opacity="0.6" transform="rotate(-30)"/>
          <ellipse cx="2" cy="-2" rx="3" ry="2" fill="#444" opacity="0.6" transform="rotate(30)"/>
          <line x1="-4" y1="1" x2="-8" y2="3" stroke="#111" strokeWidth="0.7"/>
          <line x1="-4" y1="-1" x2="-8" y2="-3" stroke="#111" strokeWidth="0.7"/>
          <line x1="4" y1="1" x2="8" y2="3" stroke="#111" strokeWidth="0.7"/>
          <line x1="4" y1="-1" x2="8" y2="-3" stroke="#111" strokeWidth="0.7"/>
        </g>
      )}
      {/* "GOT HIM" star flash when swatting */}
      {swatting && (
        <g transform="translate(32,52)">
          <circle cx="0" cy="0" r="12" fill="#FFD700" opacity="0.9"/>
          <text x="-10" y="5" fontSize="8" fontWeight="bold" fill="#1a1a1a">POW!</text>
        </g>
      )}
      {/* Right eye */}
      <ellipse cx="76" cy="66" rx="9" ry="10" fill="white"/>
      <circle cx="76" cy="68" r="5" fill="#1a1a2e"/>
      <circle cx="78" cy="66" r="2" fill="white"/>
      {/* Nose */}
      <ellipse cx="60" cy="78" rx="6" ry="5" fill="#5a2e0e"/>
      {/* Mouth */}
      {mood === 'happy' || mood === 'talk'
        ? <path d="M 46 90 Q 60 102 74 90" stroke="#5a2e0e" strokeWidth="2.5" fill="#c0392b" strokeLinecap="round"/>
        : <path d="M 46 92 Q 60 88 74 92" stroke="#5a2e0e" strokeWidth="2" fill="none"/>}
      {mood === 'talk' && <rect x="52" y="90" width="16" height="6" rx="2" fill="white"/>}
      {/* Eyebrows */}
      <path d="M 37 55 Q 44 52 51 55" stroke="#1a0a00" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M 69 55 Q 76 52 83 55" stroke="#1a0a00" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Legs */}
      <rect x="35" y="155" width="18" height="14" rx="5" fill="#2c3e50"/>
      <rect x="67" y="155" width="18" height="14" rx="5" fill="#2c3e50"/>
      <ellipse cx="44" cy="169" rx="12" ry="6" fill="#1a1a1a"/>
      <ellipse cx="76" cy="169" rx="12" ry="6" fill="#1a1a1a"/>
    </svg>
  )
}

function MathiasBuddy({ mood }: { mood: string }) {
  const afroBounce = mood === 'talk' || mood === 'happy'
  return (
    <svg viewBox="0 0 120 180" width="100" height="150" xmlns="http://www.w3.org/2000/svg">
      {/* Giant AFro — bounces when talking */}
      <ellipse cx="60" cy="54" rx="48" ry="46" fill="#1a0a00"
        style={{ transformOrigin: '60px 100px', animation: afroBounce ? 'afroBounce 0.4s ease-in-out infinite alternate' : 'none' }}/>
      {/* Afro shine dots */}
      {[20,40,60,80,100].map((x,i) => (
        <circle key={i} cx={x} cy={18 + (i%3)*10} r="3" fill="#2a1a00" opacity="0.4"/>
      ))}
      <circle cx="18" cy="57" r="5" fill="#2a1a00" opacity="0.4"/>
      <circle cx="102" cy="57" r="5" fill="#2a1a00" opacity="0.4"/>
      {/* Head */}
      <circle cx="60" cy="78" r="32" fill="#8B5E3C"/>
      {/* Ears */}
      <circle cx="28" cy="80" r="8" fill="#8B5E3C"/>
      <circle cx="92" cy="80" r="8" fill="#7a5230"/>
      {/* Eyes */}
      <ellipse cx="46" cy="76" rx="9" ry="10" fill="white"/>
      <circle cx="46" cy="78" r="5.5" fill="#2c1810"/>
      <circle cx="48" cy="76" r="2" fill="white"/>
      <ellipse cx="74" cy="76" rx="9" ry="10" fill="white"/>
      <circle cx="74" cy="78" r="5.5" fill="#2c1810"/>
      <circle cx="76" cy="76" r="2" fill="white"/>
      {/* Eyebrows */}
      <path d="M 38 65 Q 46 61 54 65" stroke="#1a0a00" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M 66 65 Q 74 61 82 65" stroke="#1a0a00" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Nose */}
      <circle cx="60" cy="86" r="4" fill="#7a5230"/>
      <circle cx="58" cy="85" r="1.5" fill="#6a4220"/>
      <circle cx="62" cy="85" r="1.5" fill="#6a4220"/>
      {/* Mouth */}
      {mood === 'happy' || mood === 'talk'
        ? <path d="M 48 96 Q 60 108 72 96" stroke="#5a3010" strokeWidth="2.5" fill="#c0392b" strokeLinecap="round"/>
        : <path d="M 50 98 Q 60 94 70 98" stroke="#5a3010" strokeWidth="2" fill="none"/>}
      {mood === 'talk' && <rect x="53" y="96" width="14" height="5" rx="2" fill="white"/>}
      {/* Caillou-style striped shirt */}
      <rect x="25" y="108" width="70" height="58" rx="8" fill="#3498db"/>
      <rect x="25" y="116" width="70" height="8" fill="#e74c3c"/>
      <rect x="25" y="132" width="70" height="8" fill="#e74c3c"/>
      <rect x="25" y="148" width="70" height="8" fill="#e74c3c"/>
      {/* Arms — wave when happy */}
      <rect x="5" y="110" width="22" height="13" rx="6" fill="#3498db"
        style={{ transformOrigin: '25px 110px', transform: mood === 'happy' ? 'rotate(-40deg)' : 'rotate(-10deg)', transition: 'transform 0.3s' }}/>
      <rect x="93" y="110" width="22" height="13" rx="6" fill="#3498db"
        style={{ transformOrigin: '93px 110px', transform: mood === 'happy' ? 'rotate(40deg)' : 'rotate(10deg)', transition: 'transform 0.3s' }}/>
      <circle cx="7" cy="126" r="9" fill="#8B5E3C"/>
      <circle cx="113" cy="126" r="9" fill="#8B5E3C"/>
      {/* Legs */}
      <rect x="33" y="161" width="20" height="14" rx="5" fill="#2c3e50"/>
      <rect x="67" y="161" width="20" height="14" rx="5" fill="#2c3e50"/>
      <ellipse cx="43" cy="175" rx="13" ry="6" fill="#1a1a1a"/>
      <ellipse cx="77" cy="175" rx="13" ry="6" fill="#1a1a1a"/>
    </svg>
  )
}

function IsaiahBuddy({ mood }: { mood: string }) {
  const isTantrum = mood === 'tantrum'
  const isPointing = !isTantrum
  return (
    <svg viewBox="0 0 140 185" width="115" height="155" xmlns="http://www.w3.org/2000/svg"
      style={{ transform: isTantrum ? 'rotate(-5deg)' : 'none', transition: 'transform 0.2s' }}>
      {/* Body */}
      <rect x="22" y="105" width="76" height="62" rx="8" fill="#2c3e50"/>
      <rect x="55" y="105" width="10" height="62" fill="#1a252f" opacity="0.3"/>
      <circle cx="60" cy="115" r="2.5" fill="#bdc3c7"/>
      <circle cx="60" cy="128" r="2.5" fill="#bdc3c7"/>
      <circle cx="60" cy="141" r="2.5" fill="#bdc3c7"/>
      {/* Arms */}
      <rect x="0" y="108" width="24" height="14" rx="7" fill="#2c3e50"
        style={{ transformOrigin: '22px 108px', transform: isTantrum ? 'rotate(50deg)' : isPointing ? 'rotate(-20deg)' : 'rotate(-10deg)', transition: 'transform 0.3s' }}/>
      <rect x="96" y="108" width="24" height="14" rx="7" fill="#2c3e50"
        style={{ transformOrigin: '96px 108px', transform: isTantrum ? 'rotate(-50deg)' : isPointing ? 'rotate(35deg)' : 'rotate(10deg)', transition: 'transform 0.3s' }}/>
      {/* Hands */}
      <circle cx={isTantrum ? "16" : "5"} cy={isTantrum ? "128" : "122"} r="9" fill="#6b3a1f"
        style={{ transition: 'all 0.3s' }}/>
      <circle cx={isTantrum ? "114" : "125"} cy={isTantrum ? "128" : "118"} r="9" fill="#6b3a1f"
        style={{ transition: 'all 0.3s' }}/>
      {/* Pointing finger */}
      {isPointing && (
        <g style={{ transform: 'translate(118px, 106px) rotate(30deg)' }}>
          <rect x="0" y="0" width="20" height="7" rx="3.5" fill="#6b3a1f"/>
          <rect x="16" y="-4" width="7" height="7" rx="3.5" fill="#6b3a1f"/>
        </g>
      )}
      {/* Neck */}
      <rect x="47" y="93" width="26" height="16" rx="5" fill="#6b3a1f"/>
      {/* Head */}
      <ellipse cx="60" cy="66" rx="38" ry="40" fill="#6b3a1f"/>
      {/* Hair */}
      <ellipse cx="60" cy="30" rx="35" ry="12" fill="#111"/>
      <rect x="22" y="30" width="76" height="18" fill="#111"/>
      {/* Ears */}
      <circle cx="22" cy="68" r="8" fill="#6b3a1f"/>
      <circle cx="98" cy="68" r="8" fill="#6b3a1f"/>
      {/* Eyes */}
      <ellipse cx="44" cy="63" rx="9" ry="8" fill="white"/>
      <circle cx="44" cy="65" r="5" fill="#1a0a00"/>
      <circle cx="46" cy="63" r="2" fill="white"/>
      <ellipse cx="76" cy="63" rx="9" ry="8" fill="white"/>
      <circle cx="76" cy="65" r="5" fill="#1a0a00"/>
      <circle cx="78" cy="63" r="2" fill="white"/>
      {/* Intense eyebrows */}
      <path d="M 36 52 Q 44 47 52 51" stroke="#111" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M 68 51 Q 76 47 84 52" stroke="#111" strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* Nose */}
      <ellipse cx="60" cy="75" rx="7" ry="6" fill="#5a2e0e"/>
      <circle cx="57" cy="74" r="2" fill="#4a2008"/>
      <circle cx="63" cy="74" r="2" fill="#4a2008"/>
      {/* Mouth */}
      {isTantrum
        ? <ellipse cx="60" cy="88" rx="14" ry="10" fill="#c0392b"/>
        : <path d="M 47 86 Q 60 80 73 86" stroke="#5a2e0e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>}
      {isTantrum && <ellipse cx="60" cy="92" rx="9" ry="5" fill="#1a0a00"/>}
      {isTantrum && <rect x="52" y="87" width="16" height="5" rx="2" fill="white"/>}
      {/* Legs */}
      <rect x="30" y="162" width="22" height="14" rx="5" fill="#1a252f"/>
      <rect x="68" y="162" width="22" height="14" rx="5" fill="#1a252f"/>
      {/* Stomp effect when tantrum */}
      {isTantrum && <ellipse cx="41" cy="180" rx="20" ry="5" fill="#e74c3c" opacity="0.5"/>}
      {isTantrum && <ellipse cx="79" cy="180" rx="20" ry="5" fill="#e74c3c" opacity="0.5"/>}
      <ellipse cx="41" cy="176" rx="14" ry="6" fill="#111"/>
      <ellipse cx="79" cy="176" rx="14" ry="6" fill="#111"/>
    </svg>
  )
}

// ─── THROWN OBJECTS ───────────────────────────────────────────────────────────

function ThrownObject({ type, style }: { type: string; style: React.CSSProperties }) {
  if (type === 'book') return (
    <svg viewBox="0 0 40 50" width="40" height="50" style={style}>
      <rect x="2" y="2" width="36" height="46" rx="3" fill="#e74c3c"/>
      <rect x="6" y="8" width="28" height="3" rx="1" fill="#c0392b"/>
      <rect x="6" y="14" width="20" height="3" rx="1" fill="#c0392b"/>
      <rect x="2" y="2" width="6" height="46" rx="3" fill="#c0392b"/>
    </svg>
  )
  if (type === 'pencil') return (
    <svg viewBox="0 0 12 60" width="12" height="60" style={style}>
      <rect x="2" y="8" width="8" height="44" fill="#f39c12"/>
      <polygon points="2,8 10,8 6,0" fill="#ffd700"/>
      <rect x="2" y="48" width="8" height="4" fill="#e91e63"/>
    </svg>
  )
  return (
    <svg viewBox="0 0 44 44" width="44" height="44" style={style}>
      <circle cx="22" cy="22" r="20" fill="#9b59b6"/>
      <text x="8" y="30" fontSize="20">😤</text>
    </svg>
  )
}

// ─── SPEECH BUBBLE ────────────────────────────────────────────────────────────

function SpeechBubble({ text, side = 'right' }: { text: string; side?: 'left' | 'right' }) {
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
      "Hey Elizah! *swats fly* Ready to learn today?",
      "*swats fly* Oh! Hey girl! What subject we doing?",
      "Good to see you! *swat* This fly won't quit... anyway, let's study!",
      "Elizah! You're here! *brushes fly off eye* Focus time!",
    ],
    idle: [
      "*swats fly off eye again*",
      "You got this, Elizah!",
      "Don't forget to take notes!",
      "*swat* ...fly back again. Anyway, keep going!",
      "How's the lesson going?",
    ],
    click: [
      "Ow! ...just kidding!",
      "*spins around* Woo!",
      "You clicked me! Hi!",
      "*does a little dance*",
      "*swats fly triumphantly* GOT HIM! ...he's back.",
    ],
    systemPrompt: `You are Kwame, Elizah's study buddy. You're a cheerful kid with a fly that keeps landing on your eye (you occasionally swat at it mid-sentence). You're encouraging, wise, and funny. Help Elizah with her schoolwork. Keep responses SHORT (1-3 sentences max). Stay in character. Be warm and supportive.`,
  },
  Mathias: {
    buddyName: 'Mo',
    color: '#3498db',
    greetings: [
      "YO MATHIAS! *fro bounces* Let's GET IT!",
      "Mathias in the house! *afro wobble* Time to learn!",
      "Heyyy! *bounces afro* What we studying today?",
      "MATHIAS! *fro shake* Ready to be SMART today?!",
    ],
    idle: [
      "*afro bounces with excitement* You're doing great!",
      "Keep going Mathias! You got this!",
      "*pats afro* My fro says you're doing amazing!",
      "Woooo! Learning is FUN! ...right? RIGHT?!",
      "*afro wobbles* Don't stop now!",
    ],
    click: [
      "*afro BOUNCES* Haha!",
      "Yo you clicked me! *fro shake*",
      "*spins, afro flies* WOOOO!",
      "AGAIN! DO IT AGAIN! *bouncing*",
      "*afro explodes with joy*",
    ],
    systemPrompt: `You are Mo, Mathias's study buddy. You're an enthusiastic, goofy kid with a giant afro that you're very proud of. You reference your afro naturally. You LOVE learning. Help Mathias with schoolwork. Keep responses SHORT (1-3 sentences max). Be energetic, funny, and encouraging.`,
  },
  Isaiah: {
    buddyName: "Lil' T",
    color: '#2c3e50',
    greetings: [
      "ISAIAH! I been waitin'! Sit DOWN and open your books RIGHT NOW!",
      "Boy don't make me come over there! STUDY. NOW.",
      "Isaiah McMillan! Did I stutter?! START. YOUR. LESSONS.",
      "I KNOW you see me. Don't act like you don't see me. Study!!",
    ],
    idle: [
      "I'm watching you Isaiah...",
      "You better not be playing games right now...",
      "ISAIAH. Focus. I'm SERIOUS.",
      "*taps foot impatiently*",
      "Don't make me throw this book. I WILL throw this book.",
    ],
    click: [
      "FINALLY! You acknowledge me!",
      "Oh so NOW you want to click me?!",
      "Boy... thank you for the attention. Now STUDY!",
      "I KNEW you'd come around! Now open your books!",
      "*dramatic gasp* You touched me! Now get to work!",
    ],
    tantrumLines: [
      "THAT IS IT! I AM DONE WAITING!!!",
      "YOU IGNORING ME?! OH IT'S ABOUT TO GO DOWN!",
      "I TOLD YOU! I TOLD YOU TO STUDY! LOOK AT THIS MESS!",
      "AAAAAHHHHH!!!!",
    ],
    systemPrompt: `You are Lil' T, Isaiah's study buddy. You're a dramatically demanding little kid. You're EXTREMELY serious about education and get very dramatic when Isaiah isn't studying. Help Isaiah with schoolwork. Keep responses SHORT and DRAMATIC (1-3 sentences). Use ALL CAPS for emphasis. Be funny, demanding, but ultimately supportive.`,
  },
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function StudyBuddy({ studentName }: StudyBuddyProps) {
  const config = CHARACTER_CONFIG[studentName as keyof typeof CHARACTER_CONFIG]
    ?? CHARACTER_CONFIG.Elizah
  const voice = VOICE[studentName as keyof typeof VOICE] ?? VOICE.Elizah

  const [pos, setPos] = useState({ x: 78, y: 55 })
  const [mood, setMood] = useState<'idle' | 'happy' | 'talk' | 'tantrum'>('idle')
  const [bubble, setBubble] = useState<string | null>(null)
  const [swatting, setSwatting] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [chatLoading, setChatLoading] = useState(false)
  const [thrownObjects, setThrownObjects] = useState<{ id: number; type: string; x: number; y: number }[]>([])
  const [tantrumShake, setTantrumShake] = useState(false)
  const lastInteraction = useRef(Date.now())
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const moveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tantrumTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const objId = useRef(0)
  const isIsaiah = studentName === 'Isaiah'
  const isElizah = studentName === 'Elizah'

  // Load voices on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices()
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices()
    }
  }, [])

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory, chatLoading])

  const showBubble = useCallback((text: string, duration = 4000) => {
    setBubble(text)
    setMood('talk')
    speak(text, voice.pitch, voice.rate)

    // Elizah swats fly when she says "swat"
    if (isElizah && text.toLowerCase().includes('swat')) {
      setTimeout(() => setSwatting(true), 300)
      setTimeout(() => setSwatting(false), 1000)
    }

    if (bubbleTimer.current) clearTimeout(bubbleTimer.current)
    bubbleTimer.current = setTimeout(() => {
      setBubble(null)
      setMood('idle')
    }, duration)
  }, [voice, isElizah])

  // Greeting on mount
  useEffect(() => {
    const g = config.greetings[Math.floor(Math.random() * config.greetings.length)]
    setTimeout(() => showBubble(g, 5500), 1500)
  }, [])

  // Movement
  const moveRandom = useCallback(() => {
    const x = 12 + Math.random() * 68
    const y = 12 + Math.random() * 68
    setPos({ x, y })
    moveTimer.current = setTimeout(moveRandom, 9000 + Math.random() * 12000)
  }, [])

  useEffect(() => {
    moveTimer.current = setTimeout(moveRandom, 12000)
    return () => { if (moveTimer.current) clearTimeout(moveTimer.current) }
  }, [moveRandom])

  // Idle chatter
  const idleChatter = useCallback(() => {
    if (!chatOpen) {
      const line = config.idle[Math.floor(Math.random() * config.idle.length)]
      showBubble(line, 3500)
    }
    idleTimer.current = setTimeout(idleChatter, 28000 + Math.random() * 20000)
  }, [chatOpen, config.idle, showBubble])

  useEffect(() => {
    idleTimer.current = setTimeout(idleChatter, 22000)
    return () => { if (idleTimer.current) clearTimeout(idleTimer.current) }
  }, [idleChatter])

  // Isaiah tantrum
  useEffect(() => {
    if (!isIsaiah) return
    const check = () => {
      if (Date.now() - lastInteraction.current > 90000) triggerTantrum()
      tantrumTimer.current = setTimeout(check, 15000)
    }
    tantrumTimer.current = setTimeout(check, 90000)
    return () => { if (tantrumTimer.current) clearTimeout(tantrumTimer.current) }
  }, [isIsaiah])

  function triggerTantrum() {
    setMood('tantrum')
    setTantrumShake(true)
    const lines = (config as typeof CHARACTER_CONFIG.Isaiah).tantrumLines ?? ["AAAAHHH!"]
    const line = lines[Math.floor(Math.random() * lines.length)]
    showBubble(line, 6000)

    const types = ['book', 'pencil', 'emoji']
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const id = ++objId.current
        setThrownObjects(prev => [...prev, {
          id, type: types[Math.floor(Math.random() * types.length)],
          x: 10 + Math.random() * 80,
          y: 10 + Math.random() * 70,
        }])
        setTimeout(() => setThrownObjects(prev => prev.filter(o => o.id !== id)), 2000)
      }, i * 350)
    }

    setTimeout(() => {
      setMood('idle')
      setTantrumShake(false)
      lastInteraction.current = Date.now()
    }, 7500)
  }

  function handleClick() {
    lastInteraction.current = Date.now()
    setMood('happy')
    const line = config.click[Math.floor(Math.random() * config.click.length)]
    showBubble(line, 3200)

    // Elizah swats on every other click
    if (isElizah && Math.random() > 0.5) {
      setTimeout(() => setSwatting(true), 200)
      setTimeout(() => setSwatting(false), 900)
    }
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
        body: JSON.stringify({ messages: newHistory, systemPrompt: config.systemPrompt, studentName }),
      })
      const data = await res.json()
      const reply = data.reply ?? "Hmm, try again!"
      setChatHistory(prev => [...prev, { role: 'assistant', content: reply }])
      showBubble(reply.slice(0, 130) + (reply.length > 130 ? '...' : ''), 5500)
    } catch {
      setChatHistory(prev => [...prev, { role: 'assistant', content: "Oops! Something went wrong. Try again!" }])
    } finally {
      setChatLoading(false)
    }
  }

  const bubbleSide = pos.x > 55 ? 'left' : 'right'

  return (
    <>
      <style>{`
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes wobble {
          0%,100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-10deg) scale(1.05); }
          75% { transform: rotate(10deg) scale(1.05); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0) rotate(0); }
          20% { transform: translateX(-8px) rotate(-3deg); }
          40% { transform: translateX(8px) rotate(3deg); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        @keyframes afroBounce {
          0% { transform: scaleY(1); }
          100% { transform: scaleY(1.08) translateY(-3px); }
        }
        @keyframes flyAcross {
          0% { opacity:1; transform: translate(0,0) rotate(0deg) scale(1); }
          100% { opacity:0; transform: translate(var(--fx,120px), var(--fy,-80px)) rotate(540deg) scale(0.2); }
        }
        @keyframes pageShake {
          0%,100% { transform: translateX(0); }
          25% { transform: translateX(-5px) rotate(-0.5deg); }
          75% { transform: translateX(5px) rotate(0.5deg); }
        }
        .sb-char { animation: float 3s ease-in-out infinite; cursor: pointer; filter: drop-shadow(0 8px 20px rgba(0,0,0,0.28)); transition: transform 0.15s; }
        .sb-char:hover { transform: scale(1.1) translateY(-6px); }
        .sb-char.tantrum { animation: shake 0.25s ease-in-out infinite; }
        .sb-char.happy { animation: wobble 0.5s ease-in-out 2; }
        ${tantrumShake ? 'body { animation: pageShake 0.12s ease-in-out infinite; }' : ''}
      `}</style>

      {/* Thrown objects */}
      {thrownObjects.map(obj => (
        <div key={obj.id} style={{
          position: 'fixed',
          left: `${obj.x}vw`, top: `${obj.y}vh`,
          zIndex: 9998, pointerEvents: 'none',
          // @ts-expect-error css custom props
          '--fx': `${(Math.random()-0.5)*70}vw`,
          '--fy': `${(Math.random()-0.5)*50}vh`,
          animation: 'flyAcross 1.6s ease-in forwards',
        }}>
          <ThrownObject type={obj.type} style={{}}/>
        </div>
      ))}

      {/* Buddy container */}
      <div style={{
        position: 'fixed',
        left: `${pos.x}vw`, top: `${pos.y}vh`,
        zIndex: 9997,
        transition: 'left 2.2s cubic-bezier(0.4,0,0.2,1), top 2.2s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        userSelect: 'none',
      }}>
        <div style={{ position: 'relative' }}>
          {bubble && <SpeechBubble text={bubble} side={bubbleSide}/>}

          <div
            className={`sb-char ${mood === 'tantrum' ? 'tantrum' : mood === 'happy' ? 'happy' : ''}`}
            onClick={handleClick}
            title={`Click ${config.buddyName}!`}
          >
            {studentName === 'Elizah'  && <ElizahBuddy mood={mood} swatting={swatting}/>}
            {studentName === 'Mathias' && <MathiasBuddy mood={mood}/>}
            {studentName === 'Isaiah'  && <IsaiahBuddy mood={mood}/>}
            {!['Elizah','Mathias','Isaiah'].includes(studentName) && <ElizahBuddy mood={mood} swatting={swatting}/>}
          </div>
        </div>

        {/* Name tag + chat button */}
        <div style={{ display: 'flex', gap: 6, marginTop: 4, alignItems: 'center' }}>
          <div style={{
            background: config.color, color: 'white',
            borderRadius: 20, padding: '3px 10px',
            fontSize: '0.7rem', fontWeight: 800,
            boxShadow: '2px 2px 0 rgba(0,0,0,0.2)',
          }}>
            {config.buddyName}
          </div>
          <button
            onClick={e => { e.stopPropagation(); setChatOpen(v => !v); lastInteraction.current = Date.now() }}
            style={{
              background: chatOpen ? '#e74c3c' : config.color,
              border: 'none', borderRadius: '50%',
              width: 28, height: 28, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '2px 2px 0 rgba(0,0,0,0.2)',
              color: 'white', fontWeight: 800, fontSize: '0.8rem',
            }}
          >
            {chatOpen ? '✕' : '💬'}
          </button>
        </div>

        {/* Chat window */}
        {chatOpen && (
          <div onClick={e => e.stopPropagation()} style={{
            position: 'absolute',
            bottom: '115%',
            right: pos.x > 55 ? '0' : 'auto',
            left: pos.x <= 55 ? '0' : 'auto',
            width: 285,
            background: 'white',
            border: `3px solid ${config.color}`,
            borderRadius: 16,
            boxShadow: '4px 4px 0 rgba(0,0,0,0.15)',
            overflow: 'hidden',
            zIndex: 10000,
          }}>
            <div style={{ background: config.color, color: 'white', padding: '8px 12px', fontWeight: 800, fontSize: '0.85rem' }}>
              💬 Ask {config.buddyName}!
            </div>
            <div style={{ height: 200, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
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
                  padding: '7px 10px', maxWidth: '85%',
                  fontSize: '0.82rem', lineHeight: 1.4,
                }}>
                  {msg.content}
                </div>
              ))}
              {chatLoading && (
                <div style={{ alignSelf: 'flex-start', background: '#f0f0f0', borderRadius: '12px 12px 12px 4px', padding: '10px 14px', fontSize: '1.1rem' }}>
                  ···
                </div>
              )}
              <div ref={chatEndRef}/>
            </div>
            <form onSubmit={sendChat} style={{ display: 'flex', borderTop: `2px solid ${config.color}`, padding: 8, gap: 6 }}>
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Ask something..."
                style={{ flex: 1, border: '2px solid #eee', borderRadius: 20, padding: '6px 12px', fontSize: '0.8rem', outline: 'none' }}
                autoFocus
              />
              <button type="submit" disabled={chatLoading || !chatInput.trim()} style={{
                background: config.color, color: 'white', border: 'none',
                borderRadius: '50%', width: 32, height: 32, cursor: 'pointer',
                fontSize: '0.9rem', opacity: chatLoading || !chatInput.trim() ? 0.5 : 1,
              }}>→</button>
            </form>
          </div>
        )}
      </div>
    </>
  )
}
