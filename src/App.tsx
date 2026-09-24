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
import { RewardsModal } from './components/RewardsModal'
import { ProfileModal } from './components/ProfileModal'

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
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        backgroundColor: '#f0dedd',
        boxSizing: 'border-box',
      }}
    >
      {/* Mobile Device Frame Mockup */}
      <div
        style={{
          width: '100%',
          maxWidth: 390,
          height: 844,
          maxHeight: 'min(844px, 92vh)',
          background: '#FDF6F0',
          borderRadius: 48,
          overflow: 'hidden',
          position: 'relative',
          border: '10px solid #2D1820',
          boxShadow: '0 24px 60px rgba(45, 24, 32, 0.22), 0 12px 28px rgba(231, 86, 80, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Outfit, system-ui, sans-serif',
          flexShrink: 0,
        }}
      >
        {/* Screen content with comfortable internal safe area padding */}
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
            position: 'relative',
            paddingTop: 'max(env(safe-area-inset-top, 0px), 24px)',
          }}
        >
          {screens[activeTab]}
        </div>

      {/* Global Toast Banner */}
      {toastMessage && (
        <div
          style={{
            position: 'absolute',
            top: 24,
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
      <RewardsModal />
      <ProfileModal />

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
