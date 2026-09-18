import React from 'react'
import { AppProvider, useApp } from './context/AppContext'
import HomeScreen from './screens/HomeScreen'
import CalendarScreen from './screens/CalendarScreen'
import LogScreen from './screens/LogScreen'
import InsightsScreen from './screens/InsightsScreen'
import ShopScreen from './screens/ShopScreen'
import { CartModal } from './components/CartModal'
import { ProductDetailModal } from './components/ProductDetailModal'
import { SupportChatModal } from './components/SupportChatModal'
import { ArticleReaderModal } from './components/ArticleReaderModal'

type Tab = 'home' | 'calendar' | 'log' | 'insights' | 'shop'

function NavIcon({ name, active }: { name: string; active: boolean }) {
  const color = active ? '#e75650' : '#B89AA8'
  if (name === 'home')
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z" fill={active ? color : 'none'} stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    )
  if (name === 'calendar')
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="17" rx="2" stroke={color} strokeWidth="1.5" />
        <path d="M3 9H21" stroke={color} strokeWidth="1.5" />
        <path d="M8 2V6M16 2V6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        {active && <circle cx="8" cy="14" r="1.5" fill={color} />}
        {active && <circle cx="12" cy="14" r="1.5" fill={color} />}
        {active && <circle cx="16" cy="14" r="1.5" fill={color} />}
      </svg>
    )
  if (name === 'bar-chart')
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M18 3V21M12 8V21M6 13V21" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  if (name === 'shop')
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M6 2L3 6V20C3 20.55 3.45 21 4 21H20C20.55 21 21 20.55 21 20V6L18 2H6Z" fill={active ? color : 'none'} stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M3 6H21" stroke={color} strokeWidth="1.5" />
        <path d="M16 10C16 12.21 14.21 14 12 14C9.79 14 8 12.21 8 10" stroke={active ? 'white' : color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  return null
}

function AppMain() {
  const { activeTab, setActiveTab, toastMessage } = useApp()

  const screens: Record<Tab, React.ReactNode> = {
    home: <HomeScreen onNavigate={setActiveTab} />,
    calendar: <CalendarScreen />,
    log: <LogScreen />,
    insights: <InsightsScreen />,
    shop: <ShopScreen />,
  }

  return (
    <div
      style={{
        width: 390,
        height: 844,
        background: '#FDF6F0',
        borderRadius: 44,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 32px 80px rgba(231, 86, 80, 0.2), 0 0 0 12px #2D1820',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Outfit, system-ui, sans-serif',
      }}
    >
      {/* Status bar */}
      <div style={{ height: 44, background: '#FDF6F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', flexShrink: 0, zIndex: 10 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#2D1820' }}>9:41</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="#2D1820">
            <rect x="0" y="6" width="3" height="6" rx="1" />
            <rect x="4.5" y="4" width="3" height="8" rx="1" />
            <rect x="9" y="2" width="3" height="10" rx="1" />
            <rect x="13.5" y="0" width="3" height="12" rx="1" />
          </svg>
          <svg width="15" height="12" viewBox="0 0 15 12" fill="none" stroke="#2D1820" strokeWidth="1.5">
            <path d="M1 3.5C3.5 1.2 6.3 0 7.5 0C8.7 0 11.5 1.2 14 3.5" />
            <path d="M3 6C5 4.2 6.3 3.5 7.5 3.5C8.7 3.5 10 4.2 12 6" />
            <circle cx="7.5" cy="9" r="1.5" fill="#2D1820" />
          </svg>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
            <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="#2D1820" strokeOpacity="0.35" />
            <rect x="2" y="2" width="16" height="8" rx="2" fill="#2D1820" />
            <path d="M23 4.5V7.5C23.8 7.2 24.5 6.4 24.5 6C24.5 5.6 23.8 4.8 23 4.5Z" fill="#2D1820" fillOpacity="0.4" />
          </svg>
        </div>
      </div>

      {/* Screen content */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {screens[activeTab]}
      </div>

      {/* Global Toast Banner */}
      {toastMessage && (
        <div
          style={{
            position: 'absolute',
            top: 52,
            left: 20,
            right: 20,
            background: '#2D1820',
            color: 'white',
            borderRadius: 14,
            padding: '10px 14px',
            fontSize: 12,
            fontWeight: 500,
            boxShadow: '0 8px 24px rgba(45,24,32,0.3)',
            zIndex: 90,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <CartModal />
      <ProductDetailModal />
      <SupportChatModal />
      <ArticleReaderModal />

      {/* Bottom nav */}
      <div
        style={{
          height: 83,
          background: '#FDF6F0',
          borderTop: '1px solid #E8D0C8',
          display: 'flex',
          alignItems: 'flex-start',
          paddingTop: 8,
          paddingBottom: 20,
          paddingLeft: 4,
          paddingRight: 4,
          flexShrink: 0,
          gap: 0,
          zIndex: 10,
        }}
      >
        {/* Home & Calendar */}
        {(['home', 'calendar'] as Tab[]).map(id => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 0',
            }}
          >
            <NavIcon name={id === 'home' ? 'home' : 'calendar'} active={activeTab === id} />
            <span style={{ fontSize: 10, fontWeight: activeTab === id ? 600 : 400, color: activeTab === id ? '#e75650' : '#B89AA8', letterSpacing: 0.3 }}>
              {id === 'home' ? 'Home' : 'Calendar'}
            </span>
          </button>
        ))}

        {/* Log CTA */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 0 }}>
          <button
            onClick={() => setActiveTab('log')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                background: activeTab === 'log' ? 'linear-gradient(135deg, #b03e3a, #e75650)' : 'linear-gradient(135deg, #e75650, #f07060)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(231, 86, 80, 0.45)',
                marginTop: -12,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M11 4H4C3.45 4 3 4.45 3 5V20C3 20.55 3.45 21 4 21H19C19.55 21 20 20.55 20 20V13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <path
                  d="M18.5 2.5C19.3 1.7 20.7 1.7 21.5 2.5C22.3 3.3 22.3 4.7 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
                  fill="rgba(255,255,255,0.25)"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, color: activeTab === 'log' ? '#e75650' : '#B89AA8', letterSpacing: 0.3 }}>
              Log
            </span>
          </button>
        </div>

        {/* Insights & Shop */}
        {(['insights', 'shop'] as Tab[]).map(id => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 0',
            }}
          >
            <NavIcon name={id === 'insights' ? 'bar-chart' : 'shop'} active={activeTab === id} />
            <span style={{ fontSize: 10, fontWeight: activeTab === id ? 600 : 400, color: activeTab === id ? '#e75650' : '#B89AA8', letterSpacing: 0.3 }}>
              {id === 'insights' ? 'Insights' : 'Shop'}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppMain />
    </AppProvider>
  )
}
