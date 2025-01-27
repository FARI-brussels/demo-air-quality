import { ref, watchEffect } from 'vue'
import { defineStore } from 'pinia'
import { useGlobalStore } from '@/stores/global'
import type { SourceReference } from '@/types/Source'

const DATA_PATHS = {
  expair: '/data/no2_expair.json',
  irceline: '/data/no2_anmean_station_brussels2023.json',
} as const

type ExpairSource = Extract<SourceReference, 'expair' | 'irceline'>

async function loadGeojsonData(source: ExpairSource) {
  try {
    const path = DATA_PATHS[source]
    const response = await fetch(path)
    return await response.json()
  } catch (error) {
    console.error(
      `Error loading GeoJSON data from ${DATA_PATHS[source]}:`,
      error,
    )
  }
}

function createMarkersFromGeojson(data) {
  return data.features.map(sensor => {
    const lat = sensor.geometry?.coordinates[1]
    const lon = sensor.geometry?.coordinates[0]
    const value = sensor.properties.value || sensor.properties.no2
    return {
      lat,
      lon,
      marker: null,
      value,
    }
  })
}

export const useExpairStore = defineStore('expair', () => {
  const globalStore = useGlobalStore()
  const dataType = ref<string | null>('P2')
  const markerLocations = ref(null)

  async function fetchExpairData(path: ExpairSource) {
    const data = await loadGeojsonData(path)
    markerLocations.value = createMarkersFromGeojson(data)

    return markerLocations.value
  }

  watchEffect(async () => {
    globalStore.loading = true
    if (globalStore.source !== 'expair') return
    await fetchExpairData(globalStore.reference as ExpairSource)
    globalStore.loading = false
  })

  return {
    dataType,
    markerLocations,
    fetchExpairData,
  }
})
