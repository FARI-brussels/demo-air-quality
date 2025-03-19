<template>
  <div
    role="tablist"
    class="wrapper"
    aria-label="Data Source Tabs"
    ref="tabListRef"
  >
    <div class="tab-indicator" :style="indicatorStyle"></div>
    <button
      v-for="{ value, label } in tabs"
      :key="value"
      :ref="el => tabRefs.set(value, el)"
      :class="{
        'rounded-s': true,
        tab: true,
        'tab--selected': value === selectedTab,
      }"
      role="tab"
      :aria-selected="value === selectedTab"
      @click="() => selectTab(value)"
    >
      {{ label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'

type Tab = {
  label: string
  value: string
}

const props = defineProps<{ tabs: Tab[]; selected: string }>()

const emit = defineEmits<{
  (e: 'select', value: string | number): void
}>()

const selectedTab = ref<string | null>(props?.selected || null)
const tabRefs = new Map<string, HTMLElement>()
const tabListRef = ref<HTMLElement | null>(null)

const indicatorStyle = ref({ width: '0px', left: '0px' })

function selectTab(value: string) {
  selectedTab.value = value
  emit('select', value)
}

watch(
  selectedTab,
  async () => {
    await nextTick()
    const tabElement = tabRefs.get(selectedTab.value || '')

    if (tabElement) {
      indicatorStyle.value = {
        width: `${tabElement.offsetWidth}px`,
        left: `${tabElement.offsetLeft}px`,
      }
    }
  },
  { immediate: true },
)

onMounted(() => {
  if (!selectedTab.value && props.tabs.length > 0) {
    selectedTab.value = props.tabs[0].value
  }
})
</script>

<style scoped lang="scss">
.wrapper {
  height: 100%;
  width: fit-content;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  position: relative;
}

.tab {
  cursor: pointer;
  padding: 0.4rem 1rem;
  background-color: transparent;
  border: none;
  color: white;
  font-weight: bold;
  outline: none;
  font-size: 1rem;
  position: relative;
  transition: all 0.3s ease-in-out;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  height: 100%;
  background-color: #4a8fcd80;
  border-radius: 0.3rem;
  transition:
    left 0.3s ease,
    width 0.3s ease;
}
</style>
