import { useState } from 'react'
import { useApp, ARTICLES } from '../context/AppContext'
import { formatHeaderDate } from '../utils/dateUtils'
import { getCycleState, CyclePhase, PHASE_DEFINITIONS } from '../utils/cycleEngine'

type Tab = 'home' | 'calendar' | 'log' | 'insights'
export type PhaseKey = CyclePhase

interface PhaseDetail {
  key: PhaseKey
  name: string
  dateRange: string
  days: string
  color: string
  whyItHappens: string
  symptoms: string[]
}

export const PHASES_DATA: Record<PhaseKey, PhaseDetail> = {
  Menstrual: {
    key: 'Menstrual',
    name: 'Menstrual phase',
    dateRange: 'Sep 1–Sep 5',
    days: '1-5',
    color: '#C86D6B',
    whyItHappens: 'Rest & uterine shedding, low estrogen/progesterone.',
    symptoms: [
      "Cramps and lower back pain from uterine contractions",
      "Fatigue and lower energy levels",
      "Brain fog or difficulty concentrating"
    ]
  },
  Follicular: {
    key: 'Follicular',
    name: 'Follicular phase',
    dateRange: 'Sep 6–Sep 13',
    days: '6-13',
    color: '#8BAA9B',
    whyItHappens: 'Rising estradiol, boosted energy, follicular development.',
    symptoms: [
      "Increased energy and improved mood",
      "Clearer skin and healthy glow",
      "Higher libido and motivation"
    ]
  },
  Ovulation: {
    key: 'Ovulation',
    name: 'Ovulation',
    dateRange: 'Sep 14–Sep 15',
    days: '14-15',
    color: '#E2A966',
    whyItHappens: 'LH surge, peak estrogen, optimal fertile window.',
    symptoms: [
      "Peak energy and confidence",
      "Mild pelvic twinges (mittelschmerz)",
      "Increased cervical fluid"
    ]
  },
  Luteal: {
    key: 'Luteal',
    name: 'Luteal phase',
    dateRange: 'Sep 16–Sep 28',
    days: '16-28',
    color: '#B39ABF',
    whyItHappens: 'Elevated progesterone, metabolic elevation, potential PMS changes.',
    symptoms: [
      "Bloating and breast tenderness due to water retention",
      "Mood swings, irritability, or increased anxiety",
      "Cravings for carbohydrate-rich or sweet foods",
      "Lower energy levels and disturbed sleep patterns"
    ]
  }
}

export const COMMON_DESCRIPTIONS: Record<PhaseKey, string[]> = {
  period: [
    'Estrogen and progesterone are at their lowest, which can leave you feeling low on energy.',
    'Cramping and lower back pain are common as the uterus sheds its lining.',
    'Your mood may dip alongside the hormone drop.',
    'Headaches and fatigue can show up in the first few days.',
  ],
  follicular: [
    'With estrogen rising, you might feel more energetic, social, and clear-headed.',
    'Your sex drive may increase naturally.',
    'You might feel more motivated or confident.',
    'Cervical fluid changes to a clear, stretchy consistency preparing for ovulation.',
  ],
  ovulation: [
    'A surge in LH triggers the release of an egg — your most fertile window.',
    'Some people notice a mild, one-sided pelvic twinge (mittelschmerz).',
    'Cervical fluid is clear and stretchy, and libido often peaks.',
    'Body temperature rises slightly right after ovulation occurs.',
  ],
  luteal: [
    'Progesterone rises then falls sharply if pregnancy doesn’t occur, bringing on PMS symptoms.',
    'Bloating and breast tenderness are common in the back half of this phase.',
    'Mood swings, irritability, or food cravings may show up as hormones shift.',
    'Energy often dips as your period approaches.',
  ],
}

const QUICK_SYMPTOMS_CONFIG = [
  {
    id: 'cramps',
    label: 'Cramps',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12c.6 0 1.2-.2 1.7-.6l3.6-2.8c1-.8 2.4-.8 3.4 0l3.6 2.8c1 .8 2.4.8 3.4 0l3.6-2.8c.5-.4 1.1-.6 1.7-.6" />
        <path d="M2 17c.6 0 1.2-.2 1.7-.6l3.6-2.8c1-.8 2.4-.8 3.4 0l3.6 2.8c1 .8 2.4.8 3.4 0l3.6-2.8c.5-.4 1.1-.6 1.7-.6" />
      </svg>
    ),
  },
  {
    id: 'bloating',
    label: 'Bloating',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="7" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
      </svg>
    ),
  },
  {
    id: 'headache',
    label: 'Headache',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    id: 'tired',
    label: 'Tired',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
  {
    id: 'energized',
    label: 'Energized',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v3m0 12v3M3 12h3m12 0h3m-3.5-6.5l-2 2m-7 7l-2 2m11 0l-2-2m-7-7l-2-2" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    id: 'tender',
    label: 'Tender',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
]

export default function HomeScreen({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const { setIsChatOpen, setSelectedArticle, showToast, restartOnboarding, lastPeriodStartDate } = useApp()
  const [activeSymptoms, setActiveSymptoms] = useState<string[]>([])
    const cycleStatus = getCycleState(lastPeriodStartDate, 28, new Date())
  const [selectedPhase, setSelectedPhase] = useState<PhaseKey>(cycleStatus.phase.name)
  const [isInsightExpanded, setIsInsightExpanded] = useState(false)
  

  const selectedPhaseData = PHASES_DATA[selectedPhase]

  const toggleSymptom = (id: string) => {
    setActiveSymptoms(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const openLutealArticle = () => {
    setSelectedArticle(ARTICLES[0])
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#FDF6F0', position: 'relative' }}>
      
      {/* SECTION 1: HEADER */}
      <div style={{ padding: '8px 24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ margin: 0, fontSize: 13, color: '#B89AA8', fontWeight: 400 }}>Good morning,</p>
            <h1 style={{ margin: '2px 0 0', fontSize: 24, fontFamily: 'Fraunces, Georgia, serif', fontWeight: 400, color: '#2D1820', lineHeight: 1.2 }}>
              Sofia
            </h1>
          </div>

          {/* Action Icons: Vector Female Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Vector-Style Illustrated Female Avatar */}
            <button
              aria-label="Profile settings"
              onClick={() => {
                showToast('Re-entering Poppy onboarding flow...')
                restartOnboarding()
              }}
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #F2D5D0, #E8B87A)',
                  border: '2px solid #F8C8DC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(231,86,80,0.2)',
                }}
              >
                <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="14" r="7" fill="#7A4F5C" />
                  <path d="M18 7C14 7 12 10 12 13C12 15 13 17 14.5 18C13.5 19 11 21 10 24C9 27 10 32 18 32C26 32 27 27 26 24C25 21 22.5 19 21.5 18C23 17 24 15 24 13C24 10 22 7 18 7Z" fill="#2D1820" fillOpacity="0.8" />
                  <ellipse cx="18" cy="14" rx="5" ry="5.5" fill="#FFE2D6" />
                  <path d="M14 11C15 9.5 17 9 18 9C19 9 21 9.5 22 11" stroke="#2D1820" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M11 26C11 22 14 21 18 21C22 21 25 22 25 26V30H11V26Z" fill="#F8C8DC" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* REFACTORED CYCLE DIAL & RING COMPONENT */}
      <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{
            position: 'relative',
            width: 220,
            height: 220,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setSelectedPhase('Luteal')}
          role="button"
          aria-label="Interactive cycle ring dial"
        >
          <svg width="220" height="220" viewBox="0 0 220 220">
            {/* Base Ring Track (Broader 14px stroke) */}
            <circle cx="110" cy="110" r="86" fill="none" stroke="#E8D0C8" strokeWidth="14" />

            {/* Menstrual Phase Arc (Days 1–5: ~17.8%) */}
            <circle
              cx="110"
              cy="110"
              r="86"
              fill="none"
              stroke="#C86D6B"
              strokeWidth={selectedPhase === 'period' ? 18 : 14}
              strokeLinecap="round"
              strokeDasharray="96.5 443.9"
              strokeDashoffset="0"
              transform="rotate(-90 110 110)"
              onClick={(e) => { e.stopPropagation(); setSelectedPhase('Menstrual'); }}
              style={{ cursor: 'pointer', transition: 'stroke-width 0.2s ease' }}
            />

            {/* Follicular Phase Arc (Days 6–13: ~28.6%) */}
            <circle
              cx="110"
              cy="110"
              r="86"
              fill="none"
              stroke="#8BAA9B"
              strokeWidth={selectedPhase === 'follicular' ? 18 : 14}
              strokeLinecap="round"
              strokeDasharray="154.5 385.9"
              strokeDashoffset="-96.5"
              transform="rotate(-90 110 110)"
              onClick={(e) => { e.stopPropagation(); setSelectedPhase('Follicular'); }}
              style={{ cursor: 'pointer', transition: 'stroke-width 0.2s ease' }}
            />

            {/* Ovulation Phase Arc (Days 14–16: ~10.7%) */}
            <circle
              cx="110"
              cy="110"
              r="86"
              fill="none"
              stroke="#E2A966"
              strokeWidth={selectedPhase === 'ovulation' ? 18 : 14}
              strokeLinecap="round"
              strokeDasharray="57.8 482.6"
              strokeDashoffset="-251.0"
              transform="rotate(-90 110 110)"
              onClick={(e) => { e.stopPropagation(); setSelectedPhase('Ovulation'); }}
              style={{ cursor: 'pointer', transition: 'stroke-width 0.2s ease' }}
            />

            {/* Luteal Phase Arc (Days 17–28: ~42.9%) */}
            <circle
              cx="110"
              cy="110"
              r="86"
              fill="none"
              stroke="#B39ABF"
              strokeWidth={selectedPhase === 'luteal' ? 18 : 14}
              strokeLinecap="round"
              strokeDasharray="231.6 308.8"
              strokeDashoffset="-308.8"
              transform="rotate(-90 110 110)"
              onClick={(e) => { e.stopPropagation(); setSelectedPhase('Luteal'); }}
              style={{ cursor: 'pointer', transition: 'stroke-width 0.2s ease' }}
            />

            {/* Current Day Marker Dot (Day 18) */}
            <circle
              cx="110"
              cy="24"
              r="7"
              fill="#F8C8DC"
              stroke="#2D1820"
              strokeWidth="2.5"
              transform="rotate(142 110 110)"
            />
          </svg>

          {/* Central Typography Hierarchy (Ensured internal padding so no text touches stroke) */}
          <div
            style={{
              position: 'absolute',
              inset: 22,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '0 12px',
              pointerEvents: 'none',
            }}
          >
            {/* Top Line: Dynamically Formatted Date */}
            <span style={{ fontSize: 13, fontWeight: 500, color: '#7A4F5C', letterSpacing: 0.2 }}>
              {formatHeaderDate(new Date())}
            </span>

            {/* Primary Highlight: Dynamic Days until next period */}
            <span style={{ fontSize: 17, fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700, color: '#2D1820', lineHeight: 1.25, margin: '4px 0' }}>
              {cycleStatus.daysUntilNextPeriod} days until your next period
            </span>

            {/* Bottom Line: Active Phase Text */}
            <span style={{ fontSize: 13, fontWeight: 600, color: cycleStatus.phase.color, letterSpacing: '0.02em', textTransform: 'capitalize', marginTop: 4 }}>
              {cycleStatus.phase.name} phase
            </span>
          </div>
        </div>
          {/* Cycle Ring Legend */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
            {[
              { key: 'Menstrual', label: 'Menstrual', color: '#C86D6B' },
              { key: 'Follicular', label: 'Follicular', color: '#8BAA9B' },
              { key: 'Ovulation', label: 'Ovulation', color: '#E2A966' },
              { key: 'Luteal', label: 'Luteal', color: '#B39ABF' }
            ].map(phase => (
              <div key={phase.key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: phase.color }} />
                <span style={{ fontSize: 11, color: '#7A4F5C', fontWeight: 500 }}>{phase.label}</span>
              </div>
            ))}
          </div>
      </div>

      {/* QUICK SYMPTOMS LOG */}
      <div style={{ padding: '0 24px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#2D1820' }}>Tap to log quick symptoms</h3>
          <button
            onClick={() => onNavigate('log')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 12,
              color: '#9B3856',
              fontWeight: 500,
              cursor: 'pointer',
              padding: 0,
              minWidth: 44,
              minHeight: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            Full log →
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {QUICK_SYMPTOMS_CONFIG.map(s => {
            const isActive = activeSymptoms.includes(s.id)
            return (
              <button
                key={s.id}
                onClick={() => toggleSymptom(s.id)}
                aria-label={`Toggle symptom ${s.label}`}
                style={{
                  borderRadius: 12,
                  padding: '10px 8px',
                  background: isActive ? '#F8C8DC' : '#F7EDE8',
                  border: `1px solid ${isActive ? '#F8C8DC' : '#E8D0C8'}`,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  minHeight: 44,
                  color: isActive ? '#2D1820' : '#7A4F5C',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {s.icon}
                </div>
                <span style={{ fontSize: 11, fontWeight: 500, color: isActive ? '#2D1820' : '#7A4F5C' }}>
                  {s.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* UPCOMING PHASES */}
      <div style={{ padding: '0 24px 32px' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: '#2D1820' }}>Upcoming Phases</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(() => {
            // Calculate next sequential phases chronologically relative to currentCycleDay
            const phaseOrder: CyclePhase[] = ['Menstrual', 'Follicular', 'Ovulation', 'Luteal'];
            const currentIndex = phaseOrder.indexOf(cycleStatus.phase.name);
            const upcoming: { label: string, color: string, date: string }[] = [];
            
            for (let i = 1; i <= 3; i++) {
              const nextPhaseName = phaseOrder[(currentIndex + i) % 4];
              const nextPhaseDef = PHASE_DEFINITIONS[nextPhaseName];
              
              // Find days until this phase starts
              let daysUntilNextStart = 0;
              if (nextPhaseDef.startDay > cycleStatus.currentCycleDay) {
                daysUntilNextStart = nextPhaseDef.startDay - cycleStatus.currentCycleDay;
              } else {
                daysUntilNextStart = (28 - cycleStatus.currentCycleDay) + nextPhaseDef.startDay;
              }
              
              const startDate = new Date();
              startDate.setDate(startDate.getDate() + daysUntilNextStart);
              const startDateStr = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(startDate);
              
              upcoming.push({
                label: nextPhaseName + ' phase',
                color: nextPhaseDef.color,
                date: `Starts ${startDateStr}`
              });
            }
            
            return upcoming.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: '#F7EDE8',
                  borderRadius: 12,
                  border: '1px solid #E8D0C8',
                  minHeight: 44,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: '#2D1820', fontWeight: 500 }}>{item.label}</span>
                </div>
                <span style={{ fontSize: 12, color: '#7A4F5C', fontWeight: 500 }}>{item.date}</span>
              </div>
            ));
          })()}
        </div>
      </div>

{/* PHASE INSIGHT CARD */}
      <div style={{ padding: '0 24px 16px' }}>
        <div
          style={{
            background: '#F7EDE8',
            borderRadius: 16,
            padding: '14px 16px',
            border: '1px solid #E8D0C8',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <span style={{ fontSize: 20 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9B3856" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#9B3856' }}>
                {selectedPhaseData.name} insight
              </p>
              <p
                style={{
                  margin: '3px 0 0',
                  fontSize: 12,
                  color: '#7A4F5C',
                  lineHeight: 1.5,
                }}
              >
                {selectedPhaseData.whyItHappens}
              </p>
            </div>
          </div>

          {isInsightExpanded && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 4, marginTop: 4 }}>
              {selectedPhaseData.symptoms.map((sentence, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#9B3856', fontSize: 14, lineHeight: 1.5 }}>•</span>
                  <p style={{ margin: 0, fontSize: 12, color: '#7A4F5C', lineHeight: 1.5 }}>
                    {sentence}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 2 }}>
            <button
              onClick={() => setIsInsightExpanded(prev => !prev)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 12,
                color: '#9B3856',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '4px 8px',
                margin: '-4px -8px',
                minHeight: 44,
              }}
            >
              {isInsightExpanded ? 'See less' : 'See more'}
            </button>
            {isInsightExpanded && (
              <button
                onClick={() => onNavigate('insights')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 12,
                  color: '#9B3856',
                  fontWeight: 600,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  margin: '-4px -8px',
                  minHeight: 44,
                }}
              >
                Learn more →
              </button>
            )}
          </div>
        </div>
      </div>

          </div>
  )
}
