export type SensorData = {
  id: number
  sampling_rate: number | null
  timestamp: string
  location: {
    id: number
    latitude: string
    longitude: string
    altitude: string
    country: string
    exact_location: number
    indoor: number
  }
  sensor: {
    id: number
    pin: string
    sensor_type: {
      id: number
      name: string
      manufacturer: string
    }
  }
  sensordatavalues: Array<{
    id: number
    value: string
    value_type: string
  }>
}
