export type ColorThreshold = { threshold: number; color: string }

export const thresholdsWorldHealth: ColorThreshold[] = [
  { threshold: 0, color: '#00FF00' },
  { threshold: 10, color: '#FF0000' },
] as const

export const thresholdsEuropeanCurrent: ColorThreshold[] = [
  { threshold: 0, color: '#00FF00' },
  { threshold: 40, color: '#FF0000' },
] as const

export const thresholdsEuropeanFuture: ColorThreshold[] = [
  { threshold: 0, color: '#00FF00' },
  { threshold: 20, color: '#FF0000' },
] as const

export const thresholdsP2: ColorThreshold[] = [
  { threshold: 0, color: '#0000FF' },
  { threshold: 3.5, color: '#0099FF' },
  { threshold: 7.5, color: '#009900' },
  { threshold: 10, color: '#00FF00' },
  { threshold: 15, color: '#FFFF00' },
  { threshold: 20, color: '#FFBB00' },
  { threshold: 35, color: '#FF6600' },
  { threshold: 50, color: '#FF0000' },
  { threshold: 60, color: '#CC0000' },
  { threshold: 75, color: '#990099' },
] as const

export const thresholdsP1: ColorThreshold[] = [
  { threshold: 0, color: '#0000FF' },
  { threshold: 10, color: '#0099FF' },
  { threshold: 20, color: '#009900' },
  { threshold: 35, color: '#00FF00' },
  { threshold: 45, color: '#FFFF00' },
  { threshold: 60, color: '#FFBB00' },
  { threshold: 80, color: '#FF6600' },
  { threshold: 95, color: '#FF0000' },
  { threshold: 110, color: '#CC0000' },
  { threshold: 140, color: '#990099' },
] as const

export function getColor(value: number, thresholds: ColorThreshold[]): string {
  const sortedThresholds = thresholds.sort((a, b) => a.threshold - b.threshold)

  for (const threshold of sortedThresholds) {
    if (value <= threshold.threshold) {
      return threshold.color
    }
  }

  return sortedThresholds[sortedThresholds.length - 1].color
}