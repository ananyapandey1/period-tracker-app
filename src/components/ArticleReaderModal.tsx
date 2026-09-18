import React from 'react'
import { useApp } from '../context/AppContext'

export const ArticleReaderModal: React.FC = () => {
  const { selectedArticle, setSelectedArticle } = useApp()

  if (!selectedArticle) return null

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(45, 24, 32, 0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
      onClick={() => setSelectedArticle(null)}
      role="dialog"
      aria-modal="true"
      aria-label="Article Reader"
    >
      <div
        style={{
          background: '#FDF6F0',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          height: '90%',
          display: 'flex',
          flexDirection: 'column',
          borderTop: '1px solid #E8D0C8',
          boxShadow: '0 -12px 32px rgba(45, 24, 32, 0.25)',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top Fixed Bar */}
        <div style={{ padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E8D0C8', background: '#FDF6F0' }}>
          <span style={{ fontSize: 10, fontWeight: 700, background: '#F2D5D0', color: '#e75650', padding: '3px 10px', borderRadius: 12, textTransform: 'uppercase' }}>
            {selectedArticle.category}
          </span>
          <button
            onClick={() => setSelectedArticle(null)}
            aria-label="Close article"
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: '#F7EDE8',
              border: '1px solid #E8D0C8',
              fontSize: 14,
              color: '#7A4F5C',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 32px' }}>
          {/* Header Cover Banner */}
          <div
            style={{
              background: selectedArticle.imageBg,
              borderRadius: 20,
              padding: '24px 20px',
              color: 'white',
              marginBottom: 20,
              boxShadow: '0 8px 24px rgba(45,24,32,0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div style={{ fontSize: 36 }}>{selectedArticle.emoji}</div>
            <h1 style={{ margin: 0, fontSize: 22, fontFamily: 'Fraunces, Georgia, serif', fontWeight: 600, lineHeight: 1.3 }}>
              {selectedArticle.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>
              <span>⏱️ {selectedArticle.readTime}</span>
              <span>•</span>
              <span>✍️ {selectedArticle.author}</span>
            </div>
          </div>

          {/* Subtitle / Intro */}
          <p style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 500, color: '#2D1820', lineHeight: 1.5, fontStyle: 'italic' }}>
            "{selectedArticle.subtitle}"
          </p>

          {/* Key Summary Card */}
          <div style={{ background: '#F7EDE8', borderRadius: 16, padding: '16px', border: '1px solid #E8D0C8', marginBottom: 20 }}>
            <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: '#e75650', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Key Takeaways & Summary
            </p>
            <p style={{ margin: 0, fontSize: 13, color: '#7A4F5C', lineHeight: 1.5 }}>
              {selectedArticle.summary}
            </p>
          </div>

          {/* Main Paragraphs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
            {selectedArticle.content.map((paragraph, idx) => (
              <p key={idx} style={{ margin: 0, fontSize: 13, color: '#2D1820', lineHeight: 1.6 }}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Bullet Takeaways */}
          <div style={{ background: '#F2D5D0', borderRadius: 18, padding: '18px', border: '1px solid #E8D0C8' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: 14, fontFamily: 'Fraunces, Georgia, serif', color: '#2D1820' }}>
              Actionable Care Steps
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selectedArticle.takeaways.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#e75650', fontSize: 14, lineHeight: 1.4 }}>✓</span>
                  <p style={{ margin: 0, fontSize: 12, color: '#7A4F5C', lineHeight: 1.5, fontWeight: 500 }}>
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
