import { useState, useRef, useEffect } from 'react'
import { useApp, ARTICLES } from '../context/AppContext'
import { formatHeaderDate } from '../utils/dateUtils'
import {
  getCycleState,
  CyclePhase,
  PHASE_COLORS,
  PHASE_CARD_DATA,
  PHASE_DEFINITIONS,
} from '../utils/cycleEngine'

type Tab = 'home' | 'calendar' | 'log' | 'insights'

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
  const { setIsChatOpen, setIsRewardsOpen, setIsProfileOpen, setSelectedArticle, showToast, restartOnboarding, lastPeriodStartDate } = useApp()
  const [activeSymptoms, setActiveSymptoms] = useState<string[]>([])
  const phaseCardRef = useRef<HTMLDivElement>(null)

  // P0: Single source of truth for all cycle and phase calculations
  const cycleStatus = getCycleState(lastPeriodStartDate, 28, new Date())
  const currentPhase = cycleStatus.phase.name

  // Issue 3: Explicit tap-to-view state. Default is null (today's actual phase)
  const [previewedPhase, setPreviewedPhase] = useState<CyclePhase | null>(null)

  // Issue 3: Always reset to today's phase on mount/return visits
  useEffect(() => {
    setPreviewedPhase(null)
  }, [])

  const activeDisplayPhase = previewedPhase ?? currentPhase
  const isPreviewing = previewedPhase !== null && previewedPhase !== currentPhase
  const phaseCardContent = PHASE_CARD_DATA[activeDisplayPhase]

  const handleSelectPhase = (phase: CyclePhase) => {
    setPreviewedPhase(phase)
    // Auto-scroll to the Phase card on tap
    if (phaseCardRef.current) {
      phaseCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }

  const toggleSymptom = (id: string) => {
    setActiveSymptoms(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const handleReadArticle = () => {
    const article = ARTICLES.find(a => a.id === phaseCardContent.articleId) || ARTICLES[0]
    setSelectedArticle(article)
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#FDF6F0', position: 'relative' }}>
      
      {/* SECTION 1: HEADER (Issue 4: Restored chat and gift icons alongside avatar) */}
      <div style={{ padding: '8px 24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ margin: 0, fontSize: 13, color: '#B89AA8', fontWeight: 400 }}>Good morning,</p>
            <h1 style={{ margin: '2px 0 0', fontSize: 24, fontFamily: 'Fraunces, Georgia, serif', fontWeight: 400, color: '#2D1820', lineHeight: 1.2 }}>
              Sofia
            </h1>
          </div>

          {/* Action Icons: Support Chat -> Rewards / Gift -> Vector Female Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Interactive Support Chat Button */}
            <button
              onClick={() => setIsChatOpen(true)}
              aria-label="Open AI support chat"
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#F7EDE8',
                border: '1px solid #E8D0C8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                boxShadow: '0 2px 8px rgba(45,24,32,0.06)',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e75650" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </button>

            {/* Rewards / Gift Icon Button */}
            <button
              onClick={() => setIsRewardsOpen(true)}
              aria-label="View rewards"
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#F7EDE8',
                border: '1px solid #E8D0C8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                boxShadow: '0 2px 8px rgba(45,24,32,0.06)',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7A4F5C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 12 20 22 4 22 4 12" />
                <rect x="2" y="7" width="20" height="5" rx="1" />
                <line x1="12" y1="22" x2="12" y2="7" />
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
              </svg>
            </button>

            {/* Vector-Style Illustrated Female Avatar */}
            <button
              aria-label="Profile settings"
              onClick={() => setIsProfileOpen(true)}
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

      {/* SECTION 2: CYCLE DIAL & RING COMPONENT (Issue 2 & Issue 3) */}
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
          onClick={() => setPreviewedPhase(null)}
          role="button"
          aria-label="Cycle ring dial. Tap center to return to today"
        >
          <svg width="220" height="220" viewBox="0 0 220 220">
            {/* Base Ring Track */}
            <circle cx="110" cy="110" r="86" fill="none" stroke="#E8D0C8" strokeWidth="14" />

            {/* Menstrual Phase Arc (Days 1 to 5) */}
            <circle
              cx="110"
              cy="110"
              r="86"
              fill="none"
              stroke={PHASE_COLORS.Menstrual}
              strokeWidth={activeDisplayPhase === 'Menstrual' ? 18 : 14}
              strokeLinecap="round"
              strokeDasharray="96.5 443.9"
              strokeDashoffset="0"
              transform="rotate(-90 110 110)"
              onClick={(e) => { e.stopPropagation(); handleSelectPhase('Menstrual'); }}
              style={{ cursor: 'pointer', transition: 'stroke-width 0.2s ease' }}
            />

            {/* Follicular Phase Arc (Days 6 to 13) */}
            <circle
              cx="110"
              cy="110"
              r="86"
              fill="none"
              stroke={PHASE_COLORS.Follicular}
              strokeWidth={activeDisplayPhase === 'Follicular' ? 18 : 14}
              strokeLinecap="round"
              strokeDasharray="154.5 385.9"
              strokeDashoffset="-96.5"
              transform="rotate(-90 110 110)"
              onClick={(e) => { e.stopPropagation(); handleSelectPhase('Follicular'); }}
              style={{ cursor: 'pointer', transition: 'stroke-width 0.2s ease' }}
            />

            {/* Ovulation Phase Arc (Days 14 to 15) */}
            <circle
              cx="110"
              cy="110"
              r="86"
              fill="none"
              stroke={PHASE_COLORS.Ovulation}
              strokeWidth={activeDisplayPhase === 'Ovulation' ? 18 : 14}
              strokeLinecap="round"
              strokeDasharray="57.8 482.6"
              strokeDashoffset="-251.0"
              transform="rotate(-90 110 110)"
              onClick={(e) => { e.stopPropagation(); handleSelectPhase('Ovulation'); }}
              style={{ cursor: 'pointer', transition: 'stroke-width 0.2s ease' }}
            />

            {/* Luteal Phase Arc (Days 16 to 28) */}
            <circle
              cx="110"
              cy="110"
              r="86"
              fill="none"
              stroke={PHASE_COLORS.Luteal}
              strokeWidth={activeDisplayPhase === 'Luteal' ? 18 : 14}
              strokeLinecap="round"
              strokeDasharray="231.6 308.8"
              strokeDashoffset="-308.8"
              transform="rotate(-90 110 110)"
              onClick={(e) => { e.stopPropagation(); handleSelectPhase('Luteal'); }}
              style={{ cursor: 'pointer', transition: 'stroke-width 0.2s ease' }}
            />

            {/* Current Day Marker Dot on Track (Issue 2: r=6, positioned cleanly on circumference) */}
            <circle
              cx="110"
              cy="24"
              r="6.5"
              fill="#F8C8DC"
              stroke="#2D1820"
              strokeWidth="2.5"
              transform={`rotate(${Math.round((cycleStatus.currentCycleDay / 28) * 360)} 110 110)`}
            />
          </svg>

          {/* Issue 2: Central Ring Typography with generous inset and Pill Badge */}
          <div
            style={{
              position: 'absolute',
              inset: 30,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '0 8px',
              pointerEvents: 'none',
            }}
          >
            {/* Top Line: Real-time dynamic date with ample margin from track */}
            <span style={{ fontSize: 12.5, fontWeight: 500, color: '#7A4F5C', letterSpacing: 0.2, margin: 0 }}>
              {formatHeaderDate(new Date())}
            </span>

            {/* Primary Highlight: Dynamic Days until next period from single source of truth */}
            <span style={{ fontSize: 16.5, fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700, color: '#2D1820', lineHeight: 1.22, margin: '4px 0 2px' }}>
              {cycleStatus.daysUntilNextPeriod} days until your next period
            </span>

            {/* Issue 2: Restored Pill Badge treatment for maximum legibility */}
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                color: cycleStatus.phase.color,
                background: PHASE_DEFINITIONS[cycleStatus.phase.name].lightBg,
                border: `1px solid ${cycleStatus.phase.color}35`,
                borderRadius: 16,
                padding: '3px 10px',
                letterSpacing: '0.02em',
                textTransform: 'capitalize',
                marginTop: 4,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                whiteSpace: 'nowrap',
                boxShadow: '0 1px 4px rgba(45,24,32,0.04)',
              }}
            >
              {cycleStatus.phase.name} phase
            </span>
          </div>
        </div>

        {/* Issue 1: UNIFORM SHAPE LEGEND (Solid circle dots for all items with matching shared tokens) */}
        <div
          role="region"
          aria-label="Cycle ring phase legend"
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'nowrap',
            gap: 8,
            marginTop: 14,
            width: '100%',
            padding: '0 8px',
          }}
        >
          {[
            { key: 'Menstrual' as CyclePhase, label: 'Menstrual', color: PHASE_COLORS.Menstrual },
            { key: 'Follicular' as CyclePhase, label: 'Follicular', color: PHASE_COLORS.Follicular },
            { key: 'Ovulation' as CyclePhase, label: 'Ovulation', color: PHASE_COLORS.Ovulation },
            { key: 'Luteal' as CyclePhase, label: 'Luteal', color: PHASE_COLORS.Luteal },
          ].map(phase => {
            const isSelected = activeDisplayPhase === phase.key
            return (
              <button
                key={phase.key}
                onClick={() => handleSelectPhase(phase.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4.5,
                  background: isSelected ? '#F2E8E2' : 'transparent',
                  border: isSelected ? '1px solid #E0CCC2' : '1px solid transparent',
                  padding: isSelected ? '2px 7px' : '2px 3px',
                  cursor: 'pointer',
                  borderRadius: 14,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}
                aria-label={`View ${phase.label} phase`}
              >
                {/* Uniform solid circular dot across all 4 items */}
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: phase.color,
                    flexShrink: 0,
                    boxShadow: isSelected ? `0 0 0 1.5px ${phase.color}44` : 'none',
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    color: isSelected ? '#2D1820' : '#7A4F5C',
                    fontWeight: isSelected ? 700 : 500,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {phase.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* SECTION 3: QUICK SYMPTOMS LOG */}
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

      {/* SECTION 4: UPCOMING PHASES */}
      <div style={{ padding: '0 24px 20px' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: '#2D1820' }}>Upcoming phases</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {cycleStatus.upcomingPhases.map((item, i) => (
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
                {/* Dot using exact shared color token from ring */}
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: item.color,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 13, color: '#2D1820', fontWeight: 500 }}>
                  {item.label}
                </span>
              </div>
              <span style={{ fontSize: 12, color: '#7A4F5C', fontWeight: 500 }}>
                {item.dateStr}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: CONSOLIDATED PHASE CARD (Issue 3: Ref attached, explicit preview state & return affordance) */}
      <div ref={phaseCardRef} style={{ padding: '0 24px 32px' }}>
        <div
          style={{
            background: '#F7EDE8',
            borderRadius: 16,
            padding: '16px 18px',
            border: isPreviewing ? `1.5px solid ${PHASE_COLORS[activeDisplayPhase]}` : '1px solid #E8D0C8',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            transition: 'border 0.2s ease',
          }}
        >
          {/* Issue 3: Explicit "Viewing another phase" indicator with clear "Back to today" action */}
          {isPreviewing && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#FFFDFB',
                border: `1px solid ${PHASE_COLORS[activeDisplayPhase]}55`,
                borderRadius: 10,
                padding: '6px 10px',
                margin: '-4px -2px 0',
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: PHASE_COLORS[activeDisplayPhase], letterSpacing: 0.3 }}>
                Viewing: {phaseCardContent.title} (Preview)
              </span>
              <button
                onClick={() => setPreviewedPhase(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#9B3856',
                  cursor: 'pointer',
                  padding: '2px 4px',
                  textDecoration: 'underline',
                }}
                aria-label="Return to today's phase view"
              >
                Back to today →
              </button>
            </div>
          )}

          {/* Internal Section 1: Phase Name & Plain-English Summary */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: PHASE_COLORS[activeDisplayPhase],
                  flexShrink: 0,
                }}
              />
              <h3
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontFamily: 'Fraunces, Georgia, serif',
                  fontWeight: 600,
                  color: '#2D1820',
                }}
              >
                {phaseCardContent.title}
              </h3>
            </div>
            <p
              style={{
                margin: '8px 0 0',
                fontSize: 12.5,
                color: '#7A4F5C',
                lineHeight: 1.5,
              }}
            >
              {phaseCardContent.summary}
            </p>
          </div>

          {/* Internal Section 2: "What you might feel" Symptom List */}
          <div style={{ borderTop: '1px solid #E8D0C8', paddingTop: 12 }}>
            <p
              style={{
                margin: '0 0 8px',
                fontSize: 12,
                fontWeight: 600,
                color: '#2D1820',
                letterSpacing: 0.2,
              }}
            >
              What you might feel
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {phaseCardContent.symptoms.map((symptom, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: PHASE_COLORS[activeDisplayPhase], fontSize: 13, lineHeight: 1.4 }}>•</span>
                  <p style={{ margin: 0, fontSize: 12, color: '#7A4F5C', lineHeight: 1.45 }}>
                    {symptom}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Internal Section 3: Read More Link */}
          <div style={{ borderTop: '1px solid #E8D0C8', paddingTop: 10, display: 'flex', justifyContent: 'flex-start' }}>
            <button
              onClick={handleReadArticle}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 12,
                color: '#9B3856',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '4px 0',
                minHeight: 40,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              {phaseCardContent.articleLinkText}
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
