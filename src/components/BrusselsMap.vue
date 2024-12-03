<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import * as L from 'leaflet'
import * as turf from '@turf/turf'
import { getColor } from '../utils/colorMap'
import type { ColorThreshold } from '@/types/Color'
import type { Marker } from '@/types/Map'

import star from '@/assets/star.svg'

const mapContainer = ref<HTMLDivElement | null>(null)
const map = ref<L.Map | null>(null)
const markers = ref<L.CircleMarker[]>([])

const props = defineProps<{
  markerLocations?: Marker[] | null
  type: string
  colors: ColorThreshold[]
}>()

function initializeMap() {
  if (map.value) return

  map.value = L.map(mapContainer.value as HTMLDivElement).setView(
    [50.85, 4.38],
    12,
  )

  L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
      minZoom: 12,
    },
  ).addTo(map.value)
}

onMounted(() => {
  initializeMap()
  loadGeoJsonMask()
})

watch(
  () => props.markerLocations,
  newLocations => {
    if (map.value && newLocations)
      renderMarkersOnMap({
        newMarkers: newLocations,
        type: props.type,
        colors: props.colors,
      })
  },
  { deep: true, immediate: true },
)

watch(
  () => props.colors,
  newColors => {
    if (map.value && props.markerLocations)
      renderMarkersOnMap({
        newMarkers: props.markerLocations,
        type: props.type,
        colors: newColors,
      })
  },
  { deep: true, immediate: true },
)

const loadGeoJsonMask = async () => {
  try {
    const response = await fetch('/src/assets/data/brussels_boundary.geojson')
    const brusselsBoundary = await response.json()

    const brusselsRegion = brusselsBoundary.features[0]
    const largeArea = turf.bboxPolygon([0, 45, 30, 65])

    const mask = turf.difference(
      turf.featureCollection([largeArea, brusselsRegion]),
    )
    if (!mask) throw new Error('Difference calculation failed')

    L.geoJSON(mask, {
      style: {
        color: '#183E91',
        fillColor: '#183E9120',
        fillOpacity: 1,
        stroke: false,
      },
    }).addTo(map.value)
  } catch (error) {
    console.error('Error loading or processing GeoJSON:', error)
  }
}

function updateMarkers({
  newMarkers,
  colors,
  type,
}: {
  newMarkers: Marker[]
  colors: ColorThreshold[]
  type: string
}) {
  const newType = props.type
  return newMarkers
    .filter(marker => !isNaN(marker.value))
    .map(marker => {
      const { value } = marker
      const color = getColor(value, colors)

      console.log({ value, newType, lat: marker.lat, lon: marker.lon })

      const popupContent = `
          <div> <strong>Location:</strong> ${[marker.lat, marker.lon]}<br> </div>
            <div> <strong>Type:</strong> ${newType}<br></div>
            <div> <strong>Value:</strong> ${value}</div>
        `
      return {
        lat: marker.lat,
        lon: marker.lon,
        color,
        popupContent,
      }
    })
}

function renderMarkersOnMap({
  newMarkers,
  type,
  colors,
}: {
  newMarkers: Marker[]
  type: string
  colors: ColorThreshold[]
}) {
  const markersConfig = updateMarkers({
    newMarkers,
    colors,
    type,
  })

  markersConfig.forEach((config, index) => {
    const isStarLocation = config.lat === 50.845813 && config.lon === 4.3579312

    const icon = L.divIcon({
      className: 'custom-star-icon',
      html: `<img src="${star}" alt="star" style="width: 24px; height: 24px;" />`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    })

    const starMarker = L.marker([config.lat, config.lon], { icon })

    if (isStarLocation)
      starMarker.addTo(map.value!).bindPopup(config.popupContent)

    const existingMarker = markers.value[index]

    if (existingMarker && !isStarLocation) {
      const currentLatLng = existingMarker.getLatLng()
      const currentColor = existingMarker.options.fillColor

      const hasPositionChanged =
        currentLatLng.lat !== config.lat || currentLatLng.lng !== config.lon

      const hasColorChanged = currentColor !== config.color

      if (hasPositionChanged || hasColorChanged) {
        if (hasPositionChanged) {
          existingMarker.setLatLng([config.lat, config.lon])
        }

        if (hasColorChanged) {
          existingMarker.setStyle({
            fillColor: config.color,
            color: config.color,
          })
        }
      }
    } else {
      const marker = L.circleMarker([config.lat, config.lon], {
        radius: 0,
        fillColor: config.color,
        color: config.color,
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
        className: 'custom-marker',
      })

      marker.addTo(map.value!).bindPopup(config.popupContent)

      setTimeout(() => {
        marker.setRadius(6)
      }, 50)
      markers.value.push(marker)
    }
  })

  if (markers.value.length > markersConfig.length) {
    const markersToRemove = markers.value.slice(markersConfig.length)

    markersToRemove.forEach(marker => {
      map.value?.removeLayer(marker)
    })
    markers.value = markers.value.slice(0, markersConfig.length)
  }
}
</script>

<style scoped>
.map-container {
  height: 1080px;
  width: 1920px;
}
.controls {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
:deep(.custom-marker) {
  transition: all 0.3s ease-in-out;
}

:deep(.leaflet-popup-content-wrapper) {
  background-color: #2f519c;
  font-size: 1rem;
  width: fit-content;
  color: white;
  padding: 0.3rem;
}

:deep(.leaflet-popup-content) {
  background-color: #2f519c;
  font-size: 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  color: white;
  padding: 0.3rem;
}
:deep(.leaflet-popup-tip) {
  background-color: #2f519c;
  color: white;
}

:deep(a.leaflet-popup-close-button) {
  color: white;
  border-bottom-color: white;
}
</style>
