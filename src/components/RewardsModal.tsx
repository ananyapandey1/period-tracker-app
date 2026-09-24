import React from 'react'
import { useApp } from '../context/AppContext'

export const RewardsModal: React.FC = () => {
  const { isRewardsOpen, setIsRewardsOpen } = useApp()

  if (!isRewardsOpen) return null

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
      onClick={() => setIsRewardsOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Poppy Rewards & Wellness Points"
    >
      <div
        style={{
          background: '#FDF6F0',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          maxHeight: '85%',
          display: 'flex',
          flexDirection: 'column',
          borderTop: '1px solid #E8D0C8',
          boxShadow: '0 -12px 32px rgba(45, 24, 32, 0.25)',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag Handle */}
        <div style={{ width: 36, height: 4, background: '#E8D0C8', borderRadius: 2, margin: '12px auto 0' }} />

        {/* Top Header with Back / Close Button */}
        <div
          style={{
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #E8D0C8',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => setIsRewardsOpen(false)}
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
                transition: 'background-color 0.15s ease',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2D1820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h2 style={{ margin: 0, fontSize: 18, fontFamily: 'Fraunces, Georgia, serif', fontWeight: 600, color: '#2D1820' }}>
                Poppy Rewards
              </h2>
              <span style={{ fontSize: 11, color: '#7A4F5C' }}>Earn points by tracking & learning</span>
            </div>
          </div>

          <div
            style={{
              background: '#F2D5D0',
              color: '#9B3856',
              padding: '4px 10px',
              borderRadius: 14,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            150 Pts
          </div>
        </div>

        {/* Scrollable Content */}
        <div style={{ padding: '20px 20px 32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Card: Current Balance */}
          <div
            style={{
              background: 'linear-gradient(135deg, #F2D5D0, #E8B87A)',
              borderRadius: 20,
              padding: '20px',
              color: '#2D1820',
              boxShadow: '0 4px 16px rgba(45, 24, 32, 0.08)',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, color: '#7A4F5C' }}>
              Your Balance
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
              <span style={{ fontSize: 32, fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700 }}>
                150
              </span>
              <span style={{ fontSize: 14, fontWeight: 500 }}>Poppy points</span>
            </div>
            <p style={{ margin: '8px 0 0', fontSize: 12, color: '#2D1820', opacity: 0.85 }}>
              Worth ₹150 off your next Nua menstrual wellness care kit order!
            </p>
          </div>

          {/* How to earn */}
          <div>
            <h4 style={{ margin: '0 0 10px', fontSize: 14, fontFamily: 'Fraunces, Georgia, serif', fontWeight: 600, color: '#2D1820' }}>
              Ways to earn more
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { title: 'Log symptoms today', pts: '+10 pts', emoji: '📝', desc: 'Consistent daily logs earn double on period days' },
                { title: 'Read cycle guide articles', pts: '+15 pts', emoji: '📖', desc: 'Complete bite-sized menstrual health reads' },
                { title: '7-day tracking streak', pts: '+50 pts', emoji: '🔥', desc: 'Keep track of consecutive cycle logs' },
              ].map(item => (
                <div
                  key={item.title}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 14,
                    padding: '12px 14px',
                    border: '1px solid #E8D0C8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 20 }}>{item.emoji}</span>
                    <div>
                      <h5 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#2D1820' }}>{item.title}</h5>
                      <p style={{ margin: '2px 0 0', fontSize: 11, color: '#7A4F5C' }}>{item.desc}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#9B3856' }}>{item.pts}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
