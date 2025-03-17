<template>
  <div class="wrapper bg-color-primary p-sm rounded">
    <div class="sidebar rounded bg-color-blue p-md">
      <div
        v-for="(items, category) in categorizedItems"
        :key="category"
        class="category-section"
      >
        <div class="rounded-s p-xs">
          <div class="category-title font-size-body font-weight-black mb-sm">
            {{ category }}
          </div>
          <hr class="border-color-primary mb-md" />
          <div
            v-for="item in items"
            :key="item.title"
            class="sidebar-item font-size-body"
            :class="{ active: selectedTab === item.title }"
            @click="onSelectTab(item.title)"
          >
            {{ item.title }}
          </div>
        </div>
      </div>
    </div>
    <div class="pollutant-info-card bg-color-blue rounded p-sm">
      <div class="header">
        <h2 class="content-title font-size-subtitle">
          {{ selectedItem?.title }}
        </h2>
        <FButtonIcon
          name="cross"
          class="close-button"
          @click="$emit('close')"
          small
        />
      </div>
      <hr class="border-color-primary mb-md" />
      <div class="main-content">
        <p class="content-text">{{ selectedItem?.content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FButtonIcon } from 'fari-component-library'
import { computed, ref } from 'vue'

const props = defineProps<{
  items: {
    title: string
    category: string
    content: string
  }[]
}>()

const categorizedItems = computed(() => {
  return props.items.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, typeof props.items>,
  )
})

const selectedTab = ref(props.items[0]?.title || '')

const onSelectTab = (value: string) => {
  selectedTab.value = value
}

const selectedItem = computed(() =>
  props.items.find(item => item.title === selectedTab.value),
)
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  gap: 1rem;
  align-items: stretch;
  height: 40rem;
  width: 60rem;
}

.sidebar {
  width: 25%;
  color: white;
}

.category-section {
  margin-bottom: 1rem;
}

.category-title {
  font-weight: bold;
}

.category-divider {
  width: 100%;
  border: 0;
  border-top: 1px solid white;
  margin: 0.5rem 0;
}

.sidebar-item {
  cursor: pointer;
  padding: 0.5rem;
  transition: background 0.3s;
}

.sidebar-item:hover,
.sidebar-item.active {
  background: #4a8fcd80;
}

.pollutant-info-card {
  width: 75%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

// .main-content {
//   padding: 1rem;
// }

.content-title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.content-text {
  color: #64d8bf;
}
</style>
