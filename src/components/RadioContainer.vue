<template>
  <div class="radio-container" @click="$emit('select', value)">
    <p class="font-size-body ml-sm" :class="{ small }">{{ label }}</p>
    <RadioButton
      :selected="selected"
      value="Ircel Celine"
      class="custom-radio mr-sm"
      :small="small"
    />
  </div>
</template>

<script setup lang="ts">
import RadioButton from './RadioButton.vue'
defineProps<{
  selected: boolean
  value: string | number
  label: string
  small?: boolean
}>()
defineEmits<{
  (e: 'select', value: string | number): void
}>()
</script>

<style scoped lang="scss">
.radio-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.small {
  font-size: 1rem;
}
</style>
