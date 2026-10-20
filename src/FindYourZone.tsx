import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Copy, RotateCcw, Sparkles } from 'lucide-react'
import './FindYourZone.css'

type ZoneId = 1 | 2 | 3 | 4 | 5 | 6 | 7

type Zone = {
  id: ZoneId
  name: string
  description: string
  signal: string
  color: string
}

type Question = {
  prompt: string
  options: Array<{ zone: ZoneId; label: string }>
}

const zones: Zone[] = [
  {
    id: 1,
    name: 'Uncover the unknown',
    description: 'You make value by exploring questions, finding patterns, and making the unclear easier to understand.',
    signal: 'Research · discovery · big-picture thinking',
    color: '#58E6FF',
  },
  {
    id: 2,
    name: 'Execute masterfully',
    description: 'You make value by taking responsibility for the work and carrying it through with care and precision.',
    signal: 'Craft · follow-through · operational focus',
    color: '#D9FF4A',
  },
  {
    id: 3,
    name: 'Impart knowledge',
    description: 'You make value by turning what you know into clear, structured explanations that help others understand.',
    signal: 'Teaching · clarity · shared understanding',
    color: '#C68CFF',
  },
  {
    id: 4,
    name: 'Empower people',
    description: 'You make value by encouraging people, lifting their confidence, and helping them move forward together.',
    signal: 'Coaching · encouragement · facilitation',
    color: '#FF7A1A',
  },
  {
    id: 5,
    name: 'Manage resources',
    description: 'You make value by coordinating people, time, talent, and opportunities so they are used well.',
    signal: 'Coordination · stewardship · better allocation',
    color: '#E2B84D',
  },
  {
    id: 6,
    name: 'Build and create',
    description: 'You make value by bringing people and resources together to turn a vision into something real.',
    signal: 'Initiative · direction · making things happen',
    color: '#58E6FF',
  },
  {
    id: 7,
    name: 'Meet needs',
    description: 'You make value by noticing what is missing, easing a difficulty, and helping people or systems work better.',
    signal: 'Problem solving · practical care · closure',
    color: '#D9FF4A',
  },
]

const questions: Question[] = [
  {
    prompt: 'When a group faces something unfamiliar, which contribution have you been most proud to make?',
    options: [
      { zone: 1, label: 'Investigate the unknown until a clear explanation starts to emerge.' },
      { zone: 2, label: 'Take a defined task and carry it through carefully.' },
      { zone: 3, label: 'Make the facts and ideas easier for everyone to understand.' },
      { zone: 4, label: 'Help people regain confidence and move forward together.' },
    ],
  },
  {
    prompt: 'When a promising project loses momentum, what kind of contribution tends to be valued from you?',
    options: [
      { zone: 2, label: 'Step into the hands-on work and complete the parts that are still open.' },
      { zone: 3, label: 'Untangle the information and make the next steps clear.' },
      { zone: 4, label: 'Lift the mood and help the team believe progress is still possible.' },
      { zone: 5, label: 'Rebalance people, time, and tools around the work that matters most.' },
    ],
  },
  {
    prompt: 'You join a project with a worthwhile goal but no clear path. What feels most useful to take on?',
    options: [
      { zone: 3, label: 'Explain the problem and turn what is known into a clear guide.' },
      { zone: 4, label: 'Bring people into the conversation and help them feel able to contribute.' },
      { zone: 5, label: 'Coordinate the people and resources needed for steady progress.' },
      { zone: 6, label: 'Shape a direction, gather a team, and start building toward the goal.' },
    ],
  },
  {
    prompt: 'A plan is ambitious, but the team has limited time and capacity. Where do you naturally help?',
    options: [
      { zone: 4, label: 'Keep people encouraged and connected to why the work matters.' },
      { zone: 5, label: 'Make thoughtful trade-offs with the time, people, and tools available.' },
      { zone: 6, label: 'Set a decisive approach and delegate the work needed to reach the goal.' },
      { zone: 7, label: 'Find the biggest obstacle and remove the thing holding everyone back.' },
    ],
  },
  {
    prompt: 'After delivering something useful, which next contribution would you most want to make?',
    options: [
      { zone: 5, label: 'Make sure the resources behind it are cared for and used well.' },
      { zone: 6, label: 'Build the next version or bring a new idea into reality.' },
      { zone: 7, label: 'Address the remaining need or difficulty people are still facing.' },
      { zone: 1, label: 'Explore why it worked and what the result reveals.' },
    ],
  },
  {
    prompt: 'When someone thanks you for a contribution, which reason sounds most familiar?',
    options: [
      { zone: 6, label: 'You brought people together and moved an important goal forward.' },
      { zone: 7, label: 'You noticed a problem and made life easier for someone.' },
      { zone: 1, label: 'You helped us see what was happening and why.' },
      { zone: 2, label: 'You took ownership and made sure the job was done properly.' },
    ],
  },
  {
    prompt: 'When the same problem keeps appearing, what kind of contribution feels most satisfying?',
    options: [
      { zone: 7, label: 'Find the unmet need and do something practical to address it.' },
      { zone: 1, label: 'Trace the pattern back to its cause and understand it more deeply.' },
      { zone: 2, label: 'Tighten the process so the work is completed reliably each time.' },
      { zone: 3, label: 'Explain the pattern so other people can recognize and handle it.' },
    ],
  },
  {
    prompt: 'Think of a time you helped someone learn. Which part did you most enjoy?',
    options: [
      { zone: 1, label: 'Explore the principles behind the subject before drawing conclusions.' },
      { zone: 2, label: 'Demonstrate the steps and help them practise until they can do it.' },
      { zone: 3, label: 'Build a clear, structured explanation that makes the subject click.' },
      { zone: 4, label: 'Encourage their confidence and make it safe to ask questions.' },
    ],
  },
  {
    prompt: 'A group is overwhelmed before a deadline. What would feel like your best contribution?',
    options: [
      { zone: 2, label: 'Take on important tasks and finish them to a high standard.' },
      { zone: 3, label: 'Sort the information so everyone understands what matters now.' },
      { zone: 4, label: 'Help people feel supported and focused instead of defeated.' },
      { zone: 5, label: 'Reorganize the workload so the available time and skills go further.' },
    ],
  },
  {
    prompt: 'An idea has support but no clear owner. Which responsibility would you choose?',
    options: [
      { zone: 3, label: 'Help everyone understand the idea and how it could work.' },
      { zone: 4, label: 'Bring the right people together and invite them into the effort.' },
      { zone: 5, label: 'Coordinate the people, time, and opportunities it will need.' },
      { zone: 6, label: 'Own the direction, make the calls, and turn the idea into a working project.' },
    ],
  },
  {
    prompt: 'A service keeps failing people in predictable ways. Where would you want to contribute?',
    options: [
      { zone: 4, label: 'Support the people delivering it so they can serve others with confidence.' },
      { zone: 5, label: 'Assign clear owners and resources to the parts that need attention.' },
      { zone: 6, label: 'Mobilize a team to redesign the service and make the change happen.' },
      { zone: 7, label: 'Focus on the unmet need and remove the difficulty people keep encountering.' },
    ],
  },
  {
    prompt: 'You have time for one meaningful contribution this week. Which outcome would you choose?',
    options: [
      { zone: 5, label: 'Use the team’s time and abilities in a way that creates more value.' },
      { zone: 6, label: 'Start or build something that moves a larger goal forward.' },
      { zone: 7, label: 'Relieve a practical pain point for someone who needs help.' },
      { zone: 1, label: 'Investigate a question that could change how the problem is understood.' },
    ],
  },
  {
    prompt: 'When people ask for your help, which request do you most enjoy saying yes to?',
    options: [
      { zone: 6, label: '“Can you help us choose a direction and get this moving?”' },
      { zone: 7, label: '“Can you help us fix what is getting in the way?”' },
      { zone: 1, label: '“Can you help us understand what is really going on?”' },
      { zone: 2, label: '“Can you take this on and make sure it gets done well?”' },
    ],
  },
  {
    prompt: 'Looking back at work people appreciated, which feedback feels closest to your experience?',
    options: [
      { zone: 7, label: '“You saw what was missing and did something about it.”' },
      { zone: 1, label: '“You helped us understand the pattern behind it.”' },
      { zone: 2, label: '“You followed through and made the result dependable.”' },
      { zone: 3, label: '“You explained it in a way that made sense to everyone.”' },
    ],
  },
  {
    prompt: 'For a solution to keep helping after you step away, what would you most want to make sure of?',
    options: [
      { zone: 1, label: 'The underlying idea is well understood and the reasoning holds up.' },
      { zone: 2, label: 'The method is reliable and the details are handled properly.' },
      { zone: 3, label: 'The knowledge is clearly documented and easy for others to learn.' },
      { zone: 4, label: 'People feel capable and supported enough to carry it forward.' },
    ],
  },
  {
    prompt: 'An opportunity comes with uncertainty and a small team. Which part would you take on?',
    options: [
      { zone: 2, label: 'Handle the practical work and make sure the essentials are covered.' },
      { zone: 3, label: 'Map what the team needs to know and make it understandable.' },
      { zone: 4, label: 'Help people find confidence and a shared reason to try.' },
      { zone: 5, label: 'Plan how to use the limited time, skills, and budget well.' },
    ],
  },
  {
    prompt: 'A community is growing quickly. What would you most like to help strengthen?',
    options: [
      { zone: 3, label: 'Teach shared practices so newcomers can understand and take part.' },
      { zone: 4, label: 'Welcome people, build confidence, and help them feel included.' },
      { zone: 5, label: 'Organize the people and opportunities so the community can grow well.' },
      { zone: 6, label: 'Build a team and structure that can carry the community into its next stage.' },
    ],
  },
  {
    prompt: 'You notice a person or a system is being held back. What do you most want to do?',
    options: [
      { zone: 4, label: 'Help the person regain confidence and see a way forward.' },
      { zone: 5, label: 'Put available support and resources where they can make the most difference.' },
      { zone: 6, label: 'Lead a change that brings people together around a better way.' },
      { zone: 7, label: 'Address the specific block or missing support that is causing the difficulty.' },
    ],
  },
  {
    prompt: 'After a successful launch, where would you most want to add value next?',
    options: [
      { zone: 5, label: 'Help the team scale its resources without wasting what it has built.' },
      { zone: 6, label: 'Create the next version and pursue the bigger opportunity.' },
      { zone: 7, label: 'Close the gaps people still report and make the experience more helpful.' },
      { zone: 1, label: 'Study what made the launch work and what remains unknown.' },
    ],
  },
  {
    prompt: 'Recall a moment when your contribution felt useful and appreciated. Which part would you like more of?',
    options: [
      { zone: 6, label: 'Taking a vision and turning it into something people can use.' },
      { zone: 7, label: 'Noticing a need and helping someone through a difficulty.' },
      { zone: 1, label: 'Making sense of an unanswered question or unfamiliar situation.' },
      { zone: 2, label: 'Doing careful work and knowing the details were right.' },
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

  const chooseAnswer = (zone: ZoneId) => {
    setAnswers((current) => current.map((answer, index) => (index === questionIndex ? zone : answer)))
    setCopied(false)
  }

  const startQuiz = () => {
    setQuestionIndex(0)
    setAnswers(Array(questions.length).fill(null))
    setCopied(false)
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

  return (
    <section id="find-your-zone" className="zone-section">
      <div className="zone-wrap">
        <div className="zone-heading-grid">
          <div>
            <p className="zone-kicker"><Sparkles size={15} aria-hidden="true" /> A reflection exercise</p>
            <h2>Find your zone</h2>
            <p className="zone-lead">
              Notice the kind of contribution you return to when your work matters and other people feel the benefit.
            </p>
          </div>
          <aside className="zone-note">
            <span>7 contribution zones</span>
            <strong>20 questions</strong>
            <p>Your answers stay in this page. We calculate the pattern in your browser and do not send or store your choices.</p>
          </aside>
        </div>

        <div className="zone-panel" aria-live="polite">
          {mode === 'intro' ? (
            <div className="zone-intro">
              <div>
                <p className="zone-overline">Start with a real memory</p>
                <h3>What kind of work feels like a meaningful contribution?</h3>
                <p>
                  Think about moments when you helped create value and someone else appreciated the result. Choose the
                  response that feels closest to what you actually did, not the one that sounds most impressive.
                </p>
              </div>
              <div className="zone-intro-bottom">
                <p>
                  This is a reflection tool, not a validated or definitive assessment. Use the result as a prompt, then
                  check it against your own experience.
                </p>
                <button className="zone-button zone-button-primary" type="button" onClick={startQuiz}>
                  Begin the questions <ArrowRight size={17} aria-hidden="true" />
                </button>
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

              <div className="zone-highlight-grid">
                {resultZones.map((zone, index) => (
                  <article key={zone.id} className="zone-highlight" style={{ borderColor: zone.color }}>
                    <span className="zone-highlight-rank">
                      {tiedLeaders.length > 1 ? 'TIED / LEAD SIGNAL' : index === 0 ? '01 / LEAD SIGNAL' : '02 / CLOSE SIGNAL'}
                    </span>
                    <h4>Zone {zone.id}: {zone.name}</h4>
                    <p>{zone.description}</p>
                    <span className="zone-signal">{zone.signal}</span>
                    <span className="zone-count">Chosen {zone.selected} of {zone.available} times it appeared</span>
                  </article>
                ))}
              </div>

              <details className="zone-all-results">
                <summary>See all seven zones</summary>
                <div className="zone-score-list">
                  {rankedZones.map((zone) => (
                    <div className="zone-score-row" key={zone.id}>
                      <span>Zone {zone.id} · {zone.name}</span>
                      <span>{zone.selected} / {zone.available}</span>
                      <span className="zone-score-track"><span style={{ width: (zone.selected / zone.available) * 100 + '%', backgroundColor: zone.color }} /></span>
                    </div>
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
                <button className="zone-button zone-button-primary" type="button" onClick={startQuiz}>
                  <RotateCcw size={15} aria-hidden="true" /> Start again
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <p className="zone-source-note">
          The seven zones are adapted from Ian Goh’s “Finding Your Passion” framework. The questions are prompts for self-reflection, not a validated psychological measure.
        </p>
      </div>
    </section>
  )
}
