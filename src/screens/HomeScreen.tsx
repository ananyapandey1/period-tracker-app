import { useState } from 'react'
import { useApp, ARTICLES } from '../context/AppContext'

type Tab = 'home' | 'calendar' | 'log' | 'insights' | 'shop'
type PhaseKey = 'period' | 'follicular' | 'ovulation' | 'luteal'

interface PhaseDetail {
  key: PhaseKey
  name: string
  dateRange: string
  days: string
  color: string
  hormones: string
  insightSnippet: string
}

const PHASES_DATA: Record<PhaseKey, PhaseDetail> = {
  period: {
    key: 'period',
    name: 'Menstrual phase',
    dateRange: 'Sep 1 – Sep 5',
    days: 'Days 1–5',
    color: '#D4807A',
    hormones: 'Estrogen and progesterone are at their lowest. The uterine lining sheds.',
    insightSnippet: 'Estrogen and progesterone are at their lowest. Rest when needed, stay warm, and focus on gentle recovery.',
  },
  follicular: {
    key: 'follicular',
    name: 'Follicular phase',
    dateRange: 'Sep 6 – Sep 13',
    days: 'Days 6–13',
    color: '#A8C5B5',
    hormones: 'FSH stimulates ovarian follicles; estrogen rises steadily.',
    insightSnippet: 'Estrogen is climbing steadily. Expect rising stamina, clearer focus, and increasing energy for new activities.',
  },
  ovulation: {
    key: 'ovulation',
    name: 'Ovulation phase',
    dateRange: 'Sep 14 – Sep 16',
    days: 'Days 14–16',
    color: '#E8B87A',
    hormones: 'LH surge triggers egg release; estrogen peaks before ovulation.',
    insightSnippet: 'Luteinizing hormone surges to release an egg. Energy and fertility reach their monthly peak.',
  },
  luteal: {
    key: 'luteal',
    name: 'Luteal phase',
    dateRange: 'Sep 17 – Sep 28',
    days: 'Days 17–28',
    color: '#C4A5C8',
    hormones: 'Corpus luteum secretes progesterone, which rises then drops if no pregnancy occurs.',
    insightSnippet: 'Progesterone peaks then drops if conception has not occurred. You may feel more introspective as your period approaches.',
  },
}

const COMMON_DESCRIPTIONS: Record<PhaseKey, string[]> = {
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
        <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
        <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
        <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
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
        <path d="M12 2a7 7 0 0 0-7 7c0 4.5 7 13 7 13s7-8.5 7-13a7 7 0 0 0-7-7z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
  },
]

export default function HomeScreen({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const { setIsChatOpen, setSelectedArticle, showToast } = useApp()
  const [activeSymptoms, setActiveSymptoms] = useState<string[]>([])
  const [selectedPhase, setSelectedPhase] = useState<PhaseKey>('luteal')
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

          {/* Action Icons: Support Chat -> Rewards -> Vector Female Avatar */}
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

            {/* Rewards Icon Button */}
            <button
              onClick={() => showToast('🎉 Rewards: You have 150 Nua Wellness points!')}
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
              onClick={() => showToast('Profile settings loaded')}
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
                  border: '2px solid #e75650',
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
                  <path d="M11 26C11 22 14 21 18 21C22 21 25 22 25 26V30H11V26Z" fill="#e75650" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* REFACTORED CYCLE DIAL & RING COMPONENT */}
      <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'center' }}>
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
          onClick={() => setSelectedPhase('luteal')}
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
              stroke="#D4807A"
              strokeWidth={selectedPhase === 'period' ? 18 : 14}
              strokeLinecap="round"
              strokeDasharray="96.5 443.9"
              strokeDashoffset="0"
              transform="rotate(-90 110 110)"
              onClick={(e) => { e.stopPropagation(); setSelectedPhase('period'); }}
              style={{ cursor: 'pointer', transition: 'stroke-width 0.2s ease' }}
            />

            {/* Follicular Phase Arc (Days 6–13: ~28.6%) */}
            <circle
              cx="110"
              cy="110"
              r="86"
              fill="none"
              stroke="#A8C5B5"
              strokeWidth={selectedPhase === 'follicular' ? 18 : 14}
              strokeLinecap="round"
              strokeDasharray="154.5 385.9"
              strokeDashoffset="-96.5"
              transform="rotate(-90 110 110)"
              onClick={(e) => { e.stopPropagation(); setSelectedPhase('follicular'); }}
              style={{ cursor: 'pointer', transition: 'stroke-width 0.2s ease' }}
            />

            {/* Ovulation Phase Arc (Days 14–16: ~10.7%) */}
            <circle
              cx="110"
              cy="110"
              r="86"
              fill="none"
              stroke="#E8B87A"
              strokeWidth={selectedPhase === 'ovulation' ? 18 : 14}
              strokeLinecap="round"
              strokeDasharray="57.8 482.6"
              strokeDashoffset="-251.0"
              transform="rotate(-90 110 110)"
              onClick={(e) => { e.stopPropagation(); setSelectedPhase('ovulation'); }}
              style={{ cursor: 'pointer', transition: 'stroke-width 0.2s ease' }}
            />

            {/* Luteal Phase Arc (Days 17–28: ~42.9%) */}
            <circle
              cx="110"
              cy="110"
              r="86"
              fill="none"
              stroke="#C4A5C8"
              strokeWidth={selectedPhase === 'luteal' ? 18 : 14}
              strokeLinecap="round"
              strokeDasharray="231.6 308.8"
              strokeDashoffset="-308.8"
              transform="rotate(-90 110 110)"
              onClick={(e) => { e.stopPropagation(); setSelectedPhase('luteal'); }}
              style={{ cursor: 'pointer', transition: 'stroke-width 0.2s ease' }}
            />

            {/* Current Day Marker Dot (Day 18) */}
            <circle
              cx="110"
              cy="24"
              r="7"
              fill="#e75650"
              stroke="white"
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
            {/* Top Line: Formatted Date */}
            <span style={{ fontSize: 13, fontWeight: 500, color: '#7A4F5C', letterSpacing: 0.2 }}>
              18 September
            </span>

            {/* Primary Highlight: Days until next period */}
            <span style={{ fontSize: 17, fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700, color: '#2D1820', lineHeight: 1.25, margin: '4px 0' }}>
              12 days until your next period
            </span>

            {/* Bottom Line: Active Phase Pill */}
            <div style={{ background: '#F7EDE8', border: '1px solid #E8D0C8', borderRadius: 12, padding: '3px 10px', marginTop: 2 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#e75650' }}>
                {selectedPhaseData.name}
              </span>
            </div>
          </div>
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
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <span style={{ fontSize: 20 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e75650" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#e75650' }}>
                {selectedPhaseData.name} insight
              </p>
              <p
                style={{
                  margin: '3px 0 0',
                  fontSize: 12,
                  color: '#7A4F5C',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: isInsightExpanded ? 'none' : 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {selectedPhaseData.insightSnippet}
                {isInsightExpanded && (
                  <span>
                    {' '}{selectedPhaseData.hormones}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 2 }}>
            <button
              onClick={() => setIsInsightExpanded(prev => !prev)}
              aria-label="Toggle full insight description"
              style={{
                background: 'none',
                border: 'none',
                fontSize: 12,
                color: '#e75650',
                fontWeight: 500,
                cursor: 'pointer',
                padding: '4px 8px',
                margin: '-4px -8px',
                minWidth: 44,
                minHeight: 44,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isInsightExpanded ? 'Show less ↑' : 'View more →'}
            </button>
          </div>
        </div>
      </div>

      {/* REFACTORED COMMON EXPERIENCES SECTION */}
      <div style={{ padding: '0 24px 20px' }}>
        <h3 style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 600, color: '#2D1820', letterSpacing: 0.2 }}>
          Common experiences in {selectedPhaseData.name.replace(' phase', '')} phase
        </h3>

        {/* Vertical Bullet List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 4 }}>
          {COMMON_DESCRIPTIONS[selectedPhase].map((sentence, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <span style={{ color: '#e75650', fontSize: 14, lineHeight: 1.5 }}>•</span>
              <p style={{ margin: 0, fontSize: 12, color: '#7A4F5C', lineHeight: 1.5 }}>
                {sentence}
              </p>
            </div>
          ))}
        </div>

        {/* Updated Click Handler: Routes to Dedicated Luteal Phase Article */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 10 }}>
          <button
            onClick={openLutealArticle}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 12,
              color: '#e75650',
              fontWeight: 600,
              cursor: 'pointer',
              padding: 0,
              minHeight: 44,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            Read: Understanding Your Luteal Phase →
          </button>
        </div>
      </div>

      {/* QUICK SYMPTOMS LOG */}
      <div style={{ padding: '0 24px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#2D1820' }}>Quick log</h3>
          <button
            onClick={() => onNavigate('log')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 12,
              color: '#e75650',
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
                  background: isActive ? '#e75650' : '#F7EDE8',
                  border: `1px solid ${isActive ? '#b03e3a' : '#E8D0C8'}`,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  minHeight: 44,
                  color: isActive ? 'white' : '#7A4F5C',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {s.icon}
                </div>
                <span style={{ fontSize: 11, fontWeight: 500, color: isActive ? 'white' : '#7A4F5C' }}>
                  {s.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* UPCOMING EVENTS */}
      <div style={{ padding: '0 24px 32px' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: '#2D1820' }}>Upcoming</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: 'Fertile window', date: 'Sep 27–Oct 1', color: '#E8B87A' },
            { label: 'Period expected', date: 'Oct 27', color: '#D4807A' },
            { label: 'Ovulation day', date: 'Sep 29', color: '#A8C5B5' },
          ].map((item, i) => (
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
          ))}
        </div>
      </div>

    </div>
  )
}
