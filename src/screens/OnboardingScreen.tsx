import React, { useState } from "react"
import { useApp, UserProfile } from "../context/AppContext"

interface OnboardingScreenProps {
  onDismiss?: () => void
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onDismiss,
}) => {
  const { userProfile, completeOnboarding, setIsOnboardingOpen } = useApp()

  const [step, setStep] = useState<1 | 2 | 3>(1)

  // Draft state initialized from current userProfile or defaults
  const [name, setName] = useState(userProfile.name || "")
  const [birthday, setBirthday] = useState(userProfile.birthday || "")
  const [lastPeriodDate, setLastPeriodDate] = useState(
    userProfile.lastPeriodDate || "",
  )
  const [selectedChip, setSelectedChip] = useState<string | null>(null)
  const [periodDuration, setPeriodDuration] = useState<number>(
    userProfile.periodDuration || 5,
  )
  const [cycleLength, setCycleLength] = useState<number>(
    userProfile.cycleLength || 28,
  )
  const [isCycleIrregular, setIsCycleIrregular] = useState<boolean>(false)
  const [goals, setGoals] = useState<string[]>(
    userProfile.goals && userProfile.goals.length > 0
      ? userProfile.goals
      : ["predictions", "cramps", "energy"],
  )

  // Quick chips for last period date
  const handleChipSelect = (
    type: "weekAgo" | "twoWeeksAgo" | "monthAgo" | "custom",
  ) => {
    setSelectedChip(type)
    const today = new Date()
    let target = new Date(today)

    if (type === "weekAgo") {
      target.setDate(today.getDate() - 7)
    } else if (type === "twoWeeksAgo") {
      target.setDate(today.getDate() - 14)
    } else if (type === "monthAgo") {
      target.setDate(today.getDate() - 28)
    } else {
      return // Keep manual input
    }

    const y = target.getFullYear()
    const m = String(target.getMonth() + 1).padStart(2, "0")
    const d = String(target.getDate()).padStart(2, "0")
    setLastPeriodDate(`${y}-${m}-${d}`)
  }

  const toggleGoal = (id: string) => {
    setGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    )
  }

  const handleNext = () => {
    if (step === 1) {
      if (!name.trim()) return
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    } else {
      handleFinalSubmit()
    }
  }

  const handleBack = () => {
    if (step === 2) setStep(1)
    if (step === 3) setStep(2)
  }

  const handleFinalSubmit = () => {
    const finalDate = lastPeriodDate || "2026-10-31"
    completeOnboarding({
      name: name.trim() || "Sofia",
      birthday,
      lastPeriodDate: finalDate,
      cycleLength: isCycleIrregular ? 28 : cycleLength,
      periodDuration,
      goals,
      isCycleIrregular,
    })
  }

  const handleSkip = () => {
    if (onDismiss) {
      onDismiss()
    } else {
      setIsOnboardingOpen(false)
    }
  }

  const TRACKING_GOALS = [
    {
      id: "predictions",
      icon: "🩸",
      title: "Period & Fertile Window Alerts",
      desc: "Smart, science-backed forecasts for your next period, PMS, and peak ovulation.",
    },
    {
      id: "energy",
      icon: "⚡",
      title: "Hormonal Energy & Mood Syncing",
      desc: "Plan workouts, productive sprints, and social time around your natural phases.",
    },
    {
      id: "cramps",
      icon: "🍵",
      title: "Cramps & Natural Pain Relief",
      desc: "Gentle heat therapies, nutritional magnesium, and doctor-approved comfort.",
    },
    {
      id: "skin",
      icon: "🌸",
      title: "Skin Health & Water Retention",
      desc: "Anticipate luteal bloating and cyclical hormonal skin breakouts.",
    },
    {
      id: "sleep",
      icon: "🌙",
      title: "Restorative Sleep & Recovery",
      desc: "Bedtime wind-down guidance tailored to progesterone shifts.",
    },
  ]

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#FDF6F0",
        fontFamily: "'Outfit', system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top Header Bar */}
      <header
        style={{
          padding: "16px 20px 10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        {/* Back Button or Placeholder */}
        <div style={{ width: 40, display: "flex", alignItems: "center" }}>
          {step > 1 ? (
            <button
              onClick={handleBack}
              aria-label="Go back to previous step"
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "#F7EDE8",
                border: "1px solid #E8D0C8",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                color: "#2D1820",
                transition: "background-color 0.15s ease",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2D1820"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            <div style={{ width: 38, height: 38 }} />
          )}
        </div>

        {/* 3-Step Segmented Capsule Progress Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {[1, 2, 3].map((s) => {
            const isCompletedOrActive = s <= step
            return (
              <div
                key={s}
                style={{
                  width: s === step ? 36 : 22,
                  height: 5,
                  borderRadius: 9999,
                  background: isCompletedOrActive
                    ? "linear-gradient(90deg, #e75650, #f07060)"
                    : "#E8D0C8",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
            )
          })}
        </div>

        {/* Skip to Dashboard link */}
        <div style={{ width: 50, textAlign: "right" }}>
          <button
            onClick={handleSkip}
            style={{
              background: "none",
              border: "none",
              color: "#7A4F5C",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              padding: "6px 0",
            }}
          >
            Skip
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px 24px 24px",
          display: "flex",
          flexDirection: "column",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* STEP 1: WELCOME & ABOUT YOU */}
        {step === 1 && (
          <div style={{ animation: "fadeIn 0.25s ease-out" }}>
            {/* Illustrated Sofia Brand Avatar */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "8px 0 16px",
              }}
            >
              <div
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #FDE8E5, #FAD2CE)",
                  border: "2px solid #F0C4C0",
                  boxShadow: "0 6px 20px rgba(231,86,80,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <svg width="64" height="64" viewBox="0 0 44 44" fill="none">
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
                  {/* Eyes */}
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
            </div>

            {/* Pill Tag */}
            <div style={{ textAlign: "center", marginBottom: 6 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "#e75650",
                  textTransform: "uppercase",
                  background: "rgba(231, 86, 80, 0.12)",
                  padding: "4px 12px",
                  borderRadius: 9999,
                  display: "inline-block",
                }}
              >
                Step 1 of 3 • About You
              </span>
            </div>

            {/* Title & Subtitle */}
            <h1
              style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontSize: 25,
                fontWeight: 600,
                color: "#2D1820",
                textAlign: "center",
                margin: "8px 0 6px",
                lineHeight: 1.25,
              }}
            >
              Welcome to your cycle sanctuary
            </h1>
            <p
              style={{
                fontSize: 13.5,
                color: "#7A4F5C",
                textAlign: "center",
                margin: "0 auto 24px",
                maxWidth: 320,
                lineHeight: 1.45,
              }}
            >
              Let's personalize your greeting, hormonal baseline, and natural
              rhythm predictions.
            </p>

            {/* Form Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Name Field */}
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 20,
                  padding: "16px",
                  border: "1.5px solid #E8D0C8",
                  boxShadow: "0 2px 10px rgba(45,24,32,0.03)",
                }}
              >
                <label
                  htmlFor="onboarding-name"
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#2D1820",
                    marginBottom: 6,
                  }}
                >
                  What should we call you?{" "}
                  <span style={{ color: "#e75650" }}>*</span>
                </label>
                <input
                  id="onboarding-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sofia"
                  autoFocus
                  style={{
                    width: "100%",
                    height: 48,
                    borderRadius: 14,
                    border: "1px solid #E8D0C8",
                    padding: "0 14px",
                    fontSize: 15,
                    fontFamily: "inherit",
                    color: "#2D1820",
                    outline: "none",
                    background: "#FDF6F0",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#e75650")}
                  onBlur={(e) => (e.target.style.borderColor = "#E8D0C8")}
                />
                <span
                  style={{
                    display: "block",
                    fontSize: 11,
                    color: "#B89AA8",
                    marginTop: 6,
                  }}
                >
                  Your name is kept strictly private on your device.
                </span>
              </div>

              {/* Birthday Field */}
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 20,
                  padding: "16px",
                  border: "1.5px solid #E8D0C8",
                  boxShadow: "0 2px 10px rgba(45,24,32,0.03)",
                }}
              >
                <label
                  htmlFor="onboarding-birthday"
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#2D1820",
                    marginBottom: 6,
                  }}
                >
                  When is your birthday?{" "}
                  <span
                    style={{ fontSize: 11, color: "#B89AA8", fontWeight: 400 }}
                  >
                    (Optional)
                  </span>
                </label>
                <input
                  id="onboarding-birthday"
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  style={{
                    width: "100%",
                    height: 48,
                    borderRadius: 14,
                    border: "1px solid #E8D0C8",
                    padding: "0 14px",
                    fontSize: 14,
                    fontFamily: "inherit",
                    color: "#2D1820",
                    outline: "none",
                    background: "#FDF6F0",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#e75650")}
                  onBlur={(e) => (e.target.style.borderColor = "#E8D0C8")}
                />
                <span
                  style={{
                    display: "block",
                    fontSize: 11,
                    color: "#B89AA8",
                    marginTop: 6,
                  }}
                >
                  Used to calibrate age-specific luteal and follicular
                  baselines.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CYCLE RHYTHMS & TIMING */}
        {step === 2 && (
          <div style={{ animation: "fadeIn 0.25s ease-out" }}>
            {/* Pill Tag */}
            <div style={{ textAlign: "center", marginBottom: 6, marginTop: 4 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "#e75650",
                  textTransform: "uppercase",
                  background: "rgba(231, 86, 80, 0.12)",
                  padding: "4px 12px",
                  borderRadius: 9999,
                  display: "inline-block",
                }}
              >
                Step 2 of 3 • Cycle Rhythms
              </span>
            </div>

            {/* Title & Subtitle */}
            <h1
              style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontSize: 25,
                fontWeight: 600,
                color: "#2D1820",
                textAlign: "center",
                margin: "8px 0 6px",
                lineHeight: 1.25,
              }}
            >
              When did your last period start?
            </h1>
            <p
              style={{
                fontSize: 13.5,
                color: "#7A4F5C",
                textAlign: "center",
                margin: "0 auto 20px",
                maxWidth: 320,
                lineHeight: 1.45,
              }}
            >
              An estimate works great if you don't recall the exact day.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Last Period Card */}
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 20,
                  padding: "16px",
                  border: "1.5px solid #E8D0C8",
                  boxShadow: "0 2px 10px rgba(45,24,32,0.03)",
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#2D1820",
                    marginBottom: 10,
                  }}
                >
                  Quick select or pick date:
                </span>

                {/* Quick Chips */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  {[
                    { id: "weekAgo", label: "1 week ago" },
                    { id: "twoWeeksAgo", label: "2 weeks ago" },
                    { id: "monthAgo", label: "~1 month ago" },
                    { id: "custom", label: "Exact Date 📅" },
                  ].map((chip) => {
                    const isSelected = selectedChip === chip.id
                    return (
                      <button
                        key={chip.id}
                        type="button"
                        onClick={() => handleChipSelect(chip.id as any)}
                        style={{
                          padding: "10px 12px",
                          borderRadius: 14,
                          fontSize: 13,
                          fontWeight: isSelected ? 600 : 500,
                          background: isSelected
                            ? "rgba(231, 86, 80, 0.12)"
                            : "#F7EDE8",
                          border: isSelected
                            ? "1.5px solid #e75650"
                            : "1px solid #E8D0C8",
                          color: isSelected ? "#e75650" : "#7A4F5C",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                          textAlign: "center",
                        }}
                      >
                        {chip.label}
                      </button>
                    )
                  })}
                </div>

                {/* Date Input */}
                <input
                  type="date"
                  value={lastPeriodDate}
                  onChange={(e) => {
                    setLastPeriodDate(e.target.value)
                    setSelectedChip("custom")
                  }}
                  style={{
                    width: "100%",
                    height: 48,
                    borderRadius: 14,
                    border: "1px solid #E8D0C8",
                    padding: "0 14px",
                    fontSize: 14,
                    fontFamily: "inherit",
                    color: "#2D1820",
                    outline: "none",
                    background: "#FDF6F0",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#e75650")}
                  onBlur={(e) => (e.target.style.borderColor = "#E8D0C8")}
                />
              </div>

              {/* Bleeding Duration Card */}
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 20,
                  padding: "16px",
                  border: "1.5px solid #E8D0C8",
                  boxShadow: "0 2px 10px rgba(45,24,32,0.03)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{ fontSize: 13, fontWeight: 600, color: "#2D1820" }}
                  >
                    Typical bleeding duration:
                  </span>
                  <span
                    style={{ fontSize: 13, fontWeight: 700, color: "#e75650" }}
                  >
                    {periodDuration} days
                  </span>
                </div>

                <div style={{ display: "flex", gap: 6 }}>
                  {[3, 4, 5, 6, 7].map((days) => {
                    const isSelected = periodDuration === days
                    return (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setPeriodDuration(days)}
                        style={{
                          flex: 1,
                          padding: "10px 0",
                          borderRadius: 12,
                          fontSize: 13,
                          fontWeight: isSelected ? 700 : 500,
                          background: isSelected
                            ? "linear-gradient(135deg, #e75650, #f07060)"
                            : "#F7EDE8",
                          color: isSelected ? "#FFFFFF" : "#7A4F5C",
                          border: isSelected ? "none" : "1px solid #E8D0C8",
                          cursor: "pointer",
                          boxShadow: isSelected
                            ? "0 2px 8px rgba(231,86,80,0.3)"
                            : "none",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {days}d
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Cycle Length Card */}
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 20,
                  padding: "16px",
                  border: "1.5px solid #E8D0C8",
                  boxShadow: "0 2px 10px rgba(45,24,32,0.03)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{ fontSize: 13, fontWeight: 600, color: "#2D1820" }}
                  >
                    Average cycle length:
                  </span>
                  <span
                    style={{ fontSize: 13, fontWeight: 700, color: "#e75650" }}
                  >
                    {isCycleIrregular ? "Irregular" : `${cycleLength} days`}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: 6,
                  }}
                >
                  {[26, 28, 30, 32].map((days) => {
                    const isSelected = !isCycleIrregular && cycleLength === days
                    return (
                      <button
                        key={days}
                        type="button"
                        onClick={() => {
                          setCycleLength(days)
                          setIsCycleIrregular(false)
                        }}
                        style={{
                          padding: "10px 0",
                          borderRadius: 12,
                          fontSize: 12.5,
                          fontWeight: isSelected ? 700 : 500,
                          background: isSelected
                            ? "linear-gradient(135deg, #e75650, #f07060)"
                            : "#F7EDE8",
                          color: isSelected ? "#FFFFFF" : "#7A4F5C",
                          border: isSelected ? "none" : "1px solid #E8D0C8",
                          cursor: "pointer",
                          boxShadow: isSelected
                            ? "0 2px 8px rgba(231,86,80,0.3)"
                            : "none",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {days}d
                      </button>
                    )
                  })}

                  <button
                    type="button"
                    onClick={() => setIsCycleIrregular(true)}
                    style={{
                      padding: "10px 0",
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: isCycleIrregular ? 700 : 500,
                      background: isCycleIrregular
                        ? "linear-gradient(135deg, #e75650, #f07060)"
                        : "#F7EDE8",
                      color: isCycleIrregular ? "#FFFFFF" : "#7A4F5C",
                      border: isCycleIrregular ? "none" : "1px solid #E8D0C8",
                      cursor: "pointer",
                      boxShadow: isCycleIrregular
                        ? "0 2px 8px rgba(231,86,80,0.3)"
                        : "none",
                      transition: "all 0.15s ease",
                    }}
                  >
                    Varies
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: WELLNESS PRIORITIES & GOALS */}
        {step === 3 && (
          <div style={{ animation: "fadeIn 0.25s ease-out" }}>
            {/* Pill Tag */}
            <div style={{ textAlign: "center", marginBottom: 6, marginTop: 4 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "#e75650",
                  textTransform: "uppercase",
                  background: "rgba(231, 86, 80, 0.12)",
                  padding: "4px 12px",
                  borderRadius: 9999,
                  display: "inline-block",
                }}
              >
                Step 3 of 3 • Priorities
              </span>
            </div>

            {/* Title & Subtitle */}
            <h1
              style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontSize: 25,
                fontWeight: 600,
                color: "#2D1820",
                textAlign: "center",
                margin: "8px 0 6px",
                lineHeight: 1.25,
              }}
            >
              What would you like to track?
            </h1>
            <p
              style={{
                fontSize: 13.5,
                color: "#7A4F5C",
                textAlign: "center",
                margin: "0 auto 18px",
                maxWidth: 320,
                lineHeight: 1.45,
              }}
            >
              Select your focus areas to personalize your daily tips and cycle
              ring insights.
            </p>

            {/* Selection Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {TRACKING_GOALS.map((goal) => {
                const isSelected = goals.includes(goal.id)
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => toggleGoal(goal.id)}
                    style={{
                      background: isSelected ? "#FFF9F5" : "#FFFFFF",
                      borderRadius: 18,
                      padding: "14px 16px",
                      border: isSelected
                        ? "1.5px solid #e75650"
                        : "1px solid #E8D0C8",
                      boxShadow: isSelected
                        ? "0 4px 14px rgba(231, 86, 80, 0.12)"
                        : "0 2px 8px rgba(45,24,32,0.03)",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    <span style={{ fontSize: 24, lineHeight: 1 }}>
                      {goal.icon}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            fontSize: 14,
                            fontWeight: 600,
                            color: isSelected ? "#e75650" : "#2D1820",
                          }}
                        >
                          {goal.title}
                        </h4>
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            border: isSelected ? "none" : "1.5px solid #E8D0C8",
                            background: isSelected ? "#e75650" : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            marginLeft: 8,
                          }}
                        >
                          {isSelected && (
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <p
                        style={{
                          margin: "4px 0 0",
                          fontSize: 12,
                          color: "#7A4F5C",
                          lineHeight: 1.4,
                        }}
                      >
                        {goal.desc}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom CTA Area */}
      <footer
        style={{
          padding: "12px 24px 24px",
          background: "rgba(253, 246, 240, 0.95)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: "1px solid #E8D0C8",
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={handleNext}
          disabled={step === 1 && !name.trim()}
          style={{
            width: "100%",
            height: 52,
            borderRadius: 9999,
            background:
              step === 1 && !name.trim()
                ? "#E8D0C8"
                : "linear-gradient(135deg, #e75650, #f07060)",
            color: step === 1 && !name.trim() ? "#B89AA8" : "#FFFFFF",
            border: "none",
            fontSize: 16,
            fontWeight: 600,
            cursor: step === 1 && !name.trim() ? "not-allowed" : "pointer",
            boxShadow:
              step === 1 && !name.trim()
                ? "none"
                : "0 4px 16px rgba(231, 86, 80, 0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {step === 1 && "Continue to Cycle Setup →"}
          {step === 2 && "Continue to Priorities →"}
          {step === 3 && "Complete Setup & Enter App 🌸"}
        </button>
      </footer>
    </div>
  )
}
export default OnboardingScreen
