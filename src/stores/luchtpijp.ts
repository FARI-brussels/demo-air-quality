import { ref, watchEffect } from 'vue'
import { defineStore } from 'pinia'
import type { SensorData } from '@/types/Sensor'
import type { SourceReference } from '@/types/Source'
import { useGlobalStore } from '@/stores/global'

type LuchtpijpSource = Extract<SourceReference, 'luchtpijp' | 'irceline'>

const DATA_PATHS = {
  luchtpijp: fetchSensorCommunityData,
  irceline: fetchIrcelineData,
} as const

export const useLuchtpijpStore = defineStore('luchtpijp', () => {
  const globalStore = useGlobalStore()
  const dataType = ref<string | null>('P1')
  const markerLocations = ref(null)

  async function fetchLuchtpijpData(path: LuchtpijpSource) {
    globalStore.loading = true

    const data = await DATA_PATHS[path]()

    if (data)
      markerLocations.value = data.map((item, index) => ({
        ...item,
        id: index,
      }))
    globalStore.loading = false
  }

  watchEffect(async () => {
    globalStore.loading = true
    if (globalStore.source !== 'luchtpijp') return

    await fetchLuchtpijpData(globalStore.reference as LuchtpijpSource)
    globalStore.loading = false
  })

  return {
    fetchLuchtpijpData,
    dataType,
    markerLocations,
  }
})

async function fetchSensorCommunityData() {
  const data = await fetch(
    'https://maps.sensor.community/data/v2/data.dust.min.json',
  )
  const json = await data.json()
  if (!json) return
  const markers = json
    .filter((s: SensorData) => {
      const { latitude, longitude, country } = s.location

      return (
        country === 'BE' &&
        parseFloat(latitude) > 50.8 &&
        parseFloat(latitude) < 50.9 &&
        parseFloat(longitude) > 4.25 &&
        parseFloat(longitude) < 4.45
      )
    })
    .map((s: SensorData) => {
      const lat = parseFloat(s.location.latitude)
      const lon = parseFloat(s.location.longitude)
      const P1 = parseFloat(
        s.sensordatavalues.find(
          ({ value_type }: { value_type: string }) => value_type === 'P2',
        )?.value || '0',
      )

      // const P2 = parseFloat(
      //   s.sensordatavalues.find(
      //     ({ value_type }: { value_type: string }) => value_type === 'P2',
      //   )?.value || '0',
      // )
      return { lat, lon, value: P1, marker: null }
    })

  return markers
}

async function fetchIrcelineData() {
  const pm25Url =
    'https://geo.irceline.be/sos/api/v1/timeseries/?service=1&phenomenon=6001&expanded=true&force_latest_values=true&status_intervals=true&rendering_hints=true&locale=en'
  // const pm10Url =
  //   'https://geo.irceline.be/sos/api/v1/timeseries/?service=1&phenomenon=5&expanded=true&force_latest_values=true&status_intervals=true&rendering_hints=true&locale=en'

  try {
    const [pm25Response] = await Promise.all([
      fetch(pm25Url),
      // fetch(pm10Url),
    ])
    const [pm25Data] = await Promise.all([
      pm25Response.json(),
      // pm10Response.json(),
    ])

    const markers = [...pm25Data]
      .map(sensor => {
        const lat = parseFloat(sensor.station?.geometry?.coordinates[1])
        const lon = parseFloat(sensor.station?.geometry?.coordinates[0])
        const value = sensor.lastValue?.value
        const type = 'P2'
        // const type = sensor.parameters?.phenomenon?.label.includes('10')
        //   ? 'P1'
        //   : 'P2'

        if (lat > 50.8 && lat < 50.9 && lon > 4.25 && lon < 4.45) {
          return {
            lat,
            lon,
            [type]: value,
            value,
            marker: null,
          }
        }
      })
      .filter(Boolean)
    return markers
  } catch (error) {
    console.error('Error fetching Irceline data:', error)
  }
}
