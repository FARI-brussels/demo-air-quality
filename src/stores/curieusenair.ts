import { ref, watchEffect } from 'vue'
import { defineStore } from 'pinia'
import { useGlobalStore } from '@/stores/global'
import type { SourceReference } from '@/types/Source'

const DATA_PATHS = {
  curieusenair: `${import.meta.env.BASE_URL}/src/assets/data/no2_curieusenair.json`,
  irceline: `${import.meta.env.BASE_URL}/src/assets/data/no2_anmean_station_brussels2021.json`,
} as const

type CurieusenairSource = Extract<SourceReference, 'curieusenair' | 'irceline'>

async function loadGeojsonData(source: CurieusenairSource) {
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

export const useCurieusenairStore = defineStore('curieusenair', () => {
  const globalStore = useGlobalStore()

  const dataType = ref<string | null>('P2')
  const markerLocations = ref(null)

  async function getCurieusenairData(path: CurieusenairSource) {
    const data = await loadGeojsonData(path)
    markerLocations.value = createMarkersFromGeojson(data)

    return markerLocations.value
  }

  watchEffect(async () => {
    globalStore.loading = true
    if (globalStore.source !== 'curieusenair') return
    await getCurieusenairData(globalStore.reference as CurieusenairSource)
    globalStore.loading = false
  })
  return {
    dataType,
    markerLocations,
    getCurieusenairData,
  }
})
