/**
 * Dynamic Date Utilities for Poppy Period Tracking App
 * Driven by real-time client date (`new Date()`)
 */

export function getTodayDateString(): string {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatHeaderDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long' }).format(date)
}

export function formatMonthYear(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date)
}

export function formatFullDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date)
}

export function calculateCycleDay(currentDate: Date = new Date(), cycleLength: number = 28): number {
  // Compute day in 28-day cycle based on day of year or epoch offset
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1)
  const diffDays = Math.floor((currentDate.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))
  // Map day of year into 1..28 cycle range
  const cycleDay = (diffDays % cycleLength) + 1
  return cycleDay
}

export function getDaysUntilNextPeriod(currentDate: Date = new Date(), cycleLength: number = 28): { daysLeft: number; expectedDateStr: string } {
  const currentDay = calculateCycleDay(currentDate, cycleLength)
  const daysLeft = Math.max(1, cycleLength - currentDay + 1)
  
  const nextDate = new Date(currentDate)
  nextDate.setDate(currentDate.getDate() + daysLeft)
  
  const expectedDateStr = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(nextDate)
  return { daysLeft, expectedDateStr }
}
