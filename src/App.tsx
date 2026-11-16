import React from "react"
import { AppProvider, useApp } from "./context/AppContext"
import HomeScreen from "./screens/HomeScreen"
import CalendarScreen from "./screens/CalendarScreen"
import LogScreen from "./screens/LogScreen"
import InsightsScreen from "./screens/InsightsScreen"
import OnboardingScreen from "./screens/OnboardingScreen"
import { SupportChatModal } from "./components/SupportChatModal"
import { ArticleReaderModal } from "./components/ArticleReaderModal"
import { RewardsModal } from "./components/RewardsModal"
import { ProfileModal } from "./components/ProfileModal"

type Tab = "home" | "calendar" | "log" | "insights"

interface NavTabItem {
  id: Tab
  label: string
}

const NAV_TABS: NavTabItem[] = [
  { id: "home", label: "Home" },
  { id: "calendar", label: "Calendar" },
  { id: "log", label: "Log" },
  { id: "insights", label: "Insights" },
]

function NavIcon({ name, active }: { name: Tab active: boolean }) {
  const strokeColor = active ? "#e75650" : "#8C6E79"
  const strokeWidth = active ? 2.1 : 1.8

  if (name === "home") {
    return (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M3 10.5L11.25 3.5C11.68 3.14 12.32 3.14 12.75 3.5L21 10.5V20C21 20.55 20.55 21 20 21H15V15.5C15 14.95 14.55 14.5 14 14.5H10C9.45 14.5 9 14.95 9 15.5V21H4C3.45 21 3 20.55 3 20V10.5Z"
          fill={active ? "rgba(231, 86, 80, 0.16)" : "none"}
        />
      </svg>
    )
  }

  if (name === "calendar") {
    return (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect
          x="3"
          y="4"
          width="18"
          height="17"
          rx="3.5"
          fill={active ? "rgba(231, 86, 80, 0.14)" : "none"}
        />
        <path d="M3 9.5H21" strokeWidth={strokeWidth} />
        <path d="M8 2V5.5M16 2V5.5" strokeWidth={2} />
        <circle cx="8" cy="14" r="1.2" fill={strokeColor} stroke="none" />
        <circle cx="12" cy="14" r="1.2" fill={strokeColor} stroke="none" />
        <circle cx="16" cy="14" r="1.2" fill={strokeColor} stroke="none" />
        <circle cx="12" cy="17.5" r="1.2" fill={strokeColor} stroke="none" />
      </svg>
    )
  }

  if (name === "log") {
    return (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M11.5 20H5C3.89543 20 3 19.1046 3 18V5C3 3.89543 3.89543 3 5 3H15C16.1046 3 17 3.89543 17 5V11"
          fill={active ? "rgba(231, 86, 80, 0.14)" : "none"}
        />
        <path d="M7 8H13" />
        <path d="M7 12H10.5" />
        <circle
          cx="17.5"
          cy="17.5"
          r="4.5"
          fill={active ? "#e75650" : "none"}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        <path
          d="M17.5 15.5V19.5M15.5 17.5H19.5"
          stroke={active ? "#FFFFFF" : strokeColor}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (name === "insights") {
    return (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 20H21" strokeWidth="1.5" />
        <rect
          x="5.5"
          y="11"
          width="3"
          height="9"
          rx="1.5"
          fill={active ? strokeColor : "none"}
        />
        <rect
          x="10.5"
          y="6"
          width="3"
          height="14"
          rx="1.5"
          fill={active ? strokeColor : "none"}
        />
        <rect
          x="15.5"
          y="13"
          width="3"
          height="7"
          rx="1.5"
          fill={active ? strokeColor : "none"}
        />
        <path
          d="M5 9L10.5 4.5L15 8L19.5 3.5"
          strokeWidth={active ? 2 : 1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return null
}

function AppMain() {
  const {
    activeTab,
    setActiveTab,
    toastMessage,
    isOnboardingOpen,
    setIsOnboardingOpen,
  } = useApp()

  const screens: Record<Tab, React.ReactNode> = {
    home: <HomeScreen onNavigate={setActiveTab} />,
    calendar: <CalendarScreen />,
    log: <LogScreen />,
    insights: <InsightsScreen />,
  }

  return (
    <div className="w-full min-h-screen bg-[#f0dedd] p-0 m-0 overflow-x-hidden sm:min-h-screen sm:flex sm:items-center sm:justify-center sm:p-6 sm:bg-[#f0dedd] box-border touch-manipulation">
      {/* Mobile Device Frame Mockup (Hidden bezel on mobile, phone frame on sm+) */}
      <div className="w-full min-h-screen h-[100dvh] max-w-full border-none rounded-none shadow-none bg-[#FDF6F0] relative flex flex-col font-['Outfit',system-ui,sans-serif] sm:min-h-0 sm:w-[412px] sm:h-[860px] sm:max-h-[92vh] sm:rounded-[44px] sm:border-[10px] sm:border-[#2D2327] sm:shadow-2xl sm:overflow-hidden sm:shrink-0">
        {isOnboardingOpen ? (
          <div className="flex-1 overflow-hidden relative">
            <OnboardingScreen onDismiss={() => setIsOnboardingOpen(false)} />
          </div>
        ) : (
          <>
            {/* Screen content with comfortable internal safe area padding */}
            <div className="flex-1 overflow-hidden relative pt-[max(env(safe-area-inset-top),0.75rem)] sm:pt-6">
              {screens[activeTab]}
            </div>

            {/* Senior Product Designer Redesigned Bottom Navigation Bar */}
            <nav
              role="tablist"
              aria-label="Main Navigation"
              style={{
                background: "rgba(253, 246, 240, 0.94)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderTop: "1px solid rgba(232, 208, 200, 0.75)",
                boxShadow: "0 -4px 24px rgba(45, 24, 32, 0.04)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                paddingTop: 8,
                paddingBottom: "max(env(safe-area-inset-bottom, 0px), 14px)",
                paddingLeft: 8,
                paddingRight: 8,
                flexShrink: 0,
                zIndex: 40,
              }}
              className="fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-0 sm:left-0 sm:right-0 w-full touch-manipulation select-none"
            >
              {NAV_TABS.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={isActive}
                    aria-label={tab.label}
                    onClick={() => setActiveTab(tab.id)}
                    className="group relative flex flex-col items-center justify-center flex-1 cursor-pointer border-none bg-transparent outline-none transition-transform duration-150 active:scale-95"
                    style={{
                      WebkitTapHighlightColor: "transparent",
                      padding: "4px 0",
                    }}
                  >
                    {/* Pill Icon Container */}
                    <div
                      style={{
                        width: 52,
                        height: 32,
                        borderRadius: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: isActive
                          ? "rgba(231, 86, 80, 0.12)"
                          : "transparent",
                        boxShadow: isActive
                          ? "0 2px 8px rgba(231, 86, 80, 0.12)"
                          : "none",
                        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      <NavIcon name={tab.id} active={isActive} />
                    </div>

                    {/* Tab Label */}
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? "#e75650" : "#8C6E79",
                        letterSpacing: "0.015em",
                        marginTop: 3,
                        transition: "color 0.2s ease",
                      }}
                    >
                      {tab.label}
                    </span>

                    {/* Active Micro-Dot Indicator */}
                    <div
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: "#e75650",
                        marginTop: 2,
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? "scale(1)" : "scale(0.3)",
                        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    />
                  </button>
                )
              })}
            </nav>
          </>
        )}

        {/* Global Toast Banner */}
        {toastMessage && (
          <div
            style={{
              position: "absolute",
              top: "max(env(safe-area-inset-top, 0px), 16px)",
              left: 20,
              right: 20,
              background: "#2D1820",
              color: "white",
              borderRadius: 14,
              padding: "10px 14px",
              fontSize: 12,
              fontWeight: 500,
              boxShadow: "0 8px 24px rgba(45,24,32,0.3)",
              zIndex: 90,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              animation: "fadeIn 0.2s ease",
            }}
          >
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modals */}
        <SupportChatModal />
        <ArticleReaderModal />
        <RewardsModal />
        <ProfileModal />
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
