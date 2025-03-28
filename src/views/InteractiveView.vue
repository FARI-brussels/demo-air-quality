<template>
  <div class="view">
    <FDemoAppBar color="primary" @exit="$router.push('/')">
      <AppBarTabs
        :tabs="[
          { label: 'Luchtpijp', value: 'luchtpijp' },
          { label: 'ExpAir', value: 'ExpAir' },
          { label: 'CurieuzenAir', value: 'CurieuzenAir' },
        ]"
        :selected="globalStore.source"
        @select="globalStore.toggleSource"
      />
      <FLanguageSelector
        :locale="locale"
        class="language-select"
        @update:locale="setLocale"
      />
    </FDemoAppBar>

    <div class="sources bg-color-blue rounded p-sm">
      <div class="accordion bg-color-primary rounded-s">
        <h2 class="color-white ml-sm font-size-subtitle">Data from</h2>
        <hr class="border-color-blue-light mr-sm ml-sm" />

        <div class="accordion-item">
          <RadioContainer
            value="IRCEL-CELINE"
            :selected="globalStore.reference === 'IRCEL-CELINE'"
            label="IRCEL-CELINE"
            @select="() => globalStore.toggleReference('IRCEL-CELINE')"
          />
          <div
            :class="{
              'expandable p-sm font-size-body': true,
              expanded: globalStore.reference === 'IRCEL-CELINE',
            }"
          >
            <span>
              This is data from the IRCEL-CELINE source. More details will be
              displayed here based on your selection.
            </span>
          </div>
        </div>

        <div class="accordion-item">
          <RadioContainer
            :value="globalStore.source"
            :selected="globalStore.reference === globalStore.source"
            :label="globalStore.source"
            @select="globalStore.toggleReference(globalStore.source)"
          />
          <div
            :class="{
              'expandable p-sm font-size-body': true,
              expanded: globalStore.reference === globalStore.source,
            }"
          >
            <span>
              {{ infoCards?.[globalStore.source]?.[locale] }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="norms">
      <div class="segmented-control">
        <button
          v-for="{ label, value } in norms"
          :key="label"
          :class="{ 'segmented-option': true, selected: norm === value }"
          @click="norm = value"
        >
          {{ label }}
        </button>
      </div>
    </div>

    <transition-group
      name="list"
      tag="div"
      class="color-chart bg-color-blue rounded p-sm"
    >
      <div
        v-for="{ range, color } in colorChart"
        :key="color"
        class="color-item"
      >
        <div
          :style="`background-color: ${color}`"
          class="color-icon rounded"
        ></div>
        <span> {{ range }} </span>
      </div>
    </transition-group>
    <transition name="fade">
      <BrusselsMap
        :markerLocations="markerLocations"
        :colors="selectedThresholds"
        :type="globalStore?.source === 'luchtpijp' ? 'PM2.5' : 'NO2'"
      />
    </transition>
  </div>
</template>

<script setup lang="ts">
import BrusselsMap from '@/components/BrusselsMapBackup.vue'
import { FDemoAppBar, FLanguageSelector } from 'fari-component-library'
import AppBarTabs from '@/components/AppBarTabs.vue'
import RadioContainer from '@/components/RadioContainer.vue'
import { useLuchtpijpStore } from '@/stores/luchtpijp'
import { useExpairStore } from '@/stores/ExpAir'
import { useGlobalStore } from '@/stores/global'
import { useCurieusenairStore } from '@/stores/CurieuzenAir'
import { useDataStore } from '@/stores/cms'
import { onMounted, computed, ref } from 'vue'

import {
  thresholdsP2,
  thresholdsWorldHealth,
  thresholdsNoNorm,
  thresholdsEuropeanCurrent,
  thresholdsEuropeanFuture,
  thresholdsEuropeanCurrentLuchtpijp,
  thresholdsEuropeanFutureLuchtpijp,
} from '../utils/colorMap'
import { storeToRefs } from 'pinia'

import type { Norms } from '@/types/Source'

const luchtpijpStore = useLuchtpijpStore()
const ExpAirStore = useExpairStore()
const globalStore = useGlobalStore()
const CurieuzenAirStore = useCurieusenairStore()

const { locale } = storeToRefs(useDataStore())
const { setLocale, infoCards } = useDataStore()

const markerLocations = computed(() => {
  if (globalStore.source === 'luchtpijp') return luchtpijpStore.markerLocations
  else if (globalStore.source === 'ExpAir') return ExpAirStore.markerLocations
  else if (globalStore.source === 'CurieuzenAir')
    return CurieuzenAirStore.markerLocations
  return null
})

onMounted(
  async () =>
    await Promise.all([
      (luchtpijpStore.fetchLuchtpijpData('luchtpijp'),
      ExpAirStore.fetchExpairData('ExpAir'),
      CurieuzenAirStore.getCurieusenairData('CurieuzenAir')),
    ]),
)

const norms = computed(() => [
  {
    label: 'Concentrations',
    value: null as Norms,
  },
  { label: 'Current European Standard', value: 'current' as Norms },
  { label: 'European Standard 2030', value: 'future' as Norms },
  { label: 'World Health recommendations', value: 'global' as Norms },
])

const norm = ref<Norms>(null)

const thresholdsMap = computed(() => ({
  global: thresholdsWorldHealth,
  current:
    globalStore.source === 'luchtpijp'
      ? thresholdsEuropeanCurrentLuchtpijp
      : thresholdsEuropeanCurrent,
  future:
    globalStore.source === 'luchtpijp'
      ? thresholdsEuropeanFutureLuchtpijp
      : thresholdsEuropeanFuture,
  null: globalStore.source === 'luchtpijp' ? thresholdsP2 : thresholdsNoNorm,
}))

const selectedThresholds = computed(() => {
  const normValue = norm.value ?? 'null'
  return thresholdsMap.value[normValue] ?? thresholdsP2
})

const colorChart = computed(() => {
  if (!selectedThresholds.value) return null

  return selectedThresholds.value.map((item, index, array) => {
    const currentThreshold = item.threshold
    const nextThreshold = array[index + 1]?.threshold

    const range = !nextThreshold
      ? `${currentThreshold}+ µg/m3`
      : `${currentThreshold}-${nextThreshold} µg/m3`

    return { color: item.color, range }
  })
})

const textContent = {
  ExpAir: `The ExpAir data have been collected during the full year 2023 by
            Bral. There are compared here with the Irceline data collected in
            2023.You can compare both data against different
            norms/recommandatation. The current european one, the future one
            that will likely be adopted in 2025 and the world health
            organization one.The ExpAir data have been collected during the full
            year 2023 by Bral. There are compared here with the Irceline data
            collected in 2023.`,
  CurieuzenAir: `some curiusenair text`,
  luchtpijp: `some luchtpijp text`,
}
</script>

<style scoped lang="scss">
.view {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
  width: 100%;
  position: relative;
}
.app-bar {
  position: absolute;
  top: 0;
  z-index: 2000000;
}

.sources {
  position: absolute;
  z-index: 20000;
  top: 11%;
  right: 1%;
  display: flex;
  flex-direction: column;
  width: 528px;
}
.accordion-item {
  color: white;
  display: flex;
  flex-direction: column;
}

.expandable {
  background-color: #1d408b60;
  color: white;
  height: 0px;
  transition: height 200ms ease;
  overflow: hidden;
  padding: 0;
  color: #64d8bf;
}
.expanded {
  height: 360px;
  padding: 1rem;
}

.norms {
  position: absolute;
  z-index: 20000;
  bottom: 10%;
  left: 40%;
}

.segmented-control {
  display: flex;
}

.segmented-option {
  cursor: pointer;
  padding: 8px 16px;
  border: 1px solid #ccc;
  background-color: #2f519c;
  font-weight: bold;
  transition: background-color 0.3s ease;
  color: white;
  border: 1px solid #4a8fcd;
  &:first-child {
    border-top-left-radius: 25px;
    border-bottom-left-radius: 25px;
  }
  &:last-child {
    border-top-right-radius: 25px;
    border-bottom-right-radius: 25px;
  }

  &.selected {
    background-color: #4a8fcd;
  }
}

.color-chart {
  position: absolute;
  z-index: 20000;
  bottom: 4%;
  left: 4%;
}

.color-icon {
  width: 1rem;
  height: 1rem;
}

.color-item {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.2rem;
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-leave-active {
  position: absolute;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.language-select {
  z-index: -1;
  position: absolute;
  top: 1.5rem;
  right: 9rem;
}

:deep(.selected) {
  color: white;
}
</style>
