<template>
  <div class="custom-radio mr-sm" :class="{ small }">
    <div class="custom-radio-checkbox" :class="{ selected }" />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{ selected: boolean; value: string | number; small?: boolean }>()
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

.small {
  width: 0.5rem;
  height: 0.5rem;

  .custom-radio-checkbox {
    padding: 0.5rem;
    position: absolute;
    top: 0.32rem;
    left: 0.32rem;
    cursor: pointer;
    background-color: #4393de;
    width: 0.1rem;
    height: 0.1rem;
    border-radius: 100px;
    transition: all 0.3s ease;
    opacity: 0;
    &.selected {
      opacity: 1;
    }
  }
}
</style>
