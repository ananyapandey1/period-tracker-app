import React, { useState, useEffect } from 'react'
import { useApp, LogEntry } from '../context/AppContext'
import { getTodayDateString, parseDateString, formatHeaderDate } from '../utils/dateUtils'
const FLOW_OPTIONS = ['Light', 'Medium', 'Heavy', 'Spotting', 'None']
const PAIN_OPTIONS = ['None', 'Mild', 'Moderate', 'Severe']

const SYMPTOMS_PHYSICAL = [
  { id: 'cramps', label: 'Cramps', emoji: '😣' },
  { id: 'bloating', label: 'Bloating', emoji: '🎈' },
  { id: 'headache', label: 'Headache', emoji: '🤕' },
  { id: 'backpain', label: 'Back pain', emoji: '🦴' },
  { id: 'tender', label: 'Breast tender', emoji: '💗' },
  { id: 'acne', label: 'Acne', emoji: '🔴' },
  { id: 'tired', label: 'Fatigue', emoji: '🥱' },
  { id: 'nausea', label: 'Nausea', emoji: '🤢' },
]

const SYMPTOMS_EMOTIONAL = [
  { id: 'anxious', label: 'Anxious', emoji: '😰' },
  { id: 'irritable', label: 'Irritable', emoji: '😠' },
  { id: 'sad', label: 'Low mood', emoji: '😔' },
  { id: 'happy', label: 'Happy', emoji: '😊' },
  { id: 'calm', label: 'Calm', emoji: '😌' },
  { id: 'sensitive', label: 'Sensitive', emoji: '🥺' },
]

const ENERGY = ['Exhausted', 'Low', 'Moderate', 'High', 'Very high']
const ENERGY_EMOJIS = ['😴', '😑', '😐', '😊', '⚡']
const SLEEP = ['< 5 hrs', '5-6 hrs', '6-7 hrs', '7-8 hrs', '8+ hrs']
const PAIN_COLORS = ['#A8C5B5', '#E8B87A', '#D4807A', '#c43a35']

export default function LogScreen() {
  const { selectedDate, logEntries, saveLogEntry, setActiveTab } = useApp()

  const [flow, setFlow] = useState<string | null>(null)
  const [pain, setPain] = useState<string | null>(null)
  const [physical, setPhysical] = useState<string[]>([])
  const [emotional, setEmotional] = useState<string[]>([])
  const [energy, setEnergy] = useState<string | null>(null)
  const [sleep, setSleep] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)

  // Pre-populate state when selectedDate or logEntries change
  useEffect(() => {
    const existing = logEntries[selectedDate]
    if (existing) {
      setFlow(existing.flow)
      setPain(existing.pain)
      setPhysical(existing.physical || [])
      setEmotional(existing.emotional || [])
      setEnergy(existing.energy)
      setSleep(existing.sleep)
      setNotes(existing.notes || '')
    } else {
      setFlow(null)
      setPain(null)
      setPhysical([])
      setEmotional([])
      setEnergy(null)
      setSleep(null)
      setNotes('')
    }
  }, [selectedDate, logEntries])

  const toggleArr = (arr: string[], setArr: (v: string[]) => void, id: string) => {
    setArr(arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id])
  }

  const handleSave = () => {
    const entry: LogEntry = {
      date: selectedDate,
      flow,
      pain,
      physical,
      emotional,
      energy,
      sleep,
      notes,
    }
    saveLogEntry(entry)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const todayStr = getTodayDateString()
  const selectedDateObj = parseDateString(selectedDate)
  const isToday = selectedDate === todayStr

  // Clean, single-line dynamic date title (e.g. "Today, 27 September" or "16 September")
  const formattedHeaderDate = isToday
    ? `Today, ${formatHeaderDate(selectedDateObj)}`
    : selectedDateObj.getFullYear() !== new Date().getFullYear()
      ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(selectedDateObj)
      : formatHeaderDate(selectedDateObj)

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#FDF6F0', paddingBottom: 120 }}>
      {/* Streamlined Header with Back Button and Date */}
      <div style={{ padding: '12px 24px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <button
          onClick={() => setActiveTab('home')}
          aria-label="Go back"
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: '#F7EDE8',
            border: '1px solid #E8D0C8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            color: '#2D1820',
            flexShrink: 0,
            transition: 'background-color 0.15s ease',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2D1820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 12, color: '#B89AA8', fontWeight: 500, letterSpacing: '0.02em' }}>Logging for</p>
          <h2
            style={{
              margin: '2px 0 0',
              fontSize: 20,
              fontFamily: 'Fraunces, Georgia, serif',
              fontWeight: 400,
              color: '#2D1820',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {formattedHeaderDate}
          </h2>
        </div>
      </div>

      {/* Flow */}
      <Section title="Flow">
        <div style={{ display: 'flex', gap: 8 }}>
          {FLOW_OPTIONS.map(f => (
            <Chip key={f} label={f} active={flow === f} onClick={() => setFlow(f)} />
          ))}
        </div>
      </Section>

      {/* Pain */}
      <Section title="Pain level">
        <div style={{ display: 'flex', gap: 8 }}>
          {PAIN_OPTIONS.map((p, i) => (
            <div key={p} style={{ flex: 1 }}>
              <button
                type="button"
                onClick={() => setPain(p)}
                className="rounded-2xl transition-all duration-150"
                style={{
                  width: '100%',
                  padding: '10px 0',
                  borderRadius: 14,
                  background: pain === p ? PAIN_COLORS[i] : '#F7EDE8',
                  border: `1px solid ${pain === p ? 'transparent' : '#E8D0C8'}`,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: pain === p ? 'white' : '#7A4F5C',
                }}
              >
                {p}
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* Physical symptoms */}
      <Section title="Physical symptoms">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {SYMPTOMS_PHYSICAL.map(s => (
            <SymptomButton
              key={s.id}
              emoji={s.emoji}
              label={s.label}
              active={physical.includes(s.id)}
              onClick={() => toggleArr(physical, setPhysical, s.id)}
            />
          ))}
        </div>
      </Section>

      {/* Emotional */}
      <Section title="Emotions">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {SYMPTOMS_EMOTIONAL.map(s => (
            <SymptomButton
              key={s.id}
              emoji={s.emoji}
              label={s.label}
              active={emotional.includes(s.id)}
              onClick={() => toggleArr(emotional, setEmotional, s.id)}
            />
          ))}
        </div>
      </Section>

      {/* Energy */}
      <Section title="Energy">
        <div style={{ display: 'flex', gap: 8 }}>
          {ENERGY.map((e, i) => {
            const isSelected = energy === e
            return (
              <button
                key={e}
                type="button"
                onClick={() => setEnergy(e)}
                className="transition-all duration-150"
                style={{
                  flex: 1,
                  padding: '13px 4px 11px',
                  borderRadius: 18,
                  cursor: 'pointer',
                  border: `1.5px solid ${isSelected ? '#e75650' : '#ECD8D2'}`,
                  background: isSelected ? '#e75650' : '#F7EDE8',
                  fontSize: 11,
                  fontWeight: 600,
                  color: isSelected ? 'white' : '#6E4D58',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  minHeight: 76,
                }}
              >
                <span style={{ fontSize: 20, lineHeight: 1 }}>{ENERGY_EMOJIS[i]}</span>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: -0.1 }}>{e}</span>
              </button>
            )
          })}
        </div>
      </Section>

      {/* Sleep */}
      <Section title="Sleep last night">
        <div style={{ display: 'flex', gap: 6 }}>
          {SLEEP.map(s => (
            <Chip key={s} label={s} active={sleep === s} onClick={() => setSleep(s)} small />
          ))}
        </div>
      </Section>

      {/* Notes */}
      <Section title="Notes">
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="How are you feeling today? Any patterns you've noticed..."
          rows={3}
          style={{
            width: '100%',
            borderRadius: 14,
            padding: '12px 14px',
            background: '#F7EDE8',
            border: '1px solid #E8D0C8',
            fontSize: 13,
            color: '#2D1820',
            fontFamily: 'Outfit, sans-serif',
            resize: 'none',
            outline: 'none',
            boxSizing: 'border-box',
            lineHeight: 1.6,
          }}
        />
      </Section>

      {/* Save button */}
      <div style={{ padding: '8px 24px 32px' }}>
        <button
          onClick={handleSave}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 18,
            background: saved ? '#A8C5B5' : 'linear-gradient(135deg, #e75650, #c43a35)',
            border: 'none',
            cursor: 'pointer',
            fontSize: 15,
            fontWeight: 600,
            color: 'white',
            boxShadow: '0 4px 16px rgba(231, 86, 80, 0.3)',
            letterSpacing: 0.3,
            transition: 'background 0.2s ease',
          }}
        >
          {saved ? '✓ Saved log entry' : 'Save log entry'}
        </button>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '0 24px 18px' }}>
      <h3 style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 600, color: '#7A4F5C', letterSpacing: 0.3, textTransform: 'uppercase' }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

function Chip({ label, active, onClick, small }: { label: string; active: boolean; onClick: () => void; small?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl transition-all duration-150"
      style={{
        padding: small ? '7px 11px' : '8px 14px',
        borderRadius: 16,
        background: active ? '#e75650' : '#F7EDE8',
        border: `1px solid ${active ? '#b03e3a' : '#E8D0C8'}`,
        fontSize: small ? 11 : 13,
        fontWeight: 500,
        color: active ? 'white' : '#7A4F5C',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  )
}

function SymptomButton({
  emoji,
  label,
  active,
  onClick,
}: {
  emoji: string
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl transition-all duration-150"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '11px 14px',
        borderRadius: 16,
        background: active ? '#e75650' : '#F7EDE8',
        border: `1px solid ${active ? '#b03e3a' : '#E8D0C8'}`,
        cursor: 'pointer',
        textAlign: 'left',
        color: active ? '#FFFFFF' : '#4A2E35',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{emoji}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color: 'inherit', letterSpacing: 0.1 }}>
        {label}
      </span>
    </button>
  )
}
