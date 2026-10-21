import { lazy, Suspense, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, ChevronDown, Copy, RotateCcw, Share2, Sparkles } from 'lucide-react'
import { zones } from '../shared/zones.js'
import { buildZoneShareUrl, selectSharePair } from '../shared/zone-share.js'
import { ZoneExplanation, ZoneGuide } from './ZoneGuide'
import './FindYourZone.css'

const ZoneEmblem = lazy(() => import('./ZoneEmblem'))

type ZoneId = 1 | 2 | 3 | 4 | 5 | 6 | 7

type Question = {
  prompt: string
  options: Array<{ zone: ZoneId; label: string }>
}


const questions: Question[] = [
  {
    prompt: 'When your group faces a new problem, what do you like to do?',
    options: [
      { zone: 1, label: 'Find out what is happening and why.' },
      { zone: 2, label: 'Take a task and finish it carefully.' },
      { zone: 3, label: 'Explain the facts so everyone understands.' },
      { zone: 4, label: 'Help the group feel confident and keep going.' },
    ],
  },
  {
    prompt: 'When a project gets stuck, what do you usually do?',
    options: [
      { zone: 2, label: 'Finish the tasks that are still waiting.' },
      { zone: 3, label: 'Make the problem clear and suggest what to do next.' },
      { zone: 4, label: 'Encourage the team to keep going.' },
      { zone: 5, label: 'Help decide how to use the team’s time and tools.' },
    ],
  },
  {
    prompt: 'You join a project, but no one knows what to do next. What would you do?',
    options: [
      { zone: 3, label: 'Explain what we know and write down the next steps.' },
      { zone: 4, label: 'Invite people to share ideas and take part.' },
      { zone: 5, label: 'Organize the people and tools needed.' },
      { zone: 6, label: 'Choose a direction, bring people together, and start building.' },
    ],
  },
  {
    prompt: 'The team has more work than time. How would you help?',
    options: [
      { zone: 4, label: 'Encourage the team and remind them why the work matters.' },
      { zone: 5, label: 'Choose how to use the time, people, and tools.' },
      { zone: 6, label: 'Set a direction and divide up the work.' },
      { zone: 7, label: 'Find what is blocking progress and fix it.' },
    ],
  },
  {
    prompt: 'After finishing a useful project, what would you want to do next?',
    options: [
      { zone: 5, label: 'Make sure the time, money, and tools are used well.' },
      { zone: 6, label: 'Build the next version or make a new idea real.' },
      { zone: 7, label: 'Help with the problem people still have.' },
      { zone: 1, label: 'Find out why it worked and what we can learn.' },
    ],
  },
  {
    prompt: 'What do people usually thank you for?',
    options: [
      { zone: 6, label: 'Bringing people together and moving an important goal forward.' },
      { zone: 7, label: 'Noticing a problem and making things easier for someone.' },
      { zone: 1, label: 'Helping us understand what was happening and why.' },
      { zone: 2, label: 'Taking responsibility and getting the work done well.' },
    ],
  },
  {
    prompt: 'If the same problem keeps coming back, what would you most like to do?',
    options: [
      { zone: 7, label: 'Find out what people need and help meet that need.' },
      { zone: 1, label: 'Look for the cause of the problem.' },
      { zone: 2, label: 'Improve the steps so the job gets done well each time.' },
      { zone: 3, label: 'Explain the problem so others can spot and solve it.' },
    ],
  },
  {
    prompt: 'When you help someone learn, what do you enjoy most?',
    options: [
      { zone: 1, label: 'Find out how the subject works before explaining it.' },
      { zone: 2, label: 'Show them the steps and let them practise.' },
      { zone: 3, label: 'Explain it clearly, step by step.' },
      { zone: 4, label: 'Encourage them to ask questions and keep trying.' },
    ],
  },
  {
    prompt: 'The team is stressed about a deadline. How would you help?',
    options: [
      { zone: 2, label: 'Take an important task and finish it well.' },
      { zone: 3, label: 'Explain what needs attention first.' },
      { zone: 4, label: 'Support the team and help them stay focused.' },
      { zone: 5, label: 'Change who does what so the team can use its time and skills well.' },
    ],
  },
  {
    prompt: 'A good idea has support, but no one is leading it. What would you do?',
    options: [
      { zone: 3, label: 'Explain the idea and how it could work.' },
      { zone: 4, label: 'Bring people together and ask them to join in.' },
      { zone: 5, label: 'Work out who and what the idea needs.' },
      { zone: 6, label: 'Lead the work and turn the idea into a real project.' },
    ],
  },
  {
    prompt: 'A service often lets people down. What would you want to do?',
    options: [
      { zone: 4, label: 'Support the staff so they can help people with confidence.' },
      { zone: 5, label: 'Give each task a clear owner and the help it needs.' },
      { zone: 6, label: 'Bring a team together to redesign the service and make the changes.' },
      { zone: 7, label: 'Find what is making things hard for people and fix it.' },
    ],
  },
  {
    prompt: 'You have time to help with one thing this week. What would you choose?',
    options: [
      { zone: 5, label: 'Help the team use its time and skills well.' },
      { zone: 6, label: 'Start building something that moves an important goal forward.' },
      { zone: 7, label: 'Make a problem easier for someone who needs help.' },
      { zone: 1, label: 'Look into a question that could change how we see the problem.' },
    ],
  },
  {
    prompt: 'What kind of help do you most enjoy giving?',
    options: [
      { zone: 6, label: '“Can you help us choose a direction and get started?”' },
      { zone: 7, label: '“Can you help us fix what is getting in the way?”' },
      { zone: 1, label: '“Can you help us understand what is happening?”' },
      { zone: 2, label: '“Can you do this job and make sure it is done well?”' },
    ],
  },
  {
    prompt: 'Which of these sounds most like something people have said to you?',
    options: [
      { zone: 7, label: '“You noticed what was missing and helped fix it.”' },
      { zone: 1, label: '“You helped us understand why it was happening.”' },
      { zone: 2, label: '“You followed through and made sure it was done well.”' },
      { zone: 3, label: '“You explained it so everyone could understand.”' },
    ],
  },
  {
    prompt: 'For a solution to keep helping after you leave, what matters most?',
    options: [
      { zone: 1, label: 'People understand the idea and why it works.' },
      { zone: 2, label: 'The steps are reliable and the details are right.' },
      { zone: 3, label: 'Others can learn from clear notes or instructions.' },
      { zone: 4, label: 'People feel ready and supported to continue.' },
    ],
  },
  {
    prompt: 'A small team has a new opportunity, but some things are uncertain. What would you take on?',
    options: [
      { zone: 2, label: 'Do the practical tasks and cover the essentials.' },
      { zone: 3, label: 'Find out what the team needs to know and explain it.' },
      { zone: 4, label: 'Help the team feel confident enough to try.' },
      { zone: 5, label: 'Plan how to use the time, skills, and budget.' },
    ],
  },
  {
    prompt: 'A group of people is growing quickly. What would you like to help with?',
    options: [
      { zone: 3, label: 'Show new people how things work so they can join in.' },
      { zone: 4, label: 'Welcome people and help them feel included.' },
      { zone: 5, label: 'Organize people and activities so the group can grow.' },
      { zone: 6, label: 'Build a team and plan for what comes next.' },
    ],
  },
  {
    prompt: 'You see something holding a person or team back. What would you do?',
    options: [
      { zone: 4, label: 'Help them feel confident and see what they can do next.' },
      { zone: 5, label: 'Put available help where it is needed most.' },
      { zone: 6, label: 'Bring people together to make a better way of working.' },
      { zone: 7, label: 'Find and fix the problem or missing support.' },
    ],
  },
  {
    prompt: 'A new product or project has launched successfully. What would you like to do next?',
    options: [
      { zone: 5, label: 'Help the team grow without wasting what it has built.' },
      { zone: 6, label: 'Build the next version or go after a bigger opportunity.' },
      { zone: 7, label: 'Fix the problems people still report and make it work better.' },
      { zone: 1, label: 'Find out why the launch worked and what we still need to learn.' },
    ],
  },
  {
    prompt: 'Think of a time your work helped someone. Which part would you like to do more often?',
    options: [
      { zone: 6, label: 'Turn an idea into something people can use.' },
      { zone: 7, label: 'Notice what someone needs and help them.' },
      { zone: 1, label: 'Work out an answer to a hard question or new situation.' },
      { zone: 2, label: 'Do careful work and get the details right.' },
    ],
  },
]

const initialScores = (): Record<ZoneId, number> => ({
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0,
})

export default function FindYourZone() {
  const [mode, setMode] = useState<'intro' | 'quiz' | 'results'>('intro')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Array<ZoneId | null>>(() => Array(questions.length).fill(null))
  const [copied, setCopied] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [shareStatus, setShareStatus] = useState('')

  const rankedZones = useMemo(() => {
    const selected = initialScores()
    const available = initialScores()

    questions.forEach((question) => {
      question.options.forEach((option) => {
        available[option.zone] += 1
      })
    })

    answers.forEach((answer) => {
      if (answer !== null) selected[answer] += 1
    })

    return zones
      .map((zone) => ({ ...zone, selected: selected[zone.id], available: available[zone.id] }))
      .sort((a, b) => b.selected - a.selected || a.id - b.id)
  }, [answers])

  const currentQuestion = questions[questionIndex]
  const currentAnswer = answers[questionIndex]
  const progress = mode === 'quiz' ? ((questionIndex + 1) / questions.length) * 100 : 0
  const first = rankedZones[0]
  const tiedLeaders = rankedZones.filter((zone) => zone.selected === first.selected)
  const nextScore = rankedZones.find((zone) => zone.selected < first.selected)?.selected
  const closeZones = nextScore === undefined ? [] : rankedZones.filter((zone) => zone.selected === nextScore)
  const resultZones = tiedLeaders.length > 1 ? tiedLeaders : [first, ...closeZones]
  const sharePairIds = selectSharePair(rankedZones)
  const shareZones = sharePairIds.map((id) => rankedZones.find((zone) => zone.id === id)).filter((zone) => zone !== undefined)

  const chooseAnswer = (zone: ZoneId) => {
    setAnswers((current) => current.map((answer, index) => (index === questionIndex ? zone : answer)))
    setCopied(false)
    setLinkCopied(false)
    setShareStatus('')
  }

  const startQuiz = () => {
    setQuestionIndex(0)
    setAnswers(Array(questions.length).fill(null))
    setCopied(false)
    setLinkCopied(false)
    setShareStatus('')
    setMode('quiz')
  }

  const goBack = () => {
    if (questionIndex > 0) setQuestionIndex((current) => current - 1)
  }

  const goForward = () => {
    if (currentAnswer === null) return
    if (questionIndex === questions.length - 1) {
      setMode('results')
      return
    }
    setQuestionIndex((current) => current + 1)
  }

  const copyResult = async () => {
    const signalSummary = resultZones
      .map((zone) => `${zone.name} (${zone.selected}/${zone.available})`)
      .join('; ')
    const summary =
      (tiedLeaders.length > 1 ? 'Find Your Zone — tied lead signals: ' : 'Find Your Zone — leading and close signals: ') +
      signalSummary +
      '. A reflection result, not a fixed label.'
    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  const copyShareLink = async (shareUrl?: string) => {
    const url = shareUrl ?? buildZoneShareUrl(window.location.origin, shareZones[0]?.id, shareZones[1]?.id)
    if (!url) {
      setShareStatus('This result link is unavailable.')
      return
    }

    try {
      await navigator.clipboard.writeText(url)
      setLinkCopied(true)
      setShareStatus('Link copied')
    } catch {
      setLinkCopied(false)
      setShareStatus('Could not copy the link on this device.')
    }
  }

  const shareResult = async () => {
    const shareUrl = buildZoneShareUrl(window.location.origin, shareZones[0]?.id, shareZones[1]?.id)
    if (!shareUrl || shareZones.length !== 2) {
      setShareStatus('This result link is unavailable.')
      return
    }

    if (!navigator.share) {
      await copyShareLink(shareUrl)
      return
    }

    try {
      await navigator.share({
        title: 'My Find Your Zone result',
        text: `My leading signal is ${shareZones[0].name}; my close signal is ${shareZones[1].name}.`,
        url: shareUrl,
      })
      setShareStatus('')
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return
      setShareStatus('Sharing is unavailable. You can copy the link instead.')
    }
  }

  return (
    <section id="find-your-zone" className="zone-section">
      <div className="zone-wrap">
        <div className="zone-heading-grid">
          <div>
            <p className="zone-kicker"><Sparkles size={15} aria-hidden="true" /> A reflection exercise</p>
            <h2>Find your zone</h2>
            <p className="zone-lead">Think about the work you enjoy and how you like to help.</p>
          </div>
          <aside className="zone-note">
            <span>7 ways of helping</span>
            <strong>20 questions</strong>
            <p>Your answers stay in this page. We calculate the pattern in your browser and do not send or store your choices.</p>
          </aside>
        </div>

        <div className="zone-panel" aria-live="polite">
          {mode === 'intro' ? (
            <div className="zone-intro">
              <div>
                <p className="zone-overline">Start with a real memory</p>
                <h3>Think of a time you helped someone.</h3>
                <p>
                  Think about a work project, a team task, or a time you helped someone in daily life. Choose what you
                  actually did, not what sounds most impressive.
                </p>
              </div>
              <div className="zone-intro-bottom">
                <p>
                  This is a reflection tool, not a scientific or definitive test. Use the result as a prompt, then
                  compare it with your own experience.
                </p>
                <button className="zone-button zone-button-primary" type="button" onClick={startQuiz}>
                  Begin the questions <ArrowRight size={17} aria-hidden="true" />
                </button>
                <a className="zone-guide-link" href="#zone-guide">Explore the seven zones <ArrowRight size={15} aria-hidden="true" /></a>
              </div>
            </div>
          ) : null}

          {mode === 'quiz' ? (
            <div className="zone-quiz">
              <div className="zone-progress-head">
                <span>Question {questionIndex + 1} of {questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="zone-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
                <span style={{ width: progress + '%' }} />
              </div>
              <fieldset className="zone-question">
                <legend>{currentQuestion.prompt}</legend>
                <div className="zone-options">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={option.zone}
                      className={'zone-option' + (currentAnswer === option.zone ? ' is-selected' : '')}
                      type="button"
                      aria-pressed={currentAnswer === option.zone}
                      onClick={() => chooseAnswer(option.zone)}
                    >
                      <span className="zone-option-letter">{String.fromCharCode(65 + index)}</span>
                      <span>{option.label}</span>
                      <Check size={17} className="zone-option-check" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="zone-question-footer">
                <button className="zone-button zone-button-quiet" type="button" onClick={goBack} disabled={questionIndex === 0}>
                  <ArrowLeft size={16} aria-hidden="true" /> Back
                </button>
                <button className="zone-button zone-button-primary" type="button" onClick={goForward} disabled={currentAnswer === null}>
                  {questionIndex === questions.length - 1 ? 'See my results' : 'Continue'}
                  {questionIndex === questions.length - 1 ? <Sparkles size={16} aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}
                </button>
              </div>
            </div>
          ) : null}

          {mode === 'results' ? (
            <div className="zone-results">
              <p className="zone-overline">Your strongest signals in this set</p>
              <h3>{tiedLeaders.length > 1 ? tiedLeaders.map((zone) => zone.name).join(' + ') : first.name}</h3>
              <p className="zone-results-intro">
                {tiedLeaders.length > 1
                  ? `Your top ${tiedLeaders.length} zones are tied in these answers. That can point to a useful blend to explore.`
                  : 'This was your leading zone, with the close signal shown below. Treat the pattern as a starting point for reflection, not a fixed identity.'}
              </p>

              <div className="zone-highlight-grid" aria-label="Your lead and close zone card">
                {shareZones.map((zone, index) => (
                  <article key={zone.id} className="zone-highlight" style={{ borderColor: zone.color }}>
                    <div className="zone-highlight-header">
                      <span className="zone-highlight-rank">
                        {index === 0 ? '01 / LEAD SIGNAL' : '02 / CLOSE SIGNAL'}
                      </span>
                      {index < 2 ? (
                        <Suspense fallback={<span className="zone-emblem-placeholder" aria-hidden="true" />}>
                          <ZoneEmblem zoneId={zone.id} label={`3D symbol for Zone ${zone.id}: ${zone.name}`} />
                        </Suspense>
                      ) : null}
                    </div>
                    <h4>Zone {zone.id}: {zone.name}</h4>
                    <p>{zone.description}</p>
                    <span className="zone-signal">{zone.signal}</span>
                    <span className="zone-count">Chosen {zone.selected} of {zone.available} times it appeared</span>
                    <details className="zone-highlight-more">
                      <summary>Explore this zone <ChevronDown size={16} aria-hidden="true" /></summary>
                      <ZoneExplanation zone={zone} />
                    </details>
                  </article>
                ))}
              </div>

              <details className="zone-all-results">
                <summary>See all seven zones</summary>
                <div className="zone-score-list">
                  {rankedZones.map((zone) => (
                    <details className="zone-score-detail" key={zone.id}>
                      <summary className="zone-score-row">
                        <span>Zone {zone.id} · {zone.name}</span>
                        <span>{zone.selected} / {zone.available}</span>
                        <span className="zone-score-track"><span style={{ width: (zone.selected / zone.available) * 100 + '%', backgroundColor: zone.color }} /></span>
                        <ChevronDown className="zone-score-chevron" size={16} aria-hidden="true" />
                      </summary>
                      <ZoneExplanation zone={zone} />
                    </details>
                  ))}
                </div>
              </details>

              <div className="zone-reflection">
                <span className="zone-overline">Make the result real</span>
                <p>Can you name two moments when you contributed this way and someone valued the result? What did you do, and what part gave you energy?</p>
              </div>

              <div className="zone-question-footer zone-result-actions">
                <button className="zone-button zone-button-quiet" type="button" onClick={copyResult}>
                  <Copy size={15} aria-hidden="true" /> {copied ? 'Copied' : 'Copy my result'}
                </button>
                <button className="zone-button zone-button-quiet" type="button" onClick={() => void copyShareLink()}>
                  <Copy size={15} aria-hidden="true" /> {linkCopied ? 'Link copied' : 'Copy link'}
                </button>
                <button className="zone-button zone-button-primary" type="button" onClick={() => void shareResult()}>
                  <Share2 size={15} aria-hidden="true" /> Share result
                </button>
                <button className="zone-button zone-button-primary" type="button" onClick={startQuiz}>
                  <RotateCcw size={15} aria-hidden="true" /> Start again
                </button>
              </div>
              <p className="zone-share-status" role="status" aria-live="polite">{shareStatus}</p>
            </div>
          ) : null}
        </div>

        {mode !== 'results' ? <ZoneGuide /> : null}

        <p className="zone-source-note">
          These seven zones are adapted from Ian Goh’s “Finding Your Passion” framework. This is a reflection exercise, not a scientific or psychological test.
        </p>
      </div>
    </section>
  )
}
