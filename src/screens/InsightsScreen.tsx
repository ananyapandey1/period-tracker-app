import { useState } from 'react'
import { useApp, ARTICLES } from '../context/AppContext'

const CYCLE_DATA = [
  { month: 'Apr', length: 27, period: 5, notes: 'Regular cycle, mild cramping' },
  { month: 'May', length: 28, period: 5, notes: 'Optimal 28-day cycle length' },
  { month: 'Jun', length: 29, period: 4, notes: 'Slightly longer follicular phase' },
  { month: 'Jul', length: 28, period: 5, notes: 'Standard cycle' },
  { month: 'Aug', length: 27, period: 6, notes: 'Slightly longer period flow' },
  { month: 'Sep', length: 28, period: 5, notes: 'Current ongoing cycle' },
]

const MAX_LENGTH = 35

const SYMPTOM_TRENDS = [
  { name: 'Cramps', frequency: 80, color: '#E75650', phase: 'Period', details: '80% of tracked period days include cramps' },
  { name: 'Bloating', frequency: 65, color: '#D97706', phase: 'Luteal', details: 'Peaks 2-3 days before period' },
  { name: 'Fatigue', frequency: 55, color: '#B89AA8', phase: 'Luteal', details: 'Common in late luteal phase' },
  { name: 'Headache', frequency: 40, color: '#E8B87A', phase: 'Ovulation', details: 'Occurs around estrogen shift' },
  { name: 'Energized', frequency: 70, color: '#2A9D8F', phase: 'Follicular', details: 'Highest during days 6-12' },
]

type InsightTab = 'overview' | 'symptoms' | 'articles'
type ArticleCategoryFilter = 'All' | 'Menstrual Health' | 'Sexual Wellness' | 'Menstrual Care Products'

export default function InsightsScreen() {
  const { showToast, setSelectedArticle } = useApp()
  const [tab, setTab] = useState<InsightTab>('overview')
  const [selectedCycleIdx, setSelectedCycleIdx] = useState<number | null>(5)
  const [articleCategory, setArticleCategory] = useState<ArticleCategoryFilter>('All')

  const selectedCycle = selectedCycleIdx !== null ? CYCLE_DATA[selectedCycleIdx] : null

  const filteredArticles = articleCategory === 'All'
    ? ARTICLES
    : ARTICLES.filter(a => a.category === articleCategory)

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#FDF6F0' }}>
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
              <p style={{ margin: '0 0 4px', fontSize: 12, color: '#B89AA8', letterSpacing: 0.3 }}>Cycle length history</p>
              <p style={{ margin: '0 0 18px', fontSize: 20, fontFamily: 'Fraunces, Georgia, serif', fontWeight: 400, color: '#2D1820' }}>
                avg 27.8 days
              </p>

              {/* Bar chart */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 85 }}>
                {CYCLE_DATA.map((d, i) => {
                  const isSelected = selectedCycleIdx === i
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        setSelectedCycleIdx(i)
                        showToast(`${d.month} Cycle: ${d.length} days total, ${d.period} days period flow`)
                      }}
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 4,
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                        <div
                          style={{
                            position: 'relative',
                            width: '100%',
                            transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                            transition: 'transform 0.15s ease',
                          }}
                        >
                          <div
                            style={{
                              width: '100%',
                              height: Math.round((d.length / MAX_LENGTH) * 68),
                              borderRadius: 6,
                              background: isSelected ? '#b03e3a' : '#D97706',
                              overflow: 'hidden',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'flex-end',
                              boxShadow: isSelected ? '0 4px 12px rgba(176,62,58,0.3)' : 'none',
                            }}
                          >
                            <div
                              style={{
                                height: Math.round((d.period / d.length) * Math.round((d.length / MAX_LENGTH) * 68)),
                                background: '#E75650',
                                borderRadius: '0 0 6px 6px',
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: 10, color: isSelected ? '#e75650' : '#B89AA8', fontWeight: isSelected ? 700 : 500 }}>{d.month}</span>
                      <span style={{ fontSize: 10, color: '#7A4F5C', fontWeight: 600 }}>{d.length}</span>
                    </div>
                  )
                })}
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', gap: 14, marginTop: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: '#D97706' }} />
                  <span style={{ fontSize: 11, color: '#7A4F5C' }}>Cycle</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: '#E75650' }} />
                  <span style={{ fontSize: 11, color: '#7A4F5C' }}>Period</span>
                </div>
              </div>

              {/* Selected Cycle Inspector */}
              {selectedCycle && (
                <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid #E8D0C8' }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#2D1820' }}>
                    {selectedCycle.month} Cycle Summary
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: '#7A4F5C' }}>
                    Total cycle: {selectedCycle.length} days • Period duration: {selectedCycle.period} days ({selectedCycle.notes})
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
      {tab === 'symptoms' && (
        <div style={{ padding: '0 24px 20px' }}>
          <div style={{ background: '#F7EDE8', borderRadius: 20, padding: '18px 16px', border: '1px solid #E8D0C8' }}>
            <p style={{ margin: '0 0 4px', fontSize: 12, color: '#B89AA8', letterSpacing: 0.3 }}>Frequency breakdown</p>
            <p style={{ margin: '0 0 16px', fontSize: 18, fontFamily: 'Fraunces, Georgia, serif', color: '#2D1820' }}>
              Most logged symptoms
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {SYMPTOM_TRENDS.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => showToast(`${item.name}: ${item.details}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, color: '#2D1820' }}>{item.name}</span>
                    <span style={{ color: '#7A4F5C', fontSize: 11 }}>{item.phase} phase ({item.frequency}%)</span>
                  </div>
                  <div style={{ width: '100%', height: 8, borderRadius: 4, background: '#E8D0C8', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${item.frequency}%`,
                        height: '100%',
                        borderRadius: 4,
                        background: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
