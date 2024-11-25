<template>
  <div class="custom-radio mr-sm">
    <div class="custom-radio-checkbox" :class="{ selected }" />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{ selected: boolean; value: string | number }>()
</script>

<style scoped lang="scss">
.custom-radio {
  padding: 10px;
  cursor: pointer;
  background-color: #2e4fbf;
  border: 2px solid #4393de;
  width: 18px;
  height: 18px;
  border-radius: 100px;
  transition: background-color 0.3s ease;
  position: relative;
}
.custom-radio-checkbox {
  padding: 10px;
  position: absolute;
  top: 5px;
  left: 5px;
  cursor: pointer;
  background-color: #4393de;
  width: 8px;
  height: 8px;
  border-radius: 100px;
  transition: all 0.3s ease;
  opacity: 0;
}

.custom-radio-checkbox.selected {
  opacity: 1;
}
</style>
