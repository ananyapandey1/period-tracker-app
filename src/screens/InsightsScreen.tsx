import { useState } from 'react'
import { useApp, ARTICLES } from '../context/AppContext'
import {
  INITIAL_CYCLE_DATA,
  calculateAverageCycleLength,
  calculateCycleTrend,
  computeChartScale,
} from '../utils/insightsChart'
import {
  getSymptomInsights,
  SymptomPhaseFilter,
} from '../utils/insightsSymptoms'

type InsightTab = 'overview' | 'symptoms' | 'articles'
type ArticleCategoryFilter = 'All' | 'Menstrual Health' | 'Sexual Wellness' | 'Menstrual Care Products'

export default function InsightsScreen() {
  const { showToast, setSelectedArticle, logEntries } = useApp()
  const [tab, setTab] = useState<InsightTab>('overview')
  const [selectedCycleIdx, setSelectedCycleIdx] = useState<number | null>(5)
  const [articleCategory, setArticleCategory] = useState<ArticleCategoryFilter>('All')
  const [symptomFilter, setSymptomFilter] = useState<SymptomPhaseFilter>('All')
  const [expandedSymptomId, setExpandedSymptomId] = useState<string | null>(null)
  const [showAllSymptoms, setShowAllSymptoms] = useState(false)

  // Cycle history calculations (Single source of truth)
  const cycleData = INITIAL_CYCLE_DATA
  const selectedCycle = selectedCycleIdx !== null ? cycleData[selectedCycleIdx] : null
  const avgCycleLength = calculateAverageCycleLength(cycleData)
  const trend = calculateCycleTrend(cycleData)

  // Chart layout geometry & dynamic scaling (Fix 1, 2, 3)
  const SVG_WIDTH = 320
  const SVG_HEIGHT = 145
  const PLOT_TOP = 8
  const PLOT_BASELINE = 118
  const PLOT_HEIGHT = PLOT_BASELINE - PLOT_TOP

  const scale = computeChartScale(cycleData)
  const avgY = PLOT_BASELINE - scale.toPixelHeight(avgCycleLength, PLOT_HEIGHT)

  const filteredArticles = articleCategory === 'All'
    ? ARTICLES
    : ARTICLES.filter(a => a.category === articleCategory)

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#FDF6F0', paddingBottom: 120 }}>
      {/* Header */}
      <div style={{ padding: '8px 24px 16px' }}>
        <p style={{ margin: 0, fontSize: 12, color: '#B89AA8' }}>Cycle intelligence & education</p>
        <h2 style={{ margin: '2px 0 0', fontSize: 22, fontFamily: 'Fraunces, Georgia, serif', fontWeight: 400, color: '#2D1820' }}>
          Insights & Hub
        </h2>
      </div>

      {/* Main Tabs (Overview | Symptoms | Articles) */}
      <div style={{ padding: '0 24px 16px', display: 'flex', gap: 8 }}>
        {(['overview', 'symptoms', 'articles'] as InsightTab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '7px 16px',
              borderRadius: 20,
              background: tab === t ? '#e75650' : '#F7EDE8',
              border: `1px solid ${tab === t ? '#b03e3a' : '#E8D0C8'}`,
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              color: tab === t ? 'white' : '#7A4F5C',
              textTransform: 'capitalize',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {tab === 'overview' && (
        <>
          {/* Cycle length chart */}
          <div style={{ padding: '0 24px 20px' }}>
            <div style={{ background: '#F7EDE8', borderRadius: 20, padding: '18px 16px', border: '1px solid #E8D0C8' }}>
              {/* Header with Average & Fix 4 Trend Indicator */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: 12, color: '#B89AA8', letterSpacing: 0.3 }}>Cycle length history</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                    <p style={{ margin: 0, fontSize: 20, fontFamily: 'Fraunces, Georgia, serif', fontWeight: 400, color: '#2D1820' }}>
                      avg {avgCycleLength} days
                    </p>
                    {/* Fix 4: Calm, non-alarm trend badge */}
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '2px 8px',
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: 500,
                        background: trend.direction === 'stable' ? '#EBF5F0' : '#FAF0EA',
                        color: trend.direction === 'stable' ? '#2A7255' : '#8A5238',
                        border: `1px solid ${trend.direction === 'stable' ? '#C2E5D4' : '#E8D0C8'}`,
                      }}
                    >
                      <span style={{ fontSize: 12, lineHeight: 1 }}>
                        {trend.direction === 'stable' ? '↔' : trend.direction === 'longer' ? '↑' : '↓'}
                      </span>
                      <span>{trend.label}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Fix 1, 2, 3: Scaled Vector Chart with Gridlines, Ongoing Hatch, & Average Reference */}
              <div style={{ width: '100%', position: 'relative' }}>
                <svg
                  viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
                  style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
                >
                  <defs>
                    {/* Fix 2: Explicit diagonal hatch pattern for ongoing cycle state */}
                    <pattern id="ongoingHatch" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                      <line x1="0" y1="0" x2="0" y2="6" stroke="#D97706" strokeWidth="2.5" />
                      <line x1="0" y1="0" x2="6" y2="0" stroke="rgba(253, 246, 240, 0.75)" strokeWidth="3.5" />
                    </pattern>
                  </defs>

                  {/* Fix 1: Y-axis gridlines and labels (25d, 28d, 31d) */}
                  {scale.gridLines.map(lineVal => {
                    const lineY = PLOT_BASELINE - scale.toPixelHeight(lineVal, PLOT_HEIGHT)
                    return (
                      <g key={lineVal}>
                        <text
                          x="22"
                          y={lineY + 3}
                          textAnchor="end"
                          fontSize="9"
                          fill="#B89AA8"
                          fontWeight="500"
                        >
                          {lineVal}d
                        </text>
                        <line
                          x1="26"
                          y1={lineY}
                          x2="280"
                          y2={lineY}
                          stroke="#EAD5CD"
                          strokeWidth="1"
                          strokeDasharray="2 3"
                        />
                      </g>
                    )
                  })}

                  {/* Fix 3: Personal average reference line */}
                  <line
                    x1="26"
                    y1={avgY}
                    x2="276"
                    y2={avgY}
                    stroke="#8C5A6A"
                    strokeWidth="1.25"
                    strokeDasharray="4 3"
                    strokeOpacity="0.8"
                  />
                  <text
                    x="280"
                    y={avgY + 3}
                    textAnchor="start"
                    fontSize="9"
                    fontWeight="600"
                    fill="#8C5A6A"
                  >
                    avg {avgCycleLength}d
                  </text>

                  {/* Bars */}
                  {cycleData.map((d, i) => {
                    const isSelected = selectedCycleIdx === i
                    const barWidth = 24
                    const barX = 36 + i * 40

                    // Calculate proportional heights (Fix 1)
                    const totalBarHeight = scale.toPixelHeight(d.length, PLOT_HEIGHT)
                    const barTopY = PLOT_BASELINE - totalBarHeight
                    const periodHeight = d.period * scale.pixelsPerDay(PLOT_HEIGHT)
                    const periodTopY = PLOT_BASELINE - periodHeight
                    const cycleHeight = totalBarHeight - periodHeight

                    // Ongoing elapsed vs projected boundary (Fix 2)
                    const elapsedDays = d.elapsedDays ?? d.length
                    const elapsedHeight = scale.toPixelHeight(elapsedDays, PLOT_HEIGHT)
                    const elapsedTopY = PLOT_BASELINE - elapsedHeight
                    const projectedHeight = Math.max(0, elapsedTopY - barTopY)

                    return (
                      <g
                        key={i}
                        onClick={() => {
                          setSelectedCycleIdx(i)
                          if (d.isOngoing) {
                            showToast(`${d.month} Cycle in progress: Day ${d.elapsedDays} of ~${d.length} projected`)
                          } else {
                            showToast(`${d.month} Cycle: ${d.length} days total, ${d.period} days period flow`)
                          }
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {/* Interactive touch target */}
                        <rect
                          x={barX - 4}
                          y={PLOT_TOP}
                          width={barWidth + 8}
                          height={PLOT_BASELINE - PLOT_TOP + 28}
                          fill="transparent"
                        />

                        {/* Selection subtle glow / ring behind bar */}
                        {isSelected && (
                          <rect
                            x={barX - 2}
                            y={barTopY - 2}
                            width={barWidth + 4}
                            height={totalBarHeight + 4}
                            rx="6"
                            fill="none"
                            stroke="#b03e3a"
                            strokeWidth="1.5"
                            strokeOpacity="0.8"
                          />
                        )}

                        {/* Bar Body */}
                        {d.isOngoing ? (
                          // Fix 2: Explicit ongoing cycle rendering
                          <g>
                            {/* Confirmed elapsed cycle segment with diagonal hatch */}
                            <rect
                              x={barX}
                              y={elapsedTopY}
                              width={barWidth}
                              height={elapsedHeight - periodHeight}
                              fill="url(#ongoingHatch)"
                              stroke="#D97706"
                              strokeWidth="0.75"
                            />
                            {/* Projected cycle extension (lighter hatch & dashed top) */}
                            {projectedHeight > 0 && (
                              <rect
                                x={barX}
                                y={barTopY}
                                width={barWidth}
                                height={projectedHeight}
                                rx="4"
                                fill="rgba(217, 119, 6, 0.15)"
                                stroke="#D97706"
                                strokeWidth="1"
                                strokeDasharray="2 2"
                              />
                            )}
                            {/* Confirmed Period segment (bottom) */}
                            <rect
                              x={barX}
                              y={periodTopY}
                              width={barWidth}
                              height={periodHeight}
                              rx="4"
                              fill="#E75650"
                            />
                          </g>
                        ) : (
                          // Standard two-tone cycle / period bar
                          <g>
                            {/* Cycle segment (top) */}
                            <rect
                              x={barX}
                              y={barTopY}
                              width={barWidth}
                              height={totalBarHeight}
                              rx="4"
                              fill={isSelected ? '#C4640A' : '#D97706'}
                            />
                            {/* Period segment (bottom) */}
                            <rect
                              x={barX}
                              y={periodTopY}
                              width={barWidth}
                              height={periodHeight}
                              rx="4"
                              fill="#E75650"
                            />
                          </g>
                        )}

                        {/* X-axis labels: Month & Day count */}
                        <text
                          x={barX + barWidth / 2}
                          y={PLOT_BASELINE + 13}
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight={isSelected ? '700' : '500'}
                          fill={isSelected ? '#e75650' : '#B89AA8'}
                        >
                          {d.month}
                        </text>
                        <text
                          x={barX + barWidth / 2}
                          y={PLOT_BASELINE + 24}
                          textAnchor="middle"
                          fontSize="9.5"
                          fontWeight="600"
                          fill="#7A4F5C"
                        >
                          {d.isOngoing ? `~${d.length}` : d.length}
                        </text>
                      </g>
                    )
                  })}
                </svg>
              </div>

              {/* Fix 2: Complete legend with Ongoing state */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 12, alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: '#D97706' }} />
                  <span style={{ fontSize: 11, color: '#7A4F5C' }}>Cycle</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: '#E75650' }} />
                  <span style={{ fontSize: 11, color: '#7A4F5C' }}>Period</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div
                    style={{
                      width: 14,
                      height: 10,
                      borderRadius: 3,
                      border: '1px dashed #D97706',
                      backgroundImage: 'repeating-linear-gradient(45deg, #D97706, #D97706 2px, #FDF6F0 2px, #FDF6F0 4px)',
                    }}
                  />
                  <span style={{ fontSize: 11, color: '#7A4F5C' }}>Ongoing (in progress)</span>
                </div>
              </div>

              {/* Selected Cycle Inspector */}
              {selectedCycle && (
                <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid #E8D0C8' }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#2D1820' }}>
                    {selectedCycle.month} Cycle Summary
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: '#7A4F5C' }}>
                    {selectedCycle.isOngoing
                      ? `Current cycle: Day ${selectedCycle.elapsedDays} of ~${selectedCycle.length} projected • Period: ${selectedCycle.period} days (${selectedCycle.notes})`
                      : `Total cycle: ${selectedCycle.length} days • Period duration: ${selectedCycle.period} days (${selectedCycle.notes})`}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Stat cards */}
          <div style={{ padding: '0 24px 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'Shortest cycle', value: '27 days', sub: 'Apr & Aug', color: '#2A9D8F' },
                { label: 'Longest cycle', value: '29 days', sub: 'June', color: '#E8B87A' },
                { label: 'Avg period', value: '5.0 days', sub: 'Very regular', color: '#E75650' },
                { label: 'Regularity', value: '96%', sub: 'Excellent', color: '#D97706' },
              ].map((s, i) => (
                <div
                  key={i}
                  onClick={() => showToast(`${s.label}: ${s.value} (${s.sub})`)}
                  style={{
                    background: '#F7EDE8',
                    borderRadius: 16,
                    padding: '16px',
                    border: '1px solid #E8D0C8',
                    borderLeft: `4px solid ${s.color}`,
                    cursor: 'pointer',
                  }}
                >
                  <p style={{ margin: '0 0 4px', fontSize: 11, color: '#B89AA8' }}>{s.label}</p>
                  <p style={{ margin: '0 0 2px', fontSize: 20, fontFamily: 'Fraunces, Georgia, serif', fontWeight: 400, color: '#2D1820' }}>{s.value}</p>
                  <p style={{ margin: 0, fontSize: 11, color: '#7A4F5C' }}>{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* TAB 2: SYMPTOMS */}
      {tab === 'symptoms' && (() => {
        const symptoms = getSymptomInsights(logEntries, symptomFilter, true)
        const displayedSymptoms = showAllSymptoms ? symptoms : symptoms.slice(0, 5)
        const hasSparseLogs = Object.keys(logEntries || {}).length < 5

        return (
          <div style={{ padding: '0 24px 20px' }}>
            <div style={{ background: '#F7EDE8', borderRadius: 20, padding: '18px 16px', border: '1px solid #E8D0C8' }}>
              {/* Part 1: Headline & Explicit Definition Caption */}
              <p style={{ margin: '0 0 2px', fontSize: 12, color: '#B89AA8', letterSpacing: 0.3 }}>Frequency breakdown</p>
              <h3 style={{ margin: '0 0 4px', fontSize: 18, fontFamily: 'Fraunces, Georgia, serif', fontWeight: 600, color: '#2D1820' }}>
                Most logged symptoms
              </h3>
              <p style={{ margin: '0 0 8px', fontSize: 11.5, color: '#7A4F5C', lineHeight: 1.45 }}>
                Shows how often each symptom was logged during that phase, over your last 6 cycles.
              </p>

              {/* Part 1: Distinction for baseline pattern augmentation */}
              {hasSparseLogs && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 10, background: '#FDF6F0', border: '1px solid #EAD8D0', marginBottom: 12 }}>
                  <span style={{ fontSize: 11 }}>ℹ️</span>
                  <span style={{ fontSize: 10, color: '#8A5238', fontWeight: 500 }}>
                    Augmented with clinical baseline patterns until more cycles are logged
                  </span>
                </div>
              )}

              {/* Part 3: Phase Filter Chips */}
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 16, paddingBottom: 2, paddingTop: 4 }}>
                {(['All', 'Period', 'Follicular', 'Ovulation', 'Luteal'] as SymptomPhaseFilter[]).map(phaseKey => {
                  const isActive = symptomFilter === phaseKey
                  return (
                    <button
                      key={phaseKey}
                      onClick={() => {
                        setSymptomFilter(phaseKey)
                        setExpandedSymptomId(null)
                      }}
                      style={{
                        padding: '5px 12px',
                        borderRadius: 16,
                        fontSize: 11,
                        fontWeight: 500,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        background: isActive ? '#e75650' : '#FDF6F0',
                        border: `1px solid ${isActive ? '#b03e3a' : '#E8D0C8'}`,
                        color: isActive ? 'white' : '#7A4F5C',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {phaseKey}
                    </button>
                  )
                })}
              </div>

              {/* Symptoms List (Part 2, 4, 5, 6) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {displayedSymptoms.map(item => {
                  const isExpanded = expandedSymptomId === item.id
                  const matchedArticle = item.matchedArticleId ? ARTICLES.find(a => a.id === item.matchedArticleId) : null

                  // Part 2: Calm, non-alarm trend indicator styling
                  const isTrendUp = item.trendDirection === 'up'
                  const isTrendDown = item.trendDirection === 'down'
                  const isTrendStable = item.trendDirection === 'flat'

                  const trendBg = isTrendStable ? '#F4ECE7' : isTrendDown ? '#EBF5F0' : '#FBEFEA'
                  const trendTextColor = isTrendStable ? '#7A4F5C' : isTrendDown ? '#2C6E49' : '#8A5238'
                  const trendBorder = isTrendStable ? '#E5D6CF' : isTrendDown ? '#C6E6D2' : '#F0D4C7'
                  const trendIcon = isTrendUp ? '↑' : isTrendDown ? '↓' : isTrendStable ? '↔' : '•'

                  return (
                    <div
                      key={item.id}
                      style={{
                        borderRadius: 14,
                        border: isExpanded ? '1px solid #D6BCB4' : '1px solid transparent',
                        background: isExpanded ? '#FAF2EC' : 'transparent',
                        padding: isExpanded ? '10px 10px 12px' : '2px 0',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {/* Main Row: Tappable to drill down (Part 4) */}
                      <div
                        onClick={() => setExpandedSymptomId(prev => (prev === item.id ? null : item.id))}
                        style={{ cursor: 'pointer' }}
                        role="button"
                        aria-expanded={isExpanded}
                        tabIndex={0}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 15 }}>{item.emoji}</span>
                            <span style={{ fontWeight: 600, fontSize: 13, color: '#2D1820' }}>{item.name}</span>
                            {item.isFallback && (
                              <span
                                style={{
                                  fontSize: 9.5,
                                  color: '#8A5238',
                                  background: '#F5E6DD',
                                  padding: '1px 5px',
                                  borderRadius: 6,
                                  fontWeight: 500,
                                }}
                              >
                                Pattern
                              </span>
                            )}
                          </div>

                          {/* Right: Phase Tag + Frequency + Trend Indicator */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                            <span
                              style={{
                                fontSize: 10.5,
                                fontWeight: 600,
                                color: item.color, // Part 6: Bloating uses #B39ABF (Luteal token)
                                background: '#FDF6F0',
                                border: `1px solid ${item.color}40`,
                                padding: '1px 6px',
                                borderRadius: 8,
                              }}
                            >
                              {item.primaryPhase} ({item.frequency}%)
                            </span>

                            {/* Part 2: Trend Indicator */}
                            {item.trendDirection !== 'insufficient_data' ? (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 3,
                                  fontSize: 10,
                                  fontWeight: 500,
                                  background: trendBg,
                                  color: trendTextColor,
                                  border: `1px solid ${trendBorder}`,
                                  padding: '1px 6px',
                                  borderRadius: 8,
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                <span>{trendIcon}</span>
                                <span>{item.trendLabel}</span>
                              </span>
                            ) : (
                              <span style={{ fontSize: 10, color: '#B89AA8' }}>New data</span>
                            )}

                            {/* Drill-down indicator */}
                            <span style={{ fontSize: 13, color: '#A88B97', transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s ease' }}>
                              ›
                            </span>
                          </div>
                        </div>

                        {/* Part 6: Bar fill uses canonical phase token (Bloating uses #B39ABF) */}
                        <div style={{ width: '100%', height: 8, borderRadius: 4, background: '#E8D0C8', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${item.frequency}%`,
                              height: '100%',
                              borderRadius: 4,
                              background: item.color,
                              transition: 'width 0.3s ease',
                            }}
                          />
                        </div>
                      </div>

                      {/* Part 4: Tap-to-Drill-Down Detail View */}
                      {isExpanded && (
                        <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #E8D0C8' }}>
                          <p style={{ margin: '0 0 6px', fontSize: 11.5, color: '#7A4F5C', lineHeight: 1.4 }}>
                            {item.details}
                          </p>

                          {/* Per-Cycle History Track (Part 4) */}
                          <div style={{ margin: '8px 0 10px' }}>
                            <p style={{ margin: '0 0 6px', fontSize: 10.5, fontWeight: 600, color: '#2D1820', textTransform: 'uppercase', letterSpacing: 0.3 }}>
                              6-Month Phase Frequency History
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4 }}>
                              {item.history.map(h => (
                                <div
                                  key={h.cycleMonth}
                                  style={{
                                    background: '#FDF6F0',
                                    border: '1px solid #E8D0C8',
                                    borderRadius: 8,
                                    padding: '4px 2px',
                                    textAlign: 'center',
                                  }}
                                >
                                  <span style={{ display: 'block', fontSize: 9.5, color: '#B89AA8', fontWeight: 600 }}>
                                    {h.cycleMonth}
                                  </span>
                                  <span style={{ display: 'block', fontSize: 10.5, color: '#2D1820', fontWeight: 700, margin: '1px 0' }}>
                                    {h.frequencyInPhase}%
                                  </span>
                                  <span style={{ display: 'block', fontSize: 8.5, color: h.severity === 'Severe' ? '#C43A35' : h.severity === 'Moderate' ? '#D97706' : '#2A9D8F' }}>
                                    {h.severity || 'Logged'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Contextual Educational Article Link (Part 4) */}
                          {matchedArticle && (
                            <div style={{ marginTop: 8, paddingTop: 6, borderTop: '1px dashed #E8D0C8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: 11, color: '#7A4F5C' }}>
                                Recommended reading:
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedArticle(matchedArticle)
                                  setTab('articles')
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  padding: 0,
                                  fontSize: 11,
                                  fontWeight: 600,
                                  color: '#e75650',
                                  cursor: 'pointer',
                                  textDecoration: 'underline',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 3,
                                }}
                              >
                                <span>{matchedArticle.title.split(':')[0]}</span>
                                <span>→</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Part 5: Expand / Collapse Toggle if > 5 symptoms */}
              {symptoms.length > 5 && (
                <div style={{ marginTop: 14, textAlign: 'center', borderTop: '1px solid #E8D0C8', paddingTop: 10 }}>
                  <button
                    onClick={() => setShowAllSymptoms(prev => !prev)}
                    style={{
                      background: '#FDF6F0',
                      border: '1px solid #E8D0C8',
                      borderRadius: 16,
                      padding: '6px 16px',
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#7A4F5C',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {showAllSymptoms
                      ? 'Show fewer symptoms ↑'
                      : `Show all ${symptoms.length} symptoms (${symptoms.length - 5} more) ↓`}
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      })()}

      {/* TAB 3: ARTICLES HUB */}
      {tab === 'articles' && (
        <div style={{ padding: '0 24px 32px' }}>
          {/* Category Filters */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 16, paddingBottom: 4 }}>
            {(['All', 'Menstrual Health', 'Sexual Wellness', 'Menstrual Care Products'] as ArticleCategoryFilter[]).map(cat => (
              <button
                key={cat}
                onClick={() => setArticleCategory(cat)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 16,
                  whiteSpace: 'nowrap',
                  background: articleCategory === cat ? '#e75650' : '#F7EDE8',
                  border: `1px solid ${articleCategory === cat ? '#b03e3a' : '#E8D0C8'}`,
                  color: articleCategory === cat ? 'white' : '#7A4F5C',
                  fontSize: 11,
                  fontWeight: 500,
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Articles List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredArticles.map(article => (
              <div
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                style={{
                  background: '#F7EDE8',
                  borderRadius: 18,
                  padding: '16px',
                  border: '1px solid #E8D0C8',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  boxShadow: '0 2px 8px rgba(45,24,32,0.04)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, background: '#F2D5D0', color: '#e75650', padding: '2px 8px', borderRadius: 10, textTransform: 'uppercase' }}>
                    {article.category}
                  </span>
                  <span style={{ fontSize: 11, color: '#B89AA8', fontWeight: 500 }}>
                    ⏱️ {article.readTime}
                  </span>
                </div>

                <div>
                  <h3 style={{ margin: '0 0 4px', fontSize: 15, fontFamily: 'Fraunces, Georgia, serif', fontWeight: 600, color: '#2D1820', lineHeight: 1.3 }}>
                    {article.emoji} {article.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: 12, color: '#7A4F5C', lineHeight: 1.4 }}>
                    {article.subtitle}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, paddingTop: 8, borderTop: '1px dashed #E8D0C8' }}>
                  <span style={{ fontSize: 11, color: '#B89AA8' }}>By {article.author.split(',')[0]}</span>
                  <span style={{ fontSize: 11, color: '#e75650', fontWeight: 600 }}>Read Article →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
