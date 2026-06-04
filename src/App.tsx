import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import {
  ArrowUpRight,
  Atom,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  Coins,
  ExternalLink,
  FileSpreadsheet,
  Gauge,
  Gamepad2,
  Globe2,
  Home,
  Layers3,
  MessageCircle,
  Mountain,
  Music,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Video,
  Workflow,
  Zap,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { CSSProperties, FormEvent, PointerEvent, ReactNode } from 'react'
import './App.css'

type ProjectCategory = 'Brand' | 'Venture' | 'Growth' | 'AI Utility' | 'Simulation' | 'Creative'

type Project = {
  id: string
  name: string
  url: string
  category: ProjectCategory
  stage: string
  signal: string
  description: string
  image?: string
  color: string
  icon: LucideIcon
  proof: string
  coordinates: string
}

type OrbitItem = Pick<Project, 'id' | 'name' | 'color'>

type ChatMessage = {
  role: 'bot' | 'you'
  text: string
}

const heroVideoUrl =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260411_104032_69319010-2458-492b-b04d-b40a5dfa4482.mp4'

const spotifyArtistUrl = 'https://open.spotify.com/artist/35qBbzTB37OzQAZPsMeGIK'

const projects: Project[] = [
  {
    id: 'main',
    name: 'Ian Goh',
    url: 'https://iangoh.com',
    category: 'Brand',
    stage: 'Main site',
    signal: 'Operator thesis',
    description:
      'The public base layer for market building, community systems, frontier tech, and 0 to 1 operating notes.',
    image: '/project-shots/main.jpg',
    color: '#D9FF4A',
    icon: Globe2,
    proof: 'Markets, communities, distribution systems',
    coordinates: 'CORE / IDENTITY',
  },
  {
    id: 'portfolio-ventures',
    name: 'Portfolio / Ventures',
    url: 'https://portfolio.iangoh.com',
    category: 'Brand',
    stage: 'Profile + thesis',
    signal: 'Career and venture surface',
    description: 'A combined profile and venture-thesis surface for operating range, public proof, and market lenses.',
    image: '/project-shots/portfolio.jpg',
    color: '#58E6FF',
    icon: BriefcaseBusiness,
    proof: 'Public operator context and opportunity lens',
    coordinates: 'PROFILE / VENTURES',
  },
  {
    id: 'growthdex',
    name: 'GrowthDex',
    url: 'https://growth.iangoh.com',
    category: 'Growth',
    stage: 'Live database',
    signal: 'Growth OS',
    description: 'A source-backed catalogue across SEO, referrals, communities, AI search, and distribution loops.',
    image: '/project-shots/growthdex.jpg',
    color: '#D9FF4A',
    icon: Gauge,
    proof: '496 tactics and route-level discovery assets',
    coordinates: 'PLAYBOOK / DISTRIBUTION',
  },
  {
    id: 'web4',
    name: 'Web 4.0',
    url: 'https://web4.iangoh.com',
    category: 'Simulation',
    stage: 'Interactive',
    signal: 'Agent economy',
    description: 'A playable simulation of autonomous agents, compute tax, machine economics, and coordination.',
    image: '/project-shots/web4.jpg',
    color: '#C68CFF',
    icon: Atom,
    proof: 'Agent economy simulation',
    coordinates: 'SIM / AGENTS',
  },
  {
    id: 'llmapi',
    name: 'LLM API',
    url: 'https://llmapi.iangoh.com',
    category: 'AI Utility',
    stage: 'API layer',
    signal: 'Model gateway',
    description: 'A lab API surface for LLM routes, agent tools, prompt infrastructure, and product experiments.',
    image: '/project-shots/llmapi.svg',
    color: '#58E6FF',
    icon: BrainCircuit,
    proof: 'Shared model API layer for lab products',
    coordinates: 'LLM / API',
  },
  {
    id: 'bookflow',
    name: 'Bookflow',
    url: 'https://bookflow.iangoh.com',
    category: 'Venture',
    stage: 'Product',
    signal: 'WhatsApp booking',
    description: 'A WhatsApp-first AI receptionist and booking recovery product for service businesses.',
    image: '/project-shots/bookflow.jpg',
    color: '#58E6FF',
    icon: MessageCircle,
    proof: 'Never miss another booking',
    coordinates: 'UTILITY / REVENUE',
  },
  {
    id: 'extractmint',
    name: 'ExtractMint',
    url: 'https://extractmint.iangoh.com',
    category: 'AI Utility',
    stage: 'Converter',
    signal: 'Document ops',
    description: 'Converts bank statements, receipts, PDFs, DOCX files, and spreadsheets into structured outputs.',
    image: '/project-shots/extractmint.jpg',
    color: '#FF7A1A',
    icon: FileSpreadsheet,
    proof: 'Documents to Excel, Docs, CSV, PDF',
    coordinates: 'OPS / EXTRACTION',
  },
  {
    id: 'willcrafty',
    name: 'WillCrafty',
    url: 'https://willcrafty.iangoh.com',
    category: 'AI Utility',
    stage: 'Drafting tool',
    signal: 'Private legal utility',
    description: 'A privacy-forward free will draft builder with no hidden fees and no server-side storage.',
    image: '/project-shots/willcrafty.jpg',
    color: '#D7E2EA',
    icon: ShieldCheck,
    proof: 'Your will, your way',
    coordinates: 'TRUST / DRAFTING',
  },
  {
    id: 'kite',
    name: 'Kite Video',
    url: 'https://kitevideo.iangoh.com',
    category: 'Creative',
    stage: 'Editor',
    signal: 'Content repurposing',
    description: 'An installable web video editor that turns one idea into platform-ready posts for every channel.',
    image: '/project-shots/kite.jpg',
    color: '#C68CFF',
    icon: Video,
    proof: 'Create once, let it fly',
    coordinates: 'CREATIVE / FORMAT',
  },
  {
    id: 'ai-cinema',
    name: 'AI Cinema',
    url: 'https://www.youtube.com/watch?v=PsiZ88sWELU',
    category: 'Creative',
    stage: 'Showcase',
    signal: 'Generative film',
    description:
      'A cinematic AI video showcase for visual storytelling, generative film craft, and narrative experiments.',
    image: '/project-shots/ai-cinema.jpg',
    color: '#FF7A1A',
    icon: Video,
    proof: 'AI film showcase on YouTube',
    coordinates: 'AI CINEMA / SHOWCASE',
  },
  {
    id: 'music',
    name: 'Ian Goh Music',
    url: spotifyArtistUrl,
    category: 'Creative',
    stage: 'Spotify artist',
    signal: 'Music catalogue',
    description: 'A public Spotify artist surface for Ian Goh music, audio identity, and creative experiments.',
    image: '/project-shots/music.jpg',
    color: '#1ED760',
    icon: Music,
    proof: 'Spotify artist profile',
    coordinates: 'MUSIC / SPOTIFY',
  },
  {
    id: 'fourtype',
    name: 'FourType',
    url: 'https://www.fourtype.com/',
    category: 'Creative',
    stage: 'Quiz product',
    signal: 'Personality engine',
    description: 'A polished four temperaments quiz experience with premium mythology, gamified flow, and upgrade paths.',
    image: '/project-shots/fourtype.jpg',
    color: '#F7C948',
    icon: Sparkles,
    proof: 'Know your true nature',
    coordinates: 'QUIZ / CHARACTER',
  },
  {
    id: 'praise-mountain',
    name: 'Praise Mountain',
    url: 'https://praisemountain.netlify.app/',
    category: 'Brand',
    stage: 'Venue site',
    signal: 'Retreat destination',
    description: 'A serene Christian retreat website for rooms, day use, stories, rates, and reservation intent.',
    image: '/project-shots/praise-mountain.jpg',
    color: '#E2B84D',
    icon: Mountain,
    proof: 'Kokol retreat centre, est. 1991',
    coordinates: 'PLACE / HOSPITALITY',
  },
  {
    id: 'kira-money',
    name: 'KIRA Money',
    url: 'https://kira-money.netlify.app/',
    category: 'AI Utility',
    stage: 'Finance tool',
    signal: 'Private net worth',
    description: 'A privacy-first net worth tracker that keeps financial data on the device with no account lock-in.',
    image: '/project-shots/kira-money.jpg',
    color: '#22C983',
    icon: Coins,
    proof: 'Track wealth without cloud sync',
    coordinates: 'FINANCE / PRIVACY',
  },
  {
    id: 'wang-haron',
    name: 'Wang Haron & Goh',
    url: 'https://wangharon.netlify.app/',
    category: 'Brand',
    stage: 'Firm site',
    signal: 'Engineering trust',
    description: 'A civil and structural engineering consultancy website for credibility, services, and project history.',
    image: '/project-shots/wang-haron.jpg',
    color: '#7FC7A6',
    icon: Building2,
    proof: 'Sabah civil and structural consultancy',
    coordinates: 'FIRM / INFRASTRUCTURE',
  },
  {
    id: 'skill-rivals',
    name: 'SkillRivals',
    url: 'https://skillrivals.com/',
    category: 'Simulation',
    stage: 'Game market',
    signal: 'Skill prediction',
    description: 'A competitive prediction-market surface built around esports, sports, culture, and strategy.',
    image: '/project-shots/skill-rivals.jpg',
    color: '#8B5CFF',
    icon: Gamepad2,
    proof: 'Win by skill, not luck',
    coordinates: 'GAME / MARKET',
  },
  {
    id: 'kita',
    name: 'KITA',
    url: 'https://kita-iango.vercel.app/',
    category: 'Venture',
    stage: 'Investor site',
    signal: 'Flexible living',
    description: 'A founder-led investor microsite for trusted furnished homes and Southeast Asia city mobility.',
    image: '/project-shots/kita.jpg',
    color: '#D2A84C',
    icon: Home,
    proof: 'Trusted homes for mobile teams',
    coordinates: 'HOMES / SEA',
  },
]

const filters = ['All', 'Brand', 'Venture', 'Growth', 'AI Utility', 'Simulation', 'Creative'] as const

const labStats = [
  ['17', 'live surfaces'],
  ['10', 'product lanes'],
  ['04', 'brand nodes'],
  ['01', 'control room'],
]

const operatingPillars = [
  {
    icon: Workflow,
    title: 'One Narrative Spine',
    copy: 'The brand, venture thesis, growth library, and tools become one continuous proof system instead of scattered subdomains.',
  },
  {
    icon: BrainCircuit,
    title: 'Agent-Native Utility',
    copy: 'Small products stay concrete: what they do, who they help, and what loop they test in the real world.',
  },
  {
    icon: Layers3,
    title: 'Compounding Playbooks',
    copy: 'The lab keeps reusable knowledge visible, from growth tactics to simulations to operator decisions.',
  },
]

const stackProjects = projects.filter((project) =>
  ['growthdex', 'llmapi', 'fourtype', 'ai-cinema', 'music', 'skill-rivals', 'kita'].includes(project.id),
)

const marqueeProjects = [...projects, ...projects]

function useSmoothScroll() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'auto'
    return undefined
  }, [])
}

function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.22 }}
      transition={{ duration: 0.58, delay, ease: [0.19, 1, 0.22, 1] }}
    >
      {children}
    </motion.div>
  )
}

function HeroVisual({ items }: { items: OrbitItem[] }) {
  return <CssOrbit items={items} />
}

function CssOrbit({ items, muted = false }: { items: OrbitItem[]; muted?: boolean }) {
  return (
    <div className={`css-orbit ${muted ? 'css-orbit-muted' : ''}`} aria-hidden="true">
      <div className="css-orbit-ring css-orbit-ring-one" />
      <div className="css-orbit-ring css-orbit-ring-two" />
      <div className="css-orbit-ring css-orbit-ring-three" />
      <div className="css-orbit-core">
        <span>LAB</span>
      </div>
      {items.map((item, index) => {
        const angle = (index / items.length) * 360
        const radius = index % 2 === 0 ? 268 : 196
        const style = {
          borderColor: item.color,
          color: item.color,
          transform: `rotate(${angle}deg) translateX(${radius}px) rotate(-${angle}deg)`,
        } satisfies CSSProperties

        return (
          <span key={item.id} className="css-orbit-node" style={style}>
            <span>{item.name}</span>
          </span>
        )
      })}
    </div>
  )
}

function ProjectVisual({
  project,
  className = '',
  loading = 'lazy',
  fit = 'cover',
}: {
  project: Project
  className?: string
  loading?: 'lazy' | 'eager'
  fit?: 'cover' | 'contain'
}) {
  if (project.image) {
    const fitClass = fit === 'contain' ? 'object-contain' : 'object-cover object-top'

    return (
      <img
        className={`project-image h-full w-full ${fitClass} ${className}`}
        src={project.image}
        alt={`${project.name} preview`}
        loading={loading}
        decoding="async"
      />
    )
  }

  return (
    <div className={`screen-grid flex h-full w-full flex-col justify-between p-5 ${className}`}>
      <div className="flex items-center justify-between text-xs font-semibold uppercase text-ink">
        <span>{project.name}</span>
        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
      </div>
      <div>
        <div className="mb-3 h-3 w-20 rounded-full bg-ink/70" />
        <div className="mb-2 h-2 w-32 rounded-full bg-ink/45" />
        <div className="h-2 w-24 rounded-full bg-ink/35" />
      </div>
    </div>
  )
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.22 })
  return <motion.div className="scroll-progress" style={{ scaleX }} />
}

function HeroBot() {
  const botRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [chat, setChat] = useState<ChatMessage[]>([
    {
      role: 'bot',
      text: "This lab is Ian's control room: live products, LLM/API surfaces, venture proof, and growth systems in one place.",
    },
  ])

  const fallbackAnswerFor = (rawPrompt: string) => {
    const prompt = rawPrompt.toLowerCase()

    if (prompt.includes('llm') || prompt.includes('api') || prompt.includes('model')) {
      return 'LLM API should become the shared model gateway for lab products: prompts, tools, memory, routing, and experiments.'
    }

    if (prompt.includes('music') || prompt.includes('spotify') || prompt.includes('audio')) {
      return 'Music sits in the creative layer: it makes the public lab feel more human and gives the brand another proof surface beyond products.'
    }

    if (prompt.includes('project') || prompt.includes('surface') || prompt.includes('map')) {
      return 'Use the map to jump between live surfaces, then judge each one by proof: product, audience, distribution, or thesis.'
    }

    if (prompt.includes('venture') || prompt.includes('kita') || prompt.includes('growth')) {
      return 'The venture layer is for market lenses and proof. GrowthDex, KITA, SkillRivals, and LLM API show the current lanes.'
    }

    return 'Treat the lab as the public operating room: what exists, what is being tested, and which systems are ready to compound.'
  }

  const sendPrompt = async (prompt: string) => {
    const text = prompt.trim()
    if (!text || isSending) return

    const history = chat.slice(-6)
    const nextChat: ChatMessage[] = [...history, { role: 'you', text }]
    setChat(nextChat)
    setIsSending(true)

    try {
      const response = await fetch('/api/lab-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok || typeof data.reply !== 'string') {
        throw new Error(data.error || 'Lab bot request failed.')
      }

      setChat((current) => [...current.slice(-5), { role: 'bot', text: data.reply }])
    } catch {
      setChat((current) => [...current.slice(-5), { role: 'bot', text: fallbackAnswerFor(text) }])
    } finally {
      setIsSending(false)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    sendPrompt(input)
    setInput('')
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const bot = botRef.current
    if (!bot) return

    const rect = bot.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5

    bot.style.setProperty('--bot-tilt-x', `${Math.max(-14, Math.min(14, x * 18))}deg`)
    bot.style.setProperty('--bot-tilt-y', `${Math.max(-10, Math.min(10, y * -14))}deg`)
    bot.style.setProperty('--bot-eye-x', `${Math.max(-4, Math.min(4, x * 8))}px`)
    bot.style.setProperty('--bot-eye-y', `${Math.max(-3, Math.min(3, y * 6))}px`)
  }

  const handlePointerLeave = () => {
    const bot = botRef.current
    if (!bot) return
    bot.style.setProperty('--bot-tilt-x', '0deg')
    bot.style.setProperty('--bot-tilt-y', '0deg')
    bot.style.setProperty('--bot-eye-x', '0px')
    bot.style.setProperty('--bot-eye-y', '0px')
  }

  return (
    <motion.div
      ref={botRef}
      className="hero-bot"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.18, duration: 0.52, ease: [0.19, 1, 0.22, 1] }}
    >
      <span className="hero-bot-stage" aria-hidden="true">
        <span className="hero-bot-shadow" />
        <span className="hero-bot-body">
          <span className="hero-bot-antenna" />
          <span className="hero-bot-head">
            <span className="hero-bot-eye hero-bot-eye-left" />
            <span className="hero-bot-eye hero-bot-eye-right" />
            <span className="hero-bot-mouth" />
          </span>
          <span className="hero-bot-torso">
            <span className="hero-bot-core" />
          </span>
        </span>
      </span>
      <div className="hero-chat-panel">
        <div className="hero-chat-header">
          <BrainCircuit className="h-4 w-4 text-signal" aria-hidden="true" />
          <span>Lab bot</span>
        </div>
        <div className="hero-chat-log" aria-live="polite">
          {chat.map((message, index) => (
            <p key={`${message.role}-${index}`} className={`hero-chat-message hero-chat-message-${message.role}`}>
              {message.text}
            </p>
          ))}
        </div>
        <form className="hero-chat-form" onSubmit={handleSubmit}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask the lab bot"
            aria-label="Ask the lab bot"
          />
          <button type="submit" disabled={isSending} aria-label="Send message">
            <ArrowUpRight className={`h-4 w-4 ${isSending ? 'animate-pulse' : ''}`} aria-hidden="true" />
          </button>
        </form>
        <div className="hero-chat-actions">
          {['Purpose', 'LLM API', 'Music', 'Projects'].map((prompt) => (
            <button key={prompt} type="button" disabled={isSending} onClick={() => sendPrompt(prompt)}>
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function CinematicHero() {
  const ref = useRef<HTMLElement>(null)
  const [isVideoReady, setIsVideoReady] = useState(false)

  return (
    <section ref={ref} className="cinematic-hero relative min-h-[104vh] overflow-hidden px-5 pb-12 pt-5 sm:px-8 md:px-10">
      <video
        className={`hero-video-bg ${isVideoReady ? 'hero-video-ready' : ''}`}
        aria-hidden="true"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onPlaying={() => setIsVideoReady(true)}
      >
        <source src={heroVideoUrl} type="video/mp4" />
      </video>
      <div className="hero-video-overlay" aria-hidden="true" />
      <div className="hero-canvas">
        <HeroVisual items={projects.map(({ id, name, color }) => ({ id, name, color }))} />
      </div>
      <div className="hero-scanline" aria-hidden="true" />

      <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between gap-4 text-sm font-semibold uppercase text-chalk/86 md:text-base">
        <a href="https://iangoh.com" className="flex items-center gap-2" target="_blank" rel="noreferrer">
          <Sparkles className="h-4 w-4 text-signal" aria-hidden="true" />
          lab.iangoh.com
        </a>
        <div className="hidden items-center gap-7 sm:flex">
          <a className="transition hover:text-signal" href="#map">
            Map
          </a>
          <a className="transition hover:text-signal" href="#systems">
            Systems
          </a>
          <a className="transition hover:text-signal" href="#projects">
            Projects
          </a>
          <a className="transition hover:text-signal" href="#contact">
            Contact
          </a>
        </div>
      </nav>

      <div className="hero-shell relative z-10 mx-auto max-w-7xl pt-8 md:pt-14">
        <div className="hero-main-grid">
          <HeroBot />

          <div className="hero-copy">
            <FadeIn>
              <p className="mb-5 inline-flex items-center rounded-full border border-chalk/18 bg-ink/42 px-4 py-2 text-xs font-bold uppercase text-chalk/76 backdrop-blur-xl">
                Public control room / AI systems / venture proof
              </p>
            </FadeIn>
            <FadeIn delay={0.08}>
              <h1 className="hero-heading hero-title text-4xl font-black uppercase leading-[0.86] sm:text-5xl md:text-6xl xl:text-7xl">
                Ian Goh Lab
              </h1>
            </FadeIn>
            <FadeIn delay={0.16}>
              <p className="mt-6 max-w-2xl text-xl font-light uppercase leading-snug text-chalk/88 md:text-2xl">
                A public operating map for Ian's live products, LLM API layer, growth playbooks, and venture experiments.
              </p>
            </FadeIn>
            <FadeIn delay={0.22}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#map"
                  className="magnetic-button inline-flex min-h-12 items-center gap-2 rounded-full px-6 py-3 text-sm font-black uppercase transition hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
                >
                  Enter the Lab
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href={spotifyArtistUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-chalk/24 px-6 py-3 text-sm font-bold uppercase text-chalk transition hover:border-signal hover:text-signal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
                >
                  Spotify
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </FadeIn>
          </div>
        </div>

        <div className="hero-utility-grid">
          <FadeIn delay={0.26}>
            <div className="glass-line hero-purpose rounded-[12px] p-4">
              <p className="mb-2 text-xs font-black uppercase text-signal">What the lab is for</p>
              <p className="text-base font-light leading-relaxed text-chalk/72">
                It gives visitors one fast route through the projects, the proof behind them, and the AI infrastructure that can connect them.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="glass-line hero-meter rounded-[12px] p-4">
              <div className="mb-4 flex items-center justify-between border-b border-chalk/12 pb-3 text-xs font-bold uppercase text-chalk/54">
                <span>Lab telemetry</span>
                <span>Live map</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {labStats.map(([value, label]) => (
                  <div key={label} className="border-l border-chalk/22 pl-3">
                    <p className="text-4xl font-black text-white">{value}</p>
                    <p className="text-sm font-light uppercase text-chalk/62">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

function ScrollMarquee() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const rowOneX = useTransform(scrollYProgress, [0, 1], ['-7%', '-37%'])
  const rowTwoX = useTransform(scrollYProgress, [0, 1], ['-34%', '-4%'])
  const headingY = useTransform(scrollYProgress, [0, 0.55, 1], [90, 0, -70])
  const headingOpacity = useTransform(scrollYProgress, [0, 0.22, 0.76, 1], [0, 1, 1, 0.25])

  return (
    <section id="map" ref={ref} className="relative z-10 overflow-hidden py-24 md:py-36">
      <motion.div
        className="mx-auto mb-10 max-w-7xl px-5 sm:px-8 md:px-10"
        style={{ y: headingY, opacity: headingOpacity }}
      >
        <p className="mb-4 text-sm font-black uppercase text-signal">Project field</p>
        <h2 className="hero-heading max-w-4xl text-6xl font-black uppercase leading-none md:text-8xl">
          Every surface becomes a moving proof point.
        </h2>
      </motion.div>
      <motion.div className="project-marquee project-marquee-scroll mb-4" style={{ x: rowOneX }}>
        {marqueeProjects.map((project, index) => (
          <a
            key={`${project.id}-top-${index}`}
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="marquee-card group"
          >
            <ProjectVisual project={project} />
            <span>{project.name}</span>
          </a>
        ))}
      </motion.div>
      <motion.div className="project-marquee project-marquee-scroll reverse" style={{ x: rowTwoX }}>
        {marqueeProjects
          .slice()
          .reverse()
          .map((project, index) => (
            <a
              key={`${project.id}-bottom-${index}`}
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="marquee-card marquee-card-small group"
            >
              <ProjectVisual project={project} />
              <span>{project.coordinates}</span>
            </a>
          ))}
      </motion.div>
    </section>
  )
}

function ThesisScene() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1.04, 0.94])
  const rotate = useTransform(scrollYProgress, [0, 1], [-3, 3])
  const xA = useTransform(scrollYProgress, [0, 1], ['-10%', '7%'])
  const xB = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])
  const xC = useTransform(scrollYProgress, [0, 1], ['-6%', '12%'])

  return (
    <section id="systems" ref={ref} className="relative z-10 px-5 py-24 sm:px-8 md:px-10 md:py-36">
      <div className="mx-auto max-w-7xl">
        <motion.div className="thesis-stage" style={{ scale, rotate }}>
          <div className="thesis-ruler" aria-hidden="true" />
          <p className="mb-8 text-sm font-black uppercase text-signal">Operating thesis</p>
          <motion.h2 className="thesis-word hero-heading" style={{ x: xA }}>
            Markets
          </motion.h2>
          <motion.h2 className="thesis-word thesis-word-alt" style={{ x: xB }}>
            Communities
          </motion.h2>
          <motion.h2 className="thesis-word hero-heading" style={{ x: xC }}>
            Distribution
          </motion.h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {operatingPillars.map((pillar, index) => {
              const Icon = pillar.icon
              return (
                <FadeIn key={pillar.title} delay={index * 0.08}>
                  <article className="glass-line h-full rounded-[12px] p-6">
                    <Icon className="mb-10 h-7 w-7 text-signal" aria-hidden="true" />
                    <h3 className="mb-4 text-2xl font-black uppercase leading-none text-white">{pillar.title}</h3>
                    <p className="font-light leading-relaxed text-chalk/66">{pillar.copy}</p>
                  </article>
                </FadeIn>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function OperatingNotes() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])

  return (
    <section ref={ref} className="relative z-10 overflow-hidden rounded-t-[42px] bg-[#F4F7EA] px-5 py-24 text-ink sm:px-8 md:px-10 md:py-36">
      <motion.div className="light-section-plate" style={{ y: backgroundY }} aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl">
        <FadeIn>
          <div className="mb-14 grid gap-7 md:grid-cols-[0.78fr_1fr] md:items-end">
            <h2 className="text-6xl font-black uppercase leading-none md:text-8xl">Ian principles</h2>
            <p className="max-w-2xl text-xl font-light leading-relaxed text-ink/62">
              The lab mirrors Ian's operating pattern: start from zero, read the market through people, and turn sharp
              instincts into public products.
            </p>
          </div>
        </FadeIn>

        <div className="divide-y divide-ink/14 border-y border-ink/14">
          {[
            [
              '01',
              'Build from 0 to 1',
              'Start with an unclear wedge, shape it into a thesis, then ship a surface people can actually open, test, and judge.',
            ],
            [
              '02',
              'Community is the market',
              'The work comes from creators, founders, operators, families, and real user behavior before it becomes a product strategy.',
            ],
            [
              '03',
              'Bridge worlds',
              'Borneo roots, China operating scars, and MENA or Southeast Asia curiosity create angles that pure desk research misses.',
            ],
            [
              '04',
              'Receipts compound',
              'Every serious idea should leave evidence behind: a live tool, investor deck, growth library, screenshot, or decision trail.',
            ],
          ].map(([number, title, copy], index) => (
            <FadeIn key={title} delay={index * 0.05}>
              <motion.div
                className="principle-row"
                initial={{ opacity: 0.82 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false, amount: 0.4 }}
                transition={{ duration: 0.82, delay: index * 0.08 }}
              >
                <motion.span
                  className="principle-line"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: false, amount: 0.4 }}
                  transition={{ duration: 0.82, delay: index * 0.08 }}
                />
                <p className="text-6xl font-black leading-none md:text-7xl">{number}</p>
                <h3 className="text-2xl font-black uppercase leading-tight md:text-4xl">{title}</h3>
                <p className="max-w-3xl text-lg font-light leading-relaxed text-ink/62">{copy}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function ScrollProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.86', 'end 0.22'] })
  const scale = useTransform(scrollYProgress, [0, 0.45, 1], [0.88, 1, 0.96])
  const rotateX = useTransform(scrollYProgress, [0, 0.55, 1], [5, 0, -3])
  const imageOpacity = useTransform(scrollYProgress, [0, 0.34, 1], [0.76, 1, 1])
  const Icon = project.icon

  return (
    <motion.article ref={ref} className="project-cinema-card" style={{ scale, rotateX }}>
      <div className="project-cinema-copy">
        <div className="mb-10 flex items-start justify-between gap-4">
          <p className="text-6xl font-black leading-none text-white md:text-8xl">{String(index + 1).padStart(2, '0')}</p>
          <span className="inline-flex items-center gap-2 rounded-full border border-chalk/18 px-4 py-2 text-sm font-bold uppercase text-chalk/78">
            <Icon className="h-4 w-4" aria-hidden="true" />
            {project.category}
          </span>
        </div>
        <p className="mb-3 text-sm font-black uppercase" style={{ color: project.color }}>
          {project.signal}
        </p>
        <h3 className="mb-5 text-5xl font-black uppercase leading-none text-white md:text-7xl">{project.name}</h3>
        <p className="max-w-2xl text-xl font-light leading-relaxed text-chalk/68">{project.description}</p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-chalk px-6 py-3 text-sm font-black uppercase text-chalk transition hover:bg-chalk/10"
          >
            Live Project
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <span className="rounded-full border border-chalk/14 px-5 py-3 text-sm font-bold uppercase text-chalk/48">
            {project.coordinates}
          </span>
        </div>
      </div>
      <motion.div className="project-cinema-media" style={{ opacity: imageOpacity }}>
        <ProjectVisual project={project} loading="eager" fit="contain" />
        <div className="project-proof">
          <Zap className="h-5 w-5" style={{ color: project.color }} aria-hidden="true" />
          <span>{project.proof}</span>
        </div>
      </motion.div>
    </motion.article>
  )
}

function ProjectStack() {
  return (
    <section id="projects" className="relative z-10 -mt-10 rounded-t-[42px] bg-ink px-5 py-24 sm:px-8 md:px-10 md:py-36">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 text-sm font-black uppercase text-signal">
                <Play className="h-4 w-4" aria-hidden="true" />
                Scroll-built stack
              </p>
              <h2 className="hero-heading text-6xl font-black uppercase leading-none md:text-8xl">Live build lanes</h2>
            </div>
            <p className="max-w-xl text-xl font-light leading-relaxed text-chalk/68">
              Each product now gets a scroll-scrubbed reveal instead of a static card stack.
            </p>
          </div>
        </FadeIn>

        <div className="space-y-10 md:space-y-14">
          {stackProjects.map((project, index) => (
            <ScrollProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectAtlas({ visibleProjects, activeFilter, setActiveFilter, query, setQuery }: {
  visibleProjects: Project[]
  activeFilter: (typeof filters)[number]
  setActiveFilter: (filter: (typeof filters)[number]) => void
  query: string
  setQuery: (query: string) => void
}) {
  return (
    <section className="relative z-10 px-5 pb-24 pt-10 sm:px-8 md:px-10 md:pb-36">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 text-sm font-black uppercase text-signal">
                <Search className="h-4 w-4" aria-hidden="true" />
                Atlas
              </p>
              <h2 className="hero-heading text-6xl font-black uppercase leading-none md:text-8xl">All surfaces</h2>
            </div>
            <div className="glass-line flex min-h-14 w-full items-center gap-3 rounded-full px-4 lg:max-w-md">
              <Search className="h-5 w-5 shrink-0 text-chalk/50" aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-12 min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-chalk/42"
                placeholder="Search projects"
                aria-label="Search projects"
              />
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="filter-scroll mb-8 flex gap-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`min-h-11 shrink-0 rounded-full border px-5 text-sm font-bold uppercase transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal ${
                  activeFilter === filter
                    ? 'border-signal bg-signal text-ink'
                    : 'border-chalk/16 bg-chalk/6 text-chalk/72 hover:border-chalk/42 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </FadeIn>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleProjects.map((project, index) => {
            const Icon = project.icon
            return (
              <FadeIn key={project.id} delay={index * 0.035}>
                <article className="atlas-card group">
                  <a href={project.url} target="_blank" rel="noreferrer" className="block h-56 overflow-hidden">
                    <ProjectVisual project={project} className="transition duration-700 group-hover:scale-[1.08]" />
                  </a>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full border border-chalk/14 px-3 py-1.5 text-xs font-bold uppercase text-chalk/62">
                        <Icon className="h-3.5 w-3.5" style={{ color: project.color }} aria-hidden="true" />
                        {project.stage}
                      </span>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noreferrer"
                        className="grid h-9 w-9 place-items-center rounded-full border border-chalk/16 text-chalk/68 transition hover:border-signal hover:text-signal"
                        aria-label={`Open ${project.name}`}
                      >
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </a>
                    </div>
                    <p className="mb-2 text-xs font-black uppercase" style={{ color: project.color }}>
                      {project.signal}
                    </p>
                    <h3 className="mb-3 text-3xl font-black uppercase leading-none text-white">{project.name}</h3>
                    <p className="mb-5 flex-1 font-light leading-relaxed text-chalk/62">{project.description}</p>
                    <p className="border-t border-chalk/12 pt-4 text-sm font-bold uppercase text-chalk/48">{project.proof}</p>
                  </div>
                </article>
              </FadeIn>
            )
          })}
        </div>

        {visibleProjects.length === 0 ? (
          <div className="mt-12 rounded-[12px] border border-chalk/14 bg-chalk/6 p-8 text-center text-chalk/62">
            No projects match this filter.
          </div>
        ) : null}
      </div>
    </section>
  )
}

function App() {
  useSmoothScroll()
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>('All')
  const [query, setQuery] = useState('')

  const visibleProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return projects.filter((project) => {
      const matchesFilter = activeFilter === 'All' || project.category === activeFilter
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [project.name, project.category, project.signal, project.description, project.proof, project.coordinates]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)

      return matchesFilter && matchesQuery
    })
  }, [activeFilter, query])

  return (
    <main className="lab-shell relative text-chalk">
      <ScrollProgress />
      <div className="noise-field" aria-hidden="true" />
      <CinematicHero />
      <ScrollMarquee />
      <ThesisScene />
      <OperatingNotes />
      <ProjectStack />
      <ProjectAtlas
        visibleProjects={visibleProjects}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        query={query}
        setQuery={setQuery}
      />
      <footer id="contact" className="relative z-10 border-t border-chalk/12 px-5 py-10 sm:px-8 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-signal">Ian Goh Lab</p>
            <p className="mt-2 max-w-2xl font-light text-chalk/58">
              A public map for live projects, growth systems, and venture experiments across the iangoh.com domain.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://llmapi.iangoh.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-chalk/16 px-5 text-sm font-bold uppercase text-chalk/72 transition hover:border-signal hover:text-signal"
            >
              LLM API
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="https://portfolio.iangoh.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-chalk/16 px-5 text-sm font-bold uppercase text-chalk/72 transition hover:border-signal hover:text-signal"
            >
              Portfolio / Ventures
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={spotifyArtistUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-chalk/16 px-5 text-sm font-bold uppercase text-chalk/72 transition hover:border-signal hover:text-signal"
            >
              Spotify
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default App
