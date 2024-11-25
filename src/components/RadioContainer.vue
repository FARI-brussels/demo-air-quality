<template>
  <div class="radio-container" @click="$emit('select', value)">
    <p class="font-size-body ml-sm">{{ label }}</p>
    <RadioButton
      :selected="selected"
      value="irceline"
      class="custom-radio mr-sm"
    />
  </div>
</template>

<script setup lang="ts">
import RadioButton from './RadioButton.vue'
defineProps<{ selected: boolean; value: string | number; label: string }>()
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
</style>
