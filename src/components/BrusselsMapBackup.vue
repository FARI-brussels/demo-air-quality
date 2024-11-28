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

const mapContainer = ref<HTMLDivElement | null>(null)
const map = ref<L.Map | null>(null)
const markers = ref<L.LayerGroup | null>(null)

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
    if (map.value && newLocations) {
      renderMarkersOnMap({
        newMarkers: newLocations,
        type: props.type,
        colors: props.colors,
      })
    }
  },
  { deep: true, immediate: true },
)

watch(
  () => props.colors,
  newColors => {
    if (map.value && props.markerLocations) {
      renderMarkersOnMap({
        newMarkers: props.markerLocations,
        type: props.type,
        colors: newColors,
      })
    }
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
  return newMarkers
    .filter(marker => !isNaN(marker.value))
    .map(marker => {
      const { value } = marker
      const color = getColor(value, colors)
      return {
        lat: marker.lat,
        lon: marker.lon,
        color,
        popupContent: `
          <strong>Sensor Location:</strong> ${[marker.lat, marker.lon]}<br>
          <strong>${type} Value:</strong> ${value}
        `,
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
  if (markers.value) {
    // Remove all existing markers from the map
    markers.value.clearLayers()
  } else {
    // Initialize the marker layer group
    markers.value = L.layerGroup().addTo(map.value!)
  }

  const markersConfig = updateMarkers({
    newMarkers,
    colors,
    type,
  })

  // Add new markers to the layer group
  markersConfig.forEach(config => {
    const marker = L.circleMarker([config.lat, config.lon], {
      radius: 6,
      fillColor: config.color,
      color: config.color,
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8,
      className: 'custom-marker',
    }).bindPopup(config.popupContent)

    markers.value!.addLayer(marker)
  })
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
</style>
