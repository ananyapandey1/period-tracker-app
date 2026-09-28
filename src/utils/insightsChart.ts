/**
 * Cycle Length History & Insights Chart Engine
 *
 * Implements proportional scaling, dynamic Y-axis gridlines,
 * explicit ongoing cycle states, personal average reference lines,
 * and clinically-grounded calm trend calculation.
 */

export interface CycleHistoryItem {
  month: string;
  length: number; // Confirmed length or projected length for ongoing cycle
  period: number; // Duration of menstrual bleeding flow in days
  isOngoing?: boolean; // True if the cycle is currently in progress
  elapsedDays?: number; // Number of days elapsed so far in the current cycle
  notes: string;
}

export const INITIAL_CYCLE_DATA: CycleHistoryItem[] = [
  { month: 'Apr', length: 27, period: 5, notes: 'Regular cycle, mild cramping' },
  { month: 'May', length: 28, period: 5, notes: 'Optimal 28-day cycle length' },
  { month: 'Jun', length: 29, period: 4, notes: 'Slightly longer follicular phase' },
  { month: 'Jul', length: 28, period: 5, notes: 'Standard cycle' },
  { month: 'Aug', length: 27, period: 6, notes: 'Slightly longer period flow' },
  { month: 'Sep', length: 28, period: 5, isOngoing: true, elapsedDays: 27, notes: 'Current ongoing cycle (Day 27 of ~28)' },
];

/**
 * Normal cycle length variation threshold in days.
 * Natural biological variance within +/- 1.0 day is considered stable.
 */
export const CYCLE_TREND_STABLE_THRESHOLD_DAYS = 1.0;

export type CycleTrendDirection = 'stable' | 'longer' | 'shorter';

export interface CycleTrendResult {
  direction: CycleTrendDirection;
  label: string;
  diff: number; // recentAvg - priorAvg
  recentAvg: number;
  priorAvg: number;
}

/**
 * Calculates cycle length directionality comparing the recent half vs. prior half
 * of the visible window. Degrades gracefully for new users with <= 2 cycles.
 */
export function calculateCycleTrend(cycles: CycleHistoryItem[]): CycleTrendResult {
  if (cycles.length < 2) {
    const singleVal = cycles[0]?.length ?? 28;
    return {
      direction: 'stable',
      label: 'Trending stable',
      diff: 0,
      recentAvg: singleVal,
      priorAvg: singleVal,
    };
  }

  // Use completed cycles if available; if fewer than 2 completed, use all cycles
  const completed = cycles.filter(c => !c.isOngoing);
  const targetCycles = completed.length >= 2 ? completed : cycles;

  const midpoint = Math.floor(targetCycles.length / 2);
  const prior = targetCycles.slice(0, midpoint);
  const recent = targetCycles.slice(midpoint);

  const priorAvg = prior.reduce((sum, c) => sum + c.length, 0) / prior.length;
  const recentAvg = recent.reduce((sum, c) => sum + c.length, 0) / recent.length;
  const diff = Number((recentAvg - priorAvg).toFixed(1));

  if (Math.abs(diff) <= CYCLE_TREND_STABLE_THRESHOLD_DAYS) {
    return {
      direction: 'stable',
      label: 'Trending stable',
      diff,
      recentAvg: Number(recentAvg.toFixed(1)),
      priorAvg: Number(priorAvg.toFixed(1)),
    };
  }

  if (diff > CYCLE_TREND_STABLE_THRESHOLD_DAYS) {
    return {
      direction: 'longer',
      label: 'Trending longer',
      diff,
      recentAvg: Number(recentAvg.toFixed(1)),
      priorAvg: Number(priorAvg.toFixed(1)),
    };
  }

  return {
    direction: 'shorter',
    label: 'Trending shorter',
    diff,
    recentAvg: Number(recentAvg.toFixed(1)),
    priorAvg: Number(priorAvg.toFixed(1)),
  };
}

/**
 * Computes average cycle length from completed cycles (or all if none completed).
 */
export function calculateAverageCycleLength(cycles: CycleHistoryItem[]): number {
  if (cycles.length === 0) return 28;
  const completed = cycles.filter(c => !c.isOngoing);
  const items = completed.length > 0 ? completed : cycles;
  const avg = items.reduce((sum, c) => sum + c.length, 0) / items.length;
  return Number(avg.toFixed(1));
}

export interface ChartScaleConfig {
  yMin: number;
  yMax: number;
  gridLines: number[];
  pixelsPerDay: (plotHeight: number) => number;
  toPixelHeight: (days: number, plotHeight: number) => number;
  toYCoord: (days: number, plotHeight: number) => number;
}

/**
 * Dynamically determines an accurate, readable Y-axis scale based on
 * the visible dataset min/max and period durations.
 */
export function computeChartScale(cycles: CycleHistoryItem[]): ChartScaleConfig {
  if (cycles.length === 0) {
    return {
      yMin: 20,
      yMax: 32,
      gridLines: [25, 28, 31],
      pixelsPerDay: (h) => h / 12,
      toPixelHeight: (d, h) => Math.max(0, (d - 20) * (h / 12)),
      toYCoord: (d, h) => h - Math.max(0, (d - 20) * (h / 12)),
    };
  }

  const lengths = cycles.map(c => c.length);
  const periods = cycles.map(c => c.period);
  const rawMinLength = Math.min(...lengths);
  const rawMaxLength = Math.max(...lengths);
  const rawMaxPeriod = Math.max(...periods);

  // Default optimal range for typical cycles (~26-30 days) is 20 to 32 with gridlines [25, 28, 31]
  let yMin = 20;
  let yMax = 32;
  let gridLines = [25, 28, 31];

  // Adjust dynamically if data contains outliers
  if (rawMaxLength > 31 || rawMinLength < 25) {
    // Ensure yMax covers the highest cycle with padding
    yMax = Math.ceil((rawMaxLength + 1) / 3) * 3;
    // Ensure yMin is low enough so all period segments fit with margin
    const lowestBase = Math.floor((rawMinLength - rawMaxPeriod - 2) / 3) * 3;
    yMin = Math.max(12, lowestBase);

    const step = Math.round((yMax - yMin) / 4);
    gridLines = [yMin + step, yMin + step * 2, yMin + step * 3];
  }

  const range = yMax - yMin;

  return {
    yMin,
    yMax,
    gridLines,
    pixelsPerDay: (plotHeight: number) => plotHeight / range,
    // Bar height from baseline yMin up to days
    toPixelHeight: (days: number, plotHeight: number) => {
      const clamped = Math.max(yMin, Math.min(days, yMax));
      return ((clamped - yMin) / range) * plotHeight;
    },
    // Y-coordinate (0 at top, plotHeight at baseline)
    toYCoord: (days: number, plotHeight: number) => {
      const clamped = Math.max(yMin, Math.min(days, yMax));
      return plotHeight - ((clamped - yMin) / range) * plotHeight;
    },
  };
}
