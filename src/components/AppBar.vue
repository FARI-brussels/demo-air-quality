<template>
  <header
    :class="[
      'app-bar',
      'px-xl',
      bgColor,
      {
        'py-sm dense': dense,
        transparent: !color,
        glass,
        elevated,
      },
    ]"
  >
    <div class="app-bar__nav">
      <slot name="navigation"></slot>
    </div>

    <div class="app-bar__content">
      <slot></slot>
    </div>

    <div class="app-bar__actions">
      <slot name="actions"></slot>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { FTitle } from 'fari-component-library'

interface Props {
  title?: string
  glass?: boolean
  elevated?: boolean
  color?: string
  dense?: boolean
}

const props = defineProps<Props>()

const bgColor = computed(() => props.color && `bg-color-${props.color}`)
</script>

<style lang="scss" scoped>
.app-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  width: calc(100vw - 4rem);
  height: 2rem;
  &.transparent {
    background-color: transparent;
  }
  transition:
    background-color 0.3s ease,
    opacity 0.3s ease;

  .app-bar__nav {
    display: flex;
    align-items: center;
  }

  .app-bar__title {
    text-align: center;
  }
}
</style>
