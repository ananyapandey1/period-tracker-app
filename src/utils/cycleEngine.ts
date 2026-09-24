export type CyclePhase = 'Menstrual' | 'Follicular' | 'Ovulation' | 'Luteal';

export interface PhaseMeta {
  name: CyclePhase;
  color: string;
  lightBg: string;
  duration: number;
  startDay: number;
  endDay: number;
}

export const PHASE_COLORS: Record<CyclePhase, string> = {
  Menstrual: '#C86D6B',
  Follicular: '#8BAA9B',
  Ovulation: '#E2A966',
  Luteal: '#B39ABF',
};

export const PHASE_DEFINITIONS: Record<CyclePhase, PhaseMeta> = {
  Menstrual: { name: 'Menstrual', color: PHASE_COLORS.Menstrual, lightBg: '#FDF2F2', duration: 5, startDay: 1, endDay: 5 },
  Follicular: { name: 'Follicular', color: PHASE_COLORS.Follicular, lightBg: '#F2F8F5', duration: 8, startDay: 6, endDay: 13 },
  Ovulation: { name: 'Ovulation', color: PHASE_COLORS.Ovulation, lightBg: '#FDF7EE', duration: 2, startDay: 14, endDay: 15 },
  Luteal: { name: 'Luteal', color: PHASE_COLORS.Luteal, lightBg: '#F8F4FA', duration: 13, startDay: 16, endDay: 28 },
};

export interface UpcomingPhaseItem {
  phase: CyclePhase;
  label: string;
  color: string;
  startDate: Date;
  dateStr: string;
  daysUntil: number;
}

export interface CycleStateResult {
  currentCycleDay: number;
  daysUntilNextPeriod: number;
  phase: PhaseMeta;
  periodExpectedDate: Date;
  periodExpectedDateStr: string;
  ovulationDate: Date;
  ovulationDateStr: string;
  fertileWindow: {
    startDate: Date;
    endDate: Date;
    formattedRange: string;
  };
  isFertile: boolean;
  upcomingPhases: UpcomingPhaseItem[];
}

export interface PhaseCardContent {
  phase: CyclePhase;
  title: string;
  summary: string;
  symptoms: string[];
  articleId: string;
  articleLinkText: string;
}

export const PHASE_CARD_DATA: Record<CyclePhase, PhaseCardContent> = {
  Menstrual: {
    phase: 'Menstrual',
    title: 'Menstrual phase',
    summary: 'Your body is resetting as your uterine lining gently sheds, making this a natural time to slow down and rest.',
    symptoms: [
      'You may notice mild cramping or lower back tightness.',
      'Energy levels can feel lower than usual.',
      'Some people notice gentle fatigue or a desire for quiet time.',
      'You may experience subtle shifts in appetite or digestion.'
    ],
    articleId: 'cramp-relief-methods',
    articleLinkText: 'Read: Managing Period Cramps & Comfort →'
  },
  Follicular: {
    phase: 'Follicular',
    title: 'Follicular phase',
    summary: 'Your body is gearing up for a new cycle, often bringing a welcome sense of renewed vitality.',
    symptoms: [
      'You may feel an uptick in physical energy and focus.',
      'Mood can naturally brighten and feel more social.',
      'Some people notice clearer skin and a lighter overall feeling.',
      'You may feel an increase in natural motivation.'
    ],
    articleId: 'hormonal-libido-wellness',
    articleLinkText: 'Read: Hormones & Energy Across Your Cycle →'
  },
  Ovulation: {
    phase: 'Ovulation',
    title: 'Ovulation phase',
    summary: 'Your body is at its peak reproductive window, which often brings heightened energy and confidence.',
    symptoms: [
      'You may notice a subtle surge in energy and alertness.',
      'Some people notice a brief, mild twinge in the lower abdomen.',
      'Libido and openness can feel naturally elevated.',
      'You may notice cervical fluid becoming clearer and lighter.'
    ],
    articleId: 'hormonal-libido-wellness',
    articleLinkText: 'Read: Sexual Wellness & Your Fertile Window →'
  },
  Luteal: {
    phase: 'Luteal',
    title: 'Luteal phase',
    summary: 'Your body is winding down after ovulation, preparing for your upcoming cycle with a natural inward shift.',
    symptoms: [
      'You may feel gentle shifts in energy or need extra sleep.',
      'Some people notice mild bloating or breast tenderness.',
      'Cravings for warm, nourishing foods can show up.',
      'Emotions may feel a bit more sensitive or reflective.'
    ],
    articleId: 'luteal-phase-guide',
    articleLinkText: 'Read: Understanding Your Luteal Phase →'
  }
};

export function getPhaseForCycleDay(day: number, cycleLength = 28, lutealLength = 14): PhaseMeta {
  const ovulationDay = Math.max(1, cycleLength - lutealLength);
  const menstrualEnd = 5;
  const follicularEnd = ovulationDay - 1;
  const ovulationEnd = ovulationDay + 1;

  if (day <= menstrualEnd) return PHASE_DEFINITIONS.Menstrual;
  if (day <= follicularEnd) return PHASE_DEFINITIONS.Follicular;
  if (day <= ovulationEnd) return PHASE_DEFINITIONS.Ovulation;
  return PHASE_DEFINITIONS.Luteal;
}

export function safeFormatDate(
  dateVal: Date | string | number | null | undefined, 
  fallback = 'Upcoming'
): string {
  if (!dateVal) return fallback;
  
  if (typeof dateVal === 'string' && isNaN(Date.parse(dateVal))) {
    return dateVal;
  }
  
  const d = dateVal instanceof Date ? dateVal : new Date(dateVal);
  if (isNaN(d.getTime())) return fallback;

  try {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(d);
  } catch {
    return fallback;
  }
}

export function getCycleState(
  lastPeriodDate: Date | string | number | null | undefined,
  cycleLength = 28,
  targetDate: Date = new Date(),
  lutealPhaseLength = 14
): CycleStateResult {
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);

  let start: Date;
  if (lastPeriodDate) {
    const parsed = new Date(lastPeriodDate);
    start = isNaN(parsed.getTime()) ? new Date(target) : parsed;
  } else {
    start = new Date(target);
  }
  start.setHours(0, 0, 0, 0);

  const msPerDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.floor((target.getTime() - start.getTime()) / msPerDay);
  const normalizedDay = ((diffDays % cycleLength) + cycleLength) % cycleLength;
  const currentCycleDay = normalizedDay + 1; // 1-indexed

  const currentCycleStartDate = new Date(target.getTime() - normalizedDay * msPerDay);
  const nextPeriodDate = new Date(currentCycleStartDate.getTime() + cycleLength * msPerDay);
  const daysUntilNextPeriod = Math.max(1, Math.round((nextPeriodDate.getTime() - target.getTime()) / msPerDay));
  const phase = getPhaseForCycleDay(currentCycleDay, cycleLength, lutealPhaseLength);

  const ovulationDay = Math.max(1, cycleLength - lutealPhaseLength);
  const currentCycleOvulationDate = new Date(currentCycleStartDate.getTime() + (ovulationDay - 1) * msPerDay);
  const fertileStartDay = Math.max(1, ovulationDay - 5);
  const fertileEndDay = ovulationDay;
  const currentCycleFertileStart = new Date(currentCycleStartDate.getTime() + (fertileStartDay - 1) * msPerDay);
  const currentCycleFertileEnd = new Date(currentCycleStartDate.getTime() + (fertileEndDay - 1) * msPerDay);

  const periodExpectedDate = nextPeriodDate;
  const periodExpectedDateStr = safeFormatDate(periodExpectedDate);
  const ovulationDate = currentCycleOvulationDate;
  const ovulationDateStr = safeFormatDate(ovulationDate);

  const fertileWindow = {
    startDate: currentCycleFertileStart,
    endDate: currentCycleFertileEnd,
    formattedRange: `${safeFormatDate(currentCycleFertileStart)} – ${safeFormatDate(currentCycleFertileEnd)}`,
  };

  interface CandidateMilestone {
    phase: CyclePhase;
    label: string;
    startDate: Date;
  }

  const milestones: CandidateMilestone[] = [];

  for (let cycleOffset = 0; cycleOffset <= 1; cycleOffset++) {
    const cycleStart = new Date(currentCycleStartDate.getTime() + cycleOffset * cycleLength * msPerDay);
    const ovDay = Math.max(1, cycleLength - lutealPhaseLength);

    if (cycleOffset > 0) {
      milestones.push({
        phase: 'Menstrual',
        label: 'Period expected',
        startDate: new Date(cycleStart),
      });
    }

    milestones.push({
      phase: 'Follicular',
      label: 'Follicular phase',
      startDate: new Date(cycleStart.getTime() + 5 * msPerDay),
    });

    milestones.push({
      phase: 'Ovulation',
      label: 'Ovulation phase',
      startDate: new Date(cycleStart.getTime() + (ovDay - 1) * msPerDay),
    });

    milestones.push({
      phase: 'Luteal',
      label: 'Luteal phase',
      startDate: new Date(cycleStart.getTime() + (ovDay + 1) * msPerDay),
    });
  }

  const upcomingPhases: UpcomingPhaseItem[] = milestones
    .filter(m => m.startDate.getTime() > target.getTime())
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    .slice(0, 3)
    .map(m => {
      const daysUntil = Math.max(1, Math.round((m.startDate.getTime() - target.getTime()) / msPerDay));
      return {
        phase: m.phase,
        label: m.label,
        color: PHASE_COLORS[m.phase],
        startDate: m.startDate,
        dateStr: `Starts ${safeFormatDate(m.startDate)}`,
        daysUntil,
      };
    });

  const isFertile = currentCycleDay >= fertileStartDay && currentCycleDay <= fertileEndDay;

  return {
    currentCycleDay,
    daysUntilNextPeriod,
    phase,
    periodExpectedDate,
    periodExpectedDateStr,
    ovulationDate,
    ovulationDateStr,
    fertileWindow,
    isFertile,
    upcomingPhases,
  };
}
