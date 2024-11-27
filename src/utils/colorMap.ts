export type ColorThreshold = { threshold: number; color: string }

export const thresholdsNoNorm: ColorThreshold[] = [
  { threshold: 0, color: '#0000FF' },
  { threshold: 2, color: '#0099FF' },
  { threshold: 5, color: '#009900' },
  { threshold: 7, color: '#00FF00' },
  { threshold: 10, color: '#FFFF00' },
  { threshold: 15, color: '#FFBB00' },
  { threshold: 20, color: '#FF6600' },
  { threshold: 25, color: '#FF0000' },
  { threshold: 30, color: '#CC0000' },
  { threshold: 40, color: '#990099' },
] as const

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

// export const thresholdsP1: ColorThreshold[] = [
//   { threshold: 0, color: '#0000FF' },
//   { threshold: 10, color: '#0099FF' },
//   { threshold: 20, color: '#009900' },
//   { threshold: 35, color: '#00FF00' },
//   { threshold: 45, color: '#FFFF00' },
//   { threshold: 60, color: '#FFBB00' },
//   { threshold: 80, color: '#FF6600' },
//   { threshold: 95, color: '#FF0000' },
//   { threshold: 110, color: '#CC0000' },
//   { threshold: 140, color: '#990099' },
// ] as const

export function getColor(value: number, thresholds: ColorThreshold[]): string {
  const sortedThresholds = thresholds
    .sort((a, b) => a.threshold - b.threshold)
    .reverse()

  const col = sortedThresholds.find(t => value > t.threshold)

  if (col) return col.color

  for (const threshold of sortedThresholds) {
    if (value > threshold.threshold) {
      return threshold.color
    }
  }

  return sortedThresholds[sortedThresholds.length - 1].color
}

//PM2.5
// export function getColor(value) {
//   return value > 75
//     ? '#990099' // Black for > 50
//     : value > 60
//       ? '#CC0000' // Red for 40-50
//       : value > 50
//         ? '#FF0000' // Orange-Red for 35-40
//         : value > 35
//           ? '#FF6600' // Orange for 30-35
//           : value > 20
//             ? '#FFBB00' // Yellow for 25-30
//             : value > 15
//               ? '#FFFF00' // Green-Yellow for 20-25
//               : value > 10
//                 ? '#00FF00' // Green for 15-20
//                 : value > 7.5
//                   ? '#009900' // Dark Turquoise for 10-15
//                   : value > 3.5
//                     ? '#0099FF' // Steel Blue for 5-10
//                     : '#0000FF' // Light Blue for 0-5
// }
