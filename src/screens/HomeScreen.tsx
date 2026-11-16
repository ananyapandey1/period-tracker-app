import { useState, useRef, useEffect } from "react"
import { useApp, ARTICLES } from "../context/AppContext"
import { formatHeaderDate, getTodayDateString } from "../utils/dateUtils"
import {
  getCycleState,
  getRingCenterText,
  CyclePhase,
  PHASE_COLORS,
  PHASE_CARD_DATA,
  PHASE_DEFINITIONS,
  getGoalTipsForPhase,
} from "../utils/cycleEngine"

type Tab = "home" | "calendar" | "log" | "insights"

const QUICK_SYMPTOMS_CONFIG = [
  { id: "cramps", label: "Cramps", emoji: "😣" },
  { id: "bloating", label: "Bloating", emoji: "🎈" },
  { id: "headache", label: "Headache", emoji: "🤕" },
  { id: "tired", label: "Fatigue", emoji: "🥱" },
  { id: "energized", label: "Energized", emoji: "⚡" },
  { id: "tender", label: "Tender", emoji: "💗" },
]

export default function HomeScreen({
  onNavigate,
}: {
  onNavigate: (tab: Tab) => void
}) {
  const {
    setIsProfileOpen,
    setSelectedArticle,
    showToast,
    restartOnboarding,
    lastPeriodStartDate,
    logEntries,
    userProfile,
  } = useApp()
  const [activeSymptoms, setActiveSymptoms] = useState<string[]>([])
  const phaseCardRef = useRef<HTMLDivElement>(null)

  const todayStr = getTodayDateString()
  const todayLog = logEntries?.[todayStr]
  const isPeriodLogged = Boolean(todayLog?.flow && todayLog.flow !== "None")

  const userCycleLength = userProfile?.cycleLength || 28
  const userPeriodDuration = userProfile?.periodDuration || 5
  const userBirthday = userProfile?.birthday

  // P0: Single source of truth for all cycle and phase calculations
  const cycleStatus = getCycleState(
    lastPeriodStartDate,
    userCycleLength,
    new Date(),
    14,
    {
      isPeriodLogged,
      periodDuration: userPeriodDuration,
      birthday: userBirthday,
    },
  )
  const currentPhase = cycleStatus.phase.name

  // Dynamic Ring Arc Calculations calibrated to user's personalized cycle & period lengths
  const ringCircumference = 2 * Math.PI * 86 // ~540.35
  const ovDay = Math.max(1, userCycleLength - 14)
  const menstrualDays = Math.max(1, Math.min(userPeriodDuration, ovDay - 1))
  const follicularDays = Math.max(1, ovDay - 1 - menstrualDays)
  const ovulationDays = 2
  const lutealDays = Math.max(
    1,
    userCycleLength - menstrualDays - follicularDays - ovulationDays,
  )

  const mLen = (menstrualDays / userCycleLength) * ringCircumference
  const fLen = (follicularDays / userCycleLength) * ringCircumference
  const oLen = (ovulationDays / userCycleLength) * ringCircumference
  const lLen = (lutealDays / userCycleLength) * ringCircumference

  const fOffset = -mLen
  const oOffset = -(mLen + fLen)
  const lOffset = -(mLen + fLen + oLen)

  const dayRotation = Math.round(
    ((cycleStatus.currentCycleDay - 0.5) / userCycleLength) * 360,
  )

  // Clinical conditional copy helper for ring center text
  const getRingCenterTextCopy = () => {
    return getRingCenterText(
      currentPhase,
      cycleStatus.currentCycleDay,
      cycleStatus.daysUntilNextPeriod,
      isPeriodLogged,
    )
  }

  // Issue 3: Explicit tap-to-view state. Default is null (today's actual phase)
  const [previewedPhase, setPreviewedPhase] = useState<CyclePhase | null>(null)

  // Issue 3: Always reset to today's phase on mount/return visits
  useEffect(() => {
    setPreviewedPhase(null)
  }, [])

  const activeDisplayPhase = previewedPhase ?? currentPhase
  const isPreviewing =
    previewedPhase !== null && previewedPhase !== currentPhase
  const phaseCardContent = PHASE_CARD_DATA[activeDisplayPhase]

  const handleSelectPhase = (phase: CyclePhase) => {
    setPreviewedPhase(phase)
    // Auto-scroll to the Phase card on tap
    if (phaseCardRef.current) {
      phaseCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      })
    }
  }

  const toggleSymptom = (id: string) => {
    setActiveSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    )
  }

  const handleReadArticle = () => {
    const article =
      ARTICLES.find((a) => a.id === phaseCardContent.articleId) || ARTICLES[0]
    setSelectedArticle(article)
  }

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        background: "#FDF6F0",
        position: "relative",
        paddingBottom: 120,
      }}
    >
      {/* SECTION 1: HEADER */}
      <div style={{ padding: "8px 24px 0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "#B89AA8",
                fontWeight: 400,
              }}
            >
              Good morning,
            </p>
            <h1
              style={{
                margin: "2px 0 0",
                fontSize: 24,
                fontFamily: "Fraunces, Georgia, serif",
                fontWeight: 400,
                color: "#2D1820",
                lineHeight: 1.2,
              }}
            >
              {userProfile?.name || "Sofia"}
            </h1>
          </div>

          {/* User Profile Avatar */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              aria-label="Profile settings"
              onClick={() => setIsProfileOpen(true)}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #FDE8E5, #FAD2CE)",
                  border: "1.5px solid #F0C4C0",
                  boxShadow: "0 2px 8px rgba(231,86,80,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                  {/* Hair back */}
                  <path
                    d="M12 28C10 22 10 14 14 10C18 6 26 6 30 10C34 14 34 22 32 28C28 26 16 26 12 28Z"
                    fill="#3D1C14"
                  />
                  {/* Neck */}
                  <rect
                    x="19"
                    y="27"
                    width="6"
                    height="8"
                    rx="3"
                    fill="#D49B80"
                  />
                  {/* Face */}
                  <ellipse cx="22" cy="20" rx="7.5" ry="8.5" fill="#E8B49B" />
                  {/* Hair front / bangs */}
                  <path
                    d="M14 14C16 11 20 10 23 10C27 10 30 12 30 15C27 13 23 13 20 15C17 17 15 17 14 14Z"
                    fill="#4E2318"
                  />
                  <path
                    d="M14.5 15C14 17 14 20 14 22C15 22 15.5 19 16 17"
                    stroke="#4E2318"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                  <path
                    d="M29.5 15C30 17 30 20 30 22C29 22 28.5 19 28 17"
                    stroke="#4E2318"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                  {/* Cheeks blush */}
                  <circle
                    cx="17.5"
                    cy="22"
                    r="1.5"
                    fill="#EFAAA0"
                    opacity="0.6"
                  />
                  <circle
                    cx="26.5"
                    cy="22"
                    r="1.5"
                    fill="#EFAAA0"
                    opacity="0.6"
                  />
                  {/* Eyes (soft closed lashes) */}
                  <path
                    d="M17 19.5C17.5 20.5 19 20.5 19.5 19.5"
                    stroke="#3D1C14"
                    strokeWidth="0.9"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M24.5 19.5C25 20.5 26.5 20.5 27 19.5"
                    stroke="#3D1C14"
                    strokeWidth="0.9"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Smile */}
                  <path
                    d="M20.5 24C21.2 24.8 22.8 24.8 23.5 24"
                    stroke="#A85848"
                    strokeWidth="0.9"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Top / shoulders */}
                  <path
                    d="M13 36C13 32 17 30 22 30C27 30 31 32 31 36V44H13V36Z"
                    fill="#D46A6A"
                  />
                  <path
                    d="M18 30C19 32 21 33 22 33C23 33 25 32 26 30"
                    stroke="#E8B49B"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: CYCLE DIAL & RING COMPONENT (Issue 2 & Issue 3) */}
      <div
        style={{
          padding: "16px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 220,
            height: 220,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setPreviewedPhase(null)}
          role="button"
          aria-label="Cycle ring dial. Tap center to return to today"
        >
          <svg width="220" height="220" viewBox="0 0 220 220">
            {/* Base Ring Track */}
            <circle
              cx="110"
              cy="110"
              r="86"
              fill="none"
              stroke="#E8D0C8"
              strokeWidth="14"
            />

            {/* Menstrual Phase Arc */}
            <circle
              cx="110"
              cy="110"
              r="86"
              fill="none"
              stroke={PHASE_COLORS.Menstrual}
              strokeWidth={activeDisplayPhase === "Menstrual" ? 18 : 14}
              strokeLinecap="round"
              strokeDasharray={`${mLen.toFixed(1)} ${(ringCircumference - mLen).toFixed(1)}`}
              strokeDashoffset="0"
              transform="rotate(-90 110 110)"
              onClick={(e) => {
                e.stopPropagation()
                handleSelectPhase("Menstrual")
              }}
              style={{
                cursor: "pointer",
                transition:
                  "stroke-width 0.2s ease, stroke-dasharray 0.3s ease",
              }}
            />

            {/* Follicular Phase Arc */}
            <circle
              cx="110"
              cy="110"
              r="86"
              fill="none"
              stroke={PHASE_COLORS.Follicular}
              strokeWidth={activeDisplayPhase === "Follicular" ? 18 : 14}
              strokeLinecap="round"
              strokeDasharray={`${fLen.toFixed(1)} ${(ringCircumference - fLen).toFixed(1)}`}
              strokeDashoffset={`${fOffset.toFixed(1)}`}
              transform="rotate(-90 110 110)"
              onClick={(e) => {
                e.stopPropagation()
                handleSelectPhase("Follicular")
              }}
              style={{
                cursor: "pointer",
                transition:
                  "stroke-width 0.2s ease, stroke-dasharray 0.3s ease",
              }}
            />

            {/* Ovulation Phase Arc */}
            <circle
              cx="110"
              cy="110"
              r="86"
              fill="none"
              stroke={PHASE_COLORS.Ovulation}
              strokeWidth={activeDisplayPhase === "Ovulation" ? 18 : 14}
              strokeLinecap="round"
              strokeDasharray={`${oLen.toFixed(1)} ${(ringCircumference - oLen).toFixed(1)}`}
              strokeDashoffset={`${oOffset.toFixed(1)}`}
              transform="rotate(-90 110 110)"
              onClick={(e) => {
                e.stopPropagation()
                handleSelectPhase("Ovulation")
              }}
              style={{
                cursor: "pointer",
                transition:
                  "stroke-width 0.2s ease, stroke-dasharray 0.3s ease",
              }}
            />

            {/* Luteal Phase Arc */}
            <circle
              cx="110"
              cy="110"
              r="86"
              fill="none"
              stroke={PHASE_COLORS.Luteal}
              strokeWidth={activeDisplayPhase === "Luteal" ? 18 : 14}
              strokeLinecap="round"
              strokeDasharray={`${lLen.toFixed(1)} ${(ringCircumference - lLen).toFixed(1)}`}
              strokeDashoffset={`${lOffset.toFixed(1)}`}
              transform="rotate(-90 110 110)"
              onClick={(e) => {
                e.stopPropagation()
                handleSelectPhase("Luteal")
              }}
              style={{
                cursor: "pointer",
                transition:
                  "stroke-width 0.2s ease, stroke-dasharray 0.3s ease",
              }}
            />

            {/* Current Day Marker Dot on Track (Dynamic angle along personalized circumference) */}
            <circle
              cx="110"
              cy="24"
              r="6.5"
              fill="#F8C8DC"
              stroke="#2D1820"
              strokeWidth="2.5"
              transform={`rotate(${dayRotation} 110 110)`}
            />
          </svg>

          {/* Issue 2: Central Ring Typography with generous inset and Pill Badge */}
          <div
            style={{
              position: "absolute",
              inset: 30,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "0 8px",
              pointerEvents: "none",
            }}
          >
            {/* Top Line: Real-time dynamic date with ample margin from track */}
            <span
              style={{
                fontSize: 12.5,
                fontWeight: 500,
                color: "#7A4F5C",
                letterSpacing: 0.2,
                margin: 0,
              }}
            >
              {formatHeaderDate(new Date())}
            </span>

            {/* Primary Highlight: Dynamic Days until next period / Active period day from single source of truth */}
            <span
              style={{
                fontSize: 16.5,
                fontFamily: "Fraunces, Georgia, serif",
                fontWeight: 700,
                color: "#2D1820",
                lineHeight: 1.22,
                margin: "4px 0 2px",
              }}
            >
              {getRingCenterTextCopy()}
            </span>

            {/* Issue 2: Restored Pill Badge treatment for maximum legibility */}
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                color: cycleStatus.phase.color,
                background: PHASE_DEFINITIONS[cycleStatus.phase.name].lightBg,
                border: `1px solid ${cycleStatus.phase.color}35`,
                borderRadius: 16,
                padding: "3px 10px",
                letterSpacing: "0.02em",
                textTransform: "capitalize",
                marginTop: 4,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                whiteSpace: "nowrap",
                boxShadow: "0 1px 4px rgba(45,24,32,0.04)",
              }}
            >
              {cycleStatus.phase.name} phase
            </span>
          </div>
        </div>

        {/* Issue 1: UNIFORM SHAPE LEGEND (Solid circle dots for all items with matching shared tokens) */}
        <div
          role="region"
          aria-label="Cycle ring phase legend"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "nowrap",
            gap: 8,
            marginTop: 14,
            width: "100%",
            padding: "0 8px",
          }}
        >
          {[
            {
              key: "Menstrual" as CyclePhase,
              label: "Menstrual",
              color: PHASE_COLORS.Menstrual,
            },
            {
              key: "Follicular" as CyclePhase,
              label: "Follicular",
              color: PHASE_COLORS.Follicular,
            },
            {
              key: "Ovulation" as CyclePhase,
              label: "Ovulation",
              color: PHASE_COLORS.Ovulation,
            },
            {
              key: "Luteal" as CyclePhase,
              label: "Luteal",
              color: PHASE_COLORS.Luteal,
            },
          ].map((phase) => {
            const isSelected = activeDisplayPhase === phase.key
            return (
              <button
                key={phase.key}
                onClick={() => handleSelectPhase(phase.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4.5,
                  background: isSelected ? "#F2E8E2" : "transparent",
                  border: isSelected
                    ? "1px solid #E0CCC2"
                    : "1px solid transparent",
                  padding: isSelected ? "2px 7px" : "2px 3px",
                  cursor: "pointer",
                  borderRadius: 14,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  transition: "all 0.15s ease",
                }}
                aria-label={`View ${phase.label} phase`}
              >
                {/* Uniform solid circular dot across all 4 items */}
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: phase.color,
                    flexShrink: 0,
                    boxShadow: isSelected
                      ? `0 0 0 1.5px ${phase.color}44`
                      : "none",
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    color: isSelected ? "#2D1820" : "#7A4F5C",
                    fontWeight: isSelected ? 700 : 500,
                    whiteSpace: "nowrap",
                  }}
                >
                  {phase.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* SECTION 3: QUICK SYMPTOMS LOG (Temporarily hidden) */}
      {false && (
        <div style={{ padding: "0 24px 20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 600,
                color: "#2D1820",
              }}
            >
              Tap to log quick symptoms
            </h3>
            <button
              onClick={() => onNavigate("log")}
              style={{
                background: "none",
                border: "none",
                fontSize: 12,
                color: "#9B3856",
                fontWeight: 500,
                cursor: "pointer",
                padding: 0,
                minWidth: 44,
                minHeight: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              Full log →
            </button>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 8,
            }}
          >
            {QUICK_SYMPTOMS_CONFIG.map((s) => {
              const isActive = activeSymptoms.includes(s.id)
              return (
                <button
                  key={s.id}
                  onClick={() => toggleSymptom(s.id)}
                  aria-label={`Toggle symptom ${s.label}`}
                  style={{
                    borderRadius: 12,
                    padding: "10px 8px",
                    background: isActive ? "#F8C8DC" : "#F7EDE8",
                    border: `1px solid ${isActive ? "#F8C8DC" : "#E8D0C8"}`,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    minHeight: 44,
                    color: isActive ? "#2D1820" : "#7A4F5C",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: 20, lineHeight: 1 }}>
                      {s.emoji}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: isActive ? "#2D1820" : "#7A4F5C",
                    }}
                  >
                    {s.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* SECTION 4: UPCOMING PHASES */}
      <div style={{ padding: "0 24px 20px" }}>
        <h3
          style={{
            margin: "0 0 12px",
            fontSize: 14,
            fontWeight: 600,
            color: "#2D1820",
          }}
        >
          Upcoming phases
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {cycleStatus.upcomingPhases.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                background: "#F7EDE8",
                borderRadius: 12,
                border: "1px solid #E8D0C8",
                minHeight: 44,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* Dot using exact shared color token from ring */}
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: item.color,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{ fontSize: 13, color: "#2D1820", fontWeight: 500 }}
                >
                  {item.label}
                </span>
              </div>
              <span style={{ fontSize: 12, color: "#7A4F5C", fontWeight: 500 }}>
                {item.dateStr}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: CONSOLIDATED PHASE CARD (Issue 3: Ref attached, explicit preview state & return affordance) */}
      <div ref={phaseCardRef} style={{ padding: "0 24px 32px" }}>
        <div
          style={{
            background: "#F7EDE8",
            borderRadius: 16,
            padding: "16px 18px",
            border: isPreviewing
              ? `1.5px solid ${PHASE_COLORS[activeDisplayPhase]}`
              : "1px solid #E8D0C8",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            transition: "border 0.2s ease",
          }}
        >
          {/* Issue 3: Explicit "Viewing another phase" indicator with clear "Back to today" action */}
          {isPreviewing && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#FFFDFB",
                border: `1px solid ${PHASE_COLORS[activeDisplayPhase]}55`,
                borderRadius: 10,
                padding: "6px 10px",
                margin: "-4px -2px 0",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: PHASE_COLORS[activeDisplayPhase],
                  letterSpacing: 0.3,
                }}
              >
                Viewing: {phaseCardContent.title} (Preview)
              </span>
              <button
                onClick={() => setPreviewedPhase(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#9B3856",
                  cursor: "pointer",
                  padding: "2px 4px",
                  textDecoration: "underline",
                }}
                aria-label="Return to today's phase view"
              >
                Back to today →
              </button>
            </div>
          )}

          {/* Internal Section 1: Phase Name & Plain-English Summary */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: PHASE_COLORS[activeDisplayPhase],
                  flexShrink: 0,
                }}
              />
              <h3
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontFamily: "Fraunces, Georgia, serif",
                  fontWeight: 600,
                  color: "#2D1820",
                }}
              >
                {phaseCardContent.title}
              </h3>
            </div>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: 12.5,
                color: "#7A4F5C",
                lineHeight: 1.5,
              }}
            >
              {phaseCardContent.summary}
            </p>
          </div>

          {/* Internal Section 2: "What you might feel" Symptom List */}
          <div style={{ borderTop: "1px solid #E8D0C8", paddingTop: 12 }}>
            <p
              style={{
                margin: "0 0 8px",
                fontSize: 12,
                fontWeight: 600,
                color: "#2D1820",
                letterSpacing: 0.2,
              }}
            >
              What you might feel
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {phaseCardContent.symptoms.map((symptom, idx) => (
                <div
                  key={idx}
                  style={{ display: "flex", alignItems: "flex-start", gap: 8 }}
                >
                  <span
                    style={{
                      color: PHASE_COLORS[activeDisplayPhase],
                      fontSize: 13,
                      lineHeight: 1.4,
                    }}
                  >
                    •
                  </span>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      color: "#7A4F5C",
                      lineHeight: 1.45,
                    }}
                  >
                    {symptom}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Internal Section 2.5: Goal Focus Tip (Personalized from onboarding selections) */}
          {(() => {
            const tips = getGoalTipsForPhase(
              activeDisplayPhase,
              userProfile?.goals || [],
            )
            if (tips.length === 0) return null
            const primaryTip = tips[0]
            return (
              <div style={{ borderTop: "1px solid #E8D0C8", paddingTop: 12 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontSize: 14 }}>{primaryTip.icon}</span>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#2D1820",
                      letterSpacing: 0.2,
                    }}
                  >
                    Your Goal Focus: {primaryTip.title}
                  </p>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    color: "#7A4F5C",
                    lineHeight: 1.45,
                  }}
                >
                  {primaryTip.text}
                </p>
              </div>
            )
          })()}

          {/* Internal Section 3: Read More Link */}
          <div
            style={{
              borderTop: "1px solid #E8D0C8",
              paddingTop: 10,
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <button
              onClick={handleReadArticle}
              style={{
                background: "none",
                border: "none",
                fontSize: 12,
                color: "#9B3856",
                fontWeight: 600,
                cursor: "pointer",
                padding: "4px 0",
                minHeight: 40,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {phaseCardContent.articleLinkText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
