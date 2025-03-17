<template>
  <div class="pollutant-info-card bg-color-blue rounded p-sm">
    <div class="header">
      <AppBarTabs :tabs="tabs" @select="onSelectTab" :selected="selectedTab" />
      <FButtonIcon
        name="cross"
        class="close-button"
        @click="$emit('close')"
        small
      />
    </div>
    <hr class="border-color-primary mb-md" />
    <div class="pollutant-info-card__content font-size-body">
      <p>{{ content }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppBarTabs from '@/components/AppBarTabs.vue'
import { FButtonIcon } from 'fari-component-library'
import { computed, ref } from 'vue'
const props = defineProps<{
  items: {
    title: string
    content: string
  }[]
}>()

const tabs = computed(
  () =>
    props?.items?.map(item => ({
      label: item.title,
      value: item.title.toLowerCase().replace(' ', ''),
    })) || [],
)

const onSelectTab = (value: string) => (selectedTab.value = value)

const selectedTab = ref(tabs.value[0].value)

const content = computed(
  () =>
    props?.items?.find(
      item => item.title.toLowerCase().replace(' ', '') === selectedTab.value,
    )?.content || '',
)
</script>

<style scoped lang="scss">
.pollutant-info-card {
  display: flex;
  flex-direction: column;
  width: 40rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.wrapper) {
  display: flex;
  justify-content: center;
}

hr {
  width: 100%;
}

.pollutant-info-card__content {
  color: #64d8bf;
}
</style>
