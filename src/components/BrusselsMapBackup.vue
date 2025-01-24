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
    const response = await fetch(
      '/demo-air-quality/src/assets/data/brussels_boundary.geojson ',
    )
    // const response = await fetch('/src/assets/data/brussels_boundary.geojson')
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
    markers.value.clearLayers()
  } else {
    markers.value = L.layerGroup().addTo(map.value!)
  }

  const markersConfig = updateMarkers({
    newMarkers,
    colors,
    type,
  })

  markersConfig.forEach(config => {
    const isStarLocation = config.lat === 50.845813 && config.lon === 4.3579312

    if (isStarLocation) {
      console.log(isStarLocation)
      const svgHtml = `
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="${config.color || '#183E91'}"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/>
      </svg>
                        `
      const icon = L.divIcon({
        className: 'custom-star-icon',
        html: svgHtml,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })

      const starMarker = L.marker([config.lat, config.lon], { icon })
      starMarker.bindPopup(config.popupContent)
      markers.value!.addLayer(starMarker)
    } else {
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
    }
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
