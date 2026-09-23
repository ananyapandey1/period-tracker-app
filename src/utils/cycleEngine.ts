export type CyclePhase = 'Menstrual' | 'Follicular' | 'Ovulation' | 'Luteal';

export interface PhaseMeta {
  name: CyclePhase;
  color: string;
  lightBg: string;
  duration: number;
  startDay: number;
  endDay: number;
}

export const PHASE_DEFINITIONS: Record<CyclePhase, PhaseMeta> = {
  Menstrual: { name: 'Menstrual', color: '#C86D6B', lightBg: '#FDF2F2', duration: 5, startDay: 1, endDay: 5 },
  Follicular: { name: 'Follicular', color: '#8BAA9B', lightBg: '#F2F8F5', duration: 8, startDay: 6, endDay: 13 },
  Ovulation: { name: 'Ovulation', color: '#E2A966', lightBg: '#FDF7EE', duration: 2, startDay: 14, endDay: 15 },
  Luteal: { name: 'Luteal', color: '#B39ABF', lightBg: '#F8F4FA', duration: 13, startDay: 16, endDay: 28 },
};

export function getPhaseForCycleDay(day: number): PhaseMeta {
  if (day <= 5) return PHASE_DEFINITIONS.Menstrual;
  if (day <= 13) return PHASE_DEFINITIONS.Follicular;
  if (day <= 15) return PHASE_DEFINITIONS.Ovulation;
  return PHASE_DEFINITIONS.Luteal;
}

export function getCycleState(lastPeriodDate: Date, cycleLength = 28, targetDate: Date = new Date()) {
  const d1 = new Date(lastPeriodDate);
  d1.setHours(0, 0, 0, 0);
  const d2 = new Date(targetDate);
  d2.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
  const normalizedDay = ((diffDays % cycleLength) + cycleLength) % cycleLength;
  const currentCycleDay = normalizedDay + 1; // 1-indexed
  const daysUntilNextPeriod = Math.max(0, cycleLength - currentCycleDay);
  const phase = getPhaseForCycleDay(currentCycleDay);

  return { currentCycleDay, daysUntilNextPeriod, phase };
}
