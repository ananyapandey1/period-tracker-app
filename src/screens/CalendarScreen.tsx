import { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'

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

function getDayType(day: number, monthIndex: number): 'period' | 'follicular' | 'ovulation' | 'luteal' | 'period-predicted' | null {
  if (monthIndex === 8) { // September
    if (day >= 1 && day <= 5) return 'period'
    if (day >= 6 && day <= 13) return 'follicular'
    if (day >= 14 && day <= 16) return 'ovulation'
    if (day >= 17 && day <= 28) return 'luteal'
    if (day >= 29 && day <= 30) return 'period-predicted'
  } else if (monthIndex === 9) { // October
    if (day >= 1 && day <= 3) return 'period-predicted'
    if (day >= 27 && day <= 31) return 'period-predicted'
    if (day >= 12 && day <= 14) return 'ovulation'
    if (day >= 15 && day <= 26) return 'luteal'
    if (day >= 4 && day <= 11) return 'follicular'
  } else if (monthIndex === 7) { // August
    if (day >= 4 && day <= 8) return 'period'
    if (day >= 17 && day <= 19) return 'ovulation'
    if (day >= 20 && day <= 31) return 'luteal'
    if (day >= 9 && day <= 16) return 'follicular'
  } else {
    // Generically fallback phase ranges for other months
    if (day >= 1 && day <= 5) return 'period'
    if (day >= 6 && day <= 13) return 'follicular'
    if (day >= 14 && day <= 16) return 'ovulation'
    if (day >= 17 && day <= 28) return 'luteal'
  }
  return null
}

// Minimalist High-Contrast Outlined Tile Config
const PHASE_STYLES: Record<string, { borderColor: string; bgTint: string; textColor: string; label: string }> = {
  period: { borderColor: '#E75650', bgTint: 'rgba(231, 86, 80, 0.08)', textColor: '#E75650', label: 'Period' },
  follicular: { borderColor: '#2A9D8F', bgTint: 'rgba(42, 157, 143, 0.08)', textColor: '#1B635A', label: 'Follicular' },
  ovulation: { borderColor: '#E8B87A', bgTint: 'rgba(232, 184, 122, 0.12)', textColor: '#9C6818', label: 'Ovulation' },
  luteal: { borderColor: '#D97706', bgTint: 'rgba(217, 119, 6, 0.08)', textColor: '#92400E', label: 'Luteal' },
  'period-predicted': { borderColor: '#E75650', bgTint: 'rgba(231, 86, 80, 0.04)', textColor: '#C43A35', label: 'Period (predicted)' },
}

const LEGEND = [
  { key: 'period', label: 'Period', color: '#E75650' },
  { key: 'follicular', label: 'Follicular', color: '#2A9D8F' },
  { key: 'ovulation', label: 'Ovulation', color: '#E8B87A' },
  { key: 'luteal', label: 'Luteal', color: '#D97706' },
]

export default function CalendarScreen() {
  const { setActiveTab, setSelectedDate, logEntries, showToast } = useApp()
  const [selectedYear, setSelectedYear] = useState(2026)
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(8) // 8 = September (0-indexed)
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number | null>(17)
  const popoverRef = useRef<HTMLDivElement>(null)

  const todayYear = 2026
  const todayMonthIdx = 8
  const todayDay = 17

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
  const selectedType = selectedDay ? getDayType(selectedDay, selectedMonthIdx) : null
  const selectedInfo = selectedType ? PHASE_STYLES[selectedType] : null

  const formattedMonthStr = selectedMonthIdx + 1 < 10 ? `0${selectedMonthIdx + 1}` : `${selectedMonthIdx + 1}`
  const formattedDayStr = selectedDay ? (selectedDay < 10 ? `0${selectedDay}` : `${selectedDay}`) : ''
  const formattedDateStr = selectedDay ? `${selectedYear}-${formattedMonthStr}-${formattedDayStr}` : ''
  
  const hasLogEntry = formattedDateStr ? !!logEntries[formattedDateStr] : false
  const dayLog = hasLogEntry ? logEntries[formattedDateStr] : null

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
              <span style={{ fontSize: 14, color: '#e75650', transform: isMonthDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}>▾</span>
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
                {/* Year Picker Selector */}
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
                          background: selectedYear === y ? '#e75650' : '#F7EDE8',
                          border: `1px solid ${selectedYear === y ? '#b03e3a' : '#E8D0C8'}`,
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
                          border: `1px solid ${selectedMonthIdx === idx ? '#e75650' : '#E8D0C8'}`,
                          fontSize: 11,
                          fontWeight: selectedMonthIdx === idx ? 700 : 400,
                          color: selectedMonthIdx === idx ? '#e75650' : '#2D1820',
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

        {/* Month Navigation Prev/Next Arrows */}
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
              color: '#e75650',
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
              color: '#e75650',
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
        {/* Days Header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 8 }}>
          {DAYS.map((d, i) => (
            <div key={i} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#B89AA8', letterSpacing: 0.5, padding: '4px 0' }}>
              {d}
            </div>
          ))}
        </div>

        {/* Modernized High-Contrast Outlined Days Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px 6px' }}>
          {cells.map((day, i) => {
            if (!day) return <div key={i} />
            const type = getDayType(day, selectedMonthIdx)
            const styleConfig = type ? PHASE_STYLES[type] : null
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

                {/* Logged Indicator Dot */}
                {hasLogged && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 4,
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      background: '#e75650',
                    }}
                  />
                )}

                {/* Today Highlight Indicator */}
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

        {/* Selected Day Details Card */}
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
                  {monthName} {selectedDay}, {selectedYear}
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
                  background: 'linear-gradient(135deg, #e75650, #c43a35)',
                  color: 'white',
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
                <p style={{ margin: '0 0 4px', fontWeight: 600, color: '#e75650' }}>Recorded symptoms:</p>
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

        {/* RESTORED 4 CYCLE KPI METRIC CARDS GRID (2x2) */}
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
            <span style={{ fontSize: 9, fontWeight: 700, color: '#e75650', letterSpacing: 0.5, textTransform: 'uppercase', background: '#F2D5D0', padding: '2px 8px', borderRadius: 10, width: 'fit-content' }}>
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

          {/* Card 3: Current Cycle Day */}
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
              Day {selectedDay || 18}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: '#7A4F5C', lineHeight: 1.3 }}>
              {selectedInfo ? selectedInfo.label : 'Luteal'} Phase
            </p>
          </div>

          {/* Card 4: Next Period Estimate */}
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
              In 10 Days
            </p>
            <p style={{ margin: 0, fontSize: 11, color: '#7A4F5C', lineHeight: 1.3 }}>
              Expected around Sep 27
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
