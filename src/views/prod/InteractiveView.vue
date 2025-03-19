<template>
  <div class="view">
    <FDemoAppBar color="primary" @exit="$router.push('/')">
      <AppBarTabs
        :tabs="[
          { label: 'Luchtpijp', value: 'luchtpijp' },
          { label: 'Expair', value: 'expair' },
          { label: 'Curieusenair', value: 'curieusenair' },
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
        <div class="accordion-title">
          <h2 class="color-white ml-sm font-size-subtitle">Data from</h2>
          <FButtonIcon
            name="tooltip"
            class="tooltip"
            small
            color="blue-light"
            @click="showPollutantInfo = !showPollutantInfo"
          />
        </div>
        <hr class="border-color-blue-light mr-sm ml-sm" />

        <div class="accordion-item">
          <RadioContainer
            value="irceline"
            :selected="globalStore.reference === 'irceline'"
            label="Irceline"
            @select="() => globalStore.toggleReference('irceline')"
          />
        </div>

        <div class="accordion-item">
          <RadioContainer
            :value="globalStore.source"
            :selected="globalStore.reference === globalStore.source"
            :label="globalStore.source"
            @select="globalStore.toggleReference(globalStore.source)"
          />
        </div>
      </div>

      <h3 class="ml-sm">{{ legendInfo }}</h3>
      <TransitionGroup
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
      </TransitionGroup>
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

    <FSlideTransition :show="showPollutantInfo">
      <PollutantInfoCard3
        v-if="showPollutantInfo"
        class="card"
        @close="showPollutantInfo = false"
        :items="[
          {
            title: 'PM2.5',
            category: 'pollutant',
            content: infoCards.pm2Info[locale],
          },
          {
            title: 'NO2',
            category: 'pollutant',
            content: infoCards.no2Info[locale],
          },
          {
            title: 'curieusenair',
            category: 'source',
            content: infoCards.curieusenair[locale],
          },
          {
            title: 'Luchtpijp',
            category: 'source',
            content: infoCards.luchtpijp[locale],
          },
          {
            title: 'Irceline',
            category: 'source',
            content: infoCards.ircelineInfo[locale],
          },
        ]"
      />
    </FSlideTransition>
    <div class="backdrop" :class="{ 'backdrop-active': showPollutantInfo }" />

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
import {
  FButtonIcon,
  FDemoAppBar,
  FLanguageSelector,
  FSlideTransition,
} from 'fari-component-library'
import AppBarTabs from '@/components/AppBarTabsDesktop.vue'
import RadioContainer from '@/components/RadioContainer.vue'
import { useLuchtpijpStore } from '@/stores/luchtpijp'
import { useExpairStore } from '@/stores/expair'
import { useGlobalStore } from '@/stores/global'
import { useCurieusenairStore } from '@/stores/curieusenair'
import { useDataStore } from '@/stores/cms'
import { onMounted, computed, ref } from 'vue'
import PollutantInfoCard3 from '@/components/PollutantInfoCard3.vue'

import {
  thresholdsP2,
  thresholdsWorldHealth,
  thresholdsNoNorm,
  thresholdsEuropeanCurrent,
  thresholdsEuropeanFuture,
  thresholdsEuropeanCurrentLuchtpijp,
  thresholdsEuropeanFutureLuchtpijp,
} from '../../utils/colorMap'
import { storeToRefs } from 'pinia'

import type { Norms } from '@/types/Source'

const luchtpijpStore = useLuchtpijpStore()
const expairStore = useExpairStore()
const globalStore = useGlobalStore()
const curieusenairStore = useCurieusenairStore()

const { locale } = storeToRefs(useDataStore())
const { setLocale, infoCards } = useDataStore()

const legendInfo = computed(() => {
  if (globalStore.source === 'luchtpijp') return 'Real time PM2.5 concentration'
  else if (globalStore.source === 'expair')
    return 'Mean NO2 concentration in 2023'
  else if (globalStore.source === 'curieusenair')
    return 'Mean NO2 concentration in october 2021'
  return null
})

const markerLocations = computed(() => {
  if (globalStore.source === 'luchtpijp') return luchtpijpStore.markerLocations
  else if (globalStore.source === 'expair') return expairStore.markerLocations
  else if (globalStore.source === 'curieusenair')
    return curieusenairStore.markerLocations
  return null
})

onMounted(
  async () =>
    await Promise.all([
      (luchtpijpStore.fetchLuchtpijpData('luchtpijp'),
      expairStore.fetchExpairData('expair'),
      curieusenairStore.getCurieusenairData('curieusenair')),
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

const showPollutantInfo = ref(false)
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

.card {
  position: absolute;
  top: 15%;
  left: 25%;
  z-index: 5000000;
}

.backdrop {
  visibility: hidden;
  opacity: 0;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(0);
  z-index: 0;
  transition: all 100ms;

  &-active {
    visibility: visible;
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(6px);
    transition: all 300ms;
    z-index: 4000000;
  }
}

.accordion-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 2rem;
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
  width: 400px;
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
  font-size: 1rem;
}
.expanded {
  height: 12rem;
  padding: 1.3rem;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;

  &-container {
    height: 100%;
    overflow: scroll;
  }
}

.norms {
  position: absolute;
  z-index: 20000;
  bottom: 6%;
  left: 28%;
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
  z-index: 20000;
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
  z-index: 1;
  position: absolute;
  top: 1.5rem;
  right: 9rem;
  width: fit-content;
}

:deep(.selected) {
  color: white;
}
</style>
