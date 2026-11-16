export type CyclePhase = "Menstrual" | "Follicular" | "Ovulation" | "Luteal"

export interface PhaseMeta {
  name: CyclePhase
  color: string
  lightBg: string
  duration: number
  startDay: number
  endDay: number
}

export const PHASE_COLORS: Record<CyclePhase, string> = {
  Menstrual: "#C86D6B",
  Follicular: "#8BAA9B",
  Ovulation: "#E2A966",
  Luteal: "#B39ABF",
}

export const PHASE_DEFINITIONS: Record<CyclePhase, PhaseMeta> = {
  Menstrual: {
    name: "Menstrual",
    color: PHASE_COLORS.Menstrual,
    lightBg: "#FDF2F2",
    duration: 5,
    startDay: 1,
    endDay: 5,
  },
  Follicular: {
    name: "Follicular",
    color: PHASE_COLORS.Follicular,
    lightBg: "#F2F8F5",
    duration: 8,
    startDay: 6,
    endDay: 13,
  },
  Ovulation: {
    name: "Ovulation",
    color: PHASE_COLORS.Ovulation,
    lightBg: "#FDF7EE",
    duration: 2,
    startDay: 14,
    endDay: 15,
  },
  Luteal: {
    name: "Luteal",
    color: PHASE_COLORS.Luteal,
    lightBg: "#F8F4FA",
    duration: 13,
    startDay: 16,
    endDay: 28,
  },
}

export interface UpcomingPhaseItem {
  phase: CyclePhase
  label: string
  color: string
  startDate: Date
  dateStr: string
  daysUntil: number
}

export interface CycleStateResult {
  currentCycleDay: number
  daysUntilNextPeriod: number
  ringCenterText: string
  phase: PhaseMeta
  periodExpectedDate: Date
  periodExpectedDateStr: string
  ovulationDate: Date
  ovulationDateStr: string
  fertileWindow: {
    startDate: Date
    endDate: Date
    formattedRange: string
  }
  isFertile: boolean
  upcomingPhases: UpcomingPhaseItem[]
}

export interface PhaseCardContent {
  phase: CyclePhase
  title: string
  summary: string
  symptoms: string[]
  articleId: string
  articleLinkText: string
}

export const PHASE_CARD_DATA: Record<CyclePhase, PhaseCardContent> = {
  Menstrual: {
    phase: "Menstrual",
    title: "Menstrual phase",
    summary:
      "Your body is resetting as your uterine lining gently sheds, making this a natural time to slow down and rest.",
    symptoms: [
      "You may notice mild cramping or lower back tightness.",
      "Energy levels can feel lower than usual.",
      "Some people notice gentle fatigue or a desire for quiet time.",
      "You may experience subtle shifts in appetite or digestion.",
    ],
    articleId: "cramp-relief-methods",
    articleLinkText: "Read: Managing Period Cramps & Comfort →",
  },
  Follicular: {
    phase: "Follicular",
    title: "Follicular phase",
    summary:
      "Your body is gearing up for a new cycle, often bringing a welcome sense of renewed vitality.",
    symptoms: [
      "You may feel an uptick in physical energy and focus.",
      "Mood can naturally brighten and feel more social.",
      "Some people notice clearer skin and a lighter overall feeling.",
      "You may feel an increase in natural motivation.",
    ],
    articleId: "hormonal-libido-wellness",
    articleLinkText: "Read: Hormones & Energy Across Your Cycle →",
  },
  Ovulation: {
    phase: "Ovulation",
    title: "Ovulation phase",
    summary:
      "Your body is at its peak reproductive window, which often brings heightened energy and confidence.",
    symptoms: [
      "You may notice a subtle surge in energy and alertness.",
      "Some people notice a brief, mild twinge in the lower abdomen.",
      "Libido and openness can feel naturally elevated.",
      "You may notice cervical fluid becoming clearer and lighter.",
    ],
    articleId: "hormonal-libido-wellness",
    articleLinkText: "Read: Sexual Wellness & Your Fertile Window →",
  },
  Luteal: {
    phase: "Luteal",
    title: "Luteal phase",
    summary:
      "Your body is winding down after ovulation, preparing for your upcoming cycle with a natural inward shift.",
    symptoms: [
      "You may feel gentle shifts in energy or need extra sleep.",
      "Some people notice mild bloating or breast tenderness.",
      "Cravings for warm, nourishing foods can show up.",
      "Emotions may feel a bit more sensitive or reflective.",
    ],
    articleId: "luteal-phase-guide",
    articleLinkText: "Read: Understanding Your Luteal Phase →",
  },
}

/**
 * Clinical calibration for luteal phase duration based on age.
 * In reproductive endocrinology (Lenton et al., Fehring et al., Bull et al. Nature Dig. Med.):
 * - Average luteal phase duration across prime reproductive years (18–37) is 14 days.
 * - In late 30s/40s, luteal phase subtly shortens (median ~13 days) due to declining luteal progesterone output.
 */
export function getCalibratedLutealLength(
  birthday?: string,
  defaultLength = 14,
): number {
  if (!birthday) return defaultLength
  const birth = new Date(birthday)
  if (isNaN(birth.getTime())) return defaultLength
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
    age--
  }
  if (age >= 38) {
    return 13
  }
  return defaultLength
}

export function getPhaseForCycleDay(
  day: number,
  cycleLength = 28,
  lutealLength = 14,
  periodDuration = 5,
): PhaseMeta {
  const ovulationDay = Math.max(1, cycleLength - lutealLength)
  // Period duration cannot exceed the day before ovulation
  const menstrualEnd = Math.max(1, Math.min(periodDuration, ovulationDay - 1))
  const follicularEnd = ovulationDay - 1
  const ovulationEnd = ovulationDay + 1

  if (day <= menstrualEnd) {
    return {
      ...PHASE_DEFINITIONS.Menstrual,
      duration: menstrualEnd,
      startDay: 1,
      endDay: menstrualEnd,
    }
  }
  if (day <= follicularEnd) {
    return {
      ...PHASE_DEFINITIONS.Follicular,
      duration: Math.max(1, follicularEnd - menstrualEnd),
      startDay: menstrualEnd + 1,
      endDay: follicularEnd,
    }
  }
  if (day <= ovulationEnd) {
    return {
      ...PHASE_DEFINITIONS.Ovulation,
      duration: Math.max(1, ovulationEnd - follicularEnd),
      startDay: follicularEnd + 1,
      endDay: ovulationEnd,
    }
  }
  return {
    ...PHASE_DEFINITIONS.Luteal,
    duration: Math.max(1, cycleLength - ovulationEnd),
    startDay: ovulationEnd + 1,
    endDay: cycleLength,
  }
}

export function safeFormatDate(
  dateVal: Date | string | number | null | undefined,
  fallback = "Upcoming",
): string {
  if (!dateVal) return fallback

  if (typeof dateVal === "string" && isNaN(Date.parse(dateVal))) {
    return dateVal
  }

  const d = dateVal instanceof Date ? dateVal : new Date(dateVal)
  if (isNaN(d.getTime())) return fallback

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(d)
  } catch {
    return fallback
  }
}

/**
 * Dynamic ring center title copy helper:
 * - Menstrual phase: shows active period day (e.g. "Period Day 1") or "Expected Day 1 of period" if unlogged.
 * - Non-Menstrual phases: shows countdown to next period.
 */
export function getRingCenterText(
  currentPhase: string,
  cycleDay: number,
  daysUntilNextPeriod: number,
  isPeriodLogged?: boolean,
): string {
  if (currentPhase.toLowerCase() === "menstrual") {
    if (cycleDay === 1 && isPeriodLogged === false) {
      return "Expected Day 1 of period"
    }
    return `Period Day ${cycleDay}`
  }
  return `${daysUntilNextPeriod} days until your next period`
}

export interface CycleStateOptions {
  isPeriodLogged?: boolean
  periodDuration?: number
  birthday?: string
}

export function getCycleState(
  lastPeriodDate: Date | string | number | null | undefined,
  cycleLength = 28,
  targetDate: Date = new Date(),
  lutealPhaseLength = 14,
  options?: CycleStateOptions,
): CycleStateResult {
  const target = new Date(targetDate)
  target.setHours(0, 0, 0, 0)

  // Age-calibrated luteal phase if birthday provided and default length used
  const effectiveLutealLength =
    options?.birthday && lutealPhaseLength === 14
      ? getCalibratedLutealLength(options.birthday, lutealPhaseLength)
      : lutealPhaseLength

  const effectivePeriodDuration = Math.max(
    1,
    Math.min(options?.periodDuration ?? 5, cycleLength - 1),
  )

  let start: Date
  if (lastPeriodDate) {
    const parsed = new Date(lastPeriodDate)
    start = isNaN(parsed.getTime()) ? new Date(target) : parsed
  } else {
    start = new Date(target)
  }
  start.setHours(0, 0, 0, 0)

  const msPerDay = 1000 * 60 * 60 * 24
  const diffDays = Math.floor((target.getTime() - start.getTime()) / msPerDay)
  const normalizedDay = ((diffDays % cycleLength) + cycleLength) % cycleLength
  const currentCycleDay = normalizedDay + 1 // 1-indexed

  const currentCycleStartDate = new Date(
    target.getTime() - normalizedDay * msPerDay,
  )
  const nextPeriodDate = new Date(
    currentCycleStartDate.getTime() + cycleLength * msPerDay,
  )
  const daysUntilNextPeriod = Math.max(
    1,
    Math.round((nextPeriodDate.getTime() - target.getTime()) / msPerDay),
  )
  const phase = getPhaseForCycleDay(
    currentCycleDay,
    cycleLength,
    effectiveLutealLength,
    effectivePeriodDuration,
  )

  const ovulationDay = Math.max(1, cycleLength - effectiveLutealLength)
  const currentCycleOvulationDate = new Date(
    currentCycleStartDate.getTime() + (ovulationDay - 1) * msPerDay,
  )
  const fertileStartDay = Math.max(1, ovulationDay - 5)
  const fertileEndDay = ovulationDay
  const currentCycleFertileStart = new Date(
    currentCycleStartDate.getTime() + (fertileStartDay - 1) * msPerDay,
  )
  const currentCycleFertileEnd = new Date(
    currentCycleStartDate.getTime() + (fertileEndDay - 1) * msPerDay,
  )

  const periodExpectedDate = nextPeriodDate
  const periodExpectedDateStr = safeFormatDate(periodExpectedDate)
  const ovulationDate = currentCycleOvulationDate
  const ovulationDateStr = safeFormatDate(ovulationDate)

  const fertileWindow = {
    startDate: currentCycleFertileStart,
    endDate: currentCycleFertileEnd,
    formattedRange: `${safeFormatDate(currentCycleFertileStart)} – ${safeFormatDate(currentCycleFertileEnd)}`,
  }

  interface CandidateMilestone {
    phase: CyclePhase
    label: string
    startDate: Date
  }

  const milestones: CandidateMilestone[] = []

  for (let cycleOffset = 0; cycleOffset <= 1; cycleOffset++) {
    const cycleStart = new Date(
      currentCycleStartDate.getTime() + cycleOffset * cycleLength * msPerDay,
    )
    const ovDay = Math.max(1, cycleLength - effectiveLutealLength)

    if (cycleOffset > 0) {
      milestones.push({
        phase: "Menstrual",
        label: "Period expected",
        startDate: new Date(cycleStart),
      })
    }

    // Follicular phase begins the day after bleeding ends
    const follicularStartDay = effectivePeriodDuration + 1
    if (follicularStartDay < ovDay) {
      milestones.push({
        phase: "Follicular",
        label: "Follicular phase",
        startDate: new Date(
          cycleStart.getTime() + (follicularStartDay - 1) * msPerDay,
        ),
      })
    }

    milestones.push({
      phase: "Ovulation",
      label: "Ovulation phase",
      startDate: new Date(cycleStart.getTime() + (ovDay - 1) * msPerDay),
    })

    milestones.push({
      phase: "Luteal",
      label: "Luteal phase",
      startDate: new Date(cycleStart.getTime() + (ovDay + 1) * msPerDay),
    })
  }

  const upcomingPhases: UpcomingPhaseItem[] = milestones
    .filter((m) => m.startDate.getTime() > target.getTime())
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    .slice(0, 3)
    .map((m) => {
      const daysUntil = Math.max(
        1,
        Math.round((m.startDate.getTime() - target.getTime()) / msPerDay),
      )
      return {
        phase: m.phase,
        label: m.label,
        color: PHASE_COLORS[m.phase],
        startDate: m.startDate,
        dateStr: `Starts ${safeFormatDate(m.startDate)}`,
        daysUntil,
      }
    })

  const isFertile =
    currentCycleDay >= fertileStartDay && currentCycleDay <= fertileEndDay

  const ringCenterText = getRingCenterText(
    phase.name,
    currentCycleDay,
    daysUntilNextPeriod,
    options?.isPeriodLogged,
  )

  return {
    currentCycleDay,
    daysUntilNextPeriod,
    ringCenterText,
    phase,
    periodExpectedDate,
    periodExpectedDateStr,
    ovulationDate,
    ovulationDateStr,
    fertileWindow,
    isFertile,
    upcomingPhases,
  }
}

export interface GoalTip {
  goalId: string
  icon: string
  title: string
  text: string
}

/**
 * Returns science-backed daily focus recommendations aligned with the user's selected wellness goals.
 */
export function getGoalTipsForPhase(
  phase: CyclePhase,
  userGoals: string[] = [],
): GoalTip[] {
  const allTips: Record<string, Record<CyclePhase, {
    icon: string
    title: string
    text: string
  }>> = {
    cramps: {
      Menstrual: {
        icon: "🍵",
        title: "Cramp Relief Priority",
        text: "Prostaglandins trigger uterine smooth muscle cramping. Use a gentle heat patch, stay warm, and sip ginger or chamomile tea.",
      },
      Follicular: {
        icon: "🍵",
        title: "Anti-Inflammatory Prep",
        text: "Cramp risk is at its lowest. Boost dietary magnesium and omega-3s to support calm pelvic muscle tone.",
      },
      Ovulation: {
        icon: "🍵",
        title: "Mid-Cycle Twinges",
        text: "Mild unilateral lower abdomen twinges (mittelschmerz) can occur today as the mature follicle releases an egg.",
      },
      Luteal: {
        icon: "🍵",
        title: "Pre-Period Comfort",
        text: "Progesterone drops late in this phase. Hydrate well and limit excess sodium to prevent pelvic congestion and aching.",
      },
    },
    energy: {
      Menstrual: {
        icon: "⚡",
        title: "Rest & Reset",
        text: "Estrogen and progesterone are at baseline. Honor your body with restorative pacing, gentle walks, and early sleep.",
      },
      Follicular: {
        icon: "⚡",
        title: "Vitality Surge",
        text: "Rising estradiol increases dopamine receptors and cellular metabolism. Your highest stamina window for demanding projects.",
      },
      Ovulation: {
        icon: "⚡",
        title: "Peak Energy Window",
        text: "Peak estrogen and a gentle testosterone surge provide heightened physical strength, social confidence, and mental clarity.",
      },
      Luteal: {
        icon: "⚡",
        title: "Pacing & Recovery",
        text: "Progesterone has a natural calming effect on GABA receptors. Shift to strength endurance, yoga, and steady pacing.",
      },
    },
    skin: {
      Menstrual: {
        icon: "🌸",
        title: "Skin Barrier Care",
        text: "Skin moisture levels are naturally lower. Keep skin hydrated with ceramide moisturizer and avoid harsh peels.",
      },
      Follicular: {
        icon: "🌸",
        title: "Clear Skin Glow",
        text: "Estrogen stimulates natural collagen synthesis and regulates sebum. Your skin is at its clearest, calmest phase.",
      },
      Ovulation: {
        icon: "🌸",
        title: "Natural Luster",
        text: "Skin is luminous, but higher follicle hydration means sticking with lightweight water-based hydration.",
      },
      Luteal: {
        icon: "🌸",
        title: "Hormonal Sebum Balance",
        text: "Progesterone increases sebum viscosity. Cleanse with gentle salicylic acid to keep pores clear of premenstrual congestion.",
      },
    },
    sleep: {
      Menstrual: {
        icon: "🌙",
        title: "Restorative Sleep",
        text: "Body temperature drops back to baseline. You may enjoy deeper slow-wave sleep; aim for a warm, quiet sleep sanctuary.",
      },
      Follicular: {
        icon: "🌙",
        title: "Easy Wakefulness",
        text: "Rising estrogen improves REM sleep architecture and daytime alertness. You will likely wake feeling naturally refreshed.",
      },
      Ovulation: {
        icon: "🌙",
        title: "High Stamina & Rest",
        text: "Natural melatonin sync is optimal. Keep a consistent bedtime routine to channel your high daytime energy.",
      },
      Luteal: {
        icon: "🌙",
        title: "Progesterone Wind-Down",
        text: "Basal temperature is slightly higher (~0.3°C). Keep your bedroom cool (65-68°F / 18-20°C) to prevent nighttime tossing.",
      },
    },
    predictions: {
      Menstrual: {
        icon: "🩸",
        title: "Cycle Forecast Active",
        text: "Bleeding start date recalibrates your next expected period and fertile window with clinical accuracy.",
      },
      Follicular: {
        icon: "🩸",
        title: "Fertile Window Approaching",
        text: "Your fertile window opens in a few days. Notice changes in cervical fluid consistency.",
      },
      Ovulation: {
        icon: "🩸",
        title: "Peak Fertile Window",
        text: "Today falls in your highest conception probability window (Wilcox clinical fertile model).",
      },
      Luteal: {
        icon: "🩸",
        title: "Next Cycle Countdown",
        text: "Tracking symptoms over the next 10-14 days helps the engine detect premenstrual patterns with precision.",
      },
    },
  }

  const tips: GoalTip[] = []
  for (const goalId of userGoals) {
    if (allTips[goalId]?.[phase]) {
      tips.push({
        goalId,
        ...allTips[goalId][phase],
      })
    }
  }
  return tips
}
