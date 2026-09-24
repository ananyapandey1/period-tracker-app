import React from 'react'
import { useApp } from '../context/AppContext'

export const ProfileModal: React.FC = () => {
  const { isProfileOpen, setIsProfileOpen, showToast } = useApp()

  if (!isProfileOpen) return null

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
      onClick={() => setIsProfileOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Profile and Settings"
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
              onClick={() => setIsProfileOpen(false)}
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
                Profile & Settings
              </h2>
              <span style={{ fontSize: 11, color: '#7A4F5C' }}>Manage account & cycle preferences</span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div style={{ padding: '20px 20px 32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* User Info Card */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 18,
              padding: '16px',
              border: '1px solid #E8D0C8',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #F2D5D0, #E8B87A)',
                border: '2px solid #F8C8DC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="14" r="7" fill="#7A4F5C" />
                <path d="M18 7C14 7 12 10 12 13C12 15 13 17 14.5 18C13.5 19 11 21 10 24C9 27 10 32 18 32C26 32 27 27 26 24C25 21 22.5 19 21.5 18C23 17 24 15 24 13C24 10 22 7 18 7Z" fill="#2D1820" fillOpacity="0.8" />
                <ellipse cx="18" cy="14" rx="5" ry="5.5" fill="#FFE2D6" />
                <path d="M14 11C15 9.5 17 9 18 9C19 9 21 9.5 22 11" stroke="#2D1820" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M11 26C11 22 14 21 18 21C22 21 25 22 25 26V30H11V26Z" fill="#F8C8DC" />
              </svg>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontFamily: 'Fraunces, Georgia, serif', fontWeight: 600, color: '#2D1820' }}>
                Sofia Sharma
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#7A4F5C' }}>Cycle: 28 days • Regular</p>
            </div>
          </div>

          {/* Settings list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Cycle & Period Parameters', sub: '28-day cycle, 5-day flow duration' },
              { label: 'Notifications & Daily Reminders', sub: 'Period predictions, fertile window alerts' },
              { label: 'Privacy & Data Encryption', sub: 'On-device private health record' },
              { label: 'Export Cycle Health Report', sub: 'Download PDF summary for your doctor' },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => showToast(`Updated ${item.label}`)}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 14,
                  padding: '12px 16px',
                  border: '1px solid #E8D0C8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#2D1820' }}>{item.label}</h4>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: '#7A4F5C' }}>{item.sub}</p>
                </div>
                <span style={{ fontSize: 14, color: '#7A4F5C' }}>›</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
