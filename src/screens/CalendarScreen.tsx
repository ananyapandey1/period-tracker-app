import { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { formatFullDate } from '../utils/dateUtils'
import { getCycleState, CyclePhase } from '../utils/cycleEngine'

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const YEARS = [2023, 2024, 2025, 2026, 2027, 2028, 2029]

function getDaysInMonth(year: number, monthZeroIndex: number) {
  return new Date(year, monthZeroIndex + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, monthZeroIndex: number) {
  return new Date(year, monthZeroIndex, 1).getDay()
}





// Minimalist High-Contrast Outlined Tile Config
const PHASE_STYLES: Record<CyclePhase, { borderColor: string; bgTint: string; textColor: string; label: string }> = {
  Menstrual: { borderColor: '#C86D6B', bgTint: 'rgba(200, 109, 107, 0.08)', textColor: '#C86D6B', label: 'Menstrual' },
  Follicular: { borderColor: '#8BAA9B', bgTint: 'rgba(139, 170, 155, 0.08)', textColor: '#8BAA9B', label: 'Follicular' },
  Ovulation: { borderColor: '#E2A966', bgTint: 'rgba(226, 169, 102, 0.12)', textColor: '#E2A966', label: 'Ovulation' },
  Luteal: { borderColor: '#B39ABF', bgTint: 'rgba(179, 154, 191, 0.08)', textColor: '#B39ABF', label: 'Luteal' }
}

const LEGEND = [
  { key: 'Menstrual', label: 'Menstrual', color: '#C86D6B' },
  { key: 'Follicular', label: 'Follicular', color: '#8BAA9B' },
  { key: 'Ovulation', label: 'Ovulation', color: '#E2A966' },
  { key: 'Luteal', label: 'Luteal', color: '#B39ABF' },
]

export default function CalendarScreen() {
  const { setActiveTab, setSelectedDate, logEntries, showToast, lastPeriodStartDate } = useApp()
  
  // Real-time client system date initialization
  const now = new Date()
  const todayYear = now.getFullYear()
  const todayMonthIdx = now.getMonth()
  const todayDay = now.getDate()

  const [selectedYear, setSelectedYear] = useState(todayYear)
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(todayMonthIdx)
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number | null>(todayDay)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Handle outside click dismissal for Month/Year Popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsMonthDropdownOpen(false)
      }
    }
    if (isMonthDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMonthDropdownOpen])

  const daysCount = getDaysInMonth(selectedYear, selectedMonthIdx)
  const startDay = getFirstDayOfWeek(selectedYear, selectedMonthIdx)

  const cells: (number | null)[] = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: daysCount }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const monthName = MONTH_NAMES[selectedMonthIdx]
  const selectedCycleState = selectedDay ? getCycleState(lastPeriodStartDate, 28, new Date(selectedYear, selectedMonthIdx, selectedDay)) : null
  const selectedInfo = selectedCycleState ? PHASE_STYLES[selectedCycleState.phase.name] : null

  const formattedMonthStr = selectedMonthIdx + 1 < 10 ? `0${selectedMonthIdx + 1}` : `${selectedMonthIdx + 1}`
  const formattedDayStr = selectedDay ? (selectedDay < 10 ? `0${selectedDay}` : `${selectedDay}`) : ''
  const formattedDateStr = selectedDay ? `${selectedYear}-${formattedMonthStr}-${formattedDayStr}` : ''
  
  const hasLogEntry = formattedDateStr ? !!logEntries[formattedDateStr] : false
  const dayLog = hasLogEntry ? logEntries[formattedDateStr] : null

  // Dynamic calculations for 4 KPI Cards
  const currentStatus = getCycleState(lastPeriodStartDate, 28, now)
  const currentDynamicCycleDay = currentStatus.currentCycleDay
  const nextPeriodDaysLeft = currentStatus.daysUntilNextPeriod
  const nextDate = new Date(now)
  nextDate.setDate(now.getDate() + nextPeriodDaysLeft)
  const nextPeriodExpectedDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(nextDate)

  const selectedDateObject = selectedDay ? new Date(selectedYear, selectedMonthIdx, selectedDay) : now
  const dynamicSelectedDateHeader = formatFullDate(selectedDateObject)

  const handlePrevMonth = () => {
    if (selectedMonthIdx === 0) {
      setSelectedMonthIdx(11)
      setSelectedYear(prev => prev - 1)
    } else {
      setSelectedMonthIdx(prev => prev - 1)
    }
  }

  const handleNextMonth = () => {
    if (selectedMonthIdx === 11) {
      setSelectedMonthIdx(0)
      setSelectedYear(prev => prev + 1)
    } else {
      setSelectedMonthIdx(prev => prev + 1)
    }
  }

  const handleNavigateToLog = () => {
    if (selectedDay) {
      setSelectedDate(formattedDateStr)
      setActiveTab('log')
    }
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#FDF6F0', position: 'relative', paddingBottom: 96 }}>
      
      {/* Header */}
      <div style={{ padding: '8px 24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ margin: 0, fontSize: 12, color: '#B89AA8' }}>Cycle calendar</p>
          
          {/* Header Month Dropdown Chevron Selector */}
          <div style={{ position: 'relative', display: 'inline-block' }} ref={popoverRef}>
            <button
              onClick={() => setIsMonthDropdownOpen(prev => !prev)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                margin: '2px 0 0',
                fontSize: 22,
                fontFamily: 'Fraunces, Georgia, serif',
                fontWeight: 600,
                color: '#2D1820',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
              aria-label="Select month and year"
            >
              <span>{monthName} {selectedYear}</span>
              <span style={{ fontSize: 14, color: '#F8C8DC', transform: isMonthDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}>▾</span>
            </button>

            {/* DUAL SELECTOR POPOVER (MONTH & YEAR) */}
            {isMonthDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: 8,
                  background: '#FFFDFB',
                  border: '1px solid #E8D0C8',
                  borderRadius: 20,
                  boxShadow: '0 12px 32px rgba(45, 24, 32, 0.22)',
                  zIndex: 90,
                  width: 270,
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                {/* Year Selector */}
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#B89AA8', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>
                    Select Year
                  </label>
                  <div style={{ display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 4 }}>
                    {YEARS.map(y => (
                      <button
                        key={y}
                        onClick={() => {
                          setSelectedYear(y)
                          showToast(`Year changed to ${y}`)
                        }}
                        style={{
                          padding: '4px 10px',
                          borderRadius: 12,
                          background: selectedYear === y ? '#F8C8DC' : '#F7EDE8',
                          border: `1px solid ${selectedYear === y ? '#F8C8DC' : '#E8D0C8'}`,
                          color: selectedYear === y ? 'white' : '#2D1820',
                          fontSize: 11,
                          fontWeight: selectedYear === y ? 700 : 500,
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Month Picker Grid */}
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#B89AA8', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>
                    Select Month
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                    {MONTH_NAMES.map((m, idx) => (
                      <button
                        key={m}
                        onClick={() => {
                          setSelectedMonthIdx(idx)
                          setIsMonthDropdownOpen(false)
                          showToast(`Switched to ${m} ${selectedYear}`)
                        }}
                        style={{
                          padding: '8px 4px',
                          borderRadius: 10,
                          textAlign: 'center',
                          background: selectedMonthIdx === idx ? '#F7EDE8' : 'white',
                          border: `1px solid ${selectedMonthIdx === idx ? '#F8C8DC' : '#E8D0C8'}`,
                          fontSize: 11,
                          fontWeight: selectedMonthIdx === idx ? 700 : 400,
                          color: selectedMonthIdx === idx ? '#F8C8DC' : '#2D1820',
                          cursor: 'pointer',
                        }}
                      >
                        {m.substring(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chevron Arrows */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handlePrevMonth}
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: '#F7EDE8',
              border: '1px solid #E8D0C8',
              cursor: 'pointer',
              fontSize: 16,
              color: '#F8C8DC',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ‹
          </button>
          <button
            onClick={handleNextMonth}
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: '#F7EDE8',
              border: '1px solid #E8D0C8',
              cursor: 'pointer',
              fontSize: 16,
              color: '#F8C8DC',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ›
          </button>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 8 }}>
          {DAYS.map((d, i) => (
            <div key={i} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#B89AA8', letterSpacing: 0.5, padding: '4px 0' }}>
              {d}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px 6px' }}>
          {cells.map((day, i) => {
            if (!day) return <div key={i} />
            const dayCycleState = getCycleState(lastPeriodStartDate, 28, new Date(selectedYear, selectedMonthIdx, day))
            const styleConfig = PHASE_STYLES[dayCycleState.phase.name]
            const isSelected = selectedDay === day
            const isToday = selectedYear === todayYear && selectedMonthIdx === todayMonthIdx && day === todayDay
            const cellDateKey = `${selectedYear}-${formattedMonthStr}-${day < 10 ? '0' + day : day}`
            const hasLogged = !!logEntries[cellDateKey]

            return (
              <button
                key={i}
                onClick={() => setSelectedDay(day)}
                aria-label={`${monthName} ${day}, ${selectedYear}`}
                style={{
                  height: 42,
                  borderRadius: 12,
                  border: isSelected
                    ? '2px solid #2D1820'
                    : styleConfig
                    ? `1.5px solid ${styleConfig.borderColor}`
                    : '1px solid #E8D0C8',
                  background: isSelected
                    ? styleConfig ? styleConfig.bgTint : '#F7EDE8'
                    : styleConfig ? styleConfig.bgTint : 'transparent',
                  color: isSelected ? '#2D1820' : styleConfig ? styleConfig.textColor : '#7A4F5C',
                  fontSize: 13,
                  fontWeight: isSelected || isToday ? 700 : 500,
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isSelected ? '0 4px 12px rgba(45,24,32,0.15)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{day}</span>

                {hasLogged && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 4,
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      background: '#F8C8DC',
                    }}
                  />
                )}

                {isToday && !hasLogged && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 4,
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      background: '#2D1820',
                    }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Phase Legend */}
        <div style={{ display: 'flex', justifyContent: 'space-around', margin: '20px 0 16px', padding: '10px 14px', background: '#F7EDE8', borderRadius: 14, border: '1px solid #E8D0C8' }}>
          {LEGEND.map(item => (
            <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 12, height: 12, borderRadius: 4, border: `1.5px solid ${item.color}`, background: `${item.color}22` }} />
              <span style={{ fontSize: 10, color: '#7A4F5C', fontWeight: 600 }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Selected Day Details Card (Dynamically Formatted Date Header) */}
        {selectedDay && (
          <div
            style={{
              background: '#F7EDE8',
              borderRadius: 18,
              padding: '16px',
              border: '1px solid #E8D0C8',
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <span style={{ fontSize: 11, color: '#B89AA8', fontWeight: 500 }}>
                  {dynamicSelectedDateHeader}
                </span>
                <h4 style={{ margin: '2px 0 0', fontSize: 16, fontFamily: 'Fraunces, Georgia, serif', color: '#2D1820' }}>
                  {selectedInfo ? selectedInfo.label : 'Regular cycle day'}
                </h4>
              </div>

              <button
                onClick={handleNavigateToLog}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  background: 'linear-gradient(135deg, #F8C8DC, #c43a35)',
                  color: '#2D1820',
                  fontSize: 11,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(231,86,80,0.3)',
                }}
              >
                Log Day →
              </button>
            </div>

            {hasLogEntry && dayLog ? (
              <div style={{ fontSize: 12, color: '#7A4F5C', background: '#FDF6F0', borderRadius: 12, padding: '10px 12px', border: '1px solid #E8D0C8' }}>
                <p style={{ margin: '0 0 4px', fontWeight: 600, color: '#F8C8DC' }}>Recorded symptoms:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {dayLog.flow && <span style={{ background: '#F2D5D0', padding: '2px 8px', borderRadius: 10, fontSize: 10 }}>Flow: {dayLog.flow}</span>}
                  {dayLog.physical.map(p => (
                    <span key={p} style={{ background: '#E8F0EC', padding: '2px 8px', borderRadius: 10, fontSize: 10, textTransform: 'capitalize' }}>{p}</span>
                  ))}
                  {dayLog.notes && <p style={{ margin: '6px 0 0', width: '100%', fontStyle: 'italic', fontSize: 11 }}>"{dayLog.notes}"</p>}
                </div>
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: 11, color: '#7A4F5C' }}>
                No symptoms logged for this date yet. Tap "Log Day" to record flow, mood, or energy.
              </p>
            )}
          </div>
        )}

        {/* DYNAMIC 4 CYCLE KPI METRIC CARDS GRID (2x2) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {/* Card 1: Cycle Length */}
          <div
            style={{
              background: '#FFFDFB',
              borderRadius: 16,
              padding: '14px',
              border: '1px solid #F0E5DF',
              boxShadow: '0 2px 8px rgba(45,24,32,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 9, fontWeight: 700, color: '#F8C8DC', letterSpacing: 0.5, textTransform: 'uppercase', background: '#F2D5D0', padding: '2px 8px', borderRadius: 10, width: 'fit-content' }}>
              Cycle Length
            </span>
            <p style={{ margin: '8px 0 2px', fontSize: 19, fontFamily: 'Fraunces, Georgia, serif', fontWeight: 600, color: '#2D1820' }}>
              28 Days
            </p>
            <p style={{ margin: 0, fontSize: 11, color: '#7A4F5C', lineHeight: 1.3 }}>
              Regular (±2 days variation)
            </p>
          </div>

          {/* Card 2: Period Duration */}
          <div
            style={{
              background: '#FFFDFB',
              borderRadius: 16,
              padding: '14px',
              border: '1px solid #F0E5DF',
              boxShadow: '0 2px 8px rgba(45,24,32,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 9, fontWeight: 700, color: '#2A9D8F', letterSpacing: 0.5, textTransform: 'uppercase', background: '#E8F0EC', padding: '2px 8px', borderRadius: 10, width: 'fit-content' }}>
              Period Duration
            </span>
            <p style={{ margin: '8px 0 2px', fontSize: 19, fontFamily: 'Fraunces, Georgia, serif', fontWeight: 600, color: '#2D1820' }}>
              5 Days
            </p>
            <p style={{ margin: 0, fontSize: 11, color: '#7A4F5C', lineHeight: 1.3 }}>
              Average flow window
            </p>
          </div>

          {/* Card 3: Dynamic Current Cycle Day */}
          <div
            style={{
              background: '#FFFDFB',
              borderRadius: 16,
              padding: '14px',
              border: '1px solid #F0E5DF',
              boxShadow: '0 2px 8px rgba(45,24,32,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 9, fontWeight: 700, color: '#D97706', letterSpacing: 0.5, textTransform: 'uppercase', background: '#FDF0E8', padding: '2px 8px', borderRadius: 10, width: 'fit-content' }}>
              Current Day
            </span>
            <p style={{ margin: '8px 0 2px', fontSize: 19, fontFamily: 'Fraunces, Georgia, serif', fontWeight: 600, color: '#2D1820' }}>
              Day {currentDynamicCycleDay}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: '#7A4F5C', lineHeight: 1.3 }}>
              {selectedInfo ? selectedInfo.label : 'Luteal'} Phase
            </p>
          </div>

          {/* Card 4: Dynamic Next Period Estimate */}
          <div
            style={{
              background: '#FFFDFB',
              borderRadius: 16,
              padding: '14px',
              border: '1px solid #F0E5DF',
              boxShadow: '0 2px 8px rgba(45,24,32,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 9, fontWeight: 700, color: '#C4A5C8', letterSpacing: 0.5, textTransform: 'uppercase', background: '#F9EFFA', padding: '2px 8px', borderRadius: 10, width: 'fit-content' }}>
              Next Period
            </span>
            <p style={{ margin: '8px 0 2px', fontSize: 19, fontFamily: 'Fraunces, Georgia, serif', fontWeight: 600, color: '#2D1820' }}>
              In {nextPeriodDaysLeft} Days
            </p>
            <p style={{ margin: 0, fontSize: 11, color: '#7A4F5C', lineHeight: 1.3 }}>
              Expected {nextPeriodExpectedDate}
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
