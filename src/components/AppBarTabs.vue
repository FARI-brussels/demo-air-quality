<template>
  <div role="tablist" class="wrapper" aria-label="Data Source Tabs">
    <button
      v-for="{ value, label } in tabs"
      :key="value"
      :class="{
        'font-size-body tab': true,
        'tab--selected': value === selected,
      }"
      role="tab"
      :aria-selected="value === selected"
      @click="$emit('select', value)"
    >
      {{ label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
type Tab = {
  label: string
  value: string
}
defineProps<{ tabs: Tab[]; selected: string }>()

defineEmits<{
  (e: 'select', value: string | number): void
}>()
</script>

<style scoped lang="scss">
.wrapper {
  height: 100%;
}

.tab {
  cursor: pointer;
  padding: 10px 20px;
  background-color: transparent;
  height: 80px;
  max-height: 100%;
  border: none;
  color: white;
  font-weight: bold;
  outline: none;
  transition: all 0.3s ease-in-out;
  &--selected {
    background-color: #4a8fcd80;
  }
}
</style>
